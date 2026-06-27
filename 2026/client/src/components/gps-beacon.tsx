'use client';

import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { createClient, createStore } from '@krmx/client-react';
import { LatLng, Point, isInRange, fromPoint, HOUSE } from '@/components/geo';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useSimulatedLocation } from '@/hooks/use-simulated-location';
import { useWakeLock } from '@/hooks/use-wake-lock';

/**
 * GPS broadcaster page.
 *
 * Runs on the team's phone at /gps/<player>. The phone authenticates to the
 * server with the `-gps` suffixed username (e.g. `Govie-gps`); the server
 * routes its `location` / `clear-location` messages to the base player's
 * position record. The phone shows no map and no puzzles — it is purely a
 * beacon, kept awake with the Wake Lock API.
 *
 * In dev mode the simulator replaces real GPS so you can test the full data
 * flow without a real GPS chip.
 */

const PLAYER_COLORS: Record<'Govie' | 'Jac.', string> = {
  'Govie': '#f59e0b',
  'Jac.':  '#3b82f6',
};

const PRIMARY_DEFAULT_URL = 'ws://localhost:8082/krmx?version=0.0.1';

// A separate, dedicated Krmx client instance for the beacon page. We do NOT
// reuse the one exported from `client.tsx` — that instance is the iPad's
// client, and importing it here would pull in the iPad's whole render tree
// (and worse: try to link with the iPad's username on the same connection).
const { client, useClient } = createClient();

/** Minimal store: only the resume position is needed (for the dev simulator). */
const useStore = createStore(
  client,
  { lastPosition: undefined as Point | null | undefined },
  (state, action) => {
    if (action.type === 'last-position') {
      const a = action as { type: 'last-position'; payload: Point | null };
      return { ...state, lastPosition: a.payload };
    }
    return state;
  },
  (s) => s,
);

export function GpsBeacon({
  player,
  serverUrl = PRIMARY_DEFAULT_URL,
  forceDev = false,
}: {
  /** The base player name this phone broadcasts for. */
  player: 'Govie' | 'Jac.';
  /** Krmx WebSocket URL. Defaults to the primary instance. */
  serverUrl?: string;
  /** Force dev mode (simulated GPS via arrow keys). */
  forceDev?: boolean;
}) {
  const isDev = process.env.NEXT_PUBLIC_LOCAL_DEVELOPMENT === 'true' || forceDev;
  const username = `${player}-gps` as const;

  const { status } = useClient();
  const wakeStatus = useWakeLock();
  const [failureReason, setFailureReason] = useState('');

  // (Re)connect on initialise; auto-reload after a disconnect so the beacon
  // recovers on its own without anyone touching the phone.
  useEffect(() => {
    if (status === 'initializing') {
      client.connect(serverUrl).catch((e: Error) =>
        console.error('[gps-beacon] connect error:', e.message),
      );
    }
    if (status === 'closed') {
      setFailureReason('Verbinding verbroken. Over 5 seconden opnieuw proberen.');
      setTimeout(() => window.location.reload(), 5000);
    }
  }, [status, serverUrl]);

  // Auto-link as soon as we're connected — no UI choice needed, the URL fully
  // determines the identity.
  useEffect(() => {
    if (status === 'connected') {
      client.link(username).catch((e: Error) => {
        console.error('[gps-beacon] link error:', e.message);
        setFailureReason(e.message);
      });
    }
  }, [status, username]);

  if (status !== 'linked') {
    return (
      <Layout player={player} subtitle="Verbinden..." dot="amber" wakeStatus={wakeStatus} isDev={isDev}>
        {failureReason && <p className="text-red-400 text-sm mt-2">{failureReason}</p>}
      </Layout>
    );
  }

  // Once linked, hand off to a child that owns the GPS subscription so we
  // don't request location until we can actually broadcast it.
  return <LinkedBeacon player={player} isDev={isDev} wakeStatus={wakeStatus} />;
}

// ---------------------------------------------------------------------------
// Linked: actually subscribe to GPS (or the dev simulator) and broadcast.
// ---------------------------------------------------------------------------

