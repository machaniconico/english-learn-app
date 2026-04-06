import { useState, useMemo } from 'react';
import { useAnalytics, type LearningEvent, type Stats } from '../hooks/useAnalytics';

// --- Helpers ---

const TYPE_LABELS: Record<string, string> = {
  lesson_view: 'レッスン閲覧',
  quiz_complete: 'クイズ完了',
  flashcard_complete: 'フラッシュカード',
  dictation_complete: 'ディクテーション',
  daily_challenge: 'デイリーチャレンジ',
};

const CATEGORY_LABELS: Record<string, string> = {
  phrases: 'フレーズ',
  vocabulary: '語彙',
  grammar: '文法',
  toeic: 'TOEIC',
};

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}分`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}時間${rem}分` : `${h}時間`;
}

function getDateString(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// --- Period tabs ---

type Period = 7 | 30 | 9999;

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: '7日', value: 7 },
  { label: '30日', value: 30 },
  { label: '全期間', value: 9999 },
];

// --- Components ---

function SummaryCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: '学習日数',
      value: `${stats.activeDays}日`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
      label: 'セッション数',
      value: `${stats.totalSessions}回`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    },
    {
      label: '平均スコア',
      value: stats.avgScore > 0 ? `${stats.avgScore}%` : '--',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    },
    {
      label: '学習項目数',
      value: `${Object.values(stats.byType).reduce((a, b) => a + b, 0)}件`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.color} mb-3`}>
            {card.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}

function ActivityCalendar({ events }: { events: LearningEvent[] }) {
  const dayData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of events) {
      const key = getDateString(e.timestamp);
      counts[key] = (counts[key] ?? 0) + 1;
    }

    const days: { date: string; count: number; dayOfWeek: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = getDateString(d.getTime());
      days.push({ date: key, count: counts[key] ?? 0, dayOfWeek: d.getDay() });
    }
    return days;
  }, [events]);

  const maxCount = Math.max(1, ...dayData.map((d) => d.count));

  function getColor(count: number): string {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
    const intensity = count / maxCount;
    if (intensity <= 0.25) return 'bg-green-200 dark:bg-green-900';
    if (intensity <= 0.5) return 'bg-green-400 dark:bg-green-700';
    if (intensity <= 0.75) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-600 dark:bg-green-500';
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        学習カレンダー（30日間）
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {dayData.map((day) => (
          <div key={day.date} className="relative group">
            <div
              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm ${getColor(day.count)} transition-colors`}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 dark:bg-gray-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {day.date} - {day.count}件
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
        <span>少ない</span>
        <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-700" />
        <div className="w-4 h-4 rounded-sm bg-green-200 dark:bg-green-900" />
        <div className="w-4 h-4 rounded-sm bg-green-400 dark:bg-green-700" />
        <div className="w-4 h-4 rounded-sm bg-green-500 dark:bg-green-600" />
        <div className="w-4 h-4 rounded-sm bg-green-600 dark:bg-green-500" />
        <span>多い</span>
      </div>
    </div>
  );
}

