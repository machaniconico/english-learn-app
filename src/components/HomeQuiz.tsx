import { useCallback, useMemo, useState } from 'react';
import {
  QUIZ_DIFFICULTIES,
  MIXED_SELECTION_META,
  getQuestionsByDifficulty,
  getMixedQuestions,
  type DailyQuizQuestion,
  type QuizSelectionMode,
} from '../data/dailyQuiz';
import { seededRandom } from '../utils/dailyQuizSelect';
import {
  practiceCountOptions,
  pickPracticeQuestions,
} from '../utils/practiceQuizSelect';
import { getWrongQuestions } from '../utils/dailyQuizStats';
import DailyQuizReview from './DailyQuizReview';

// トップ画面の「練習クイズ」。
// デイリークイズ(日替わり・1日1セット・完了追跡あり)とは別物で、
// 難易度と出題数(10の倍数)を指定して何度でも挑戦できる練習用。
// 状態は永続化しない(ephemeral)。

type Phase = 'config' | 'play' | 'result';

/** 出題モードから問題プールを解決する。 */
function resolvePool(selection: QuizSelectionMode): DailyQuizQuestion[] {
  return selection === 'mixed'
    ? getMixedQuestions()
    : getQuestionsByDifficulty(selection);
}

/** 出題モードの日本語ラベル。 */
function selectionLabel(selection: QuizSelectionMode): string {
  if (selection === 'mixed') return MIXED_SELECTION_META.label;
  return QUIZ_DIFFICULTIES.find((d) => d.id === selection)?.label ?? '';
}

interface HomeQuizProps {
  /** テスト用に出題の乱数シードを固定する(未指定なら開始ごとに変わる)。 */
  seedOverride?: string;
}

