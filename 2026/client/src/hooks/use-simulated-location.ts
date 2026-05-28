'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LatLng } from '@/components/geo';

/** Starting position: the house of Jac. and Govie. */
const START: LatLng = { lat: 52.07732828333311, lng: 4.749337088821905 };

/**
 * ~10 metres expressed in degrees.
 * 1 degree lat ≈ 111 320 m  →  10 m ≈ 0.0000898°
 * 1 degree lng ≈ 111 320 * cos(52°) ≈ 68 500 m  →  10 m ≈ 0.0001460°
 */
const STEP_LAT = 0.0000898;
const STEP_LNG = 0.0001460;

/**
 * Development-only hook that simulates GPS movement via arrow keys.
 *
 * Starts at the house of Jac. and Govie. Each arrow-key press moves the
 * simulated position by ~10 m in that direction.
 *
 * Calls `onPosition` immediately with the initial position, then on every
 * key-driven update.
 */
export function useSimulatedLocation(onPosition: (pos: LatLng) => void) {
  const [pos, setPos] = useState<LatLng>(START);

  const onPositionRef = useRef(onPosition);
  useEffect(() => { onPositionRef.current = onPosition; });

  useEffect(() => {
    onPositionRef.current(pos);
  }, [pos]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      setPos((prev) => {
        switch (e.key) {
          case 'ArrowUp':    return { ...prev, lat: prev.lat + STEP_LAT };
          case 'ArrowDown':  return { ...prev, lat: prev.lat - STEP_LAT };
          case 'ArrowLeft':  return { ...prev, lng: prev.lng - STEP_LNG };
          case 'ArrowRight': return { ...prev, lng: prev.lng + STEP_LNG };
          default:           return prev;
        }
      });
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const reset = useCallback(() => setPos(START), []);

  return { pos, reset };
}
