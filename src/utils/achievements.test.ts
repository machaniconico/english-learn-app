import { describe, it, expect } from 'vitest';
import { evaluateAchievements, countUnlocked, type AchievementInput } from './achievements';

const zero: AchievementInput = {
  streak: 0,
  completedItems: 0,
  srsMastered: 0,
  overallAccuracy: 0,
  accuracyAttempts: 0,
  totalStudyMinutes: 0,
  hasDiagnosed: false,
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

  it('gates the accuracy badge on a minimum number of attempts', () => {
    expect(find({ ...zero, overallAccuracy: 95, accuracyAttempts: 5 }, 'accuracy-80').unlocked).toBe(false);
    expect(find({ ...zero, overallAccuracy: 95, accuracyAttempts: 20 }, 'accuracy-80').unlocked).toBe(true);
    // below the accuracy target stays locked even with enough attempts
    expect(find({ ...zero, overallAccuracy: 70, accuracyAttempts: 50 }, 'accuracy-80').unlocked).toBe(false);
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
    });
    // streak-3, streak-7, items-10, items-50, srs-10, accuracy-80, time-60, diagnosed = 8
    expect(countUnlocked(all)).toBe(8);
  });
});
