// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from './useAnalytics';
import type { LearningEvent } from './useAnalytics';

const STORAGE_KEY = 'english-learn-analytics';

// Helper: seed localStorage with a set of events bypassing the hook.
function seedEvents(events: LearningEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Helper: read events stored in localStorage.
function readStoredEvents(): LearningEvent[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as LearningEvent[];
}

// Convenience: offset from now in ms.
const daysAgo = (n: number): number => Date.now() - n * 24 * 60 * 60 * 1000;

describe('useAnalytics', () => {
  describe('logEvent', () => {
    it('persists an event to localStorage with a timestamp', () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.logEvent({
          type: 'lesson_view',
          category: 'vocabulary',
        });
      });

      const stored = readStoredEvents();
      expect(stored).toHaveLength(1);
      expect(stored[0].type).toBe('lesson_view');
      expect(stored[0].category).toBe('vocabulary');
      expect(typeof stored[0].timestamp).toBe('number');
      expect(stored[0].timestamp).toBeGreaterThan(0);
    });

    it('appends subsequent events without overwriting previous ones', () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.logEvent({ type: 'lesson_view' });
      });
      act(() => {
        result.current.logEvent({ type: 'quiz_complete', score: 80 });
      });
      act(() => {
        result.current.logEvent({ type: 'flashcard_complete', score: 90 });
      });

      const stored = readStoredEvents();
      expect(stored).toHaveLength(3);
      expect(stored.map((e) => e.type)).toEqual([
        'lesson_view',
        'quiz_complete',
        'flashcard_complete',
      ]);
    });

    it('persists optional score and duration fields', () => {
      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.logEvent({
          type: 'dictation_complete',
          score: 75,
          duration: 300,
          category: 'listening',
        });
      });

      const stored = readStoredEvents();
      expect(stored[0].score).toBe(75);
      expect(stored[0].duration).toBe(300);
      expect(stored[0].category).toBe('listening');
    });

    it('picks up events already in localStorage from a prior session', () => {
      // Seed one event before the hook mounts.
      seedEvents([
        { type: 'lesson_view', timestamp: daysAgo(1) },
      ]);

      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.logEvent({ type: 'quiz_complete', score: 60 });
      });

      const stored = readStoredEvents();
      expect(stored).toHaveLength(2);
      expect(stored[0].type).toBe('lesson_view');
      expect(stored[1].type).toBe('quiz_complete');
    });

    it('prunes events older than 90 days on logEvent', () => {
      // One event within range, one 91 days old (should be pruned).
      seedEvents([
        { type: 'lesson_view', timestamp: daysAgo(30) },
        { type: 'quiz_complete', timestamp: daysAgo(91), score: 50 },
      ]);

      const { result } = renderHook(() => useAnalytics());

      act(() => {
        result.current.logEvent({ type: 'flashcard_complete' });
      });

      const stored = readStoredEvents();
      // Only the recent event + the new one should survive; the 91-day-old is pruned.
      expect(stored).toHaveLength(2);
      expect(stored.some((e) => e.type === 'quiz_complete')).toBe(false);
    });
  });

  describe('getEventsForPeriod', () => {
    it('returns only events within the requested day window', () => {
      seedEvents([
        { type: 'lesson_view', timestamp: daysAgo(1) },
        { type: 'quiz_complete', timestamp: daysAgo(6), score: 80 },
        { type: 'flashcard_complete', timestamp: daysAgo(8) },
      ]);

      const { result } = renderHook(() => useAnalytics());

      let events: LearningEvent[] = [];
      act(() => {
        events = result.current.getEventsForPeriod(7);
      });

      expect(events).toHaveLength(2);
      expect(events.every((e) => ['lesson_view', 'quiz_complete'].includes(e.type))).toBe(true);
    });

    it('returns an empty array when no events exist', () => {
      const { result } = renderHook(() => useAnalytics());

      let events: LearningEvent[] = [];
      act(() => {
        events = result.current.getEventsForPeriod(30);
      });

      expect(events).toHaveLength(0);
    });

    it('returns all events when the window exceeds all event ages', () => {
      seedEvents([
        { type: 'lesson_view', timestamp: daysAgo(85) },
        { type: 'quiz_complete', timestamp: daysAgo(1), score: 70 },
      ]);

      const { result } = renderHook(() => useAnalytics());

      let events: LearningEvent[] = [];
      act(() => {
        events = result.current.getEventsForPeriod(90);
      });

      expect(events).toHaveLength(2);
    });
  });

  describe('getStats', () => {
    it('returns zero-value stats when no events are present', () => {
      const { result } = renderHook(() => useAnalytics());

      let stats: ReturnType<typeof result.current.getStats>;
      act(() => {
        stats = result.current.getStats(30);
      });

      expect(stats!.totalSessions).toBe(0);
      expect(stats!.totalTime).toBe(0);
      expect(stats!.avgScore).toBe(0);
      expect(stats!.activeDays).toBe(0);
      expect(stats!.byType).toEqual({});
    });

    it('computes totalSessions as the count of events in the period', () => {
      seedEvents([
        { type: 'lesson_view', timestamp: daysAgo(1) },
        { type: 'quiz_complete', timestamp: daysAgo(2), score: 80 },
        { type: 'flashcard_complete', timestamp: daysAgo(40) }, // outside 30-day window
      ]);

      const { result } = renderHook(() => useAnalytics());

      let stats: ReturnType<typeof result.current.getStats>;
      act(() => {
        stats = result.current.getStats(30);
      });

      expect(stats!.totalSessions).toBe(2);
    });

    it('computes totalTime as the sum of all duration fields', () => {
      seedEvents([
        { type: 'lesson_view', timestamp: daysAgo(1), duration: 120 },
        { type: 'quiz_complete', timestamp: daysAgo(2), score: 80, duration: 180 },
        { type: 'flashcard_complete', timestamp: daysAgo(3) }, // no duration -> 0
      ]);

      const { result } = renderHook(() => useAnalytics());

      let stats: ReturnType<typeof result.current.getStats>;
      act(() => {
        stats = result.current.getStats(30);
      });

      expect(stats!.totalTime).toBe(300);
    });

    it('computes avgScore as the rounded average of events that have a score', () => {
      seedEvents([
        { type: 'quiz_complete', timestamp: daysAgo(1), score: 70 },
        { type: 'quiz_complete', timestamp: daysAgo(2), score: 90 },
        { type: 'lesson_view', timestamp: daysAgo(3) }, // no score — excluded from avg
      ]);

      const { result } = renderHook(() => useAnalytics());

      let stats: ReturnType<typeof result.current.getStats>;
      act(() => {
        stats = result.current.getStats(30);
      });

      // (70 + 90) / 2 = 80
      expect(stats!.avgScore).toBe(80);
    });

    it('rounds avgScore correctly (Math.round)', () => {
      // (70 + 71) / 2 = 70.5 -> rounds to 71
      seedEvents([
        { type: 'quiz_complete', timestamp: daysAgo(1), score: 70 },
        { type: 'quiz_complete', timestamp: daysAgo(2), score: 71 },
      ]);

      const { result } = renderHook(() => useAnalytics());

      let stats: ReturnType<typeof result.current.getStats>;
      act(() => {
        stats = result.current.getStats(30);
      });

      expect(stats!.avgScore).toBe(71);
    });

    it('counts activeDays as the number of distinct calendar days', () => {
      // Pin fake timers so we control "today".
      vi.useFakeTimers();
      const baseDate = new Date('2026-06-20T12:00:00Z').getTime();
      vi.setSystemTime(baseDate);

      const oneDayMs = 24 * 60 * 60 * 1000;
      seedEvents([
        { type: 'lesson_view', timestamp: baseDate - 0 },          // day 0
        { type: 'quiz_complete', timestamp: baseDate - 1000 },     // same day 0
        { type: 'flashcard_complete', timestamp: baseDate - oneDayMs }, // day 1
        { type: 'dictation_complete', timestamp: baseDate - 2 * oneDayMs }, // day 2
      ]);

      const { result } = renderHook(() => useAnalytics());

      let stats: ReturnType<typeof result.current.getStats>;
      act(() => {
        stats = result.current.getStats(30);
      });

      // 3 distinct days even though 4 events.
      expect(stats!.activeDays).toBe(3);

      vi.useRealTimers();
    });

    it('builds byType counts correctly', () => {
      seedEvents([
        { type: 'lesson_view', timestamp: daysAgo(1) },
        { type: 'lesson_view', timestamp: daysAgo(2) },
        { type: 'quiz_complete', timestamp: daysAgo(3), score: 80 },
        { type: 'flashcard_complete', timestamp: daysAgo(4) },
        { type: 'flashcard_complete', timestamp: daysAgo(5) },
        { type: 'flashcard_complete', timestamp: daysAgo(6) },
      ]);

      const { result } = renderHook(() => useAnalytics());

      let stats: ReturnType<typeof result.current.getStats>;
      act(() => {
        stats = result.current.getStats(30);
      });

      expect(stats!.byType).toEqual({
        lesson_view: 2,
        quiz_complete: 1,
        flashcard_complete: 3,
      });
    });
  });

  describe('getWeeklyComparison', () => {
    it('returns improvement=100 when lastWeek has no scores but thisWeek does', () => {
      vi.useFakeTimers();
      const now = new Date('2026-06-20T12:00:00Z').getTime();
      vi.setSystemTime(now);

      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

      seedEvents([
        // This week: has score
        { type: 'quiz_complete', timestamp: now - oneWeekMs / 2, score: 85 },
        // Last week: no score events (lesson_view without score)
        { type: 'lesson_view', timestamp: now - oneWeekMs - 1000 },
      ]);

      const { result } = renderHook(() => useAnalytics());

      let comparison: ReturnType<typeof result.current.getWeeklyComparison>;
      act(() => {
        comparison = result.current.getWeeklyComparison();
      });

      expect(comparison!.improvement).toBe(100);
      expect(comparison!.thisWeek.avgScore).toBe(85);
      expect(comparison!.lastWeek.avgScore).toBe(0);

      vi.useRealTimers();
    });

    it('computes improvement as a rounded percentage change', () => {
      vi.useFakeTimers();
      const now = new Date('2026-06-20T12:00:00Z').getTime();
      vi.setSystemTime(now);

      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

      seedEvents([
        // This week: avg 90
        { type: 'quiz_complete', timestamp: now - oneWeekMs / 2, score: 90 },
        // Last week: avg 60
        { type: 'quiz_complete', timestamp: now - oneWeekMs - 1000, score: 60 },
      ]);

      const { result } = renderHook(() => useAnalytics());

      let comparison: ReturnType<typeof result.current.getWeeklyComparison>;
      act(() => {
        comparison = result.current.getWeeklyComparison();
      });

      // ((90 - 60) / 60) * 100 = 50
      expect(comparison!.improvement).toBe(50);
      expect(comparison!.thisWeek.totalSessions).toBe(1);
      expect(comparison!.lastWeek.totalSessions).toBe(1);

      vi.useRealTimers();
    });

    it('returns improvement=0 when both weeks have no scores', () => {
      const { result } = renderHook(() => useAnalytics());

      let comparison: ReturnType<typeof result.current.getWeeklyComparison>;
      act(() => {
        comparison = result.current.getWeeklyComparison();
      });

      expect(comparison!.improvement).toBe(0);
      expect(comparison!.thisWeek.totalSessions).toBe(0);
      expect(comparison!.lastWeek.totalSessions).toBe(0);
    });

    it('correctly separates this-week events from last-week events', () => {
      vi.useFakeTimers();
      const now = new Date('2026-06-20T12:00:00Z').getTime();
      vi.setSystemTime(now);

      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

      seedEvents([
        // This week: 2 sessions
        { type: 'lesson_view', timestamp: now - 1000 },
        { type: 'flashcard_complete', timestamp: now - 2 * 24 * 60 * 60 * 1000 },
        // Last week: 1 session
        { type: 'quiz_complete', timestamp: now - oneWeekMs - 60_000, score: 70 },
        // Older than 2 weeks: not in either bucket
        { type: 'dictation_complete', timestamp: now - 3 * oneWeekMs },
      ]);

      const { result } = renderHook(() => useAnalytics());

      let comparison: ReturnType<typeof result.current.getWeeklyComparison>;
      act(() => {
        comparison = result.current.getWeeklyComparison();
      });

      expect(comparison!.thisWeek.totalSessions).toBe(2);
      expect(comparison!.lastWeek.totalSessions).toBe(1);
      expect(comparison!.lastWeek.byType).toEqual({ quiz_complete: 1 });

      vi.useRealTimers();
    });
  });
});
