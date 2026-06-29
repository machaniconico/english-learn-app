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
 * 直近 limit 件の平均精度(%)を四捨五入で返す。履歴が無ければ 0。
 */
export function recentAccuracyAverage(
  record: TypingRecord,
  limit: number = TYPING_HISTORY_LIMIT,
): number {
  const slice = record.history.slice(0, Math.max(0, limit));
  if (slice.length === 0) return 0;
  const sum = slice.reduce((s, a) => s + a.pct, 0);
  return Math.round(sum / slice.length);
}

/**
 * 向上トレンド(%)。履歴ウィンドウ内で「最新の pct - 最古の pct」を返す。
 * 履歴が2件未満なら 0(トレンド算出不可)。正なら上達、負なら低下。
 */
export function accuracyTrend(record: TypingRecord): number {
  const h = record.history;
  if (h.length < 2) return 0;
  return h[0].pct - h[h.length - 1].pct;
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
