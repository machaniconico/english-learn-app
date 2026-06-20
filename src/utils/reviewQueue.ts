import type { SRSCard } from '../hooks/useSpacedRepetition';
import type { WeakPoint } from '../hooks/useWeakPoints';

// A unified "今日の復習" queue item: either a spaced-repetition card that is due,
// or a recorded weak point. The queue id is namespaced so an SRS card and a weak
// point that happen to share an underlying id never collide.
export type ReviewItem =
  | { kind: 'srs'; id: string; card: SRSCard }
  | { kind: 'weak'; id: string; weak: WeakPoint };

export const REVIEW_QUEUE_LIMIT = 40;

/**
 * A weak point is considered "mastered" (and dropped from review) once it has
 * been recalled correctly at least twice — otherwise the queue would accumulate
 * a permanent backlog of items the learner already knows.
 */
export function isWeakPointMastered(wp: WeakPoint): boolean {
  return wp.lastCorrect && wp.reviewCount >= 2;
}

/**
 * Build the daily review queue: due SRS cards first (time-sensitive), then
 * not-yet-mastered weak points with the ones answered incorrectly last time
 * prioritized. Capped so a session stays reasonable.
 */
export function buildReviewQueue(
  dueCards: SRSCard[],
  weakPoints: WeakPoint[],
  limit: number = REVIEW_QUEUE_LIMIT,
): ReviewItem[] {
  const srs: ReviewItem[] = dueCards.map((card) => ({
    kind: 'srs',
    id: `srs-${card.id}`,
    card,
  }));

  // lastCorrect === false should come first (Number(false)=0 sorts ahead of 1)
  const sortedWeak = [...weakPoints]
    .filter((w) => !isWeakPointMastered(w))
    .sort((a, b) => Number(a.lastCorrect) - Number(b.lastCorrect));
  const weak: ReviewItem[] = sortedWeak.map((w) => ({
    kind: 'weak',
    id: `weak-${w.id}`,
    weak: w,
  }));

  return [...srs, ...weak].slice(0, limit);
}
