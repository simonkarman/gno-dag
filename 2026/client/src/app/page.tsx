'use client';

import { useEffect, useState } from 'react';
import { GameClient } from '@/components/client';
import { InstallPrompt } from '@/components/install-prompt';
import { Programme } from '@/components/programme';
import { useDisplayMode } from '@/hooks/use-display-mode';

const serverUrl = process.env.NEXT_PUBLIC_KRMX_SERVER_URL ?? 'ws://localhost:8082/krmx?version=0.0.1';

/** Remembers that a user chose to open the app despite not being an installed iPad. */
const FORCE_APP_KEY = 'gno-force-app';

export default function Home() {
  const { ready, isIPad, isStandalone, isIOSChrome } = useDisplayMode();
  // null until the stored preference has been read (avoids a decision flash).
  const [forceApp, setForceApp] = useState<boolean | null>(null);

  useEffect(() => {
    setForceApp(localStorage.getItem(FORCE_APP_KEY) === 'true');
  }, []);

  const enableApp = () => {
    localStorage.setItem(FORCE_APP_KEY, 'true');
    setForceApp(true);
  };

  // Hold a neutral background until both device detection and the stored
  // preference have resolved client-side — prevents an SSR/hydration flash.
  if (!ready || forceApp === null) {
    return <main className="min-h-[100dvh]" />;
  }

  // The game itself: only installed iPads, or anyone who used an escape hatch.
  if (forceApp || (isIPad && isStandalone)) {
    return (
      <main className="flex min-h-[90svh] flex-col items-center justify-center px-4">
        <GameClient serverUrl={serverUrl} />
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
