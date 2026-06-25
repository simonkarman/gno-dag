'use client';

import { useState } from 'react';

type Status =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; puzzleCount: number }
  | { kind: 'error'; message: string };

/**
 * Reload UI shared between the primary and secondary instances.
 *
 * - `apiPath`: full path to the reload route (e.g. `/api/admin/reload` or
 *   `/api/secondary/admin/reload`).
 * - `title`: page header, e.g. `Server state herladen` or
 *   `Server state herladen (secondary)`.
 */
export function ReloadApp({ apiPath, title }: { apiPath: string; title: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function reload() {
    setStatus({ kind: 'loading' });
    try {
      const res = await fetch(apiPath, { method: 'POST' });
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
      <h1 className="font-bold text-2xl">{title}</h1>
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
