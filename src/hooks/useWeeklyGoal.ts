import { useCallback, useState } from 'react';

const STORAGE_KEY = 'english-learn-weekly-goal';
const DEFAULT_GOAL = 60;

/** Selectable weekly study-time goals, in minutes. */
export const WEEKLY_GOAL_PRESETS = [30, 60, 120, 180] as const;

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

export function useWeeklyGoal() {
  const [weeklyGoalMinutes, setWeeklyGoalMinutesState] = useState<number>(loadGoal);
  const setWeeklyGoalMinutes = useCallback((minutes: number) => {
    setWeeklyGoalMinutesState(minutes);
    try {
      localStorage.setItem(STORAGE_KEY, String(minutes));
    } catch {
      // ignore
    }
  }, []);
  return { weeklyGoalMinutes, setWeeklyGoalMinutes };
}
