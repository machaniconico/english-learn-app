import { Link } from 'react-router-dom';
import { useProgress, MAX_FREEZE_TOKENS, FREEZE_EARN_INTERVAL, daysUntilNextFreezeToken } from '../hooks/useProgress';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useAccuracy } from '../hooks/useAccuracy';
import { useUserLevel } from '../hooks/useUserLevel';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { useTypingRecords } from '../hooks/useTypingRecords';
import { useDailyGoal, goalProgressPct, GOAL_PRESETS } from '../hooks/useDailyGoal';
import { useWeeklyGoal, WEEKLY_GOAL_PRESETS } from '../hooks/useWeeklyGoal';
import { evaluateAchievements, countUnlocked, type AchievementInput } from '../utils/achievements';
import { getDailyQuizSummary } from '../utils/dailyQuizStats';

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function AchievementsPage() {
  const { getOverallStats, progress } = useProgress();
  const { getStats: getSrsStats } = useSpacedRepetition();
  const { getOverallAccuracy, getAccuracyByType, getResultsByType } = useAccuracy();
  const { hasDiagnosed } = useUserLevel();
  const { getTotalTime, getDailyBreakdown, getWeeklyTotal } = useStudyTimer();
  const { record: typingRecord } = useTypingRecords();
  const { goalMinutes, setGoalMinutes } = useDailyGoal();
  const { weeklyGoalMinutes, setWeeklyGoalMinutes } = useWeeklyGoal();

  const stats = getOverallStats();
  const accuracyAttempts = getAccuracyByType().reduce((sum, t) => sum + t.total, 0);
  // Only today's calendar-day minutes (the breakdown can include a still-within-24h
  // session from yesterday evening, so filter by today's date rather than summing).
  const todayMinutes = getDailyBreakdown(1).find((d) => d.date === todayString())?.minutes ?? 0;
  const dailyQuizStreak = getDailyQuizSummary(getResultsByType('daily-quiz'), todayString(), 5).streak;

  const input: AchievementInput = {
    streak: stats.streak,
    completedItems: stats.totalItems,
    srsMastered: getSrsStats().mastered,
    overallAccuracy: getOverallAccuracy(),
    accuracyAttempts,
    totalStudyMinutes: getTotalTime(36500), // ~all-time (last 100 years)
    hasDiagnosed,
    dailyQuizStreak,
    typingBestPct: typingRecord.bestPct,
    typingPlays: typingRecord.plays,
  };

  const achievements = evaluateAchievements(input);
  const unlocked = countUnlocked(achievements);
  const goalPct = goalProgressPct(todayMinutes, goalMinutes);
  const weeklyMinutes = getWeeklyTotal();
  const weeklyPct = goalProgressPct(weeklyMinutes, weeklyGoalMinutes);
  const freezeTokens = progress.freezeTokens;
  const daysToNextToken = daysUntilNextFreezeToken(stats.streak, freezeTokens);

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors mb-4"
        >
          &larr; ホーム
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">🏅</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">達成バッジ</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">学習の積み重ねを記録しよう</p>
          </div>
        </div>
      </div>

      {/* Daily goal */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">今日の学習目標</h2>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 relative shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#e0e7ff" strokeWidth="7" className="dark:stroke-indigo-900" />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#6366f1"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${(goalPct / 100) * 213.6} 213.6`}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-700 dark:text-indigo-300"
              role="status"
              aria-label={`今日の目標達成率 ${goalPct} パーセント`}
            >
              {goalPct}%
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              今日 <span className="font-bold text-gray-900 dark:text-gray-100">{todayMinutes}分</span> / 目標 {goalMinutes}分
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="目標時間を設定">
              {GOAL_PRESETS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setGoalMinutes(m)}
                  aria-pressed={goalMinutes === m}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                    goalMinutes === m
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {m}分
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly goal */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">今週の学習目標</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          今週 <span className="font-bold text-gray-900 dark:text-gray-100">{weeklyMinutes}分</span> / 目標 {weeklyGoalMinutes}分
        </p>
        <div
          className="w-full h-3 bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden mb-4"
          role="progressbar"
          aria-valuenow={weeklyPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="今週の学習目標の進捗"
        >
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${weeklyPct}%` }} />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="今週の目標時間を設定">
          {WEEKLY_GOAL_PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setWeeklyGoalMinutes(m)}
              aria-label={`今週の目標 ${m}分`}
              aria-pressed={weeklyGoalMinutes === m}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                weeklyGoalMinutes === m
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {m}分
            </button>
          ))}
        </div>
      </section>

      {/* Streak protection (freeze tokens) */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">ストリーク保護</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {FREEZE_EARN_INTERVAL}日連続学習ごとに1個獲得(最大{MAX_FREEZE_TOKENS}個)。1日サボっても自動で記録を守ります。
        </p>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5"
            role="img"
            aria-label={`ストリーク保護トークン ${freezeTokens} / ${MAX_FREEZE_TOKENS} 個`}
          >
            {Array.from({ length: MAX_FREEZE_TOKENS }, (_, i) => (
              <span
                key={i}
                className={`text-2xl ${i < freezeTokens ? '' : 'grayscale opacity-30'}`}
                aria-hidden="true"
              >
                ❄️
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-sky-600 dark:text-sky-400" role="status">
            {freezeTokens} / {MAX_FREEZE_TOKENS} 個
          </span>
        </div>
        <p
          role="status"
          className={`mt-2 text-xs ${
            daysToNextToken === null
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {daysToNextToken === null
            ? '最大まで保有しています'
            : `あと${daysToNextToken}日連続でトークンを1つ獲得`}
        </p>
      </section>

      {/* Achievements */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">バッジ</h2>
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400" role="status">
            {unlocked} / {achievements.length} 達成
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-8">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border p-4 text-center transition-all ${
                a.unlocked
                  ? 'border-amber-200 dark:border-amber-700 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-gray-800 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60'
              }`}
            >
              <div
                className={`text-4xl mb-2 ${a.unlocked ? '' : 'grayscale opacity-40'}`}
                aria-hidden="true"
              >
                {a.icon}
              </div>
              <p className={`text-sm font-bold ${a.unlocked ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                {a.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{a.description}</p>
              {a.unlocked ? (
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-2">達成！</p>
              ) : (
                <div className="mt-2">
                  <div
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={a.progress.current}
                    aria-valuemin={0}
                    aria-valuemax={a.progress.target}
                    aria-label={`${a.title} の進捗`}
                  >
                    <div
                      className="h-full bg-indigo-400 rounded-full"
                      style={{ width: `${(a.progress.current / a.progress.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {a.progress.current} / {a.progress.target}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
