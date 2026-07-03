import { useState } from 'react';
import type { PhraseItem } from '../data/types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { scorePronunciation } from '../utils/pronunciationScore';
import AudioButton from './AudioButton';

interface PronunciationPracticeProps {
  items: PhraseItem[];
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export default function PronunciationPractice({ items }: PronunciationPracticeProps) {
  const { startListening, listening, transcript, supported } = useSpeechRecognition();
  const [index, setIndex] = useState(0);
  // Which item the current transcript belongs to (so a stale transcript from the
  // previous item is never shown after advancing). Set on each record attempt.
  const [recordedIndex, setRecordedIndex] = useState(-1);
  const [scores, setScores] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const current = items[index];
  const total = items.length;

  const showResult =
    recordedIndex === index && !listening && transcript.trim().length > 0;
  const result = showResult ? scorePronunciation(current.english, transcript) : null;

  function record() {
    setRecordedIndex(index);
    startListening();
  }

  function next() {
    const updatedScores = result ? [...scores, result.score] : scores;
    if (result) setScores(updatedScores);
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setRecordedIndex(-1);
    }
  }

  function restart() {
    setIndex(0);
    setRecordedIndex(-1);
    setScores([]);
    setFinished(false);
  }

  if (!current) return null;

  // Results screen
  if (finished) {
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const emoji = avg >= 80 ? '🎉' : avg >= 50 ? '👍' : '💪';
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 sm:p-10">
          <p className="text-5xl mb-4">{emoji}</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">発音練習 完了</h2>
          <div
            role="status"
            aria-label={`平均スコア ${avg} パーセント`}
            className="inline-flex items-baseline gap-1 my-6"
          >
            <span className={`text-5xl font-bold ${scoreColor(avg)}`}>{avg}</span>
            <span className="text-2xl text-gray-500 dark:text-gray-400">%</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{scores.length}フレーズの平均一致率</p>
          <button
            type="button"
            onClick={restart}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
          スコア平均: {scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '--'}
          {scores.length > 0 ? '%' : ''}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      {/* Target phrase */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sm:p-8 mb-6 text-center">
        <p className="text-xs uppercase tracking-wider text-indigo-400 dark:text-indigo-400 font-semibold mb-3">
          このフレーズを発音しよう
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
          {/* Word-by-word highlight once attempted */}
          {result
            ? result.words.map((w, i) => (
                <span
                  key={i}
                  className={w.matched ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}
                >
                  {w.word}
                  {i < result.words.length - 1 ? ' ' : ''}
                </span>
              ))
            : current.english}
        </p>
        <p className="text-base text-gray-600 dark:text-gray-300 mt-2">{current.japanese}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{current.pronunciation}</p>
        <div className="mt-4 flex justify-center">
          <AudioButton text={current.english} size="md" />
        </div>
      </div>

      {/* Record control */}
      {!supported ? (
        <p role="alert" className="text-center text-sm text-red-600 dark:text-red-400 mb-6">
          お使いのブラウザは音声認識に対応していません。Google Chrome でお試しください。
        </p>
      ) : (
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={record}
            disabled={listening}
            aria-label={listening ? '聞き取り中' : '録音して発音する'}
            className={`w-20 h-20 rounded-full inline-flex items-center justify-center text-4xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              listening
                ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 animate-pulse ring-2 ring-red-300 dark:ring-red-700'
                : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 active:scale-95'
            }`}
          >
            🎤
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2" aria-live="polite">
            {listening ? '聞き取り中...' : 'タップして話す'}
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="text-center" role="status" aria-live="polite">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">あなたの発話</p>
          <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3">「{transcript}」</p>
          <p className="mb-4">
            <span className={`text-3xl font-bold ${scoreColor(result.score)}`}>
              {result.score}%
            </span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              {result.matchedCount}/{result.total} 語一致
            </span>
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={record}
              className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              もう一度話す
            </button>
            <button
              type="button"
              onClick={next}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {index + 1 >= total ? '結果を見る' : '次へ →'}
            </button>
          </div>
        </div>
      )}

      {/* Skip when not yet attempted */}
      {!result && (
        <div className="text-center">
          <button
            type="button"
            onClick={next}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded"
          >
            スキップ
          </button>
        </div>
      )}
    </div>
  );
}
