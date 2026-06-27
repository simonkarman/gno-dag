'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalking, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { createClient, createStore } from '@krmx/client-react';
import { Point, LatLng, distanceTo, fromPoint } from '@/components/geo';
import { GameMap } from '@/components/map';
import { ClientPuzzle, GameState, PUZZLE_PROXIMITY_METERS, deriveScores, derivePuzzleState } from '@/components/puzzles';

/** After a wrong (failed) answer, a puzzle's answer input is locked for this long. */
const WRONG_ANSWER_COOLDOWN_MS = 60_000;

// ---------------------------------------------------------------------------
// Krmx client + store
// ---------------------------------------------------------------------------

export const { client, useClient } = createClient();

interface Positions {
  'Govie': Point | null;
  'Jac.': Point | null;
  trails: Record<'Govie' | 'Jac.', Point[]>;
}

interface PuzzleResult {
  id: string;
  success: boolean;
  message?: string;
}

interface StoreState {
  positions: Positions;
  puzzles: ClientPuzzle[];
  lastResult: PuzzleResult | null;
  /** Per-puzzle wrong-answer lockout deadlines (puzzle id → epoch ms). In-memory only; resets on reload. */
  cooldowns: Record<string, number>;
}

export const useStore = createStore(
  client,
  {
    positions: { 'Govie': null, 'Jac.': null, trails: { 'Govie': [], 'Jac.': [] } },
    puzzles: [],
    lastResult: null,
    cooldowns: {},
  } as StoreState,
  (state, action) => {
    switch (action.type) {
      case 'positions': {
        const a = action as { type: 'positions'; payload: Positions };
        return { ...state, positions: a.payload };
      }
      case 'game-state': {
        const a = action as { type: 'game-state'; payload: GameState };
        return { ...state, puzzles: a.payload.puzzles };
      }
      case 'puzzle-result': {
        const a = action as { type: 'puzzle-result'; payload: PuzzleResult };
        // Per-puzzle wrong-answer lockout: arm on failure, clear on success.
        const cooldowns = { ...state.cooldowns };
        if (a.payload.success) {
          delete cooldowns[a.payload.id];
        } else {
          cooldowns[a.payload.id] = Date.now() + WRONG_ANSWER_COOLDOWN_MS;
        }
        return { ...state, lastResult: a.payload, cooldowns };
      }
      default:
        return state;
    }
  },
  (s) => s,
);

// ---------------------------------------------------------------------------
// Valid player names
// ---------------------------------------------------------------------------

const VALID_PLAYERS = ['Govie', 'Jac.'] as const;
type PlayerName = typeof VALID_PLAYERS[number];

const PLAYER_COLORS: Record<PlayerName, string> = {
  'Govie': '#f59e0b',
  'Jac.':  '#3b82f6',
};

// ---------------------------------------------------------------------------
// The iPad view.
//
// Since June 2026 the iPad NEVER reads GPS itself — the team's location is
// sourced from a dedicated GPS-broadcaster phone running at /gps/<player>,
// relayed through the server's `positions` broadcast. So the iPad's "where am
// I" is just `positions[self]`, converted back to lat/lng for proximity math.
// ---------------------------------------------------------------------------

