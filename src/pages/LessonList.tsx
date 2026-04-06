import { Link, useParams } from 'react-router-dom';
import { sections } from '../data/sections';

export default function LessonList() {
  const { sectionId, categoryId } = useParams<{
    sectionId: string;
    categoryId: string;
  }>();

  const section = sections.find((s) => s.id === sectionId);
  const category = section?.categories.find((c) => c.id === categoryId);

  if (!section || !category) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">😥</p>
        <p className="text-gray-500 text-lg">カテゴリが見つかりませんでした。</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>
    );
  }

  const basePath = `/section/${sectionId}/${categoryId}`;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          to={`/section/${sectionId}`}
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          &larr; {section.title}
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={category.title}>
            {category.icon}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {category.title}
            </h1>
            <p className="text-sm text-gray-500">{category.titleJa}</p>
          </div>
        </div>
        <p className="mt-3 text-gray-600">{category.description}</p>
      </div>

      {/* Lesson cards */}
      <div className="space-y-4">
        {category.lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {lesson.title}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 ml-8">{lesson.titleJa}</p>
                <p className="mt-2 text-sm text-gray-600 ml-8">
                  {lesson.description}
                </p>
                <p className="mt-2 text-xs text-gray-400 ml-8">
                  {lesson.items.length} フレーズ
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 ml-8 flex flex-wrap gap-2">
              <Link
                to={`${basePath}/${lesson.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <span>📖</span>
                学習
              </Link>
              <Link
                to={`${basePath}/${lesson.id}/flashcard`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-indigo-600 text-sm font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors"
              >
                <span>🃏</span>
                カード
              </Link>
              <Link
                to={`${basePath}/${lesson.id}/quiz`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-emerald-600 text-sm font-medium border border-emerald-200 hover:bg-emerald-50 transition-colors"
              >
                <span>🎧</span>
                クイズ
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
