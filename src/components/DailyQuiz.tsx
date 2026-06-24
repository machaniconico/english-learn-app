import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  QUIZ_DIFFICULTIES,
  MIXED_SELECTION_META,
  DAILY_QUIZ_COUNT_OPTIONS,
  type DailyQuizQuestion,
  type QuizSelectionMode,
} from '../data/dailyQuiz';
import { selectDailyQuiz, getTodayString, DAILY_QUIZ_COUNT } from '../utils/dailyQuizSelect';
import { getDailyQuizSummary, recommendDifficulty, getWrongQuestions } from '../utils/dailyQuizStats';
import { useAccuracy } from '../hooks/useAccuracy';
import DailyQuizReview from './DailyQuizReview';

// =====================================================================
// localStorage 永続化
// =====================================================================
// その日のクイズ状態を保存する。リロードしても出題モード・出題数・現在位置・
// 完了状態と解答が復元される(同じ問題セットは selectDailyQuiz が決定的に再現する)。

interface SavedQuizState {
  /** 出題モード(難易度 or 'mixed') */
  selection: QuizSelectionMode;
  /** その日の出題数 */
  count: number;
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

/** 出題数・出題モードの既定値を覚えておくための prefs キー。 */
const PREFS_KEY = 'english-learn-daily-quiz-prefs';

interface QuizPrefs {
  count: number;
  selection: QuizSelectionMode | null;
}

function isQuizSelection(value: unknown): value is QuizSelectionMode {
  return (
    value === 'beginner' ||
    value === 'intermediate' ||
    value === 'advanced' ||
    value === 'mixed'
  );
}

function isValidCount(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    (DAILY_QUIZ_COUNT_OPTIONS as readonly number[]).includes(value)
  );
}

function loadPrefs(): QuizPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          count: isValidCount(parsed.count) ? parsed.count : DAILY_QUIZ_COUNT,
          selection: isQuizSelection(parsed.selection) ? parsed.selection : null,
        };
      }
    }
  } catch {
    // ignore
  }
  return { count: DAILY_QUIZ_COUNT, selection: null };
}

