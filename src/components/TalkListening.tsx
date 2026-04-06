import { useCallback, useEffect, useRef, useState } from 'react';
import type { Part4Question } from '../data/types';

interface TalkListeningProps {
  talks: Part4Question[];
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

const TYPE_ICONS: Record<string, string> = {
  announcement: '\u{1F4E2}',
  voicemail: '\u{1F4DE}',
  introduction: '\u{1F91D}',
  advertisement: '\u{1F4F0}',
  news: '\u{1F4FA}',
};

export default function TalkListening({ talks }: TalkListeningProps) {
  const [talkIndex, setTalkIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [rate, setRate] = useState(1);
  const [hasPlayed, setHasPlayed] = useState(false);

  const cancelRef = useRef(false);

  const current = talks[talkIndex];
  const currentQ = current.questions[qIndex];
  const correctCount = results.filter(Boolean).length;
  const totalQuestions = talks.reduce((sum, t) => sum + t.questions.length, 0);
  const answeredSoFar = results.length;

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlaying(false);
    cancelRef.current = true;
  }, []);

  const playTalk = useCallback(() => {
    stop();
    cancelRef.current = false;
    setPlaying(true);
    setHasPlayed(true);

    const utterance = new SpeechSynthesisUtterance(current.talk);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const enVoice =
      voices.find((v) => v.lang.startsWith('en') && v.name.includes('Samantha')) ||
      voices.find((v) => v.lang.startsWith('en-US'));
    if (enVoice) utterance.voice = enVoice;

    utterance.onend = () => {
      setPlaying(false);
    };
    utterance.onerror = () => {
      setPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [current.talk, rate, stop]);

  const handleSelect = (index: number) => {
    if (answered) return;
    const isCorrect = index === currentQ.correctIndex;
    setSelectedIndex(index);
    setAnswered(true);
    setResults((prev) => [...prev, isCorrect]);
  };

  const handleNext = () => {
    stop();
    const nextQ = qIndex + 1;
    if (nextQ < current.questions.length) {
      setQIndex(nextQ);
      setSelectedIndex(null);
      setAnswered(false);
    } else {
      setAllQuestionsAnswered(true);
      setShowScript(true);
    }
  };

  const handleNextTalk = () => {
    stop();
    const nextTalk = talkIndex + 1;
    if (nextTalk >= talks.length) {
      setFinished(true);
    } else {
      setTalkIndex(nextTalk);
      setQIndex(0);
      setSelectedIndex(null);
      setAnswered(false);
      setShowScript(false);
      setAllQuestionsAnswered(false);
      setHasPlayed(false);
    }
  };

  const handleRestart = () => {
    stop();
    setTalkIndex(0);
    setQIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setResults([]);
    setFinished(false);
    setShowScript(false);
    setAllQuestionsAnswered(false);
    setHasPlayed(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Results screen
  if (finished) {
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const barColor =
      percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    const emoji = percentage >= 80 ? '\u{1F389}' : percentage >= 60 ? '\u{1F44D}' : '\u{1F4AA}';

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="text-5xl mb-4">{emoji}</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Results / 結果</h2>

            <div className="inline-flex items-baseline gap-1 my-4">
              <span className="text-5xl font-bold text-indigo-600">{correctCount}</span>
              <span className="text-2xl text-gray-400">/ {totalQuestions}</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{percentage}% correct</p>
          </div>

          {/* Per-talk breakdown */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-700 mb-3">トーク別スコア</h3>
            <div className="space-y-2">
              {talks.map((talk, ti) => {
                const startIdx = talks
                  .slice(0, ti)
                  .reduce((sum, t) => sum + t.questions.length, 0);
                const talkResults = results.slice(startIdx, startIdx + talk.questions.length);
                const talkCorrect = talkResults.filter(Boolean).length;
                return (
                  <div key={talk.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 inline-flex items-center gap-2">
                      <span>{TYPE_ICONS[talk.type] || '\u{1F4AC}'}</span>
                      {talk.typeJa}
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                          talk.level === 'beginner'
                            ? 'bg-green-100 text-green-700'
                            : talk.level === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {talk.level}
                      </span>
                    </span>
                    <span
                      className={`font-medium ${
                        talkCorrect === talk.questions.length
                          ? 'text-green-600'
                          : talkCorrect === 0
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      {talkCorrect} / {talk.questions.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              もう一度挑戦
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
          Talk {talkIndex + 1} / {talks.length}
        </span>
        <span className="text-indigo-600 font-semibold">
          Score: {correctCount} / {answeredSoFar}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(answeredSoFar / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Type badge + Level badge + Speed */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">
            {TYPE_ICONS[current.type] || '\u{1F4AC}'} {current.typeJa}
          </span>
          <span
            className={`inline-block px-3 py-1 text-xs font-bold rounded-full border capitalize ${
              current.level === 'beginner'
                ? 'bg-green-100 text-green-700 border-green-200'
                : current.level === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                  : 'bg-red-100 text-red-700 border-red-200'
            }`}
          >
            {current.level}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 font-medium">速度</label>
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

      {/* Talk playback area */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 mb-4">
        <p className="text-sm text-gray-400 font-medium mb-4">
          {'\u{1F399}'} Talk / トーク
        </p>

        {playing && (
          <div className="mb-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100 animate-pulse">
            <span className="text-sm font-semibold text-indigo-700">Playing...</span>
          </div>
        )}

        {!playing && !hasPlayed && (
          <p className="text-center text-sm text-gray-400 mb-4">
            トークを聞いて、質問に答えましょう。テキストは全問回答後に表示されます。
          </p>
        )}

        {/* Play / Replay button */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={playing ? stop : playTalk}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${
              playing
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            }`}
          >
            {playing ? (
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
                {hasPlayed ? 'もう一度聞く' : 'Play Talk'}
              </>
            )}
          </button>
        </div>

        {/* Script (shown after all questions answered) */}
        {showScript && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3 font-medium">Script / スクリプト</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {current.talk}
            </p>
          </div>
        )}
      </div>

      {/* Questions */}
      {!allQuestionsAnswered && (
        <>
          <div className="text-xs text-gray-400 mb-2 font-medium">
            Question {qIndex + 1} / {current.questions.length}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow p-5 mb-4">
            <p className="text-base font-semibold text-gray-800 mb-1">{currentQ.question}</p>
            <p className="text-sm text-gray-400 mb-4">{currentQ.questionJa}</p>

            <div className="space-y-2">
              {currentQ.options.map((option, index) => {
                let optionStyle =
                  'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700';

                if (answered) {
                  if (index === currentQ.correctIndex) {
                    optionStyle =
                      'bg-green-50 border-green-400 text-green-800 ring-2 ring-green-300';
                  } else if (index === selectedIndex && index !== currentQ.correctIndex) {
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
                    disabled={answered}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
                      answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-300 ${optionStyle}`}
                  >
                    <span className="inline-flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold shrink-0 ${
                          answered && index === currentQ.correctIndex
                            ? 'bg-green-200 text-green-800'
                            : answered && index === selectedIndex
                              ? 'bg-red-200 text-red-800'
                              : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        {answered
                          ? index === currentQ.correctIndex
                            ? '\u25CB'
                            : index === selectedIndex
                              ? '\u2715'
                              : OPTION_LABELS[index]
                          : OPTION_LABELS[index]}
                      </span>
                      <span>{option}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation + Next question */}
          {answered && (
            <div className="space-y-4">
              <div
                className={`rounded-xl border p-4 ${
                  selectedIndex === currentQ.correctIndex
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <p
                  className={`font-bold mb-2 ${
                    selectedIndex === currentQ.correctIndex ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {selectedIndex === currentQ.correctIndex
                    ? '\u{1F389} 正解！'
                    : `\u274C 不正解。正答は (${OPTION_LABELS[currentQ.correctIndex]})`}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{currentQ.explanation}</p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                >
                  {qIndex + 1 < current.questions.length
                    ? '次の質問 \u2192'
                    : 'スクリプトを見る \u2192'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* After all questions answered: show next talk button */}
      {allQuestionsAnswered && (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleNextTalk}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {talkIndex + 1 >= talks.length ? '結果を見る' : '次のトーク \u2192'}
          </button>
        </div>
      )}
    </div>
  );
}
