import { describe, it, expect } from 'vitest';
import { buildReportData, formatMinutes } from './weeklyReportData';
import type { StudySession } from '../hooks/useStudyTimer';
import type { LearningEvent } from '../hooks/useAnalytics';

// Fixed week ranges (local time). Current week: Mon 2024-01-08 .. Sun 2024-01-14.
// Previous week: Mon 2024-01-01 .. Sun 2024-01-07.
const range = {
  start: new Date(2024, 0, 8, 0, 0, 0, 0),
  end: new Date(2024, 0, 14, 0, 0, 0, 0),
  days: 7,
};
const prevRange = {
  start: new Date(2024, 0, 1, 0, 0, 0, 0),
  end: new Date(2024, 0, 7, 0, 0, 0, 0),
};

function session(date: string, startTime: number, durationSec: number): StudySession {
  return { date, startTime, duration: durationSec } as StudySession;
}

function event(timestamp: number, type: LearningEvent['type'], score?: number): LearningEvent {
  return { type, timestamp, score } as LearningEvent;
}

describe('formatMinutes', () => {
  it('formats sub-hour, exact-hour and hour+minute', () => {
    expect(formatMinutes(45)).toBe('45分');
    expect(formatMinutes(60)).toBe('1時間');
    expect(formatMinutes(125)).toBe('2時間5分');
  });
});

describe('buildReportData', () => {
  it('computes totals, active days, avg score and previous-period deltas', () => {
    // Current week sessions (Mon 2024-01-08, Tue 2024-01-09).
    const mon = new Date(2024, 0, 8, 9, 0, 0, 0).getTime(); // 1800s -> 30min
    const tue = new Date(2024, 0, 9, 9, 0, 0, 0).getTime(); // 900s  -> 15min
    const sessions90 = [
      session('2024-01-08', mon, 1800),
      session('2024-01-09', tue, 900),
    ];

    // Previous week sessions (only Mon 2024-01-01) for delta comparison.
    const prevMon = new Date(2024, 0, 1, 9, 0, 0, 0).getTime(); // 1200s -> 20min
    const sessions180 = [
      ...sessions90,
      session('2024-01-01', prevMon, 1200),
    ];

    // Events: 2 in current week (one quiz score 80, one lesson_view),
    // 1 in previous week (quiz score 60).
    const allEvents = [
      event(new Date(2024, 0, 8, 10, 0, 0, 0).getTime(), 'quiz_complete', 80),
      event(new Date(2024, 0, 9, 10, 0, 0, 0).getTime(), 'lesson_view'),
      event(new Date(2024, 0, 2, 10, 0, 0, 0).getTime(), 'quiz_complete', 60),
    ];

    const result = buildReportData({
      sessions90,
      sessions180,
      allEvents,
      streak: { current: 3, longest: 7 },
      range,
      prevRange,
      period: 'this-week',
    });

    // Totals: 30 + 15 = 45 minutes this week; 20 minutes previous.
    expect(result.totalMinutes).toBe(45);
    expect(result.prevTotalMinutes).toBe(20);

    // Active days: 2 distinct dates this week; 1 previous.
    expect(result.activeDays).toBe(2);
    expect(result.prevActiveDays).toBe(1);

    // Completed items: 2 events this week; 1 previous.
    expect(result.completedItems).toBe(2);
    expect(result.prevCompletedItems).toBe(1);

    // Avg score: only the scored quiz (80) counts this week; 60 previous.
    expect(result.avgScore).toBe(80);
    expect(result.prevAvgScore).toBe(60);

    // Daily data: 7 days, Mon=30, Tue=15, rest 0.
    expect(result.dailyData).toHaveLength(7);
    expect(result.dailyData[0]).toEqual({ date: '2024-01-08', minutes: 30, dayLabel: '月' });
    expect(result.dailyData[1]).toEqual({ date: '2024-01-09', minutes: 15, dayLabel: '火' });
    expect(result.dailyData[2].minutes).toBe(0);

    // Streak passes through.
    expect(result.streak).toEqual({ current: 3, longest: 7 });

    // Goals: 45min -> "2時間" goal; activeDays<5 adds a day-count goal;
    // avgScore 80 is not <80 so no score goal; completedItems 2<5 adds a goal.
    expect(result.goals).toContain('来週は合計2時間の学習を目指しましょう');
    expect(result.goals).toContain('毎日少しずつ学習して、4日以上の学習日数を目指しましょう');
    expect(result.goals).toContain('レッスンやクイズにもっと取り組んでみましょう');
    expect(result.goals).not.toContain('復習を重ねて平均スコア80%以上を目指しましょう');
  });

  it('windows sessions/events strictly to the range (excludes out-of-range)', () => {
    // A session before the week start and after the end-of-week boundary.
    const beforeStart = new Date(2024, 0, 7, 23, 0, 0, 0).getTime();
    const afterEnd = new Date(2024, 0, 15, 1, 0, 0, 0).getTime();
    const inRange = new Date(2024, 0, 10, 9, 0, 0, 0).getTime();

    const sessions90 = [
      session('2024-01-07', beforeStart, 600),
      session('2024-01-15', afterEnd, 600),
      session('2024-01-10', inRange, 600), // 10min
    ];

    const result = buildReportData({
      sessions90,
      sessions180: [],
      allEvents: [],
      streak: { current: 0, longest: 0 },
      range,
      prevRange,
      period: 'this-week',
    });

    expect(result.totalMinutes).toBe(10);
    expect(result.activeDays).toBe(1);
    expect(result.completedItems).toBe(0);
    expect(result.avgScore).toBe(0);
  });

  it('builds monthly daily data with numeric day labels', () => {
    const monthRange = {
      start: new Date(2024, 1, 1, 0, 0, 0, 0), // Feb 2024 (leap year, 29 days)
      end: new Date(2024, 1, 29, 0, 0, 0, 0),
      days: 29,
    };
    const monthPrev = {
      start: new Date(2024, 0, 1, 0, 0, 0, 0),
      end: new Date(2024, 0, 31, 0, 0, 0, 0),
    };

    const result = buildReportData({
      sessions90: [],
      sessions180: [],
      allEvents: [],
      streak: { current: 0, longest: 0 },
      range: monthRange,
      prevRange: monthPrev,
      period: 'this-month',
    });

    expect(result.dailyData).toHaveLength(29);
    expect(result.dailyData[0]).toEqual({ date: '2024-02-01', minutes: 0, dayLabel: '1' });
    expect(result.dailyData[28]).toEqual({ date: '2024-02-29', minutes: 0, dayLabel: '29' });
  });
});
