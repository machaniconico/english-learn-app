import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import { sections } from '../data/sections';
import { dictionary } from '../data/dictionary';
import AudioButton from '../components/AudioButton';
import { useSearchHistory } from '../hooks/useSearchHistory';
import type { DictionaryEntry } from '../data/types';
import { groupResults } from './searchIndex';
import type { SearchResult, GroupKey } from './searchIndex';

// --- Types ---

const GROUP_LABELS: Record<GroupKey, string> = {
  phrases: 'フレーズ',
  vocabulary: '単語',
  grammar: '文法',
  idioms: '慣用句',
  toeic: 'TOEIC',
  dictionary: '辞書',
};

const GROUP_ICONS: Record<GroupKey, string> = {
  phrases: '💬',
  vocabulary: '📝',
  grammar: '📖',
  idioms: '💡',
  toeic: '🎯',
  dictionary: '📚',
};

const GROUP_COLORS: Record<GroupKey, string> = {
  phrases: 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-800 dark:text-indigo-300',
  vocabulary: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-800 dark:text-emerald-300',
  grammar: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-300',
  idioms: 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/40 dark:border-yellow-800 dark:text-yellow-300',
  toeic: 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/40 dark:border-rose-800 dark:text-rose-300',
  dictionary: 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/40 dark:border-purple-800 dark:text-purple-300',
};

const INITIAL_LIMIT = 20;

// --- Helpers ---

function buildSectionIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const section of sections) {
    const groupKey = section.id as GroupKey;
    if (!(groupKey in GROUP_LABELS)) continue;

    for (const category of section.categories) {
      for (const lesson of category.lessons) {
        for (const item of lesson.items) {
          results.push({
            id: item.id,
            english: item.english,
            japanese: item.japanese,
            pronunciation: item.pronunciation,
            example: item.example,
            exampleJa: item.exampleJa,
            breadcrumb: `${section.titleJa} > ${category.titleJa} > ${lesson.titleJa}`,
            link: `/section/${section.id}/${category.id}/${lesson.id}`,
            group: groupKey,
          });
        }
      }
    }
  }

  return results;
}

