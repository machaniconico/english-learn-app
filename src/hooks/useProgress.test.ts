import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyStudyDate,
  applyStreakBreak,
  addDays,
  daysBetween,
  daysUntilNextFreezeToken,
  MAX_FREEZE_TOKENS,
  FREEZE_EARN_INTERVAL,
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
    freezeTokens: 0,
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

  it('earns a freeze token when streak reaches a multiple of 7 (6→7)', () => {
    const prev = baseProgress({ streak: 6, lastStudyDate: '2026-01-01', freezeTokens: 0 });
    const next = applyStudyDate(prev, '2026-01-02');
    expect(next.streak).toBe(7);
    expect(next.freezeTokens).toBe(1);
  });

  it('caps freeze tokens at MAX (3): already-full + streak 13→14 stays 3', () => {
    const prev = baseProgress({ streak: 13, lastStudyDate: '2026-01-01', freezeTokens: 3 });
    const next = applyStudyDate(prev, '2026-01-02');
    expect(next.streak).toBe(14);
    expect(next.freezeTokens).toBe(3);
  });

  it('does NOT earn a freeze token on a reset path (gap > 1)', () => {
    const prev = baseProgress({ streak: 7, lastStudyDate: '2026-01-01', freezeTokens: 0 });
    const next = applyStudyDate(prev, '2026-01-05');
    expect(next.streak).toBe(1);
    expect(next.freezeTokens).toBe(0);
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

  it('bridges a 1-day miss with a freeze token: streak kept, tokens-1, lastStudyDate=yesterday', () => {
    const prev = baseProgress({ streak: 5, lastStudyDate: '2026-01-01', freezeTokens: 1 });
    const next = applyStreakBreak(prev, '2026-01-03'); // diff=2 → missedDays=1
    expect(next.streak).toBe(5);
    expect(next.freezeTokens).toBe(0);
    expect(next.lastStudyDate).toBe('2026-01-02');
  });

  it('resets streak to 0 when freezeTokens=0 and diff=2 (no protection)', () => {
    const prev = baseProgress({ streak: 5, lastStudyDate: '2026-01-01', freezeTokens: 0 });
    const next = applyStreakBreak(prev, '2026-01-03');
    expect(next.streak).toBe(0);
    expect(next.freezeTokens).toBe(0);
  });

  it('resets streak to 0 when freezeTokens insufficient (missed=2, tokens=1) and keeps tokens', () => {
    const prev = baseProgress({ streak: 5, lastStudyDate: '2026-01-01', freezeTokens: 1 });
    const next = applyStreakBreak(prev, '2026-01-04'); // diff=3 → missedDays=2
    expect(next.streak).toBe(0);
    expect(next.freezeTokens).toBe(1);
  });

  it('bridges a 2-day miss when freezeTokens>=2: streak kept, tokens→0', () => {
    const prev = baseProgress({ streak: 5, lastStudyDate: '2026-01-01', freezeTokens: 2 });
    const next = applyStreakBreak(prev, '2026-01-04'); // diff=3 → missedDays=2
    expect(next.streak).toBe(5);
    expect(next.freezeTokens).toBe(0);
    expect(next.lastStudyDate).toBe('2026-01-03');
  });
});

describe('daysUntilNextFreezeToken', () => {
  it('最大保有時は null を返す', () => {
    expect(daysUntilNextFreezeToken(10, MAX_FREEZE_TOKENS)).toBeNull();
    expect(daysUntilNextFreezeToken(3, MAX_FREEZE_TOKENS + 5)).toBeNull();
  });

  it('streak=0 のときは次の獲得まで FREEZE_EARN_INTERVAL 日', () => {
    expect(daysUntilNextFreezeToken(0, 0)).toBe(FREEZE_EARN_INTERVAL);
  });

  it('剰余から次の倍数までの日数を返す', () => {
    expect(daysUntilNextFreezeToken(5, 0)).toBe(2); // 7-5
    expect(daysUntilNextFreezeToken(8, 1)).toBe(6); // 8%7=1 → 7-1
    expect(daysUntilNextFreezeToken(13, 1)).toBe(1); // 13%7=6 → 7-6
  });

  it('ちょうど倍数(剰余0)のときは FREEZE_EARN_INTERVAL 日', () => {
    expect(daysUntilNextFreezeToken(7, 1)).toBe(FREEZE_EARN_INTERVAL);
    expect(daysUntilNextFreezeToken(14, 2)).toBe(FREEZE_EARN_INTERVAL);
  });
});

describe('addDays', () => {
  it('shifts backward across a month boundary (2026-03-01 → 2026-02-28)', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('shifts backward across a year boundary (2026-01-01 → 2025-12-31)', () => {
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });
});
