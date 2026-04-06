import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { sections } from '../data/sections';
import { useEffect, useMemo } from 'react';
import ShareButton from '../components/ShareButton';

function getMotivationalMessage(percentage: number): string {
  if (percentage === 0) return '今日から始めよう！最初の一歩を踏み出そう。';
  if (percentage < 10) return 'いいスタート！この調子で続けよう！';
  if (percentage < 30) return '順調に進んでいます！Keep going!';
  if (percentage < 50) return '素晴らしい進歩！半分まであと少し！';
  if (percentage < 70) return 'もう半分以上クリア！Great job!';
  if (percentage < 90) return 'ゴールが見えてきた！You are almost there!';
  return '完璧に近い！Amazing work!';
}

function countAllItems(): {
  total: number;
  bySection: Record<string, { name: string; total: number }>;
} {
  let total = 0;
  const bySection: Record<string, { name: string; total: number }> = {};
  for (const section of sections) {
    let sectionTotal = 0;
    for (const category of section.categories) {
      for (const lesson of category.lessons) {
        sectionTotal += lesson.items.length;
      }
    }
    total += sectionTotal;
    bySection[section.id] = { name: section.titleJa, total: sectionTotal };
  }
  return { total, bySection };
}

export default function ProgressPage() {
  const { progress, getOverallStats, updateStreak } = useProgress();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const stats = getOverallStats();
  const { total: totalAvailable, bySection } = useMemo(() => countAllItems(), []);

  const completionPercentage =
    totalAvailable > 0
      ? Math.round((stats.totalItems / totalAvailable) * 100)
      : 0;

  const flashcardCompletions = Object.values(progress.lessons).filter(
    (l) => l.flashcardCompleted,
  ).length;

  const recentLessons = useMemo(() => {
    return Object.values(progress.lessons)
      .sort((a, b) => b.lastAccessed - a.lastAccessed)
      .slice(0, 5);
  }, [progress.lessons]);

  // Per-section completed items
  const sectionProgress = useMemo(() => {
    const result: Record<string, number> = {};
    for (const section of sections) {
      let completed = 0;
      for (const category of section.categories) {
        for (const lesson of category.lessons) {
          const lp = progress.lessons[lesson.id];
          if (lp) completed += lp.completedItems.length;
        }
      }
      result[section.id] = completed;
    }
    return result;
  }, [progress.lessons]);

  const sectionMeta: Record<string, { icon: string; gradient: string }> = {
    phrases: { icon: '\u{1F4AC}', gradient: 'from-blue-500 to-blue-600' },
    vocabulary: { icon: '\u{1F4DD}', gradient: 'from-emerald-500 to-emerald-600' },
    grammar: { icon: '\u{1F4D0}', gradient: 'from-amber-500 to-amber-600' },
    toeic: { icon: '\u{1F3AF}', gradient: 'from-purple-500 to-purple-600' },
  };

  // Find lesson title from sections data
  function findLessonTitle(lessonId: string): string {
    for (const section of sections) {
      for (const category of section.categories) {
        for (const lesson of category.lessons) {
          if (lesson.id === lessonId) return lesson.titleJa || lesson.title;
        }
      }
    }
    return lessonId;
  }

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-end mb-2">
          <ShareButton
            score={completionPercentage}
            text={`English Learnで英語学習中！全体達成率${completionPercentage}%、${stats.totalItems}アイテム学習済み！`}
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          学習の進捗
        </h1>
        <p className="mt-1 text-gray-500">Your Learning Progress</p>
      </div>

      {/* Streak + Completion Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Streak Card */}
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 text-center">
          <div className="text-4xl mb-2">{progress.streak > 0 ? '\u{1F525}' : '\u{1F4A4}'}</div>
          <div className="text-3xl font-extrabold text-orange-600">
            {progress.streak > 0 ? `${progress.streak}` : '0'}
          </div>
          <div className="text-sm font-medium text-gray-600 mt-1">
            {progress.streak > 0 ? `${progress.streak}日連続` : '今日から始めよう！'}
          </div>
          <div className="text-xs text-gray-400 mt-1">Study Streak</div>
        </div>

        {/* Overall Completion Card */}
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 text-center">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="8"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#6366f1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(completionPercentage / 100) * 213.6} 213.6`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-700">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">全体の達成率</div>
          <div className="text-xs text-gray-400 mt-0.5">Overall Completion</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
          <div className="text-xs text-gray-500 mt-1">学習済みアイテム</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {stats.averageScore > 0 ? `${stats.averageScore}%` : '-'}
          </div>
          <div className="text-xs text-gray-500 mt-1">平均スコア</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{flashcardCompletions}</div>
          <div className="text-xs text-gray-500 mt-1">フラッシュカード完了</div>
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">セクション別の進捗</h2>
        <div className="space-y-4">
          {sections.map((section) => {
            const meta = sectionMeta[section.id] ?? {
              icon: section.icon,
              gradient: 'from-gray-500 to-gray-600',
            };
            const sTotal = bySection[section.id]?.total ?? 0;
            const sCompleted = sectionProgress[section.id] ?? 0;
            const pct = sTotal > 0 ? Math.round((sCompleted / sTotal) * 100) : 0;
            return (
              <div key={section.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br ${meta.gradient} text-sm`}
                    >
                      {meta.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {bySection[section.id]?.name ?? section.titleJa}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {sCompleted}/{sTotal} ({pct}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${meta.gradient} rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {recentLessons.length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">最近のアクティビティ</h2>
          <ul className="space-y-3">
            {recentLessons.map((lp) => {
              const title = findLessonTitle(lp.lessonId);
              const dateStr = new Date(lp.lastAccessed).toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <li
                  key={lp.lessonId}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {lp.completedItems.length} items
                      {lp.quizScore !== undefined && ` / Quiz: ${lp.quizScore}%`}
                      {lp.flashcardCompleted && ' / FC完了'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-3">
                    {dateStr}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Motivational Message */}
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 text-center">
        <p className="text-sm font-medium text-indigo-700">
          {getMotivationalMessage(completionPercentage)}
        </p>
      </div>

      {/* Back link */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>
    </div>
  );
}
