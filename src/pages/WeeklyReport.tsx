import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { useAnalytics } from '../hooks/useAnalytics';
import { useUserLevel, LEVEL_INFO, CEFR_ORDER } from '../hooks/useUserLevel';
import { useAccuracy } from '../hooks/useAccuracy';
import { buildReportData, formatMinutes, type Period } from './weeklyReportData';

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateJa(date: Date): string {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function getPeriodRange(period: Period): { start: Date; end: Date; label: string; days: number } {
  const now = new Date();

  switch (period) {
    case 'this-week': {
      const monday = getMondayOfWeek(now);
      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);
      return {
        start: monday,
        end: sunday,
        label: `${formatDateJa(monday)} 〜 ${formatDateJa(sunday)}`,
        days: 7,
      };
    }
    case 'last-week': {
      const thisMonday = getMondayOfWeek(now);
      const lastMonday = new Date(thisMonday);
      lastMonday.setDate(lastMonday.getDate() - 7);
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastSunday.getDate() + 6);
      return {
        start: lastMonday,
        end: lastSunday,
        label: `${formatDateJa(lastMonday)} 〜 ${formatDateJa(lastSunday)}`,
        days: 7,
      };
    }
    case 'this-month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        start: firstDay,
        end: lastDay,
        label: `${now.getFullYear()}年${now.getMonth() + 1}月`,
        days: lastDay.getDate(),
      };
    }
    case 'last-month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        start: firstDay,
        end: lastDay,
        label: `${firstDay.getFullYear()}年${firstDay.getMonth() + 1}月`,
        days: lastDay.getDate(),
      };
    }
  }
}

function getPreviousPeriodRange(period: Period): { start: Date; end: Date } {
  switch (period) {
    case 'this-week': {
      const thisMonday = getMondayOfWeek(new Date());
      const lastMonday = new Date(thisMonday);
      lastMonday.setDate(lastMonday.getDate() - 7);
      const lastSunday = new Date(lastMonday);
      lastSunday.setDate(lastSunday.getDate() + 6);
      return { start: lastMonday, end: lastSunday };
    }
    case 'last-week': {
      const thisMonday = getMondayOfWeek(new Date());
      const twoWeeksAgoMonday = new Date(thisMonday);
      twoWeeksAgoMonday.setDate(twoWeeksAgoMonday.getDate() - 14);
      const twoWeeksAgoSunday = new Date(twoWeeksAgoMonday);
      twoWeeksAgoSunday.setDate(twoWeeksAgoSunday.getDate() + 6);
      return { start: twoWeeksAgoMonday, end: twoWeeksAgoSunday };
    }
    case 'this-month': {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      return { start: firstDay, end: lastDay };
    }
    case 'last-month': {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() - 1, 0);
      return { start: firstDay, end: lastDay };
    }
  }
}

