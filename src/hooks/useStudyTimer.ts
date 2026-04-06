import { useState, useEffect, useCallback, useRef } from 'react';

// --- Types ---

export interface StudySession {
  date: string; // YYYY-MM-DD
  startTime: number; // timestamp
  endTime: number; // timestamp
  duration: number; // seconds
  activity: string; // what they were doing
}

interface TimerState {
  sessions: StudySession[];
  currentActivity: string | null;
  currentStart: number | null;
  lastInteraction: number | null;
}

// --- Constants ---

const STORAGE_KEY = 'english-learn-study-time';
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in ms

// --- Helpers ---

function getDateString(ts: number): string {
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getToday(): string {
  return getDateString(Date.now());
}

function loadState(): TimerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [], currentActivity: null, currentStart: null, lastInteraction: null };
    const parsed = JSON.parse(raw);
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      currentActivity: parsed.currentActivity ?? null,
      currentStart: parsed.currentStart ?? null,
      lastInteraction: parsed.lastInteraction ?? null,
    };
  } catch {
    return { sessions: [], currentActivity: null, currentStart: null, lastInteraction: null };
  }
}

function saveState(state: TimerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = start
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

// --- Hook ---

export function useStudyTimer() {
  const [state, setState] = useState<TimerState>(loadState);
  const [currentDuration, setCurrentDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isTracking = state.currentStart !== null;

  // Persist state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Live seconds counter
  useEffect(() => {
    if (isTracking && state.currentStart) {
      const update = () => {
        setCurrentDuration(Math.floor((Date.now() - state.currentStart!) / 1000));
      };
      update();
      intervalRef.current = setInterval(update, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setCurrentDuration(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isTracking, state.currentStart]);

  // Auto-stop after 30 minutes of inactivity
  useEffect(() => {
    if (!isTracking) return;

    const checkInactivity = () => {
      const s = loadState();
      if (s.lastInteraction && Date.now() - s.lastInteraction > INACTIVITY_TIMEOUT) {
        // Auto-stop: use lastInteraction as end time
        const endTime = s.lastInteraction;
        const duration = Math.floor((endTime - (s.currentStart ?? endTime)) / 1000);
        if (duration > 0 && s.currentStart) {
          const session: StudySession = {
            date: getDateString(s.currentStart),
            startTime: s.currentStart,
            endTime,
            duration,
            activity: s.currentActivity ?? 'unknown',
          };
          setState({
            sessions: [...s.sessions, session],
            currentActivity: null,
            currentStart: null,
            lastInteraction: null,
          });
        } else {
          setState({
            ...s,
            currentActivity: null,
            currentStart: null,
            lastInteraction: null,
          });
        }
      }
    };

    inactivityRef.current = setTimeout(checkInactivity, INACTIVITY_TIMEOUT);
    return () => {
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };
  }, [isTracking, state.lastInteraction]);

  // Check for stale sessions on mount (e.g., browser was closed while tracking)
  useEffect(() => {
    const s = loadState();
    if (s.currentStart && s.lastInteraction) {
      if (Date.now() - s.lastInteraction > INACTIVITY_TIMEOUT) {
        const endTime = s.lastInteraction;
        const duration = Math.floor((endTime - s.currentStart) / 1000);
        if (duration > 0) {
          const session: StudySession = {
            date: getDateString(s.currentStart),
            startTime: s.currentStart,
            endTime,
            duration,
            activity: s.currentActivity ?? 'unknown',
          };
          const newState = {
            sessions: [...s.sessions, session],
            currentActivity: null,
            currentStart: null,
            lastInteraction: null,
          };
          setState(newState);
          saveState(newState);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimer = useCallback((activity: string) => {
    setState((prev) => {
      // If already tracking, don't restart — just update interaction
      if (prev.currentStart !== null) {
        return { ...prev, lastInteraction: Date.now() };
      }
      return {
        ...prev,
        currentActivity: activity,
        currentStart: Date.now(),
        lastInteraction: Date.now(),
      };
    });
  }, []);

  const stopTimer = useCallback(() => {
    setState((prev) => {
      if (!prev.currentStart) return prev;
      const endTime = Date.now();
      const duration = Math.floor((endTime - prev.currentStart) / 1000);
      if (duration < 1) {
        return {
          ...prev,
          currentActivity: null,
          currentStart: null,
          lastInteraction: null,
        };
      }
      const session: StudySession = {
        date: getDateString(prev.currentStart),
        startTime: prev.currentStart,
        endTime,
        duration,
        activity: prev.currentActivity ?? 'unknown',
      };
      return {
        sessions: [...prev.sessions, session],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      };
    });
  }, []);

  const getTotalTime = useCallback(
    (days: number): number => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const total = state.sessions
        .filter((s) => s.startTime >= cutoff)
        .reduce((sum, s) => sum + s.duration, 0);
      return Math.round(total / 60); // minutes
    },
    [state.sessions],
  );

  const getDailyBreakdown = useCallback(
    (days: number): { date: string; minutes: number }[] => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const byDate: Record<string, number> = {};

      // Initialize all dates
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = getDateString(d.getTime());
        byDate[key] = 0;
      }

      for (const session of state.sessions) {
        if (session.startTime >= cutoff) {
          const key = session.date;
          byDate[key] = (byDate[key] ?? 0) + Math.round(session.duration / 60);
        }
      }

      return Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, minutes]) => ({ date, minutes }));
    },
    [state.sessions],
  );

  const getWeeklyTotal = useCallback((): number => {
    const weekStart = startOfWeek(new Date()).getTime();
    const total = state.sessions
      .filter((s) => s.startTime >= weekStart)
      .reduce((sum, s) => sum + s.duration, 0);
    return Math.round(total / 60);
  }, [state.sessions]);

  const getMonthlyTotal = useCallback((): number => {
    const monthStart = startOfMonth(new Date()).getTime();
    const total = state.sessions
      .filter((s) => s.startTime >= monthStart)
      .reduce((sum, s) => sum + s.duration, 0);
    return Math.round(total / 60);
  }, [state.sessions]);

  const getSessions = useCallback(
    (days: number): StudySession[] => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return state.sessions.filter((s) => s.startTime >= cutoff);
    },
    [state.sessions],
  );

  const getStreak = useCallback((): { current: number; longest: number } => {
    if (state.sessions.length === 0) return { current: 0, longest: 0 };

    const activeDates = new Set(state.sessions.map((s) => s.date));
    const sortedDates = [...activeDates].sort();

    let longest = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1] + 'T00:00:00');
      const curr = new Date(sortedDates[i] + 'T00:00:00');
      const diffDays = Math.round(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (diffDays === 1) {
        currentStreak++;
        if (currentStreak > longest) longest = currentStreak;
      } else {
        currentStreak = 1;
      }
    }

    // Check if current streak includes today or yesterday
    const today = getToday();
    const yesterday = getDateString(Date.now() - 24 * 60 * 60 * 1000);
    const lastDate = sortedDates[sortedDates.length - 1];

    let current = 0;
    if (lastDate === today || lastDate === yesterday) {
      current = 1;
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const prev = new Date(sortedDates[i] + 'T00:00:00');
        const curr = new Date(sortedDates[i + 1] + 'T00:00:00');
        const diffDays = Math.round(
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays === 1) {
          current++;
        } else {
          break;
        }
      }
    }

    return { current, longest: Math.max(longest, current) };
  }, [state.sessions]);

  return {
    startTimer,
    stopTimer,
    isTracking,
    currentDuration,
    getTotalTime,
    getDailyBreakdown,
    getWeeklyTotal,
    getMonthlyTotal,
    getSessions,
    getStreak,
  };
}
