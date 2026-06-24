import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks, type BookmarkedItem } from '../hooks/useBookmarks';
import AudioButton from '../components/AudioButton';
import Flashcard from '../components/Flashcard';
import {
  filterAndSortBookmarks,
  BOOKMARK_SORT_OPTIONS,
  type BookmarkSortKey,
} from './bookmarksFilter';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, clearAll } = useBookmarks();
  const [sortKey, setSortKey] = useState<BookmarkSortKey>('newest');
  const [search, setSearch] = useState('');
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // 検索 + 並べ替えを通した表示用一覧(純粋関数 bookmarksFilter に委譲)。
  const filtered = useMemo(
    () => filterAndSortBookmarks(bookmarks, search, sortKey),
    [bookmarks, search, sortKey],
  );

  const flashcardItems = useMemo(
    () =>
      filtered.map((b) => ({
        id: b.id,
        english: b.english,
        japanese: b.japanese,
        pronunciation: b.pronunciation,
      })),
    [filtered],
  );

  const formatSource = useCallback((source: string) => {
    const parts = source.split('/');
    return parts
      .map((p) =>
        p
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      )
      .join(' > ');
  }, []);

  const handleClearAll = () => {
    clearAll();
    setShowClearConfirm(false);
    setShowFlashcard(false);
  };

  // Flashcard view
  if (showFlashcard && flashcardItems.length > 0) {
    return (
      <div>
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowFlashcard(false)}
            className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors mb-4 cursor-pointer"
          >
            &larr; ブックマーク一覧に戻る
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🃏</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                フラッシュカード復習
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                ブックマーク済み {flashcardItems.length} 件
              </p>
            </div>
          </div>
        </div>

        <Flashcard items={flashcardItems} />

        <div className="mt-8 text-center pb-6">
          <button
            type="button"
            onClick={() => setShowFlashcard(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors cursor-pointer"
          >
            📖 ブックマーク一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">⭐</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          まだブックマークがありません
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          レッスンで気になるフレーズや単語の★ボタンを押して
          <br />
          ブックマークに追加しましょう。
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          📖 レッスンを見る
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors mb-4"
        >
          &larr; ホーム
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">⭐</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              ブックマーク
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              保存済み {bookmarks.length} 件
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="ブックマークを検索"
            placeholder="ブックマークを検索 (英語・日本語・発音・出典)"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
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

        {/* Sort + Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as BookmarkSortKey)}
            aria-label="並べ替え"
            className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent cursor-pointer"
          >
            {BOOKMARK_SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setShowFlashcard(true)}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          >
            🃏 フラッシュカードで復習
          </button>

          {!showClearConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
            >
              すべてクリア
            </button>
          ) : (
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
              >
                本当に削除
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                キャンセル
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results info — stable live region so result-count changes are announced */}
      <p
        className={
          search.trim() ? 'text-sm text-gray-500 dark:text-gray-400 mb-4' : 'sr-only'
        }
        role="status"
        aria-live="polite"
      >
        {search.trim() ? <>{filtered.length} 件の結果</> : ''}
      </p>

      {/* Bookmark cards — 検索ヒット0件のときは専用メッセージ
          (ブックマーク0件の空状態とは区別する) */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          該当するブックマークがありません
        </p>
      ) : (
      <div className="space-y-3 mb-8">
        {filtered.map((item: BookmarkedItem) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-600"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
                  {item.english}
                </h2>
                <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
                  {item.japanese}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {item.pronunciation}
                </p>

                {/* Source badge */}
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                    {formatSource(item.source)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <AudioButton text={item.english} size="sm" />
                <button
                  type="button"
                  onClick={() => removeBookmark(item.id)}
                  className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-red-100 dark:hover:bg-red-950 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label="ブックマーク解除"
                  title="ブックマーク解除"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
