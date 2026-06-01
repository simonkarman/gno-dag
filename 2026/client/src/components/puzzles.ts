import { LatLng } from '@/components/geo';

export type PlayerName = 'Govie' | 'Jac.';

export type PuzzleState = 'locked' | 'open' | 'completed';

export type ContentElement =
  | { type: 'text'; value: string }
  | { type: 'image'; url: string; alt?: string };

/**
 * Server-only requirement type. Requirements are evaluated on the server and
 * never sent to clients (they only influence the computed `content` and the
 * `secondaryLocations` of a `ClientPuzzle`). Kept here for the admin tooling.
 */
export type Requirement =
  | { type: 'no-other-player-within'; meters: number; expected: boolean; mode: 'replace' | 'append'; content: ContentElement[] }
  | { type: 'other-player-at-location'; location: LatLng; meters: number; expected: boolean; mode: 'replace' | 'append'; content: ContentElement[] };

/**
 * Puzzle as sent to clients. The server strips `answer` and `requirements`, and
 * provides server-computed `content` (with requirements applied) plus the
 * `secondaryLocations` to render on the map. The locked/open state is derived
 * on the client from `completed` + the assigned player's score.
 */
export interface ClientPuzzle {
  id: string;
  icon: string;
  location: LatLng;
  assignedTo: PlayerName;
  minimumPoints: number;
  content: ContentElement[];
  secondaryLocations: LatLng[];
  completed: boolean;
}

export interface GameState {
  puzzles: ClientPuzzle[];
}

/** How close (in metres) a player must be to interact with a puzzle. */
export const PUZZLE_PROXIMITY_METERS = 10;

/** Marker colors per puzzle state. */
export const PUZZLE_STATE_COLORS: Record<PuzzleState, string> = {
  locked: '#71717a',    // zinc-500 (gray)
  open: '#ffffff',      // white
  completed: '#22c55e', // green
};

/** Derives each player's score as their number of completed puzzles. */
export function deriveScores(puzzles: ClientPuzzle[]): Record<PlayerName, number> {
  const scores: Record<PlayerName, number> = { 'Govie': 0, 'Jac.': 0 };
  for (const puzzle of puzzles) {
    if (puzzle.completed) scores[puzzle.assignedTo] += 1;
  }
  return scores;
}

/**
 * Derives a puzzle's display state. Requirements do NOT influence this:
 * - completed: already solved (highest priority)
 * - locked: assigned player lacks the required points
 * - open: otherwise ready to be solved
 */
export function derivePuzzleState(puzzle: ClientPuzzle, playerScore: number): PuzzleState {
  if (puzzle.completed) return 'completed';
  if (playerScore < puzzle.minimumPoints) return 'locked';
  return 'open';
}

/** Flattens all secondary locations of all puzzles, tagged with their puzzle id. */
export function secondaryLocations(puzzles: ClientPuzzle[]): { puzzleId: string; location: LatLng }[] {
  const result: { puzzleId: string; location: LatLng }[] = [];
  for (const puzzle of puzzles) {
    for (const location of puzzle.secondaryLocations) {
      result.push({ puzzleId: puzzle.id, location });
    }
  }
  return result;
}
