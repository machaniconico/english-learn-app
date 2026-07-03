import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import { useCustomDecks } from '../hooks/useCustomDecks';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';

export default function CustomDeckStudyPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const { getDeck } = useCustomDecks();
  const { addCard, isInSRS } = useSpacedRepetition();
  const [srsResult, setSrsResult] = useState<{ added: number; alreadyIn: number } | null>(null);

  const deck = deckId ? getDeck(deckId) : undefined;

  // Not-found state
  if (!deck) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">📭</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          単語帳が見つかりません
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          このIDの単語帳は存在しないか、削除されました。
        </p>
        <Link
          to="/decks"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          📚 単語帳一覧へ
        </Link>
      </div>
    );
  }

  // Empty state
  if (deck.items.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <Link
            to="/decks"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors mb-4"
          >
            &larr; 単語帳一覧
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {deck.name}
              </h1>
              {deck.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {deck.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <p className="text-5xl mb-4">📝</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            まだ単語がありません
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            単語を追加してから学習を始めましょう。
          </p>
          <Link
            to={`/decks/${deck.id}/edit`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            ✏️ 単語を追加する
          </Link>
        </div>
      </div>
    );
  }

  const handleAddAllToSRS = () => {
    let added = 0;
    let alreadyIn = 0;
    for (const item of deck.items) {
      if (isInSRS(item.id)) {
        alreadyIn++;
      } else {
        addCard({
          id: item.id,
          english: item.english,
          japanese: item.japanese,
          pronunciation: item.pronunciation,
          source: `単語帳: ${deck.name}`,
        });
        added++;
      }
    }
    setSrsResult({ added, alreadyIn });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/decks"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors mb-4"
        >
          &larr; 単語帳一覧
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {deck.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 tabular-nums">
                {deck.description ? `${deck.description} — ` : ''}
                {deck.items.length} 語
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/decks/${deck.id}/edit`}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              ✏️ 編集
            </Link>
            <button
              type="button"
              onClick={handleAddAllToSRS}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              🧠 SRSに追加
            </button>
          </div>
        </div>

        {/* SRS result banner */}
        {srsResult !== null && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 rounded-xl border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-3 text-sm text-indigo-700 dark:text-indigo-300"
          >
            {srsResult.added > 0 && (
              <span>
                {srsResult.added} 語を SRS に追加しました。
              </span>
            )}
            {srsResult.alreadyIn > 0 && (
              <span className="ml-2 text-indigo-500 dark:text-indigo-400">
                （{srsResult.alreadyIn} 語は追加済み）
              </span>
            )}
            {srsResult.added === 0 && srsResult.alreadyIn > 0 && (
              <span>すべての単語はすでに SRS に登録されています。</span>
            )}
          </div>
        )}
      </div>

      {/* Flashcard study area */}
      <Flashcard key={deck.id} items={deck.items} />

      <div className="mt-8 text-center pb-6">
        <Link
          to="/decks"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          📚 単語帳一覧に戻る
        </Link>
      </div>
    </div>
  );
}
