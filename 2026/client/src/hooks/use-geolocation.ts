'use client';

import { useEffect, useRef } from 'react';
import { LatLng } from '@/components/geo';

/**
 * Thin wrapper around `navigator.geolocation.watchPosition`.
 * Registers on mount, cleans up on unmount. That's it.
 */
export function useGeolocation(
  onPosition: (pos: LatLng) => void,
  onError?: (err: GeolocationPositionError) => void,
) {
  const onPositionRef = useRef(onPosition);
  const onErrorRef = useRef(onError);
  useEffect(() => { onPositionRef.current = onPosition; });
  useEffect(() => { onErrorRef.current = onError; });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('[geo] Geolocation API is not available in this browser');
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => onPositionRef.current({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => { console.warn('[geo] error:', e.message); onErrorRef.current?.(e); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);
}
