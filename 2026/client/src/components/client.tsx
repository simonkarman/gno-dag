'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalking, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { createClient, createStore } from '@krmx/client-react';
import { Point, isInRange, LatLng, distanceTo, formatDistance, HOUSE } from '@/components/geo';
import { GameMap } from '@/components/map';
import { useGeolocation } from '@/hooks/use-geolocation';
import { useSimulatedLocation } from '@/hooks/use-simulated-location';

const isDev = process.env.NEXT_PUBLIC_LOCAL_DEVELOPMENT === 'true';

// ---------------------------------------------------------------------------
// Krmx client + store
// ---------------------------------------------------------------------------

export const { client, useClient } = createClient();

interface Positions {
  'Govie': Point | null;
  'Jac.': Point | null;
}

export const useStore = createStore(
  client,
  { positions: { 'Govie': null, 'Jac.': null } } as { positions: Positions },
  (state, action) => {
    switch (action.type) {
      case 'positions': {
        const a = action as { type: 'positions'; payload: Positions };
        return { ...state, positions: a.payload };
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

function PlayerViewContent({ username, positions, inRange, currentPos, devBadge }: {
  username: string;
  positions: Positions;
  inRange: boolean | null;
  currentPos: LatLng | null;
  devBadge?: React.ReactNode;
}) {
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

  return (
    <>
      <GameMap positions={positions} self={username as PlayerName} />
      {/* Overlay: floats above the map */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        {/* Player pill — top-right */}
        <div className="absolute top-4 right-4 pointer-events-none">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-zinc-900/75 backdrop-blur-sm border shadow-lg"
            style={{ borderColor: PLAYER_COLORS[username as PlayerName] + '55' }}
          >
            <FontAwesomeIcon
              icon={faPersonWalking}
              className="w-3.5 h-3.5"
              style={{ color: PLAYER_COLORS[username as PlayerName] }}
            />
            <span
              className="text-sm font-bold tracking-wide"
              style={{ color: PLAYER_COLORS[username as PlayerName] }}
            >
              {username}
            </span>
          </div>
        </div>
        {/* Dev badge — bottom-left, collapsed by default */}
        {devBadge && (
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            {devBadge}
          </div>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Production view: real GPS only
// ---------------------------------------------------------------------------

function PlayerView({ username }: { username: string }) {
  const { positions } = useStore();
  const { inRange, currentPos, handlePosition } = usePositionHandler();

  useGeolocation(handlePosition);

  return <PlayerViewContent username={username} positions={positions} inRange={inRange} currentPos={currentPos} />;
}

// ---------------------------------------------------------------------------
// Dev view: simulated location + toggle to real GPS
// ---------------------------------------------------------------------------

function DevPlayerView({ username }: { username: string }) {
  const { positions } = useStore();
  const [useReal, setUseReal] = useState(false);
  const { inRange, currentPos, handlePosition } = usePositionHandler();

  const { pos: simPos, reset: resetSimPos, move } = useSimulatedLocation(useReal ? () => {} : handlePosition);
  useGeolocation(useReal ? handlePosition : () => {});

  return (
    <PlayerViewContent
      username={username}
      positions={positions}
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
