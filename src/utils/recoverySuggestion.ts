import { daysBetween } from '../hooks/useProgress';

export interface RecoveryInfo {
  show: boolean;
  daysAway: number;
}

/**
 * 最終学習日から todayStr までの離脱日数を見て、復帰提案を出すか判定する純粋関数。
 * - lastStudyDate が空(未学習)なら show=false。
 * - 離脱日数 >= threshold(既定3) のとき show=true。
 * daysAway は daysBetween の値(同日=0)。
 */
export function getRecoverySuggestion(
  lastStudyDate: string,
  todayStr: string,
  threshold = 3,
): RecoveryInfo {
  if (!lastStudyDate) return { show: false, daysAway: 0 };
  const daysAway = daysBetween(lastStudyDate, todayStr);
  return { show: daysAway >= threshold, daysAway };
}
