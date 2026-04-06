import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import type { SRSCard } from '../hooks/useSpacedRepetition';
import AudioButton from '../components/AudioButton';

const qualityOptions: { value: 0 | 1 | 2 | 3 | 4 | 5; label: string; color: string }[] = [
  { value: 0, label: '全然わからない', color: 'bg-red-500 hover:bg-red-600' },
  { value: 1, label: '見たことはある', color: 'bg-orange-500 hover:bg-orange-600' },
  { value: 2, label: 'なんとなくわかる', color: 'bg-amber-500 hover:bg-amber-600' },
  { value: 3, label: '少し考えた', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { value: 4, label: 'すぐわかった', color: 'bg-lime-500 hover:bg-lime-600' },
  { value: 5, label: '完璧！', color: 'bg-emerald-500 hover:bg-emerald-600' },
];

export default function SRSPage() {
  const { cards, getDueCards, getStats, reviewCard, removeCard } = useSpacedRepetition();
  const [reviewMode, setReviewMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const stats = getStats();
  const dueCards = useMemo(() => getDueCards(), [getDueCards]);

  // Find the nearest next review date for display
  const nextReviewDate = useMemo(() => {
    if (cards.length === 0) return null;
    const today = new Date().toISOString().slice(0, 10);
    const future = cards
      .filter((c) => c.nextReview > today)
      .sort((a, b) => a.nextReview.localeCompare(b.nextReview));
    if (future.length === 0) return null;
    const next = future[0].nextReview;
    const diffMs = new Date(next + 'T00:00:00').getTime() - new Date(today + 'T00:00:00').getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [cards]);

  const currentCard: SRSCard | undefined = dueCards[currentIndex];

  function startReview() {
    setReviewMode(true);
    setCurrentIndex(0);
    setRevealed(false);
    setSessionComplete(false);
  }

  function handleRate(quality: 0 | 1 | 2 | 3 | 4 | 5) {
    if (!currentCard) return;
    reviewCard(currentCard.id, quality);

    if (currentIndex + 1 >= dueCards.length) {
      setSessionComplete(true);
      setReviewMode(false);
    } else {
      setCurrentIndex((i) => i + 1);
      setRevealed(false);
    }
  }

  function exitReview() {
    setReviewMode(false);
    setCurrentIndex(0);
    setRevealed(false);
  }

  // Review mode UI
  if (reviewMode && currentCard) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={exitReview}
            className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            &larr; 戻る
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {currentIndex + 1} / {dueCards.length}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex) / dueCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {currentCard.english}
          </p>
          <div className="mb-4">
            <AudioButton text={currentCard.english} size="lg" />
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mt-4 px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition-all shadow-sm cursor-pointer"
            >
              答えを見る
            </button>
          ) : (
            <div className="mt-4">
              <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {currentCard.japanese}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {currentCard.pronunciation}
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                どれくらいわかりましたか？
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {qualityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleRate(opt.value)}
                    className={`${opt.color} text-white font-bold py-3 px-3 rounded-xl text-sm transition-all shadow-sm hover:shadow-md cursor-pointer`}
                  >
                    <span className="text-lg block">{opt.value}</span>
                    <span className="text-xs opacity-90">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Source info */}
        <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          出典: {currentCard.source}
        </p>
      </div>
    );
  }

  // Session complete
  if (sessionComplete) {
    return (
      <div className="text-center py-12">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          今日の復習は完了！
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {nextReviewDate
            ? `次の復習は ${nextReviewDate}日後です`
            : 'すべてのカードをマスターしました！'}
        </p>
        <button
          onClick={() => setSessionComplete(false)}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
        >
          ダッシュボードに戻る
        </button>
      </div>
    );
  }

  // Dashboard
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          SRS 間隔反復学習
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          SM-2アルゴリズムによる効率的な復習
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">総カード数</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{stats.due}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">今日の復習</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-500">{stats.mastered}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">マスター済み</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">{stats.learning}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">学習中</p>
        </div>
      </div>

      {/* Start review or empty state */}
      {stats.total === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-4xl mb-4">📚</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            SRSカードを追加しましょう
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            レッスンページのフレーズ横にある「SRS」ボタンから追加できます。
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
          >
            レッスンを見る
          </Link>
        </div>
      ) : stats.due === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-4xl mb-4">✅</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            今日の復習は完了！
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {nextReviewDate
              ? `次の復習は ${nextReviewDate}日後です`
              : 'すべてのカードが復習済みです'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-4xl mb-4">🧠</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {stats.due}枚のカードが復習待ちです
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            今日の復習を始めましょう
          </p>
          <button
            onClick={startReview}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            復習を開始
          </button>
        </div>
      )}

      {/* Card list */}
      {cards.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            SRSカード一覧
          </h2>
          <div className="space-y-2">
            {cards.map((card) => {
              const today = new Date().toISOString().slice(0, 10);
              const isDue = card.nextReview <= today;
              return (
                <div
                  key={card.id}
                  className={`bg-white dark:bg-gray-800 rounded-xl border p-4 flex items-center justify-between gap-3 ${
                    isDue
                      ? 'border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-900/10'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 dark:text-gray-100 truncate">
                      {card.english}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {card.japanese}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                      <span>間隔: {card.interval}日</span>
                      <span>反復: {card.repetitions}回</span>
                      <span>
                        {isDue ? (
                          <span className="text-orange-500 font-medium">復習待ち</span>
                        ) : (
                          <>次回: {card.nextReview}</>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <AudioButton text={card.english} size="sm" />
                    <button
                      onClick={() => removeCard(card.id)}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 transition-colors cursor-pointer"
                      title="SRSから削除"
                      aria-label="SRSから削除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Link to lessons */}
      {stats.total > 0 && (
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            レッスンからカードを追加する &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
