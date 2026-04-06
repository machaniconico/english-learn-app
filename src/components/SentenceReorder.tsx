import { useCallback, useEffect, useState } from 'react';
import type { ReorderQuestion } from '../data/types';
import AudioButton from './AudioButton';

interface SentenceReorderProps {
  questions: ReorderQuestion[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

export default function SentenceReorder({ questions }: SentenceReorderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pool, setPool] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<{ question: ReorderQuestion; correct: boolean }[]>([]);

  const currentQuestion = questions[currentIndex];

  // Initialize pool with shuffled words when question changes
  const initQuestion = useCallback((idx: number) => {
    const q = questions[idx];
    let shuffled = shuffleArray(q.words);
    // Ensure shuffled order differs from correct order
    let attempts = 0;
    while (arraysEqual(shuffled, q.words) && attempts < 20) {
      shuffled = shuffleArray(q.words);
      attempts++;
    }
    setPool(shuffled);
    setAnswer([]);
    setChecked(false);
    setIsCorrect(false);
    setShaking(false);
    setHintUsed(false);
  }, [questions]);

  useEffect(() => {
    initQuestion(currentIndex);
  }, [currentIndex, initQuestion]);

  const handlePickWord = useCallback((index: number) => {
    if (checked) return;
    setPool((prev) => {
      const next = [...prev];
      const [word] = next.splice(index, 1);
      setAnswer((a) => [...a, word]);
      return next;
    });
  }, [checked]);

  const handleRemoveWord = useCallback((index: number) => {
    if (checked) return;
    setAnswer((prev) => {
      const next = [...prev];
      const [word] = next.splice(index, 1);
      setPool((p) => [...p, word]);
      return next;
    });
  }, [checked]);

  const handleCheck = useCallback(() => {
    if (answer.length !== currentQuestion.words.length) return;
    const correct = arraysEqual(answer, currentQuestion.words);
    setChecked(true);
    setIsCorrect(correct);

    if (correct) {
      setScore((s) => s + 1);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }

    setResults((prev) => [...prev, { question: currentQuestion, correct }]);
  }, [answer, currentQuestion]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, questions.length]);

  const handleRetry = useCallback(() => {
    initQuestion(currentIndex);
  }, [currentIndex, initQuestion]);

  const handleRestart = useCallback(() => {
    setFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setResults([]);
  }, []);

  const handleHint = useCallback(() => {
    if (checked || hintUsed) return;
    const firstWord = currentQuestion.words[0];
    // If the first correct word is still in the pool, move it to answer
    const poolIdx = pool.indexOf(firstWord);
    if (poolIdx !== -1 && answer.length === 0) {
      setPool((prev) => {
        const next = [...prev];
        next.splice(poolIdx, 1);
        return next;
      });
      setAnswer([firstWord]);
    }
    setHintUsed(true);
  }, [checked, hintUsed, currentQuestion, pool, answer]);

