import { LatLng } from '@/components/geo';
import { ContentElement, PlayerName, PuzzleState, Requirement } from '@/components/puzzles';

/**
 * Full puzzle as stored in the GCS state blob — identical to the server's
 * `Puzzle`, including the secret `answer`. Only used by the admin tooling.
 *
 * Only `completed` is persisted; the locked/open distinction is always derived
 * from scores (and, on the live server, player positions).
 *
 * `answer` is a list of accepted answers, stored verbatim. The server normalises
 * both sides at comparison time (case, diacritics, punctuation, and extra
 * whitespace are ignored). An empty array means the puzzle is unanswerable.
 */
export interface AdminPuzzle {
  id: string;
  icon: string;
  location: LatLng;
  assignedTo: PlayerName;
  minimumPoints: number;
  requirements: Requirement[];
  answer: string[];
  content: ContentElement[];
  completed: boolean;
}

/** Coerces a loaded puzzle's `answer` field into a `string[]`. Defensive
 *  parity with the server: a legacy single-string blob is wrapped in a
 *  one-element array so the admin form keeps working before the server has
 *  had a chance to re-save in the new shape. */
export function coerceAnswer(raw: unknown): string[] {
  if (typeof raw === 'string') return [raw];
  if (Array.isArray(raw)) return raw.filter((a): a is string => typeof a === 'string');
  return [];
}

/** Full application state stored in GCS — only puzzles; scores are derived. */
export interface AdminState {
  puzzles: AdminPuzzle[];
}

export const PLAYERS: PlayerName[] = ['Govie', 'Jac.'];

/** A fresh, empty state. */
export function emptyAdminState(): AdminState {
  return { puzzles: [] };
}

/** Computes each player's score as their number of completed puzzles. */
export function derivedScores(puzzles: AdminPuzzle[]): Record<PlayerName, number> {
  const scores: Record<PlayerName, number> = { 'Govie': 0, 'Jac.': 0 };
  for (const p of puzzles) {
    if (p.completed) scores[p.assignedTo] += 1;
  }
  return scores;
}

/**
 * Derives a puzzle's display state for the admin map. Since the admin has no
 * live player positions, position-based requirements are NOT evaluated — a
 * non-completed puzzle shows as `open` purely when the score threshold is met.
 */
export function derivedDisplayState(
  puzzle: AdminPuzzle,
  scores: Record<PlayerName, number>,
): PuzzleState {
  if (puzzle.completed) return 'completed';
  return scores[puzzle.assignedTo] >= puzzle.minimumPoints ? 'open' : 'locked';
}

/** A puzzle plus its computed reachability within its owner's column. */
export interface PlayerColumnRow {
  puzzle: AdminPuzzle;
  /**
   * The number of the SAME player's puzzles with a strictly lower
   * `minimumPoints` — i.e. the maximum score that player can have accumulated
   * by the time this puzzle's threshold is checked.
   */
  availableBefore: number;
  /** Whether the threshold can ever be met: `availableBefore >= minimumPoints`. */
  achievable: boolean;
}

/**
 * Groups puzzles per player and, within each column, sorts them ascending by
 * `minimumPoints`. For each puzzle it computes `availableBefore` and whether the
 * puzzle is therefore `achievable`. Display-only: never mutates the input.
 */
export function buildPlayerColumns(
  puzzles: AdminPuzzle[],
): Record<PlayerName, PlayerColumnRow[]> {
  const byPlayer: Record<PlayerName, AdminPuzzle[]> = { 'Govie': [], 'Jac.': [] };
  for (const p of puzzles) byPlayer[p.assignedTo].push(p);

  const result: Record<PlayerName, PlayerColumnRow[]> = { 'Govie': [], 'Jac.': [] };
  for (const name of PLAYERS) {
    const sorted = [...byPlayer[name]].sort((a, b) => a.minimumPoints - b.minimumPoints);
    result[name] = sorted.map((puzzle) => {
      const availableBefore = byPlayer[name].filter(q => q.minimumPoints < puzzle.minimumPoints).length;
      return { puzzle, availableBefore, achievable: availableBefore >= puzzle.minimumPoints };
    });
  }
  return result;
}

/** Creates a new puzzle with sensible defaults at a given location. */
export function newPuzzle(location: LatLng): AdminPuzzle {
  return {
    id: (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10),
    icon: '❓',
    location,
    assignedTo: 'Govie',
    minimumPoints: 0,
    requirements: [],
    answer: [],
    content: [],
    completed: false,
  };
}
