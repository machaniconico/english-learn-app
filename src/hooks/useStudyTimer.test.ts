// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStudyTimer } from './useStudyTimer';

const STORAGE_KEY = 'english-learn-study-time';
const INACTIVITY_MS = 30 * 60 * 1000; // 30 minutes

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function seedLocalStorage(data: {
  sessions?: Array<{
    date: string;
    startTime: number;
    endTime: number;
    duration: number;
    activity: string;
  }>;
  currentActivity?: string | null;
  currentStart?: number | null;
  lastInteraction?: number | null;
}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getStoredState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as {
    sessions: Array<{
      date: string;
      startTime: number;
      endTime: number;
      duration: number;
      activity: string;
    }>;
    currentActivity: string | null;
    currentStart: number | null;
    lastInteraction: number | null;
  };
}

// Build a YYYY-MM-DD string for a given Date (mirrors the hook's getDateString)
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useStudyTimer', () => {
  beforeEach(() => {
    // Use fake timers. We advance time manually to drive state changes.
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // setup.ts clears localStorage after each test
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  describe('initial state (no stored data)', () => {
    it('starts with isTracking=false and currentDuration=0', () => {
      const { result } = renderHook(() => useStudyTimer());
      expect(result.current.isTracking).toBe(false);
      expect(result.current.currentDuration).toBe(0);
    });

    it('getStreak returns 0/0 when no sessions exist', () => {
      const { result } = renderHook(() => useStudyTimer());
      expect(result.current.getStreak()).toEqual({ current: 0, longest: 0 });
    });

    it('getTotalTime returns 0 for any window', () => {
      const { result } = renderHook(() => useStudyTimer());
      expect(result.current.getTotalTime(7)).toBe(0);
      expect(result.current.getTotalTime(30)).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // startTimer → advance timers → currentDuration increases
  // -------------------------------------------------------------------------

  describe('startTimer → timer advances → currentDuration', () => {
    it('isTracking becomes true after startTimer', () => {
      const { result } = renderHook(() => useStudyTimer());
      act(() => {
        result.current.startTimer('vocabulary');
      });
      expect(result.current.isTracking).toBe(true);
    });

    it('currentDuration increases as fake timers advance', () => {
      const { result } = renderHook(() => useStudyTimer());

      act(() => {
        result.current.startTimer('vocabulary');
      });

      // Advance 10 seconds — the hook's setInterval fires each second
      act(() => {
        vi.advanceTimersByTime(10_000);
      });

      expect(result.current.currentDuration).toBeGreaterThanOrEqual(10);
    });

    it('currentDuration is 0 when not tracking', () => {
      const { result } = renderHook(() => useStudyTimer());
      act(() => {
        vi.advanceTimersByTime(5_000);
      });
      expect(result.current.currentDuration).toBe(0);
    });

    it('calling startTimer again while already tracking only updates lastInteraction, not currentStart', () => {
      const { result } = renderHook(() => useStudyTimer());

      act(() => {
        result.current.startTimer('reading');
      });

      // Advance 5 seconds
      act(() => {
        vi.advanceTimersByTime(5_000);
      });

      const durationAfterFirst = result.current.currentDuration;
      expect(durationAfterFirst).toBeGreaterThanOrEqual(5);

      // Call startTimer again — should NOT reset the timer
      act(() => {
        result.current.startTimer('listening');
      });

      act(() => {
        vi.advanceTimersByTime(3_000);
      });

      // Duration should keep growing from the original start, not reset to 0
      expect(result.current.currentDuration).toBeGreaterThan(durationAfterFirst);
      expect(result.current.isTracking).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // stopTimer → session persisted to localStorage
  // -------------------------------------------------------------------------

  describe('stopTimer → persists session', () => {
    it('stopTimer after >=1 second stops tracking and saves a session', () => {
      const { result } = renderHook(() => useStudyTimer());

      act(() => {
        result.current.startTimer('grammar');
      });

      act(() => {
        vi.advanceTimersByTime(5_000);
      });

      expect(result.current.currentDuration).toBeGreaterThanOrEqual(5);

      act(() => {
        result.current.stopTimer();
      });

      expect(result.current.isTracking).toBe(false);
      expect(result.current.currentDuration).toBe(0);

      const stored = getStoredState();
      expect(stored).not.toBeNull();
      expect(stored!.sessions).toHaveLength(1);
      expect(stored!.sessions[0].activity).toBe('grammar');
      expect(stored!.sessions[0].duration).toBeGreaterThanOrEqual(5);
      expect(stored!.currentStart).toBeNull();
      expect(stored!.currentActivity).toBeNull();
    });

    it('stopTimer before 1 second elapsed discards the session', () => {
      const { result } = renderHook(() => useStudyTimer());

      act(() => {
        result.current.startTimer('reading');
      });

      // Advance less than 1 second — duration rounds to 0
      act(() => {
        vi.advanceTimersByTime(500);
      });

      act(() => {
        result.current.stopTimer();
      });

      expect(result.current.isTracking).toBe(false);

      const stored = getStoredState();
      // No session should have been recorded
      expect(stored?.sessions ?? []).toHaveLength(0);
    });

    it('getTotalTime accounts for the saved session duration in minutes', () => {
      const { result } = renderHook(() => useStudyTimer());

      act(() => {
        result.current.startTimer('vocabulary');
      });

      // Advance 120 seconds = 2 minutes
      act(() => {
        vi.advanceTimersByTime(120_000);
      });

      expect(result.current.currentDuration).toBeGreaterThanOrEqual(120);

      act(() => {
        result.current.stopTimer();
      });

      expect(result.current.isTracking).toBe(false);

      // 120 seconds = 2 minutes
      expect(result.current.getTotalTime(1)).toBe(2);
    });
  });

  // -------------------------------------------------------------------------
  // Load-reconcile: stale in-progress session from a previous visit
  // -------------------------------------------------------------------------

  describe('load-reconcile of seeded localStorage state', () => {
    it('restores completed sessions from stored data without modifying them', () => {
      const now = Date.now();
      seedLocalStorage({
        sessions: [
          {
            date: '2026-06-19',
            startTime: now - 3_600_000,
            endTime: now - 3_000_000,
            duration: 600,
            activity: 'reading',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());

      expect(result.current.getSessions(30)).toHaveLength(1);
      expect(result.current.getSessions(30)[0].activity).toBe('reading');
      expect(result.current.getSessions(30)[0].duration).toBe(600);
      expect(result.current.isTracking).toBe(false);
    });

    it('reconciles a stale in-progress session (lastInteraction > 30 min ago) into a completed session on load', () => {
      const now = Date.now();
      const staleStart = now - INACTIVITY_MS - 10_000; // started >30min ago
      const staleLastInteraction = now - INACTIVITY_MS - 1_000; // last interaction >30min ago

      seedLocalStorage({
        sessions: [],
        currentActivity: 'listening',
        currentStart: staleStart,
        lastInteraction: staleLastInteraction,
      });

      // Mounting the hook should reconcile the stale session at init time
      const { result } = renderHook(() => useStudyTimer());

      // The stale session should now be a completed session
      expect(result.current.isTracking).toBe(false);
      const sessions = result.current.getSessions(30);
      expect(sessions).toHaveLength(1);
      expect(sessions[0].activity).toBe('listening');
      // Duration = floor((lastInteraction - currentStart) / 1000)
      const expectedDuration = Math.floor((staleLastInteraction - staleStart) / 1000);
      expect(sessions[0].duration).toBe(expectedDuration);
    });

    it('does NOT reconcile an active session (lastInteraction within 30 min) — keeps it tracking', () => {
      const now = Date.now();
      const recentStart = now - 5_000; // started 5 seconds ago
      const recentInteraction = now - 1_000; // last interaction 1 second ago

      seedLocalStorage({
        sessions: [],
        currentActivity: 'writing',
        currentStart: recentStart,
        lastInteraction: recentInteraction,
      });

      const { result } = renderHook(() => useStudyTimer());

      // Should still be tracking since inactivity threshold not reached
      expect(result.current.isTracking).toBe(true);
    });

    it('persists the reconciled state back to localStorage after mount effects run', () => {
      const now = Date.now();
      const staleStart = now - INACTIVITY_MS - 60_000;
      const staleLastInteraction = now - INACTIVITY_MS - 2_000;

      seedLocalStorage({
        sessions: [],
        currentActivity: 'speaking',
        currentStart: staleStart,
        lastInteraction: staleLastInteraction,
      });

      const { result } = renderHook(() => useStudyTimer());

      // Flush useEffect (persistence) by advancing timers
      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current.isTracking).toBe(false);

      const stored = getStoredState();
      expect(stored).not.toBeNull();
      expect(stored!.currentStart).toBeNull();
      expect(stored!.currentActivity).toBeNull();
      expect(stored!.sessions).toHaveLength(1);
      expect(stored!.sessions[0].activity).toBe('speaking');
    });
  });

  // -------------------------------------------------------------------------
  // Streak computation
  // -------------------------------------------------------------------------

  describe('getStreak', () => {
    it('returns streak=1 when there is exactly one session on today', () => {
      const now = Date.now();
      const today = toDateStr(new Date(now));

      seedLocalStorage({
        sessions: [
          {
            date: today,
            startTime: now - 300_000,
            endTime: now - 240_000,
            duration: 300,
            activity: 'reading',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());
      const streak = result.current.getStreak();
      expect(streak.current).toBe(1);
      expect(streak.longest).toBe(1);
    });

    it('returns current=0 when the last session date is neither today nor yesterday', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const dateStr = toDateStr(twoDaysAgo);
      const ts = twoDaysAgo.getTime();

      seedLocalStorage({
        sessions: [
          {
            date: dateStr,
            startTime: ts,
            endTime: ts + 600_000,
            duration: 600,
            activity: 'grammar',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());
      const streak = result.current.getStreak();
      expect(streak.current).toBe(0);
      expect(streak.longest).toBe(1); // historical streak of 1 still exists
    });

    it('returns correct current and longest streak across 3 consecutive days', () => {
      const now = Date.now();
      const sessions = [];
      // Create 3 consecutive days: today, yesterday, day before yesterday
      for (let i = 0; i < 3; i++) {
        const ts = now - i * 24 * 60 * 60 * 1000;
        const d = new Date(ts);
        const dateStr = toDateStr(d);
        sessions.push({
          date: dateStr,
          startTime: ts - 600_000,
          endTime: ts,
          duration: 600,
          activity: 'reading',
        });
      }

      seedLocalStorage({
        sessions,
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());
      const streak = result.current.getStreak();
      expect(streak.current).toBe(3);
      expect(streak.longest).toBe(3);
    });

    it('longest streak includes an older unbroken run even when current streak is shorter', () => {
      const now = Date.now();
      // Build a 4-day streak from 10-7 days ago, then a gap, then today only
      const sessions = [];

      // 4 consecutive days: 10, 9, 8, 7 days ago
      for (let i = 7; i <= 10; i++) {
        const ts = now - i * 24 * 60 * 60 * 1000;
        sessions.push({
          date: toDateStr(new Date(ts)),
          startTime: ts - 300_000,
          endTime: ts,
          duration: 300,
          activity: 'reading',
        });
      }

      // Today only (streak of 1)
      sessions.push({
        date: toDateStr(new Date(now)),
        startTime: now - 300_000,
        endTime: now,
        duration: 300,
        activity: 'writing',
      });

      seedLocalStorage({
        sessions,
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());
      const streak = result.current.getStreak();
      expect(streak.current).toBe(1);
      expect(streak.longest).toBe(4);
    });
  });

  // -------------------------------------------------------------------------
  // Aggregation helpers
  // -------------------------------------------------------------------------

  describe('aggregation helpers', () => {
    it('getWeeklyTotal sums sessions within the current week', () => {
      const now = Date.now();
      const today = toDateStr(new Date(now));

      seedLocalStorage({
        sessions: [
          {
            date: today,
            startTime: now - 600_000,
            endTime: now,
            duration: 600, // 10 minutes
            activity: 'reading',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());
      expect(result.current.getWeeklyTotal()).toBe(10);
    });

    it('getMonthlyTotal sums sessions within the current month', () => {
      const now = Date.now();
      const today = toDateStr(new Date(now));

      seedLocalStorage({
        sessions: [
          {
            date: today,
            startTime: now - 1_200_000,
            endTime: now,
            duration: 1200, // 20 minutes
            activity: 'listening',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());
      expect(result.current.getMonthlyTotal()).toBe(20);
    });

    it('getDailyBreakdown returns an entry for each of the requested days, all zero with no sessions', () => {
      const { result } = renderHook(() => useStudyTimer());
      const breakdown = result.current.getDailyBreakdown(7);
      expect(breakdown).toHaveLength(7);
      for (const entry of breakdown) {
        expect(entry.minutes).toBe(0);
        expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('getDailyBreakdown correctly sums a recorded session into the right date bucket', () => {
      const now = Date.now();
      const today = toDateStr(new Date(now));

      seedLocalStorage({
        sessions: [
          {
            date: today,
            startTime: now - 300_000,
            endTime: now,
            duration: 300, // 5 minutes
            activity: 'writing',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());
      const breakdown = result.current.getDailyBreakdown(7);
      const todayEntry = breakdown.find((e) => e.date === today);
      expect(todayEntry).toBeDefined();
      expect(todayEntry!.minutes).toBe(5);
    });
  });

  // -------------------------------------------------------------------------
  // Multiple sessions accumulate correctly
  // -------------------------------------------------------------------------

  describe('multiple sessions', () => {
    it('accumulates two sessions and getTotalTime sums their durations', () => {
      const { result } = renderHook(() => useStudyTimer());

      // Session 1: 60 seconds
      act(() => {
        result.current.startTimer('reading');
      });
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      act(() => {
        result.current.stopTimer();
      });

      expect(result.current.isTracking).toBe(false);

      // Session 2: 60 seconds
      act(() => {
        result.current.startTimer('vocabulary');
      });
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      act(() => {
        result.current.stopTimer();
      });

      expect(result.current.isTracking).toBe(false);

      // Two sessions of 60 seconds each = 2 minutes total
      expect(result.current.getTotalTime(1)).toBe(2);

      const stored = getStoredState();
      expect(stored!.sessions).toHaveLength(2);
    });

    it('getSessions filters by time window correctly', () => {
      const now = Date.now();
      const today = toDateStr(new Date(now));
      // A session 10 days ago — outside 7-day window
      const tenDaysAgo = now - 10 * 24 * 60 * 60 * 1000;

      seedLocalStorage({
        sessions: [
          {
            date: today,
            startTime: now - 300_000,
            endTime: now,
            duration: 300,
            activity: 'reading',
          },
          {
            date: toDateStr(new Date(tenDaysAgo)),
            startTime: tenDaysAgo,
            endTime: tenDaysAgo + 300_000,
            duration: 300,
            activity: 'old-reading',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      });

      const { result } = renderHook(() => useStudyTimer());
      // 7-day window should only include today's session
      expect(result.current.getSessions(7)).toHaveLength(1);
      expect(result.current.getSessions(7)[0].activity).toBe('reading');
      // 30-day window should include both
      expect(result.current.getSessions(30)).toHaveLength(2);
    });
  });

  // -------------------------------------------------------------------------
  // Regression: バグA — 非アクティブ自動停止が学習記録を破棄しない
  // -------------------------------------------------------------------------

  describe('regression: inactivity auto-stop does not silently discard sessions (bug A)', () => {
    it('records the session (not discards it) when inactivity fires after real activity', () => {
      const { result } = renderHook(() => useStudyTimer());

      act(() => {
        result.current.startTimer('reading');
      });

      // 実際に少し学習が進む(タイマー稼働)。
      act(() => {
        vi.advanceTimersByTime(60_000); // 60秒経過
      });

      // ユーザー操作で lastInteraction が更新される(非アクティブタイマー再アーム)。
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      });

      // ここから30分以上、操作なしで放置 → 非アクティブ自動停止が発火。
      act(() => {
        vi.advanceTimersByTime(INACTIVITY_MS + 5_000);
      });

      // セッションは破棄されず記録されているはず。
      expect(result.current.isTracking).toBe(false);
      const sessions = result.current.getSessions(30);
      expect(sessions).toHaveLength(1);
      expect(sessions[0].activity).toBe('reading');
      // duration は 60秒前後(lastInteraction - currentStart)以上で、0ではない。
      expect(sessions[0].duration).toBeGreaterThanOrEqual(60);

      const stored = getStoredState();
      expect(stored!.sessions).toHaveLength(1);
      expect(stored!.currentStart).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // Regression: バグA — 操作イベントで lastInteraction が更新される
  // -------------------------------------------------------------------------

  describe('regression: activity events update lastInteraction (bug A)', () => {
    it('keydown while tracking advances lastInteraction in the shared store', () => {
      const { result } = renderHook(() => useStudyTimer());

      act(() => {
        result.current.startTimer('vocabulary');
      });

      const before = getStoredState()!.lastInteraction;
      expect(before).not.toBeNull();

      // スロットル(最大30秒に1回)を確実に超えるよう時間を進めてから操作。
      act(() => {
        vi.advanceTimersByTime(31_000);
      });
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }));
      });

      const after = getStoredState()!.lastInteraction;
      expect(after).not.toBeNull();
      expect(after!).toBeGreaterThan(before!);
    });
  });

  // -------------------------------------------------------------------------
  // Regression: バグB — 複数インスタンス間で状態が即時同期される
  // -------------------------------------------------------------------------

  describe('regression: state is shared across hook instances (bug B)', () => {
    it("one instance's startTimer/stopTimer is immediately reflected in another", () => {
      const a = renderHook(() => useStudyTimer());
      const b = renderHook(() => useStudyTimer());

      // 初期状態は両方とも未トラッキング。
      expect(a.result.current.isTracking).toBe(false);
      expect(b.result.current.isTracking).toBe(false);

      // インスタンス A で開始 → B 側にも即時反映される。
      act(() => {
        a.result.current.startTimer('lesson');
      });
      expect(a.result.current.isTracking).toBe(true);
      expect(b.result.current.isTracking).toBe(true);

      act(() => {
        vi.advanceTimersByTime(5_000);
      });

      // インスタンス B で停止 → A 側にも即時反映される。
      act(() => {
        b.result.current.stopTimer();
      });
      expect(b.result.current.isTracking).toBe(false);
      expect(a.result.current.isTracking).toBe(false);

      // セッションは1件だけ(二重記録されない)。
      const stored = getStoredState();
      expect(stored!.sessions).toHaveLength(1);
      expect(stored!.sessions[0].activity).toBe('lesson');
    });
  });
});