function ScoreTrend({ events }: { events: LearningEvent[] }) {
  const quizScores = useMemo(() => {
    return events
      .filter((e) => e.score !== undefined && (e.type === 'quiz_complete' || e.type === 'daily_challenge'))
      .slice(-10)
      .map((e) => ({
        score: e.score!,
        date: getDateString(e.timestamp),
        type: TYPE_LABELS[e.type] ?? e.type,
      }));
  }, [events]);

  if (quizScores.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">スコア推移</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
          まだクイズのデータがありません
        </p>
      </div>
    );
  }

  const maxScore = 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        スコア推移（直近10回）
      </h3>
      <div className="flex items-end gap-2 h-40">
        {quizScores.map((q, i) => {
          const height = Math.max(4, (q.score / maxScore) * 100);
          const color =
            q.score >= 80
              ? 'bg-green-500 dark:bg-green-400'
              : q.score >= 60
                ? 'bg-blue-500 dark:bg-blue-400'
                : q.score >= 40
                  ? 'bg-amber-500 dark:bg-amber-400'
                  : 'bg-red-500 dark:bg-red-400';
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {q.score}%
              </span>
              <div
                className={`w-full rounded-t-md ${color} transition-all`}
                style={{ height: `${height}%` }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 px-2 py-1 bg-gray-900 dark:bg-gray-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {q.date} - {q.type}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryBreakdown({ events }: { events: LearningEvent[] }) {
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of events) {
      const cat = e.category ?? 'other';
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([key, count]) => ({
        key,
        label: CATEGORY_LABELS[key] ?? key,
        count,
      }));
  }, [events]);

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          カテゴリ別学習
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
          まだデータがありません
        </p>
      </div>
    );
  }

  const maxCount = Math.max(1, ...categories.map((c) => c.count));

  const COLORS = [
    'bg-indigo-500 dark:bg-indigo-400',
    'bg-emerald-500 dark:bg-emerald-400',
    'bg-amber-500 dark:bg-amber-400',
    'bg-purple-500 dark:bg-purple-400',
    'bg-rose-500 dark:bg-rose-400',
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        カテゴリ別学習
      </h3>
      <div className="space-y-3">
        {categories.map((cat, i) => (
          <div key={cat.key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
              <span className="text-gray-500 dark:text-gray-400">{cat.count}回</span>
            </div>
            <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${COLORS[i % COLORS.length]} transition-all duration-500`}
                style={{ width: `${(cat.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyComparison() {
  const { getWeeklyComparison } = useAnalytics();
  const { thisWeek, lastWeek, improvement } = useMemo(() => getWeeklyComparison(), [getWeeklyComparison]);

  const comparisons = [
    {
      label: 'セッション数',
      current: thisWeek.totalSessions,
      previous: lastWeek.totalSessions,
      unit: '回',
    },
    {
      label: '平均スコア',
      current: thisWeek.avgScore,
      previous: lastWeek.avgScore,
      unit: '%',
    },
    {
      label: '学習項目',
      current: Object.values(thisWeek.byType).reduce((a, b) => a + b, 0),
      previous: Object.values(lastWeek.byType).reduce((a, b) => a + b, 0),
      unit: '件',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">先週と比較</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {improvement > 0
          ? `全体スコア +${improvement}% 向上`
          : improvement < 0
            ? `全体スコア ${improvement}% 変動`
            : 'スコア変化なし'}
      </p>
      <div className="space-y-3">
        {comparisons.map((c) => {
          const diff = c.current - c.previous;
          const arrow = diff > 0 ? '\u2191' : diff < 0 ? '\u2193' : '-';
          const color =
            diff > 0
              ? 'text-green-600 dark:text-green-400'
              : diff < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400';
          return (
            <div
              key={c.label}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {c.label}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  先週: {c.previous}{c.unit}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {c.current}{c.unit}
                </span>
                <span className={`text-lg font-bold ${color}`}>{arrow}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StudyPatterns({ events }: { events: LearningEvent[] }) {
  const dayStats = useMemo(() => {
    const counts = new Array(7).fill(0) as number[];
    for (const e of events) {
      const day = new Date(e.timestamp).getDay();
      counts[day]++;
    }
    return counts;
  }, [events]);

  const maxCount = Math.max(1, ...dayStats);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        曜日別学習パターン
      </h3>
      <div className="flex items-end gap-2 sm:gap-3 h-32">
        {dayStats.map((count, i) => {
          const height = Math.max(4, (count / maxCount) * 100);
          const isWeekend = i === 0 || i === 6;
          const color = isWeekend
            ? 'bg-indigo-300 dark:bg-indigo-600'
            : 'bg-indigo-500 dark:bg-indigo-400';
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {count > 0 ? count : ''}
              </span>
              <div
                className={`w-full rounded-t-md ${color} transition-all`}
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Recommendations({ events, stats }: { events: LearningEvent[]; stats: Stats }) {
  const tips = useMemo(() => {
    const result: { text: string; icon: string }[] = [];

    // Check category gaps
    const catCounts: Record<string, number> = {};
    for (const e of events) {
      if (e.category) {
        catCounts[e.category] = (catCounts[e.category] ?? 0) + 1;
      }
    }

    const allCats = ['phrases', 'vocabulary', 'grammar', 'toeic'];
    for (const cat of allCats) {
      if ((catCounts[cat] ?? 0) < 3) {
        const label = CATEGORY_LABELS[cat] ?? cat;
        result.push({
          text: `最近${label}の練習が少ないです。${label}セクションを復習しましょう。`,
          icon: '\u{1F4DA}',
        });
      }
    }

    // Score trend
    const recentScores = events
      .filter((e) => e.score !== undefined)
      .slice(-5)
      .map((e) => e.score!);
    if (recentScores.length >= 3) {
      const first = recentScores.slice(0, Math.floor(recentScores.length / 2));
      const second = recentScores.slice(Math.floor(recentScores.length / 2));
      const firstAvg = first.reduce((a, b) => a + b, 0) / first.length;
      const secondAvg = second.reduce((a, b) => a + b, 0) / second.length;
      if (secondAvg > firstAvg + 5) {
        result.push({
          text: 'スコアが上昇傾向です！上級問題に挑戦してみましょう。',
          icon: '\u{1F680}',
        });
      } else if (secondAvg < firstAvg - 5) {
        result.push({
          text: 'スコアが少し下がっています。基礎を振り返ってみましょう。',
          icon: '\u{1F4AA}',
        });
      }
    }

    // Study consistency
    if (stats.activeDays < 3 && stats.totalSessions > 0) {
      result.push({
        text: '毎日少しでも学習を続けると効果的です。学習習慣を作りましょう！',
        icon: '\u{1F31F}',
      });
    }

    // Encourage more quizzes
    if ((stats.byType['quiz_complete'] ?? 0) < 3) {
      result.push({
        text: 'クイズに挑戦して理解度を確認しましょう。',
        icon: '\u{2705}',
      });
    }

    if (result.length === 0) {
      result.push({
        text: '素晴らしい学習ペースです！この調子で続けましょう。',
        icon: '\u{1F389}',
      });
    }

    return result.slice(0, 4);
  }, [events, stats]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        おすすめアドバイス
      </h3>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg"
          >
            <span className="text-xl flex-shrink-0">{tip.icon}</span>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Page ---

export default function AnalyticsPage() {
  const { getStats, getEventsForPeriod } = useAnalytics();
  const [period, setPeriod] = useState<Period>(7);

  const stats = useMemo(() => getStats(period), [getStats, period]);
  const events = useMemo(() => getEventsForPeriod(period), [getEventsForPeriod, period]);
  const allEvents = useMemo(() => getEventsForPeriod(90), [getEventsForPeriod]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            学習分析
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            学習の進捗と傾向を確認しましょう
          </p>
        </div>

        {/* Period selector */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                period === opt.value
                  ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <SummaryCards stats={stats} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ActivityCalendar events={allEvents} />
        <ScoreTrend events={events} />
      </div>

      {/* Category & weekly comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CategoryBreakdown events={events} />
        <WeeklyComparison />
      </div>

      {/* Study patterns & recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <StudyPatterns events={events} />
        <Recommendations events={events} stats={stats} />
      </div>

      {/* Total time */}
      {stats.totalTime > 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            総学習時間: <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatTime(stats.totalTime)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
