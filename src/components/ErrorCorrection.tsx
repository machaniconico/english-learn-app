import { useCallback, useEffect, useState } from 'react';
import type { ErrorCorrectionQuestion } from '../data/types';

interface ErrorCorrectionProps {
  questions: ErrorCorrectionQuestion[];
}

interface QuizState {
  currentIndex: number;
  selectedIndex: number | null;
  answered: boolean;
  results: { question: ErrorCorrectionQuestion; selectedIndex: number; correct: boolean }[];
}

const SEGMENT_LABELS = ['A', 'B', 'C', 'D'] as const;

export default function ErrorCorrection({ questions }: ErrorCorrectionProps) {
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
      const isCorrect = index === currentQuestion.errorIndex;
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

  // Keyboard support: A-D to select, Enter/Space for next
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
        const letterIndex = key.charCodeAt(0) - 'a'.charCodeAt(0);
        if (letterIndex >= 0 && letterIndex <= 3) {
          e.preventDefault();
          handleSelect(letterIndex);
          return;
        }
        // Also support 1-4
        if (key >= '1' && key <= '4') {
          e.preventDefault();
          handleSelect(parseInt(key) - 1);
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

  // Render the sentence with clickable segments
  const renderSentence = () => {
    // Split sentence by segment markers (A), (B), (C), (D)
    const parts = currentQuestion.sentence.split(/\(([A-D])\)/);
    // parts is like: ["prefix ", "A", " middle ", "B", " middle ", "C", " middle ", "D", " suffix"]

    const elements: React.ReactNode[] = [];
    let segmentCounter = 0;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (['A', 'B', 'C', 'D'].includes(part)) {
        const segIdx = part.charCodeAt(0) - 'A'.charCodeAt(0);
        const segment = currentQuestion.segments[segIdx];
        segmentCounter++;

        let segmentStyle =
          'underline decoration-2 decoration-indigo-400 underline-offset-4 cursor-pointer hover:bg-indigo-100 px-1 py-0.5 rounded transition-colors';

        if (state.answered) {
          if (segIdx === currentQuestion.errorIndex) {
            segmentStyle =
              'underline decoration-2 decoration-green-500 underline-offset-4 bg-green-100 text-green-800 px-1 py-0.5 rounded font-semibold';
          } else if (segIdx === state.selectedIndex && segIdx !== currentQuestion.errorIndex) {
            segmentStyle =
              'underline decoration-2 decoration-red-500 underline-offset-4 bg-red-100 text-red-800 px-1 py-0.5 rounded line-through';
          } else {
            segmentStyle =
              'underline decoration-2 decoration-gray-300 underline-offset-4 text-gray-400 px-1 py-0.5 rounded';
          }
        }

        elements.push(
          <span key={`label-${segIdx}`} className="text-xs font-bold text-indigo-500 align-super mx-0.5">
            ({SEGMENT_LABELS[segIdx]})
          </span>
        );
        elements.push(
          <button
            key={`seg-${segIdx}`}
            type="button"
            onClick={() => handleSelect(segIdx)}
            disabled={state.answered}
            className={`${segmentStyle} focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1 rounded ${state.answered ? 'cursor-default' : ''}`}
          >
            {segment}
          </button>
        );
        void segmentCounter;
      } else {
        elements.push(<span key={`text-${i}`}>{part}</span>);
      }
    }

    return <>{elements}</>;
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

          {/* Wrong answers review */}
          {wrongAnswers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-red-500">&#10005;</span>
                間違えた問題の復習
              </h3>
              <div className="space-y-4">
                {wrongAnswers.map((result) => (
                  <div
                    key={result.question.id}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                      {result.question.sentence}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-md">
                        <span className="font-medium">Your answer:</span>{' '}
                        ({SEGMENT_LABELS[result.selectedIndex]}) {result.question.segments[result.selectedIndex]}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md">
                        <span className="font-medium">Error in:</span>{' '}
                        ({SEGMENT_LABELS[result.question.errorIndex]}) {result.question.segments[result.question.errorIndex]}
                      </span>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="font-medium text-green-700">Correction:</span>{' '}
                      <span className="text-green-800">{result.question.correction}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
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
          Question {state.currentIndex + 1} / {questions.length}
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
            width: `${((state.currentIndex + (state.answered ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Sentence card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 mb-6">
        <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">
          Find the error / 誤りを見つけよう
        </p>
        <p className="text-lg sm:text-xl text-gray-800 leading-loose font-medium">
          {renderSentence()}
        </p>
      </div>

      {/* Segment buttons (mobile-friendly alternative) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {currentQuestion.segments.map((segment, index) => {
          let btnStyle =
            'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';

          if (state.answered) {
            if (index === currentQuestion.errorIndex) {
              btnStyle =
                'bg-green-50 border-green-400 text-green-800 ring-2 ring-green-300';
            } else if (
              index === state.selectedIndex &&
              index !== currentQuestion.errorIndex
            ) {
              btnStyle =
                'bg-red-50 border-red-400 text-red-800 ring-2 ring-red-300';
            } else {
              btnStyle = 'bg-gray-50 border-gray-200 text-gray-400';
            }
          }

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              disabled={state.answered}
              className={`
                w-full px-3 py-3 rounded-xl border-2 text-center font-medium
                transition-all duration-200
                ${state.answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
                focus:outline-none focus:ring-2 focus:ring-indigo-300
                ${btnStyle}
              `}
            >
              <span className="block text-xs font-bold text-indigo-500 mb-1">
                {state.answered
                  ? index === currentQuestion.errorIndex
                    ? '\u2713'
                    : index === state.selectedIndex
                      ? '\u2715'
                      : SEGMENT_LABELS[index]
                  : SEGMENT_LABELS[index]}
              </span>
              <span className="block text-sm">{segment}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {state.answered && (
        <div className="space-y-4">
          {/* Feedback */}
          <div
            className={`rounded-xl border p-4 ${
              state.selectedIndex === currentQuestion.errorIndex
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <p
              className={`font-bold mb-2 ${
                state.selectedIndex === currentQuestion.errorIndex
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}
            >
              {state.selectedIndex === currentQuestion.errorIndex
                ? 'Correct! 正解!'
                : 'Incorrect / 不正解'}
            </p>
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Correction:</span>{' '}
              <span className="text-indigo-700 font-semibold">
                {currentQuestion.segments[currentQuestion.errorIndex]}
              </span>
              {' \u2192 '}
              <span className="text-green-700 font-semibold">{currentQuestion.correction}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>

          {/* Next button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              {state.currentIndex + 1 >= questions.length
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
          Press A-D to select the segment with the error
        </p>
      )}
    </div>
  );
}
