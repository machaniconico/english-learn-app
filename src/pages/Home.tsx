import { Link } from 'react-router-dom';
import { sections } from '../data/sections';

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

export default function Home() {
  return (
    <div>
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
