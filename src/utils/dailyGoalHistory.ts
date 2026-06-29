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

export interface GoalStreakInfo {
  streak: number;
  atRiskToday: boolean;
}

/**
 * 「生きている」目標達成ストリークを返す。days は古い→新しい昇順。
 * - 末尾(最新)が today かつ未達のときは、今日を飛ばして前日から後方に連続 met を数え、
 *   atRiskToday=true(streak>0 のときのみ)。
 * - それ以外は末尾から後方に連続 met を数え atRiskToday=false。
 * 入力非破壊。
 */
export function computeGoalStreak(
  days: DailyGoalDay[],
  todayStr: string,
): GoalStreakInfo {
  if (days.length === 0) return { streak: 0, atRiskToday: false };
  const last = days[days.length - 1];
  let startIdx = days.length - 1;
  let atRisk = false;
  if (last.date === todayStr && !last.met) {
    atRisk = true;
    startIdx = days.length - 2;
  }
  let streak = 0;
  for (let i = startIdx; i >= 0; i--) {
    if (days[i].met) streak += 1;
    else break;
  }
  return { streak, atRiskToday: atRisk && streak > 0 };
}
