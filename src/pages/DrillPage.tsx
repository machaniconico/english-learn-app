import { Link } from 'react-router-dom';
import DrillMode from '../components/DrillMode';
import { useDrillMistakes } from '../hooks/useDrillMistakes';

/**
 * ドリルモードの薄いページ。
 * 実際の出題ロジックは DrillMode に委譲し、ページ側は見出しと導線だけを持つ。
 */
export default function DrillPage() {
  const { pendingCount } = useDrillMistakes();

  return (
    <div className="pb-10">
      <div className="mb-6">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          &larr; ホーム
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            ドリルモード
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            止めるまで連続出題し、難易度とジャンルをいつでも切り替えながら練習できます。
          </p>
          {pendingCount > 0 && (
            <Link
              to="/drill/review"
              className="mt-3 inline-flex text-sm font-semibold text-amber-600 transition-colors hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300"
            >
              間違い問題を復習 ({pendingCount}) &rarr;
            </Link>
          )}
        </div>
      </div>

      <DrillMode />
    </div>
  );
}
