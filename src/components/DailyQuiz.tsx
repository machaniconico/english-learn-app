import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QUIZ_DIFFICULTIES,
  type DailyQuizQuestion,
  type QuizDifficulty,
} from '../data/dailyQuiz';
import { selectDailyQuiz, getTodayString } from '../utils/dailyQuizSelect';
import { useAccuracy } from '../hooks/useAccuracy';

// =====================================================================
// localStorage 永続化
// =====================================================================
// その日のクイズ状態を保存する。リロードしても難易度・現在位置・完了状態と
// 解答が復元される(同じ問題セットは selectDailyQuiz が決定的に再現する)。

interface SavedQuizState {
  difficulty: QuizDifficulty;
  /** 各問の選択肢インデックス(未解答は null) */
  answers: (number | null)[];
  /** 表示中の問題インデックス。回答直後に離脱した場合も同じ問題へ戻す。 */
  currentIndex: number;
  /** 全問終えたか */
  finished: boolean;
}

function storageKey(date: string): string {
  return `english-learn-daily-quiz-${date}`;
}

function isQuizDifficulty(value: unknown): value is QuizDifficulty {
  return value === 'beginner' || value === 'intermediate' || value === 'advanced';
}

function normalizeAnswers(answers: unknown[]): (number | null)[] {
  return answers.map((answer) =>
    answer === null ||
    (typeof answer === 'number' && Number.isInteger(answer) && answer >= 0 && answer < 4)
      ? answer
      : null,
  );
}

