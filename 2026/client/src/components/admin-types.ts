import { LatLng } from '@/components/geo';
import { ContentElement, PlayerName, PuzzleState, Requirement } from '@/components/puzzles';

/**
 * Full puzzle as stored in the GCS state blob — identical to the server's
 * `Puzzle`, including the secret `answer`. Only used by the admin tooling.
 *
 * Only `completed` is persisted; the locked/open distinction is always derived
 * from scores (and, on the live server, player positions).
 */
export interface AdminPuzzle {
  id: string;
  icon: string;
  location: LatLng;
  assignedTo: PlayerName;
  minimumPoints: number;
  requirements: Requirement[];
  answer: string;
  content: ContentElement[];
  completed: boolean;
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
    answer: '',
    content: [],
    completed: false,
  };
}
