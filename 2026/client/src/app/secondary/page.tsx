'use client';

import { useState } from 'react';
import { GameClient } from '@/components/client';
import { InstallPrompt } from '@/components/install-prompt';
import { Programme } from '@/components/programme';
import { useDisplayMode } from '@/hooks/use-display-mode';

const serverUrl = process.env.NEXT_PUBLIC_KRMX_SERVER_URL_SECONDARY ?? 'ws://localhost:8082/secondary/krmx?version=0.0.1';
// The secondary is always treated as "live" regardless of NEXT_PUBLIC_START_DATETIME.
// Passing '' triggers the "no start time configured → always started" branch in
// useGameStarted, so the waiting screen is bypassed unconditionally.
const startDatetime = undefined;
// The secondary is also always in dev mode regardless of NEXT_PUBLIC_LOCAL_DEVELOPMENT,
// so real GPS is replaced by the simulated arrow-key-driven position. This makes
// the secondary route useful as a test/staging environment without needing to be
// physically on-site.
const forceDev = true;

/**
 * Secondary instance of the game — mirror of `/`, but connects to the
 * secondary Krmx server. URL is kept secret and used as a test/staging
 * environment so two parallel games can run side-by-side.
 */
export default function SecondaryHome() {
  const { ready, isIPad, isStandalone, isIOSChrome } = useDisplayMode();
  // In-memory only: a reload always brings the user back to the programme /
  // install prompt. Previously this was persisted to localStorage, which left
  // people stuck in the app with no way back.
  const [forceApp, setForceApp] = useState(false);

  const enableApp = () => setForceApp(true);

  // Hold a neutral background until device detection resolves client-side —
  // prevents an SSR/hydration flash.
  if (!ready) {
    return <main className="min-h-[100dvh]" />;
  }

  // The game itself: only installed iPads, or anyone who used an escape hatch.
  if (forceApp || (isIPad && isStandalone)) {
    return (
      <main className="flex min-h-[90svh] flex-col items-center justify-center px-4">
        <GameClient serverUrl={serverUrl} startDatetime={startDatetime} forceDev={forceDev} />
      </main>
    );
  }

  // iPad in a browser tab → guide them to install for full screen.
  if (isIPad) {
    return <InstallPrompt isIOSChrome={isIOSChrome} onContinue={enableApp} />;
  }

  // Everything else (other phones, the MacBook, desktop) → the day's programme.
  return <Programme onOpenApp={enableApp} />;
}
