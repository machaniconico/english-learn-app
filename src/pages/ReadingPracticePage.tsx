import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { readingPassages } from '../data/toeic/reading-passages';
import ReadingComprehension from '../components/ReadingComprehension';
import { estimateReadingMinutes } from '../utils/readingTime';

const levelConfig = {
  beginner: {
    badge: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800',
    gradient: 'from-green-500 to-emerald-600',
    icon: '🌱',
    label: '初級',
  },
  intermediate: {
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
    gradient: 'from-yellow-500 to-amber-600',
    icon: '📈',
    label: '中級',
  },
  advanced: {
    badge: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
    gradient: 'from-red-500 to-rose-600',
    icon: '🔥',
    label: '上級',
  },
} as const;

const typeIcons: Record<string, string> = {
  Email: '📧',
  Notice: '📋',
  Advertisement: '📰',
  Article: '📄',
  'Double Passage': '📑',
  Letter: '✉️',
};

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const tabs: { key: LevelFilter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'beginner', label: '初級' },
  { key: 'intermediate', label: '中級' },
  { key: 'advanced', label: '上級' },
];

export default function ReadingPracticePage() {
  const { passageId } = useParams<{ passageId: string }>();
  const [filter, setFilter] = useState<LevelFilter>('all');

  // Single passage view
  if (passageId) {
    const passage = readingPassages.find((p) => p.id === passageId);

    if (!passage) {
      return (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">😥</p>
          <p className="text-gray-500 dark:text-gray-400 text-lg">問題が見つかりませんでした。</p>
          <Link
            to="/reading-practice"
            className="mt-6 inline-block text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            &larr; 読解問題一覧に戻る
          </Link>
        </div>
      );
    }

    const config = levelConfig[passage.level];

    return (
      <div>
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/reading-practice"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors mb-4"
          >
            &larr; 読解問題一覧に戻る
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{typeIcons[passage.type] || '📖'}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {passage.titleJa}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">{passage.title}</p>
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${config.badge}`}
                >
                  {config.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Comprehension */}
        <ReadingComprehension passage={passage} />

        {/* Back link */}
        <div className="mt-8 text-center pb-6">
          <Link
            to="/reading-practice"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
          >
            📋 読解問題一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  // List view
  const filtered =
    filter === 'all'
      ? readingPassages
      : readingPassages.filter((p) => p.level === filter);

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-4xl mb-3">📖</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          TOEIC Part 7 Reading Practice
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">TOEIC模試 - 読解問題</p>
        <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          TOEIC Part 7形式の長文読解問題で、メール・広告・記事などのビジネス文書を読み解く力を鍛えましょう。
        </p>
      </div>

      {/* Back to home */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>

      {/* Level filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-indigo-300
              ${
                filter === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Passage cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-10">
        {filtered.map((passage) => {
          const config = levelConfig[passage.level];
          const readingMinutes = estimateReadingMinutes(passage.passage);

          return (
            <Link
              key={passage.id}
              to={`/reading-practice/${passage.id}`}
              className="group block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} text-2xl shadow-sm mb-4`}
              >
                {typeIcons[passage.type] || '📖'}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${config.badge}`}
                >
                  {config.label}
                </span>
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                  {passage.type} / {passage.typeJa}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                {passage.titleJa}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{passage.title}</p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {passage.questions.length} 問
                  {readingMinutes > 0 && ` · 📖 約${readingMinutes}分`}
                </span>
                <span className="text-sm font-medium text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                  挑戦する &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
