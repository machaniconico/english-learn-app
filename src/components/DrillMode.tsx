import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useAccuracy } from '../hooks/useAccuracy';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { pickNextQuestion, pickRandomGenre, pushRecent } from '../utils/drillEngine';
import {
  loadDrillPrefs,
  loadDrillRecent,
  loadDrillStats,
  recordDrillAnswer,
  saveDrillPrefs,
  saveDrillRecent,
  saveDrillStats,
  type DrillStatsData,
} from '../utils/drillStats';
import { buildDrillPool } from '../utils/drillQuestionBank';
import {
  DRILL_DIFFICULTIES,
  DRILL_GENRES,
  type DrillDifficulty,
  type DrillGenre,
  type DrillGenreSelection,
  type DrillQuestion,
} from '../utils/drillTypes';

type DrillPhase = 'active' | 'summary';

interface SessionStats {
  answered: number;
  correct: number;
}

interface NextQuestionResult {
  question: DrillQuestion;
  recent: string[];
}

interface DrillRuntime {
  question: DrillQuestion | null;
  recent: string[];
}

interface DrillModeProps {
  /** テスト用に乱数を固定する。未指定なら通常の Math.random を使う。 */
  rand?: () => number;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const RANDOM_GENRE_LABEL = 'ランダム';

function percent(correct: number, answered: number): number {
  if (answered === 0) return 0;
  return Math.round((correct / answered) * 100);
}

function genreLabel(genre: DrillGenre): string {
  return DRILL_GENRES.find((item) => item.value === genre)?.label ?? genre;
}

function difficultyLabel(difficulty: DrillDifficulty): string {
  return DRILL_DIFFICULTIES.find((item) => item.value === difficulty)?.label ?? difficulty;
}

function orderedGenres(selection: DrillGenreSelection, rand: () => number): DrillGenre[] {
  if (selection !== 'random') return [selection];

  const first = pickRandomGenre(rand);
  return [
    first,
    ...DRILL_GENRES.map((item) => item.value).filter((genre) => genre !== first),
  ];
}

function resolveNextQuestion(
  selection: DrillGenreSelection,
  difficulty: DrillDifficulty,
  recentIds: string[],
  randOverride?: () => number,
): NextQuestionResult | null {
  const rand = randOverride ?? Math.random;

  for (const genre of orderedGenres(selection, rand)) {
    const pool = buildDrillPool(genre, difficulty, randOverride);
    const question = pickNextQuestion(pool, recentIds, rand);
    if (question) {
      return {
        question,
        recent: pushRecent(recentIds, question.id),
      };
    }
  }

  return null;
}

export default function DrillMode({ rand }: DrillModeProps) {
  const prefs = useMemo(() => loadDrillPrefs(), []);
  const initialRuntime = useMemo<DrillRuntime>(() => {
    const loadedRecent = loadDrillRecent();
    const result = resolveNextQuestion(prefs.genre, prefs.difficulty, loadedRecent, rand);
    return {
      question: result?.question ?? null,
      recent: result?.recent ?? loadedRecent,
    };
  }, [prefs.difficulty, prefs.genre, rand]);
  const { logResult } = useAccuracy();
  const { speak, speaking } = useSpeechSynthesis();

  const [phase, setPhase] = useState<DrillPhase>('active');
  const [difficulty, setDifficulty] = useState<DrillDifficulty>(prefs.difficulty);
  const [genreSelection, setGenreSelection] = useState<DrillGenreSelection>(prefs.genre);
  const [stats, setStats] = useState<DrillStatsData>(() => loadDrillStats());
  const [recent, setRecent] = useState<string[]>(initialRuntime.recent);
  const [session, setSession] = useState<SessionStats>({ answered: 0, correct: 0 });
  const [currentQuestion, setCurrentQuestion] = useState<DrillQuestion | null>(
    initialRuntime.question,
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const answered = selectedIndex !== null;
  const sessionRate = percent(session.correct, session.answered);
  const totalRate = percent(stats.total.correct, stats.total.answered);
  const questionNumber = session.answered + (answered ? 0 : 1);

  // 次に進む時点の設定を使って、直近履歴にない問題を優先して選ぶ。
  const loadNextQuestion = useCallback(() => {
    const result = resolveNextQuestion(genreSelection, difficulty, recent, rand);
    if (!result) {
      setCurrentQuestion(null);
      setSelectedIndex(null);
      return;
    }

    setCurrentQuestion(result.question);
    setSelectedIndex(null);
    setRecent(result.recent);
  }, [difficulty, genreSelection, rand, recent]);

  useEffect(() => {
    saveDrillRecent(recent);
  }, [recent]);

  useEffect(() => {
    saveDrillStats(stats);
  }, [stats]);

  // 空プールで出題が止まった場合、セレクタ変更時に新しい条件で即座に出題を再開する。
  const recoverFromEmptyPool = useCallback(
    (nextGenre: DrillGenreSelection, nextDifficulty: DrillDifficulty) => {
      if (phase !== 'active' || currentQuestion !== null) return;
      const result = resolveNextQuestion(nextGenre, nextDifficulty, recent, rand);
      if (!result) return;
      setCurrentQuestion(result.question);
      setSelectedIndex(null);
      setRecent(result.recent);
    },
    [currentQuestion, phase, rand, recent],
  );

  // リスニング問題は出題された瞬間に読み上げる。回答前は英文を画面に出さない。
  useEffect(() => {
    if (phase !== 'active' || currentQuestion?.genre !== 'listening') return;
    speak(currentQuestion.audioText ?? currentQuestion.prompt);
  }, [currentQuestion, phase, speak]);

  const handleDifficultyChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextDifficulty = event.target.value as DrillDifficulty;
      setDifficulty(nextDifficulty);
      saveDrillPrefs({ genre: genreSelection, difficulty: nextDifficulty });
      recoverFromEmptyPool(genreSelection, nextDifficulty);
    },
    [genreSelection, recoverFromEmptyPool],
  );