function buildDictionaryIndex(): SearchResult[] {
  return dictionary.map((entry: DictionaryEntry) => ({
    id: entry.id,
    english: entry.english,
    japanese: entry.japanese,
    pronunciation: entry.pronunciation,
    partOfSpeech: entry.partOfSpeech,
    example: entry.example,
    exampleJa: entry.exampleJa,
    breadcrumb: `辞書 > ${entry.category} > ${entry.partOfSpeech}`,
    link: `/dictionary`,
    group: 'dictionary' as GroupKey,
  }));
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// --- Component ---

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<GroupKey>>(
    new Set(Object.keys(GROUP_LABELS) as GroupKey[])
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<GroupKey>>(new Set());

  // 検索履歴(US-001 の useSearchHistory を配線)
  const { history, addQuery, removeQuery, clear } = useSearchHistory();

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Build full index once
  const allItems = useMemo(() => {
    return [...buildSectionIndex(), ...buildDictionaryIndex()];
  }, []);

  // Filter + search
  const grouped = useMemo(() => {
    return groupResults(allItems, debouncedQuery, activeFilters);
  }, [debouncedQuery, activeFilters, allItems]);

  const totalResults = useMemo(() => {
    return Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
  }, [grouped]);

  // 検索履歴への記録: debouncedQuery が trim 後 2 文字以上 かつ 結果が 1 件以上
  // のときだけ記録する。短すぎる語や 0 件の検索は履歴に残さない。
  // 依存は debouncedQuery と totalResults のみ(フィルタ切替でも totalResults が
  // 変わるが addQuery は大小無視で重複排除するため再呼び出しは無害)。
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length >= 2 && totalResults > 0) {
      addQuery(trimmed);
    }
  }, [debouncedQuery, totalResults, addQuery]);

  const toggleFilter = useCallback((key: GroupKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleAllFilters = useCallback(() => {
    setActiveFilters((prev) => {
      const allKeys = Object.keys(GROUP_LABELS) as GroupKey[];
      if (prev.size === allKeys.length) {
        return new Set<GroupKey>();
      }
      return new Set(allKeys);
    });
  }, []);

  const toggleExpand = useCallback((key: GroupKey) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const allGroups = Object.keys(GROUP_LABELS) as GroupKey[];
  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          <span className="mr-2">🔍</span>コンテンツ検索
        </h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            aria-label="コンテンツを検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="英語・日本語で検索..."
            className="w-full pl-12 pr-10 py-3.5 text-lg rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-shadow"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
              aria-label="検索をクリア"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 最近の検索: 入力が空のときだけ表示。履歴が空なら何も出さない。 */}
      {query.trim() === '' && history.length > 0 && (
        <section className="mb-6" aria-label="最近の検索">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              最近の検索
            </h2>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors"
              aria-label="履歴をクリア"
            >
              <X className="w-3 h-3" aria-hidden="true" />
              履歴をクリア
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((item) => (
              // chip 全体をひとつのボタンにはせず、再検索ボタンと削除ボタンを
              // 兄弟要素として並べる(ボタンの中にボタンを入れると a11y 違反)。
              <div
                key={item}
                className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              >
                <button
                  type="button"
                  onClick={() => setQuery(item)}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
                  aria-label={`${item}を再検索`}
                >
                  <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                  <span>{item}</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeQuery(item)}
                  className="inline-flex items-center justify-center mr-1 p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  aria-label={`${item}を履歴から削除`}
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleAllFilters}
            aria-pressed={activeFilters.size === allGroups.length}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              activeFilters.size === allGroups.length
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400'
            }`}
          >
            すべて
          </button>
          {allGroups.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleFilter(key)}
              aria-pressed={activeFilters.has(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                activeFilters.has(key)
                  ? `${GROUP_COLORS[key]} border-current`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {GROUP_ICONS[key]} {GROUP_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {!hasQuery && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">検索キーワードを入力してください</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            フレーズ、単語、文法、慣用句、TOEIC、辞書を横断検索できます
          </p>
        </div>
      )}

      <div role="status" aria-live="polite">
        {hasQuery && totalResults === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              「<span className="font-semibold text-indigo-600 dark:text-indigo-400">{debouncedQuery}</span>
              」に一致する結果がありません
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              別のキーワードや、フィルターの設定を確認してみてください
            </p>
          </div>
        )}

        {hasQuery && totalResults > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            「<span className="font-medium text-gray-700 dark:text-gray-200">{debouncedQuery}</span>」の検索結果：
            <span className="font-bold text-indigo-600 dark:text-indigo-400 ml-1">{totalResults}件</span>
          </p>
        )}
      </div>

      {hasQuery && totalResults > 0 && (
        <>
          <div className="space-y-6">
            {allGroups.map((groupKey) => {
              const items = grouped[groupKey];
              if (items.length === 0) return null;

              const isExpanded = expandedGroups.has(groupKey);
              const displayItems = isExpanded ? items : items.slice(0, INITIAL_LIMIT);
              const hasMore = items.length > INITIAL_LIMIT;

              return (
                <div key={groupKey} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                  {/* Group Header */}
                  <div className={`px-4 py-3 border-b ${GROUP_COLORS[groupKey]} flex items-center justify-between`}>
                    <h2 className="font-bold text-base flex items-center gap-2">
                      <span>{GROUP_ICONS[groupKey]}</span>
                      {GROUP_LABELS[groupKey]}
                    </h2>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10">
                      {items.length}件
                    </span>
                  </div>

                  {/* Items */}
                  <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                    {displayItems.map((item) => (
                      <li key={item.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Link
                                to={item.link}
                                className="font-semibold text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                {highlightMatch(item.english, debouncedQuery)}
                              </Link>
                              <AudioButton text={item.english} size="sm" />
                              {item.partOfSpeech && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                                  {item.partOfSpeech}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                              {highlightMatch(item.japanese, debouncedQuery)}
                            </p>
                            {item.pronunciation && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {highlightMatch(item.pronunciation, debouncedQuery)}
                              </p>
                            )}
                            {item.example && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                {highlightMatch(item.example, debouncedQuery)}
                              </p>
                            )}
                            <Link
                              to={item.link}
                              className="inline-flex items-center gap-1 text-[11px] text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-1.5 transition-colors"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                              </svg>
                              {item.breadcrumb}
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Show More */}
                  {hasMore && (
                    <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                      <button
                        type="button"
                        onClick={() => toggleExpand(groupKey)}
                        aria-expanded={isExpanded}
                        className="w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        {isExpanded
                          ? '折りたたむ'
                          : `もっと見る（残り ${items.length - INITIAL_LIMIT}件）`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
