'use client';

import { GameClient } from '@/components/client';

const serverUrl = process.env.NEXT_PUBLIC_KRMX_SERVER_URL ?? 'ws://localhost:8082/krmx?version=0.0.1';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[90svh] px-4">
      <GameClient serverUrl={serverUrl} />
    </main>
  );
}
