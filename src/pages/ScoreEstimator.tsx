import { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { fillInBlankSets } from '../data/toeic/fill-in-blank';
import { readingPassages } from '../data/toeic/reading-passages';
import { sections } from '../data/sections';
import ShareButton from '../components/ShareButton';

// --- Types ---

interface ScoreEstimate {
  score: number;
  low: number;
  high: number;
  timestamp: number;
}

interface SkillBreakdown {
  label: string;
  icon: string;
  beginner: number;
  intermediate: number;
  advanced: number;
  level: string;
  avgScore: number;
}

// --- Constants ---

const HISTORY_KEY = 'english-learn-score-history';
const MAX_HISTORY = 10;

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  beginner: { label: '初級', color: 'bg-green-100 text-green-700' },
  intermediate: { label: '中級', color: 'bg-blue-100 text-blue-700' },
  advanced: { label: '上級', color: 'bg-purple-100 text-purple-700' },
  expert: { label: '達人', color: 'bg-amber-100 text-amber-700' },
};

// --- Helpers ---

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getScoreColor(score: number): string {
  if (score >= 800) return '#22c55e';
  if (score >= 600) return '#3b82f6';
  if (score >= 400) return '#f97316';
  return '#ef4444';
}

function getScoreGradient(score: number): string {
  if (score >= 800) return 'from-green-500 to-emerald-600';
  if (score >= 600) return 'from-blue-500 to-indigo-600';
  if (score >= 400) return 'from-orange-400 to-orange-600';
  return 'from-red-400 to-red-600';
}

function getScoreLevel(score: number): string {
  if (score >= 900) return 'エキスパート (900+)';
  if (score >= 800) return '上級 (800-900)';
  if (score >= 600) return '中上級 (600-800)';
  if (score >= 400) return '中級 (400-600)';
  return '初級 (~400)';
}

function getMotivationalMessage(score: number): string {
  if (score >= 900) return 'ネイティブレベルに迫る実力です！この調子を維持しましょう。';
  if (score >= 800) return '上級者の仲間入りです！さらなる高みを目指しましょう。';
  if (score >= 700) return '着実に力がついています！800点台も射程圏内です。';
  if (score >= 600) return '中上級レベルです！弱点を克服して700点を目指しましょう。';
  if (score >= 500) return '基礎力はあります。演習を重ねてステップアップしましょう！';
  if (score >= 400) return '中級レベルです。毎日の学習を続けて実力を伸ばしましょう。';
  return '始めたばかりです。基礎から一歩ずつ進めていきましょう！';
}

function determineSkillLevel(avg: number): string {
  if (avg >= 90) return 'expert';
  if (avg >= 70) return 'advanced';
  if (avg >= 40) return 'intermediate';
  return 'beginner';
}

function loadHistory(): ScoreEstimate[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(history: ScoreEstimate[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-MAX_HISTORY)));
  } catch {
    // silently ignore
  }
}

function getScoresByLevel(
  scores: Record<string, number>,
  sets: { id: string; level: string }[],
  level: string,
): number[] {
  return sets
    .filter((s) => s.level === level)
    .map((s) => scores[s.id])
    .filter((s): s is number => s !== undefined);
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// --- Circular Gauge Component ---

function CircularGauge({ score, size = 200 }: { score: number; size?: number }) {
  const color = getScoreColor(score);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = clamp(score / 990, 0, 1);
  const dashOffset = circumference * (1 - progress * 0.75);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-[135deg]"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl sm:text-5xl font-extrabold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-gray-400 mt-0.5">/ 990</span>
      </div>
    </div>
  );
}

// --- Bar Chart Component ---

function SkillBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-8 text-right shrink-0">{label}</span>
      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clamp(value, 0, 100)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 w-10 text-right shrink-0">
        {value > 0 ? `${Math.round(value)}%` : '-'}
      </span>
    </div>
  );
}

// --- History Chart Component ---

