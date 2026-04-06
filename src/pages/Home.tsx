import { Link } from 'react-router-dom';
import { sections } from '../data/sections';
import { useProgress } from '../hooks/useProgress';
import { useEffect } from 'react';

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

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const stats = getOverallStats();
  const totalAvailable = countTotalItems();
  const hasProgress = stats.totalItems > 0 || progress.streak > 0;
  const completionPct =
    totalAvailable > 0 ? Math.round((stats.totalItems / totalAvailable) * 100) : 0;

  return (
    <div>
      {/* Progress Summary (only shown if there is progress) */}
      {hasProgress && (
        <Link
          to="/progress"
          className="group mb-6 flex items-center gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl">{progress.streak > 0 ? '\u{1F525}' : '\u{1F4CA}'}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800">
                {progress.streak > 0
                  ? `${progress.streak}日連続学習中！`
                  : '学習を続けよう！'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                達成率 {completionPct}% / {stats.totalItems} アイテム学習済み
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#e0e7ff" strokeWidth="4" />
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
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-700">
                {completionPct}%
              </span>
            </div>
            <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors hidden sm:block">
              詳細 &rarr;
            </span>
          </div>
        </Link>
      )}

      {/* Hero Section */}
      <section className="text-center py-10 sm:py-16">
        <p className="text-5xl sm:text-6xl mb-4">📖</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          英語を楽しく学ぼう
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-indigo-600 font-medium">
          Learn English the Fun Way
        </p>
        <p className="mt-4 text-gray-500 max-w-md mx-auto leading-relaxed">
          フレーズ・単語・文法・TOEIC対策まで、
          <br className="hidden sm:inline" />
          ステップバイステップで英語力を伸ばそう。
        </p>
      </section>

      {/* Quick Links */}
      <section className="mb-8 space-y-3">
        <Link
          to="/toeic-practice"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            📝
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
              TOEIC模試
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Part 5形式の空所補充問題で実力チェック
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors shrink-0">
            挑戦する &rarr;
          </span>
        </Link>

        <Link
          to="/error-correction"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            🔍
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
              誤り訂正
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              文中の文法エラーを見つけて訂正する練習
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors shrink-0">
            挑戦する &rarr;
          </span>
        </Link>

        <Link
          to="/dictation"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            🎧
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
              ディクテーション
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              英語を聞いて書き取るリスニング練習
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors shrink-0">
            挑戦する &rarr;
          </span>
        </Link>

        <Link
          to="/matching"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            🎮
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
              マッチングゲーム
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              英語と日本語のペアをマッチさせよう
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors shrink-0">
            遊ぶ &rarr;
          </span>
        </Link>

        <Link
          to="/reorder"
          className="group flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-sm shrink-0">
            {'\u{1F500}'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
              語順クイズ
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              英単語を正しい語順に並べ替える練習
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors shrink-0">
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
                  ? `${meta.color} hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`
                  : 'bg-gray-50 border-gray-200 opacity-60 cursor-default'
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
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {section.title}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{section.titleJa}</p>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {section.description}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                {hasData ? (
                  <>
                    <span className="text-xs font-medium text-gray-400">
                      {section.categories.length} カテゴリ / {lessonCount} レッスン
                    </span>
                    <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors">
                      学習する &rarr;
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-gray-400">
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
