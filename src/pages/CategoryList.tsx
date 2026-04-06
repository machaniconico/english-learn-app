import { Link, useParams } from 'react-router-dom';
import { sections } from '../data/sections';

export default function CategoryList() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sections.find((s) => s.id === sectionId);

  if (!section) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">😥</p>
        <p className="text-gray-500 text-lg">セクションが見つかりませんでした。</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Section header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          &larr; ホーム
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={section.title}>
            {section.icon}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {section.title}
            </h1>
            <p className="text-sm text-gray-500">{section.titleJa}</p>
          </div>
        </div>
        <p className="mt-3 text-gray-600">{section.description}</p>
      </div>

      {/* Category cards */}
      {section.categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <p className="text-4xl mb-3">🚧</p>
          <p className="text-gray-500">準備中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {section.categories.map((category) => (
            <Link
              key={category.id}
              to={`/section/${sectionId}/${category.id}`}
              className="group block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <span
                  className="text-2xl shrink-0 mt-0.5"
                  role="img"
                  aria-label={category.title}
                >
                  {category.icon}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
                    {category.title}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {category.titleJa}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                  <p className="mt-3 text-xs text-gray-400">
                    {category.lessons.length} レッスン
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