export default function WeeklyReport() {
  const [period, setPeriod] = useState<Period>('this-week');
  const { getSessions, getStreak } = useStudyTimer();
  const { getEventsForPeriod } = useAnalytics();
  const { level: userLevel, hasDiagnosed, checkLevelUp } = useUserLevel();
  const { getOverallAccuracy } = useAccuracy();

  const range = useMemo(() => getPeriodRange(period), [period]);
  const prevRange = useMemo(() => getPreviousPeriodRange(period), [period]);

  const reportData = useMemo(
    () =>
      buildReportData({
        sessions90: getSessions(90),
        sessions180: getSessions(180),
        allEvents: getEventsForPeriod(90),
        streak: getStreak(),
        range,
        prevRange,
        period,
      }),
    [range, prevRange, period, getSessions, getEventsForPeriod, getStreak],
  );

  const maxMinutes = Math.max(...reportData.dailyData.map((d) => d.minutes), 1);

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
      >
        &larr; ホーム
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          学習レポート
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{range.label}</p>
      </div>

      {/* Period toggle */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'this-week' as Period, label: '今週' },
          { key: 'last-week' as Period, label: '先週' },
          { key: 'this-month' as Period, label: '今月' },
          { key: 'last-month' as Period, label: '先月' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setPeriod(item.key)}
            aria-pressed={period === item.key}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === item.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Highlight stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="総学習時間"
          value={formatMinutes(reportData.totalMinutes)}
          icon="clock"
          comparison={<ComparisonArrow current={reportData.totalMinutes} previous={reportData.prevTotalMinutes} />}
        />
        <StatCard
          label="学習日数"
          value={`${reportData.activeDays}日`}
          icon="calendar"
          comparison={<ComparisonArrow current={reportData.activeDays} previous={reportData.prevActiveDays} />}
        />
        <StatCard
          label="完了アイテム数"
          value={`${reportData.completedItems}件`}
          icon="check"
          comparison={<ComparisonArrow current={reportData.completedItems} previous={reportData.prevCompletedItems} />}
        />
        <StatCard
          label="平均スコア"
          value={reportData.avgScore > 0 ? `${reportData.avgScore}%` : '--'}
          icon="score"
          comparison={<ComparisonArrow current={reportData.avgScore} previous={reportData.prevAvgScore} />}
        />
      </div>

      {/* Daily bar chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          日別学習時間
        </h2>
        <div className="flex items-end gap-1 sm:gap-2 h-40">
          {reportData.dailyData.map((day, i) => {
            const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
            const isWeekly = period === 'this-week' || period === 'last-week';
            // For monthly, only show every 5th label
            const showLabel = isWeekly || i % 5 === 0 || i === reportData.dailyData.length - 1;
            return (
              <div
                key={day.date}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                <div className="w-full flex flex-col items-center justify-end h-32">
                  {day.minutes > 0 && (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 tabular-nums">
                      {day.minutes}
                    </span>
                  )}
                  <div
                    className="w-full max-w-8 rounded-t-md bg-gradient-to-t from-indigo-500 to-indigo-400 dark:from-indigo-600 dark:to-indigo-400 transition-all duration-300"
                    style={{ height: `${Math.max(height, day.minutes > 0 ? 4 : 0)}%` }}
                  />
                </div>
                {showLabel && (
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 truncate w-full text-center">
                    {day.dayLabel}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            連続学習記録
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{reportData.streak.current}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">現在の連続日数</div>
            </div>
            <div className="h-10 w-px bg-gray-200 dark:bg-gray-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">{reportData.streak.longest}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">最長記録</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                学習継続率（{reportData.activeDays}/{range.days}日）
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {reportData.consistencyPct}%
              </span>
            </div>
            <div
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={reportData.consistencyPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="学習継続率"
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${reportData.consistencyPct}%` }}
              />
            </div>
          </div>
          {reportData.streak.current > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              {reportData.streak.current >= 7
                ? '素晴らしい！1週間以上の連続学習を達成しました！'
                : reportData.streak.current >= 3
                  ? 'いい調子です！この勢いを維持しましょう！'
                  : '連続学習を続けていきましょう！'}
            </p>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
            今期の成果
          </h2>
          {reportData.achievements.length > 0 ? (
            <ul className="space-y-2">
              {reportData.achievements.map((achievement, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {achievement}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              まだデータがありません。学習を始めましょう！
            </p>
          )}
        </div>
      </div>

      {/* Next week goals */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          次の目標
        </h2>
        <ul className="space-y-2">
          {reportData.goals.map((goal, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mt-0.5">
                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                  {i + 1}
                </span>
              </span>
              {goal}
            </li>
          ))}
        </ul>
      </div>

      {/* Level Progress */}
      {hasDiagnosed && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            レベル進捗
          </h2>

          {/* Current Level */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${LEVEL_INFO[userLevel].color}-500 to-${LEVEL_INFO[userLevel].color}-600 flex items-center justify-center shadow-sm`}>
              <span className="text-xl font-black text-white">{userLevel}</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white">
                {LEVEL_INFO[userLevel].label} - {LEVEL_INFO[userLevel].labelJa}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                TOEIC {LEVEL_INFO[userLevel].toeicMin}〜{LEVEL_INFO[userLevel].toeicMax}
              </div>
            </div>
          </div>

          {/* Level Map */}
          <div className="flex items-center justify-between mb-4">
            {CEFR_ORDER.map((lvl, i) => {
              const isCurrent = lvl === userLevel;
              const isPassed = CEFR_ORDER.indexOf(lvl) <= CEFR_ORDER.indexOf(userLevel);
              return (
                <div key={lvl} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300 dark:ring-indigo-700'
                          : isPassed
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      {lvl}
                    </div>
                  </div>
                  {i < CEFR_ORDER.length - 1 && (
                    <div
                      className={`w-4 sm:w-8 h-0.5 mx-0.5 ${
                        isPassed && CEFR_ORDER.indexOf(lvl) < CEFR_ORDER.indexOf(userLevel)
                          ? 'bg-emerald-300 dark:bg-emerald-700'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Level-Up Suggestion */}
          {(() => {
            const accuracy = getOverallAccuracy();
            const nextLevel = checkLevelUp(accuracy);
            if (nextLevel) {
              return (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🎉</span>
                    <span className="font-bold text-amber-700 dark:text-amber-300">レベルアップのチャンス！</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    正答率{accuracy}%を達成しました。レベル診断テストを再受験して <strong>{nextLevel}</strong> にレベルアップしませんか？
                  </p>
                  <Link
                    to="/level-test"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                  >
                    診断テストを受ける &rarr;
                  </Link>
                </div>
              );
            }
            // Show encouragement if not ready for level up
            const currentIdx = CEFR_ORDER.indexOf(userLevel);
            if (currentIdx < CEFR_ORDER.length - 1) {
              return (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {accuracy > 0
                      ? `現在の正答率: ${accuracy}% — 85%以上でレベルアップを提案します`
                      : '問題を解いて正答率を上げていきましょう！'}
                  </p>
                </div>
              );
            }
            return (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  最高レベルに到達しています！素晴らしい！
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-3 pb-6">
        <Link
          to="/"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-base hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
        >
          学習を始める
        </Link>
        <Link
          to="/progress"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 font-bold text-base border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          詳細な進捗を見る
        </Link>
      </div>
    </div>
  );
}

// --- Sub-components ---

function ComparisonArrow({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return <span className="text-gray-400 text-xs">--</span>;
  if (previous === 0) return <span className="text-emerald-500 text-xs font-medium flex items-center gap-0.5"><ArrowUp /> 新規</span>;
  const diff = current - previous;
  const pct = Math.round((Math.abs(diff) / previous) * 100);
  if (diff > 0) return <span className="text-emerald-500 text-xs font-medium flex items-center gap-0.5"><ArrowUp /> {pct}%</span>;
  if (diff < 0) return <span className="text-red-500 text-xs font-medium flex items-center gap-0.5"><ArrowDown /> {pct}%</span>;
  return <span className="text-gray-400 text-xs">±0%</span>;
}

function StatCard({
  label,
  value,
  icon,
  comparison,
}: {
  label: string;
  value: string;
  icon: 'clock' | 'calendar' | 'check' | 'score';
  comparison: React.ReactNode;
}) {
  const iconSvg = {
    clock: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    calendar: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    check: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    score: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-indigo-500 dark:text-indigo-400">{iconSvg[icon]}</span>
        {comparison}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
    </div>
  );
}

function ArrowUp() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
