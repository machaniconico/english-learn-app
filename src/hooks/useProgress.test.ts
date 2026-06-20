import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyStudyDate,
  applyStreakBreak,
  daysBetween,
  type ProgressData,
} from './useProgress';

function baseProgress(overrides: Partial<ProgressData> = {}): ProgressData {
  return {
    lessons: {},
    fillInBlankScores: {},
    readingScores: {},
    totalStudyTime: 0,
    streak: 0,
    lastStudyDate: '',
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe('daysBetween', () => {
  it('returns 0 for the same date', () => {
    expect(daysBetween('2026-01-01', '2026-01-01')).toBe(0);
  });

  it('returns 1 for consecutive days', () => {
    expect(daysBetween('2026-01-01', '2026-01-02')).toBe(1);
  });

  it('is symmetric (absolute difference)', () => {
    expect(daysBetween('2026-01-05', '2026-01-01')).toBe(4);
    expect(daysBetween('2026-01-01', '2026-01-05')).toBe(4);
  });

  it('counts across a month boundary', () => {
    expect(daysBetween('2026-01-31', '2026-02-01')).toBe(1);
  });
});

describe('applyStudyDate', () => {
  it('same-day call is a no-op (returns prev reference unchanged)', () => {
    const prev = baseProgress({ streak: 3, lastStudyDate: '2026-01-01' });
    const next = applyStudyDate(prev, '2026-01-01');
    // identical reference => no state churn
    expect(next).toBe(prev);
    expect(next.streak).toBe(3);
    expect(next.lastStudyDate).toBe('2026-01-01');
  });

  it('increments streak on a consecutive day (daysBetween === 1)', () => {
    const prev = baseProgress({ streak: 3, lastStudyDate: '2026-01-01' });
    const next = applyStudyDate(prev, '2026-01-02');
    expect(next.streak).toBe(4);
    expect(next.lastStudyDate).toBe('2026-01-02');
    // immutability: prev untouched
    expect(prev.streak).toBe(3);
    expect(prev.lastStudyDate).toBe('2026-01-01');
  });

  it('resets streak to 1 after a gap (> 1 day)', () => {
    const prev = baseProgress({ streak: 7, lastStudyDate: '2026-01-01' });
    const next = applyStudyDate(prev, '2026-01-05');
    expect(next.streak).toBe(1);
    expect(next.lastStudyDate).toBe('2026-01-05');
  });

  it('first-ever study sets streak to 1', () => {
    const prev = baseProgress({ streak: 0, lastStudyDate: '' });
    const next = applyStudyDate(prev, '2026-01-01');
    expect(next.streak).toBe(1);
    expect(next.lastStudyDate).toBe('2026-01-01');
  });

  it('preserves other fields when transitioning', () => {
    const prev = baseProgress({
      streak: 1,
      lastStudyDate: '2026-01-01',
      totalStudyTime: 120,
      fillInBlankScores: { setA: 80 },
    });
    const next = applyStudyDate(prev, '2026-01-02');
    expect(next.totalStudyTime).toBe(120);
    expect(next.fillInBlankScores).toEqual({ setA: 80 });
  });
});

describe('applyStreakBreak', () => {
  it('leaves data unchanged when there is no recorded study date', () => {
    const prev = baseProgress({ streak: 0, lastStudyDate: '' });
    const next = applyStreakBreak(prev, '2026-01-10');
    expect(next).toBe(prev);
  });

  it('resets streak to 0 when the gap is more than one day (diff > 1)', () => {
    const prev = baseProgress({ streak: 5, lastStudyDate: '2026-01-01' });
    const next = applyStreakBreak(prev, '2026-01-05');
    expect(next.streak).toBe(0);
    expect(next.lastStudyDate).toBe('2026-01-01');
  });

  it('leaves streak intact on the same day (diff === 0)', () => {
    const prev = baseProgress({ streak: 5, lastStudyDate: '2026-01-01' });
    const next = applyStreakBreak(prev, '2026-01-01');
    expect(next).toBe(prev);
    expect(next.streak).toBe(5);
  });

  it('leaves streak intact on a consecutive day (diff === 1)', () => {
    const prev = baseProgress({ streak: 5, lastStudyDate: '2026-01-01' });
    const next = applyStreakBreak(prev, '2026-01-02');
    expect(next).toBe(prev);
    expect(next.streak).toBe(5);
  });
});
