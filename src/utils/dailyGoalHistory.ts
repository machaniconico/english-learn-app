/**
 * デイリー目標の履歴ロジック(純粋関数)。
 * useStudyTimer.getDailyBreakdown が返す { date, minutes }[](古い→新しい昇順)
 * と目標分から、各日の達成率・達成可否、達成日数、連続達成日数を算出する。
 * 表示(曜日整形・色分け等)は呼び出し側の責務。
 */

export interface DailyGoalDay {
  date: string;
  minutes: number;
  pct: number;
  met: boolean;
}

export interface DailyGoalHistorySummary {
  days: DailyGoalDay[];
  metCount: number;
  totalDays: number;
  currentStreak: number;
}

/**
 * breakdown(古い→新しい昇順)と goalMinutes から履歴サマリを計算する。
 * - pct = goalMinutes>0 ? min(100, round(minutes/goal*100)) : 0
 * - met = goalMinutes>0 && minutes >= goalMinutes
 * - currentStreak = 末尾(最新日)から後方に連続して met な日数
 * 入力配列は破壊しない。
 */
export function computeDailyGoalHistory(
  breakdown: { date: string; minutes: number }[],
  goalMinutes: number,
): DailyGoalHistorySummary {
  const days: DailyGoalDay[] = breakdown.map(({ date, minutes }) => {
    const pct =
      goalMinutes > 0 ? Math.min(100, Math.round((minutes / goalMinutes) * 100)) : 0;
    const met = goalMinutes > 0 && minutes >= goalMinutes;
    return { date, minutes, pct, met };
  });

  const metCount = days.reduce((sum, d) => sum + (d.met ? 1 : 0), 0);

  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].met) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return {
    days,
    metCount,
    totalDays: breakdown.length,
    currentStreak,
  };
}
