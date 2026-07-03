import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PhraseItem } from '../data/types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { shuffleArray } from '../utils/array';
import { pickDistractors } from '../utils/listeningQuiz';
import { percentage, scoreBarColor, scoreEmoji } from '../utils/quizScoreDisplay';

interface ListeningQuizProps {
  items: PhraseItem[];
}

interface QuizState {
  questionIndex: number;
  correctItem: PhraseItem;
  options: string[];
  correctOptionIndex: number;
  selectedIndex: number | null;
  answered: boolean;
  results: boolean[];
}

const TOTAL_QUESTIONS = 10;

export default function ListeningQuiz({ items }: ListeningQuizProps) {
  const { speak, stop, speaking } = useSpeechSynthesis();

  const totalQuestions = useMemo(
    () => Math.min(TOTAL_QUESTIONS, items.length),
    [items.length]
  );

  const questionPool = useMemo(() => shuffleArray(items).slice(0, totalQuestions), [items, totalQuestions]);

  const [state, setState] = useState<QuizState>(() => {
    const firstItem = questionPool[0];
    const options = shuffleArray([
      firstItem.japanese,
      ...pickDistractors(items, firstItem.id, 3),
    ]);
    return {
      questionIndex: 0,
      correctItem: firstItem,
      options,
      correctOptionIndex: options.indexOf(firstItem.japanese),
      selectedIndex: null,
      answered: false,
      results: [],
    };
  });

  const [finished, setFinished] = useState(false);

  const initQuestion = useCallback(
    (index: number) => {
      const item = questionPool[index];
      const distractors = pickDistractors(items, item.id, 3);
      const options = shuffleArray([item.japanese, ...distractors]);
      setState((prev) => ({
        ...prev,
        questionIndex: index,
        correctItem: item,
        options,
        correctOptionIndex: options.indexOf(item.japanese),
        selectedIndex: null,
        answered: false,
      }));
    },
    [items, questionPool]
  );

  // Auto-play audio when question changes
  useEffect(() => {
    if (!finished && state.correctItem) {
      const timer = setTimeout(() => {
        speak(state.correctItem.english);
      }, 400);
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
  }, [state.questionIndex, finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (index: number) => {
    if (state.answered) return;
    const isCorrect = index === state.correctOptionIndex;
    setState((prev) => ({
      ...prev,
      selectedIndex: index,
      answered: true,
      results: [...prev.results, isCorrect],
    }));
  };

  const handleNext = () => {
    const nextIndex = state.questionIndex + 1;
    if (nextIndex >= totalQuestions) {
      setFinished(true);
    } else {
      initQuestion(nextIndex);
    }
  };

  const handleReplay = () => {
    speak(state.correctItem.english);
  };

  const handleRestart = () => {
    setFinished(false);
    const newPool = shuffleArray(items).slice(0, totalQuestions);
    const firstItem = newPool[0];
    const distractors = pickDistractors(items, firstItem.id, 3);
    const options = shuffleArray([firstItem.japanese, ...distractors]);
    setState({
      questionIndex: 0,
      correctItem: firstItem,
      options,
      correctOptionIndex: options.indexOf(firstItem.japanese),
      selectedIndex: null,
      answered: false,
      results: [],
    });
  };

  const correctCount = state.results.filter(Boolean).length;

  // Finished screen
  if (finished) {
    const score = correctCount;
    const scorePct = percentage(score, totalQuestions);
    const emoji = scoreEmoji(scorePct);

    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 sm:p-10">
          <p className="text-5xl mb-4">{emoji}</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quiz Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">クイズ完了</p>

          <div
            role="status"
            aria-live="polite"
            aria-label={`スコア ${score} / ${totalQuestions} (${scorePct}% 正解)`}
            className="inline-flex items-baseline gap-1 mb-6"
          >
            <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{score}</span>
            <span className="text-2xl text-gray-500 dark:text-gray-400">/ {totalQuestions}</span>
          </div>

          <div
            className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(scorePct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="スコア"
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                scoreBarColor(scorePct)
              }`}
              style={{ width: `${scorePct}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{scorePct}% correct</p>

          {/* Results breakdown */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {state.results.map((correct, i) => (
              <div
                key={i}
                role="img"
                aria-label={correct ? '正解' : '不正解'}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  correct
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                }`}
              >
                {correct ? '○' : '✕'}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          Question {state.questionIndex + 1} / {totalQuestions}
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          Score: {correctCount} / {state.questionIndex + (state.answered ? 1 : 0)}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(state.questionIndex + (state.answered ? 1 : 0))}
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-label="問題の進捗"
      >
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((state.questionIndex + (state.answered ? 1 : 0)) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Audio prompt */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sm:p-8 mb-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Listen and choose the correct Japanese translation</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">音声を聞いて正しい日本語訳を選んでください</p>
        <button
          type="button"
          onClick={handleReplay}
          disabled={speaking}
          className={`
            w-16 h-16 rounded-full inline-flex items-center justify-center text-3xl
            transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            ${speaking
              ? 'bg-indigo-200 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 animate-pulse ring-2 ring-indigo-400'
              : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 active:scale-95'
            }
          `}
          aria-label="Play audio"
        >
          🔊
        </button>
        <p className="text-xs text-gray-300 dark:text-gray-500 mt-3">
          {speaking ? 'Playing...' : 'Tap to replay'}
        </p>

        {state.answered && (
          <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            &ldquo;{state.correctItem.english}&rdquo;
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {state.options.map((option, index) => {
          let optionStyle = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-gray-700 dark:text-gray-300';

          if (state.answered) {
            if (index === state.correctOptionIndex) {
              optionStyle = 'bg-green-50 dark:bg-green-900/40 border-green-400 dark:border-green-800 text-green-800 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700';
            } else if (index === state.selectedIndex && index !== state.correctOptionIndex) {
              optionStyle = 'bg-red-50 dark:bg-red-900/40 border-red-400 dark:border-red-800 text-red-800 dark:text-red-300 ring-2 ring-red-300 dark:ring-red-700';
            } else {
              optionStyle = 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500';
            }
          }

          return (
            <button
              key={index}
              type="button"
              aria-pressed={index === state.selectedIndex}
              onClick={() => handleSelect(index)}
              disabled={state.answered}
              className={`
                w-full px-5 py-4 rounded-xl border-2 text-left font-medium
                transition-all duration-200
                ${state.answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
                focus:outline-none focus:ring-2 focus:ring-indigo-300
                ${optionStyle}
              `}
            >
              <span className="inline-flex items-center gap-3">
                <span className={`
                  w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold shrink-0
                  ${state.answered && index === state.correctOptionIndex
                    ? 'bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                    : state.answered && index === state.selectedIndex
                      ? 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {state.answered
                    ? index === state.correctOptionIndex
                      ? '○'
                      : index === state.selectedIndex
                        ? '✕'
                        : String.fromCharCode(65 + index)
                    : String.fromCharCode(65 + index)
                  }
                </span>
                <span>{option}</span>
                {state.answered && index === state.correctOptionIndex && (
                  <span className="sr-only">（正解）</span>
                )}
                {state.answered &&
                  index === state.selectedIndex &&
                  index !== state.correctOptionIndex && (
                    <span className="sr-only">（不正解）</span>
                  )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback and Next */}
      {state.answered && (
        <div className="text-center">
          <p
            role="status"
            aria-live="assertive"
            className={`text-lg font-bold mb-4 ${
              state.selectedIndex === state.correctOptionIndex
                ? 'text-green-600 dark:text-green-300'
                : 'text-red-600 dark:text-red-300'
            }`}
          >
            {state.selectedIndex === state.correctOptionIndex
              ? '🎉 Correct! 正解!'
              : `❌ Incorrect. The answer was: ${state.correctItem.japanese}`}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {state.questionIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
