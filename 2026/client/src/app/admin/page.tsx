'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LatLng } from '@/components/geo';
import { PLAYER_COLORS } from '@/components/colors';
import { AdminMap } from '@/components/admin-map';
import { PuzzleForm } from '@/components/puzzle-form';
import { AdminPuzzle, AdminState, PLAYERS, buildPlayerColumns, coerceAnswer, derivedScores, emptyAdminState, newPuzzle } from '@/components/admin-types';

type Placing =
  | { kind: 'new' }
  | { kind: 'puzzle-location' }
  | { kind: 'requirement-location'; reqIndex: number }
  | null;

const PW_KEY = 'gno-admin-pw';
const POLL_INTERVAL_MS = 30_000;

/** Normalises a loaded blob into the admin state shape. Coerces legacy
 *  single-string `answer` values into a one-element array (matches the
 *  server-side coercion in state.ts) so the form keeps working even if the
 *  blob hasn't been re-saved yet. */
function normaliseState(data: Partial<AdminState> | null | undefined): AdminState {
  const raw = Array.isArray(data?.puzzles) ? data!.puzzles : [];
  const puzzles = raw.map((p) => ({
    ...p,
    answer: coerceAnswer((p as { answer?: unknown }).answer),
  })) as AdminPuzzle[];
  return { puzzles };
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);

  const [state, setState] = useState<AdminState>(emptyAdminState());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placing, setPlacing] = useState<Placing>(null);

  const [blob, setBlob] = useState('');
  const [status, setStatus] = useState<string>('');
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  // Conflict detection: hash of the remote state as we last knew it, plus the
  // pending remote state when a background change is detected.
  const remoteHash = useRef('');
  const [conflict, setConflict] = useState<AdminState | null>(null);

  // Restore saved password on mount.
  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) { setPassword(saved); setAuthed(true); }
  }, []);

  const selected = useMemo(
    () => state.puzzles.find(p => p.id === selectedId) ?? null,
    [state.puzzles, selectedId],
  );

  const scores = useMemo(() => derivedScores(state.puzzles), [state.puzzles]);
  const columns = useMemo(() => buildPlayerColumns(state.puzzles), [state.puzzles]);

  // ---- API ----
  const fetchRemote = useCallback(async (): Promise<{ data: AdminState; blob: string }> => {
    const res = await fetch('/api/admin/state', { headers: { authorization: `Bearer ${password}` } });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }
    return { data: normaliseState(await res.json()), blob: res.headers.get('x-gcs-blob') ?? '' };
  }, [password]);

  const load = useCallback(async () => {
    setBusy(true);
    setStatus('Laden...');
    try {
      const { data, blob } = await fetchRemote();
      setState(data);
      setBlob(blob);
      remoteHash.current = JSON.stringify(data);
      setConflict(null);
      setDirty(false);
      setStatus('Geladen uit GCS.');
    } catch (e) {
      setStatus(`Fout: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }, [fetchRemote]);

  const save = useCallback(async () => {
    setBusy(true);
    setStatus('Opslaan...');
    try {
      const res = await fetch('/api/admin/state', {
        method: 'PUT',
        headers: { authorization: `Bearer ${password}`, 'content-type': 'application/json' },
        body: JSON.stringify(state),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(`Fout: ${body.error ?? res.status}`);
        return;
      }
      remoteHash.current = JSON.stringify(state);
      setConflict(null);
      setDirty(false);
      setStatus(`Opgeslagen naar GCS (${body.blob ?? ''}).`);
    } catch (e) {
      setStatus(`Fout: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }, [password, state]);

  // Auto-load once authed.
  useEffect(() => { if (authed) void load(); }, [authed, load]);

  // Poll for remote changes made by the server (or another admin).
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(async () => {
      if (busy || conflict) return; // don't poll mid-operation or while awaiting a decision
      try {
        const { data } = await fetchRemote();
        const hash = JSON.stringify(data);
        if (hash !== remoteHash.current) {
          setConflict(data);
        }
      } catch {
        // ignore transient polling errors
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [authed, busy, conflict, fetchRemote]);

  // ---- mutations ----
  function updateState(updater: (s: AdminState) => AdminState) {
    setState(prev => updater(prev));
    setDirty(true);
  }
  function updatePuzzle(id: string, updated: AdminPuzzle) {
    updateState(s => ({ ...s, puzzles: s.puzzles.map(p => (p.id === id ? updated : p)) }));
  }
  function deletePuzzle(id: string) {
    updateState(s => ({ ...s, puzzles: s.puzzles.filter(p => p.id !== id) }));
    if (selectedId === id) setSelectedId(null);
  }
  function movePuzzle(id: string, loc: LatLng) {
    updateState(s => ({ ...s, puzzles: s.puzzles.map(p => (p.id === id ? { ...p, location: loc } : p)) }));
  }
  function moveSecondary(puzzleId: string, reqIndex: number, loc: LatLng) {
    updateState(s => ({
      ...s,
      puzzles: s.puzzles.map(p => {
        if (p.id !== puzzleId) return p;
        const reqs = p.requirements.slice();
        const r = reqs[reqIndex];
        if (r && r.type === 'other-player-at-location') reqs[reqIndex] = { ...r, location: loc };
        return { ...p, requirements: reqs };
      }),
    }));
  }
  function resetToStart() {
    if (!confirm('Alle puzzels terugzetten naar niet-voltooid (scores worden 0)?')) return;
    updateState(s => ({ ...s, puzzles: s.puzzles.map(p => ({ ...p, completed: false })) }));
  }

  // ---- map click handling ----
  function onMapClick(loc: LatLng) {
    if (!placing) return;
    if (placing.kind === 'new') {
      const p = newPuzzle(loc);
      updateState(s => ({ ...s, puzzles: [...s.puzzles, p] }));
      setSelectedId(p.id);
    } else if (placing.kind === 'puzzle-location' && selected) {
      movePuzzle(selected.id, loc);
    } else if (placing.kind === 'requirement-location' && selected) {
      moveSecondary(selected.id, placing.reqIndex, loc);
    }
    setPlacing(null);
  }

  const placingLabel = placing
    ? placing.kind === 'new' ? 'een nieuwe puzzel'
      : placing.kind === 'puzzle-location' ? 'de puzzellocatie'
      : 'de locatie van de andere speler'
    : null;

  // ---- password gate ----
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col gap-3 w-72">
          <h1 className="font-bold text-lg text-center">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && password) { sessionStorage.setItem(PW_KEY, password); setAuthed(true); } }}
            placeholder="ADMIN_PASSWORD"
            className="rounded bg-zinc-900 border border-zinc-700 px-3 py-2 focus:outline-none focus:border-zinc-400"
          />
          <button
            onClick={() => { sessionStorage.setItem(PW_KEY, password); setAuthed(true); }}
            disabled={!password}
            className="rounded bg-green-600 hover:bg-green-500 disabled:opacity-40 px-3 py-2 font-bold"
          >
            Inloggen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      {/* Conflict banner */}
      {conflict && (
        <div className="flex items-center gap-3 px-4 py-2 bg-amber-900/90 border-b border-amber-600 text-amber-100 text-sm">
          <span>⚠ De state in GCS is gewijzigd{dirty ? ' — je hebt niet-opgeslagen wijzigingen' : ''}.</span>
          <div className="flex-1" />
          <button
            onClick={() => {
              const remote = conflict;
              setState(remote);
              remoteHash.current = JSON.stringify(remote);
              setConflict(null);
              setDirty(false);
              setStatus('Herladen vanuit GCS.');
            }}
            className="rounded bg-amber-700 hover:bg-amber-600 px-3 py-1 font-semibold"
          >
            Herladen
          </button>
          <button
            onClick={() => {
              // Keep local edits; accept the remote as the new baseline so we
              // don't keep re-alerting for the same change. Next save overwrites.
              remoteHash.current = JSON.stringify(conflict);
              setConflict(null);
              setStatus('Wijziging genegeerd — jouw versie blijft staan.');
            }}
            className="rounded bg-zinc-700 hover:bg-zinc-600 px-3 py-1 font-semibold"
          >
            Negeren
          </button>
        </div>
      )}

      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-2 border-b border-zinc-800 shrink-0">
        <h1 className="font-bold">GNO Admin</h1>
        {blob && <span className="text-xs font-mono text-zinc-400">blob: {blob}</span>}
        <div className="flex-1" />
        {dirty && <span className="text-xs text-amber-400">niet opgeslagen</span>}
        <span className="text-xs text-zinc-400">{status}</span>
        <button onClick={load} disabled={busy} className="rounded bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 px-3 py-1.5 text-sm font-semibold">
          Laden
        </button>
        <button onClick={save} disabled={busy} className="rounded bg-green-600 hover:bg-green-500 disabled:opacity-40 px-3 py-1.5 text-sm font-bold">
          Opslaan
        </button>
        <button
          onClick={() => { sessionStorage.removeItem(PW_KEY); setAuthed(false); }}
          className="rounded bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-sm"
        >
          Uitloggen
        </button>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Map */}
        <div className="flex-1 min-w-0 relative">
          <AdminMap
            puzzles={state.puzzles}
            selectedId={selectedId}
            placing={placing !== null}
            onMapClick={onMapClick}
            onSelectPuzzle={setSelectedId}
            onMovePuzzle={movePuzzle}
            onMoveSecondary={moveSecondary}
          />
          {placing && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded bg-amber-900/80 border border-amber-600 px-3 py-1.5 text-xs text-amber-100">
              Klik op de kaart om {placingLabel} te plaatsen ·{' '}
              <button className="underline" onClick={() => setPlacing(null)}>annuleren</button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-[32rem] shrink-0 border-l border-zinc-800 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Scores (derived, read-only) */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-sm">Scores <span className="text-zinc-500 font-normal">(voltooide puzzels)</span></h2>
              <button onClick={resetToStart} className="rounded bg-zinc-700 hover:bg-zinc-600 px-2 py-1 text-xs font-semibold">
                Reset naar begin
              </button>
            </div>
            <div className="flex gap-4">
              {PLAYERS.map((name) => (
                <div key={name} className="flex items-center gap-2">
                  <span style={{ color: PLAYER_COLORS[name] }} className="font-bold text-sm">{name}</span>
                  <span className="font-mono text-lg font-bold">{scores[name]}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Achievability board (per player, sorted by required points) */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-sm">Puzzels ({state.puzzles.length})</h2>
              <button
                onClick={() => { setPlacing({ kind: 'new' }); }}
                className="rounded bg-green-600 hover:bg-green-500 px-2 py-1 text-xs font-bold"
              >
                + Puzzel (klik op kaart)
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PLAYERS.map((name) => (
                <div key={name} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-1 pb-0.5">
                    <span style={{ color: PLAYER_COLORS[name] }} className="font-bold text-xs">{name}</span>
                    <span className="font-mono text-xs text-zinc-400">{scores[name]}</span>
                  </div>
                  {columns[name].map(({ puzzle, achievable }) => {
                    const isSelected = puzzle.id === selectedId;
                    const unreachable = !puzzle.completed && !achievable;
                    return (
                      <button
                        key={puzzle.id}
                        onClick={() => setSelectedId(prev => (prev === puzzle.id ? null : puzzle.id))}
                        title={puzzle.id}
                        className={`flex items-center gap-1.5 rounded border px-2 py-1.5 text-left text-sm transition-colors ${
                          puzzle.completed
                            ? 'bg-green-900/40 border-green-700/60'
                            : unreachable
                              ? 'bg-red-900/30 border-red-800/60'
                              : 'bg-zinc-900 border-transparent hover:bg-zinc-800'
                        } ${isSelected ? 'ring-2 ring-white/70' : ''}`}
                      >
                        <span className="text-base">{puzzle.icon}</span>
                        <span
                          className={`font-mono text-xs ${
                            puzzle.completed ? 'text-green-400' : unreachable ? 'text-red-400' : 'text-zinc-300'
                          }`}
                        >
                          {puzzle.minimumPoints}
                        </span>
                        <span className="flex-1" />
                        {puzzle.completed
                          ? <span className="text-green-400 text-xs">✓</span>
                          : unreachable
                            ? <span className="text-red-400 text-xs">⚠</span>
                            : null}
                      </button>
                    );
                  })}
                  {columns[name].length === 0 && <p className="text-xs text-zinc-500 px-1">Geen puzzels.</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Selected puzzle form */}
          {selected && (
            <section className="border-t border-zinc-800 pt-4">
              <PuzzleForm
                puzzle={selected}
                onChange={(u) => updatePuzzle(selected.id, u)}
                onDelete={() => deletePuzzle(selected.id)}
                onPlaceLocation={() => setPlacing({ kind: 'puzzle-location' })}
                onPlaceRequirementLocation={(reqIndex) => setPlacing({ kind: 'requirement-location', reqIndex })}
                placingLabel={placingLabel}
              />
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
