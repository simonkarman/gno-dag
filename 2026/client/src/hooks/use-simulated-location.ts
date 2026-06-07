'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LatLng } from '@/components/geo';

/** Starting position: the house of Jac. and Govie. */
const START: LatLng = { lat: 52.07732828333311, lng: 4.749337088821905 };

/**
 * One metre expressed in degrees.
 * 1 degree lat ≈ 111 320 m
 * 1 degree lng ≈ 111 320 * cos(52°) m
 */
const DEG_LAT_PER_M = 1 / 111320;
const DEG_LNG_PER_M = 1 / (111320 * Math.cos((52 * Math.PI) / 180));

/** Default step size in metres for a single arrow-key press. */
const DEFAULT_STEP_METERS = 10;

type Direction = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

/**
 * Resume info for the simulator, sourced from the server's `last-position`
 * message (relayed via the store). `ready` flips true once that message has
 * arrived; `position` is where to resume (or null when the server has no prior
 * position, in which case we keep the house default).
 */
export interface SimulatorResume {
  ready: boolean;
  position: LatLng | null;
}

/**
 * Development-only hook that simulates GPS movement via arrow keys.
 *
 * Starts at the house of Jac. and Govie. Each arrow-key press moves the
 * simulated position by `stepMeters` (configurable). Holding Shift while moving
 * uses a fine step of 1/10th of `stepMeters`.
 *
 * Broadcasting is gated on `resume`: until the server has told us where the
 * player left off, the hook stays silent (so a reload doesn't broadcast the
 * house and draw a spurious jump in the trail). Once resume info arrives it
 * seeds itself from it — resuming exactly where you left off, or keeping the
 * house default when there's no prior position — and then broadcasts `pos` on
 * every change. Omitting `resume` arms broadcasting immediately (no gating).
 */
export function useSimulatedLocation(onPosition: (pos: LatLng) => void, resume?: SimulatorResume) {
  const [pos, setPos] = useState<LatLng>(START);
  const [armed, setArmed] = useState(false);
  const [stepMeters, setStepMeters] = useState<number>(DEFAULT_STEP_METERS);

  const onPositionRef = useRef(onPosition);
  useEffect(() => { onPositionRef.current = onPosition; });

  // Keep the latest step in a ref so the stable key handler always sees it.
  const stepRef = useRef(stepMeters);
  useEffect(() => { stepRef.current = stepMeters; }, [stepMeters]);

  // Seed from the server's last-known position, then arm broadcasting. Until
  // armed we never call `onPosition`, so the house is not broadcast on (re)join.
  useEffect(() => {
    if (armed) return;
    if (resume === undefined) { setArmed(true); return; } // no gating requested
    if (!resume.ready) return;                            // still waiting for the server
    if (resume.position) setPos(resume.position);         // resume where we left off
    setArmed(true);
  }, [armed, resume]);

  // Broadcast every position change, but only once armed.
  useEffect(() => {
    if (!armed) return;
    onPositionRef.current(pos);
  }, [pos, armed]);

  const reset = useCallback(() => setPos(START), []);

  const move = useCallback((dir: Direction, fine = false) => {
    const meters = (fine ? stepRef.current / 10 : stepRef.current);
    const dLat = meters * DEG_LAT_PER_M;
    const dLng = meters * DEG_LNG_PER_M;
    setPos((prev) => {
      switch (dir) {
        case 'ArrowUp':    return { ...prev, lat: prev.lat + dLat };
        case 'ArrowDown':  return { ...prev, lat: prev.lat - dLat };
        case 'ArrowLeft':  return { ...prev, lng: prev.lng - dLng };
        case 'ArrowRight': return { ...prev, lng: prev.lng + dLng };
      }
    });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        move(e.key as Direction, e.shiftKey);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  return { pos, reset, move, stepMeters, setStepMeters };
}
