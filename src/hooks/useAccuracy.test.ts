import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeOverallAccuracy,
  computeAccuracyByType,
  computeAccuracyByLevel,
  computeRecentTrend,
  computeWeakestTypes,
  trimResults,
  type QuizResult,
} from './useAccuracy';

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

  it('sums correct/total and counts attempts per type', () => {
    const results = [
      makeResult({ type: 'reading', correct: 1, total: 2 }),
      makeResult({ type: 'reading', correct: 1, total: 2 }),
      makeResult({ type: 'dictation', correct: 3, total: 4 }),
    ];
    const byType = computeAccuracyByType(results);
    const reading = byType.find((t) => t.type === 'reading');
    const dictation = byType.find((t) => t.type === 'dictation');
    expect(reading).toEqual({ type: 'reading', accuracy: 50, attempts: 2 });
    expect(dictation).toEqual({ type: 'dictation', accuracy: 75, attempts: 1 });
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
