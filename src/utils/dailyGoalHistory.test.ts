import { describe, it, expect } from 'vitest';
import { computeDailyGoalHistory, computeGoalStreak } from './dailyGoalHistory';

function bd(...minutes: number[]): { date: string; minutes: number }[] {
  return minutes.map((m, i) => ({
    date: `2026-06-${String(10 + i).padStart(2, '0')}`,
    minutes: m,
  }));
}

describe('computeDailyGoalHistory', () => {
  it('met 判定: minutes>=goal が met、未満は未達', () => {
    const { days } = computeDailyGoalHistory(bd(5, 10, 11), 10);
    expect(days.map((d) => d.met)).toEqual([false, true, true]);
  });

  it('metCount を集計する', () => {
    const { metCount, totalDays } = computeDailyGoalHistory(bd(10, 0, 12, 9, 10), 10);
    expect(metCount).toBe(3);
    expect(totalDays).toBe(5);
  });

  it('currentStreak: 末尾から連続 met を数える', () => {
    // 末尾2日が met (10,10)、その前が未達(5)
    const { currentStreak } = computeDailyGoalHistory(bd(10, 5, 10, 10), 10);
    expect(currentStreak).toBe(2);
  });

  it('currentStreak: 最新日が未達なら 0', () => {
    const { currentStreak } = computeDailyGoalHistory(bd(10, 10, 5), 10);
    expect(currentStreak).toBe(0);
  });

  it('currentStreak: 全 met なら totalDays に等しい', () => {
    const { currentStreak, totalDays } = computeDailyGoalHistory(bd(10, 11, 20), 10);
    expect(currentStreak).toBe(3);
    expect(currentStreak).toBe(totalDays);
  });

  it('pct を 100 にキャップする(120%相当でも100)', () => {
    const { days } = computeDailyGoalHistory(bd(12), 10);
    expect(days[0].pct).toBe(100);
  });

  it('pct を四捨五入する', () => {
    // 7/10 = 70%
    const { days } = computeDailyGoalHistory(bd(7), 10);
    expect(days[0].pct).toBe(70);
  });

  it('goalMinutes<=0 で pct=0・met=false', () => {
    const { days, metCount, currentStreak } = computeDailyGoalHistory(bd(10, 20), 0);
    expect(days.map((d) => d.pct)).toEqual([0, 0]);
    expect(days.map((d) => d.met)).toEqual([false, false]);
    expect(metCount).toBe(0);
    expect(currentStreak).toBe(0);
  });

  it('入力配列を破壊しない', () => {
    const input = bd(10, 5);
    const snapshot = JSON.parse(JSON.stringify(input));
    computeDailyGoalHistory(input, 10);
    expect(input).toEqual(snapshot);
  });

  it('空配列なら全てゼロ', () => {
    const result = computeDailyGoalHistory([], 10);
    expect(result).toEqual({ days: [], metCount: 0, totalDays: 0, currentStreak: 0 });
  });

  it('各 day は date/minutes をそのまま保持する', () => {
    const { days } = computeDailyGoalHistory(bd(8), 10);
    expect(days[0].date).toBe('2026-06-10');
    expect(days[0].minutes).toBe(8);
  });
});

describe('computeGoalStreak', () => {
  // bd(...) は date を 2026-06-10 から連番で振る。最終日の date を都度算出。
  const lastDate = (n: number) => `2026-06-${String(10 + n - 1).padStart(2, '0')}`;

  it('空配列なら streak=0, atRiskToday=false', () => {
    expect(computeGoalStreak([], '2026-06-10')).toEqual({ streak: 0, atRiskToday: false });
  });

  it('今日も達成しているときは今日を含めて数え、atRisk は false', () => {
    const { days } = computeDailyGoalHistory(bd(10, 10, 10), 10);
    expect(computeGoalStreak(days, lastDate(3))).toEqual({ streak: 3, atRiskToday: false });
  });

  it('今日(最終日)が未達でも前日までの連続が生きていれば atRisk で継続', () => {
    // met=[T,T,F]、最終日=今日が未達 → 今日を飛ばし前日から2連続。
    const { days } = computeDailyGoalHistory(bd(10, 10, 5), 10);
    expect(computeGoalStreak(days, lastDate(3))).toEqual({ streak: 2, atRiskToday: true });
  });

  it('最終日が未達かつ前日も未達なら streak=0(atRisk は streak>0 のときのみ)', () => {
    const { days } = computeDailyGoalHistory(bd(10, 5, 5), 10);
    expect(computeGoalStreak(days, lastDate(3))).toEqual({ streak: 0, atRiskToday: false });
  });

  it('最終日が today でないなら未達日もスキップせず数える(atRisk なし)', () => {
    // 最終日が未達だが today 文字列と一致しない → スキップしないので streak=0。
    const { days } = computeDailyGoalHistory(bd(10, 10, 5), 10);
    expect(computeGoalStreak(days, '2099-01-01')).toEqual({ streak: 0, atRiskToday: false });
  });
});
