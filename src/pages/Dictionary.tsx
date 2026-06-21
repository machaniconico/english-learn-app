import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, X, NotebookPen } from 'lucide-react';
import { dictionary } from '../data/dictionary';
import type { DictionaryEntry } from '../data/types';
import { filterDictionary } from './dictionaryFilter';
import AudioButton from '../components/AudioButton';
import { useRecentWords } from '../hooks/useRecentWords';
import { useWordNotes } from '../hooks/useWordNotes';

const ITEMS_PER_PAGE = 20;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const categoryColors: Record<string, string> = {
  基本: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  食べ物: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  動物: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  自然: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  体: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  家族: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
  仕事: 'bg-slate-100 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300',
  旅行: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
  学校: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
  感情: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  時間: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  天気: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
  買い物: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  健康: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  趣味: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300',
  スポーツ: 'bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300',
  音楽: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  料理: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
  色: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-700 dark:text-fuchsia-300',
  数字: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
};

function getCategoryColor(category: string): string {
  return categoryColors[category] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
}

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [selectedLevel, setSelectedLevel] = useState<string>('すべて');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 発音再生をトリガーに記録する最近調べた単語(localStorage に保持)。
  const { recent, addWord, clear } = useRecentWords();

  // 単語メモ(個人ノート): localStorage に保存される自分用メモ。
  const { getNote, setNote, removeNote } = useWordNotes();
  // 現在編集中のカードの entry.id(同時1件のみ)。null は編集中なし。
  const [editingId, setEditingId] = useState<string | null>(null);
  // textarea の現在の入力内容。
  const [draft, setDraft] = useState('');

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
    const base = filterDictionary(dictionary, {
      query: debouncedQuery,
      category: selectedCategory,
      level: selectedLevel,
    });

    // Alphabet filter
    if (!selectedLetter) return base;
    return base.filter((entry: DictionaryEntry) =>
      entry.english.toUpperCase().startsWith(selectedLetter),
    );
  }, [debouncedQuery, selectedCategory, selectedLevel, selectedLetter]);

  const visibleEntries = filteredEntries.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEntries.length;

  // デフォルト表示: 検索・カテゴリ・レベル・頭文字がすべて未選択の状態。
  // 最近調べた単語セクションはこのときだけ表示する。
  const isDefaultView =
    debouncedQuery === '' &&
    selectedCategory === 'すべて' &&
    selectedLevel === 'すべて' &&
    selectedLetter === null;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  // メモ編集を開始する: editingId をセットし、textarea に現在のメモを初期表示する。
  const handleStartEdit = (id: string, note: string) => {
    setEditingId(id);
    setDraft(note);
  };

  // メモを保存して編集を閉じる。空入力なら setNote が自動的に削除扱いになる。
  const handleSaveNote = (id: string) => {
    setNote(id, draft);
    setEditingId(null);
    setDraft('');
  };

  // 編集を破棄して閉じる。
  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft('');
  };

  // メモを削除して編集を閉じる。
  const handleDeleteNote = (id: string) => {
    removeNote(id);
    setEditingId(null);
    setDraft('');
  };

  const levelLabels = ['すべて', '初級', '中級'] as const;

  return (
    <div>
      {/* Header */}
      <section className="text-center py-8 sm:py-12">
        <p className="text-5xl sm:text-6xl mb-4">📖</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          英和辞書
        </h1>
        <p className="mt-2 text-lg text-indigo-600 font-medium">
          English-Japanese Dictionary
        </p>
        <p className="mt-3 text-gray-500 max-w-md mx-auto leading-relaxed">
          英単語を検索して、意味・発音・例文を確認しよう。
        </p>
        {/* 単語メモ一覧ページへの導線。メモはこの辞書で付けられるため、ここに置くのが最も自然。 */}
        <Link
          to="/my-notes"
          aria-label="単語メモ一覧を見る"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <NotebookPen className="h-4 w-4" aria-hidden="true" />
          単語メモ一覧
        </Link>
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
          aria-label="英単語を検索"
          placeholder="英語または日本語で検索..."
          className="w-full pl-12 pr-4 py-3.5 text-lg rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="検索をクリア"
          >
            ✕
          </button>
        )}
      </div>

      {/* Alphabet Quick Jump */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-5 max-w-2xl mx-auto">
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() =>
              handleLetterChange(selectedLetter === letter ? null : letter)
            }
            aria-pressed={selectedLetter === letter}
            className={`min-w-[40px] min-h-[40px] w-9 h-9 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              selectedLetter === letter
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300'
            }`}
          >
            {letter}
          </button>
        ))}
        {selectedLetter && (
          <button
            type="button"
            onClick={() => handleLetterChange(null)}
            className="px-3 h-8 rounded-lg text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
              aria-pressed={selectedCategory === cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300'
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
            aria-pressed={selectedLevel === label}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              selectedLevel === label
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 最近調べた単語: デフォルト表示のときだけ出す。履歴が空なら何も表示しない。 */}
      {isDefaultView && recent.length > 0 && (
        <section className="mb-4" aria-label="最近調べた単語">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              最近調べた単語
            </h2>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded px-1"
              aria-label="最近調べた単語をクリア"
            >
              <X className="w-3 h-3" aria-hidden="true" />
              クリア
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setSearchQuery(w.english)}
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label={`${w.english} を検索`}
              >
                <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                <span>{w.english}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium" role="status" aria-live="polite">
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
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Top row: Word + Audio + Part of speech */}
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {entry.english}
                </h2>
                {/* 発音を再生した単語を『最近調べた単語』へ記録する */}
                <AudioButton
                  text={entry.english}
                  size="sm"
                  onPlayed={() =>
                    addWord({
                      id: entry.id,
                      english: entry.english,
                      japanese: entry.japanese,
                    })
                  }
                />
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {entry.partOfSpeech}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    entry.level === 'beginner'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                      : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {entry.level === 'beginner' ? '初級' : '中級'}
                </span>
              </div>

              {/* Japanese + Pronunciation */}
              <p className="mt-2 text-lg text-gray-800 dark:text-gray-200">{entry.japanese}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {entry.pronunciation}
              </p>

              {/* Example sentence */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="font-medium text-indigo-600">例文: </span>
                      {entry.example}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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

              {/* 単語メモ(個人ノート): localStorage に永続化される自分用メモ */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                {editingId === entry.id ? (
                  // 編集中: textarea + 保存/キャンセル/削除
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={draft}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setDraft(e.target.value)
                      }
                      aria-label={`${entry.english} のメモ`}
                      rows={3}
                      placeholder="この単語のメモを書く..."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveNote(entry.id)}
                        aria-label={`${entry.english} のメモを保存`}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        aria-label={`${entry.english} のメモ編集をキャンセル`}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        キャンセル
                      </button>
                      {getNote(entry.id) !== '' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(entry.id)}
                          aria-label={`${entry.english} のメモを削除`}
                          className="px-3 py-1 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  </div>
                ) : getNote(entry.id) !== '' ? (
                  // メモ有り: 本文 + 編集ボタン
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 whitespace-pre-wrap break-words">
                      {getNote(entry.id)}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(entry.id, getNote(entry.id))}
                      aria-label={`${entry.english} のメモを編集`}
                      className="shrink-0 px-3 py-1 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      編集
                    </button>
                  </div>
                ) : (
                  // メモ無し: 追加ボタン
                  <button
                    type="button"
                    onClick={() => handleStartEdit(entry.id, '')}
                    aria-label={`${entry.english} のメモを追加`}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    ＋ メモを追加
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center py-4">
              <button
                type="button"
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
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
        <div className="text-center py-16" role="status" aria-live="polite">
          <p className="text-5xl mb-4" aria-hidden="true">🔍</p>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
            検索結果がありません
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
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
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            フィルターをリセット
          </button>
        </div>
      )}
    </div>
  );
}