function LinkedBeacon({ player, isDev, wakeStatus }: {
  player: 'Govie' | 'Jac.';
  isDev: boolean;
  wakeStatus: ReturnType<typeof useWakeLock>;
}) {
  const { lastPosition } = useStore();
  const [pos, setPos] = useState<LatLng | null>(null);
  const [inRange, setInRange] = useState<boolean | null>(null);
  const inRangeRef = useRef<boolean | null>(null);
  const [sentCount, setSentCount] = useState(0);

  // Single position handler reused for both real GPS and the simulator. Sends
  // `location` when in range, `clear-location` once on every in→out transition.
  const handlePosition = (next: LatLng) => {
    const nowInRange = isInRange(next);
    setPos(next);
    if (inRangeRef.current === true && !nowInRange) {
      client.send({ type: 'clear-location' });
    }
    inRangeRef.current = nowInRange;
    setInRange(nowInRange);
    if (nowInRange) {
      client.send({ type: 'location', payload: next });
      setSentCount(c => c + 1);
    }
  };

  // Dev mode: simulator replaces real GPS. Real GPS is NEVER requested in dev.
  const resumeReady = lastPosition !== undefined;
  const resume = {
    ready: resumeReady,
    position: resumeReady ? (lastPosition ? fromPoint(lastPosition) : HOUSE) : null,
  };
  const sim = useSimulatedLocation(isDev ? handlePosition : () => {}, isDev ? resume : undefined);

  // Production: real GPS. Only active when NOT in dev mode.
  useGeolocation(isDev ? () => {} : handlePosition);

  const subtitle = (() => {
    if (inRange === null) return isDev ? 'Wachten op simulatie...' : 'GPS ophalen...';
    if (!inRange) return 'Buiten het spelgebied';
    return 'Broadcasting';
  })();
  const dotColor: 'green' | 'amber' | 'red' = (() => {
    if (inRange === null) return 'amber';
    return inRange ? 'green' : 'amber';
  })();

  return (
    <Layout player={player} subtitle={subtitle} dot={dotColor} wakeStatus={wakeStatus} isDev={isDev}>
      <div className="mt-6 flex flex-col items-center gap-1 text-xs text-zinc-500 font-mono">
        <span>{sentCount} updates verstuurd</span>
        {pos && <span>{pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}</span>}
      </div>
      {isDev && (
        <DevControls
          simPos={sim.pos}
          onReset={sim.reset}
          onMove={sim.move}
          stepMeters={sim.stepMeters}
          onStepChange={sim.setStepMeters}
        />
      )}
    </Layout>
  );
}

// ---------------------------------------------------------------------------
// Layout shell — big team name + status line + wake-lock indicator.
// ---------------------------------------------------------------------------

function Layout({
  player,
  subtitle,
  dot,
  wakeStatus,
  isDev,
  children,
}: {
  player: 'Govie' | 'Jac.';
  subtitle: string;
  dot: 'green' | 'amber' | 'red';
  wakeStatus: ReturnType<typeof useWakeLock>;
  isDev: boolean;
  children?: React.ReactNode;
}) {
  const dotClass = {
    green: 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]',
    amber: 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]',
    red:   'bg-red-500   shadow-[0_0_12px_rgba(239,68,68,0.8)]',
  }[dot];

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
      {isDev && (
        <div className="absolute top-[calc(env(safe-area-inset-top)+0.5rem)] left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-900/40 border border-amber-700/50 rounded px-2 py-0.5">dev mode</span>
        </div>
      )}

      <div
        className="text-6xl font-bold tracking-tight"
        style={{ color: PLAYER_COLORS[player] }}
      >
        {player}
      </div>
      <div className="mt-2 text-sm text-zinc-400 uppercase tracking-widest">GPS beacon</div>

      <div className="mt-10 flex items-center gap-3">
        <span className={`inline-block w-3 h-3 rounded-full ${dotClass} ${dot === 'green' ? 'animate-pulse' : ''}`} />
        <span className="text-lg text-zinc-200">{subtitle}</span>
      </div>

      <WakeLockIndicator status={wakeStatus} />

      {children}

      <p className="absolute bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-0 right-0 text-[11px] text-zinc-600 px-6">
        Laat deze pagina open staan en de telefoon ontgrendeld. Deze pagina
        broadcast alleen de GPS-locatie voor team <strong style={{ color: PLAYER_COLORS[player] }}>{player}</strong>.
      </p>
    </main>
  );
}