export default function HomeQuiz({ seedOverride }: HomeQuizProps) {
  const [phase, setPhase] = useState<Phase>('config');
  const [selection, setSelection] = useState<QuizSelectionMode | null>(null);
  const [count, setCount] = useState<number>(10);

  // 出題中の問題セットと解答状況(開始時に確定)。
  const [questions, setQuestions] = useState<DailyQuizQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [reviewing, setReviewing] = useState(false);

  // 選択中の難易度に応じた出題数の選択肢(10の倍数)。
  // 未選択時は最大プール(おまかせ=60)を基準にプレビュー表示する。
  const countOptions = useMemo(() => {
    const poolSize = selection ? resolvePool(selection).length : getMixedQuestions().length;
    return practiceCountOptions(poolSize);
  }, [selection]);

  // --- 難易度選択(出題数が新プールを超える場合はクランプ) ---
  const handleSelectDifficulty = useCallback((id: QuizSelectionMode) => {
    setSelection(id);
    const opts = practiceCountOptions(resolvePool(id).length);
    setCount((prev) => (opts.includes(prev) ? prev : (opts[opts.length - 1] ?? 10)));
  }, []);

  // --- 開始 ---
  const handleStart = useCallback(() => {
    if (!selection) return;
    const pool = resolvePool(selection);
    const seed = seedOverride ?? `${Date.now()}-${selection}-${count}`;
    const picked = pickPracticeQuestions(pool, count, seededRandom(seed));
    if (picked.length === 0) return;
    setQuestions(picked);
    setAnswers(new Array(picked.length).fill(null));
    setCurrent(0);
    setPhase('play');
  }, [selection, count, seedOverride]);

  // --- 回答 ---
  const currentAnswer = answers[current] ?? null;
  const answered = currentAnswer !== null;
  const score = answers.filter(
    (a, i) => a !== null && questions[i] && a === questions[i].correctIndex,
  ).length;

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      if (currentAnswer !== null) return;
      setAnswers((prev) => {
        const next = [...prev];
        next[current] = optionIndex;
        return next;
      });
    },
    [current, currentAnswer],
  );

  const handleNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      setPhase('result');
    } else {
      setCurrent((c) => c + 1);
    }
  }, [current, questions.length]);

  // --- もう一度(同じ設定で出題し直す) ---
  const handleRetry = useCallback(() => {
    setReviewing(false);
    if (!selection) return;
    const pool = resolvePool(selection);
    const seed = seedOverride ?? `${Date.now()}-${selection}-${count}-retry`;
    const picked = pickPracticeQuestions(pool, count, seededRandom(seed));
    if (picked.length === 0) return;
    setQuestions(picked);
    setAnswers(new Array(picked.length).fill(null));
    setCurrent(0);
    setPhase('play');
  }, [selection, count, seedOverride]);

  // --- 設定に戻る ---
  const handleReconfigure = useCallback(() => {
    setReviewing(false);
    setPhase('config');
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
  }, []);

  // =====================================================================
  // 設定画面
  // =====================================================================
  if (phase === 'config') {
    const difficultyChoices: { id: QuizSelectionMode; label: string; hint: string }[] = [
      ...QUIZ_DIFFICULTIES.map((d) => ({ id: d.id, label: d.label, hint: d.hint })),
      { id: 'mixed', label: MIXED_SELECTION_META.label, hint: MIXED_SELECTION_META.hint },
    ];

    return (
      <section
        className="animate-fade-in-up mb-6 rounded-2xl border border-sky-200 dark:border-sky-800 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/50 dark:to-cyan-950/50 p-5"
        aria-labelledby="home-quiz-heading"
      >
        <h2
          id="home-quiz-heading"
          className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1"
        >
          練習クイズ
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          難易度と出題数を選んで、その場で挑戦しよう。何度でも解けます。
        </p>

        {/* 難易度 */}
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          難易度
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4" role="group" aria-label="難易度を選ぶ">
          {difficultyChoices.map((d) => {
            const active = selection === d.id;
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={active}
                onClick={() => handleSelectDifficulty(d.id)}
                className={`px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 cursor-pointer active:scale-[0.98] ${
                  active
                    ? 'border-sky-500 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-sky-300 dark:hover:border-sky-700'
                }`}
              >
                {d.label}
                <span className="block text-[10px] font-medium text-gray-400 dark:text-gray-500 mt-0.5">
                  {d.hint}
                </span>
              </button>
            );
          })}
        </div>

        {/* 出題数(10の倍数) — 難易度選択後に、そのプールに応じた選択肢だけ表示 */}
        {selection && (
        <>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          出題数
        </p>
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="出題数を選ぶ">
          {countOptions.map((opt) => {
            const active = opt === count;
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={active}
                aria-label={`出題数 ${opt} 問`}
                onClick={() => setCount(opt)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 cursor-pointer active:scale-[0.98] ${
                  active
                    ? 'border-sky-500 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-sky-300 dark:hover:border-sky-700'
                }`}
              >
                {opt}問
              </button>
            );
          })}
        </div>
        </>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={!selection}
          className={`w-full px-6 py-3 rounded-xl font-bold text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 ${
            selection
              ? 'bg-sky-600 hover:bg-sky-700 cursor-pointer active:scale-[0.99]'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {selection ? `${selectionLabel(selection)} ${count}問でスタート` : '難易度を選んでください'}
        </button>
      </section>
    );
  }

  // =====================================================================
  // 結果画面
  // =====================================================================
  if (phase === 'result') {
    const total = questions.length;
    const finalScore = answers.filter(
      (a, i) => a !== null && questions[i] && a === questions[i].correctIndex,
    ).length;
    const pct = total > 0 ? Math.round((finalScore / total) * 100) : 0;
    const emoji = pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪';
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
      <section
        className="animate-fade-in-up mb-6 rounded-2xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 p-6"
        aria-labelledby="home-quiz-result-heading"
      >
        <div className="text-center">
          <p className="text-4xl mb-2">{emoji}</p>
          <h2
            id="home-quiz-result-heading"
            className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1"
          >
            練習クイズ完了!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {selection ? selectionLabel(selection) : ''} / {total}問
          </p>
          <div
            role="status"
            aria-live="polite"
            aria-label={`スコア ${finalScore} / ${total} (${pct}% 正解)`}
            className="inline-flex items-baseline gap-1 mb-3"
          >
            <span className="text-4xl font-bold text-sky-600 dark:text-sky-400">{finalScore}</span>
            <span className="text-xl text-gray-400">/ {total}</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">{pct}% 正解</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {wrongQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setReviewing(true)}
              aria-label={`間違えた ${wrongQuestions.length} 問をもう一度復習する`}
              className="px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              間違えた {wrongQuestions.length}問をもう一度
            </button>
          )}
          <button
            type="button"
            onClick={handleRetry}
            className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            もう一度
          </button>
          <button
            type="button"
            onClick={handleReconfigure}
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            設定を変える
          </button>
        </div>
      </section>
    );
  }

  // =====================================================================
  // 出題画面
  // =====================================================================
  const q = questions[current];
  if (!q) {
    return (
      <section className="mb-6 rounded-2xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 p-6 text-center text-gray-500 dark:text-gray-400">
        <p>問題を読み込めませんでした。</p>
        <button
          type="button"
          onClick={handleReconfigure}
          className="mt-4 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-semibold"
        >
          設定に戻る
        </button>
      </section>
    );
  }

  const total = questions.length;
  const progressPct = Math.round(((current + (answered ? 1 : 0)) / total) * 100);

  return (
    <section
      className="animate-fade-in-up mb-6 rounded-2xl border border-sky-200 dark:border-sky-800 bg-white dark:bg-gray-800 p-5"
      aria-label="練習クイズ 出題中"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          第 {current + 1} 問 / {total}
        </span>
        <span className="text-sky-600 dark:text-sky-400 font-semibold">正解 {score}</span>
      </div>

      {/* 進捗バー */}
      <div
        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-5 overflow-hidden"
        role="progressbar"
        aria-label="練習クイズの進捗"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPct}
      >
        <div
          className="h-full bg-sky-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 問題文 */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4 mb-4">
        <p className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
          {q.question}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{q.questionJa}</p>
      </div>

      {/* 選択肢 */}
      <div className="grid grid-cols-1 gap-2.5 mb-4">
        {q.options.map((option, index) => {
          let style =
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50 dark:hover:bg-sky-900/30 text-gray-700 dark:text-gray-300';
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
              className={`w-full px-4 py-3 rounded-xl border-2 text-left font-medium transition-all duration-200 ${
                answered ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'
              } focus:outline-none focus:ring-2 focus:ring-sky-300 ${style}`}
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
            className={`text-base font-bold mb-2 ${
              currentAnswer === q.correctIndex
                ? 'text-green-600 dark:text-green-300'
                : 'text-red-600 dark:text-red-300'
            }`}
          >
            {currentAnswer === q.correctIndex ? '🎉 正解!' : '❌ 不正解'}
          </p>
          <div className="rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3.5 mb-4">
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
              className="px-6 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              {current + 1 >= total ? '結果を見る' : '次の問題 →'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
