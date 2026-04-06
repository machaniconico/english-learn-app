import { useCallback, useEffect, useRef, useState } from 'react';
import type { DictationItem } from '../data/types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface DictationProps {
  items: DictationItem[];
}

type ResultGrade = 'perfect' | 'close' | 'wrong';

interface ItemResult {
  item: DictationItem;
  typed: string;
  grade: ResultGrade;
  similarity: number;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calcSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (na.length === 0 || nb.length === 0) return 0;

  const len = Math.max(na.length, nb.length);
  const dist = levenshtein(na, nb);
  return Math.max(0, (len - dist) / len);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function gradeResult(typed: string, correct: string): { grade: ResultGrade; similarity: number } {
  const similarity = calcSimilarity(typed, correct);
  if (similarity === 1) return { grade: 'perfect', similarity };
  if (similarity > 0.8) return { grade: 'close', similarity };
  return { grade: 'wrong', similarity };
}

function highlightDifferences(typed: string, correct: string): React.ReactNode {
  const typedWords = typed.trim().split(/\s+/);
  const correctWords = correct.trim().split(/\s+/);

  return (
    <span>
      {correctWords.map((word, i) => {
        const typedWord = typedWords[i] || '';
        const match = normalize(typedWord) === normalize(word);
        return (
          <span key={i}>
            {i > 0 && ' '}
            <span className={match ? 'text-green-700' : 'text-red-600 font-semibold underline decoration-2'}>
              {word}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function Dictation({ items }: DictationProps) {
  const { speak, speaking, rate, setRate } = useSpeechSynthesis();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answered, setAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentItem = items[currentIndex];
  const currentResult = answered ? results[results.length - 1] : null;

  const handlePlay = useCallback(() => {
    speak(currentItem.sentence);
  }, [speak, currentItem.sentence]);

  const handleCheck = useCallback(() => {
    if (answered || input.trim() === '') return;
    const { grade, similarity } = gradeResult(input, currentItem.sentence);
    setAnswered(true);
    setResults((prev) => [...prev, { item: currentItem, typed: input, grade, similarity }]);
  }, [answered, input, currentItem]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= items.length) {
      setFinished(true);
    } else {
      setCurrentIndex(nextIndex);
      setInput('');
      setAnswered(false);
      setShowHint(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [currentIndex, items.length]);

  const handleRestart = useCallback(() => {
    setFinished(false);
    setCurrentIndex(0);
    setInput('');
    setAnswered(false);
    setShowHint(false);
    setResults([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Keyboard: Enter to check or next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        if (answered) {
          handleNext();
        } else if (input.trim() !== '') {
          handleCheck();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answered, finished, input, handleCheck, handleNext]);

  // Auto-play on new item
  useEffect(() => {
    if (!finished && !answered) {
      const timer = setTimeout(() => speak(currentItem.sentence), 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const perfectCount = results.filter((r) => r.grade === 'perfect').length;
  const closeCount = results.filter((r) => r.grade === 'close').length;
  const scorePoints = perfectCount * 10 + closeCount * 5;
  const maxPoints = results.length * 10;

  // Results screen
  if (finished) {
    const totalMax = items.length * 10;
    const percentage = Math.round((scorePoints / totalMax) * 100);
    const barColor =
      percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    const mistakes = results.filter((r) => r.grade !== 'perfect');

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10">
          {/* Score */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Results / 結果</h2>

            <div className="inline-flex items-baseline gap-1 my-4">
              <span className="text-5xl font-bold text-indigo-600">{scorePoints}</span>
              <span className="text-2xl text-gray-400">/ {totalMax}</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{percentage}% score</p>

            <div className="flex justify-center gap-4 mt-4 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Perfect: {perfectCount}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Close: {closeCount}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Wrong: {results.length - perfectCount - closeCount}
              </span>
            </div>
          </div>

          {/* Mistakes review */}
          {mistakes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-red-500">&#10005;</span>
                間違えた問題の復習
              </h3>
              <div className="space-y-4">
                {mistakes.map((result) => (
                  <div
                    key={result.item.id}
                    className={`border rounded-xl p-4 ${
                      result.grade === 'close'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                          result.grade === 'close'
                            ? 'bg-yellow-200 text-yellow-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {result.grade === 'close'
                          ? `Close (${Math.round(result.similarity * 100)}%)`
                          : 'Wrong'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      <span className="font-medium">Your answer:</span> {result.typed}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium text-gray-500">Correct:</span>{' '}
                      {highlightDifferences(result.typed, result.item.sentence)}
                    </p>
                    <p className="text-sm text-indigo-600 mt-2">{result.item.japanese}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Try again */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              もう一度
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-gray-500 font-medium">
          Question {currentIndex + 1} / {items.length}
        </span>
        <span className="text-indigo-600 font-semibold">
          Score: {scorePoints} / {maxPoints}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${((currentIndex + (answered ? 1 : 0)) / items.length) * 100}%`,
          }}
        />
      </div>

      {/* Listening card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 mb-6">
        <p className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-wide">
          Listen and type / 聞いて書こう
        </p>

        {/* Audio controls */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={handlePlay}
            disabled={speaking}
            className={`
              inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-md
              ${speaking
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer active:scale-[0.97]'}
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            `}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {speaking ? (
                <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            {speaking ? '再生中...' : '再生する'}
          </button>

          {/* Speed toggle */}
          <button
            type="button"
            onClick={() => setRate(rate === 1 ? 0.6 : 1)}
            className={`
              px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-200 cursor-pointer
              ${rate === 0.6
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'}
              focus:outline-none focus:ring-2 focus:ring-indigo-300
            `}
          >
            {rate === 0.6 ? '0.6x' : '1x'}
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={answered}
            placeholder="聞こえた英語を入力してください..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className={`
              w-full px-4 py-3 rounded-xl border-2 text-lg transition-all duration-200
              ${answered
                ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-default'
                : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 text-gray-800'}
              focus:outline-none placeholder:text-gray-400
            `}
          />
        </div>

        {/* Hint button */}
        {currentItem.hint && !answered && (
          <div className="mb-4">
            {showHint ? (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <span className="font-medium">Hint:</span> {currentItem.hint}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
              >
                ヒントを見る
              </button>
            )}
          </div>
        )}

        {/* Check button */}
        {!answered && (
          <button
            type="button"
            onClick={handleCheck}
            disabled={input.trim() === ''}
            className={`
              w-full px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-md
              ${input.trim() === ''
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer active:scale-[0.98]'}
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            `}
          >
            チェックする
          </button>
        )}

        {/* Result feedback */}
        {answered && currentResult && (
          <div
            className={`rounded-xl border p-4 mb-4 ${
              currentResult.grade === 'perfect'
                ? 'bg-green-50 border-green-200'
                : currentResult.grade === 'close'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
            }`}
          >
            <p
              className={`font-bold mb-2 ${
                currentResult.grade === 'perfect'
                  ? 'text-green-700'
                  : currentResult.grade === 'close'
                    ? 'text-yellow-700'
                    : 'text-red-700'
              }`}
            >
              {currentResult.grade === 'perfect'
                ? 'Perfect! 完璧！'
                : currentResult.grade === 'close'
                  ? `Close! 惜しい！ (${Math.round(currentResult.similarity * 100)}% match)`
                  : 'Incorrect / 不正解'}
            </p>

            {currentResult.grade !== 'perfect' && (
              <div className="text-sm space-y-1 mb-2">
                <p className="text-gray-600">
                  <span className="font-medium">Your answer:</span> {currentResult.typed}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Correct:</span>{' '}
                  {highlightDifferences(currentResult.typed, currentResult.item.sentence)}
                </p>
              </div>
            )}

            {currentResult.grade === 'perfect' && (
              <p className="text-sm text-green-700 font-medium">{currentResult.item.sentence}</p>
            )}

            <p className="text-sm text-indigo-600 mt-2">{currentItem.japanese}</p>
          </div>
        )}
      </div>

      {/* Next button */}
      {answered && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {currentIndex + 1 >= items.length ? 'See Results / 結果を見る' : 'Next \u2192'}
          </button>
          <p className="text-xs text-gray-400 mt-2">Press Enter to continue</p>
        </div>
      )}

      {/* Keyboard hint */}
      {!answered && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Enter to check your answer
        </p>
      )}
    </div>
  );
}