function loadSaved(date: string): SavedQuizState | null {
  try {
    const raw = localStorage.getItem(storageKey(date));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.answers) &&
      isQuizDifficulty(parsed.difficulty)
    ) {
      const answers = normalizeAnswers(parsed.answers);
      const currentIndex =
        Number.isInteger(parsed.currentIndex) &&
        parsed.currentIndex >= 0 &&
        parsed.currentIndex < answers.length
          ? parsed.currentIndex
          : answers.findIndex((a) => a === null);
      return {
        difficulty: parsed.difficulty,
        answers,
        currentIndex: currentIndex === -1 ? 0 : currentIndex,
        finished: parsed.finished === true,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function saveState(date: string, state: SavedQuizState): void {
  try {
    localStorage.setItem(storageKey(date), JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

function clearSaved(date: string): void {
  try {
    localStorage.removeItem(storageKey(date));
  } catch {
    // ignore
  }
}

// =====================================================================
// 画面のフェーズ
// =====================================================================
type Phase = 'select' | 'quiz' | 'result';

interface DailyQuizProps {
  /** テスト用に「今日」を固定するための日付文字列。未指定なら実際の今日。 */
  today?: string;
}

export default function DailyQuiz({ today }: DailyQuizProps) {
  const dateStr = useMemo(() => today ?? getTodayString(), [today]);
  const { logResult } = useAccuracy();

  // 既存の保存があれば、その続き(または結果)から復元する。
  const saved = useMemo(() => loadSaved(dateStr), [dateStr]);

  const [phase, setPhase] = useState<Phase>(() => {
    if (!saved) return 'select';
    return saved.finished ? 'result' : 'quiz';
  });
  const [difficulty, setDifficulty] = useState<QuizDifficulty | null>(
    saved?.difficulty ?? null,
  );

  // 選んだ難易度の「その日の10問」。決定的なので毎回同じ。
  const questions: DailyQuizQuestion[] = useMemo(
    () => (difficulty ? selectDailyQuiz(difficulty, dateStr) : []),
    [difficulty, dateStr],
  );

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => saved?.answers ?? [],
  );
  const [current, setCurrent] = useState<number>(() => {
    if (!saved || saved.finished) return 0;
    return saved.currentIndex;
  });

  // 現在の問題で選択済みか(回答後は解説を表示)
  const currentAnswer = answers[current] ?? null;
  const answered = currentAnswer !== null;
  const score = answers.filter(
    (a, i) => a !== null && questions[i] && a === questions[i].correctIndex,
  ).length;

  // --- 難易度選択 ---
  const handleSelectDifficulty = useCallback(
    (id: QuizDifficulty) => {
      const picked = selectDailyQuiz(id, dateStr);
      const initialAnswers: (number | null)[] = new Array(picked.length).fill(null);
      setDifficulty(id);
      setAnswers(initialAnswers);
      setCurrent(0);
      setPhase('quiz');
      saveState(dateStr, {
        difficulty: id,
        answers: initialAnswers,
        currentIndex: 0,
        finished: false,
      });
    },
    [dateStr],
  );

  // --- 回答 ---
  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answered || !difficulty) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[current] = optionIndex;
        saveState(dateStr, {
          difficulty,
          answers: next,
          currentIndex: current,
          finished: false,
        });
        return next;
      });
    },
    [answered, current, dateStr, difficulty],
  );

  // --- 次へ / 結果へ ---
  const handleNext = useCallback(() => {
    if (!difficulty) return;
    const isLast = current + 1 >= questions.length;
    if (isLast) {
      const finalScore = answers.filter(
        (a, i) => a !== null && questions[i] && a === questions[i].correctIndex,
      ).length;
      logResult({
        type: 'daily-quiz',
        setId: `daily-quiz-${dateStr}-${difficulty}`,
        score: finalScore,
        total: questions.length,
        correct: finalScore,
        level: difficulty,
      });
      saveState(dateStr, {
        difficulty,
        answers,
        currentIndex: current,
        finished: true,
      });
      setPhase('result');
    } else {
      const nextIndex = current + 1;
      saveState(dateStr, {
        difficulty,
        answers,
        currentIndex: nextIndex,
        finished: false,
      });
      setCurrent(nextIndex);
    }
  }, [answers, current, dateStr, difficulty, logResult, questions]);

  // --- 保存済みの状態を消して難易度選択へ戻る ---
  const handleRetry = useCallback(() => {
    clearSaved(dateStr);
    setDifficulty(null);
    setAnswers([]);
    setCurrent(0);
    setPhase('select');
  }, [dateStr]);

  // =====================================================================
  // 難易度選択画面
  // =====================================================================
  if (phase === 'select') {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            デイリー10問クイズ
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            毎日入れ替わる10問に挑戦しよう。まずは難易度を選んでください。
          </p>
        </div>

        <div className="space-y-3" role="group" aria-label="難易度を選ぶ">
          {QUIZ_DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-label={`難易度 ${d.label}（${d.labelEn}）を選んで開始`}
              onClick={() => handleSelectDifficulty(d.id)}
              className="w-full text-left rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 transition-all duration-200 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {d.label}
                    <span className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                      {d.labelEn}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {d.description}
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                  {d.hint}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          ※ 5つのデイリーチャレンジとは別の、独立した10問クイズです。
        </p>
      </div>
    );
  }

  // =====================================================================
  // 結果画面(全問の解説を振り返り表示)
  // =====================================================================
  if (phase === 'result') {
    const total = questions.length;
    const finalScore = answers.filter(
      (a, i) => a !== null && questions[i] && a === questions[i].correctIndex,
    ).length;
    const pct = total > 0 ? Math.round((finalScore / total) * 100) : 0;
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';
    const difficultyLabel =
      QUIZ_DIFFICULTIES.find((d) => d.id === difficulty)?.label ?? '';

    return (
      <div className="w-full max-w-2xl mx-auto">
        {/* スコアサマリ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 text-center mb-6">
          <p className="text-5xl mb-3">{emoji}</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            クイズ完了!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            難易度: {difficultyLabel}
          </p>
          <div
            role="status"
            aria-live="polite"
            aria-label={`スコア ${finalScore} / ${total} (${pct}% 正解)`}
            className="inline-flex items-baseline gap-1 mb-4"
          >
            <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
              {finalScore}
            </span>
            <span className="text-2xl text-gray-400">/ {total}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">{pct}% 正解</p>
        </div>

        {/* 全問の振り返り(解説) */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 px-1">
          解説で振り返る
        </h3>
        <ol className="space-y-4">
          {questions.map((q, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === q.correctIndex;
            return (
              <li
                key={q.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5"
              >
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className={`shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold ${
                      isCorrect
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                    }`}
                    aria-label={isCorrect ? '正解' : '不正解'}
                  >
                    {isCorrect ? '○' : '✕'}
                  </span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    <span className="text-gray-400 dark:text-gray-500 mr-1">Q{i + 1}.</span>
                    {q.question}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 pl-8">
                  {q.questionJa}
                </p>
                <div className="pl-8 space-y-1 mb-3">
                  <p className="text-sm">
                    <span className="font-medium text-gray-500 dark:text-gray-400">正解: </span>
                    <span className="font-semibold text-green-700 dark:text-green-300">
                      {q.options[q.correctIndex]}
                    </span>
                  </p>
                  {!isCorrect && userAns !== null && userAns !== undefined && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-500 dark:text-gray-400">あなたの解答: </span>
                      <span className="font-semibold text-red-700 dark:text-red-300">
                        {q.options[userAns]}
                      </span>
                    </p>
                  )}
                </div>
                <div className="ml-8 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 p-3">
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {q.explanation}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            type="button"
            onClick={handleRetry}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            別の難易度に挑戦
          </button>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================================
  // 出題画面(quiz)
  // =====================================================================
  const q = questions[current];
  if (!q) {
    // 想定外(問題が無い)の安全策
    return (
      <div className="w-full max-w-lg mx-auto text-center text-gray-500 dark:text-gray-400">
        <p>問題を読み込めませんでした。</p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold"
        >
          難易度を選び直す
        </button>
      </div>
    );
  }

  const total = questions.length;
  const progressPct = Math.round(((current + (answered ? 1 : 0)) / total) * 100);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          第 {current + 1} 問 / {total}
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          正解 {score}
        </span>
      </div>

      {/* 進捗バー */}
      <div
        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden"
        role="progressbar"
        aria-label="クイズの進捗"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPct}
      >
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 問題文 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 mb-6">
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
          {q.question}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{q.questionJa}</p>
      </div>

      {/* 選択肢 */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {q.options.map((option, index) => {
          let style =
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 text-gray-700 dark:text-gray-300';
          if (answered) {
            if (index === q.correctIndex) {
              style =
                'bg-green-50 dark:bg-green-900/40 border-green-400 dark:border-green-800 text-green-800 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700';
            } else if (index === currentAnswer) {
              style =
                'bg-red-50 dark:bg-red-900/40 border-red-400 dark:border-red-800 text-red-800 dark:text-red-300 ring-2 ring-red-300 dark:ring-red-700';
            } else {
              style =
                'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500';
            }
          }
          return (
            <button
              key={index}
              type="button"
              aria-pressed={index === currentAnswer}
              onClick={() => handleAnswer(index)}
              disabled={answered}
              className={`w-full px-5 py-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
                answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
              } focus:outline-none focus:ring-2 focus:ring-indigo-300 ${style}`}
            >
              <span className="inline-flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-sm font-bold shrink-0 ${
                    answered && index === q.correctIndex
                      ? 'bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300'
                      : answered && index === currentAnswer
                        ? 'bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {answered && index === q.correctIndex
                    ? '○'
                    : answered && index === currentAnswer
                      ? '✕'
                      : String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 解説 + 次へ */}
      {answered && (
        <div>
          <p
            role="status"
            aria-live="assertive"
            className={`text-lg font-bold mb-2 ${
              currentAnswer === q.correctIndex
                ? 'text-green-600 dark:text-green-300'
                : 'text-red-600 dark:text-red-300'
            }`}
          >
            {currentAnswer === q.correctIndex ? '🎉 正解!' : '❌ 不正解'}
          </p>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">
              解説 ({q.category})
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {q.explanation}
            </p>
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            >
              {current + 1 >= total ? '結果を見る' : '次の問題 →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
