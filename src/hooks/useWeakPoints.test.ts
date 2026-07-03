import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  upsertWeakPoint,
  markReviewedIn,
  MAX_ITEMS,
  useWeakPoints,
  type WeakPoint,
} from './useWeakPoints';
import { isWeakPointMastered } from '../utils/reviewQueue';

const STORAGE_KEY = 'english-learn-weak-points';

type NewWp = Omit<WeakPoint, 'timestamp' | 'reviewCount' | 'correctCount' | 'lastCorrect'>;

function makeNew(id: string, overrides: Partial<NewWp> = {}): NewWp {
  return {
    id,
    type: 'fill-in-blank',
    question: { prompt: id },
    wrongAnswer: 'wrong',
    correctAnswer: 'right',
    ...overrides,
  };
}

function makeExisting(id: string, overrides: Partial<WeakPoint> = {}): WeakPoint {
  return {
    id,
    type: 'fill-in-blank',
    question: { prompt: id },
    wrongAnswer: 'wrong',
    correctAnswer: 'right',
    timestamp: 1000,
    reviewCount: 0,
    correctCount: 0,
    lastCorrect: false,
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('useWeakPoints storage loading resilience', () => {
  it.each(['null', '{}', '"oops"', '42'])(
    'falls back to empty weak points when localStorage contains non-array JSON: %s',
    (raw) => {
      localStorage.setItem(STORAGE_KEY, raw);

      const { result } = renderHook(() => useWeakPoints());

      expect(result.current.weakPoints).toEqual([]);
      expect(result.current.getWeakPointsByType('fill-in-blank')).toEqual([]);
    },
  );

  it('filters malformed stored weak point entries and keeps valid weak points', () => {
    const valid = makeExisting('valid-wp');
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        valid,
        null,
        'oops',
        { id: 'missing-fields' },
        { ...valid, reviewCount: 'bad' },
        { ...valid, correctCount: 'bad' },
      ]),
    );

    const { result } = renderHook(() => useWeakPoints());

    expect(result.current.weakPoints).toEqual([valid]);
    expect(result.current.getWeakPointsByType('fill-in-blank')).toEqual([valid]);
  });

  it('keeps legacy weak points that do not have correctCount', () => {
    const legacy: Omit<WeakPoint, 'correctCount'> = {
      id: 'legacy-wp',
      type: 'fill-in-blank',
      question: { prompt: 'legacy-wp' },
      wrongAnswer: 'wrong',
      correctAnswer: 'right',
      timestamp: 1000,
      reviewCount: 2,
      lastCorrect: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([legacy]));

    const { result } = renderHook(() => useWeakPoints());

    expect(result.current.weakPoints).toEqual([legacy]);
  });
});

