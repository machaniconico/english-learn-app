import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PhraseItem } from '../data/types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

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

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function pickDistractors(items: PhraseItem[], correctId: string, count: number): string[] {
  const others = items.filter((item) => item.id !== correctId);
  const shuffled = shuffleArray(others);
  return shuffled.slice(0, count).map((item) => item.japanese);
}

function buildQuestion(items: PhraseItem[], questionIndex: number): Omit<QuizState, 'selectedIndex' | 'answered' | 'results'> {
  const shuffled = shuffleArray(items);
  const correctItem = shuffled[questionIndex % shuffled.length];
  const distractors = pickDistractors(items, correctItem.id, 3);
  const allOptions = shuffleArray([correctItem.japanese, ...distractors]);
  const correctOptionIndex = allOptions.indexOf(correctItem.japanese);

  return {
    questionIndex,
    correctItem,
    options: allOptions,
    correctOptionIndex,
  };
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
    const q = buildQuestion(items, 0);
    return {
      ...q,
      correctItem: questionPool[0],
      options: shuffleArray([
        questionPool[0].japanese,
        ...pickDistractors(items, questionPool[0].id, 3),
      ]),
      correctOptionIndex: 0,
      selectedIndex: null,
      answered: false,
      results: [],
    };
  });

  // Recalculate correct option index after shuffle
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      correctOptionIndex: prev.options.indexOf(prev.correctItem.japanese),
    }));
  }, []);

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
    const percentage = Math.round((score / totalQuestions) * 100);
    const emoji = percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪';

    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10">
          <p className="text-5xl mb-4">{emoji}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-gray-500 mb-6">クイズ完了</p>

          <div className="inline-flex items-baseline gap-1 mb-6">
            <span className="text-5xl font-bold text-indigo-600">{score}</span>
            <span className="text-2xl text-gray-400">/ {totalQuestions}</span>
          </div>

          <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                percentage >= 80
                  ? 'bg-green-500'
                  : percentage >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mb-8">{percentage}% correct</p>

          {/* Results breakdown */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {state.results.map((correct, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  correct
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
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
        <span className="text-gray-500 font-medium">
          Question {state.questionIndex + 1} / {totalQuestions}
        </span>
        <span className="text-indigo-600 font-semibold">
          Score: {correctCount} / {state.questionIndex + (state.answered ? 1 : 0)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${((state.questionIndex + (state.answered ? 1 : 0)) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Audio prompt */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 mb-6 text-center">
        <p className="text-sm text-gray-400 mb-4 font-medium">Listen and choose the correct Japanese translation</p>
        <p className="text-xs text-gray-400 mb-4">音声を聞いて正しい日本語訳を選んでください</p>
        <button
          type="button"
          onClick={handleReplay}
          disabled={speaking}
          className={`
            w-16 h-16 rounded-full inline-flex items-center justify-center text-3xl
            transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
            ${speaking
              ? 'bg-indigo-200 text-indigo-700 animate-pulse ring-2 ring-indigo-400'
              : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:scale-95'
            }
          `}
          aria-label="Play audio"
        >
          🔊
        </button>
        <p className="text-xs text-gray-300 mt-3">
          {speaking ? 'Playing...' : 'Tap to replay'}
        </p>

        {state.answered && (
          <p className="mt-4 text-lg font-semibold text-gray-700">
            &ldquo;{state.correctItem.english}&rdquo;
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {state.options.map((option, index) => {
          let optionStyle = 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';

          if (state.answered) {
            if (index === state.correctOptionIndex) {
              optionStyle = 'bg-green-50 border-green-400 text-green-800 ring-2 ring-green-300';
            } else if (index === state.selectedIndex && index !== state.correctOptionIndex) {
              optionStyle = 'bg-red-50 border-red-400 text-red-800 ring-2 ring-red-300';
            } else {
              optionStyle = 'bg-gray-50 border-gray-200 text-gray-400';
            }
          }

          return (
            <button
              key={index}
              type="button"
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
                    ? 'bg-green-200 text-green-800'
                    : state.answered && index === state.selectedIndex
                      ? 'bg-red-200 text-red-800'
                      : 'bg-gray-100 text-gray-500'
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
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback and Next */}
      {state.answered && (
        <div className="text-center">
          <p
            className={`text-lg font-bold mb-4 ${
              state.selectedIndex === state.correctOptionIndex
                ? 'text-green-600'
                : 'text-red-600'
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
