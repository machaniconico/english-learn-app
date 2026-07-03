import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  computeOverallAccuracy,
  computeAccuracyByType,
  computeAccuracyByLevel,
  computeRecentTrend,
  computeWeakestTypes,
  trimResults,
  useAccuracy,
  type QuizResult,
} from './useAccuracy';

const STORAGE_KEY = 'english-learn-accuracy';

function makeResult(partial: Partial<QuizResult> & Pick<QuizResult, 'type'>): QuizResult {
  return {
    setId: 'set',
    score: 0,
    total: 0,
    correct: 0,
    timestamp: 1_000,
    ...partial,
  };
}

function storedResults(): QuizResult[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as QuizResult[];
}

beforeEach(() => {
  localStorage.clear();
});

describe('computeOverallAccuracy', () => {
  it('returns 0 for empty input', () => {
    expect(computeOverallAccuracy([])).toBe(0);
  });

  it('returns 0 when there are no questions', () => {
    const results = [makeResult({ type: 'reading', correct: 0, total: 0 })];
    expect(computeOverallAccuracy(results)).toBe(0);
  });

  it('rounds correct/total to a whole percent (2/3 -> 67)', () => {
    const results = [
      makeResult({ type: 'reading', correct: 1, total: 1 }),
      makeResult({ type: 'reading', correct: 1, total: 2 }),
    ];
    // total correct 2, total questions 3 -> 66.66.. -> 67
    expect(computeOverallAccuracy(results)).toBe(67);
  });
});

describe('computeAccuracyByType', () => {
  it('returns [] for empty input', () => {
    expect(computeAccuracyByType([])).toEqual([]);
  });

  it('returns question totals and counts attempts per type', () => {
    const results = [
      makeResult({ type: 'reading', correct: 1, total: 2 }),
      makeResult({ type: 'reading', correct: 1, total: 2 }),
      makeResult({ type: 'dictation', correct: 3, total: 4 }),
    ];
    const byType = computeAccuracyByType(results);
    const reading = byType.find((t) => t.type === 'reading');
    const dictation = byType.find((t) => t.type === 'dictation');
    expect(reading).toEqual({ type: 'reading', accuracy: 50, attempts: 2, total: 4 });
    expect(dictation).toEqual({ type: 'dictation', accuracy: 75, attempts: 1, total: 4 });
  });

  it('keeps drill in the type breakdown', () => {
    const results = [
      makeResult({ type: 'drill', correct: 1, total: 10 }),
      makeResult({ type: 'reading', correct: 8, total: 10 }),
    ];

    expect(computeAccuracyByType(results).find((t) => t.type === 'drill')).toEqual({
      type: 'drill',
      accuracy: 10,
      attempts: 1,
      total: 10,
    });
  });
});

describe('useAccuracy', () => {
  it('saves at most 500 results after appending a new result', () => {
    const existing = Array.from({ length: 500 }, (_, i) => makeResult({ type: 'reading', score: i }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    const { result } = renderHook(() => useAccuracy());
    act(() => {
      result.current.logResult({
        type: 'reading',
        setId: 'new',
        score: 999,
        total: 1,
        correct: 1,
      });
    });

    const saved = storedResults();
    expect(saved).toHaveLength(500);
    expect(saved[0].score).toBe(1);
    expect(saved[saved.length - 1]).toMatchObject({ setId: 'new', score: 999 });
  });
});

describe('computeAccuracyByLevel', () => {
  it('returns [] for empty input', () => {
    expect(computeAccuracyByLevel([])).toEqual([]);
  });

  it('groups by level and excludes results without a level (unknown)', () => {
    const results = [
      makeResult({ type: 'reading', correct: 1, total: 2, level: 'A1' }),
      makeResult({ type: 'reading', correct: 2, total: 2, level: 'A1' }),
      makeResult({ type: 'reading', correct: 1, total: 2, level: 'B1' }),
      makeResult({ type: 'reading', correct: 0, total: 2 }), // no level -> unknown, excluded
    ];
    const byLevel = computeAccuracyByLevel(results);
    expect(byLevel.find((l) => l.level === 'unknown')).toBeUndefined();
    expect(byLevel.find((l) => l.level === 'A1')).toEqual({
      level: 'A1',
      accuracy: 75, // 3/4
      attempts: 2,
    });
    expect(byLevel.find((l) => l.level === 'B1')).toEqual({
      level: 'B1',
      accuracy: 50,
      attempts: 1,
    });
  });
});

describe('computeWeakestTypes', () => {
  it('returns [] for empty input', () => {
    expect(computeWeakestTypes([])).toEqual([]);
  });

  it('returns all types within +5 of the minimum accuracy', () => {
    // accuracies: reading 50, dictation 53, part1 70
    const results = [
      makeResult({ type: 'reading', correct: 50, total: 100 }),
      makeResult({ type: 'dictation', correct: 53, total: 100 }),
      makeResult({ type: 'part1', correct: 70, total: 100 }),
    ];
    const weakest = computeWeakestTypes(results);
    expect(weakest).toContain('reading');
    expect(weakest).toContain('dictation'); // 53 <= 50 + 5
    expect(weakest).not.toContain('part1'); // 70 > 55
  });

  it('excludes drill from weakest type calculation', () => {
    const results = [
      makeResult({ type: 'drill', correct: 0, total: 100 }),
      makeResult({ type: 'reading', correct: 50, total: 100 }),
      makeResult({ type: 'dictation', correct: 53, total: 100 }),
      makeResult({ type: 'part1', correct: 70, total: 100 }),
    ];

    const weakest = computeWeakestTypes(results);
    expect(weakest).not.toContain('drill');
    expect(weakest).toEqual(expect.arrayContaining(['reading', 'dictation']));
    expect(weakest).not.toContain('part1');
  });

  it('returns [] when only drill results exist', () => {
    const results = [
      makeResult({ type: 'drill', correct: 0, total: 10 }),
      makeResult({ type: 'drill', correct: 10, total: 10 }),
    ];

    expect(computeWeakestTypes(results)).toEqual([]);
  });
});

describe('computeRecentTrend', () => {
  it('returns [] for empty input', () => {
    expect(computeRecentTrend([], 'reading', 3)).toEqual([]);
  });

  it('returns the last N scores of the given type in order', () => {
    const results = [
      makeResult({ type: 'reading', score: 10 }),
      makeResult({ type: 'dictation', score: 99 }),
      makeResult({ type: 'reading', score: 20 }),
      makeResult({ type: 'reading', score: 30 }),
      makeResult({ type: 'reading', score: 40 }),
    ];
    expect(computeRecentTrend(results, 'reading', 3)).toEqual([20, 30, 40]);
  });
});

describe('trimResults', () => {
  it('returns the array unchanged when at or below the cap', () => {
    const results = [
      makeResult({ type: 'reading', score: 1 }),
      makeResult({ type: 'reading', score: 2 }),
    ];
    expect(trimResults(results)).toBe(results);
  });

  it('keeps the newest MAX_RESULTS (500) when over the cap', () => {
    const results: QuizResult[] = [];
    for (let i = 0; i < 502; i++) {
      results.push(makeResult({ type: 'reading', score: i }));
    }
    const trimmed = trimResults(results);
    expect(trimmed.length).toBe(500);
    // newest kept: scores 2..501 (oldest two dropped)
    expect(trimmed[0].score).toBe(2);
    expect(trimmed[trimmed.length - 1].score).toBe(501);
  });
});
