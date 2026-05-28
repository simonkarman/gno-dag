'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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
// Production view: real GPS only
// ---------------------------------------------------------------------------

function PlayerView({ username }: { username: string }) {
  const { positions } = useStore();
  const { inRange, currentPos, handlePosition } = usePositionHandler();

  useGeolocation(handlePosition);

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
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-sm text-zinc-400">
        Speler: <span className="font-bold text-zinc-200">{username}</span>
      </p>
      <GameMap positions={positions} self={username as PlayerName} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dev view: simulated location + toggle to real GPS
// ---------------------------------------------------------------------------

function DevPlayerView({ username }: { username: string }) {
  const { positions } = useStore();
  const [useReal, setUseReal] = useState(false);
  const { inRange, currentPos, handlePosition } = usePositionHandler();

  const { pos: simPos, reset: resetSimPos } = useSimulatedLocation(useReal ? () => {} : handlePosition);
  useGeolocation(useReal ? handlePosition : () => {});

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
        <DevBadge useReal={useReal} simPos={simPos} onToggle={() => setUseReal(r => !r)} onReset={resetSimPos} />
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
    <div className="flex flex-col items-center gap-4 p-4">
      <DevBadge useReal={useReal} simPos={simPos} onToggle={() => setUseReal(r => !r)} onReset={resetSimPos} />
      <p className="text-sm text-zinc-400">
        Speler: <span className="font-bold text-zinc-200">{username}</span>
      </p>
      <GameMap positions={positions} self={username as PlayerName} />
      <div className="text-xs text-zinc-500 font-mono space-y-1 text-center">
        {(['Govie', 'Jac.'] as PlayerName[]).map((name) => {
          const p = positions[name];
          return (
            <p key={name}>
              {name}: {p ? `(${p.x.toFixed(3)}, ${p.y.toFixed(3)})` : 'wacht...'}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function DevBadge({ useReal, simPos, onToggle, onReset }: {
  useReal: boolean;
  simPos: LatLng;
  onToggle: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md bg-amber-900/60 border border-amber-600 px-3 py-1 text-xs text-amber-300 font-mono">
      <span>DEV</span>
      <span className="text-amber-500">·</span>
      {useReal ? (
        <span>echte GPS</span>
      ) : (
        <span>↑ ↓ ← → to move · {simPos.lat.toFixed(6)}, {simPos.lng.toFixed(6)}</span>
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
