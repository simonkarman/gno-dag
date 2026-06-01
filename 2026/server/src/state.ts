import { Storage } from '@google-cloud/storage';
import { LatLng } from './geo-transform';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export const VALID_PLAYERS = ['Govie', 'Jac.'] as const;
export type PlayerName = typeof VALID_PLAYERS[number];

/**
 * Display state of a puzzle. Derived (never stored): only `completed` is persisted.
 * - locked: assigned player lacks the points or requirements aren't met
 * - open: ready to be solved
 * - completed: already solved
 */
export type PuzzleState = 'locked' | 'open' | 'completed';

/** A piece of content rendered inside a puzzle panel. */
export type ContentElement =
  | { type: 'text'; value: string }
  | { type: 'image'; url: string; alt?: string };

/**
 * Server-only conditions evaluated using both players' latest known GPS. A
 * requirement does NOT influence the locked/open state of a puzzle; instead it
 * conditionally mutates the puzzle's `content` before it is sent to clients.
 *
 * Each requirement evaluates to a boolean (`met`). When `met !== expected`, the
 * requirement's `content` is applied to the puzzle's content according to `mode`:
 * - replace: the puzzle's content becomes exactly this requirement's content.
 * - append: this requirement's content is appended to the puzzle's content.
 *
 * Condition meanings:
 * - no-other-player-within: met when the other player is FURTHER than `meters` from the puzzle.
 * - other-player-at-location: met when the other player is WITHIN `meters` of `location`.
 */
interface RequirementBase {
  /** Expected value of the condition under "normal" circumstances. */
  expected: boolean;
  /** How `content` is applied when the condition does not equal `expected`. */
  mode: 'replace' | 'append';
  /** Content applied when the condition does not equal `expected`. */
  content: ContentElement[];
}

export type Requirement =
  | (RequirementBase & { type: 'no-other-player-within'; meters: number })
  | (RequirementBase & { type: 'other-player-at-location'; location: LatLng; meters: number });

export interface Puzzle {
  id: string;
  /** Emoji or short label shown on the map marker. */
  icon: string;
  /** Real-world position of the puzzle. */
  location: LatLng;
  /** Which player this puzzle is assigned to. */
  assignedTo: PlayerName;
  /** Minimum score the assigned player needs before the puzzle can open. */
  minimumPoints: number;
  /** Extra conditions that conditionally mutate the displayed content. */
  requirements: Requirement[];
  /** Correct answer (case-insensitive, trimmed). NEVER sent to clients. */
  answer: string;
  /** Content shown when the player is at the puzzle. */
  content: ContentElement[];
  /**
   * Whether the puzzle has been solved. This is the ONLY persisted state — the
   * locked/open distinction is always derived from scores + positions.
   */
  completed: boolean;
}

/**
 * Persisted shape (in GCS): only puzzles. Scores are always derived from the
 * set of completed puzzles, so they are never stored.
 */
export interface PersistedState {
  puzzles: Puzzle[];
}

/** In-memory state: persisted puzzles plus a derived, always-up-to-date scores map. */
export interface AppState {
  puzzles: Puzzle[];
  scores: Record<PlayerName, number>;
}

/** How close (in metres) a player must be to interact with a puzzle. */
export const PUZZLE_PROXIMITY_METERS = 10;

/** Computes each player's score as their number of completed puzzles. */
export function computeScores(puzzles: Puzzle[]): Record<PlayerName, number> {
  const scores: Record<PlayerName, number> = { 'Govie': 0, 'Jac.': 0 };
  for (const puzzle of puzzles) {
    if (puzzle.completed) scores[puzzle.assignedTo] += 1;
  }
  return scores;
}

// ---------------------------------------------------------------------------
// Default / empty state
// ---------------------------------------------------------------------------

function emptyState(): AppState {
  return {
    puzzles: [],
    scores: { 'Govie': 0, 'Jac.': 0 },
  };
}

/** Normalises a loaded state, filling in any missing fields with safe defaults. */
function normalise(raw: Partial<PersistedState> | undefined | null): AppState {
  const base = emptyState();
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.puzzles)) return base;
  const puzzles = raw.puzzles.map(p => ({ ...p, completed: !!p.completed }));
  return { puzzles, scores: computeScores(puzzles) };
}

// ---------------------------------------------------------------------------
// GCS-backed store: in-memory authoritative state, fire-and-forget sync.
// ---------------------------------------------------------------------------

export class StateStore {
  private state: AppState = emptyState();
  private readonly storage = new Storage();

  constructor(
    private readonly bucket: string,
    private readonly blob: string,
  ) {}

  /** The current in-memory state. */
  get(): AppState {
    return this.state;
  }

  /** Loads state from GCS into memory. Falls back to empty state if the blob is missing. */
  async load(): Promise<void> {
    try {
      const file = this.storage.bucket(this.bucket).file(this.blob);
      const [exists] = await file.exists();
      if (!exists) {
        console.info(`[info] [gno-2026] [state] blob gs://${this.bucket}/${this.blob} not found — starting empty`);
        this.state = emptyState();
        return;
      }
      const [contents] = await file.download();
      this.state = normalise(JSON.parse(contents.toString('utf-8')));
      console.info(`[info] [gno-2026] [state] loaded ${this.state.puzzles.length} puzzles from gs://${this.bucket}/${this.blob}`);
    } catch (e) {
      console.error(`[error] [gno-2026] [state] failed to load state — starting empty: ${(e as Error).message}`);
      this.state = emptyState();
    }
  }

  /** Fire-and-forget persist of the current in-memory state to GCS. */
  save(): void {
    const file = this.storage.bucket(this.bucket).file(this.blob);
    const persisted: PersistedState = { puzzles: this.state.puzzles };
    file
      .save(JSON.stringify(persisted, null, 2), { contentType: 'application/json' })
      .then(() => console.debug(`[debug] [gno-2026] [state] saved to gs://${this.bucket}/${this.blob}`))
      .catch(e => console.error(`[error] [gno-2026] [state] failed to save state: ${(e as Error).message}`));
  }
}
