import { describe, it, expect } from 'vitest';
import type { WeakPoint } from '../hooks/useWeakPoints';
import { isWeakPointMastered } from '../utils/reviewQueue';
import {
  isMastered,
  sortWeakPoints,
  filterAndSortWeakPoints,
  WEAKPOINT_SORT_OPTIONS,
  type WeakPointSortKey,
} from './weakPointsSort';

function wp(overrides: Partial<WeakPoint> & Pick<WeakPoint, 'id'>): WeakPoint {
  return {
    type: 'fill-in-blank',
    question: { sentence: 'x' },
    wrongAnswer: 'a',
    correctAnswer: 'b',
    timestamp: 1000,
    reviewCount: 0,
    lastCorrect: false,
    ...overrides,
  };
}

describe('isMastered', () => {
  it('is the same canonical predicate used by the review queue', () => {
    expect(isMastered).toBe(isWeakPointMastered);
  });

  it('is true when correctCount >= 2', () => {
    expect(isMastered(wp({ id: '1', lastCorrect: true, reviewCount: 2, correctCount: 2 }))).toBe(true);
    expect(isMastered(wp({ id: '2', lastCorrect: true, reviewCount: 1, correctCount: 3 }))).toBe(true);
  });

  it('is false when correctCount < 2 even if reviewCount is high', () => {
    expect(isMastered(wp({ id: '1', lastCorrect: true, reviewCount: 5, correctCount: 1 }))).toBe(false);
  });

  it('is false for legacy reviewCount-only weak points', () => {
    expect(isMastered(wp({ id: '1', lastCorrect: true, reviewCount: 5 }))).toBe(false);
  });
});

describe('WEAKPOINT_SORT_OPTIONS', () => {
  it('exposes all four sort keys with labels', () => {
    const keys = WEAKPOINT_SORT_OPTIONS.map((o) => o.key);
    expect(keys).toEqual(['newest', 'oldest', 'mostReviewed', 'leastReviewed']);
    for (const o of WEAKPOINT_SORT_OPTIONS) {
      expect(o.label.length).toBeGreaterThan(0);
    }
  });
});

describe('sortWeakPoints', () => {
  const a = wp({ id: 'a', timestamp: 300, reviewCount: 1 });
  const b = wp({ id: 'b', timestamp: 100, reviewCount: 5 });
  const c = wp({ id: 'c', timestamp: 200, reviewCount: 5 });
  const items = [a, b, c];

  it('newest = timestamp descending', () => {
    expect(sortWeakPoints(items, 'newest').map((x) => x.id)).toEqual(['a', 'c', 'b']);
  });

  it('oldest = timestamp ascending', () => {
    expect(sortWeakPoints(items, 'oldest').map((x) => x.id)).toEqual(['b', 'c', 'a']);
  });

  it('mostReviewed = reviewCount desc, ties broken by timestamp desc', () => {
    // b & c both reviewCount 5; c(ts200) before b(ts100). then a(1).
    expect(sortWeakPoints(items, 'mostReviewed').map((x) => x.id)).toEqual(['c', 'b', 'a']);
  });

  it('leastReviewed = reviewCount asc, ties broken by timestamp desc', () => {
    // a(1) first; then b&c(5) tie -> c(ts200) before b(ts100).
    expect(sortWeakPoints(items, 'leastReviewed').map((x) => x.id)).toEqual(['a', 'c', 'b']);
  });

  it('is non-destructive (does not mutate input)', () => {
    const input = [a, b, c];
    const snapshot = input.map((x) => x.id);
    sortWeakPoints(input, 'mostReviewed');
    expect(input.map((x) => x.id)).toEqual(snapshot);
  });

  it('is stable for fully-equal sort keys', () => {
    const e1 = wp({ id: 'e1', timestamp: 500, reviewCount: 2 });
    const e2 = wp({ id: 'e2', timestamp: 500, reviewCount: 2 });
    const e3 = wp({ id: 'e3', timestamp: 500, reviewCount: 2 });
    const order = sortWeakPoints([e1, e2, e3], 'mostReviewed').map((x) => x.id);
    expect(order).toEqual(['e1', 'e2', 'e3']);
  });
});

describe('filterAndSortWeakPoints', () => {
  const fib1 = wp({ id: 'fib1', type: 'fill-in-blank', timestamp: 100, reviewCount: 0 });
  const fib2 = wp({
    id: 'fib2',
    type: 'fill-in-blank',
    timestamp: 300,
    reviewCount: 4,
    correctCount: 2,
    lastCorrect: true,
  });
  const p2 = wp({ id: 'p2', type: 'part2', timestamp: 200, reviewCount: 1 });
  const items = [fib1, fib2, p2];

  it('filters by type', () => {
    const r = filterAndSortWeakPoints(items, { type: 'part2', unmasteredOnly: false, sort: 'newest' });
    expect(r.map((x) => x.id)).toEqual(['p2']);
  });

  it('unmasteredOnly removes mastered items', () => {
    // fib2 is mastered (correctCount 2)
    const r = filterAndSortWeakPoints(items, { type: 'all', unmasteredOnly: true, sort: 'newest' });
    expect(r.map((x) => x.id).sort()).toEqual(['fib1', 'p2']);
  });

  it('combines type + unmasteredOnly + sort', () => {
    const r = filterAndSortWeakPoints(items, {
      type: 'fill-in-blank',
      unmasteredOnly: true,
      sort: 'newest',
    });
    expect(r.map((x) => x.id)).toEqual(['fib1']);
  });

  it('applies sort after filtering', () => {
    const r = filterAndSortWeakPoints(items, { type: 'all', unmasteredOnly: false, sort: 'oldest' });
    expect(r.map((x) => x.id)).toEqual(['fib1', 'p2', 'fib2']);
  });

  it('is non-destructive', () => {
    const input = [fib1, fib2, p2];
    const snapshot = input.map((x) => x.id);
    filterAndSortWeakPoints(input, { type: 'all', unmasteredOnly: true, sort: 'mostReviewed' });
    expect(input.map((x) => x.id)).toEqual(snapshot);
  });

  it('returns empty array when no items match', () => {
    const allKeys: WeakPointSortKey[] = ['newest', 'oldest', 'mostReviewed', 'leastReviewed'];
    for (const sort of allKeys) {
      const r = filterAndSortWeakPoints([fib2], { type: 'all', unmasteredOnly: true, sort });
      expect(r).toEqual([]);
    }
  });
});
