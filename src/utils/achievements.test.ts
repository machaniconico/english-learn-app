import { describe, it, expect } from 'vitest';
import { evaluateAchievements, countUnlocked, type AchievementInput } from './achievements';
import { computeAccuracyByType, type QuizResult } from '../hooks/useAccuracy';

const zero: AchievementInput = {
  streak: 0,
  completedItems: 0,
  srsMastered: 0,
  overallAccuracy: 0,
  accuracyAttempts: 0,
  totalStudyMinutes: 0,
  hasDiagnosed: false,
  dailyQuizStreak: 0,
  typingBestPct: 0,
  typingPlays: 0,
};

function find(input: AchievementInput, id: string) {
  return evaluateAchievements(input).find((a) => a.id === id)!;
}

describe('evaluateAchievements', () => {
  it('locks everything for a brand-new user', () => {
    const all = evaluateAchievements(zero);
    expect(all.every((a) => !a.unlocked)).toBe(true);
    expect(countUnlocked(all)).toBe(0);
  });

  it('unlocks streak badges at their thresholds', () => {
    expect(find({ ...zero, streak: 3 }, 'streak-3').unlocked).toBe(true);
    expect(find({ ...zero, streak: 3 }, 'streak-7').unlocked).toBe(false);
    expect(find({ ...zero, streak: 30 }, 'streak-30').unlocked).toBe(true);
  });

  it('clamps progress.current to the target', () => {
    const a = find({ ...zero, completedItems: 250 }, 'items-100');
    expect(a.progress).toEqual({ current: 100, target: 100 });
    expect(a.unlocked).toBe(true);
  });

  it('reports partial progress for a locked badge', () => {
    const a = find({ ...zero, completedItems: 25 }, 'items-50');
    expect(a.unlocked).toBe(false);
    expect(a.progress).toEqual({ current: 25, target: 50 });
  });

  it('gates the accuracy badge on a minimum number of recorded questions', () => {
    expect(find({ ...zero, overallAccuracy: 95, accuracyAttempts: 5 }, 'accuracy-80').unlocked).toBe(false);
    expect(find({ ...zero, overallAccuracy: 95, accuracyAttempts: 20 }, 'accuracy-80').unlocked).toBe(true);
    // below the accuracy target stays locked even with enough questions
    expect(find({ ...zero, overallAccuracy: 70, accuracyAttempts: 50 }, 'accuracy-80').unlocked).toBe(false);
  });

  it('can unlock the accuracy badge from one 20-question drill result', () => {
    const results: QuizResult[] = [
      {
        type: 'drill',
        setId: 'drill-session',
        score: 90,
        total: 20,
        correct: 18,
        timestamp: 1,
      },
    ];
    const accuracyAttempts = computeAccuracyByType(results).reduce((sum, t) => sum + t.total, 0);

    expect(accuracyAttempts).toBe(20);
    expect(find({ ...zero, overallAccuracy: 90, accuracyAttempts }, 'accuracy-80').unlocked).toBe(true);
  });

  it('unlocks the diagnosis badge only once diagnosed', () => {
    expect(find(zero, 'diagnosed').unlocked).toBe(false);
    expect(find({ ...zero, hasDiagnosed: true }, 'diagnosed').unlocked).toBe(true);
  });

  it('counts unlocked badges across a mixed profile', () => {
    const all = evaluateAchievements({
      streak: 7,
      completedItems: 60,
      srsMastered: 12,
      overallAccuracy: 85,
      accuracyAttempts: 30,
      totalStudyMinutes: 65,
      hasDiagnosed: true,
      dailyQuizStreak: 0,
      typingBestPct: 0,
      typingPlays: 0,
    });
    // streak-3, streak-7, items-10, items-50, srs-10, accuracy-80, time-60, diagnosed = 8
    expect(countUnlocked(all)).toBe(8);
  });

  it('unlocks dq-streak-3 at 3-day daily-quiz streak and shows partial progress below', () => {
    expect(find({ ...zero, dailyQuizStreak: 3 }, 'dq-streak-3').unlocked).toBe(true);
    const locked = find({ ...zero, dailyQuizStreak: 2 }, 'dq-streak-3');
    expect(locked.unlocked).toBe(false);
    expect(locked.progress).toEqual({ current: 2, target: 3 });
  });

  it('unlocks dq-streak-7 at 7-day daily-quiz streak', () => {
    expect(find({ ...zero, dailyQuizStreak: 6 }, 'dq-streak-7').unlocked).toBe(false);
    expect(find({ ...zero, dailyQuizStreak: 7 }, 'dq-streak-7').unlocked).toBe(true);
    expect(find({ ...zero, dailyQuizStreak: 10 }, 'dq-streak-7').unlocked).toBe(true);
  });

  it('unlocks typing-perfect only with best 100% and at least one play', () => {
    expect(find({ ...zero, typingBestPct: 100, typingPlays: 1 }, 'typing-perfect').unlocked).toBe(true);
    expect(find({ ...zero, typingBestPct: 100, typingPlays: 0 }, 'typing-perfect').unlocked).toBe(false);
  });

  it('locks typing-perfect below 100% and reports progress', () => {
    const a = find({ ...zero, typingBestPct: 80, typingPlays: 5 }, 'typing-perfect');
    expect(a.unlocked).toBe(false);
    expect(a.progress).toEqual({ current: 80, target: 100 });
  });
});
