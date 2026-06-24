// =====================================================================
// デイリークイズ結果画面からの「間違えた問題だけ一時的に解き直す」復習 UI。
// 永続化しない・logResult を呼ばない・保存済み結果を書き換えない ephemeral 画面。
// localStorage / react-router に依存せず、親から受け取った onClose で戻るだけ。
// =====================================================================
import { useState } from 'react';
import type { DailyQuizQuestion } from '../data/dailyQuiz';

interface DailyQuizReviewProps {
  questions: DailyQuizQuestion[];
  onClose: () => void;
}

export default function DailyQuizReview({ questions, onClose }: DailyQuizReviewProps) {
  const total = questions.length;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    new Array(total).fill(null),
  );
  const [finished, setFinished] = useState(false);

  // 復習セッション内の正答数(表示用)。
  const correctCount = answers.reduce<number>((acc, a, i) => {
    if (a !== null && questions[i] && a === questions[i].correctIndex) return acc + 1;
    return acc;
  }, 0);

  // --- 安全弁: 復習問題が無い ===
  if (total === 0) {
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          間違えた問題の復習
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          復習する問題はありません。
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="結果に戻る"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          結果に戻る
        </button>
      </div>
    );
  }

  // --- 復習完了フェーズ ===
  if (finished) {
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <p className="text-5xl mb-3">✅</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          復習おつかれさま!
        </h2>
        <div
          role="status"
          aria-live="polite"
          aria-label={`スコア ${correctCount} / ${total}`}
          className="inline-flex items-baseline gap-1 mb-4"
        >
          <span className="text-5xl font-bold text-amber-500 dark:text-amber-400">
            {correctCount}
          </span>
          <span className="text-2xl text-gray-400">/ {total}</span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          この復習の結果は保存されません。
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="結果に戻る"
          className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          結果に戻る
        </button>
      </div>
    );
  }

  // --- 出題フェーズ(DailyQuiz の quiz 画面の見た目を踏襲) ===
  const q = questions[index];
  const currentAnswer = answers[index] ?? null;
  const answered = currentAnswer !== null;
  const score = answers.reduce<number>(
    (acc, a, i) =>
      a !== null && questions[i] && a === questions[i].correctIndex ? acc + 1 : acc,
    0,
  );
  const progressPct = Math.round(((index + (answered ? 1 : 0)) / total) * 100);

  const handleAnswer = (optionIndex: number) => {
    if (answered) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = optionIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* 復習であることを示すバッジ */}
      <div className="mb-3 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-semibold">
          間違えた問題の復習
        </span>
      </div>

      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          第 {index + 1} 問 / {total}
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          正解 {score}
        </span>
      </div>

      {/* 進捗バー */}
      <div
        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden"
        role="progressbar"
        aria-label="復習の進捗"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPct}
      >
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 問題文 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 mb-6">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
          {q.question}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{q.questionJa}</p>
      </div>

      {/* 選択肢 */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {q.options.map((option, i) => {
          let style =
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-gray-700 dark:text-gray-300';
          if (answered) {
            if (i === q.correctIndex) {
              style =
                'bg-green-50 dark:bg-green-900/40 border-green-400 dark:border-green-800 text-green-800 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700';
            } else if (i === currentAnswer) {
              style =
                'bg-red-50 dark:bg-red-900/40 border-red-400 dark:border-red-800 text-red-800 dark:text-red-300 ring-2 ring-red-300 dark:ring-red-700';
            } else {
              style =
                'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500';
            }
          }
          return (
            <button
              key={i}
              type="button"
              aria-pressed={i === currentAnswer}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className={`w-full px-5 py-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
                answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
              } focus:outline-none focus:ring-2 focus:ring-indigo-300 ${style}`}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold shrink-0 ${
                    answered && i === q.correctIndex
                      ? 'bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                      : answered && i === currentAnswer
                        ? 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {answered && i === q.correctIndex
                    ? '○'
                    : answered && i === currentAnswer
                      ? '✕'
                      : String.fromCharCode(65 + i)}
                </span>
                <span>{option}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 解説 + 次へ */}
      {answered && (
        <div>
          <p
            role="status"
            aria-live="assertive"
            className={`text-lg font-bold mb-2 ${
              currentAnswer === q.correctIndex
                ? 'text-green-600 dark:text-green-300'
                : 'text-red-600 dark:text-red-300'
            }`}
          >
            {currentAnswer === q.correctIndex ? '🎉 正解!' : '❌ 不正解'}
          </p>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">
              解説 ({q.category})
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {q.explanation}
            </p>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              {index + 1 >= total ? '結果を見る' : '次の問題 →'}
            </button>
          </div>
        </div>
      )}

      {/* 復習をやめて結果に戻る(いつでも押せる) */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="復習をやめて結果に戻る"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded"
        >
          復習をやめて結果に戻る
        </button>
      </div>
    </div>
  );
}