function WakeLockIndicator({ status }: { status: ReturnType<typeof useWakeLock> }) {
  const message = (() => {
    switch (status) {
      case 'active':      return '✓ Scherm blijft aan';
      case 'acquiring':   return 'Scherm-lock aanvragen...';
      case 'released':    return 'Scherm-lock vrijgegeven (wordt automatisch opnieuw aangevraagd)';
      case 'unsupported': return '⚠ Zet auto-lock uit in de instellingen';
      case 'error':       return '⚠ Scherm-lock mislukt — zet auto-lock uit in de instellingen';
    }
  })();
  const color = status === 'active' ? 'text-zinc-500' : 'text-amber-400';
  return <p className={`mt-3 text-xs ${color}`}>{message}</p>;
}

// ---------------------------------------------------------------------------
// Dev controls — arrow buttons + step-size input. Mirrors the DevBadge in
// client.tsx but kept local here so the GPS page never imports any iPad code.
// ---------------------------------------------------------------------------

function DevControls({
  simPos,
  onReset,
  onMove,
  stepMeters,
  onStepChange,
}: {
  simPos: LatLng;
  onReset: () => void;
  onMove: (dir: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight', fine?: boolean) => void;
  stepMeters: number;
  onStepChange: (meters: number) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-amber-900/50 border border-amber-700/50 text-amber-400/80 text-xs font-mono hover:bg-amber-900/70 hover:text-amber-300 transition-all cursor-pointer"
      >
        <FontAwesomeIcon icon={open ? faChevronDown : faChevronUp} className="w-2.5 h-2.5" />
        DEV
      </button>
      {open && (
        <div className="flex flex-col items-center gap-2 rounded-lg bg-amber-900/70 border border-amber-600 px-4 py-3 text-xs text-amber-300 font-mono backdrop-blur-sm shadow-lg">
          <div className="text-amber-200">
            {simPos.lat.toFixed(6)}, {simPos.lng.toFixed(6)}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="dev-step">stap (m)</label>
            <input
              id="dev-step"
              type="number"
              min={0.5}
              step={0.5}
              value={stepMeters}
              onChange={(e) => {
                const v = Number(e.target.value);
                onStepChange(Number.isFinite(v) ? Math.max(0.5, v) : 0.5);
              }}
              className="w-16 rounded bg-amber-950/60 border border-amber-700 px-1.5 py-0.5 text-amber-100 focus:outline-none focus:border-amber-400"
            />
            <span className="text-amber-500/80">Shift = 1/10</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button className="flex items-center justify-center rounded bg-amber-800/60 hover:bg-amber-700/60 active:bg-amber-600/60 px-4 py-2 cursor-pointer" onClick={(e) => onMove('ArrowUp', e.shiftKey)}>↑</button>
            <div />
            <button className="flex items-center justify-center rounded bg-amber-800/60 hover:bg-amber-700/60 active:bg-amber-600/60 px-4 py-2 cursor-pointer" onClick={(e) => onMove('ArrowLeft', e.shiftKey)}>←</button>
            <button className="flex items-center justify-center rounded bg-amber-800/60 hover:bg-amber-700/60 active:bg-amber-600/60 px-4 py-2 cursor-pointer" onClick={(e) => onMove('ArrowDown', e.shiftKey)}>↓</button>
            <button className="flex items-center justify-center rounded bg-amber-800/60 hover:bg-amber-700/60 active:bg-amber-600/60 px-4 py-2 cursor-pointer" onClick={(e) => onMove('ArrowRight', e.shiftKey)}>→</button>
          </div>
          <button
            className="underline hover:text-amber-100 transition-colors cursor-pointer"
            onClick={onReset}
          >
            reset
          </button>
        </div>
      )}
    </div>
  );
}
