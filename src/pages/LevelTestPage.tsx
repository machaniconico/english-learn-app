import { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { levelTestQuestions } from '../data/levelTest';
import {
  useUserLevel,
  LEVEL_INFO,
  CEFR_ORDER,
  type CEFRLevel,
} from '../hooks/useUserLevel';

type Phase = 'intro' | 'test' | 'result';

// Adaptive test: go through levels, stop when user gets 3+ wrong in a level
function computeLevel(answers: Record<string, number>): {
  level: CEFRLevel;
  scoreByLevel: Record<CEFRLevel, { correct: number; total: number }>;
} {
  const scoreByLevel: Record<CEFRLevel, { correct: number; total: number }> = {
    A1: { correct: 0, total: 0 },
    A2: { correct: 0, total: 0 },
    B1: { correct: 0, total: 0 },
    B2: { correct: 0, total: 0 },
    C1: { correct: 0, total: 0 },
  };

  for (const q of levelTestQuestions) {
    if (answers[q.id] !== undefined) {
      scoreByLevel[q.level].total += 1;
      if (answers[q.id] === q.correctIndex) {
        scoreByLevel[q.level].correct += 1;
      }
    }
  }

  // Find the highest level where user got >= 3/5 correct
  let determinedLevel: CEFRLevel = 'A1';
  for (const lvl of CEFR_ORDER) {
    const s = scoreByLevel[lvl];
    if (s.total > 0 && s.correct >= 3) {
      determinedLevel = lvl;
    } else if (s.total > 0) {
      break; // Failed this level, stop
    }
  }

  return { level: determinedLevel, scoreByLevel };
}

export default function LevelTestPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { setLevel, hasDiagnosed } = useUserLevel();
  const navigate = useNavigate();

  const questions = useMemo(() => levelTestQuestions, []);
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Track wrong answers per current level to enable adaptive stopping
  const wrongCountInCurrentLevel = useMemo(() => {
    if (!currentQuestion) return 0;
    const lvl = currentQuestion.level;
    const levelQuestions = questions.filter((q) => q.level === lvl);
    let wrong = 0;
    for (const q of levelQuestions) {
      if (answers[q.id] !== undefined && answers[q.id] !== q.correctIndex) {
        wrong++;
      }
    }
    return wrong;
  }, [answers, currentQuestion, questions]);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (showExplanation) return;
      setSelectedOption(optionIndex);
      setShowExplanation(true);
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
    },
    [showExplanation, currentQuestion],
  );

  const handleNext = useCallback(() => {
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    const newWrongCount = wrongCountInCurrentLevel + (isCorrect ? 0 : 1);

    // Check if we should skip to next level or end test
    const currentLevel = currentQuestion.level;
    const levelQuestions = questions.filter((q) => q.level === currentLevel);
    const answeredInLevel = levelQuestions.filter((q) => answers[q.id] !== undefined || q.id === currentQuestion.id).length;
    const isLastInLevel = answeredInLevel >= levelQuestions.length;

    // If 3+ wrong in this level, skip remaining questions in this level and end
    if (newWrongCount >= 3 && !isLastInLevel) {
      // Find the first question of the next level, or end
      const currentLevelIdx = CEFR_ORDER.indexOf(currentLevel);
      if (currentLevelIdx < CEFR_ORDER.length - 1) {
        // Skip to results - user's level is determined
        setPhase('result');
      } else {
        setPhase('result');
      }
      setSelectedOption(null);
      setShowExplanation(false);
      return;
    }

    // Move to next question
    if (currentIndex < totalQuestions - 1) {
      // If last question in level and failed (< 3 correct), end test
      if (isLastInLevel) {
        const correctInLevel = levelQuestions.filter(
          (q) => (q.id === currentQuestion.id ? selectedOption : answers[q.id]) === q.correctIndex,
        ).length;
        if (correctInLevel < 3 || currentLevel === 'C1') {
          setPhase('result');
          setSelectedOption(null);
          setShowExplanation(false);
          return;
        }
      }
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPhase('result');
    }
    setSelectedOption(null);
    setShowExplanation(false);
  }, [
    selectedOption,
    currentQuestion,
    currentIndex,
    totalQuestions,
    wrongCountInCurrentLevel,
    questions,
    answers,
  ]);

  const result = useMemo(() => computeLevel(answers), [answers]);

  const handleSaveResult = useCallback(() => {
    setLevel(result.level, 'diagnostic');
    navigate('/');
  }, [setLevel, result.level, navigate]);

  // --- Intro Phase ---
  if (phase === 'intro') {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          &larr; ホーム
        </Link>

        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            レベル診断テスト
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            あなたの英語力を測定します
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 dark:text-white">テストの流れ</h2>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">1</span>
              <span>A1（入門）からC1（上級）まで段階的に出題</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">2</span>
              <span>各レベル5問ずつ、語彙・文法・読解をバランスよく出題</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">3</span>
              <span>あなたのレベルに到達すると自動的にテストが終了</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">4</span>
              <span>結果に基づいてCEFRレベルとTOEICスコア目安を表示</span>
            </li>
          </ul>

          {hasDiagnosed && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-700 dark:text-amber-300">
              以前のテスト結果がありますが、再テストすると上書きされます。
            </div>
          )}
        </div>

        <button
          onClick={() => setPhase('test')}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          テストを始める
        </button>
      </div>
    );
  }

  // --- Test Phase ---
  if (phase === 'test' && currentQuestion) {
    const levelInfo = LEVEL_INFO[currentQuestion.level];
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    return (
      <div className="max-w-lg mx-auto space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-${levelInfo.color}-100 text-${levelInfo.color}-700 dark:bg-${levelInfo.color}-900/40 dark:text-${levelInfo.color}-300`}>
              {currentQuestion.level} - {levelInfo.labelJa}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-1 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {currentQuestion.type === 'vocabulary'
              ? '語彙'
              : currentQuestion.type === 'grammar'
                ? '文法'
                : '読解'}
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {currentQuestion.question}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {currentQuestion.questionJa}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => {
              let className =
                'w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 ';

              if (!showExplanation) {
                className +=
                  'border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-800 dark:text-gray-200 cursor-pointer';
              } else if (i === currentQuestion.correctIndex) {
                className +=
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200';
              } else if (i === selectedOption) {
                className +=
                  'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200';
              } else {
                className +=
                  'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showExplanation}
                  className={className}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  selectedOption === currentQuestion.correctIndex
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <p
                  className={`text-sm font-bold mb-1 ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}
                >
                  {selectedOption === currentQuestion.correctIndex ? '正解！' : '不正解'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {currentQuestion.explanation}
                </p>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
              >
                {currentIndex < totalQuestions - 1 ? '次の問題へ' : '結果を見る'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Result Phase ---
  const levelInfo = LEVEL_INFO[result.level];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg mb-4">
          <span className="text-3xl font-black text-white">{result.level}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          診断結果
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          あなたのレベルは <strong className="text-indigo-600 dark:text-indigo-400">{result.level}（{levelInfo.labelJa}）</strong> です
        </p>
      </div>

      {/* Level Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-3">あなたのレベル</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${levelInfo.color}-500 to-${levelInfo.color}-600 flex items-center justify-center`}>
            <span className="text-xl font-black text-white">{result.level}</span>
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white">
              {levelInfo.label} - {levelInfo.labelJa}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {levelInfo.description}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">推定TOEICスコア</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {levelInfo.toeicMin} 〜 {levelInfo.toeicMax}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">レベル別スコア</h2>
        <div className="space-y-3">
          {CEFR_ORDER.map((lvl) => {
            const s = result.scoreByLevel[lvl];
            if (s.total === 0) return null;
            const pct = Math.round((s.correct / s.total) * 100);
            const passed = s.correct >= 3;
            return (
              <div key={lvl} className="flex items-center gap-3">
                <span className="text-sm font-bold w-8 text-gray-700 dark:text-gray-300">
                  {lvl}
                </span>
                <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      passed
                        ? 'bg-emerald-500'
                        : 'bg-red-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-sm font-bold w-12 text-right ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {s.correct}/{s.total}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level Map */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4">レベルマップ</h2>
        <div className="flex items-center justify-between">
          {CEFR_ORDER.map((lvl, i) => {
            const isCurrent = lvl === result.level;
            const isPassed = CEFR_ORDER.indexOf(lvl) <= CEFR_ORDER.indexOf(result.level);
            return (
              <div key={lvl} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-lg scale-110'
                        : isPassed
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {lvl}
                  </div>
                  <span className={`text-[10px] mt-1 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                    {LEVEL_INFO[lvl].labelJa}
                  </span>
                </div>
                {i < CEFR_ORDER.length - 1 && (
                  <div
                    className={`w-6 sm:w-10 h-0.5 mx-1 ${
                      isPassed && CEFR_ORDER.indexOf(lvl) < CEFR_ORDER.indexOf(result.level)
                        ? 'bg-emerald-300 dark:bg-emerald-700'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pb-8">
        <button
          onClick={handleSaveResult}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          このレベルで学習を始める
        </button>
        <button
          onClick={() => {
            setPhase('intro');
            setCurrentIndex(0);
            setAnswers({});
            setSelectedOption(null);
            setShowExplanation(false);
          }}
          className="w-full py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          もう一度テストする
        </button>
      </div>
    </div>
  );
}
