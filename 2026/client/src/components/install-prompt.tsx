'use client';

const STEPS = [
  'Tik op de deelknop (het vierkant met pijltje omhoog) in de browserbalk.',
  'Scroll en kies "Zet op beginscherm".',
  'Open de app voortaan via het nieuwe icoon op je beginscherm.',
];

/**
 * Hard gate shown on an iPad that is running in a normal browser tab (not yet
 * installed). Explains how to install for a full-screen experience, with a
 * discreet "toch doorgaan" escape so a snag can never lock anyone out.
 */
export function InstallPrompt({ isIOSChrome, onContinue }: { isIOSChrome: boolean; onContinue: () => void }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div className="text-5xl">📲</div>
      <h1 className="font-bold text-2xl">Zet de app op je beginscherm</h1>
      <p className="max-w-sm text-zinc-400">
        Voor het volledige scherm werkt de app alleen vanaf het beginscherm. Volg even deze stappen.
      </p>

      {isIOSChrome && (
        <div className="max-w-sm rounded-lg border border-amber-600/50 bg-amber-900/30 px-4 py-3 text-sm text-amber-200">
          Je gebruikt nu Chrome. Open deze pagina eerst in <span className="font-bold">Safari</span> &mdash;
          alleen daar kun je de app goed installeren.
        </div>
      )}

      <ol className="flex w-full max-w-sm flex-col gap-3 text-left">
        {STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-3 rounded-lg bg-zinc-800/60 px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-sm font-bold text-white">
              {i + 1}
            </span>
            <span className="text-sm text-zinc-200">{step}</span>
          </li>
        ))}
      </ol>

      <button
        onClick={onContinue}
        className="mt-2 text-xs text-zinc-600 underline transition-colors hover:text-zinc-400"
      >
        toch doorgaan
      </button>
    </div>
  );
}
