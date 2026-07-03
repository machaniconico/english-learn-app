import { describe, it, expect } from 'vitest';
import { buildReviewQueue, isWeakPointMastered } from './reviewQueue';
import type { SRSCard } from '../hooks/useSpacedRepetition';
import type { WeakPoint } from '../hooks/useWeakPoints';

function srs(id: string): SRSCard {
  return {
    id,
    english: `english-${id}`,
    japanese: `日本語-${id}`,
    pronunciation: 'pron',
    source: 'src',
    interval: 1,
    easeFactor: 2.5,
    repetitions: 1,
    nextReview: '2026-01-01',
    lastReview: '2025-12-31',
  };
}

function weak(
  id: string,
  lastCorrect: boolean,
  reviewCount = 0,
  correctCount: number | undefined = 0,
): WeakPoint {
  const item: WeakPoint = {
    id,
    type: 'fill-in-blank',
    question: { x: 1 },
    wrongAnswer: 'wrong',
    correctAnswer: 'right',
    timestamp: 0,
    reviewCount,
    lastCorrect,
  };
  if (correctCount !== undefined) {
    item.correctCount = correctCount;
  }
  return item;
}

describe('isWeakPointMastered', () => {
  it('uses correctCount >= 2 as the canonical mastered threshold', () => {
    expect(isWeakPointMastered(weak('one-correct', true, 10, 1))).toBe(false);
    expect(isWeakPointMastered(weak('two-correct', true, 2, 2))).toBe(true);
    expect(isWeakPointMastered(weak('three-correct', true, 1, 3))).toBe(true);
  });

  it('treats legacy weak points without correctCount as not mastered', () => {
    expect(isWeakPointMastered(weak('legacy', true, 10, undefined))).toBe(false);
  });
});

describe('buildReviewQueue', () => {
  it('returns an empty queue when there is nothing due', () => {
    expect(buildReviewQueue([], [])).toEqual([]);
  });

  it('puts due SRS cards before weak points', () => {
    const q = buildReviewQueue([srs('a')], [weak('b', false)]);
    expect(q.map((i) => i.kind)).toEqual(['srs', 'weak']);
  });

  it('namespaces ids so srs and weak with the same id do not collide', () => {
    const q = buildReviewQueue([srs('1')], [weak('1', false)]);
    expect(q.map((i) => i.id)).toEqual(['srs-1', 'weak-1']);
  });

  it('prioritizes weak points answered incorrectly last time', () => {
    const q = buildReviewQueue(
      [],
      [weak('correct', true), weak('wrong', false)],
    );
    expect(q.map((i) => (i.kind === 'weak' ? i.weak.id : ''))).toEqual([
      'wrong',
      'correct',
    ]);
  });

  it('caps the queue at the limit (SRS kept first)', () => {
    const due = Array.from({ length: 5 }, (_, i) => srs(`s${i}`));
    const wps = Array.from({ length: 5 }, (_, i) => weak(`w${i}`, false));
    const q = buildReviewQueue(due, wps, 6);
    expect(q).toHaveLength(6);
    expect(q.filter((i) => i.kind === 'srs')).toHaveLength(5);
    expect(q.filter((i) => i.kind === 'weak')).toHaveLength(1);
  });

  it('drops mastered weak points after two consecutive correct reviews', () => {
    const q = buildReviewQueue([], [
      weak('mastered', true, 2, 2),
      weak('lucky-right-once', true, 2, 1),
      weak('legacy-review-count-only', true, 5, undefined),
      weak('still-wrong', false, 5, 0),
    ]);
    const ids = q.map((i) => (i.kind === 'weak' ? i.weak.id : ''));
    expect(ids).not.toContain('mastered');
    expect(ids).toContain('lucky-right-once');
    expect(ids).toContain('legacy-review-count-only');
    expect(ids).toContain('still-wrong');
  });

  it('does not mutate the input weakPoints array', () => {
    const wps = [weak('correct', true), weak('wrong', false)];
    const snapshot = wps.map((w) => w.id);
    buildReviewQueue([], wps);
    expect(wps.map((w) => w.id)).toEqual(snapshot);
  });
});
