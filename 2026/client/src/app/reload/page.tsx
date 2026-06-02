'use client';

import { useState } from 'react';

type Status =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; puzzleCount: number }
  | { kind: 'error'; message: string };

export default function ReloadPage() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function reload() {
    setStatus({ kind: 'loading' });
    try {
      const res = await fetch('/api/admin/reload', { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setStatus({ kind: 'success', puzzleCount: body.puzzleCount ?? 0 });
      } else {
        setStatus({ kind: 'error', message: body.error ?? `Server gaf status ${res.status}.` });
      }
    } catch (e) {
      setStatus({ kind: 'error', message: (e as Error).message });
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-bold text-2xl">Server state herladen</h1>
      <p className="text-zinc-400 max-w-sm text-sm">
        Laat de server zijn state opnieuw inlezen vanuit GCS. Gebruik dit nadat je
        iets hebt aangepast in het admin-dashboard.
      </p>

      <button
        onClick={reload}
        disabled={status.kind === 'loading'}
        className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-400 font-bold text-lg transition-colors"
      >
        {status.kind === 'loading' ? 'Bezig...' : 'Herladen'}
      </button>

      {status.kind === 'success' && (
        <p className="text-green-400 text-sm">
          ✓ State herladen — {status.puzzleCount} puzzel{status.puzzleCount === 1 ? '' : 's'}.
        </p>
      )}
      {status.kind === 'error' && (
        <p className="text-red-400 text-sm max-w-sm">✗ {status.message}</p>
      )}
    </div>
  );
}
