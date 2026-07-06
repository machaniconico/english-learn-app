import { Link } from 'react-router-dom';
import DrillReview from '../components/DrillReview';

export default function DrillReviewPage() {
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
            間違い問題の復習
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            ドリルで間違えた問題だけを出題。2回連続で正解するとマスターになり、一覧から消えます。
          </p>
        </div>
      </div>

      <DrillReview />
    </div>
  );
}
