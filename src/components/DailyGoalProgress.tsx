import { useDailyGoal, goalProgressPct } from '../hooks/useDailyGoal';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { computeDailyGoalHistory, computeGoalStreak } from '../utils/dailyGoalHistory';

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const;

/** 'YYYY-MM-DD' をローカル暦日として曜日ラベルに変換する。 */
function weekdayLabel(date: string): string {
  return WEEKDAY_LABELS[new Date(date + 'T00:00:00').getDay()];
}

/**
 * 今日のデイリー目標に対する学習進捗をカードで表示する。
 * useDailyGoal(目標分) と useStudyTimer(今日の学習分) を組み合わせ、
 * 進捗バー・達成状態を描画する。props は持たず全てフックから取得する。
 * ホームへの配線は別ストーリー(US-002)で行う。
 */
export default function DailyGoalProgress() {
  const { goalMinutes } = useDailyGoal();
  const { getDailyBreakdown } = useStudyTimer();

  // getDailyBreakdown(1) は今日1日分の配列を返す。最後(=今日)の要素の minutes
  // を取り、配列が空のときは 0 とする(ロバストness)。
  const todayBreakdown = getDailyBreakdown(1);
  const todayMinutes = todayBreakdown.length
    ? todayBreakdown[todayBreakdown.length - 1].minutes
    : 0;

  const pct = goalProgressPct(todayMinutes, goalMinutes);
  const achieved = pct >= 100;

  // 直近7日の達成傾向。getDailyBreakdown(7) は古い→新しい昇順、最後が今日。
  const history = computeDailyGoalHistory(getDailyBreakdown(7), goalMinutes);
  const lastIndex = history.days.length - 1;
  const todayStr = history.days[lastIndex]?.date ?? '';
  const goalStreak = computeGoalStreak(history.days, todayStr);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">今日の目標</h2>
      <p className="mt-2 text-gray-900 dark:text-gray-100">{`${todayMinutes} / ${goalMinutes} 分`}</p>

      {/* 進捗バー: 外枠(トラック) + 内側を pct% で塗る。達成時は緑系に切替。 */}
      <div
        className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="今日の学習目標の進捗"
      >
        <div
          className={`h-full rounded-full ${achieved ? 'bg-emerald-500' : 'bg-indigo-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">{`${pct}%`}</p>
      {achieved && (
        <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
          目標達成！🎉
        </p>
      )}

      {/* 直近7日のミニ履歴 */}
      <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400">直近7日</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">
              {`${history.metCount}/7日 達成`}
            </span>
            {goalStreak.streak >= 2 && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  goalStreak.atRiskToday
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'
                }`}
              >
                {`🔥${goalStreak.streak}日連続${goalStreak.atRiskToday ? '(今日まだ)' : ''}`}
              </span>
            )}
          </div>
        </div>

        <div
          className="mt-2 flex items-end justify-between gap-1"
          role="img"
          aria-label={`直近7日の目標達成: 7日中${history.metCount}日達成`}
        >
          {history.days.map((day, i) => {
            const isToday = i === lastIndex;
            const empty = day.minutes === 0;
            const barColor = empty
              ? 'bg-gray-200 dark:bg-gray-600'
              : day.met
                ? 'bg-emerald-500'
                : 'bg-indigo-500';
            // 0分の日も土台が見えるよう最低高さを確保する。
            const heightPct = empty ? 4 : Math.max(8, day.pct);
            return (
              <div
                key={day.date}
                className="flex flex-1 flex-col items-center gap-1"
                aria-hidden="true"
              >
                <div className="flex h-12 w-full items-end justify-center">
                  <div
                    className={`w-2 rounded-sm ${barColor} ${
                      isToday ? 'ring-2 ring-gray-400 dark:ring-gray-300' : ''
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {weekdayLabel(day.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
