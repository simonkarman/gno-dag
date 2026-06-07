'use client';

import { useEffect, useState } from 'react';

export interface DisplayMode {
  /** True for iPads, including iPadOS 13+ which reports a desktop (Macintosh) user agent. */
  isIPad: boolean;
  /** True when launched as an installed PWA (Home Screen / standalone), not a browser tab. */
  isStandalone: boolean;
  /** True when running inside Chrome on iOS/iPadOS (UA contains "CriOS"). */
  isIOSChrome: boolean;
  /** False until detection has run client-side. Guards against SSR/hydration mismatches. */
  ready: boolean;
}

/**
 * Detects the device/display context, client-side only.
 *
 * iPad detection is deliberately a heuristic: since iPadOS 13, Safari and Chrome
 * on iPad report a desktop Mac user agent by default, so we fall back to the
 * touch-points trick (no Mac has a touchscreen) to tell an iPad from a MacBook.
 */
export function useDisplayMode(): DisplayMode {
  const [mode, setMode] = useState<DisplayMode>({
    isIPad: false,
    isStandalone: false,
    isIOSChrome: false,
    ready: false,
  });

  useEffect(() => {
    const ua = navigator.userAgent;
    const maxTouch = navigator.maxTouchPoints ?? 0;

    const isIPad =
      /iPad/.test(ua) ||
      // iPadOS 13+ masquerading as desktop Safari/Chrome.
      (/Macintosh/.test(ua) && maxTouch > 1);

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS-only, non-standard, but the canonical signal there.
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    const isIOSChrome = /CriOS/.test(ua);

    setMode({ isIPad, isStandalone, isIOSChrome, ready: true });
  }, []);

  return mode;
}
