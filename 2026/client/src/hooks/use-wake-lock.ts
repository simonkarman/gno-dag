'use client';

import { useEffect, useState } from 'react';

/**
 * Status reported by {@link useWakeLock}.
 *
 * - `unsupported` — `navigator.wakeLock` is not available (older OS/browser).
 *   The user must disable auto-lock manually in their device settings.
 * - `acquiring` — request is in flight.
 * - `active`   — screen wake lock is currently held.
 * - `released` — the OS released the lock (typically because the page was
 *   backgrounded). The hook re-acquires automatically when the page becomes
 *   visible again, so this state is normally transient.
 * - `error`    — request failed (permissions denied, etc.).
 */
export type WakeLockStatus = 'unsupported' | 'acquiring' | 'active' | 'released' | 'error';

interface WakeLockSentinelLike {
  released: boolean;
  release(): Promise<void>;
  addEventListener(type: 'release', listener: () => void): void;
}

interface WakeLockLike {
  request(type: 'screen'): Promise<WakeLockSentinelLike>;
}

/**
 * Keeps the screen awake using the Wake Lock API.
 *
 * The OS releases the wake lock whenever the page becomes hidden (tab
 * switched, screen locked, etc.). The hook listens for `visibilitychange`
 * and re-requests the lock when the page is visible again, so as long as the
 * page itself is open the lock stays held.
 *
 * Safe to call unconditionally — on browsers without Wake Lock support it
 * simply returns `'unsupported'` and does nothing.
 */
export function useWakeLock(): WakeLockStatus {
  const [status, setStatus] = useState<WakeLockStatus>('acquiring');

  useEffect(() => {
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    const wakeLock = (nav as unknown as { wakeLock?: WakeLockLike } | undefined)?.wakeLock;
    if (!wakeLock) {
      setStatus('unsupported');
      return;
    }

    let cancelled = false;
    let sentinel: WakeLockSentinelLike | null = null;

    const acquire = async () => {
      if (cancelled) return;
      try {
        setStatus('acquiring');
        const s = await wakeLock.request('screen');
        if (cancelled) {
          s.release().catch(() => {});
          return;
        }
        sentinel = s;
        setStatus('active');
        s.addEventListener('release', () => {
          if (cancelled) return;
          setStatus('released');
        });
      } catch (e) {
        console.warn('[wake-lock] request failed:', (e as Error).message);
        if (!cancelled) setStatus('error');
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && (sentinel?.released ?? true)) {
        acquire();
      }
    };

    acquire();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      if (sentinel && !sentinel.released) sentinel.release().catch(() => {});
    };
  }, []);

  return status;
}