function PlayerViewContent({ username, positions, puzzles, devBadge, startDatetime }: {
  username: string;
  positions: Positions;
  puzzles: ClientPuzzle[];
  devBadge?: React.ReactNode;
  startDatetime?: string;
}) {
  const self = username as PlayerName;
  const scores = useMemo(() => deriveScores(puzzles), [puzzles]);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

  // Team position from the GPS phone (via server). `null` until the phone
  // sends its first sample or after it goes out-of-range / disconnects.
  const selfPoint = positions[self];
  const currentPos: LatLng | null = useMemo(
    () => (selfPoint ? fromPoint(selfPoint) : null),
    [selfPoint],
  );

  // Puzzle the player can currently interact with: open, assigned to them, within range.
  const activePuzzle = currentPos
    ? puzzles.find(p =>
        p.assignedTo === self &&
        derivePuzzleState(p, scores[p.assignedTo]) === 'open' &&
        distanceTo(currentPos, p.location) <= PUZZLE_PROXIMITY_METERS,
      ) ?? null
    : null;

  // Reset collapse state whenever a new puzzle becomes active.
  useEffect(() => {
    setPanelCollapsed(false);
  }, [activePuzzle?.id]);

  // Waiting screen — shown regardless of location until the game starts.
  const started = useGameStarted(startDatetime);
  if (!started) {
    return <WaitingScreen devBadge={devBadge} startDatetime={startDatetime} />;
  }

  // Other nearby puzzles (within range) that are NOT the active one — shown as
  // passive info chips so the player understands what's around them. Sort so
  // your own puzzles appear at the BOTTOM of the chip stack — closer to the
  // map's active marker and visually prioritized as the actionable one.
  const nearbyChips = currentPos
    ? puzzles
        .filter(p =>
          p.id !== activePuzzle?.id &&
          distanceTo(currentPos, p.location) <= PUZZLE_PROXIMITY_METERS &&
          // Other player's puzzle (any state), or your own still-locked puzzle.
          (p.assignedTo !== self || derivePuzzleState(p, scores[p.assignedTo]) === 'locked'),
        )
        .sort((a, b) => {
          const aOwn = a.assignedTo === self ? 1 : 0;
          const bOwn = b.assignedTo === self ? 1 : 0;
          return aOwn - bOwn;
        })
    : [];

  // Puzzles whose owner is currently standing at them (open + within proximity),
  // derived from the broadcast positions of BOTH players. Their secondary
  // locations are shown to everyone, so a teammate knows where to walk.
  const activePuzzleIds = puzzles
    .filter(p => {
      if (derivePuzzleState(p, scores[p.assignedTo]) !== 'open') return false;
      const ownerPos = positions[p.assignedTo];
      if (!ownerPos) return false;
      return distanceTo(fromPoint(ownerPos), p.location) <= PUZZLE_PROXIMITY_METERS;
    })
    .map(p => p.id);

  return (
    <>
      <GameMap positions={positions} trails={positions.trails} self={self} puzzles={puzzles} scores={scores} activePuzzleIds={activePuzzleIds} />
      {/* Overlay: floats above the map */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {/* Player pill — top-right */}
        <div className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-[calc(env(safe-area-inset-right)+1rem)] pointer-events-none">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-zinc-900/75 backdrop-blur-sm border shadow-lg"
            style={{ borderColor: PLAYER_COLORS[self] + '55' }}
          >
            <FontAwesomeIcon
              icon={faPersonWalking}
              className="w-3.5 h-3.5"
              style={{ color: PLAYER_COLORS[self] }}
            />
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: PLAYER_COLORS[self] }}
            >
              {username}
            </span>
          </div>
        </div>
        {/* Scoreboard — top-left */}
        <ScoreBoard scores={scores} />
        {/* Dev badge — bottom-left, collapsed by default */}
        {devBadge && (
          <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-[calc(env(safe-area-inset-left)+1rem)] pointer-events-auto">
            {devBadge}
          </div>
        )}
      </div>
      {/* Puzzle panel — slides up when at an open puzzle */}
      {activePuzzle && (
        <PuzzlePanel
          puzzle={activePuzzle}
          collapsed={panelCollapsed}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
        />
      )}
      {/* Passive chips for nearby puzzles you can't act on right now */}
      {nearbyChips.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-10 pointer-events-none px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] flex flex-col items-center gap-2 transition-all duration-300 ease-in-out"
          style={{ marginBottom: (activePuzzle && !panelCollapsed) ? '70vh' : 0 }}
        >
          {nearbyChips.map(p => (
            <ProximityChip key={p.id} puzzle={p} self={self} score={scores[p.assignedTo]} />
          ))}
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Waiting screen — shown before START_DATETIME, regardless of location.
// ---------------------------------------------------------------------------

/** Returns true once the current time has passed `startDatetime`. */
function useGameStarted(startDatetime?: string): boolean {
  const compute = useCallback(() => {
    if (!startDatetime) return true; // no start time configured → always started
    const start = new Date(startDatetime).getTime();
    if (Number.isNaN(start)) return true;
    return Date.now() >= start;
  }, [startDatetime]);
  const [started, setStarted] = useState(compute);
  useEffect(() => {
    if (started) return;
    const id = setInterval(() => setStarted(compute()), 1000);
    return () => clearInterval(id);
  }, [started, compute]);
  return started;
}

function WaitingScreen({ devBadge, startDatetime }: { devBadge?: React.ReactNode; startDatetime?: string }) {
  const target = startDatetime ? new Date(startDatetime) : null;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  let countdown = '';
  if (target) {
    const ms = Math.max(0, target.getTime() - now);
    const s = Math.floor(ms / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    countdown = days > 0
      ? `${days}d ${pad(hours)}:${pad(mins)}:${pad(secs)}`
      : `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  }

  // Placeholder content — to be themed later.
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[70vh] px-6 text-center">
      {devBadge}
      <div className="text-5xl">⏳</div>
      <h1 className="font-bold text-2xl">GNO Dag 2026</h1>
      <p className="text-zinc-400 max-w-xs">Het avontuur is nog niet begonnen. Kom op tijd terug!</p>
      {countdown && (
        <p className="font-mono text-3xl font-bold tracking-widest text-white">{countdown}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scoreboard
// ---------------------------------------------------------------------------

function ScoreBoard({ scores }: { scores: Record<PlayerName, number> }) {
  return (
    <div className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-[calc(env(safe-area-inset-left)+1rem)] pointer-events-none">
      <div className="flex flex-col gap-1 rounded-lg px-3 py-2 bg-zinc-900/75 backdrop-blur-sm border border-zinc-700 shadow-lg text-sm font-mono">
        {(VALID_PLAYERS as readonly PlayerName[]).map((name) => (
          <div key={name} className="flex items-center justify-between gap-3">
            <span style={{ color: PLAYER_COLORS[name] }} className="font-bold">{name}</span>
            <span className="text-white font-bold">{scores[name] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Puzzle panel — content + answer input
// ---------------------------------------------------------------------------

function PuzzlePanel({ puzzle, collapsed, onToggleCollapse }: {
  puzzle: ClientPuzzle;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const { lastResult, cooldowns } = useStore();
  const [answer, setAnswer] = useState('');

  // Reset the input when switching to a different puzzle.
  useEffect(() => { setAnswer(''); }, [puzzle.id]);

  const result = lastResult && lastResult.id === puzzle.id ? lastResult : null;

  // Per-puzzle wrong-answer lockout. The deadline lives in the store keyed by
  // puzzle id, so each puzzle cools down independently and the timer survives
  // this panel remounting (e.g. walking away from the puzzle and back).
  const cooldownUntil = cooldowns[puzzle.id] ?? 0;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (Date.now() >= cooldownUntil) return;
    setNow(Date.now());
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= cooldownUntil) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const remainingMs = Math.max(0, cooldownUntil - now);
  const isCoolingDown = remainingMs > 0;
  const remainingSec = Math.ceil(remainingMs / 1000);

  const submit = () => {
    if (isCoolingDown) return;
    if (!answer.trim()) return;
    client.send({ type: 'complete-puzzle', payload: { id: puzzle.id, answer } });
  };

  return (
    <div className={`fixed inset-x-0 bottom-0 z-20 pointer-events-auto transition-transform duration-300 ease-in-out ${
      collapsed ? 'translate-y-[calc(100%-2.5rem)]' : 'translate-y-0'
    }`}>
      <div className="mx-auto max-w-md rounded-t-2xl bg-zinc-800/80 border-t border-x border-zinc-600 shadow-2xl px-5 pt-1 pb-[calc(env(safe-area-inset-bottom)+1rem)] max-h-[70vh] overflow-y-auto">
        {/* Toggle Handle Header */}
        <div className="flex justify-center mb-1">
          <button
            onClick={onToggleCollapse}
            className="w-full py-1 flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <div className="w-12 h-1 bg-zinc-600 rounded-full mb-1" />
            <FontAwesomeIcon
              icon={collapsed ? faChevronUp : faChevronDown}
              className="w-2.5 h-2.5"
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{puzzle.icon}</span>
          <h2 className="font-bold text-lg">Puzzel</h2>
        </div>

        {/* Content elements */}
        <div className="flex flex-col gap-3">
          {puzzle.content.map((el, i) => {
            if (el.type === 'text') {
              return <p key={i} className="text-zinc-200 whitespace-pre-wrap">{el.value}</p>;
            }
            if (el.type === 'image') {
              // eslint-disable-next-line @next/next/no-img-element
              return <img key={i} src={el.url} alt={el.alt ?? ''} className="rounded-lg w-full" />;
            }
            return null;
          })}
        </div>

        {/* Answer input */}
        <div className="mt-4 flex gap-2">
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            disabled={isCoolingDown}
            placeholder="Jouw antwoord..."
            className="flex-1 rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:outline-none focus:border-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={submit}
            disabled={isCoolingDown}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${isCoolingDown ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'}`}
          >
            {isCoolingDown ? `${remainingSec}s` : 'OK'}
          </button>
        </div>

        {result && !result.success && (
          <div className="mt-2 text-sm">
            <p className="text-red-400">{result.message ?? 'Fout antwoord.'}</p>
            {isCoolingDown && (
              <p className="text-zinc-400">Wacht nog {remainingSec}s voordat je het opnieuw kunt proberen.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Proximity chip — passive info for a nearby puzzle the player can't act on.
// ---------------------------------------------------------------------------

function ProximityChip({ puzzle, self, score }: { puzzle: ClientPuzzle; self: PlayerName; score: number }) {
  const state = derivePuzzleState(puzzle, score);
  const isOwn = puzzle.assignedTo === self;
  const remaining = Math.max(0, puzzle.minimumPoints - score);

  // Descriptive, perspective-aware message per state. Own open puzzles never
  // reach here (they show as the active panel), so 'open' always refers to the
  // other player's puzzle. Locked puzzles also show solve-progress.
  let message: string;
  let messageClass: string;
  let progress: string | null = null;
  if (state === 'completed') {
    message = 'Voltooid';
    messageClass = 'text-green-500';
  } else if (state === 'open') {
    message = `${puzzle.assignedTo} kan deze oplossen`;
    messageClass = 'text-white';
  } else {
    message = isOwn
      ? `Je hebt ${puzzle.minimumPoints} punten nodig voor deze puzzel, je komt er dus ${remaining} te kort!`
      : `${puzzle.assignedTo} heeft ${puzzle.minimumPoints} punten nodig voor deze puzzel, en komt er ${remaining} te kort!`;
    messageClass = 'text-zinc-400';
    progress = `${score} / ${puzzle.minimumPoints} opgelost`;
  }

  return (
    <div className="pointer-events-auto flex items-center gap-2.5 rounded-full px-4 py-2 bg-zinc-900/85 backdrop-blur-sm border border-zinc-700 shadow-lg max-w-md">
      <span className="text-xl">{puzzle.icon}</span>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-zinc-200">
          {isOwn ? 'Jouw puzzel' : `Puzzel van ${puzzle.assignedTo}`}
        </span>
        <span className={`text-xs font-medium ${messageClass}`}>{message}</span>
        {progress && (
          <span className="text-[11px] text-zinc-500">{progress}</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// iPad view — no GPS here. Position is sourced from positions[self].
// ---------------------------------------------------------------------------

function PlayerView({ username, startDatetime, isDevMode }: {
  username: string;
  startDatetime?: string;
  isDevMode: boolean;
}) {
  const { positions, puzzles } = useStore();
  return (
    <PlayerViewContent
      username={username}
      positions={positions}
      puzzles={puzzles}
      startDatetime={startDatetime}
      devBadge={isDevMode ? <DevBadge player={username as PlayerName} /> : undefined}
    />
  );
}

/**
 * Tiny dev-mode indicator. Real movement control lives on the
 * /gps/<player> beacon page now (and only there).
 */
function DevBadge({ player }: { player: PlayerName }) {
  const [open, setOpen] = useState(false);
  const gpsPath = `/gps/${player.replace('.', '').toLowerCase()}`;
  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-amber-900/50 border border-amber-700/50 text-amber-400/70 text-xs font-mono hover:bg-amber-900/70 hover:text-amber-300 transition-all cursor-pointer"
      >
        <FontAwesomeIcon icon={open ? faChevronDown : faChevronUp} className="w-2.5 h-2.5" />
        DEV
      </button>
      {open && (
        <div className="flex flex-col gap-1 rounded-lg bg-amber-900/70 border border-amber-600 px-3 py-2 text-xs text-amber-300 font-mono backdrop-blur-sm shadow-lg max-w-xs">
          <span>Geen GPS op iPad.</span>
          <span>Open <code className="text-amber-100">{gpsPath}</code> in een ander tabblad om {player} te bewegen.</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top-level client component: handles connect/link flow
// ---------------------------------------------------------------------------

export function GameClient({
  serverUrl,
  startDatetime,
  forceDev = false,
}: { serverUrl: string; startDatetime?: string; forceDev?: boolean }) {
  const isDev = process.env.NEXT_PUBLIC_LOCAL_DEVELOPMENT === 'true' || forceDev;
  const { status } = useClient();
  const [username, setUsername] = useState<string>('');
  const [failureReason, setFailureReason] = useState('');

  const isValidUsername = (VALID_PLAYERS as readonly string[]).includes(username);
  const showError = !isValidUsername && username.length >= 2;

  useEffect(() => {
    if (status === 'initializing') {
      client.connect(serverUrl).catch((e: Error) =>
        console.error('error connecting:', e.message),
      );
    }
    if (status === 'closed') {
      setFailureReason('De verbinding is verbroken. Over 5 seconden proberen we het opnieuw.');
      setTimeout(() => window.location.reload(), 5000);
    }
  }, [status, serverUrl]);

  if (status === 'connected') {
    return (
      <div className="flex flex-col items-center text-center gap-3 mt-12 px-4">
        <h1 className="font-bold text-2xl">GNO Dag 2026</h1>
        <p className="text-zinc-400">Wie ben jij?</p>
        <div className="flex gap-3 mt-2">
          {VALID_PLAYERS.map((name) => (
            <button
              key={name}
              className="px-6 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 font-bold text-lg transition-colors"
              onClick={() => {
                setUsername(name);
                client.link(name).catch((e: Error) => {
                  console.error('error linking:', e.message);
                  setFailureReason(e.message);
                });
              }}
            >
              {name}
            </button>
          ))}
        </div>
        {showError && (
          <p className="text-red-400 text-sm">Kies je eigen naam.</p>
        )}
        {failureReason && (
          <p className="text-red-400 text-sm">{failureReason}</p>
        )}
      </div>
    );
  }

  if (status === 'linked') {
    return <PlayerView username={username} startDatetime={startDatetime} isDevMode={isDev} />;
  }

  if (status === 'closed') {
    return (
      <>
        <p className="p-4 text-center">Oops, er ging iets mis.</p>
        <pre className="text-center text-sm bg-red-900 border-y border-red-600 py-2 px-4 font-bold">
          {failureReason}
        </pre>
      </>
    );
  }

  return <p className="p-4 text-center text-zinc-400">Verbinding maken...</p>;
}