function savePrefs(prefs: QuizPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // storage full or unavailable
  }
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
    // 後方互換: 旧データは difficulty フィールドのみで count を持たない。
    const selection = parsed?.selection ?? parsed?.difficulty;
    if (
      parsed &&
      typeof parsed === 'object' &&
      Array.isArray(parsed.answers) &&
      isQuizSelection(selection)
    ) {
      const answers = normalizeAnswers(parsed.answers);
      const count =
        typeof parsed.count === 'number' && parsed.count > 0
          ? parsed.count
          : answers.length;
      const currentIndex =
        Number.isInteger(parsed.currentIndex) &&
        parsed.currentIndex >= 0 &&
        parsed.currentIndex < answers.length
          ? parsed.currentIndex
          : answers.findIndex((a) => a === null);
      return {
        selection,
        count,
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

/** 出題モードの日本語ラベルを解決する。 */
function selectionLabel(selection: QuizSelectionMode | null): string {
  if (selection === 'mixed') return MIXED_SELECTION_META.label;
  return QUIZ_DIFFICULTIES.find((d) => d.id === selection)?.label ?? '';
}

/** 履歴の level 文字列(難易度 or 'mixed')を日本語ラベルへ。未知は空。 */
function levelLabel(level: string | undefined): string {
  if (!level) return '';
  return selectionLabel(isQuizSelection(level) ? level : null);
}

/** 'YYYY-MM-DD' を 'M/D' 表記へ。 */
function shortDate(dateStr: string): string {
  const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!m) return dateStr;
  return `${Number(m[1])}/${Number(m[2])}`;
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
  const { logResult, getResultsByType } = useAccuracy();

  // 達成ストリーク + 直近成績(select 画面でのみ表示)。
  const summary = useMemo(
    () => getDailyQuizSummary(getResultsByType('daily-quiz'), dateStr, 5),
    // getResultsByType は localStorage を都度読む安定参照。dateStr 変化で再計算。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateStr],
  );

  // 難易度ランプ提案(直近成績に応じて次に挑戦すべき難易度をやさしく推薦)。
  const recommendation = useMemo(
    () => recommendDifficulty(getResultsByType('daily-quiz')),
    // summary と同じ results を都度読む。dateStr 変化で再計算。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateStr],
  );

  // 既存の保存があれば、その続き(または結果)から復元する。
  const saved = useMemo(() => loadSaved(dateStr), [dateStr]);
  // 出題数・出題モードの既定値(前回の選択を記憶)。
  const prefs = useMemo(() => loadPrefs(), []);

  const [phase, setPhase] = useState<Phase>(() => {
    if (!saved) return 'select';
    return saved.finished ? 'result' : 'quiz';
  });
  const [selection, setSelection] = useState<QuizSelectionMode | null>(
    saved?.selection ?? null,
  );
  // 出題数。保存中なら保存値、なければ prefs の既定値。
  const [count, setCount] = useState<number>(
    () => saved?.count ?? prefs.count,
  );

  // 選んだモード・出題数の「その日の問題」。決定的なので毎回同じ。
  const questions: DailyQuizQuestion[] = useMemo(
    () => (selection ? selectDailyQuiz(selection, dateStr, count) : []),
    [selection, dateStr, count],
  );

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => saved?.answers ?? [],
  );
  const [current, setCurrent] = useState<number>(() => {
    if (!saved || saved.finished) return 0;
    return saved.currentIndex;
  });

  // Round 49: 結果画面から一時的に「間違えた問題だけ」解き直す復習モード。
  // 永続化せず・logResult も呼ばない ephemeral 切替フラグ。
  const [reviewing, setReviewing] = useState(false);

  // 現在の問題で選択済みか(回答後は解説を表示)
  const currentAnswer = answers[current] ?? null;
  const answered = currentAnswer !== null;
  const score = answers.filter(
    (a, i) => a !== null && questions[i] && a === questions[i].correctIndex,
  ).length;

  // --- 出題数の変更(prefs に記憶) ---
  const handleSelectCount = useCallback(
    (next: number) => {
      setCount(next);
      savePrefs({ count: next, selection });
    },
    [selection],
  );

  // --- 出題モード選択(開始) ---
  const handleStart = useCallback(
    (id: QuizSelectionMode) => {
      const picked = selectDailyQuiz(id, dateStr, count);
      const initialAnswers: (number | null)[] = new Array(picked.length).fill(null);
      setSelection(id);
      setAnswers(initialAnswers);
      setCurrent(0);
      setPhase('quiz');
      savePrefs({ count, selection: id });
      saveState(dateStr, {
        selection: id,
        count,
        answers: initialAnswers,
        currentIndex: 0,
        finished: false,
      });
    },
    [dateStr, count],
  );

  // --- 回答 ---
  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (answered || !selection) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[current] = optionIndex;
        saveState(dateStr, {
          selection,
          count,
          answers: next,
          currentIndex: current,
          finished: false,
        });
        return next;
      });
    },
    [answered, current, dateStr, selection, count],
  );

  // --- 次へ / 結果へ ---
  const handleNext = useCallback(() => {
    if (!selection) return;
    const isLast = current + 1 >= questions.length;
    if (isLast) {
      const finalScore = answers.filter(
        (a, i) => a !== null && questions[i] && a === questions[i].correctIndex,
      ).length;
      logResult({
        type: 'daily-quiz',
        setId: `daily-quiz-${dateStr}-${selection}-${count}`,
        score: finalScore,
        total: questions.length,
        correct: finalScore,
        level: selection,
      });
      saveState(dateStr, {
        selection,
        count,
        answers,
        currentIndex: current,
        finished: true,
      });
      setPhase('result');
    } else {
      const nextIndex = current + 1;
      saveState(dateStr, {
        selection,
        count,
        answers,
        currentIndex: nextIndex,
        finished: false,
      });
      setCurrent(nextIndex);
    }
  }, [answers, current, dateStr, selection, count, logResult, questions]);

  // --- 保存済みの状態を消して選択画面へ戻る ---
  const handleRetry = useCallback(() => {
    clearSaved(dateStr);
    setSelection(null);
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
            毎日入れ替わる問題に挑戦しよう。出題数と難易度を選んでください。
          </p>
        </div>

        {/* 出題数の選択 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            出題数
          </p>
          <div
            className="grid grid-cols-4 gap-2"
            role="group"
            aria-label="出題数を選ぶ"
          >
            {DAILY_QUIZ_COUNT_OPTIONS.map((opt) => {
              const active = opt === count;
              return (
                <button
                  key={opt}
                  type="button"
                  aria-pressed={active}
                  aria-label={`出題数 ${opt} 問`}
                  onClick={() => handleSelectCount(opt)}
                  className={`px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 cursor-pointer active:scale-[0.98] ${
                    active
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  {opt}問
                </button>
              );
            })}
          </div>
        </div>

        {/* 難易度ランプ提案バナー(直近成績に応じて次の難易度を推薦) */}
        {recommendation &&
          (() => {
            const suggestedLabel = selectionLabel(recommendation.suggested);
            const basedOnLabel = selectionLabel(recommendation.basedOn);
            const isUp = recommendation.direction === 'up';
            const message = isUp
              ? `${basedOnLabel}で平均${recommendation.avgPct}%！ ${suggestedLabel}に挑戦してみませんか？`
              : `まずは${suggestedLabel}で基礎を固めましょう（${basedOnLabel}は平均${recommendation.avgPct}%）`;
            return (
              <div
                role="note"
                aria-label={message}
                className={`mb-4 rounded-2xl border-2 p-4 ${
                  isUp
                    ? 'border-emerald-300 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-indigo-50 dark:from-emerald-950/40 dark:to-indigo-950/40'
                    : 'border-amber-300 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40'
                }`}
              >
                <p className="flex items-start gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
                  <span aria-hidden="true">{isUp ? '🚀' : '🌱'}</span>
                  <span>{message}</span>
                </p>
                <button
                  type="button"
                  aria-label={`おすすめの難易度 ${suggestedLabel}でクイズを始める`}
                  onClick={() => handleStart(recommendation.suggested)}
                  className={`mt-3 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isUp
                      ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-400'
                      : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-400'
                  }`}
                >
                  {suggestedLabel}で始める
                </button>
              </div>
            );
          })()}

        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          難易度
        </p>
        <div className="space-y-3" role="group" aria-label="難易度を選ぶ">
          {QUIZ_DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-label={`難易度 ${d.label}（${d.labelEn}）を選んで開始`}
              onClick={() => handleStart(d.id)}
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

          {/* おまかせ(Mixed) */}
          <button
            type="button"
            aria-label={`${MIXED_SELECTION_META.label}（${MIXED_SELECTION_META.labelEn}）を選んで開始`}
            onClick={() => handleStart('mixed')}
            className="w-full text-left rounded-2xl border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/40 dark:to-fuchsia-950/40 p-5 transition-all duration-200 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {MIXED_SELECTION_META.label}
                  <span className="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                    {MIXED_SELECTION_META.labelEn}
                  </span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {MIXED_SELECTION_META.description}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/40 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300">
                {MIXED_SELECTION_META.hint}
              </span>
            </div>
          </button>
        </div>

        {/* 達成ストリーク + 直近成績(履歴がある時だけ表示) */}
        {summary.history.length > 0 && (
          <div className="mt-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            {summary.streak >= 1 && (
              <div className="mb-4 flex justify-center">
                <span
                  aria-label={`デイリークイズ ${summary.streak}日連続達成中`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1.5 text-sm font-bold text-white shadow-sm"
                >
                  <span aria-hidden="true">🔥</span>
                  {summary.streak}日連続
                </span>
              </div>
            )}

            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              直近の成績
            </p>
            <ul className="space-y-2">
              {summary.history.map((day) => {
                const tone =
                  day.pct >= 80
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                    : day.pct >= 60
                      ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
                return (
                  <li
                    key={day.date}
                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">
                      {shortDate(day.date)}
                    </span>
                    <span className="flex-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {levelLabel(day.level)}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${tone}`}
                      aria-label={`${day.pct}パーセント正解`}
                    >
                      {day.pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          ※ 5つのデイリーチャレンジとは別の、独立したクイズです。
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
    const difficultyLabel = selectionLabel(selection);

    // Round 49: 間違えた問題だけを一時的に復習(ephemeral)。保存済み結果には触れない。
    const wrongQuestions = getWrongQuestions(questions, answers);

    if (reviewing) {
      return (
        <DailyQuizReview
          questions={wrongQuestions}
          onClose={() => setReviewing(false)}
        />
      );
    }

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
          {wrongQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setReviewing(true)}
              aria-label={`間違えた ${wrongQuestions.length} 問をもう一度復習する`}
              className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              間違えた {wrongQuestions.length}問をもう一度
            </button>
          )}
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
