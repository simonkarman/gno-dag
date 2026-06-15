import { LatLng, distanceTo } from './geo-transform';
import { AppState, ContentElement, PlayerName, Puzzle, PuzzleState, Requirement, VALID_PLAYERS, computeScores } from './state';

/** The opponent of a given player. */
export function otherPlayer(player: PlayerName): PlayerName {
  return player === 'Govie' ? 'Jac.' : 'Govie';
}

/**
 * Normalises an answer string for comparison only. Lowercases, strips
 * diacritics (NFD), replaces punctuation with whitespace, collapses internal
 * whitespace, and trims. Applied identically to both the user's input and each
 * accepted answer so that puzzle authors can write answers verbatim.
 */
function normalizeAnswer(s: string): string {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Evaluates a single requirement's condition.
 * Returns false (fails safe) when the relevant player's GPS is unknown.
 */
function requirementMet(
  req: Requirement,
  puzzle: Puzzle,
  positions: Record<PlayerName, LatLng | null>,
): boolean {
  const other = otherPlayer(puzzle.assignedTo);
  const otherPos = positions[other];

  switch (req.type) {
    case 'no-other-player-within': {
      // Met when the other player is known to be far away.
      if (!otherPos) return false;
      return distanceTo(otherPos, puzzle.location) > req.meters;
    }
    case 'other-player-at-location': {
      // Met when the other player is at the required location.
      if (!otherPos) return false;
      return distanceTo(otherPos, req.location) <= req.meters;
    }
    default:
      return false;
  }
}

/**
 * Computes a puzzle's effective content by applying each requirement. A
 * requirement only takes effect when its condition does not equal `expected`.
 */
export function effectiveContent(
  puzzle: Puzzle,
  positions: Record<PlayerName, LatLng | null>,
): ContentElement[] {
  let content = [...puzzle.content];
  for (const req of puzzle.requirements) {
    const met = requirementMet(req, puzzle, positions);
    if (met === req.expected) continue;
    if (req.mode === 'replace') {
      return [...req.content];
    }
    if (req.mode === 'append') {
      content = [...content, ...req.content];
    }
  }
  return content;
}

/** Secondary map locations referenced by a puzzle's requirements (rendered as diamonds). */
export function secondaryLocations(puzzle: Puzzle): LatLng[] {
  return puzzle.requirements
    .filter((r): r is Extract<Requirement, { type: 'other-player-at-location' }> => r.type === 'other-player-at-location')
    .map(r => r.location);
}

/**
 * Derives the display state of a puzzle. Requirements do NOT influence this:
 * - completed: already solved (highest priority)
 * - locked: assigned player lacks the required points
 * - open: otherwise ready to be solved
 */
export function puzzleDisplayState(
  puzzle: Puzzle,
  scores: Record<PlayerName, number>,
): PuzzleState {
  if (puzzle.completed) return 'completed';
  if (scores[puzzle.assignedTo] < puzzle.minimumPoints) return 'locked';
  return 'open';
}

/** Recomputes the in-memory derived scores from the set of completed puzzles. */
export function syncScores(state: AppState): void {
  state.scores = computeScores(state.puzzles);
}

export interface CompleteResult {
  success: boolean;
  message?: string;
  /** True when a puzzle was completed and the state should be persisted + broadcast. */
  mutated: boolean;
}

/**
 * Attempts to complete a puzzle for a player. Validates ownership, derived state,
 * proximity, and answer. On success, marks completed and resyncs scores.
 */
export function tryComplete(
  state: AppState,
  positions: Record<PlayerName, LatLng | null>,
  player: PlayerName,
  puzzleId: string,
  answer: string,
  proximityMeters: number,
): CompleteResult {
  const puzzle = state.puzzles.find(p => p.id === puzzleId);
  if (!puzzle) {
    return { success: false, mutated: false, message: 'Puzzel niet gevonden.' };
  }
  if (puzzle.assignedTo !== player) {
    return { success: false, mutated: false, message: 'Deze puzzel is niet van jou.' };
  }
  if (puzzle.completed) {
    return { success: false, mutated: false, message: 'Deze puzzel is al voltooid.' };
  }
  if (puzzleDisplayState(puzzle, state.scores) !== 'open') {
    return { success: false, mutated: false, message: 'Deze puzzel is nog vergrendeld.' };
  }
  const pos = positions[player];
  if (!pos || distanceTo(pos, puzzle.location) > proximityMeters) {
    return { success: false, mutated: false, message: 'Je bent niet bij de puzzel.' };
  }
  const candidate = normalizeAnswer(answer);
  if (!puzzle.answer.some(a => normalizeAnswer(a) === candidate)) {
    return { success: false, mutated: false, message: 'Fout antwoord.' };
  }

  puzzle.completed = true;
  syncScores(state);
  return { success: true, mutated: true };
}

/**
 * Strips server-only fields (the answer, the raw requirements) and adds the
 * server-computed effective content + secondary locations before sending a
 * puzzle to clients. The locked/open state is derived on the client.
 */
export function toClientPuzzle(
  puzzle: Puzzle,
  positions: Record<PlayerName, LatLng | null>,
) {
  const { answer, requirements, content, ...rest } = puzzle;
  void answer; void requirements; void content;
  return {
    ...rest,
    content: effectiveContent(puzzle, positions),
    secondaryLocations: secondaryLocations(puzzle),
  };
}

/** Builds the client-facing game-state payload (puzzles only; scores derived on client). */
export function toClientGameState(
  state: AppState,
  positions: Record<PlayerName, LatLng | null>,
) {
  return {
    puzzles: state.puzzles.map(p => toClientPuzzle(p, positions)),
  };
}

export { VALID_PLAYERS };
