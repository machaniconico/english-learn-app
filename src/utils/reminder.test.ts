import { describe, it, expect } from 'vitest';
import {
  evaluateReminder,
  isValidHHMM,
  type ReminderInput,
  type ReminderSettings,
} from './reminder';

const settingsOn: ReminderSettings = { enabled: true, time: '09:00' };

function makeInput(overrides: Partial<ReminderInput> = {}): ReminderInput {
  return {
    todayStr: '2026-06-21',
    lastStudyDateStr: '2026-06-20',
    currentStreak: 0,
    studiedToday: false,
    settings: settingsOn,
    nowHHMM: '09:05',
    ...overrides,
  };
}

describe('isValidHHMM', () => {
  it('accepts zero-padded 24h times', () => {
    expect(isValidHHMM('00:00')).toBe(true);
    expect(isValidHHMM('09:05')).toBe(true);
    expect(isValidHHMM('23:59')).toBe(true);
  });

  it('rejects malformed or out-of-range values', () => {
    expect(isValidHHMM('9:05')).toBe(false);
    expect(isValidHHMM('09:5')).toBe(false);
    expect(isValidHHMM('24:00')).toBe(false);
    expect(isValidHHMM('09:60')).toBe(false);
    expect(isValidHHMM('09-05')).toBe(false);
    expect(isValidHHMM('')).toBe(false);
  });
});

describe('evaluateReminder / streakAtRisk', () => {
  it('is true when streak>0 and not studied today', () => {
    const r = evaluateReminder(makeInput({ currentStreak: 5, studiedToday: false }));
    expect(r.streakAtRisk).toBe(true);
  });

  it('is false when already studied today even with a streak', () => {
    const r = evaluateReminder(makeInput({ currentStreak: 5, studiedToday: true }));
    expect(r.streakAtRisk).toBe(false);
  });

  it('is false when streak is 0 and not studied today', () => {
    const r = evaluateReminder(makeInput({ currentStreak: 0, studiedToday: false }));
    expect(r.streakAtRisk).toBe(false);
  });
});

describe('evaluateReminder / reminderDue', () => {
  it('is true when enabled, not studied, and time has arrived', () => {
    const r = evaluateReminder(makeInput({ nowHHMM: '09:05', settings: settingsOn }));
    expect(r.reminderDue).toBe(true);
  });

  it('is true at the exact scheduled time (>= equality)', () => {
    const r = evaluateReminder(makeInput({ nowHHMM: '09:00', settings: settingsOn }));
    expect(r.reminderDue).toBe(true);
  });

  it('is false before the scheduled time', () => {
    const r = evaluateReminder(makeInput({ nowHHMM: '08:59', settings: settingsOn }));
    expect(r.reminderDue).toBe(false);
  });

  it('is false when disabled even after the time', () => {
    const r = evaluateReminder(
      makeInput({ nowHHMM: '10:00', settings: { enabled: false, time: '09:00' } }),
    );
    expect(r.reminderDue).toBe(false);
  });

  it('is false when already studied today even after the time', () => {
    const r = evaluateReminder(makeInput({ nowHHMM: '10:00', studiedToday: true }));
    expect(r.reminderDue).toBe(false);
  });

  it('compares times lexicographically across hours and minutes', () => {
    // 09:05 >= 09:00 -> true
    expect(
      evaluateReminder(makeInput({ nowHHMM: '09:05', settings: { enabled: true, time: '09:00' } })).reminderDue,
    ).toBe(true);
    // 10:00 >= 09:59 -> true (hour dominates in lex order)
    expect(
      evaluateReminder(makeInput({ nowHHMM: '10:00', settings: { enabled: true, time: '09:59' } })).reminderDue,
    ).toBe(true);
    // 08:59 >= 09:00 -> false
    expect(
      evaluateReminder(makeInput({ nowHHMM: '08:59', settings: { enabled: true, time: '09:00' } })).reminderDue,
    ).toBe(false);
  });

  it('is false when time strings are malformed', () => {
    const r = evaluateReminder(
      makeInput({ nowHHMM: '9:5', settings: { enabled: true, time: '09:00' } }),
    );
    expect(r.reminderDue).toBe(false);
  });
});

describe('evaluateReminder / message', () => {
  it('prioritizes the streak-at-risk message over other branches', () => {
    const r = evaluateReminder(
      makeInput({ currentStreak: 7, studiedToday: false, nowHHMM: '10:00', settings: settingsOn }),
    );
    expect(r.streakAtRisk).toBe(true);
    expect(r.reminderDue).toBe(true);
    expect(r.message).toBe('🔥 7日連続学習中！今日もやって記録を伸ばそう');
  });

  it('congratulates when studied today', () => {
    const r = evaluateReminder(makeInput({ currentStreak: 3, studiedToday: true }));
    expect(r.message).toBe('今日の学習は完了！素晴らしい👏');
  });

  it('invites study when not studied and no streak', () => {
    const r = evaluateReminder(makeInput({ currentStreak: 0, studiedToday: false }));
    expect(r.message).toBe('今日の学習を始めましょう📚');
  });
});
