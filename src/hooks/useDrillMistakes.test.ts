// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { DrillQuestion } from '../utils/drillTypes';
import type { DrillMistake } from '../utils/drillMistakes';
import { useDrillMistakes } from './useDrillMistakes';

const STORAGE_KEY = 'english-learn-drill-mistakes';

function makeQuestion(id: string, overrides: Partial<DrillQuestion> = {}): DrillQuestion {
  return {
    id,
    genre: 'vocab',
    difficulty: 'beginner',
    prompt: `Prompt ${id}`,
    options: ['a', 'b', 'c', 'd'],
    correctIndex: 1,
    explanation: `Explanation ${id}`,
    ...overrides,
  };
}

describe('useDrillMistakes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds, reviews to mastery, and clears mistakes', () => {
    const { result } = renderHook(() => useDrillMistakes());

    act(() => {
      result.current.addMistake(makeQuestion('q1'));
    });

    expect(result.current.pendingCount).toBe(1);
    expect(result.current.mistakes[0].question.id).toBe('q1');

    act(() => {
      result.current.reviewMistake('q1', true);
    });

    expect(result.current.pendingCount).toBe(1);
    expect(result.current.mistakes[0].correctStreak).toBe(1);

    act(() => {
      result.current.reviewMistake('q1', true);
    });

    expect(result.current.pendingCount).toBe(0);
    expect(result.current.mistakes).toEqual([]);

    act(() => {
      result.current.addMistake(makeQuestion('q2'));
    });
    act(() => {
      result.current.clearAll();
    });

    expect(result.current.pendingCount).toBe(0);
    expect(result.current.mistakes).toEqual([]);
  });

  it('persists additions and restores them for a new hook mount', () => {
    const { result: first, unmount } = renderHook(() => useDrillMistakes());

    act(() => {
      first.current.addMistake(makeQuestion('persisted'));
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as DrillMistake[];
    expect(stored).toHaveLength(1);
    expect(stored[0].question.id).toBe('persisted');

    unmount();

    const { result: second } = renderHook(() => useDrillMistakes());
    expect(second.current.pendingCount).toBe(1);
    expect(second.current.mistakes[0].question.id).toBe('persisted');
  });

  it('does not crash and starts empty when localStorage contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{bad');

    const { result } = renderHook(() => useDrillMistakes());

    expect(result.current.pendingCount).toBe(0);
    expect(result.current.mistakes).toEqual([]);
  });
});
