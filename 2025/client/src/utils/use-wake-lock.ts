"use client";

import { useEffect, useRef } from 'react';

// Custom hook for managing wake lock
export const useWakeLock = () => {
  const wakeLockRef = useRef<WakeLockSentinel>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        // Check if the API is supported
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Screen wake lock activated');
        } else {
          console.warn('Screen Wake Lock API not supported');
        }
      } catch (error) {
        console.error('Failed to activate screen wake lock:', error);
      }
    };

    requestWakeLock();

    // Cleanup function to release the wake lock
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Screen wake lock released');
      }
    };
  }, []);

  return wakeLockRef.current;
};