describe('upsertWeakPoint', () => {
  it('prepends a new id with reviewCount 0, correctCount 0, lastCorrect false, and the given timestamp', () => {
    const prev: WeakPoint[] = [makeExisting('a', { timestamp: 500 })];
    const next = upsertWeakPoint(prev, makeNew('b'), 2000);

    expect(next).toHaveLength(2);
    expect(next[0].id).toBe('b');
    expect(next[0].reviewCount).toBe(0);
    expect(next[0].correctCount).toBe(0);
    expect(next[0].lastCorrect).toBe(false);
    expect(next[0].timestamp).toBe(2000);
    // existing item is preserved after the new one
    expect(next[1].id).toBe('a');
  });

  it('updates an existing id in place without duplicating and resets mastery progress', () => {
    const prev: WeakPoint[] = [
      makeExisting('a', { timestamp: 500, reviewCount: 3, correctCount: 2, lastCorrect: true }),
      makeExisting('b', { timestamp: 600 }),
    ];
    const next = upsertWeakPoint(
      prev,
      makeNew('a', { wrongAnswer: 'newWrong', correctAnswer: 'newRight', question: { v: 9 } }),
      3000,
    );

    // no duplicate
    expect(next).toHaveLength(2);
    expect(next.filter((w) => w.id === 'a')).toHaveLength(1);

    const updated = next.find((w) => w.id === 'a')!;
    expect(updated.wrongAnswer).toBe('newWrong');
    expect(updated.correctAnswer).toBe('newRight');
    expect(updated.question).toEqual({ v: 9 });
    expect(updated.timestamp).toBe(3000);
    expect(updated.correctCount).toBe(0);
    expect(updated.lastCorrect).toBe(false);
    // reviewCount is NOT reset on upsert (preserved in place)
    expect(updated.reviewCount).toBe(3);
  });

  it('caps at MAX_ITEMS keeping only the newest by timestamp', () => {
    // Build MAX_ITEMS existing items with ascending timestamps (id-0 oldest).
    const prev: WeakPoint[] = Array.from({ length: MAX_ITEMS }, (_, i) =>
      makeExisting(`id-${i}`, { timestamp: i }),
    );
    // Add one more (newest) -> exceeds cap by 1.
    const next = upsertWeakPoint(prev, makeNew('newest'), MAX_ITEMS + 1000);

    expect(next).toHaveLength(MAX_ITEMS);
    // newest must be present; the oldest (timestamp 0 -> id-0) must be dropped.
    expect(next.some((w) => w.id === 'newest')).toBe(true);
    expect(next.some((w) => w.id === 'id-0')).toBe(false);
    // all remaining timestamps are the highest MAX_ITEMS values, sorted desc.
    const timestamps = next.map((w) => w.timestamp);
    const sortedDesc = [...timestamps].sort((a, b) => b - a);
    expect(timestamps).toEqual(sortedDesc);
    expect(timestamps[0]).toBe(MAX_ITEMS + 1000);
  });
});

describe('markReviewedIn', () => {
  it('increments reviewCount and correctCount, sets lastCorrect, and bumps timestamp for the matching id only', () => {
    const prev: WeakPoint[] = [
      makeExisting('a', { timestamp: 500, reviewCount: 2, correctCount: 1, lastCorrect: true }),
      makeExisting('b', { timestamp: 600, reviewCount: 0, lastCorrect: false }),
    ];
    const next = markReviewedIn(prev, 'a', true, 4000);

    const a = next.find((w) => w.id === 'a')!;
    expect(a.reviewCount).toBe(3);
    expect(a.correctCount).toBe(2);
    expect(a.lastCorrect).toBe(true);
    expect(a.timestamp).toBe(4000);

    // unrelated item untouched
    const b = next.find((w) => w.id === 'b')!;
    expect(b.reviewCount).toBe(0);
    expect(b.correctCount).toBe(0);
    expect(b.lastCorrect).toBe(false);
    expect(b.timestamp).toBe(600);
  });

  it('resets correctCount and sets lastCorrect to false when reviewed incorrectly', () => {
    const prev: WeakPoint[] = [makeExisting('a', { reviewCount: 1, correctCount: 1, lastCorrect: true })];
    const next = markReviewedIn(prev, 'a', false, 5000);

    expect(next[0].reviewCount).toBe(2);
    expect(next[0].correctCount).toBe(0);
    expect(next[0].lastCorrect).toBe(false);
    expect(next[0].timestamp).toBe(5000);
  });

  it('does not master a wrong-then-right item after only one correct review', () => {
    let next = [makeExisting('a')];
    next = markReviewedIn(next, 'a', false, 2000);
    next = markReviewedIn(next, 'a', true, 3000);

    expect(next[0].reviewCount).toBe(2);
    expect(next[0].correctCount).toBe(1);
    expect(next[0].lastCorrect).toBe(true);
    expect(isWeakPointMastered(next[0])).toBe(false);
  });

  it('masters a weak point after two consecutive correct reviews', () => {
    let next = [makeExisting('a')];
    next = markReviewedIn(next, 'a', true, 2000);
    next = markReviewedIn(next, 'a', true, 3000);

    expect(next[0].reviewCount).toBe(2);
    expect(next[0].correctCount).toBe(2);
    expect(isWeakPointMastered(next[0])).toBe(true);
  });
});
