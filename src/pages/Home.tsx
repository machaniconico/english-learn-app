import { Link } from 'react-router-dom';
import { sectionsMeta } from '../data/sectionsMeta';
import { useProgress } from '../hooks/useProgress';
import { useWeakPoints } from '../hooks/useWeakPoints';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { buildReviewQueue } from '../utils/reviewQueue';
import { useUserLevel } from '../hooks/useUserLevel';
import { useAccuracy } from '../hooks/useAccuracy';
import { useEffect, useState } from 'react';
import {
  MessageCircle,
  PenLine,
  Ruler,
  Target,
  FileText,
  Search,
  Gamepad2,
  Shuffle,
  Headphones,
  Image,
  Mic,
  MessagesSquare,
  Radio,
  PenTool,
  Sparkles,
  Check,
  Dumbbell,
  Flame,
  TrendingUp,
  GraduationCap,
  RotateCcw,
  Medal,
  Keyboard,
  Layers,
  Download,
  ListChecks,
  ArrowRight,
  X,
  Brain,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StreakBanner from '../components/StreakBanner';
import DailyGoalProgress from '../components/DailyGoalProgress';
import { useLastActivity } from '../hooks/useLastActivity';

const sectionMeta: Record<string, { icon: LucideIcon; color: string; gradient: string }> = {
  phrases: {
    icon: MessageCircle,
    color: 'bg-blue-50 border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
  },
  vocabulary: {
    icon: PenLine,
    color: 'bg-emerald-50 border-emerald-200',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  grammar: {
    icon: Ruler,
    color: 'bg-amber-50 border-amber-200',
    gradient: 'from-amber-500 to-amber-600',
  },
  toeic: {
    icon: Target,
    color: 'bg-purple-50 border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
  },
};

/** Total learnable items across all sections (from precomputed metadata). */
const TOTAL_ITEMS = sectionsMeta.reduce((sum, s) => sum + s.itemCount, 0);

/** Map weak point type to a recommended practice path */
function getWeakPointRecommendation(type: string): { label: string; path: string } | null {
  switch (type) {
    case 'fill-in-blank': return { label: '穴埋め問題を練習', path: '/toeic-practice' };
    case 'error-correction': return { label: '誤り訂正を練習', path: '/error-correction' };
    case 'part1': return { label: 'Part1リスニングを練習', path: '/part1-listening' };
    case 'part2': return { label: 'Part2リスニングを練習', path: '/part2-listening' };
    case 'dictation': return { label: 'ディクテーションを練習', path: '/dictation' };
    case 'reorder': return { label: '語順クイズを練習', path: '/reorder' };
    default: return null;
  }
}

export default function Home() {
  const { progress, getOverallStats, updateStreak } = useProgress();
  const { weakPoints } = useWeakPoints();
  const { getDueCards } = useSpacedRepetition();
  const { hasDiagnosed, level: userLevel, levelInfo } = useUserLevel();
  const { getWeakestTypes } = useAccuracy();
  // 最後に開いた学習ページ(US-002)。last があれば『前回の続き』カードを表示する。
  const { last, clear } = useLastActivity();

  // Match the actual review session exactly (same cap + weak-point mastery filter).
  const reviewCount = buildReviewQueue(getDueCards(), weakPoints).length;

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  // Section sizes come from precomputed metadata (sectionsMeta), so the heavy
  // ~321kB content chunk never loads on Home — it is fetched only when the user
  // navigates into a section. A drift-guard test keeps these counts in sync.
  const totalAvailable = TOTAL_ITEMS;

  const stats = getOverallStats();
  const hasProgress = stats.totalItems > 0 || progress.streak > 0;
  const completionPct =
    totalAvailable > 0 ? Math.round((stats.totalItems / totalAvailable) * 100) : 0;

  // Daily challenge status — read once on mount from localStorage via lazy initializer
  const [dailyCompleted] = useState(() => {
    try {
      const d = new Date();
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const raw = localStorage.getItem(`english-learn-daily-challenge-${dateKey}`);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.completed && Array.isArray(data.completed)) {
          return data.completed.filter(Boolean).length;
        }
      }
    } catch { /* ignore */ }
    return 0;
  });

  // デイリー10問クイズの今日の状態(完了したか)を localStorage から一度だけ読む。
  const [dailyQuizFinished] = useState(() => {
    try {
      const d = new Date();
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const raw = localStorage.getItem(`english-learn-daily-quiz-${dateKey}`);
      if (raw) {
        const data = JSON.parse(raw);
        return data?.finished === true;
      }
    } catch { /* ignore */ }
    return false;
  });

  return (
    <div>
      {/* Level Diagnostic CTA or Level Badge */}
      {!hasDiagnosed ? (
        <Link
          to="/level-test"
          className="animate-fade-in-up group mb-6 flex items-center gap-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          style={{ '--stagger': '0ms' } as React.CSSProperties}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
              レベル診断テスト
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              あなたの英語力を測定して、最適なスタート地点を見つけよう
            </p>
          </div>
          <span className="text-sm font-medium text-purple-500 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors shrink-0">
            受ける &rarr;
          </span>
        </Link>
      ) : (
        <div
          className="animate-fade-in-up mb-6 flex items-center gap-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/50 dark:to-indigo-950/50 p-4"
          style={{ '--stagger': '0ms' } as React.CSSProperties}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-${levelInfo.color}-500 to-${levelInfo.color}-600 shadow-sm shrink-0`}>
            <span className="text-lg font-black text-white">{userLevel}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-gray-900 dark:text-gray-100">
              {levelInfo.label} - {levelInfo.labelJa}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              TOEIC {levelInfo.toeicMin}〜{levelInfo.toeicMax} / {levelInfo.description}
            </p>
          </div>
          <Link
            to="/level-test"
            className="text-xs font-medium text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors shrink-0"
          >
            再テスト
          </Link>
        </div>
      )}

      {/* Study Plan CTA — primary feature entry */}
      <Link
        to="/plan"
        className="animate-fade-in-up group mb-6 flex items-center gap-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{ '--stagger': '15ms' } as React.CSSProperties}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm shrink-0">
          <ListChecks className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            今日の学習プラン
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            今日やるべきことを優先順位付きで確認しよう
          </p>
        </div>
        <span className="text-sm font-medium text-emerald-600 group-hover:text-emerald-800 dark:text-emerald-400 dark:group-hover:text-emerald-300 transition-colors shrink-0">
          確認する &rarr;
        </span>
      </Link>

      {/* Recommended Practice based on weak points */}
      {(() => {
        const weakestTypes = getWeakestTypes();
        const recommendations = weakestTypes
          .map(getWeakPointRecommendation)
          .filter((r): r is { label: string; path: string } => r !== null)
          .slice(0, 2);
        if (recommendations.length === 0) return null;
        return (
          <div
            className="animate-fade-in-up mb-6 rounded-2xl border border-sky-200 dark:border-sky-800 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/50 dark:to-cyan-950/50 p-4"
            style={{ '--stagger': '30ms' } as React.CSSProperties}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">苦手分野をトレーニング</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.map((rec) => (
                <Link
                  key={rec.path}
                  to={rec.path}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-sky-200 dark:border-sky-700 text-sm font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
                >
                  {rec.label} &rarr;
                </Link>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Today's Review Card — only when something is due */}
      {reviewCount > 0 && (
        <Link
          to="/review"
          className="animate-fade-in-up group mb-6 flex items-center gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          style={{ '--stagger': '0ms' } as React.CSSProperties}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              今日の復習
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              復習タイミングの単語と弱点 {reviewCount}件
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              {reviewCount}
            </span>
            <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors hidden sm:block">
              復習する &rarr;
            </span>
          </div>
        </Link>
      )}

      {/* Daily Challenge Card */}
      <Link
        to="/daily"
        className="animate-fade-in-up group mb-6 flex items-center gap-4 rounded-2xl border border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{ '--stagger': '0ms' } as React.CSSProperties}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-sm shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">
            今日のチャレンジ
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {dailyCompleted === 5
              ? '全チャレンジ完了！素晴らしい！'
              : dailyCompleted > 0
                ? `${dailyCompleted}/5 完了 - 続きに挑戦しよう！`
                : '5つのミニチャレンジに挑戦しよう！'}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {dailyCompleted === 5 ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
              <Check className="w-4 h-4" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs font-bold">
              {dailyCompleted}/5
            </span>
          )}
          <span className="text-sm font-medium text-orange-500 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors hidden sm:block">
            挑戦する &rarr;
          </span>
        </div>
      </Link>

      {/* Daily Quiz Card — デイリー5タスクとは別の、難易度選択式10問クイズ */}
      <Link
        to="/daily-quiz"
        className="animate-fade-in-up group mb-6 flex items-center gap-4 rounded-2xl border border-violet-200 dark:border-violet-800 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/50 dark:to-fuchsia-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{ '--stagger': '0ms' } as React.CSSProperties}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-sm shrink-0">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
            デイリー10問クイズ
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {dailyQuizFinished
              ? '今日のクイズは完了！別の難易度にも挑戦できます'
              : '難易度を選んで、毎日入れ替わる10問に挑戦しよう！'}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {dailyQuizFinished ? (
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
              <Check className="w-4 h-4" />
            </span>
          ) : (
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-bold">
              10問
            </span>
          )}
          <span className="text-sm font-medium text-violet-500 group-hover:text-violet-700 dark:text-violet-400 transition-colors hidden sm:block">
            挑戦する &rarr;
          </span>
        </div>
      </Link>

      {/* Weak Points Card (only shown if there are weak points) */}
      {weakPoints.length > 0 && (
        <Link
          to="/weak-points"
          className="animate-fade-in-up group mb-6 flex items-center gap-4 rounded-2xl border border-red-200 dark:border-red-800 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          style={{ '--stagger': '60ms' } as React.CSSProperties}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 shadow-sm shrink-0">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
              弱点克服
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {weakPoints.length}件の弱点を復習しよう
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold">
              {weakPoints.length}
            </span>
            <span className="text-sm font-medium text-red-500 group-hover:text-red-700 transition-colors hidden sm:block">
              復習する &rarr;
            </span>
          </div>
        </Link>
      )}

      {/* Progress Summary (only shown if there is progress) */}
      {hasProgress && (
        <Link
          to="/progress"
          className="animate-fade-in-up group mb-6 flex items-center gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          style={{ '--stagger': '120ms' } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {progress.streak > 0 ? (
              <Flame className="w-7 h-7 text-orange-500 shrink-0" />
            ) : (
              <TrendingUp className="w-7 h-7 text-indigo-500 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {progress.streak > 0
                  ? `${progress.streak}日連続学習中！`
                  : '学習を続けよう！'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                達成率 {completionPct}% / {stats.totalItems} アイテム学習済み
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#e0e7ff" strokeWidth="4" className="dark:stroke-indigo-900" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(completionPct / 100) * 125.6} 125.6`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-400">
                {completionPct}%
              </span>
            </div>
            <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors hidden sm:block">
              詳細 &rarr;
            </span>
          </div>
        </Link>
      )}

      {/* Hero Section — M4: text-only hero, no emoji */}
      <section className="animate-fade-in-up text-center py-10 sm:py-16" style={{ '--stagger': '180ms' } as React.CSSProperties}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          英語を楽しく学ぼう
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-indigo-600 dark:text-indigo-400 font-medium">
          Learn English the Fun Way
        </p>
        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          フレーズ・単語・文法・TOEIC対策まで、
          <br className="hidden sm:inline" />
          ステップバイステップで英語力を伸ばそう。
        </p>
      </section>

      {/* 前回の続き: last-activity に学習ページが記録されていれば再開カードを出す(US-002) */}
      {last && (
        <section
          className="animate-fade-in-up mb-6"
          style={{ '--stagger': '0ms' } as React.CSSProperties}
          aria-label="前回の続き"
        >
          <div className="relative flex items-stretch rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800">
            <Link
              to={last.path}
              className="group flex flex-1 items-center gap-4 rounded-2xl p-4 min-w-0 transition-colors hover:bg-indigo-50 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-inset"
              aria-label={`前回の続き: ${last.label} を再開する`}
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">前回の続き</p>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors truncate">
                  {last.label}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  途中から再開しましょう
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors shrink-0" />
            </Link>
            {/* × ボタンで last-activity をクリア(任意機能) */}
            <button
              type="button"
              onClick={clear}
              className="self-start m-2 inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              aria-label="前回の続きを閉じる"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* ストリーク維持バナー: streakAtRisk のときだけ表示、それ以外は null */}
      <StreakBanner />

      {/* 今日のデイリー目標の進捗(US-002): StreakBanner の直後に配置 */}
      <DailyGoalProgress />

      {/* Quick Links — H1: section-specific colors, H2: visual variety */}
      <section className="mb-8 space-y-3">
        {/* TOEIC模試 — featured card (purple, larger) */}
        <Link
          to="/toeic-practice"
          className="animate-fade-in-up group flex items-center gap-4 rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50 p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          style={{ '--stagger': '240ms' } as React.CSSProperties}
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm shrink-0">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
              TOEIC模試
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Part 5形式の空所補充問題で実力チェック
            </p>
          </div>
          <span className="text-sm font-medium text-purple-500 group-hover:text-purple-700 dark:text-purple-400 dark:group-hover:text-purple-300 transition-colors shrink-0">
            挑戦する &rarr;
          </span>
        </Link>

        {/* 誤り訂正 — rose */}
        <Link
          to="/error-correction"
          className="animate-fade-in-up group flex items-center gap-4 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          style={{ '--stagger': '300ms' } as React.CSSProperties}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-sm shrink-0">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-rose-700 dark:group-hover:text-rose-400 transition-colors">
              誤り訂正
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              文中の文法エラーを見つけて訂正する練習
            </p>
          </div>
          <span className="text-sm font-medium text-rose-500 group-hover:text-rose-700 dark:text-rose-400 dark:group-hover:text-rose-300 transition-colors shrink-0">
            挑戦する &rarr;
          </span>
        </Link>

        {/* Listening Practice Section — cyan (already distinct) */}
        <div className="animate-fade-in-up rounded-2xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/50 p-5" style={{ '--stagger': '360ms' } as React.CSSProperties}>
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm shrink-0">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              リスニング練習
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link
              to="/part1-listening"
              className="group flex items-center gap-3 rounded-xl border border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 shrink-0">
                <Image className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  Part 1 写真描写
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  場面を聞いて選ぶ
                </p>
              </div>
              <span className="text-xs text-cyan-500 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 shrink-0">&rarr;</span>
            </Link>
            <Link
              to="/part2-listening"
              className="group flex items-center gap-3 rounded-xl border border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 shrink-0">
                <Mic className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  Part 2 応答問題
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  質問に最適な応答を選ぶ
                </p>
              </div>
              <span className="text-xs text-cyan-500 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 shrink-0">&rarr;</span>
            </Link>
            <Link
              to="/part3-listening"
              className="group flex items-center gap-3 rounded-xl border border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 shrink-0">
                <MessagesSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  Part 3 会話問題
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  会話を聞いて質問に答える
                </p>
              </div>
              <span className="text-xs text-cyan-500 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 shrink-0">&rarr;</span>
            </Link>
            <Link
              to="/part4-listening"
              className="group flex items-center gap-3 rounded-xl border border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 shrink-0">
                <Radio className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  Part 4 説明文問題
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  トークを聞いて質問に答える
                </p>
              </div>
              <span className="text-xs text-cyan-500 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 shrink-0">&rarr;</span>
            </Link>
            <Link
              to="/dictation"
              className="group flex items-center gap-3 rounded-xl border border-white dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 shrink-0">
                <PenTool className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  ディクテーション
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  聞いて書き取る練習
                </p>
              </div>
              <span className="text-xs text-cyan-500 group-hover:text-cyan-700 dark:text-cyan-400 dark:group-hover:text-cyan-300 shrink-0">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* H2: Matching + Reorder in 2-column grid on sm+ */}
        <div className="animate-fade-in-up grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ '--stagger': '420ms' } as React.CSSProperties}>
          {/* マッチングゲーム — teal */}
          <Link
            to="/matching"
            className="group flex items-center gap-4 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-sm shrink-0">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                マッチングゲーム
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                英語と日本語のペアをマッチさせよう
              </p>
            </div>
            <span className="text-sm font-medium text-teal-500 group-hover:text-teal-700 dark:text-teal-400 dark:group-hover:text-teal-300 transition-colors shrink-0">
              遊ぶ &rarr;
            </span>
          </Link>

          {/* 語順クイズ — amber */}
          <Link
            to="/reorder"
            className="group flex items-center gap-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shrink-0">
              <Shuffle className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                語順クイズ
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                英単語を正しい語順に並べ替える練習
              </p>
            </div>
            <span className="text-sm font-medium text-amber-500 group-hover:text-amber-700 dark:text-amber-400 dark:group-hover:text-amber-300 transition-colors shrink-0">
              挑戦する &rarr;
            </span>
          </Link>

          {/* 発音練習 — sky */}
          <Link
            to="/pronunciation"
            className="group flex items-center gap-4 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm shrink-0">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                発音練習
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                フレーズを声に出して発音をチェック
              </p>
            </div>
            <span className="text-sm font-medium text-sky-500 group-hover:text-sky-700 dark:text-sky-400 dark:group-hover:text-sky-300 transition-colors shrink-0">
              話す &rarr;
            </span>
          </Link>

          {/* 達成バッジ — yellow */}
          <Link
            to="/achievements"
            className="group flex items-center gap-4 rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-sm shrink-0">
              <Medal className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-yellow-700 dark:group-hover:text-yellow-400 transition-colors">
                達成バッジ・目標
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                学習の積み重ねと今日の目標をチェック
              </p>
            </div>
            <span className="text-sm font-medium text-yellow-600 group-hover:text-yellow-700 dark:text-yellow-400 dark:group-hover:text-yellow-300 transition-colors shrink-0">
              見る &rarr;
            </span>
          </Link>

          {/* タイピング練習 — slate */}
          <Link
            to="/typing"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 shadow-sm shrink-0">
              <Keyboard className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                タイピング練習
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                日本語を見て英語を正しくタイプ
              </p>
            </div>
            <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300 transition-colors shrink-0">
              入力する &rarr;
            </span>
          </Link>

          {/* カスタム単語帳 — indigo */}
          <Link
            to="/decks"
            className="group flex items-center gap-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shrink-0">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                単語帳
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                自分だけの単語帳を作って学習しよう
              </p>
            </div>
            <span className="text-sm font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors shrink-0">
              作る &rarr;
            </span>
          </Link>

          {/* バックアップ — stone */}
          <Link
            to="/backup"
            className="group flex items-center gap-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-stone-500 to-stone-700 shadow-sm shrink-0">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
                バックアップ
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                学習データを保存・復元する
              </p>
            </div>
            <span className="text-sm font-medium text-stone-500 group-hover:text-stone-700 dark:text-stone-400 dark:group-hover:text-stone-300 transition-colors shrink-0">
              管理する &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Section Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pb-10">
        {sectionsMeta.map((section, sIdx) => {
          const meta = sectionMeta[section.id] ?? {
            icon: MessageCircle,
            color: 'bg-gray-50 border-gray-200',
            gradient: 'from-gray-500 to-gray-600',
          };
          const Icon = meta.icon;

          return (
            <Link
              key={section.id}
              to={`/section/${section.id}`}
              className={`animate-fade-in-up group relative block rounded-2xl border p-6 transition-all duration-200 ${meta.color} dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`}
              style={{ '--stagger': `${480 + sIdx * 60}ms` } as React.CSSProperties}
            >
              {/* Icon badge */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} shadow-sm mb-4`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Titles */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                {section.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{section.titleJa}</p>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.description}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  {`${section.categoryCount} カテゴリ / ${section.lessonCount} レッスン`}
                </span>
                <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 dark:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors">
                  学習する &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
