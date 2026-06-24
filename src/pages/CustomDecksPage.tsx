import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomDecks } from '../hooks/useCustomDecks';
import type { CustomDeck } from '../data/types';
import {
  filterAndSortDecks,
  DECK_SORT_OPTIONS,
  type DeckSortKey,
} from './customDecksFilter';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function CreateDeckForm({ onSubmit, onCancel }: { onSubmit: (name: string, description: string) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [touched, setTouched] = useState(false);

  const nameError = touched && name.trim() === '' ? '単語帳の名前を入力してください' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (name.trim() === '') return;
    onSubmit(name.trim(), description.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-700 p-5 mb-6"
      aria-label="新しい単語帳を作成"
      noValidate
    >
      <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
        新しい単語帳を作成
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="deck-name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            名前 <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="deck-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="例：ビジネス英語"
            aria-required="true"
            aria-describedby={nameError ? 'deck-name-error' : undefined}
            className={`w-full px-3 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
              nameError
                ? 'border-red-400'
                : 'border-gray-200 dark:border-gray-600'
            }`}
          />
          {nameError && (
            <p id="deck-name-error" role="alert" className="mt-1 text-xs text-red-600">
              {nameError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="deck-description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            説明 <span className="text-gray-400 text-xs font-normal">（任意）</span>
          </label>
          <input
            id="deck-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例：TOEICビジネスメール頻出単語"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            作成する
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] inline-flex items-center px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 cursor-pointer"
          >
            キャンセル
          </button>
        </div>
      </div>
    </form>
  );
}

function DeckCard({ deck, onDelete }: { deck: CustomDeck; onDelete: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(deck.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-indigo-200 dark:hover:border-indigo-600 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug truncate">
            {deck.name}
          </h2>
          {deck.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
              {deck.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="tabular-nums font-semibold text-indigo-600 dark:text-indigo-400">
              {deck.items.length} 語
            </span>
            <span>更新: {formatDate(deck.updatedAt)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          to={`/decks/${deck.id}`}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          📖 学習する
        </Link>
        <Link
          to={`/decks/${deck.id}/edit`}
          className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
        >
          ✏️ 編集
        </Link>

        <div className="flex-1" />

        {!confirmDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`「${deck.name}」を削除`}
            className="min-h-[44px] inline-flex items-center px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 cursor-pointer"
          >
            削除
          </button>
        ) : (
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={handleDelete}
              className="min-h-[44px] inline-flex items-center px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 cursor-pointer"
            >
              本当に削除
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="min-h-[44px] inline-flex items-center px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 cursor-pointer"
            >
              キャンセル
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomDecksPage() {
  const { decks, createDeck, deleteDeck } = useCustomDecks();
  const [showForm, setShowForm] = useState(false);
  // 検索文字列(初期 '')。並べ替えキー(初期 'newest'=作成が新しい順)。
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<DeckSortKey>('newest');

  // 検索 + 並べ替えを通した表示用デッキ。
  const visibleDecks = useMemo(
    () => filterAndSortDecks(decks, query, sortKey),
    [decks, query, sortKey],
  );

  const handleCreate = (name: string, description: string) => {
    createDeck(name, description || undefined);
    setShowForm(false);
  };

  if (decks.length === 0 && !showForm) {
    return (
      <div>
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 font-medium transition-colors mb-4"
          >
            &larr; ホーム
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            カスタム単語帳
          </h1>
        </div>

        <div className="text-center py-20">
          <p className="text-5xl mb-4" aria-hidden="true">📚</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            まだ単語帳がありません
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            自分だけの単語帳を作って、好きな単語やフレーズを登録しましょう。
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            ＋ 最初の単語帳を作成
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 font-medium transition-colors mb-4"
        >
          &larr; ホーム
        </Link>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">📚</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                カスタム単語帳
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums">
                {decks.length} 冊
              </p>
            </div>
          </div>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 cursor-pointer whitespace-nowrap"
            >
              ＋ 新しい単語帳を作成
            </button>
          )}
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <CreateDeckForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 検索 + 並べ替え(デッキ1件以上のときだけ表示) */}
      {decks.length > 0 && (
        <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="デッキを検索"
            placeholder="名前・説明で検索"
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as DeckSortKey)}
            aria-label="並べ替え"
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          >
            {DECK_SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* デッキ一覧: 検索結果0件(デッキは存在する)のときは専用メッセージ */}
      {decks.length > 0 && visibleDecks.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          該当するデッキがありません
        </p>
      ) : (
        <div className="space-y-4">
          {visibleDecks.map((deck) => (
            <DeckCard key={deck.id} deck={deck} onDelete={deleteDeck} />
          ))}
        </div>
      )}
    </div>
  );
}
