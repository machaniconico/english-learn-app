// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDailyGoal, goalProgressPct } from './useDailyGoal';

beforeEach(() => {
  localStorage.clear();
});

describe('goalProgressPct', () => {
  it('returns a rounded, capped percentage', () => {
    expect(goalProgressPct(5, 10)).toBe(50);
    expect(goalProgressPct(15, 10)).toBe(100); // capped
    expect(goalProgressPct(0, 10)).toBe(0);
    expect(goalProgressPct(1, 3)).toBe(33);
  });

  it('returns 0 for a non-positive goal', () => {
    expect(goalProgressPct(5, 0)).toBe(0);
  });
});

describe('useDailyGoal', () => {
  it('defaults to 10 minutes and persists changes', () => {
    const { result } = renderHook(() => useDailyGoal());
    expect(result.current.goalMinutes).toBe(10);
    act(() => result.current.setGoalMinutes(20));
    expect(result.current.goalMinutes).toBe(20);
    expect(localStorage.getItem('english-learn-daily-goal')).toBe('20');
  });

  it('loads a persisted goal on mount', () => {
    localStorage.setItem('english-learn-daily-goal', '30');
    const { result } = renderHook(() => useDailyGoal());
    expect(result.current.goalMinutes).toBe(30);
  });
});
