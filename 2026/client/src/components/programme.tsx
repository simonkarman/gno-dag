'use client';

import { useEffect, useMemo, useState } from 'react';

const START_DATETIME = process.env.NEXT_PUBLIC_START_DATETIME ?? '';

// ---------------------------------------------------------------------------
// Editable programme
// ---------------------------------------------------------------------------
// Each entry becomes visible once the event-day clock passes `at` (local time).
// The programme therefore fills out progressively as the day unfolds. The
// "Eerder" entry has no `label` and reveals from the start of the event day
// ({ h: 0, m: 0 }); move it earlier/later by tweaking `at`.

interface ProgrammeEntry {
  /** Reveal moment as a local clock time on the event day. */
  at: { h: number; m: number };
  /** Time label shown in the list. Omit for the "Eerder" pre-entry. */
  label?: string;
  text: string;
}

const PROGRAMME: ProgrammeEntry[] = [
  { at: { h: 0, m: 0 }, text: 'Eerder: Zorg dat je ontbeten hebt en gedoucht en om 10:30 klaar zit!' },
  { at: { h: 10, m: 30 }, label: '10:30', text: 'Koffie' },
  { at: { h: 11, m: 0 }, label: '11:00', text: 'Activiteit 1' },
  { at: { h: 12, m: 30 }, label: '12:30', text: 'Lunch' },
  { at: { h: 15, m: 0 }, label: '15:00', text: 'Activiteit 2' },
  { at: { h: 17, m: 30 }, label: '17:30', text: 'Diner' },
  { at: { h: 19, m: 0 }, label: '19:00', text: 'Einde' },
];

/** The event day, derived from START_DATETIME (falls back to today if unset/invalid). */
function eventDay(): Date {
  const d = START_DATETIME ? new Date(START_DATETIME) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/** Absolute reveal moment for an entry: the event day at the entry's clock time. */
function revealAt(day: Date, at: { h: number; m: number }): number {
  const d = new Date(day);
  d.setHours(at.h, at.m, 0, 0);
  return d.getTime();
}

/**
 * "Programma van de dag" — shown on every non-iPad device (other phones, the
 * MacBook, desktop). Before anything is revealed it only teases the start; on
 * the day the entries appear one by one as their time arrives.
 */
export function Programme({ onOpenApp }: { onOpenApp: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const day = useMemo(() => eventDay(), []);
  const entries = useMemo(
    () => PROGRAMME.map((e) => ({ ...e, time: revealAt(day, e.at) })),
    [day],
  );
  const revealed = entries.filter((e) => now >= e.time);
  const dateLabel = day.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex min-h-[100dvh] flex-col items-center px-6 py-12">
      <div className="flex w-full max-w-md grow flex-col items-center justify-center gap-6 text-center">
        <div className="text-4xl">📋</div>
        <h1 className="text-2xl font-bold">Programma van de dag</h1>

        {revealed.length === 0 ? (
          <p className="max-w-xs text-zinc-400">
            Zorg dat je op <span className="font-semibold text-zinc-200">{dateLabel}</span> om{' '}
            <span className="font-semibold text-zinc-200">10:30</span> klaar zit aan de eettafel in Bodegraven.
          </p>
        ) : (
          <ol className="flex w-full flex-col gap-2 text-left">
            {revealed.map((e, i) => (
              <li key={i} className="flex items-baseline gap-3 rounded-lg bg-zinc-800/60 px-4 py-3">
                {e.label && (
                  <span className="w-14 shrink-0 font-mono font-bold text-white">{e.label}</span>
                )}
                <span className={e.label ? 'text-zinc-200' : 'italic text-zinc-300'}>{e.text}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Discreet escape into the app (iPad-failure fallback). */}
      <button
        onClick={onOpenApp}
        className="mt-8 text-[11px] text-zinc-700 transition-colors hover:text-zinc-500"
      >
        open app
      </button>
    </div>
  );
}