function HistoryChart({ history }: { history: ScoreEstimate[] }) {
  if (history.length < 2) return null;

  const maxScore = Math.max(...history.map((h) => h.high), 600);
  const minScore = Math.min(...history.map((h) => h.low), 200);
  const range = maxScore - minScore || 1;
  const barWidth = Math.min(40, Math.floor(280 / history.length));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">スコア推移</h2>
      <div className="flex items-end justify-center gap-1 h-36">
        {history.map((entry, i) => {
          const height = ((entry.score - minScore) / range) * 100;
          const color = getScoreColor(entry.score);
          const date = new Date(entry.timestamp).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
          });
          return (
            <div
              key={entry.timestamp}
              className="flex flex-col items-center gap-1"
              style={{ width: barWidth }}
            >
              <span className="text-[10px] font-medium text-gray-500">
                {entry.score}
              </span>
              <div
                className="rounded-t-md transition-all duration-500"
                style={{
                  height: `${clamp(height, 8, 100)}%`,
                  width: barWidth - 4,
                  backgroundColor: color,
                  opacity: i === history.length - 1 ? 1 : 0.6,
                }}
              />
              <span className="text-[9px] text-gray-400">{date}</span>
            </div>
          );
        })}
      </div>
      {history.length >= 2 && (() => {
        const latest = history[history.length - 1].score;
        const prev = history[history.length - 2].score;
        const diff = latest - prev;
        if (diff === 0) return null;
        return (
          <div className="mt-3 text-center">
            <span
              className={`text-sm font-bold ${diff > 0 ? 'text-green-600' : 'text-red-500'}`}
            >
              {diff > 0 ? `前回より +${diff}点アップ！` : `前回より ${diff}点ダウン`}
            </span>
          </div>
        );
      })()}
    </div>
  );
}

// --- Main Component ---

