import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { useWeakPoints } from '../hooks/useWeakPoints';
import { useStudyTimer } from '../hooks/useStudyTimer';
import { buildReviewQueue } from '../utils/reviewQueue';
import DailyReview from '../components/DailyReview';

export default function DailyReviewPage() {
  const { getDueCards, reviewCard } = useSpacedRepetition();
  const { weakPoints, markReviewed } = useWeakPoints();
  const { startTimer, stopTimer } = useStudyTimer();

  // Snapshot the queue once at mount: reviewing an SRS card pushes its next-review
  // date forward, so re-deriving the queue would shrink the session mid-way.
  const [items] = useState(() => buildReviewQueue(getDueCards(), weakPoints));

  useEffect(() => {
    startTimer('review');
    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer]);

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          &larr; ホーム
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">🔁</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">今日の復習</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              復習タイミングの単語と弱点をまとめてチェック
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4" aria-hidden="true">✅</p>
          <p className="text-lg font-bold text-gray-800 mb-2">今日の復習はありません！</p>
          <p className="text-sm text-gray-500 mb-6">
            単語をSRSに追加したり、問題を解くと、復習リストがたまります。
          </p>
          <Link
            to="/srs"
            className="inline-block px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            単語カードを見る
          </Link>
        </div>
      ) : (
        <DailyReview items={items} onReviewSrs={reviewCard} onReviewWeak={markReviewed} />
      )}
    </div>
  );
}
