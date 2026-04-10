import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sections } from '../data/sections';
import { useProgress } from '../hooks/useProgress';
import {
  useUserLevel,
  CEFR_ORDER,
  LEVEL_INFO,
  type CEFRLevel,
} from '../hooks/useUserLevel';

/** Map section + category index to a CEFR level */
function getCategoryLevel(sectionId: string, categoryIndex: number, totalCategories: number): CEFRLevel {
  const sectionBase: Record<string, number> = {
    phrases: 0,    // A1-A2
    vocabulary: 1,  // A2-B1
    idioms: 2,      // B1-B2
    grammar: 1,     // A2-B2
    toeic: 2,       // B1-C1
  };
  const base = sectionBase[sectionId] ?? 1;
  const progression = totalCategories > 1 ? categoryIndex / (totalCategories - 1) : 0;
  const levelIndex = Math.min(Math.floor(base + progression * 2), CEFR_ORDER.length - 1);
  return CEFR_ORDER[levelIndex];
}

export default function CategoryList() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sections.find((s) => s.id === sectionId);
  const { progress } = useProgress();
  const { level: userLevel, hasDiagnosed } = useUserLevel();
  const [filterLevel, setFilterLevel] = useState<CEFRLevel | 'all'>('all');

  if (!section) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">😥</p>
        <p className="text-gray-500 dark:text-gray-400 text-lg">セクションが見つかりませんでした。</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>
    );
  }

  // Calculate completion for each category
  const categoryStats = section.categories.map((category, idx) => {
    const totalItems = category.lessons.reduce((sum, l) => sum + l.items.length, 0);
    let completedItems = 0;
    for (const lesson of category.lessons) {
      const lp = progress.lessons[lesson.id];
      if (lp) completedItems += lp.completedItems.length;
    }
    const completionPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const cefrLevel = getCategoryLevel(section.id, idx, section.categories.length);
    return { category, completionPct, totalItems, completedItems, cefrLevel, index: idx };
  });

  // Stage lock: category is locked if previous category has < 80% completion
  // Exception: first category always unlocked, diagnostic level can skip
  const getUnlocked = (idx: number, cefrLevel: CEFRLevel): boolean => {
    if (idx === 0) return true;
    // If user diagnosed at or above this level, unlock
    if (hasDiagnosed && CEFR_ORDER.indexOf(userLevel) >= CEFR_ORDER.indexOf(cefrLevel)) {
      return true;
    }
    // Check if previous category is >= 80% complete
    const prev = categoryStats[idx - 1];
    return prev.completionPct >= 80;
  };

  // Filter by level
  const filtered = categoryStats.filter(
    (s) => filterLevel === 'all' || s.cefrLevel === filterLevel,
  );

  // Unique levels present
  const availableLevels = [...new Set(categoryStats.map((s) => s.cefrLevel))];

  return (
    <div>
      {/* Section header */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors mb-4"
        >
          &larr; ホーム
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={section.title}>
            {section.icon}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {section.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{section.titleJa}</p>
          </div>
        </div>
        <p className="mt-3 text-gray-600 dark:text-gray-400">{section.description}</p>
      </div>

      {/* Level filter */}
      {availableLevels.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterLevel === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            全レベル
          </button>
          {availableLevels.map((lvl) => {
            const info = LEVEL_INFO[lvl];
            return (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filterLevel === lvl
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {lvl} {info.labelJa}
              </button>
            );
          })}
        </div>
      )}

      {/* Category cards */}
      {section.categories.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-4xl mb-3">🚧</p>
          <p className="text-gray-500 dark:text-gray-400">準備中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((stat) => {
            const { category, completionPct, cefrLevel, index } = stat;
            const unlocked = getUnlocked(index, cefrLevel);
            const levelInfo = LEVEL_INFO[cefrLevel];

            if (!unlocked) {
              const prevPct = categoryStats[index - 1]?.completionPct ?? 0;
              return (
                <div
                  key={category.id}
                  className="relative block rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5 opacity-70"
                >
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3 text-center border border-gray-200 dark:border-gray-700">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        前のカテゴリを80%完了で解除
                      </p>
                      <div className="mt-1 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${prevPct}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{prevPct}% / 80%</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 blur-[2px]">
                    <span className="text-2xl shrink-0 mt-0.5">{category.icon}</span>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                        {category.title}
                      </h2>
                      <p className="text-sm text-gray-500 truncate">{category.titleJa}</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={category.id}
                to={`/section/${sectionId}/${category.id}`}
                className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="text-2xl shrink-0 mt-0.5"
                    role="img"
                    aria-label={category.title}
                  >
                    {category.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {category.title}
                      </h2>
                      {/* CEFR Badge */}
                      <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-${levelInfo.color}-100 text-${levelInfo.color}-700 dark:bg-${levelInfo.color}-900/40 dark:text-${levelInfo.color}-300`}>
                        {cefrLevel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {category.titleJa}
                    </p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            completionPct >= 80
                              ? 'bg-emerald-500'
                              : completionPct > 0
                                ? 'bg-indigo-500'
                                : ''
                          }`}
                          style={{ width: `${completionPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums w-12 text-right">
                        {completionPct > 0 ? `${completionPct}%` : `${category.lessons.length} レッスン`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Diagnostic test prompt */}
      {!hasDiagnosed && (
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            レベル診断テストを受けると、あなたのレベルに合ったカテゴリが自動的に解除されます。
          </p>
          <Link
            to="/level-test"
            className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            レベル診断テストを受ける &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
