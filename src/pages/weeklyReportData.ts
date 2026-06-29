import type { StudySession } from '../hooks/useStudyTimer';
import type { LearningEvent } from '../hooks/useAnalytics';

export type Period = 'this-week' | 'last-week' | 'this-month' | 'last-month';

const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}時間${m}分` : `${h}時間`;
}

function getDateString(ts: number): string {
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface DailyDatum {
  date: string;
  minutes: number;
  dayLabel: string;
}

export interface ReportData {
  totalMinutes: number;
  prevTotalMinutes: number;
  activeDays: number;
  prevActiveDays: number;
  /** 期間内で学習した日の割合(activeDays / 期間日数, 0-100 の整数)。 */
  consistencyPct: number;
  completedItems: number;
  prevCompletedItems: number;
  avgScore: number;
  prevAvgScore: number;
  dailyData: DailyDatum[];
  achievements: string[];
  streak: { current: number; longest: number };
  goals: string[];
}

export interface BuildReportInput {
  /** Result of getSessions(90) — current-period source window. */
  sessions90: StudySession[];
  /** Result of getSessions(180) — previous-period source window. */
  sessions180: StudySession[];
  /** Result of getEventsForPeriod(90). */
  allEvents: LearningEvent[];
  /** Result of getStreak(). */
  streak: { current: number; longest: number };
  range: { start: Date; end: Date; days: number };
  prevRange: { start: Date; end: Date };
  period: Period;
}

/**
 * Pure computation of the weekly/monthly report. Extracted verbatim from
 * WeeklyReport's reportData useMemo so it can be unit-tested without hooks.
 */
export function buildReportData(input: BuildReportInput): ReportData {
  const { sessions90, sessions180, allEvents, streak, range, prevRange, period } = input;

  const startTs = range.start.getTime();
  const endTs = range.end.getTime() + 24 * 60 * 60 * 1000; // end of day
  const prevStartTs = prevRange.start.getTime();
  const prevEndTs = prevRange.end.getTime() + 24 * 60 * 60 * 1000;

  // Study time
  const sessions = sessions90.filter(
    (s) => s.startTime >= startTs && s.startTime < endTs,
  );
  const prevSessions = sessions180.filter(
    (s) => s.startTime >= prevStartTs && s.startTime < prevEndTs,
  );

  const totalMinutes = sessions.reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
  const prevTotalMinutes = prevSessions.reduce((sum, s) => sum + Math.round(s.duration / 60), 0);

  // Active days (期間内に学習した「異なる日」の数。連続性は問わない)
  const activeDays = new Set(sessions.map((s) => s.date)).size;
  const prevActiveDays = new Set(prevSessions.map((s) => s.date)).size;

  // 学習継続率: 期間日数のうち何割の日に学習したか。
  const consistencyPct =
    range.days > 0 ? Math.round((activeDays / range.days) * 100) : 0;

  // Daily breakdown for chart
  const dailyData: DailyDatum[] = [];
  if (period === 'this-week' || period === 'last-week') {
    for (let i = 0; i < 7; i++) {
      const d = new Date(range.start);
      d.setDate(d.getDate() + i);
      const dateStr = getDateString(d.getTime());
      const dayMinutes = sessions
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
      dailyData.push({
        date: dateStr,
        minutes: dayMinutes,
        dayLabel: DAY_LABELS[i],
      });
    }
  } else {
    // Monthly: group by date
    for (let i = 0; i < range.days; i++) {
      const d = new Date(range.start);
      d.setDate(d.getDate() + i);
      const dateStr = getDateString(d.getTime());
      const dayMinutes = sessions
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
      dailyData.push({
        date: dateStr,
        minutes: dayMinutes,
        dayLabel: `${d.getDate()}`,
      });
    }
  }

  // Analytics stats
  const periodEvents = allEvents.filter(
    (e) => e.timestamp >= startTs && e.timestamp < endTs,
  );
  const prevEvents = allEvents.filter(
    (e) => e.timestamp >= prevStartTs && e.timestamp < prevEndTs,
  );

  const completedItems = periodEvents.length;
  const prevCompletedItems = prevEvents.length;

  const scores = periodEvents.filter((e) => e.score !== undefined).map((e) => e.score!);
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  const prevScores = prevEvents.filter((e) => e.score !== undefined).map((e) => e.score!);
  const prevAvgScore = prevScores.length > 0
    ? Math.round(prevScores.reduce((a, b) => a + b, 0) / prevScores.length)
    : 0;

  // Achievements
  const achievements: string[] = [];
  if (totalMinutes >= 60) achievements.push(`${formatMinutes(totalMinutes)}学習達成`);
  if (activeDays >= 5) achievements.push(`${activeDays}日間学習しました`);
  if (completedItems >= 10) achievements.push(`${completedItems}件のアクティビティを完了`);
  if (avgScore >= 80) achievements.push(`平均スコア${avgScore}%を達成`);
  const quizEvents = periodEvents.filter((e) => e.type === 'quiz_complete');
  if (quizEvents.length >= 5) achievements.push(`${quizEvents.length}回のクイズに挑戦`);
  if (achievements.length === 0 && totalMinutes > 0) {
    achievements.push('学習を開始しました');
  }

  // Suggested goals
  const goals: string[] = [];
  if (totalMinutes < 30) {
    goals.push('来週は合計30分以上の学習を目指しましょう');
  } else if (totalMinutes < 120) {
    goals.push('来週は合計2時間の学習を目指しましょう');
  } else {
    goals.push('この調子を維持しましょう');
  }
  if (activeDays < 5) {
    goals.push(`毎日少しずつ学習して、${activeDays + 2}日以上の学習日数を目指しましょう`);
  }
  if (avgScore > 0 && avgScore < 80) {
    goals.push('復習を重ねて平均スコア80%以上を目指しましょう');
  }
  if (completedItems < 5) {
    goals.push('レッスンやクイズにもっと取り組んでみましょう');
  }

  return {
    totalMinutes,
    prevTotalMinutes,
    activeDays,
    prevActiveDays,
    consistencyPct,
    completedItems,
    prevCompletedItems,
    avgScore,
    prevAvgScore,
    dailyData,
    achievements,
    streak,
    goals,
  };
}
