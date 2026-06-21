import { useDailyGoal, goalProgressPct } from '../hooks/useDailyGoal';
import { useStudyTimer } from '../hooks/useStudyTimer';

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
    </div>
  );
}
