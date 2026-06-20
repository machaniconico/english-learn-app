import { useCallback, useState } from 'react';

const STORAGE_KEY = 'english-learn-daily-goal';
const DEFAULT_GOAL = 10;

/** Selectable daily study-time goals, in minutes. */
export const GOAL_PRESETS = [5, 10, 20, 30] as const;

function loadGoal(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const n = parseInt(raw, 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
  } catch {
    // ignore
  }
  return DEFAULT_GOAL;
}

export function useDailyGoal() {
  const [goalMinutes, setGoalMinutesState] = useState<number>(loadGoal);

  const setGoalMinutes = useCallback((minutes: number) => {
    setGoalMinutesState(minutes);
    try {
      localStorage.setItem(STORAGE_KEY, String(minutes));
    } catch {
      // ignore
    }
  }, []);

  return { goalMinutes, setGoalMinutes };
}

/** Pure: percentage (0-100, capped) of the daily goal reached. */
export function goalProgressPct(todayMinutes: number, goalMinutes: number): number {
  if (goalMinutes <= 0) return 0;
  return Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
}