  const handleGenreChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextGenre = event.target.value as DrillGenreSelection;
      setGenreSelection(nextGenre);
      saveDrillPrefs({ genre: nextGenre, difficulty });
      recoverFromEmptyPool(nextGenre, difficulty);
    },
    [difficulty, recoverFromEmptyPool],
  );

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion || selectedIndex !== null || phase !== 'active') return;

      const correct = optionIndex === currentQuestion.correctIndex;
      setSelectedIndex(optionIndex);
      setSession((prev) => ({
        answered: prev.answered + 1,
        correct: prev.correct + (correct ? 1 : 0),
      }));
      setStats((prev) =>
        recordDrillAnswer(prev, currentQuestion.genre, currentQuestion.difficulty, correct),
      );
    },
    [currentQuestion, phase, selectedIndex],
  );

  const handleNext = useCallback(() => {
    if (!answered) return;
    loadNextQuestion();
  }, [answered, loadNextQuestion]);

  const handleReplay = useCallback(() => {
    if (currentQuestion?.genre !== 'listening') return;
    speak(currentQuestion.audioText ?? currentQuestion.prompt);
  }, [currentQuestion, speak]);

  const handleFinish = useCallback(() => {
    if (session.answered > 0) {
      logResult({
        type: 'drill',
        setId: 'drill',
        score: sessionRate,
        total: session.answered,
        correct: session.correct,
      });
    }
    setPhase('summary');
  }, [logResult, session, sessionRate]);

  const handleRestart = useCallback(() => {
    const result = resolveNextQuestion(genreSelection, difficulty, recent, rand);
    setSession({ answered: 0, correct: 0 });
    setCurrentQuestion(result?.question ?? null);
    setRecent(result?.recent ?? recent);
    setSelectedIndex(null);
    setPhase('active');
  }, [difficulty, genreSelection, rand, recent]);

  const renderControls = () => (
    <div className="rounded-2xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <div>
          <label
            htmlFor="drill-difficulty"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            難易度
          </label>
          <select
            id="drill-difficulty"
            value={difficulty}
            onChange={handleDifficultyChange}
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-sky-500"
          >
            {DRILL_DIFFICULTIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="drill-genre"
            className="mb-1 block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            ジャンル
          </label>
          <select
            id="drill-genre"
            value={genreSelection}
            onChange={handleGenreChange}
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-sky-500"
          >
            <option value="random">{RANDOM_GENRE_LABEL}</option>
            {DRILL_GENRES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {phase === 'active' && (
          <button
            type="button"
            onClick={handleFinish}
            className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-800 dark:hover:bg-red-900/30 dark:hover:text-red-300"
          >
            終了
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          aria-label={`今回 ${session.answered}問中${session.correct}問正解 ${sessionRate}パーセント`}
          className="rounded-xl bg-sky-50 p-3 dark:bg-sky-950/40"
        >
          <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">今回</p>
          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
            {session.correct} / {session.answered}
            <span className="ml-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              {sessionRate}%
            </span>
          </p>
        </div>
        <div
          aria-label={`全期間 ${stats.total.answered}問中${stats.total.correct}問正解 ${totalRate}パーセント`}
          className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900/50"
        >
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">全期間</p>
          <p className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
            {stats.total.correct} / {stats.total.answered}
            <span className="ml-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              {totalRate}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  if (phase === 'summary') {
    return (
      <section
        className="animate-fade-in-up mx-auto mb-6 w-full max-w-3xl space-y-4"
        aria-labelledby="drill-mode-heading"
      >
        {renderControls()}
        <div className="rounded-2xl border border-sky-200 bg-white p-6 text-center shadow-sm dark:border-sky-800 dark:bg-gray-800">
          <h2
            id="drill-mode-heading"
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
          >
            ドリルモード終了
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            今回のセッション結果
          </p>
          <div
            role="status"
            aria-live="polite"
            aria-label={`今回のスコア ${session.correct} / ${session.answered} (${sessionRate}% 正解)`}
            className="mt-5 inline-flex items-baseline gap-1"
          >
            <span className="text-5xl font-bold text-sky-600 dark:text-sky-400">
              {session.correct}
            </span>
            <span className="text-2xl text-gray-400">/ {session.answered}</span>
          </div>
          <div className="mx-auto mt-4 h-3 w-full max-w-md overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                sessionRate >= 80
                  ? 'bg-green-500'
                  : sessionRate >= 60
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${sessionRate}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{sessionRate}% 正解</p>
          <button
            type="button"
            onClick={handleRestart}
            className="mt-6 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            もう一度
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="animate-fade-in-up mx-auto mb-6 w-full max-w-3xl space-y-4"
      aria-labelledby="drill-mode-heading"
    >
      {renderControls()}

      <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-gray-800">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <h2 id="drill-mode-heading" className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ドリルモード
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
              第 {questionNumber} 問
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {difficultyLabel(difficulty)}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              {genreSelection === 'random' ? RANDOM_GENRE_LABEL : genreLabel(genreSelection)}
            </span>
          </div>
        </div>

        {!currentQuestion ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            問題を読み込めませんでした。難易度かジャンルを変更してください。
          </div>
        ) : (
          <>
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
                    className="mt-3 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-wait disabled:bg-sky-400"
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
                      : OPTION_LABELS[index];

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
                    selectedIndex === currentQuestion.correctIndex
                      ? 'text-green-600 dark:text-green-300'
                      : 'text-red-600 dark:text-red-300'
                  }`}
                >
                  {selectedIndex === currentQuestion.correctIndex ? '正解!' : '不正解'}
                </p>
                <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3.5 dark:border-gray-700 dark:bg-gray-900/50">
                  <p className="mb-1 text-xs font-semibold text-gray-400 dark:text-gray-500">
                    解説 ({genreLabel(currentQuestion.genre)})
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                  >
                    次の問題 →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
