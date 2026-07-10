import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import DailyChallenge from '../components/DailyChallenge';

export default function DailyChallengePage() {
  const [completedCount, setCompletedCount] = useState(0);
  const handleProgressChange = useCallback((count: number) => setCompletedCount(count), []);
  const allCompleted = completedCount >= 5;

  return (
    <div className="py-6">
      <h1 className="sr-only">今日のチャレンジ</h1>
      <DailyChallenge onProgressChange={handleProgressChange} />

      <div className="mt-6">
        <Link
          to="/drill"
          className={`group flex items-center gap-4 rounded-2xl border p-4 transition-all ${
            allCompleted
              ? 'border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-600 hover:to-purple-700'
              : 'border-gray-200 bg-white text-gray-800 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-indigo-700 dark:hover:bg-gray-700/60'
          }`}
        >
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              allCompleted
                ? 'bg-white/20 text-white'
                : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300'
            }`}
          >
            <Zap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">クイックドリルで続けて鍛える</span>
            <span
              className={`mt-0.5 block text-xs ${
                allCompleted ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {allCompleted
                ? '今日のチャレンジは全部クリア！勢いそのままにドリルへ'
                : '5ジャンル×4難易度の連続出題でさらに実力アップ'}
            </span>
          </span>
          <ArrowRight
            className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
