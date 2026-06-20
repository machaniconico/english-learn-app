import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUserLevel } from '../hooks/useUserLevel';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useWeakPoints } from '../hooks/useWeakPoints';
import { useDailyGoal } from '../hooks/useDailyGoal';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { useProgress } from '../hooks/useProgress';
import { useAccuracy } from '../hooks/useAccuracy';
import { isWeakPointMastered } from '../utils/reviewQueue';
import {
  buildStudyPlan,
  planProgress,
  type StudyPlanContext,
  type StudyPlanItem,
  type PlanPriority,
} from '../utils/studyPlan';

// --- Priority pill config ---

const PRIORITY_LABEL: Record<PlanPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const PRIORITY_PILL_CLASS: Record<PlanPriority, string> = {
  high: 'bg-rose-100 text-rose-700 ring-1 ring-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:ring-rose-700',
  medium: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-700',
  low: 'bg-gray-100 text-gray-600 ring-1 ring-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:ring-gray-600',
};

const PRIORITY_BORDER_CLASS: Record<PlanPriority, string> = {
  high: 'border-rose-200 dark:border-rose-800',
  medium: 'border-amber-200 dark:border-amber-800',
  low: 'border-gray-200 dark:border-gray-700',
};

// --- Sub-components ---

function PriorityPill({ priority }: { priority: PlanPriority }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold leading-tight ${PRIORITY_PILL_CLASS[priority]}`}
    >
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

function PlanCard({ item }: { item: StudyPlanItem }) {
  return (
    <li
      className={`flex flex-col gap-3 rounded-2xl border bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm ${PRIORITY_BORDER_CLASS[item.priority]}`}
    >
      <div className="flex items-start gap-3">
        <PriorityPill priority={item.priority} />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 sm:text-base">{item.title}</h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{item.reason}</p>
        </div>
      </div>
      <Link
        to={item.route}
        className="self-start min-h-[44px] inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
      >
        {item.cta}
      </Link>
    </li>
  );
}

// --- Goal progress ring ---

const RING_RADIUS = 34;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈ 213.6

function GoalRing({ pct }: { pct: number }) {
  const filled = (pct / 100) * RING_CIRCUMFERENCE;
  return (
    <div
      className="relative w-20 h-20"
      role="status"
      aria-label={`${pct} パーセント達成`}
    >
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
        <circle cx="40" cy="40" r={RING_RADIUS} fill="none" stroke="#e0e7ff" strokeWidth="8" className="dark:stroke-indigo-900" />
        <circle
          cx="40"
          cy="40"
          r={RING_RADIUS}
          fill="none"
          stroke="#6366f1"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${RING_CIRCUMFERENCE}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{pct}%</span>
      </div>
    </div>
  );
}

// --- Page ---

export default function StudyPlanPage() {
  const { hasDiagnosed } = useUserLevel();
  const { getStats } = useSpacedRepetition();
  const { weakPoints } = useWeakPoints();
  const { goalMinutes } = useDailyGoal();
  const { getDailyBreakdown } = useStudyTimer();
  const { progress } = useProgress();
  const { getWeakestTypes } = useAccuracy();

  // Derive today's accumulated study minutes from the timer's daily breakdown
  const todayMinutes = useMemo(() => {
    const breakdown = getDailyBreakdown(1);
    return breakdown.length > 0 ? breakdown[breakdown.length - 1].minutes : 0;
  }, [getDailyBreakdown]);

  const srsDue = getStats().due;
  const activeWeakPoints = weakPoints.filter((wp) => !isWeakPointMastered(wp)).length;
  const weakestTypes = getWeakestTypes();
  const streak = progress.streak;

  const ctx: StudyPlanContext = {
    hasDiagnosed,
    srsDue,
    activeWeakPoints,
    weakestTypes,
    todayMinutes,
    goalMinutes,
    streak,
  };

  const plan = buildStudyPlan(ctx);
  const { goalPct, goalMet, recommendedCount } = planProgress(ctx);

  const highMediumItems = plan.filter(
    (item) => item.priority === 'high' || item.priority === 'medium',
  );
  const lowItems = plan.filter((item) => item.priority === 'low');
  const allDone = goalMet && highMediumItems.length === 0;

  return (
    <div className="pb-10">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 transition-colors hover:text-indigo-800 dark:hover:text-indigo-300 mb-4"
      >
        &larr; ホーム
      </Link>

      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl" aria-hidden="true">📋</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">今日の学習プラン</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">今日やるべきことを優先順位付きで確認しよう</p>
        </div>
      </div>

      {/* Goal + streak header */}
      <div className="mb-6 grid grid-cols-3 gap-3 rounded-2xl border border-indigo-100 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-4">
        {/* Goal ring */}
        <div className="col-span-1 flex flex-col items-center gap-1">
          <GoalRing pct={goalPct} />
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">今日の目標</span>
          {goalMinutes > 0 && (
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
              {todayMinutes}/{goalMinutes}分
            </span>
          )}
        </div>

        {/* Streak badge */}
        <div className="col-span-1 flex flex-col items-center justify-center gap-1">
          <div className="text-3xl" aria-hidden="true">{streak > 0 ? '🔥' : '💤'}</div>
          <div className="text-2xl font-extrabold text-orange-600 dark:text-orange-400">{streak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">日連続</div>
        </div>

        {/* SRS due badge */}
        <div className="col-span-1 flex flex-col items-center justify-center gap-1">
          <div
            aria-label={`復習カード ${srsDue} 枚`}
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-extrabold ${
              srsDue > 0
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
            }`}
          >
            {srsDue}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">復習カード</div>
        </div>
      </div>

      {/* Celebratory panel (goal met + nothing high/medium left) */}
      {allDone && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 p-6 text-center"
        >
          <p className="text-4xl mb-2" aria-hidden="true">🎉</p>
          <p className="text-base font-bold text-emerald-800 dark:text-emerald-300">今日のおすすめは完了です！</p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">素晴らしい！今日の学習目標をすべて達成しました。</p>
        </div>
      )}

      {/* Recommended count summary (only when there are high/medium items) */}
      {recommendedCount > 0 && (
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          おすすめタスク：<span className="font-semibold text-gray-700 dark:text-gray-300">{recommendedCount}件</span>
        </p>
      )}

      {/* Plan list */}
      <ul className="space-y-3" aria-label="今日の学習プラン">
        {/* High and medium items */}
        {highMediumItems.map((item) => (
          <PlanCard key={item.id} item={item} />
        ))}

        {/* Low items always shown at the bottom */}
        {lowItems.map((item) => (
          <PlanCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
