'use client';

import React from 'react';
import { ContentElement, Requirement } from '@/components/puzzles';
import { AdminPuzzle, PLAYERS } from '@/components/admin-types';

interface Props {
  puzzle: AdminPuzzle;
  onChange: (updated: AdminPuzzle) => void;
  onDelete: () => void;
  /** Activate map-placement mode for the puzzle's main location. */
  onPlaceLocation: () => void;
  /** Activate map-placement mode for a requirement's secondary location. */
  onPlaceRequirementLocation: (reqIndex: number) => void;
  /** Human label of the currently active placement (if any). */
  placingLabel?: string | null;
}

const label = 'block text-xs font-semibold text-zinc-400 mb-1';
const input = 'w-full rounded bg-zinc-900 border border-zinc-700 px-2 py-1.5 text-sm text-white focus:outline-none focus:border-zinc-400';
const btn = 'rounded px-2 py-1 text-xs font-semibold transition-colors';

export function PuzzleForm({
  puzzle, onChange, onDelete, onPlaceLocation, onPlaceRequirementLocation, placingLabel,
}: Props) {
  const patch = (p: Partial<AdminPuzzle>) => onChange({ ...puzzle, ...p });

  // ---- requirements ----
  function addRequirement() {
    const req: Requirement = { type: 'no-other-player-within', meters: 50, expected: true, mode: 'append', content: [] };
    patch({ requirements: [...puzzle.requirements, req] });
  }
  function updateRequirement(i: number, req: Requirement) {
    const reqs = puzzle.requirements.slice();
    reqs[i] = req;
    patch({ requirements: reqs });
  }
  function removeRequirement(i: number) {
    patch({ requirements: puzzle.requirements.filter((_, idx) => idx !== i) });
  }
  function changeRequirementType(i: number, type: Requirement['type']) {
    const existing = puzzle.requirements[i];
    const common = { expected: existing.expected, mode: existing.mode, content: existing.content };
    if (type === 'no-other-player-within') {
      updateRequirement(i, { type, meters: existing.meters, ...common });
    } else {
      const location = existing.type === 'other-player-at-location'
        ? existing.location
        : puzzle.location;
      updateRequirement(i, { type, meters: existing.type === 'no-other-player-within' ? 15 : existing.meters, location, ...common });
    }
  }

  // ---- content ----
  // Content editing is handled by the reusable <ContentEditor /> below.

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base">Puzzel bewerken</h2>
        <button onClick={onDelete} className={`${btn} bg-red-700 hover:bg-red-600 text-white`}>
          Verwijderen
        </button>
      </div>

      {placingLabel && (
        <div className="rounded bg-amber-900/60 border border-amber-600 px-2 py-1.5 text-amber-200 text-xs">
          Klik op de kaart om <strong>{placingLabel}</strong> te plaatsen.
        </div>
      )}

      {/* Basic fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label}>ID</label>
          <input className={input} value={puzzle.id} onChange={(e) => patch({ id: e.target.value })} />
        </div>
        <div>
          <label className={label}>Icoon</label>
          <input className={input} value={puzzle.icon} onChange={(e) => patch({ icon: e.target.value })} />
        </div>
        <div>
          <label className={label}>Toegewezen aan</label>
          <select className={input} value={puzzle.assignedTo} onChange={(e) => patch({ assignedTo: e.target.value as AdminPuzzle['assignedTo'] })}>
            {PLAYERS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Voltooid</label>
          <button
            onClick={() => patch({ completed: !puzzle.completed })}
            className={`${input} text-left font-semibold ${puzzle.completed ? 'text-green-400' : 'text-zinc-400'}`}
          >
            {puzzle.completed ? '✓ Voltooid' : '○ Niet voltooid'}
          </button>
        </div>
        <div>
          <label className={label}>Minimum punten</label>
          <input type="number" className={input} value={puzzle.minimumPoints} onChange={(e) => patch({ minimumPoints: Number(e.target.value) })} />
        </div>
        <div>
          <label className={label}>Antwoord <span className="text-red-400">(geheim)</span></label>
          <input className={input} value={puzzle.answer} onChange={(e) => patch({ answer: e.target.value })} />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={label}>Locatie</label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-zinc-300">
            {puzzle.location.lat.toFixed(6)}, {puzzle.location.lng.toFixed(6)}
          </span>
          <button onClick={onPlaceLocation} className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-white`}>
            Kies op kaart
          </button>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={label}>Voorwaarden</label>
          <button onClick={addRequirement} className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-white`}>
            + Voorwaarde
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {puzzle.requirements.length === 0 && (
            <p className="text-xs text-zinc-500">Geen extra voorwaarden.</p>
          )}
          {puzzle.requirements.map((req, i) => (
            <div key={i} className="rounded border border-zinc-700 p-2 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <select
                  className={input}
                  value={req.type}
                  onChange={(e) => changeRequirementType(i, e.target.value as Requirement['type'])}
                >
                  <option value="no-other-player-within">andere speler NIET binnen</option>
                  <option value="other-player-at-location">andere speler OP locatie</option>
                </select>
                <button onClick={() => removeRequirement(i)} className={`${btn} bg-red-700 hover:bg-red-600 text-white shrink-0`}>×</button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-zinc-400">meters</label>
                <input
                  type="number"
                  className={`${input} w-20`}
                  value={req.meters}
                  onChange={(e) => updateRequirement(i, { ...req, meters: Number(e.target.value) })}
                />
                {req.type === 'other-player-at-location' && (
                  <>
                    <span className="font-mono text-xs text-zinc-300">
                      {req.location.lat.toFixed(5)}, {req.location.lng.toFixed(5)}
                    </span>
                    <button onClick={() => onPlaceRequirementLocation(i)} className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-white`}>
                      Kies op kaart
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-zinc-400">verwacht</label>
                <button
                  onClick={() => updateRequirement(i, { ...req, expected: !req.expected })}
                  className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-white`}
                >
                  {req.expected ? 'waar' : 'onwaar'}
                </button>
                <label className="text-xs text-zinc-400 ml-2">bij afwijking</label>
                <select
                  className={`${input} w-28`}
                  value={req.mode}
                  onChange={(e) => updateRequirement(i, { ...req, mode: e.target.value as Requirement['mode'] })}
                >
                  <option value="append">toevoegen</option>
                  <option value="replace">vervangen</option>
                </select>
              </div>
              <div className="border-t border-zinc-800 pt-2">
                <label className={label}>Afwijkende inhoud</label>
                <ContentEditor
                  content={req.content}
                  onChange={(content) => updateRequirement(i, { ...req, content })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className={label}>Inhoud</label>
        <ContentEditor content={puzzle.content} onChange={(content) => patch({ content })} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable content editor — used for both a puzzle's content and a
// requirement's deviation content.
// ---------------------------------------------------------------------------

function ContentEditor({ content, onChange }: {
  content: ContentElement[];
  onChange: (content: ContentElement[]) => void;
}) {
  function addContent(el: ContentElement) {
    onChange([...content, el]);
  }
  function updateContent(i: number, el: ContentElement) {
    const c = content.slice();
    c[i] = el;
    onChange(c);
  }
  function removeContent(i: number) {
    onChange(content.filter((_, idx) => idx !== i));
  }
  function moveContent(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= content.length) return;
    const c = content.slice();
    [c[i], c[j]] = [c[j], c[i]];
    onChange(c);
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-2 gap-2">
        <button onClick={() => addContent({ type: 'text', value: '' })} className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-white`}>
          + Tekst
        </button>
        <button onClick={() => addContent({ type: 'image', url: '', alt: '' })} className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-white`}>
          + Afbeelding
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {content.length === 0 && (
          <p className="text-xs text-zinc-500">Geen inhoud.</p>
        )}
        {content.map((el, i) => (
          <div key={i} className="rounded border border-zinc-700 p-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase">{el.type}</span>
              <div className="flex gap-1">
                <button onClick={() => moveContent(i, -1)} className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-white`}>↑</button>
                <button onClick={() => moveContent(i, 1)} className={`${btn} bg-zinc-700 hover:bg-zinc-600 text-white`}>↓</button>
                <button onClick={() => removeContent(i)} className={`${btn} bg-red-700 hover:bg-red-600 text-white`}>×</button>
              </div>
            </div>
            {el.type === 'text' ? (
              <textarea
                className={`${input} resize-y min-h-16`}
                value={el.value}
                onChange={(e) => updateContent(i, { ...el, value: e.target.value })}
                placeholder="Tekst..."
              />
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  className={input}
                  value={el.url}
                  onChange={(e) => updateContent(i, { ...el, url: e.target.value })}
                  placeholder="Afbeelding URL..."
                />
                <input
                  className={input}
                  value={el.alt ?? ''}
                  onChange={(e) => updateContent(i, { ...el, alt: e.target.value })}
                  placeholder="Alt-tekst (optioneel)..."
                />
                {el.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={el.url} alt={el.alt ?? ''} className="rounded max-h-32 object-contain bg-zinc-900" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
