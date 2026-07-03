// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  computeLevelFromAnswers,
  estimateToeicFromLevel,
  getLevelIndex,
  isLevelAtLeast,
  mapContentLevel,
  useUserLevel,
} from './useUserLevel';
import { levelTestQuestions } from '../data/levelTest';
import type { CEFRLevel } from './useUserLevel';

// In the diagnostic data, every correct answer is at correctIndex 0.
// So answering 0 = correct, answering a non-zero index = wrong.
const CORRECT = 0;
const WRONG = 1;

function questionsForLevel(level: CEFRLevel) {
  return levelTestQuestions.filter((q) => q.level === level);
}

/**
 * Build an answers map. For each level, answer the first `correctCount`
 * questions correctly and the rest wrong. Levels not present in `plan`
 * are left unanswered.
 */
function buildAnswers(plan: Partial<Record<CEFRLevel, number>>): Record<string, number> {
  const answers: Record<string, number> = {};
  for (const [level, correctCount] of Object.entries(plan) as [CEFRLevel, number][]) {
    const qs = questionsForLevel(level);
    qs.forEach((q, i) => {
      answers[q.id] = i < correctCount ? CORRECT : WRONG;
    });
  }
  return answers;
}

beforeEach(() => {
  localStorage.clear();
});

describe('CEFR helpers', () => {
  it('getLevelIndex returns the CEFR order index', () => {
    expect(getLevelIndex('A1')).toBe(0);
    expect(getLevelIndex('A2')).toBe(1);
    expect(getLevelIndex('B1')).toBe(2);
    expect(getLevelIndex('B2')).toBe(3);
    expect(getLevelIndex('C1')).toBe(4);
  });

  it('isLevelAtLeast compares levels by CEFR order', () => {
    expect(isLevelAtLeast('B2', 'B1')).toBe(true);
    expect(isLevelAtLeast('B2', 'B2')).toBe(true);
    expect(isLevelAtLeast('A2', 'B1')).toBe(false);
  });

  it('mapContentLevel maps lesson content levels to CEFR levels', () => {
    expect(mapContentLevel('beginner')).toBe('A2');
    expect(mapContentLevel('intermediate')).toBe('B1');
    expect(mapContentLevel('advanced')).toBe('B2');
  });

  it('estimateToeicFromLevel returns min, max, and rounded midpoint', () => {
    expect(estimateToeicFromLevel('A1')).toEqual({ min: 120, max: 220, mid: 170 });
    expect(estimateToeicFromLevel('B2')).toEqual({ min: 785, max: 940, mid: 863 });
    expect(estimateToeicFromLevel('C1')).toEqual({ min: 945, max: 990, mid: 968 });
  });
});

describe('computeLevelFromAnswers', () => {
  it('perfect score on every level yields the top reachable level (C1)', () => {
    const answers: Record<string, number> = {};
    for (const q of levelTestQuestions) {
      answers[q.id] = CORRECT;
    }
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('C1');
    // Sanity: each level tallied 5/5.
    for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]) {
      expect(result.scoreByLevel[lvl]).toEqual({ correct: 5, total: 5 });
    }
  });

  it('all-wrong answers yield the lowest level (A1)', () => {
    const answers: Record<string, number> = {};
    for (const q of levelTestQuestions) {
      answers[q.id] = WRONG;
    }
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('A1');
    expect(result.scoreByLevel.A1).toEqual({ correct: 0, total: 5 });
  });

  it('passes A1 and A2 (3/5 each) but fails B1 (2/5) -> A2', () => {
    const answers = buildAnswers({ A1: 3, A2: 3, B1: 2 });
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('A2');
    expect(result.scoreByLevel.A1.correct).toBe(3);
    expect(result.scoreByLevel.A2.correct).toBe(3);
    expect(result.scoreByLevel.B1.correct).toBe(2);
  });

  it('passes A1/A2/B1 (5/5 each) but fails B2 (0/5) -> B1', () => {
    const answers = buildAnswers({ A1: 5, A2: 5, B1: 5, B2: 0 });
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('B1');
    expect(result.scoreByLevel.B1.correct).toBe(5);
    expect(result.scoreByLevel.B2.correct).toBe(0);
  });

  it('stops at the first failed level even if a later level would pass (A1 pass, A2 fail) -> A1', () => {
    // A2 fails (break) so B1 success is never reached.
    const answers = buildAnswers({ A1: 5, A2: 2, B1: 5 });
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('A1');
  });
});

describe('useUserLevel load fallback behavior', () => {
  it('falls back to A1 when stored level is invalid', () => {
    localStorage.setItem('english-learn-user-level', JSON.stringify({
      level: 'Z9',
      diagnosedAt: 123,
      levelHistory: [{ level: 'B1', date: '2026-01-01', source: 'diagnostic' }],
    }));

    const { result } = renderHook(() => useUserLevel());

    expect(result.current.level).toBe('A1');
    expect(result.current.diagnosedAt).toBe(123);
    expect(result.current.levelHistory).toEqual([
      { level: 'B1', date: '2026-01-01', source: 'diagnostic' },
    ]);
  });

  it('falls back to null when stored diagnosedAt is not numeric', () => {
    localStorage.setItem('english-learn-user-level', JSON.stringify({
      level: 'B2',
      diagnosedAt: 'yesterday',
      levelHistory: [{ level: 'B2', date: '2026-01-01', source: 'diagnostic' }],
    }));

    const { result } = renderHook(() => useUserLevel());

    expect(result.current.level).toBe('B2');
    expect(result.current.hasDiagnosed).toBe(false);
    expect(result.current.diagnosedAt).toBeNull();
    expect(result.current.levelHistory).toEqual([
      { level: 'B2', date: '2026-01-01', source: 'diagnostic' },
    ]);
  });

  it('falls back to an empty history when stored levelHistory is not an array', () => {
    localStorage.setItem('english-learn-user-level', JSON.stringify({
      level: 'A2',
      diagnosedAt: 456,
      levelHistory: { level: 'A2' },
    }));

    const { result } = renderHook(() => useUserLevel());

    expect(result.current.level).toBe('A2');
    expect(result.current.diagnosedAt).toBe(456);
    expect(result.current.levelHistory).toEqual([]);
  });

  it('returns the default level data when parsing stored JSON fails', () => {
    localStorage.setItem('english-learn-user-level', '{bad json');

    const { result } = renderHook(() => useUserLevel());

    expect(result.current.level).toBe('A1');
    expect(result.current.hasDiagnosed).toBe(false);
    expect(result.current.diagnosedAt).toBeNull();
    expect(result.current.levelHistory).toEqual([]);
  });
});

describe('useUserLevel level-up helpers', () => {
  it('checkLevelUp suggests the next level at 85% and above only', () => {
    const { result } = renderHook(() => useUserLevel());

    expect(result.current.checkLevelUp(84)).toBeNull();
    expect(result.current.checkLevelUp(85)).toBe('A2');
    expect(result.current.checkLevelUp(86)).toBe('A2');
  });

  it('getNextLevel returns null when the current level is C1', () => {
    localStorage.setItem('english-learn-user-level', JSON.stringify({
      level: 'C1',
      diagnosedAt: 789,
      levelHistory: [],
    }));

    const { result } = renderHook(() => useUserLevel());

    expect(result.current.level).toBe('C1');
    expect(result.current.getNextLevel()).toBeNull();
  });
});
