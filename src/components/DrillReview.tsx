import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDrillMistakes } from '../hooks/useDrillMistakes';
import { useProgress } from '../hooks/useProgress';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import {
  MISTAKE_MASTER_STREAK,
  isValidMistake,
  pickNextMistake,
  type DrillMistake,
} from '../utils/drillMistakes';
import {
  isSpaceKey,
  OPTION_LABELS,
  SHORTCUT_OPTION_KEYS,
  shouldIgnoreShortcutTarget,
} from '../utils/drillShortcuts';
import {
  DRILL_DIFFICULTIES,
  DRILL_GENRES,
  type DrillDifficulty,
  type DrillGenre,
} from '../utils/drillTypes';

interface ReviewSessionStats {
  reviewed: number;
  mastered: number;
}

interface ReviewRuntime {
  currentMistake: DrillMistake | null;
  recentIds: string[];
}

interface DrillReviewProps {
  /** テスト用に乱数を固定する。未指定なら通常の Math.random を使う。 */
  rand?: () => number;
}

const DRILL_MISTAKES_STORAGE_KEY = 'english-learn-drill-mistakes';

function loadInitialMistakes(): DrillMistake[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const raw = localStorage.getItem(DRILL_MISTAKES_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidMistake);
  } catch {
    return [];
  }
}

function createInitialRuntime(rand: () => number): ReviewRuntime {
  const currentMistake = pickNextMistake(loadInitialMistakes(), [], rand);
  return {
    currentMistake,
    recentIds: currentMistake ? [currentMistake.question.id] : [],
  };
}

function genreLabel(genre: DrillGenre): string {
  return DRILL_GENRES.find((item) => item.value === genre)?.label ?? genre;
}

function difficultyLabel(difficulty: DrillDifficulty): string {
  return DRILL_DIFFICULTIES.find((item) => item.value === difficulty)?.label ?? difficulty;
}

