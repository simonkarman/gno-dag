'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalking, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { createClient, createStore } from '@krmx/client-react';
import { Point, isInRange, LatLng, distanceTo, formatDistance, HOUSE } from '@/components/geo';
import { GameMap } from '@/components/map';
import { ClientPuzzle, GameState, PUZZLE_PROXIMITY_METERS, deriveScores, derivePuzzleState } from '@/components/puzzles';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useSimulatedLocation } from '@/hooks/use-simulated-location';

const isDev = process.env.NEXT_PUBLIC_LOCAL_DEVELOPMENT === 'true';
const START_DATETIME = process.env.NEXT_PUBLIC_START_DATETIME ?? '';

// ---------------------------------------------------------------------------
// Krmx client + store
// ---------------------------------------------------------------------------

export const { client, useClient } = createClient();

interface Positions {
  'Govie': Point | null;
  'Jac.': Point | null;
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
}

export const useStore = createStore(
  client,
  {
    positions: { 'Govie': null, 'Jac.': null },
    puzzles: [],
    lastResult: null,
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
        return { ...state, lastResult: a.payload };
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
// Shared: build a position handler that sends location updates to the server
// ---------------------------------------------------------------------------

function usePositionHandler() {
  const [inRange, setInRange] = useState<boolean | null>(null);
  const [currentPos, setCurrentPos] = useState<LatLng | null>(null);
  const inRangeRef = useRef<boolean | null>(null);

  const handlePosition = useCallback((pos: LatLng) => {
    const nowInRange = isInRange(pos);
    setCurrentPos(pos);
    if (inRangeRef.current === true && !nowInRange) {
      client.send({ type: 'clear-location' });
    }
    inRangeRef.current = nowInRange;
    setInRange(nowInRange);
    if (nowInRange) {
      client.send({ type: 'location', payload: pos });
    }
  }, []);

  return { inRange, currentPos, handlePosition };
}

// ---------------------------------------------------------------------------
// Shared render tree for both production and dev views
// ---------------------------------------------------------------------------

function PlayerViewContent({ username, positions, puzzles, inRange, currentPos, devBadge }: {
  username: string;
  positions: Positions;
  puzzles: ClientPuzzle[];
  inRange: boolean | null;
  currentPos: LatLng | null;
  devBadge?: React.ReactNode;
}) {
  const self = username as PlayerName;
  const scores = useMemo(() => deriveScores(puzzles), [puzzles]);

  // Waiting screen — shown regardless of location until the game starts.
  const started = useGameStarted();
  if (!started) {
    return <WaitingScreen devBadge={devBadge} />;
  }

  if (inRange === null) {
    return (
      <div className="flex flex-col items-center gap-3 mt-12 px-4 text-center">
        <p className="text-zinc-400">Locatie ophalen...</p>
      </div>
    );
  }

  if (!inRange) {
    const distance = currentPos ? distanceTo(currentPos, HOUSE) : null;
    return (
      <div className="flex flex-col items-center gap-4 mt-12 px-6 text-center">
        {devBadge}
        <div className="text-4xl">📍</div>
        <h2 className="font-bold text-xl">Je bent er nog niet!</h2>
        <p className="text-zinc-400 max-w-xs">
          Je bevindt je nog niet op de juiste locatie. Ga naar het huis van Jac. en Govie om te beginnen.
        </p>
        {distance !== null && (
          <p className="text-zinc-300 font-mono text-sm">
            Afstand: <span className="font-bold text-white">{formatDistance(distance)}</span>
          </p>
        )}
      </div>
    );
  }

  // Puzzle the player can currently interact with: open, assigned to them, within range.
  const activePuzzle = currentPos
    ? puzzles.find(p =>
        p.assignedTo === self &&
        derivePuzzleState(p, scores[p.assignedTo]) === 'open' &&
        distanceTo(currentPos, p.location) <= PUZZLE_PROXIMITY_METERS,
      ) ?? null
    : null;

  return (
    <>
      <GameMap positions={positions} self={self} puzzles={puzzles} scores={scores} activePuzzleId={activePuzzle?.id ?? null} />
      {/* Overlay: floats above the map */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {/* Player pill — top-right */}
        <div className="absolute top-4 right-4 pointer-events-none">
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
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            {devBadge}
          </div>
        )}
      </div>
      {/* Puzzle panel — slides up when at an open puzzle */}
      {activePuzzle && <PuzzlePanel puzzle={activePuzzle} />}
    </>
  );
}

// ---------------------------------------------------------------------------
// Waiting screen — shown before START_DATETIME, regardless of location.
// ---------------------------------------------------------------------------

/** Returns true once the current time has passed START_DATETIME. */
function useGameStarted(): boolean {
  const compute = () => {
    if (!START_DATETIME) return true; // no start time configured → always started
    const start = new Date(START_DATETIME).getTime();
    if (Number.isNaN(start)) return true;
    return Date.now() >= start;
  };
  const [started, setStarted] = useState(compute);
  useEffect(() => {
    if (started) return;
    const id = setInterval(() => setStarted(compute()), 1000);
    return () => clearInterval(id);
  }, [started]);
  return started;
}

function WaitingScreen({ devBadge }: { devBadge?: React.ReactNode }) {
  const target = START_DATETIME ? new Date(START_DATETIME) : null;
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
    <div className="absolute top-4 left-4 pointer-events-none">
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

function PuzzlePanel({ puzzle }: { puzzle: ClientPuzzle }) {
  const { lastResult } = useStore();
  const [answer, setAnswer] = useState('');

  // Reset the input when switching to a different puzzle.
  useEffect(() => { setAnswer(''); }, [puzzle.id]);

  const result = lastResult && lastResult.id === puzzle.id ? lastResult : null;

  const submit = () => {
    if (!answer.trim()) return;
    client.send({ type: 'complete-puzzle', payload: { id: puzzle.id, answer } });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 pointer-events-auto">
      <div className="mx-auto max-w-md rounded-t-2xl bg-zinc-800 border-t border-x border-zinc-600 shadow-2xl px-5 py-4 max-h-[70vh] overflow-y-auto">
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
            placeholder="Jouw antwoord..."
            className="flex-1 rounded-lg bg-zinc-900 border border-zinc-600 px-3 py-2 text-white focus:outline-none focus:border-zinc-400"
          />
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 font-bold transition-colors"
          >
            OK
          </button>
        </div>

        {result && !result.success && (
          <p className="mt-2 text-red-400 text-sm">{result.message ?? 'Fout antwoord.'}</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Production view: real GPS only
// ---------------------------------------------------------------------------

function PlayerView({ username }: { username: string }) {
  const { positions, puzzles } = useStore();
  const { inRange, currentPos, handlePosition } = usePositionHandler();

  useGeolocation(handlePosition);

  return <PlayerViewContent username={username} positions={positions} puzzles={puzzles} inRange={inRange} currentPos={currentPos} />;
}

// ---------------------------------------------------------------------------
// Dev view: simulated location + toggle to real GPS
// ---------------------------------------------------------------------------

function DevPlayerView({ username }: { username: string }) {
  const { positions, puzzles } = useStore();
  const [useReal, setUseReal] = useState(false);
  const { inRange, currentPos, handlePosition } = usePositionHandler();

  const { pos: simPos, reset: resetSimPos, move } = useSimulatedLocation(useReal ? () => {} : handlePosition);
  useGeolocation(useReal ? handlePosition : () => {});

  return (
    <PlayerViewContent
      username={username}
      positions={positions}
      puzzles={puzzles}
      inRange={inRange}
      currentPos={currentPos}
      devBadge={<DevBadge useReal={useReal} simPos={simPos} onToggle={() => setUseReal(r => !r)} onReset={resetSimPos} onMove={move} />}
    />
  );
}

function DevBadge({ useReal, simPos, onToggle, onReset, onMove }: {
  useReal: boolean;
  simPos: LatLng;
  onToggle: () => void;
  onReset: () => void;
  onMove: (dir: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-2">
      {/* Collapsed toggle — always visible */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-amber-900/50 border border-amber-700/50 text-amber-400/70 text-xs font-mono hover:bg-amber-900/70 hover:text-amber-300 transition-all cursor-pointer"
      >
        <FontAwesomeIcon icon={open ? faChevronDown : faChevronUp} className="w-2.5 h-2.5" />
        DEV
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="flex flex-col gap-2 rounded-lg bg-amber-900/70 border border-amber-600 px-3 py-2 text-xs text-amber-300 font-mono backdrop-blur-sm shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            {useReal ? (
              <span>echte GPS</span>
            ) : (
              <span>{simPos.lat.toFixed(6)}, {simPos.lng.toFixed(6)}</span>
            )}
            <span className="text-amber-500">·</span>
            <button
              className="underline hover:text-amber-100 transition-colors cursor-pointer"
              onClick={onToggle}
            >
              {useReal ? 'gebruik simulatie' : 'gebruik echte GPS'}
            </button>
            {!useReal && (
              <>
                <span className="text-amber-500">·</span>
                <button
                  className="underline hover:text-amber-100 transition-colors cursor-pointer"
                  onClick={onReset}
                >
                  reset
                </button>
              </>
            )}
          </div>
          {!useReal && (
            <div className="grid grid-cols-3 gap-1">
              <div />
              <button className="flex items-center justify-center rounded bg-amber-800/60 hover:bg-amber-700/60 active:bg-amber-600/60 px-3 py-1 cursor-pointer" onClick={() => onMove('ArrowUp')}>↑</button>
              <div />
              <button className="flex items-center justify-center rounded bg-amber-800/60 hover:bg-amber-700/60 active:bg-amber-600/60 px-3 py-1 cursor-pointer" onClick={() => onMove('ArrowLeft')}>←</button>
              <button className="flex items-center justify-center rounded bg-amber-800/60 hover:bg-amber-700/60 active:bg-amber-600/60 px-3 py-1 cursor-pointer" onClick={() => onMove('ArrowDown')}>↓</button>
              <button className="flex items-center justify-center rounded bg-amber-800/60 hover:bg-amber-700/60 active:bg-amber-600/60 px-3 py-1 cursor-pointer" onClick={() => onMove('ArrowRight')}>→</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top-level client component: handles connect/link flow
// ---------------------------------------------------------------------------

export function GameClient({ serverUrl }: { serverUrl: string }) {
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
    return isDev
      ? <DevPlayerView username={username} />
      : <PlayerView username={username} />;
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