  // Keyboard: Enter to check or next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        if (checked) {
          handleNext();
        } else if (answer.length === currentQuestion.words.length) {
          handleCheck();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checked, finished, answer, currentQuestion, handleCheck, handleNext]);

  // Results screen
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    const barColor =
      percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    const mistakes = results.filter((r) => !r.correct);

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10">
          {/* Score */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Results / 結果</h2>

            <div className="inline-flex items-baseline gap-1 my-4">
              <span className="text-5xl font-bold text-indigo-600">{score}</span>
              <span className="text-2xl text-gray-400">/ {questions.length}</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{percentage}% correct</p>

            <div className="flex justify-center gap-4 mt-4 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Correct: {score}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Wrong: {questions.length - score}
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
                    key={result.question.id}
                    className="border rounded-xl p-4 bg-red-50 border-red-200"
                  >
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Correct order:</span>{' '}
                      {result.question.words.join(' ')}
                    </p>
                    <p className="text-sm text-indigo-600 mt-1">{result.question.japanese}</p>
                    <div className="mt-2">
                      <AudioButton text={result.question.words.join(' ')} size="sm" />
                    </div>
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

  const allPlaced = answer.length === currentQuestion.words.length;
  const correctSentence = currentQuestion.words.join(' ');

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-gray-500 font-medium">
          Question {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-indigo-600 font-semibold">
          Score: {score} / {results.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${((currentIndex + (checked ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 mb-6">
        <p className="text-xs text-gray-400 font-medium mb-4 uppercase tracking-wide">
          Arrange the words / 語順を並べ替えよう
        </p>

        {/* Japanese hint */}
        <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
          <p className="text-xs text-indigo-400 font-medium mb-1">Japanese / 日本語訳</p>
          <p className="text-base text-indigo-800 font-medium">{currentQuestion.japanese}</p>
        </div>

        {/* Answer area */}
        <div className="mb-6">
          <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">
            Your answer / あなたの回答
          </p>
          <div
            className={`
              min-h-[60px] rounded-xl border-2 border-dashed p-3 flex flex-wrap gap-2 items-start transition-all duration-300
              ${checked && isCorrect ? 'border-green-400 bg-green-50' : ''}
              ${checked && !isCorrect ? 'border-red-400 bg-red-50' : ''}
              ${!checked ? 'border-gray-300 bg-gray-50' : ''}
              ${shaking ? 'animate-shake' : ''}
            `}
          >
            {answer.length === 0 && !checked && (
              <p className="text-sm text-gray-400 italic m-auto">
                下のワードをタップして文を作ろう
              </p>
            )}
            {answer.map((word, i) => (
              <button
                key={`ans-${i}-${word}`}
                type="button"
                onClick={() => handleRemoveWord(i)}
                disabled={checked}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                  ${checked && isCorrect
                    ? 'bg-green-100 border-green-300 text-green-800 cursor-default'
                    : checked && !isCorrect
                      ? 'bg-red-100 border-red-300 text-red-800 cursor-default'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600 cursor-pointer active:scale-95'}
                  focus:outline-none
                `}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Word pool */}
        {(!checked || !isCorrect) && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">
              Available words / 使えるワード
            </p>
            <div className="flex flex-wrap gap-2">
              {pool.map((word, i) => (
                <button
                  key={`pool-${i}-${word}`}
                  type="button"
                  onClick={() => handlePickWord(i)}
                  disabled={checked}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                    ${checked
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-default'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400 cursor-pointer active:scale-95 shadow-sm'}
                    focus:outline-none
                  `}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hint button */}
        {!checked && !hintUsed && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleHint}
              className="text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
            >
              ヒントを見る
            </button>
          </div>
        )}
        {!checked && hintUsed && (
          <div className="mb-4">
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <span className="font-medium">Hint:</span> 最初のワードは「{currentQuestion.words[0]}」です
            </p>
          </div>
        )}

        {/* Check button */}
        {!checked && (
          <button
            type="button"
            onClick={handleCheck}
            disabled={!allPlaced}
            className={`
              w-full px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-md
              ${!allPlaced
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer active:scale-[0.98]'}
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            `}
          >
            チェックする
          </button>
        )}

        {/* Result feedback */}
        {checked && (
          <div
            className={`rounded-xl border p-4 mb-4 ${
              isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <p
              className={`font-bold mb-2 ${
                isCorrect ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {isCorrect ? 'Correct! 正解！' : 'Incorrect / 不正解'}
            </p>

            {!isCorrect && (
              <div className="text-sm space-y-1 mb-2">
                <p className="text-gray-600">
                  <span className="font-medium">Your answer:</span> {answer.join(' ')}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Correct order:</span>{' '}
                  <span className="text-green-700 font-medium">{correctSentence}</span>
                </p>
              </div>
            )}

            {isCorrect && (
              <p className="text-sm text-green-700 font-medium">{correctSentence}</p>
            )}

            <div className="flex items-center gap-3 mt-3">
              <AudioButton text={correctSentence} size="sm" />
              <span className="text-sm text-indigo-600">{currentQuestion.japanese}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {checked && (
        <div className="text-center space-y-3">
          {!isCorrect && (
            <button
              type="button"
              onClick={handleRetry}
              className="mr-3 px-5 py-2.5 rounded-xl text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              もう一度挑戦
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {currentIndex + 1 >= questions.length ? 'See Results / 結果を見る' : 'Next \u2192'}
          </button>
          <p className="text-xs text-gray-400 mt-2">Press Enter to continue</p>
        </div>
      )}

      {/* Keyboard hint */}
      {!checked && allPlaced && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Press Enter to check your answer
        </p>
      )}
    </div>
  );
}
