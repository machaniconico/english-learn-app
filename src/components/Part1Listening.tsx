import { useCallback, useEffect, useRef, useState } from 'react';
import type { Part1Question } from '../data/types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface Part1ListeningProps {
  questions: Part1Question[];
}

interface QuizState {
  currentIndex: number;
  selectedIndex: number | null;
  answered: boolean;
  results: { question: Part1Question; selectedIndex: number; correct: boolean }[];
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

const SCENE_EMOJIS: Record<string, string> = {
  office: '\u{1F3E2}',
  desk: '\u{1F3E2}',
  computer: '\u{1F3E2}',
  meeting: '\u{1F3E2}',
  conference: '\u{1F3E2}',
  park: '\u{1F333}',
  garden: '\u{1F333}',
  outdoor: '\u{1F333}',
  restaurant: '\u{1F37D}\u{FE0F}',
  cafe: '\u{2615}',
  coffee: '\u{2615}',
  store: '\u{1F6D2}',
  shop: '\u{1F6D2}',
  supermarket: '\u{1F6D2}',
  airport: '\u{2708}\u{FE0F}',
  station: '\u{1F689}',
  bus: '\u{1F68C}',
  hospital: '\u{1F3E5}',
  school: '\u{1F3EB}',
  library: '\u{1F4DA}',
  kitchen: '\u{1F373}',
  hotel: '\u{1F3E8}',
  museum: '\u{1F3DB}\u{FE0F}',
  construction: '\u{1F3D7}\u{FE0F}',
  harbor: '\u{26F5}',
  port: '\u{26F5}',
  laboratory: '\u{1F52C}',
  research: '\u{1F52C}',
  intersection: '\u{1F6A6}',
  street: '\u{1F6B6}',
  parking: '\u{1F697}',
  car: '\u{1F697}',
};

function getSceneEmoji(scenario: string): string {
  const lower = scenario.toLowerCase();
  for (const [keyword, emoji] of Object.entries(SCENE_EMOJIS)) {
    if (lower.includes(keyword)) return emoji;
  }
  return '\u{1F4F7}';
}

export default function Part1Listening({ questions }: Part1ListeningProps) {
  const { speak, stop, rate, setRate } = useSpeechSynthesis();
  const [state, setState] = useState<QuizState>({
    currentIndex: 0,
    selectedIndex: null,
    answered: false,
    results: [],
  });
  const [finished, setFinished] = useState(false);
  const [playingAll, setPlayingAll] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const playAllRef = useRef(false);

  const currentQuestion = questions[state.currentIndex];
  const correctCount = state.results.filter((r) => r.correct).length;

  const playOption = useCallback(
    (index: number, onDone?: () => void) => {
      setPlayingIndex(index);
      const label = OPTION_LABELS[index];
      const text = `${label}. ${currentQuestion.options[index]}`;
      speak(text, () => {
        setPlayingIndex(null);
        onDone?.();
      });
    },
    [currentQuestion, speak]
  );

  const playAllOptions = useCallback(() => {
    if (playingAll) {
      stop();
      setPlayingAll(false);
      setPlayingIndex(null);
      playAllRef.current = false;
      return;
    }

    setPlayingAll(true);
    playAllRef.current = true;
    let idx = 0;

    const playNext = () => {
      if (!playAllRef.current || idx >= 4) {
        setPlayingAll(false);
        setPlayingIndex(null);
        playAllRef.current = false;
        return;
      }
      const currentIdx = idx;
      idx++;
      setPlayingIndex(currentIdx);
      const label = OPTION_LABELS[currentIdx];
      const text = `${label}. ${currentQuestion.options[currentIdx]}`;
      speak(text, () => {
        if (!playAllRef.current) return;
        setTimeout(playNext, 600);
      });
    };

    playNext();
  }, [playingAll, currentQuestion, speak, stop]);

  const handleSelect = useCallback(
    (index: number) => {
      if (state.answered) return;
      stop();
      setPlayingAll(false);
      setPlayingIndex(null);
      playAllRef.current = false;

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
    [state.answered, currentQuestion, stop]
  );

  const handleNext = useCallback(() => {
    stop();
    setPlayingAll(false);
    setPlayingIndex(null);
    playAllRef.current = false;

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
  }, [state.currentIndex, questions.length, stop]);

  const handleRestart = useCallback(() => {
    stop();
    setFinished(false);
    setPlayingAll(false);
    setPlayingIndex(null);
    playAllRef.current = false;
    setState({
      currentIndex: 0,
      selectedIndex: null,
      answered: false,
      results: [],
    });
  }, [stop]);

  // Keyboard support
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
        if (key === ' ') {
          e.preventDefault();
          playAllOptions();
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
  }, [state.answered, finished, handleSelect, handleNext, playAllOptions]);

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
                    <p className="text-sm text-gray-700 mb-2 leading-relaxed font-medium">
                      {getSceneEmoji(result.question.scenarioEn)}{' '}
                      {result.question.scenario}
                    </p>
                    <div className="flex flex-wrap gap-2 text-sm mb-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-md">
                        <span className="font-medium">Your answer:</span>{' '}
                        ({OPTION_LABELS[result.selectedIndex]}){' '}
                        {result.question.options[result.selectedIndex]}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md">
                        <span className="font-medium">Correct:</span>{' '}
                        ({OPTION_LABELS[result.question.correctIndex]}){' '}
                        {result.question.options[result.question.correctIndex]}
                      </span>
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

      {/* Scenario card (replaces photo) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 mb-6">
        <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wide">
          Scene Description / 場面の説明
        </p>
        <div className="flex items-start gap-4">
          <span className="text-4xl sm:text-5xl shrink-0" role="img" aria-label="scene">
            {getSceneEmoji(currentQuestion.scenarioEn)}
          </span>
          <div>
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed font-medium">
              {currentQuestion.scenario}
            </p>
            {state.answered && (
              <p className="text-sm text-gray-400 mt-1 italic">
                {currentQuestion.scenarioEn}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Speed control + Play all */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <button
          type="button"
          onClick={playAllOptions}
          disabled={state.answered}
          className={`
            inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
            ${
              state.answered
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : playingAll
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-md'
            }
            focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
          `}
        >
          {playingAll ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="5" y="4" width="4" height="12" rx="1" />
                <rect x="11" y="4" width="4" height="12" rx="1" />
              </svg>
              Stop
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play All
            </>
          )}
        </button>

        <div className="inline-flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Speed:</span>
          <button
            type="button"
            onClick={() => setRate(0.7)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              rate < 0.9
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Slow
          </button>
          <button
            type="button"
            onClick={() => setRate(1)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              rate >= 0.9
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Normal
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
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

          const isPlaying = playingIndex === index;

          return (
            <div key={index} className="flex items-stretch gap-2">
              {/* Individual play button */}
              <button
                type="button"
                onClick={() => {
                  if (isPlaying) {
                    stop();
                    setPlayingIndex(null);
                  } else {
                    playOption(index);
                  }
                }}
                className={`
                  shrink-0 w-10 rounded-xl border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-indigo-300
                  ${
                    isPlaying
                      ? 'bg-indigo-100 border-indigo-400 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600'
                  }
                `}
                aria-label={`Play option ${OPTION_LABELS[index]}`}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <rect x="5" y="4" width="4" height="12" rx="1" />
                    <rect x="11" y="4" width="4" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                )}
              </button>

              {/* Option button */}
              <button
                type="button"
                onClick={() => handleSelect(index)}
                disabled={state.answered}
                className={`
                  flex-1 px-5 py-4 rounded-xl border-2 text-left font-medium
                  transition-all duration-200
                  ${state.answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-300
                  ${optionStyle}
                  ${isPlaying && !state.answered ? 'ring-2 ring-indigo-200' : ''}
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
                  <span>{state.answered ? option : '...'}</span>
                </span>
              </button>
            </div>
          );
        })}
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
          Press 1-4 or A-D to select / Space to play all
        </p>
      )}
    </div>
  );
}