export default function ScoreEstimator() {
  const { progress, getOverallStats } = useProgress();
  const [history, setHistory] = useState<ScoreEstimate[]>(loadHistory);

  const stats = getOverallStats();

  // Check if user has any quiz data
  const hasData = useMemo(() => {
    const hasFillIn = Object.keys(progress.fillInBlankScores).length > 0;
    const hasReading = Object.keys(progress.readingScores).length > 0;
    const hasQuiz = Object.values(progress.lessons).some(
      (l) => l.quizScore !== undefined,
    );
    return hasFillIn || hasReading || hasQuiz;
  }, [progress]);

  // Calculate fill-in-blank scores by level
  const fillInBreakdown = useMemo((): SkillBreakdown => {
    const beginnerScores = getScoresByLevel(
      progress.fillInBlankScores,
      fillInBlankSets,
      'beginner',
    );
    const intermediateScores = getScoresByLevel(
      progress.fillInBlankScores,
      fillInBlankSets,
      'intermediate',
    );
    const advancedScores = getScoresByLevel(
      progress.fillInBlankScores,
      fillInBlankSets,
      'advanced',
    );
    const allScores = [...beginnerScores, ...intermediateScores, ...advancedScores];
    const avgScore = avg(allScores);
    return {
      label: 'Part 5 (穴埋め)',
      icon: '\u{1F4DD}',
      beginner: avg(beginnerScores),
      intermediate: avg(intermediateScores),
      advanced: avg(advancedScores),
      level: determineSkillLevel(avgScore),
      avgScore,
    };
  }, [progress.fillInBlankScores]);

  // Calculate reading scores by level
  const readingBreakdown = useMemo((): SkillBreakdown => {
    const beginnerScores = getScoresByLevel(
      progress.readingScores,
      readingPassages,
      'beginner',
    );
    const intermediateScores = getScoresByLevel(
      progress.readingScores,
      readingPassages,
      'intermediate',
    );
    const advancedScores = getScoresByLevel(
      progress.readingScores,
      readingPassages,
      'advanced',
    );
    const allScores = [...beginnerScores, ...intermediateScores, ...advancedScores];
    const avgScore = avg(allScores);
    return {
      label: 'Part 7 (読解)',
      icon: '\u{1F4DA}',
      beginner: avg(beginnerScores),
      intermediate: avg(intermediateScores),
      advanced: avg(advancedScores),
      level: determineSkillLevel(avgScore),
      avgScore,
    };
  }, [progress.readingScores]);

  // Calculate vocabulary progress
  const vocabProgress = useMemo(() => {
    const vocabSection = sections.find((s) => s.id === 'vocabulary');
    if (!vocabSection) return { completed: 0, total: 0, percentage: 0, level: 'beginner' };
    let total = 0;
    let completed = 0;
    for (const cat of vocabSection.categories) {
      for (const lesson of cat.lessons) {
        total += lesson.items.length;
        const lp = progress.lessons[lesson.id];
        if (lp) completed += lp.completedItems.length;
      }
    }
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage, level: determineSkillLevel(percentage) };
  }, [progress.lessons]);

  // Calculate grammar progress
  const grammarProgress = useMemo(() => {
    const grammarSection = sections.find((s) => s.id === 'grammar');
    if (!grammarSection) return { completed: 0, total: 0, percentage: 0, level: 'beginner' };
    let total = 0;
    let completed = 0;
    for (const cat of grammarSection.categories) {
      for (const lesson of cat.lessons) {
        total += lesson.items.length;
        const lp = progress.lessons[lesson.id];
        if (lp) completed += lp.completedItems.length;
      }
    }
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage, level: determineSkillLevel(percentage) };
  }, [progress.lessons]);

  // Calculate estimated TOEIC score
  const estimate = useMemo((): ScoreEstimate => {
    let score = 200; // TOEIC minimum base

    // Fill-in-blank contribution
    const fibBegAvg = fillInBreakdown.beginner;
    const fibIntAvg = fillInBreakdown.intermediate;
    const fibAdvAvg = fillInBreakdown.advanced;
    score += (fibBegAvg / 100) * 100; // beginner: +0-100
    score += (fibIntAvg / 100) * 150; // intermediate: +0-150
    score += (fibAdvAvg / 100) * 200; // advanced: +0-200

    // Reading contribution
    const readBegAvg = readingBreakdown.beginner;
    const readIntAvg = readingBreakdown.intermediate;
    const readAdvAvg = readingBreakdown.advanced;
    score += (readBegAvg / 100) * 50;  // beginner: +0-50
    score += (readIntAvg / 100) * 100; // intermediate: +0-100
    score += (readAdvAvg / 100) * 150; // advanced: +0-150

    // Completion bonus
    const totalSections = sections.reduce((sum, s) => {
      return sum + s.categories.reduce((cSum, c) => {
        return cSum + c.lessons.reduce((lSum, l) => lSum + l.items.length, 0);
      }, 0);
    }, 0);
    const completionPct = totalSections > 0 ? stats.totalItems / totalSections : 0;
    score += clamp(completionPct, 0, 1) * 100; // +0-100

    score = Math.round(score);
    const low = clamp(score - 50, 10, 990);
    const high = clamp(score + 50, 10, 990);
    score = clamp(score, 10, 990);

    return { score, low, high, timestamp: Date.now() };
  }, [fillInBreakdown, readingBreakdown, stats.totalItems]);

  // Save estimate to history on mount (once per page visit, throttled to 1 per hour)
  useEffect(() => {
    if (!hasData) return;
    const existing = loadHistory();
    const lastEntry = existing[existing.length - 1];
    const oneHour = 60 * 60 * 1000;
    if (lastEntry && Date.now() - lastEntry.timestamp < oneHour) return;
    const updated = [...existing, estimate].slice(-MAX_HISTORY);
    saveHistory(updated);
    setHistory(updated);
  }, [hasData, estimate]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs: { text: string; link: string; linkLabel: string }[] = [];

    if (fillInBreakdown.avgScore < 50 || fillInBreakdown.avgScore === 0) {
      recs.push({
        text: '穴埋め問題のスコアが低いです。文法セクションを復習しましょう。',
        link: '/section/grammar',
        linkLabel: '文法セクションへ',
      });
    }
    if (fillInBreakdown.beginner < 60 && fillInBreakdown.beginner > 0) {
      recs.push({
        text: '基礎的な穴埋め問題の正答率を上げましょう。初級セットから復習してください。',
        link: '/toeic-practice/beginner',
        linkLabel: '初級穴埋めへ',
      });
    }
    if (readingBreakdown.avgScore < 50 || readingBreakdown.avgScore === 0) {
      recs.push({
        text: '読解問題のスコアが低いです。読解練習を重点的に行いましょう。',
        link: '/reading-practice',
        linkLabel: '読解練習へ',
      });
    }
    if (vocabProgress.percentage < 30) {
      recs.push({
        text: '語彙力を強化しましょう。単語セクションで基礎語彙を学びましょう。',
        link: '/section/vocabulary',
        linkLabel: '単語セクションへ',
      });
    }
    if (grammarProgress.percentage < 30) {
      recs.push({
        text: '文法の基礎をしっかり固めましょう。文法セクションに取り組んでください。',
        link: '/section/grammar',
        linkLabel: '文法セクションへ',
      });
    }
    if (fillInBreakdown.advanced < 50 && fillInBreakdown.intermediate >= 60) {
      recs.push({
        text: '上級レベルの穴埋め問題に挑戦して、高得点を目指しましょう。',
        link: '/toeic-practice/advanced',
        linkLabel: '上級穴埋めへ',
      });
    }
    if (readingBreakdown.advanced < 50 && readingBreakdown.intermediate >= 60) {
      recs.push({
        text: '上級の読解問題に挑戦しましょう。長文読解力が得点アップの鍵です。',
        link: '/reading-practice/reading-advanced-double',
        linkLabel: '上級読解へ',
      });
    }

    if (recs.length === 0 && hasData) {
      recs.push({
        text: '全体的にバランスよく学習できています。引き続き頑張りましょう！',
        link: '/',
        linkLabel: 'ホームへ',
      });
    }

    return recs;
  }, [fillInBreakdown, readingBreakdown, vocabProgress, grammarProgress, hasData]);

  // --- "Not Enough Data" State ---
  if (!hasData) {
    return (
      <div className="pb-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            TOEIC スコア予測
          </h1>
          <p className="mt-1 text-gray-500">TOEIC Score Estimator</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            まだデータがありません
          </h2>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            スコアを予測するには、クイズや練習問題に取り組む必要があります。<br />
            以下のセクションから始めてみましょう！
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/toeic-practice"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <span>📝</span> 穴埋め問題に挑戦
            </Link>
            <Link
              to="/reading-practice"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <span>📚</span> 読解問題に挑戦
            </Link>
            <Link
              to="/section/vocabulary"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              <span>📖</span> 単語を学ぶ
            </Link>
          </div>
        </div>

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

  // --- Main Render ---
  return (
    <div className="pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          TOEIC スコア予測
        </h1>
        <p className="mt-1 text-gray-500">TOEIC Score Estimator</p>
      </div>

      {/* Score Display */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 mb-6 text-center">
        <div className="flex justify-center mb-4">
          <CircularGauge score={estimate.score} />
        </div>
        <div className="mb-3">
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white bg-gradient-to-r ${getScoreGradient(estimate.score)}`}
          >
            {getScoreLevel(estimate.score)}
          </span>
        </div>
        <p className="text-lg font-bold text-gray-800 mb-1">
          推定スコア: {estimate.low} - {estimate.high}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {getMotivationalMessage(estimate.score)}
        </p>
        <ShareButton
          score={estimate.score}
          text={`English LearnでTOEICスコア予測！推定スコア${estimate.score}点（${getScoreLevel(estimate.score)}）を達成！`}
        />
      </div>

      {/* Breakdown Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">スキル分析</h2>

        {/* Fill-in-blank breakdown */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{fillInBreakdown.icon}</span>
              <span className="font-semibold text-gray-800">{fillInBreakdown.label}</span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${LEVEL_LABELS[fillInBreakdown.level]?.color ?? 'bg-gray-100 text-gray-600'}`}
            >
              {LEVEL_LABELS[fillInBreakdown.level]?.label ?? '未挑戦'}
            </span>
          </div>
          <div className="space-y-2">
            <SkillBar label="初級" value={fillInBreakdown.beginner} color="bg-green-400" />
            <SkillBar label="中級" value={fillInBreakdown.intermediate} color="bg-blue-400" />
            <SkillBar label="上級" value={fillInBreakdown.advanced} color="bg-purple-500" />
          </div>
        </div>

        {/* Reading breakdown */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{readingBreakdown.icon}</span>
              <span className="font-semibold text-gray-800">{readingBreakdown.label}</span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${LEVEL_LABELS[readingBreakdown.level]?.color ?? 'bg-gray-100 text-gray-600'}`}
            >
              {LEVEL_LABELS[readingBreakdown.level]?.label ?? '未挑戦'}
            </span>
          </div>
          <div className="space-y-2">
            <SkillBar label="初級" value={readingBreakdown.beginner} color="bg-green-400" />
            <SkillBar label="中級" value={readingBreakdown.intermediate} color="bg-blue-400" />
            <SkillBar label="上級" value={readingBreakdown.advanced} color="bg-purple-500" />
          </div>
        </div>

        {/* Vocabulary */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <span className="font-semibold text-gray-800">語彙力</span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${LEVEL_LABELS[vocabProgress.level]?.color ?? 'bg-gray-100 text-gray-600'}`}
            >
              {LEVEL_LABELS[vocabProgress.level]?.label ?? '未挑戦'}
            </span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
              style={{ width: `${vocabProgress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {vocabProgress.completed} / {vocabProgress.total} アイテム完了 ({vocabProgress.percentage}%)
          </p>
        </div>

        {/* Grammar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <span className="font-semibold text-gray-800">文法力</span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${LEVEL_LABELS[grammarProgress.level]?.color ?? 'bg-gray-100 text-gray-600'}`}
            >
              {LEVEL_LABELS[grammarProgress.level]?.label ?? '未挑戦'}
            </span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-700"
              style={{ width: `${grammarProgress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {grammarProgress.completed} / {grammarProgress.total} アイテム完了 ({grammarProgress.percentage}%)
          </p>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            おすすめの学習
          </h2>
          <ul className="space-y-3">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 bg-white/70 rounded-xl p-3.5"
              >
                <span className="text-indigo-500 mt-0.5 shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{rec.text}</p>
                  <Link
                    to={rec.link}
                    className="inline-block mt-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {rec.linkLabel} &rarr;
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score History */}
      <HistoryChart history={history} />

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
