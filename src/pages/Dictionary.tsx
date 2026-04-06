import { useState, useMemo, useEffect, useRef } from 'react';
import { dictionary } from '../data/dictionary';
import type { DictionaryEntry } from '../data/types';
import AudioButton from '../components/AudioButton';

const ITEMS_PER_PAGE = 20;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const categoryColors: Record<string, string> = {
  基本: 'bg-blue-100 text-blue-700',
  食べ物: 'bg-orange-100 text-orange-700',
  動物: 'bg-green-100 text-green-700',
  自然: 'bg-emerald-100 text-emerald-700',
  体: 'bg-rose-100 text-rose-700',
  家族: 'bg-pink-100 text-pink-700',
  仕事: 'bg-slate-100 text-slate-700',
  旅行: 'bg-cyan-100 text-cyan-700',
  学校: 'bg-yellow-100 text-yellow-700',
  感情: 'bg-purple-100 text-purple-700',
  時間: 'bg-indigo-100 text-indigo-700',
  天気: 'bg-sky-100 text-sky-700',
  買い物: 'bg-amber-100 text-amber-700',
  健康: 'bg-red-100 text-red-700',
  趣味: 'bg-teal-100 text-teal-700',
  スポーツ: 'bg-lime-100 text-lime-700',
  音楽: 'bg-violet-100 text-violet-700',
  料理: 'bg-orange-100 text-orange-700',
  色: 'bg-fuchsia-100 text-fuchsia-700',
  数字: 'bg-gray-100 text-gray-700',
};

function getCategoryColor(category: string): string {
  return categoryColors[category] ?? 'bg-gray-100 text-gray-700';
}

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [selectedLevel, setSelectedLevel] = useState<string>('すべて');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setVisibleCount(ITEMS_PER_PAGE);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLetterChange = (letter: string | null) => {
    setSelectedLetter(letter);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(dictionary.map((e: DictionaryEntry) => e.category)));
    cats.sort();
    return ['すべて', ...cats];
  }, []);

  // Filter entries
  const filteredEntries = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim();

    return dictionary.filter((entry: DictionaryEntry) => {
      // Search filter
      if (
        query &&
        !entry.english.toLowerCase().includes(query) &&
        !entry.japanese.includes(query)
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'すべて' && entry.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel === '初級' && entry.level !== 'beginner') return false;
      if (selectedLevel === '中級' && entry.level !== 'intermediate')
        return false;

      // Alphabet filter
      if (
        selectedLetter &&
        !entry.english.toUpperCase().startsWith(selectedLetter)
      ) {
        return false;
      }

      return true;
    });
  }, [debouncedQuery, selectedCategory, selectedLevel, selectedLetter]);

  const visibleEntries = filteredEntries.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEntries.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const levelLabels = ['すべて', '初級', '中級'] as const;

  return (
    <div>
      {/* Header */}
      <section className="text-center py-8 sm:py-12">
        <p className="text-5xl sm:text-6xl mb-4">📖</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          英和辞書
        </h1>
        <p className="mt-2 text-lg text-indigo-600 font-medium">
          English-Japanese Dictionary
        </p>
        <p className="mt-3 text-gray-500 max-w-md mx-auto leading-relaxed">
          英単語を検索して、意味・発音・例文を確認しよう。
        </p>
      </section>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          placeholder="英語または日本語で検索..."
          className="w-full pl-12 pr-4 py-3.5 text-lg rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-shadow placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="検索をクリア"
          >
            ✕
          </button>
        )}
      </div>

      {/* Alphabet Quick Jump */}
      <div className="flex flex-wrap justify-center gap-1 mb-5 max-w-2xl mx-auto">
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() =>
              handleLetterChange(selectedLetter === letter ? null : letter)
            }
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              selectedLetter === letter
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'
            }`}
          >
            {letter}
          </button>
        ))}
        {selectedLetter && (
          <button
            type="button"
            onClick={() => handleLetterChange(null)}
            className="px-3 h-8 rounded-lg text-xs font-medium bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            クリア
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-4 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Level Filter */}
      <div className="flex gap-2 mb-6">
        {levelLabels.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handleLevelChange(label)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              selectedLevel === label
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500 mb-4 font-medium">
        {filteredEntries.length} 件の結果
        {selectedLetter && (
          <span className="ml-2 text-indigo-600">
            [{selectedLetter}]
          </span>
        )}
      </p>

      {/* Word Cards */}
      {visibleEntries.length > 0 ? (
        <div className="space-y-4 pb-6">
          {visibleEntries.map((entry: DictionaryEntry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Top row: Word + Audio + Part of speech */}
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {entry.english}
                </h2>
                <AudioButton text={entry.english} size="sm" />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {entry.partOfSpeech}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entry.level === 'beginner'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {entry.level === 'beginner' ? '初級' : '中級'}
                </span>
              </div>

              {/* Japanese + Pronunciation */}
              <p className="mt-2 text-lg text-gray-800">{entry.japanese}</p>
              <p className="text-sm text-gray-400 mt-0.5">
                {entry.pronunciation}
              </p>

              {/* Example sentence */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-medium text-indigo-600">例文: </span>
                      {entry.example}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {entry.exampleJa}
                    </p>
                  </div>
                  <div className="shrink-0 mt-0.5">
                    <AudioButton text={entry.example} size="sm" />
                  </div>
                </div>
              </div>

              {/* Category badge */}
              <div className="mt-3">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(entry.category)}`}
                >
                  {entry.category}
                </span>
              </div>
            </div>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center py-4">
              <button
                type="button"
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-indigo-600 border border-indigo-200 bg-white hover:bg-indigo-50 hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              >
                もっと見る
                <span className="text-xs text-gray-400">
                  ({filteredEntries.length - visibleCount} 件)
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium text-gray-700">
            検索結果がありません
          </p>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            別のキーワードやフィルターを試してみてください。
            <br />
            英語でも日本語でも検索できます。
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('すべて');
              handleLevelChange('すべて');
              handleLetterChange(null);
            }}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            フィルターをリセット
          </button>
        </div>
      )}
    </div>
  );
}
