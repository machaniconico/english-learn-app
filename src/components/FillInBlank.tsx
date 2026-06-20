import { useCallback, useEffect, useState } from 'react';
import type { FillInBlankQuestion } from '../data/types';

interface FillInBlankProps {
  questions: FillInBlankQuestion[];
}

interface QuizState {
  currentIndex: number;
  selectedIndex: number | null;
  answered: boolean;
  results: { question: FillInBlankQuestion; selectedIndex: number; correct: boolean }[];
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export default function FillInBlank({ questions }: FillInBlankProps) {
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    selectedIndex: null,
    answered: false,
    results: [],
  });
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[state.currentIndex];
  const correctCount = state.results.filter((r) => r.correct).length;

  const handleSelect = useCallback(
    (index: number) => {
      if (state.answered) return;
      const isCorrect = index === currentQuestion.correctIndex;
      setState((prev) => ({
        ...prev,
        selectedIndex: index,
        answered: true,
        results: [
          ...prev.results,
          { question: currentQuestion, selectedIndex: index, correct: isCorrect },
        ],
      }));
    },
    [state.answered, currentQuestion]
  );

  const handleNext = useCallback(() => {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= questions.length) {
      setFinished(true);
    } else {
      setState((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        selectedIndex: null,
        answered: false,
      }));
    }
  }, [state.currentIndex, questions.length]);

  const handleRestart = useCallback(() => {
    setFinished(false);
    setState({
      currentIndex: 0,
      selectedIndex: null,
      answered: false,
      results: [],
    });
  }, []);

  // Keyboard support: 1-4 or A-D to select, Enter for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (finished) {
        return;
      }

      const key = e.key.toLowerCase();

      if (!state.answered) {
        // Number keys 1-4
        if (key >= '1' && key <= '4') {
          e.preventDefault();
          handleSelect(parseInt(key) - 1);
          return;
        }
        // Letter keys a-d
        const letterIndex = key.charCodeAt(0) - 'a'.charCodeAt(0);
        if (letterIndex >= 0 && letterIndex <= 3) {
          e.preventDefault();
          handleSelect(letterIndex);
          return;
        }
      }

      if (state.answered && (key === 'enter' || key === ' ')) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.answered, finished, handleSelect, handleNext]);

  // Render highlighted sentence with blank
  const renderSentence = (sentence: string) => {
    const parts = sentence.split('_____');
    if (parts.length < 2) return <span>{sentence}</span>;

    return (
      <span>
        {parts[0]}
        <span className="inline-block mx-1 px-3 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 border-b-2 border-indigo-400 dark:border-indigo-700 rounded text-indigo-700 dark:text-indigo-300 font-semibold min-w-[80px] text-center">
          {state.answered
            ? currentQuestion.options[currentQuestion.correctIndex]
            : '_____'}
        </span>
        {parts[1]}
      </span>
    );
  };

  // Results screen
  if (finished) {
    const score = correctCount;
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    const wrongAnswers = state.results.filter((r) => !r.correct);
    const barColor =
      percentage >= 80
        ? 'bg-green-500'
        : percentage >= 60
          ? 'bg-yellow-500'
          : 'bg-red-500';

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 sm:p-10">
          {/* Score */}
          <div className="text-center mb-8" role="status">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Results / 結果</h2>

            <div className="inline-flex items-baseline gap-1 my-4">
              <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
              <span className="text-2xl text-gray-400 dark:text-gray-500">/ {total}</span>
            </div>

            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{percentage}% correct</p>
          </div>

          {/* Wrong answers review */}
          {wrongAnswers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <span className="text-red-500 dark:text-red-300">&#10005;</span>
                間違えた問題の復習
              </h3>
              <div className="space-y-4">
                {wrongAnswers.map((result) => (
                  <div
                    key={result.question.id}
                    className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-xl p-4"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                      {result.question.sentence}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-md">
                        <span className="font-medium">Your answer:</span>{' '}
                        {result.question.options[result.selectedIndex]}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-md">
                        <span className="font-medium">Correct:</span>{' '}
                        {result.question.options[result.question.correctIndex]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {result.question.explanation}
                    </p>
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
              className="px-6 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          Question {state.currentIndex + 1} / {questions.length}
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          Score: {correctCount} / {state.currentIndex + (state.answered ? 1 : 0)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${((state.currentIndex + (state.answered ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Sentence card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sm:p-8 mb-6">
        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1 uppercase tracking-wide">
          Fill in the blank
        </p>
        <p className="text-lg sm:text-xl text-gray-800 dark:text-gray-100 leading-relaxed font-medium">
          {renderSentence(currentQuestion.sentence)}
        </p>

        {/* Category badge */}
        <div className="mt-3">
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 capitalize">
            {currentQuestion.category}
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          let optionStyle =
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300';

          if (state.answered) {
            if (index === currentQuestion.correctIndex) {
              optionStyle =
                'bg-green-50 dark:bg-green-900/40 border-green-400 dark:border-green-700 text-green-800 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700';
            } else if (
              index === state.selectedIndex &&
              index !== currentQuestion.correctIndex
            ) {
              optionStyle =
                'bg-red-50 dark:bg-red-900/40 border-red-400 dark:border-red-700 text-red-800 dark:text-red-300 ring-2 ring-red-300 dark:ring-red-700';
            } else {
              optionStyle = 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500';
            }
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              disabled={state.answered}
              aria-pressed={index === state.selectedIndex}
              className={`
                w-full px-5 py-4 rounded-xl border-2 text-left font-medium
                transition-all duration-200
                ${state.answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
                focus:outline-none focus:ring-2 focus:ring-indigo-300
                ${optionStyle}
              `}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={`
                    w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold shrink-0
                    ${
                      state.answered && index === currentQuestion.correctIndex
                        ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                        : state.answered && index === state.selectedIndex
                          ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                          : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300'
                    }
                  `}
                >
                  {state.answered
                    ? index === currentQuestion.correctIndex
                      ? '\u25CB'
                      : index === state.selectedIndex
                        ? '\u2715'
                        : OPTION_LABELS[index]
                    : OPTION_LABELS[index]}
                </span>
                <span>{option}</span>
                {state.answered && index === currentQuestion.correctIndex && (
                  <span className="sr-only">（正解）</span>
                )}
                {state.answered &&
                  index === state.selectedIndex &&
                  index !== currentQuestion.correctIndex && (
                    <span className="sr-only">（不正解）</span>
                  )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {state.answered && (
        <div className="space-y-4">
          {/* Feedback */}
          <div
            role="status"
            aria-live="polite"
            className={`rounded-xl border p-4 ${
              state.selectedIndex === currentQuestion.correctIndex
                ? 'bg-green-50 dark:bg-green-900/40 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800'
            }`}
          >
            <p
              className={`font-bold mb-2 ${
                state.selectedIndex === currentQuestion.correctIndex
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}
            >
              {state.selectedIndex === currentQuestion.correctIndex
                ? 'Correct! 正解!'
                : 'Incorrect / 不正解'}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>

          {/* Next button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {state.currentIndex + 1 >= questions.length
                ? 'See Results / 結果を見る'
                : 'Next Question \u2192'}
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Press Enter or Space to continue
            </p>
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      {!state.answered && (
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
          Press 1-4 or A-D to select an answer
        </p>
      )}
    </div>
  );
}
