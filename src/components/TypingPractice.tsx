import { useRef, useState } from 'react';
import type { PhraseItem } from '../data/types';
import { checkSpelling } from '../utils/spellCheck';
import { useTypingRecords } from '../hooks/useTypingRecords';
import { accuracyTrend, isNewTypingBest, recentAccuracyAverage } from '../utils/typingRecords';
import AudioButton from './AudioButton';

interface TypingPracticeProps {
  items: PhraseItem[];
}

export default function TypingPractice({ items }: TypingPracticeProps) {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [beaten, setBeaten] = useState(false);

  const { record, addAttempt } = useTypingRecords();
  const recordedRef = useRef(false);

  const current = items[index];
  const total = items.length;
  const isCorrect = checked && !reveal && checkSpelling(current.english, typed);
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  function submit() {
    if (checked || typed.trim().length === 0) return;
    setChecked(true);
    if (checkSpelling(current.english, typed)) {
      setCorrectCount((c) => c + 1);
    }
  }

  function showAnswer() {
    if (checked) return;
    setReveal(true);
    setChecked(true);
  }

  function next() {
    if (index + 1 >= total) {
      // Record the finished run exactly once, in the event handler (not an
      // effect). Compare against the pre-update best so the "new best"
      // celebration is accurate before addAttempt mutates the record.
      if (!recordedRef.current) {
        recordedRef.current = true;
        setBeaten(isNewTypingBest(record, pct));
        addAttempt(pct, correctCount, total);
      }
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setTyped('');
      setChecked(false);
      setReveal(false);
    }
  }

  function restart() {
    setIndex(0);
    setTyped('');
    setChecked(false);
    setReveal(false);
    setCorrectCount(0);
    setFinished(false);
    setBeaten(false);
    recordedRef.current = false;
  }

  if (!current) return null;

  if (finished) {
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
    const avg = recentAccuracyAverage(record);
    const trend = accuracyTrend(record);
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 sm:p-10">
          <p className="text-5xl mb-4" aria-hidden="true">{emoji}</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">タイピング練習 完了</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2" role="status" aria-label={`スコア ${correctCount} / ${total} 正解`}>
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{correctCount}</span>
            <span className="text-lg"> / {total} 正解</span>
          </p>

          {/* New-best celebration vs. quiet best display */}
          {beaten ? (
            <p
              role="status"
              className="mt-2 mb-1 inline-block rounded-full bg-amber-100 dark:bg-amber-900/40 px-4 py-1.5 text-base font-bold text-amber-700 dark:text-amber-300"
            >
              🎉 自己ベスト更新！ {record.bestPct}%
            </p>
          ) : (
            <p className="mt-2 mb-1 text-sm text-gray-500 dark:text-gray-400">
              自己ベスト {record.bestPct}%
            </p>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            プレイ回数: <span className="font-semibold text-gray-700 dark:text-gray-200">{record.plays}</span> 回
          </p>

          {record.history.length > 1 && (
            <div className="mt-4 text-left">
              <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400" role="status">
                直近{record.history.length}回の平均 {avg}%
                {trend > 0 && ` ・ 向上 +${trend}% 📈`}
                {trend < 0 && ` ・ 低下 ${trend}% 📉`}
                {trend === 0 && ' ・ 横ばい →'}
              </p>
              <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-2 text-center">
                直近の記録
              </p>
              <ul className="flex flex-wrap justify-center gap-1.5">
                {record.history.slice(0, 5).map((a, i) => (
                  <li
                    key={a.timestamp + '-' + i}
                    className="rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300"
                  >
                    {a.pct}%
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={restart}
            className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            もう一度
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          {index + 1} / {total}
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          正解: {correctCount}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${((index + (checked ? 1 : 0)) / total) * 100}%` }} />
      </div>

      {/* Prompt */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sm:p-8 mb-6 text-center">
        <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-3">
          英語でタイプしよう
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">{current.japanese}</p>
        {current.pronunciation && (
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{current.pronunciation}</p>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!checked) submit();
        }}
      >
        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={checked}
          aria-label="英語を入力"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="ここに英語を入力..."
          className={`w-full px-4 py-3 rounded-xl border-2 text-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-80 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
            checked
              ? isCorrect
                ? 'border-green-400'
                : 'border-red-400'
              : 'border-gray-200 dark:border-gray-600'
          }`}
        />
        {!checked && (
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={showAnswer}
              className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              答えを見る
            </button>
            <button
              type="submit"
              disabled={typed.trim().length === 0}
              className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              チェック
            </button>
          </div>
        )}
      </form>

      {/* Feedback */}
      {checked && (
        <div className="mt-6 text-center" role="status" aria-live="polite">
          <p className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isCorrect ? '🎉 正解！' : reveal ? '答え' : '❌ 不正解'}
          </p>
          {!isCorrect && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">正しいスペル</p>
              <div className="text-xl font-bold text-gray-800 dark:text-gray-100 inline-flex items-center gap-2">
                <span>{current.english}</span>
                <AudioButton text={current.english} size="sm" />
              </div>
              {!reveal && (
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">あなたの入力: {typed}</p>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={next}
            className="mt-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {index + 1 >= total ? '結果を見る' : '次へ →'}
          </button>
        </div>
      )}
    </div>
  );
}