export default function DrillReview({ rand }: DrillReviewProps) {
  const { mistakes, pendingCount, reviewMistake } = useDrillMistakes();
  const { recordStudyDay } = useProgress();
  const { speak, speaking } = useSpeechSynthesis();

  const [runtime, setRuntime] = useState<ReviewRuntime>(() =>
    createInitialRuntime(rand ?? Math.random),
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [masteredCurrent, setMasteredCurrent] = useState(false);
  const [session, setSession] = useState<ReviewSessionStats>({ reviewed: 0, mastered: 0 });

  const storedCurrentMistake = runtime.currentMistake;
  const currentMistakeIsStale =
    storedCurrentMistake !== null &&
    !answered &&
    !mistakes.some((mistake) => mistake.question.id === storedCurrentMistake.question.id);
  const currentMistake = currentMistakeIsStale ? null : storedCurrentMistake;
  const currentQuestion = currentMistake?.question ?? null;
  const isCorrect =
    answered &&
    currentQuestion !== null &&
    selectedIndex !== null &&
    selectedIndex === currentQuestion.correctIndex;
  const nextCorrectStreak = currentMistake ? (isCorrect ? currentMistake.correctStreak + 1 : 0) : 0;
  const remainingToMaster = Math.max(0, MISTAKE_MASTER_STREAK - nextCorrectStreak);
  const hasCompletedSession = session.reviewed > 0 && pendingCount === 0 && currentQuestion === null;

  const loadNextMistake = useCallback(() => {
    setRuntime((prev) => {
      const next = pickNextMistake(mistakes, prev.recentIds, rand ?? Math.random);
      return {
        currentMistake: next,
        recentIds: next
          ? [next.question.id, ...prev.recentIds.filter((id) => id !== next.question.id)].slice(0, 3)
          : prev.recentIds,
      };
    });
  }, [mistakes, rand]);

  // リスニング問題は出題時だけ読み上げ、回答前は英文を隠す。
  useEffect(() => {
    if (currentQuestion?.genre !== 'listening') return;
    speak(currentQuestion.audioText ?? currentQuestion.prompt);
  }, [currentQuestion, speak]);

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (!currentMistake || answered) return;

      const { question, correctStreak } = currentMistake;
      const correct = optionIndex === question.correctIndex;
      const willMaster = correct && correctStreak + 1 >= MISTAKE_MASTER_STREAK;

      setSelectedIndex(optionIndex);
      setAnswered(true);
      setMasteredCurrent(willMaster);
      setSession((prev) => ({
        reviewed: prev.reviewed + 1,
        mastered: prev.mastered + (willMaster ? 1 : 0),
      }));
      reviewMistake(question.id, correct);
      recordStudyDay();
    },
    [answered, currentMistake, recordStudyDay, reviewMistake],
  );

  const handleNext = useCallback(() => {
    if (!answered) return;

    setSelectedIndex(null);
    setAnswered(false);
    setMasteredCurrent(false);
    loadNextMistake();
  }, [answered, loadNextMistake]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (shouldIgnoreShortcutTarget(event.target)) return;

      const optionIndex = SHORTCUT_OPTION_KEYS[event.key.toLowerCase()];
      if (
        !answered &&
        currentQuestion &&
        optionIndex !== undefined &&
        optionIndex < currentQuestion.options.length
      ) {
        handleAnswer(optionIndex);
        return;
      }

      if (answered && (event.key === 'Enter' || isSpaceKey(event))) {
        if (isSpaceKey(event)) {
          event.preventDefault();
        }
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answered, currentQuestion, handleAnswer, handleNext]);

  const handleReplay = useCallback(() => {
    if (currentQuestion?.genre !== 'listening') return;
    speak(currentQuestion.audioText ?? currentQuestion.prompt);
  }, [currentQuestion, speak]);

  const renderSummary = () => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div
        aria-label={`残り問題数 ${pendingCount}`}
        className="rounded-xl bg-sky-50 p-3 dark:bg-sky-950/40"
      >
        <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">残り問題数</p>
        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">{pendingCount}</p>
      </div>
      <div
        aria-label={`今回復習 ${session.reviewed}`}
        className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900/50"
      >
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">今回復習</p>
        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
          {session.reviewed}
        </p>
      </div>
      <div
        aria-label={`今回マスター ${session.mastered}`}
        className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/40"
      >
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
          今回マスター
        </p>
        <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
          {session.mastered}
        </p>
      </div>
    </div>
  );

  if (!currentQuestion) {
    return (
      <section
        className="animate-fade-in-up mx-auto mb-6 w-full max-w-3xl space-y-4"
        aria-labelledby="drill-review-heading"
      >
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm dark:border-sky-800 dark:bg-gray-800">
          {renderSummary()}
        </div>
        <div className="rounded-2xl border border-sky-200 bg-white p-6 text-center shadow-sm dark:border-sky-800 dark:bg-gray-800">
          <h2
            id="drill-review-heading"
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
          >
            {hasCompletedSession ? 'すべてマスターしました! 🎉' : '間違えた問題はありません。'}
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {hasCompletedSession
              ? '復習セッションの対象はすべて完了しました。'
              : 'ドリルで間違えた問題がここに追加されます。'}
          </p>
          <Link
            to="/drill"
            className="mt-5 inline-flex rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            ドリルへ戻る
          </Link>
        </div>
      </section>
    );
  }

  const questionNumber = session.reviewed + (answered ? 0 : 1);

  return (
    <section
      className="animate-fade-in-up mx-auto mb-6 w-full max-w-3xl space-y-4"
      aria-labelledby="drill-review-heading"
    >
      <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm dark:border-sky-800 dark:bg-gray-800">
        {renderSummary()}
      </div>

      <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-gray-800">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <h2 id="drill-review-heading" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            間違い問題の復習
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
              第 {questionNumber} 問
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {difficultyLabel(currentQuestion.difficulty)}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {genreLabel(currentQuestion.genre)}
            </span>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
          <p className="mb-2 text-xs font-bold text-gray-400 dark:text-gray-500">
            {genreLabel(currentQuestion.genre)} / {difficultyLabel(currentQuestion.difficulty)}
          </p>
          {currentQuestion.genre === 'listening' ? (
            <div>
              <p className="text-base font-semibold leading-relaxed text-gray-900 dark:text-gray-100">
                音声を聞いて、内容に合う答えを選んでください。
              </p>
              <button
                type="button"
                onClick={handleReplay}
                className="mt-3 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-wait disabled:bg-sky-400 dark:focus:ring-offset-gray-900"
                disabled={speaking}
              >
                🔊 もう一度聞く
              </button>
              {answered && (
                <p className="mt-3 rounded-lg bg-white p-3 text-sm font-medium leading-relaxed text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  英文: {currentQuestion.prompt}
                </p>
              )}
            </div>
          ) : (
            <p className="text-base font-semibold leading-relaxed text-gray-900 dark:text-gray-100">
              {currentQuestion.prompt}
            </p>
          )}
        </div>

        <div className="mb-4 grid grid-cols-1 gap-2.5">
          {currentQuestion.options.map((option, index) => {
            let style =
              'border-gray-200 bg-white text-gray-700 hover:border-sky-300 hover:bg-sky-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-sky-700 dark:hover:bg-sky-900/30';
            if (answered) {
              if (index === currentQuestion.correctIndex) {
                style =
                  'border-green-400 bg-green-50 text-green-800 ring-2 ring-green-300 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-700';
              } else if (index === selectedIndex) {
                style =
                  'border-red-400 bg-red-50 text-red-800 ring-2 ring-red-300 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-700';
              } else {
                style =
                  'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500';
              }
            }

            const badge =
              answered && index === currentQuestion.correctIndex
                ? '○'
                : answered && index === selectedIndex
                  ? '✕'
                  : (OPTION_LABELS[index] ?? String(index + 1));

            return (
              <button
                key={`${currentQuestion.id}-${option}`}
                type="button"
                aria-pressed={index === selectedIndex}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition-all duration-200 ${
                  answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
                } focus:outline-none focus:ring-2 focus:ring-sky-300 ${style}`}
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      answered && index === currentQuestion.correctIndex
                        ? 'bg-green-200 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                        : answered && index === selectedIndex
                          ? 'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {badge}
                  </span>
                  <span>{option}</span>
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div>
            <p
              role="status"
              aria-live="assertive"
              className={`mb-2 text-base font-bold ${
                isCorrect ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'
              }`}
            >
              {masteredCurrent ? '正解! マスター!' : isCorrect ? '正解!' : '不正解'}
            </p>
            <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-700 dark:bg-gray-900/50">
              <p className="mb-1 text-xs font-semibold text-gray-400 dark:text-gray-500">
                解説 ({genreLabel(currentQuestion.genre)})
              </p>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {currentQuestion.explanation}
              </p>
            </div>
            {!masteredCurrent && (
              <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                あと{remainingToMaster}回連続正解でマスター
              </p>
            )}
            <div className="text-center">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                次の問題 →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
