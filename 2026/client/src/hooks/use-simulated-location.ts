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
 * Development-only hook that simulates GPS movement via arrow keys.
 *
 * Starts at the house of Jac. and Govie. Each arrow-key press moves the
 * simulated position by `stepMeters` (configurable). Holding Shift while moving
 * uses a fine step of 1/10th of `stepMeters`.
 *
 * Calls `onPosition` immediately with the initial position, then on every
 * key-driven update.
 */
export function useSimulatedLocation(onPosition: (pos: LatLng) => void) {
  const [pos, setPos] = useState<LatLng>(START);
  const [stepMeters, setStepMeters] = useState<number>(DEFAULT_STEP_METERS);

  const onPositionRef = useRef(onPosition);
  useEffect(() => { onPositionRef.current = onPosition; });

  // Keep the latest step in a ref so the stable key handler always sees it.
  const stepRef = useRef(stepMeters);
  useEffect(() => { stepRef.current = stepMeters; }, [stepMeters]);

  useEffect(() => {
    onPositionRef.current(pos);
  }, [pos]);

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
