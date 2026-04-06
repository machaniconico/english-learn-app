import { Link, useParams } from 'react-router-dom';
import { sections } from '../data/sections';
import MatchingGame from '../components/MatchingGame';

export default function MatchingGamePage() {
  const { sectionId, categoryId } = useParams<{
    sectionId: string;
    categoryId: string;
  }>();

  // Game mode: specific category selected
  if (sectionId && categoryId) {
    const section = sections.find((s) => s.id === sectionId);
    const category = section?.categories.find((c) => c.id === categoryId);

    if (!section || !category) {
      return (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">😥</p>
          <p className="text-gray-500 text-lg">
            カテゴリが見つかりませんでした。
          </p>
          <Link
            to="/matching"
            className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            &larr; カテゴリ一覧に戻る
          </Link>
        </div>
      );
    }

    // Flatten all items from all lessons in this category
    const allItems = category.lessons.flatMap((lesson) =>
      lesson.items.map((item) => ({
        english: item.english,
        japanese: item.japanese,
      }))
    );

    if (allItems.length < 2) {
      return (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-500 text-lg">
            このカテゴリにはアイテムが足りません。
          </p>
          <Link
            to="/matching"
            className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            &larr; カテゴリ一覧に戻る
          </Link>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6">
          <Link
            to="/matching"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
          >
            &larr; カテゴリ一覧
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎮</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                マッチングゲーム
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {category.title} - {category.titleJa}
              </p>
            </div>
          </div>
        </div>

        <MatchingGame
          items={allItems}
          title={`${category.icon} ${category.titleJa}`}
        />

        <div className="mt-8 text-center pb-6">
          <Link
            to="/matching"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            📋 カテゴリ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  // List mode: show all sections and categories
  return (
    <div>
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          &larr; ホーム
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎮</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              マッチングゲーム
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              英語と日本語のペアを見つけよう
            </p>
          </div>
        </div>
        <p className="mt-3 text-gray-600">
          カードをめくって、英語と日本語の正しいペアをマッチさせましょう。
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => {
          const playableCategories = section.categories.filter(
            (cat) =>
              cat.lessons.flatMap((l) => l.items).length >= 2
          );
          if (playableCategories.length === 0) return null;

          return (
            <div key={section.id}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{section.icon}</span>
                <h2 className="text-lg font-bold text-gray-900">
                  {section.title}
                </h2>
                <span className="text-sm text-gray-400">
                  {section.titleJa}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {playableCategories.map((category) => {
                  const itemCount = category.lessons.flatMap(
                    (l) => l.items
                  ).length;

                  return (
                    <Link
                      key={category.id}
                      to={`/matching/${section.id}/${category.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span className="text-2xl shrink-0">{category.icon}</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {category.titleJa}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {itemCount} アイテム
                        </p>
                      </div>
                      <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors shrink-0">
                        遊ぶ &rarr;
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
