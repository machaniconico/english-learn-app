import { useCallback, useEffect, useState } from 'react';
import type { ReadingPassage, ReadingQuestion } from '../data/types';
import AudioButton from './AudioButton';

interface ReadingComprehensionProps {
  passage: ReadingPassage;
}

interface QuizState {
  currentIndex: number;
  selectedIndex: number | null;
  answered: boolean;
  results: { question: ReadingQuestion; selectedIndex: number; correct: boolean }[];
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export default function ReadingComprehension({ passage }: ReadingComprehensionProps) {
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    selectedIndex: null,
    answered: false,
    results: [],
  });
  const [finished, setFinished] = useState(false);

  const currentQuestion = passage.questions[state.currentIndex];
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
    if (nextIndex >= passage.questions.length) {
      setFinished(true);
    } else {
      setState((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        selectedIndex: null,
        answered: false,
      }));
    }
  }, [state.currentIndex, passage.questions.length]);

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
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (finished) return;

      const key = e.key.toLowerCase();

      if (!state.answered) {
        if (key >= '1' && key <= '4') {
          e.preventDefault();
          handleSelect(parseInt(key) - 1);
          return;
        }
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

  // Results screen
  if (finished) {
    const score = correctCount;
    const total = passage.questions.length;
    const percentage = Math.round((score / total) * 100);
    const barColor =
      percentage >= 80
        ? 'bg-green-500'
        : percentage >= 60
          ? 'bg-yellow-500'
          : 'bg-red-500';

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10">
          {/* Score */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Results / 結果</h2>

            <div className="inline-flex items-baseline gap-1 my-4">
              <span className="text-5xl font-bold text-indigo-600">{score}</span>
              <span className="text-2xl text-gray-400">/ {total}</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{percentage}% correct</p>
          </div>

          {/* Review all answers */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              解答の確認
            </h3>
            <div className="space-y-4">
              {state.results.map((result, idx) => (
                <div
                  key={result.question.id}
                  className={`border rounded-xl p-4 ${
                    result.correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                        result.correct
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-700 font-medium">
                      {result.question.question}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 ml-8">
                    {result.question.questionJa}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm ml-8 mb-2">
                    {!result.correct && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-md">
                        <span className="font-medium">Your answer:</span>{' '}
                        {OPTION_LABELS[result.selectedIndex]}.{' '}
                        {result.question.options[result.selectedIndex]}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md">
                      <span className="font-medium">Correct:</span>{' '}
                      {OPTION_LABELS[result.question.correctIndex]}.{' '}
                      {result.question.options[result.question.correctIndex]}
                    </span>
                  </div>
                  {!result.correct && (
                    <p className="text-sm text-gray-600 leading-relaxed ml-8">
                      {result.question.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

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
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-gray-500 font-medium">
          Question {state.currentIndex + 1} / {passage.questions.length}
        </span>
        <span className="text-indigo-600 font-semibold">
          Score: {correctCount} / {state.currentIndex + (state.answered ? 1 : 0)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${((state.currentIndex + (state.answered ? 1 : 0)) / passage.questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Split layout: passage + questions */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Passage card */}
        <div className="md:w-1/2 md:sticky md:top-24 md:self-start">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            {/* Type badge and audio */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  {passage.type}
                </span>
                <span className="text-xs text-gray-400">{passage.typeJa}</span>
              </div>
              <AudioButton text={passage.passage} size="sm" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {passage.title}
            </h2>
            <p className="text-xs text-gray-400 mb-4">{passage.titleJa}</p>

            {/* Passage text */}
            <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-1">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-mono">
                {passage.passage}
              </div>
            </div>
          </div>
        </div>

        {/* Questions panel */}
        <div className="md:w-1/2">
          {/* Question card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-4">
            <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
              Question {state.currentIndex + 1}
            </p>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium mb-1">
              {currentQuestion.question}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {currentQuestion.questionJa}
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, index) => {
                let optionStyle =
                  'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';

                if (state.answered) {
                  if (index === currentQuestion.correctIndex) {
                    optionStyle =
                      'bg-green-50 border-green-400 text-green-800 ring-2 ring-green-300';
                  } else if (
                    index === state.selectedIndex &&
                    index !== currentQuestion.correctIndex
                  ) {
                    optionStyle =
                      'bg-red-50 border-red-400 text-red-800 ring-2 ring-red-300';
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
                      w-full px-4 py-3 rounded-xl border-2 text-left font-medium
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
                              ? 'bg-green-200 text-green-800'
                              : state.answered && index === state.selectedIndex
                                ? 'bg-red-200 text-red-800'
                                : 'bg-indigo-100 text-indigo-600'
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
                      <span className="text-sm">{option}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation + Next */}
          {state.answered && (
            <div className="space-y-4">
              <div
                className={`rounded-xl border p-4 ${
                  state.selectedIndex === currentQuestion.correctIndex
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p
                  className={`font-bold mb-2 ${
                    state.selectedIndex === currentQuestion.correctIndex
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {state.selectedIndex === currentQuestion.correctIndex
                    ? 'Correct! 正解!'
                    : 'Incorrect / 不正解'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                  {state.currentIndex + 1 >= passage.questions.length
                    ? 'See Results / 結果を見る'
                    : 'Next Question \u2192'}
                </button>
                <p className="text-xs text-gray-400 mt-2">
                  Press Enter or Space to continue
                </p>
              </div>
            </div>
          )}

          {/* Keyboard hint */}
          {!state.answered && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Press 1-4 or A-D to select an answer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
