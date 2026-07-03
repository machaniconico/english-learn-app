// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWeeklyGoal } from './useWeeklyGoal';

const STORAGE_KEY = 'english-learn-weekly-goal';
const DEFAULT_GOAL = 60;

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('useWeeklyGoal', () => {
  it('defaults to 60 minutes when storage is empty', () => {
    const { result } = renderHook(() => useWeeklyGoal());

    expect(result.current.weeklyGoalMinutes).toBe(DEFAULT_GOAL);
  });

  it('loads a valid persisted weekly goal on mount', () => {
    localStorage.setItem(STORAGE_KEY, '120');

    const { result } = renderHook(() => useWeeklyGoal());

    expect(result.current.weeklyGoalMinutes).toBe(120);
  });

  it.each(['abc', '-1', '0', 'Infinity'])(
    'falls back to the default weekly goal for invalid stored value %s',
    (storedValue) => {
      localStorage.setItem(STORAGE_KEY, storedValue);

      const { result } = renderHook(() => useWeeklyGoal());

      expect(result.current.weeklyGoalMinutes).toBe(DEFAULT_GOAL);
    },
  );

  it('falls back to the default weekly goal when reading storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    const { result } = renderHook(() => useWeeklyGoal());

    expect(result.current.weeklyGoalMinutes).toBe(DEFAULT_GOAL);
  });

  it('setWeeklyGoalMinutes persists the new goal with the weekly goal key', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useWeeklyGoal());

    act(() => result.current.setWeeklyGoalMinutes(180));

    expect(result.current.weeklyGoalMinutes).toBe(180);
    expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, '180');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('180');
  });

  it('setWeeklyGoalMinutes does not throw when writing storage throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage full');
    });
    const { result } = renderHook(() => useWeeklyGoal());

    expect(() => {
      act(() => result.current.setWeeklyGoalMinutes(90));
    }).not.toThrow();
    expect(result.current.weeklyGoalMinutes).toBe(90);
  });
});
