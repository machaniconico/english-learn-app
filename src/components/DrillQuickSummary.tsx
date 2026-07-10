import { RotateCcw, Settings, Trophy } from 'lucide-react';
import { percentage, scoreBarColor } from '../utils/quizScoreDisplay';
import { DRILL_GENRES, type DrillGenre, type DrillQuestion } from '../utils/drillTypes';

/** クイックセッションで1問回答するたびに記録する結果。サマリー描画に必要な最小限を持つ。 */
export interface DrillAnswerRecord {
  question: DrillQuestion;
  /** 選んだ選択肢。時間切れなど未選択のときは null。 */
  selectedIndex: number | null;
  correct: boolean;
}

interface DrillQuickSummaryProps {
  records: DrillAnswerRecord[];
  /** 同じ設定でもう一度クイックセッションを始める。 */
  onRestart: () => void;
  /** 設定(出題)画面へ戻る。 */
  onBackToSettings: () => void;
}

interface GenreBreakdownItem {
  key: DrillGenre;
  label: string;
  answered: number;
  correct: number;
}

function genreLabel(genre: DrillGenre): string {
  return DRILL_GENRES.find((item) => item.value === genre)?.label ?? genre;
}

export default function DrillQuickSummary({
  records,
  onRestart,
  onBackToSettings,
}: DrillQuickSummaryProps) {
  const total = records.length;
  const correctCount = records.filter((record) => record.correct).length;
  const accuracy = percentage(correctCount, total);
  const wrongRecords = records.filter((record) => !record.correct);

  const breakdown: GenreBreakdownItem[] = DRILL_GENRES.map(({ value }) => {
    const forGenre = records.filter((record) => record.question.genre === value);
    return {
      key: value,
      label: genreLabel(value),
      answered: forGenre.length,
      correct: forGenre.filter((record) => record.correct).length,
    };
  }).filter((item) => item.answered > 0);

  return (
    <section
      className="animate-fade-in-up mx-auto mb-6 w-full max-w-3xl space-y-4"
      aria-labelledby="drill-quick-summary-heading"
    >
      <div className="rounded-2xl border border-sky-200 bg-white p-6 text-center shadow-sm dark:border-sky-800 dark:bg-gray-800">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-md">
          <Trophy className="h-7 w-7 text-white" aria-hidden="true" />
        </div>
        <h2
          id="drill-quick-summary-heading"
          className="text-xl font-bold text-gray-900 dark:text-gray-100"
        >
          クイックセッション結果
        </h2>
        <div
          role="status"
          aria-live="polite"
          aria-label={`${total}問中${correctCount}問正解 ${accuracy}パーセント`}
          className="mt-5 inline-flex items-baseline gap-1"
        >
          <span className="text-5xl font-bold text-sky-600 dark:text-sky-400">{correctCount}</span>
          <span className="text-2xl text-gray-400">/ {total}</span>
        </div>
        <div className="mx-auto mt-4 h-3 w-full max-w-md overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            aria-hidden="true"
            className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(accuracy)}`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">{accuracy}% 正解</p>
      </div>

      {breakdown.length > 0 && (
        <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">ジャンル別の成績</h3>
          <div className="mt-4 space-y-3">
            {breakdown.map((item) => {
              const rate = percentage(item.correct, item.answered);
              return (
                <div
                  key={item.key}
                  aria-label={`${item.label} ${item.answered}問中${item.correct}問正解 ${rate}パーセント`}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {item.label}
                    </p>
                    <p className="shrink-0 text-sm font-bold text-gray-900 dark:text-gray-100">
                      {item.correct} / {item.answered}
                      <span className="ml-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {rate}%
                      </span>
                    </p>
                  </div>
                  <div
                    aria-hidden="true"
                    className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                  >
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all duration-700 dark:bg-sky-400"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {wrongRecords.length > 0 && (
        <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm dark:border-sky-800 dark:bg-gray-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            間違えた問題 ({wrongRecords.length})
          </h3>
          <div className="mt-4 space-y-3">
            {wrongRecords.map((record, index) => (
              <div
                key={`${record.question.id}-${index}`}
                className="rounded-xl border border-red-100 bg-red-50/60 p-3.5 dark:border-red-900/50 dark:bg-red-950/20"
              >
                <span className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                  {genreLabel(record.question.genre)}
                </span>
                <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {record.question.prompt}
                </p>
                <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                  正解:{' '}
                  <span className="font-bold">
                    {record.question.options[record.question.correctIndex]}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
          もう一度
        </button>
        <button
          type="button"
          onClick={onBackToSettings}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-sky-300 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-sky-700 dark:hover:bg-sky-900/30"
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
          設定に戻る
        </button>
      </div>
    </section>
  );
}
