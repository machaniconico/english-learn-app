import { Link } from 'react-router-dom';
import { sections } from '../data/sections';
import { useProgress } from '../hooks/useProgress';
import { useWeakPoints } from '../hooks/useWeakPoints';
import { useEffect, useState } from 'react';

const sectionMeta: Record<string, { icon: string; color: string; gradient: string }> = {
  phrases: {
    icon: '💬',
    color: 'bg-blue-50 border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
  },
  vocabulary: {
    icon: '📝',
    color: 'bg-emerald-50 border-emerald-200',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  grammar: {
    icon: '📐',
    color: 'bg-amber-50 border-amber-200',
    gradient: 'from-amber-500 to-amber-600',
  },
  toeic: {
    icon: '🎯',
    color: 'bg-purple-50 border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
  },
};

function countLessons(categories: { lessons: unknown[] }[]): number {
  return categories.reduce((sum, cat) => sum + cat.lessons.length, 0);
}

function countTotalItems(): number {
  let total = 0;
  for (const section of sections) {
    for (const category of section.categories) {
      for (const lesson of category.lessons) {
        total += lesson.items.length;
      }
    }
  }
  return total;
}

export default function Home() {
  const { progress, getOverallStats, updateStreak } = useProgress();
  const { weakPoints } = useWeakPoints();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const stats = getOverallStats();
  const totalAvailable = countTotalItems();
  const hasProgress = stats.totalItems > 0 || progress.streak > 0;
  const completionPct =
    totalAvailable > 0 ? Math.round((stats.totalItems / totalAvailable) * 100) : 0;

  // Daily challenge status
  const [dailyCompleted, setDailyCompleted] = useState(0);
  useEffect(() => {
    try {
      const d = new Date();
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const raw = localStorage.getItem(`daily-challenge-${dateKey}`);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.completed && Array.isArray(data.completed)) {
          setDailyCompleted(data.completed.filter(Boolean).length);
        }
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <div>
      {/* Daily Challenge Card */}
      <Link
        to="/daily"
        className="group mb-6 flex items-center gap-4 rounded-2xl border border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-2xl shadow-sm shrink-0">
          {'\u{1F31F}'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">
            今日のチャレンジ
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {dailyCompleted === 5
              ? '全チャレンジ完了！素晴らしい！'
              : dailyCompleted > 0
                ? `${dailyCompleted}/5 完了 - 続きに挑戦しよう！`
                : '5つのミニチャレンジに挑戦しよう！'}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {dailyCompleted === 5 ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold">
              {'\u2713'}
            </span>
          ) : (
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs font-bold">
              {dailyCompleted}/5
            </span>
          )}
          <span className="text-sm font-medium text-orange-500 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors hidden sm:block">
            挑戦する &rarr;
          </span>
        </div>
      </Link>

      {/* Weak Points Card (only shown if there are weak points) */}
      {weakPoints.length > 0 && (
        <Link
          to="/weak-points"
          className="group mb-6 flex items-center gap-4 rounded-2xl border border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 text-2xl shadow-sm shrink-0">
            {'\u{1F4AA}'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
              {'\u5F31\u70B9\u514B\u670D'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {weakPoints.length}{'\u4EF6\u306E\u5F31\u70B9\u3092\u5FA9\u7FD2\u3057\u3088\u3046'}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold">
              {weakPoints.length}
            </span>
            <span className="text-sm font-medium text-red-500 group-hover:text-red-700 transition-colors hidden sm:block">
              {'\u5FA9\u7FD2\u3059\u308B'} &rarr;
            </span>
          </div>
        </Link>
      )}

      {/* Progress Summary (only shown if there is progress) */}
      {hasProgress && (
        <Link
          to="/progress"
          className="group mb-6 flex items-center gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl">{progress.streak > 0 ? '\u{1F525}' : '\u{1F4CA}'}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {progress.streak > 0
                  ? `${progress.streak}日連続学習中！`
                  : '学習を続けよう！'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                達成率 {completionPct}% / {stats.totalItems} アイテム学習済み
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#e0e7ff" strokeWidth="4" className="dark:stroke-indigo-900" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(completionPct / 100) * 125.6} 125.6`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-400">
                {completionPct}%
              </span>
            </div>
            <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors hidden sm:block">
              詳細 &rarr;
            </span>
          </div>
        </Link>
      )}

      {/* Hero Section */}
      <section className="text-center py-10 sm:py-16">
        <p className="text-5xl sm:text-6xl mb-4">📖</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          英語を楽しく学ぼう
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-indigo-600 dark:text-indigo-400 font-medium">
          Learn English the Fun Way
        </p>
        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          フレーズ・単語・文法・TOEIC対策まで、
          <br className="hidden sm:inline" />
          ステップバイステップで英語力を伸ばそう。
        </p>
      </section>

      {/* Quick Links */}
      <section className="mb-8 space-y-3">
        <Link
          to="/toeic-practice"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            📝
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              TOEIC模試
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Part 5形式の空所補充問題で実力チェック
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors shrink-0">
            挑戦する &rarr;
          </span>
        </Link>

        <Link
          to="/error-correction"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            🔍
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              誤り訂正
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              文中の文法エラーを見つけて訂正する練習
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors shrink-0">
            挑戦する &rarr;
          </span>
        </Link>

        {/* Listening Practice Section */}
        {/* Listening Practice Section */}
        <div className="rounded-2xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/50 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl shadow-sm shrink-0">
              {'\u{1F3A7}'}
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {'\u30EA\u30B9\u30CB\u30F3\u30B0\u7DF4\u7FD2'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/part1-listening"
              className="group flex items-center gap-3 rounded-xl border border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-2xl shrink-0">{'\u{1F5BC}'}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  Part 1 {'\u5199\u771F\u63CF\u5199'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {'\u5834\u9762\u3092\u805E\u3044\u3066\u9078\u3076'}
                </p>
              </div>
              <span className="text-xs text-cyan-500 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 shrink-0">&rarr;</span>
            </Link>
            <Link
              to="/part2-listening"
              className="group flex items-center gap-3 rounded-xl border border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-2xl shrink-0">{'\u{1F3A4}'}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  Part 2 {'\u5FDC\u7B54\u554F\u984C'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {'\u8CEA\u554F\u306B\u6700\u9069\u306A\u5FDC\u7B54\u3092\u9078\u3076'}
                </p>
              </div>
              <span className="text-xs text-cyan-500 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 shrink-0">&rarr;</span>
            </Link>
            <Link
              to="/dictation"
              className="group flex items-center gap-3 rounded-xl border border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <span className="text-2xl shrink-0">{'\u{270D}'}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  {'\u30C7\u30A3\u30AF\u30C6\u30FC\u30B7\u30E7\u30F3'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {'\u805E\u3044\u3066\u66F8\u304D\u53D6\u308B\u7DF4\u7FD2'}
                </p>
              </div>
              <span className="text-xs text-cyan-500 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 shrink-0">&rarr;</span>
            </Link>
          </div>
        </div>

        <Link
          to="/matching"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            🎮
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              マッチングゲーム
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              英語と日本語のペアをマッチさせよう
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors shrink-0">
            遊ぶ &rarr;
          </span>
        </Link>

        <Link
          to="/reorder"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            {'\u{1F500}'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              語順クイズ
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              英単語を正しい語順に並べ替える練習
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors shrink-0">
            挑戦する &rarr;
          </span>
        </Link>
      </section>

      {/* Section Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-10">
        {sections.map((section) => {
          const meta = sectionMeta[section.id] ?? {
            icon: section.icon,
            color: 'bg-gray-50 border-gray-200',
            gradient: 'from-gray-500 to-gray-600',
          };
          const lessonCount = countLessons(section.categories);
          const hasData = section.categories.length > 0;

          return (
            <Link
              key={section.id}
              to={hasData ? `/section/${section.id}` : '#'}
              className={`group relative block rounded-2xl border p-6 transition-all duration-200 ${
                hasData
                  ? `${meta.color} dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60 cursor-default'
              }`}
              onClick={(e) => {
                if (!hasData) e.preventDefault();
              }}
            >
              {/* Icon badge */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} text-2xl shadow-sm mb-4`}
              >
                <span role="img" aria-label={section.title}>
                  {meta.icon}
                </span>
              </div>

              {/* Titles */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                {section.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{section.titleJa}</p>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.description}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                {hasData ? (
                  <>
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                      {section.categories.length} カテゴリ / {lessonCount} レッスン
                    </span>
                    <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors">
                      学習する &rarr;
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    準備中...
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
