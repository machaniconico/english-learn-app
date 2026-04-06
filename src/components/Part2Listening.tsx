import { useCallback, useState } from 'react';
import type { Part2Question } from '../data/types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface Part2ListeningProps {
  questions: Part2Question[];
}

const LABELS = ['A', 'B', 'C'] as const;

export default function Part2Listening({ questions }: Part2ListeningProps) {
  const { speak, stop, speaking, rate, setRate } = useSpeechSynthesis();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [showText, setShowText] = useState(false);
  const [playingAll, setPlayingAll] = useState(false);

  const current = questions[currentIndex];
  const correctCount = results.filter(Boolean).length;

  // Play just the question
  const playQuestion = useCallback(() => {
    stop();
    speak(current.question);
  }, [current.question, speak, stop]);

  // Play a single response
  const playResponse = useCallback(
    (index: number) => {
      stop();
      speak(current.responses[index]);
    },
    [current.responses, speak, stop],
  );

  // Play all: question, then each response sequentially
  const playAll = useCallback(() => {
    stop();
    setPlayingAll(true);

    speak(current.question, () => {
      setTimeout(() => {
        speak(current.responses[0], () => {
          setTimeout(() => {
            speak(current.responses[1], () => {
              setTimeout(() => {
                speak(current.responses[2], () => {
                  setPlayingAll(false);
                });
              }, 400);
            });
          }, 400);
        });
      }, 600);
    });
  }, [current, speak, stop]);

  const handleSelect = (index: number) => {
    if (answered) return;
    const isCorrect = index === current.correctIndex;
    setSelectedIndex(index);
    setAnswered(true);
    setResults((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    stop();
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setAnswered(false);
      setShowText(false);
      setPlayingAll(false);
    }
  };

  const handleRestart = () => {
    stop();
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setResults([]);
    setFinished(false);
    setShowText(false);
    setPlayingAll(false);
  };

  // Results screen
  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const emoji = percentage >= 80 ? '\u{1F389}' : percentage >= 60 ? '\u{1F44D}' : '\u{1F4AA}';

    // Score breakdown by question type
    const typeStats: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!typeStats[q.questionType]) {
        typeStats[q.questionType] = { correct: 0, total: 0 };
      }
      typeStats[q.questionType].total += 1;
      if (results[i]) {
        typeStats[q.questionType].correct += 1;
      }
    });

    return (
      <div className="w-full max-w-lg mx-auto text-center">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10">
          <p className="text-5xl mb-4">{emoji}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Results</h2>
          <p className="text-gray-500 mb-6">Part 2 {'\u7D50\u679C'}</p>

          <div className="inline-flex items-baseline gap-1 mb-6">
            <span className="text-5xl font-bold text-indigo-600">{correctCount}</span>
            <span className="text-2xl text-gray-400">/ {questions.length}</span>
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
          <p className="text-sm text-gray-400 mb-6">{percentage}% correct</p>

          {/* Per-question results */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {results.map((correct, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {correct ? '\u25CB' : '\u2715'}
              </div>
            ))}
          </div>

          {/* Score by question type */}
          <div className="text-left bg-gray-50 rounded-xl p-4 mb-8">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              {'\u554F\u984C\u30BF\u30A4\u30D7\u5225\u30B9\u30B3\u30A2'}
            </h3>
            <div className="space-y-2">
              {Object.entries(typeStats).map(([type, stat]) => (
                <div key={type} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                      {type}
                    </span>
                  </span>
                  <span
                    className={`font-medium ${
                      stat.correct === stat.total
                        ? 'text-green-600'
                        : stat.correct === 0
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }`}
                  >
                    {stat.correct} / {stat.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {'\u3082\u3046\u4E00\u5EA6\u6311\u6226'}
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
          Question {currentIndex + 1} / {questions.length}
        </span>
        <span className="text-indigo-600 font-semibold">
          Score: {correctCount} / {currentIndex + (answered ? 1 : 0)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question type badge + speed control */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
          {current.questionType}
        </span>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 font-medium">{'\u901F\u5EA6'}</label>
          <select
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-300"
          >
            <option value={0.6}>0.6x</option>
            <option value={0.8}>0.8x</option>
            <option value={1}>1.0x</option>
            <option value={1.2}>1.2x</option>
            <option value={1.5}>1.5x</option>
          </select>
        </div>
      </div>

      {/* Question audio area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 mb-4 text-center">
        <p className="text-sm text-gray-400 mb-1 font-medium">Listen to the question</p>
        <p className="text-xs text-gray-400 mb-5">
          {'\u8CEA\u554F\u3092\u805E\u3044\u3066\u3001\u6700\u3082\u9069\u5207\u306A\u5FDC\u7B54\u3092\u9078\u3073\u307E\u3057\u3087\u3046'}
        </p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <button
            type="button"
            onClick={playQuestion}
            disabled={speaking}
            className={`w-14 h-14 rounded-full inline-flex items-center justify-center text-2xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
              speaking && !playingAll
                ? 'bg-indigo-200 text-indigo-700 animate-pulse ring-2 ring-indigo-400'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:scale-95'
            }`}
            aria-label="Play question"
          >
            {'\u{1F50A}'}
          </button>
          <button
            type="button"
            onClick={playAll}
            disabled={speaking}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
              playingAll
                ? 'bg-purple-200 text-purple-700 animate-pulse'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:scale-95'
            }`}
          >
            {'\u25B6'} Play All
          </button>
        </div>
        <p className="text-xs text-gray-300">
          {speaking ? 'Playing...' : 'Tap to play'}
        </p>

        {/* Show question text after answering or with hint toggle */}
        {(answered || showText) && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-lg font-semibold text-gray-700">
              &ldquo;{current.question}&rdquo;
            </p>
            <p className="text-sm text-gray-400 mt-1">{current.questionJa}</p>
          </div>
        )}
      </div>

      {/* Hint toggle (before answering) */}
      {!answered && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={() => setShowText((prev) => !prev)}
            className="text-xs text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer flex items-center gap-1"
          >
            {showText ? '\u{1F441}' : '\u{1F4AC}'}{' '}
            {showText
              ? '\u30C6\u30AD\u30B9\u30C8\u3092\u96A0\u3059'
              : '\u30D2\u30F3\u30C8: \u30C6\u30AD\u30B9\u30C8\u3092\u8868\u793A'}
          </button>
        </div>
      )}

      {/* Response options */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {current.responses.map((response, index) => {
          let optionStyle =
            'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';

          if (answered) {
            if (index === current.correctIndex) {
              optionStyle =
                'bg-green-50 border-green-400 text-green-800 ring-2 ring-green-300';
            } else if (index === selectedIndex && index !== current.correctIndex) {
              optionStyle = 'bg-red-50 border-red-400 text-red-800 ring-2 ring-red-300';
            } else {
              optionStyle = 'bg-gray-50 border-gray-200 text-gray-400';
            }
          }

          return (
            <div key={index} className="flex items-stretch gap-2">
              {/* Play button for individual response */}
              <button
                type="button"
                onClick={() => playResponse(index)}
                disabled={speaking}
                className="w-10 shrink-0 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-sm hover:bg-indigo-50 hover:border-indigo-200 transition-colors cursor-pointer focus:outline-none"
                aria-label={`Play response ${LABELS[index]}`}
              >
                {'\u{1F50A}'}
              </button>
              {/* Selection button */}
              <button
                type="button"
                onClick={() => handleSelect(index)}
                disabled={answered}
                className={`flex-1 px-5 py-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
                  answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
                } focus:outline-none focus:ring-2 focus:ring-indigo-300 ${optionStyle}`}
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold shrink-0 ${
                      answered && index === current.correctIndex
                        ? 'bg-green-200 text-green-800'
                        : answered && index === selectedIndex
                          ? 'bg-red-200 text-red-800'
                          : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {answered
                      ? index === current.correctIndex
                        ? '\u25CB'
                        : index === selectedIndex
                          ? '\u2715'
                          : LABELS[index]
                      : LABELS[index]}
                  </span>
                  <span>
                    {/* Show response text after answering or with hint */}
                    {answered || showText ? (
                      <span>
                        <span className="block">{response}</span>
                        {answered && (
                          <span className="block text-xs text-gray-400 mt-0.5">
                            {current.responsesJa[index]}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400">({LABELS[index]})</span>
                    )}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Feedback and explanation */}
      {answered && (
        <div className="text-center">
          <div
            className={`rounded-xl p-4 mb-4 ${
              selectedIndex === current.correctIndex
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <p
              className={`text-lg font-bold mb-2 ${
                selectedIndex === current.correctIndex
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {selectedIndex === current.correctIndex
                ? '\u{1F389} \u6B63\u89E3\uFF01'
                : `\u274C \u4E0D\u6B63\u89E3\u3002\u6B63\u7B54\u306F (${LABELS[current.correctIndex]})`}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {current.explanation}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {currentIndex + 1 >= questions.length
              ? '\u7D50\u679C\u3092\u898B\u308B'
              : '\u6B21\u306E\u554F\u984C \u2192'}
          </button>
        </div>
      )}
    </div>
  );
}
