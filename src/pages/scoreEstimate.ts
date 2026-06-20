// Pure TOEIC score-estimation logic, extracted from ScoreEstimator.tsx so it can
// be unit-tested in isolation. These functions contain no React/DOM dependencies.

/** Clamp `value` to the inclusive range [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map an average percentage (0-100) to a coarse skill label.
 * Thresholds: >=90 expert, >=70 advanced, >=40 intermediate, else beginner.
 */
export function determineSkillLevel(avg: number): string {
  if (avg >= 90) return 'expert';
  if (avg >= 70) return 'advanced';
  if (avg >= 40) return 'intermediate';
  return 'beginner';
}

export interface ScoreEstimateInput {
  /** Fill-in-blank (Part 5) average percentages per level (0-100). */
  fillIn: { beginner: number; intermediate: number; advanced: number };
  /** Reading (Part 7) average percentages per level (0-100). */
  reading: { beginner: number; intermediate: number; advanced: number };
  /** Total completed learning items across all sections. */
  completedItems: number;
  /** Total learning items across all sections. */
  totalItems: number;
}

export interface ScoreEstimateResult {
  score: number;
  low: number;
  high: number;
}

/**
 * Estimate a TOEIC score (10-990) from per-level practice averages plus an
 * overall completion bonus. Drop-in replacement for the inline math that used
 * to live in ScoreEstimator's `estimate` useMemo — same weights, clamps, and
 * rounding order.
 *
 * Base 200, then:
 *   fill-in beginner/intermediate/advanced weighted +0-100 / +0-150 / +0-200
 *   reading beginner/intermediate/advanced weighted +0-50 / +0-100 / +0-150
 *   completion bonus clamp(completedItems/totalItems, 0, 1) * 100
 * Score is rounded, then low = clamp(score-50, 10, 990),
 * high = clamp(score+50, 10, 990), score = clamp(score, 10, 990).
 */
export function estimateToeicScore(input: ScoreEstimateInput): ScoreEstimateResult {
  const { fillIn, reading, completedItems, totalItems } = input;

  let score = 200; // TOEIC minimum base

  // Fill-in-blank contribution
  score += (fillIn.beginner / 100) * 100; // beginner: +0-100
  score += (fillIn.intermediate / 100) * 150; // intermediate: +0-150
  score += (fillIn.advanced / 100) * 200; // advanced: +0-200

  // Reading contribution
  score += (reading.beginner / 100) * 50; // beginner: +0-50
  score += (reading.intermediate / 100) * 100; // intermediate: +0-100
  score += (reading.advanced / 100) * 150; // advanced: +0-150

  // Completion bonus
  const completionPct = totalItems > 0 ? completedItems / totalItems : 0;
  score += clamp(completionPct, 0, 1) * 100; // +0-100

  score = Math.round(score);
  const low = clamp(score - 50, 10, 990);
  const high = clamp(score + 50, 10, 990);
  score = clamp(score, 10, 990);

  return { score, low, high };
}
