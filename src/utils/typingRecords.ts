/** A single completed typing-practice run. */
export interface TypingAttempt {
  /** Accuracy percentage for the run (0-100). */
  pct: number;
  /** Number of correct answers in the run. */
  correct: number;
  /** Total number of questions in the run. */
  total: number;
  /** When the run finished (epoch ms). */
  timestamp: number;
}

/** Persisted typing-practice record: best score, play count, recent history. */
export interface TypingRecord {
  /** Best accuracy percentage ever reached (0-100). */
  bestPct: number;
  /** Total number of completed plays. */
  plays: number;
  /** Most recent attempts, newest first, capped at TYPING_HISTORY_LIMIT. */
  history: TypingAttempt[];
}

/** Maximum number of recent attempts kept in history. */
export const TYPING_HISTORY_LIMIT = 10;

/** Pure: a fresh, empty record. */
export function emptyTypingRecord(): TypingRecord {
  return { bestPct: 0, plays: 0, history: [] };
}

/**
 * Pure: whether `pct` would set a new personal best.
 * A new best requires strictly beating the previous best.
 * On the very first play (best 0) any pct > 0 counts; pct === 0 never counts.
 */
export function isNewTypingBest(prev: TypingRecord, pct: number): boolean {
  return pct > prev.bestPct;
}

/**
 * Pure (non-destructive, deterministic): fold a completed attempt into the record.
 * Does not call Date.now — the timestamp must come in on `attempt`.
 */
export function recordTypingAttempt(
  prev: TypingRecord,
  attempt: TypingAttempt,
): TypingRecord {
  return {
    bestPct: Math.max(prev.bestPct, attempt.pct),
    plays: prev.plays + 1,
    history: [attempt, ...prev.history].slice(0, TYPING_HISTORY_LIMIT),
  };
}
