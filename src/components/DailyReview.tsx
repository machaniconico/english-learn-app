import { useState } from 'react';
import type { ReviewItem } from '../utils/reviewQueue';
import AudioButton from './AudioButton';

interface DailyReviewProps {
  items: ReviewItem[];
  /** quality 1=again, 3=hard, 4=good, 5=easy (SM-2) */
  onReviewSrs: (id: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
  onReviewWeak: (id: string, correct: boolean) => void;
}

const SRS_RATINGS: { label: string; quality: 1 | 3 | 4 | 5; className: string }[] = [
  { label: 'もう一度', quality: 1, className: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60' },
  { label: '難しい', quality: 3, className: 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:hover:bg-amber-900/60' },
  { label: '普通', quality: 4, className: 'bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/60' },
  { label: '簡単', quality: 5, className: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60' },
];

export default function DailyReview({ items, onReviewSrs, onReviewWeak }: DailyReviewProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const total = items.length;
  const current = items[index];

  function advance() {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function rateSrs(quality: 1 | 3 | 4 | 5) {
    if (current.kind === 'srs') {
      onReviewSrs(current.card.id, quality);
      advance();
    }
  }

  function rateWeak(correct: boolean) {
    if (current.kind === 'weak') {
      onReviewWeak(current.weak.id, correct);
      advance();
    }
  }

  if (!current) return null;

  if (finished) {
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 sm:p-10">
          <p className="text-5xl mb-4" aria-hidden="true">🎉</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">復習完了！</h2>
          <p className="text-gray-500 dark:text-gray-400" role="status">
            {total}件の復習を終えました。お疲れさまでした！
          </p>
        </div>
      </div>
    );
  }

  const progress = (index / total) * 100;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          {index + 1} / {total}
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          {current.kind === 'srs' ? '単語カード' : '弱点'}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sm:p-8 mb-6 min-h-[220px] flex flex-col items-center justify-center text-center gap-3">
        {current.kind === 'srs' ? (
          <>
            <p className="text-xs uppercase tracking-wider text-indigo-400 dark:text-indigo-300 font-semibold">
              {flipped ? 'English' : '日本語の意味'}
            </p>
            {!flipped ? (
              <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                {current.card.japanese}
              </p>
            ) : (
              <div role="status" aria-live="polite">
                <p className="text-2xl sm:text-3xl font-bold text-indigo-800 dark:text-indigo-300">
                  {current.card.english}
                </p>
                <p className="text-base text-indigo-500 dark:text-indigo-400 mt-1">{current.card.pronunciation}</p>
                <div className="mt-3 flex justify-center">
                  <AudioButton text={current.card.english} size="md" />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-wider text-rose-400 dark:text-rose-300 font-semibold">
              {flipped ? '正しい答え' : '前回まちがえた問題'}
            </p>
            {!flipped ? (
              <>
                <p className="text-base text-gray-500 dark:text-gray-400">あなたの解答</p>
                <p className="text-xl font-bold text-red-500 dark:text-red-400 line-through">
                  {current.weak.wrongAnswer || '（未解答）'}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-400 mt-2">正しい答えを思い出そう</p>
              </>
            ) : (
              <div role="status" aria-live="polite">
                <p className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300">
                  {current.weak.correctAnswer}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      {!flipped ? (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="px-6 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            答えを見る
          </button>
        </div>
      ) : current.kind === 'srs' ? (
        <div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">思い出せましたか？</p>
          <div className="grid grid-cols-4 gap-2">
            {SRS_RATINGS.map((r) => (
              <button
                key={r.quality}
                type="button"
                onClick={() => rateSrs(r.quality)}
                className={`py-3 rounded-lg text-sm font-bold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300 ${r.className}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => rateWeak(false)}
            className="px-6 py-3 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            もう一度
          </button>
          <button
            type="button"
            onClick={() => rateWeak(true)}
            className="px-6 py-3 rounded-xl bg-green-100 text-green-700 font-bold hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            できた
          </button>
        </div>
      )}
    </div>
  );
}
