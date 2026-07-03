import { useCallback, useEffect, useState } from 'react';

export interface WeakPoint {
  id: string;
  type: 'fill-in-blank' | 'error-correction' | 'part1' | 'part2' | 'dictation' | 'reorder';
  question: unknown; // the original question object
  wrongAnswer: string;
  correctAnswer: string;
  timestamp: number;
  reviewCount: number; // how many times reviewed
  correctCount?: number; // consecutive correct review count; absent for legacy storage data
  lastCorrect: boolean; // was it correct last time?
}

const STORAGE_KEY = 'english-learn-weak-points';
export const MAX_ITEMS = 100;
type NewWeakPoint = Omit<WeakPoint, 'timestamp' | 'reviewCount' | 'correctCount' | 'lastCorrect'>;

/**
 * Pure upsert + cap logic for weak points.
 * Drop-in for addWeakPoint's setState updater body. `now` is the timestamp
 * to use instead of calling Date.now() inside the updater.
 */
export function upsertWeakPoint(
  prev: WeakPoint[],
  wp: NewWeakPoint,
  now: number,
): WeakPoint[] {
  // If this question already exists, update it instead of duplicating
  const existingIdx = prev.findIndex((p) => p.id === wp.id);
  let next: WeakPoint[];
  if (existingIdx >= 0) {
    next = [...prev];
    next[existingIdx] = {
      ...next[existingIdx],
      wrongAnswer: wp.wrongAnswer,
      correctAnswer: wp.correctAnswer,
      question: wp.question,
      timestamp: now,
      correctCount: 0,
      lastCorrect: false,
    };
  } else {
    const newItem: WeakPoint = {
      ...wp,
      timestamp: now,
      reviewCount: 0,
      correctCount: 0,
      lastCorrect: false,
    };
    next = [newItem, ...prev];
  }

  // Keep only last MAX_ITEMS (remove oldest when exceeding)
  if (next.length > MAX_ITEMS) {
    next.sort((a, b) => b.timestamp - a.timestamp);
    next = next.slice(0, MAX_ITEMS);
  }

  return next;
}

/**
 * Pure markReviewed logic. Drop-in for markReviewed's setState updater body.
 */
export function markReviewedIn(
  prev: WeakPoint[],
  id: string,
  correct: boolean,
  now: number,
): WeakPoint[] {
  return prev.map((wp) =>
    wp.id === id
      ? {
          ...wp,
          reviewCount: wp.reviewCount + 1,
          correctCount: correct ? (wp.correctCount ?? 0) + 1 : 0,
          lastCorrect: correct,
          timestamp: now,
        }
      : wp,
  );
}

function isWeakPoint(value: unknown): value is WeakPoint {
  if (typeof value !== 'object' || value === null) return false;
  const wp = value as Record<string, unknown>;
  return (
    typeof wp.id === 'string' &&
    typeof wp.type === 'string' &&
    typeof wp.wrongAnswer === 'string' &&
    typeof wp.correctAnswer === 'string' &&
    typeof wp.timestamp === 'number' &&
    typeof wp.reviewCount === 'number' &&
    (wp.correctCount === undefined || typeof wp.correctCount === 'number') &&
    typeof wp.lastCorrect === 'boolean'
  );
}

function loadWeakPoints(): WeakPoint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWeakPoint);
  } catch {
    return [];
  }
}

function saveWeakPoints(items: WeakPoint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function useWeakPoints() {
  const [weakPoints, setWeakPoints] = useState<WeakPoint[]>(loadWeakPoints);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setWeakPoints(loadWeakPoints());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addWeakPoint = useCallback(
    (wp: NewWeakPoint) => {
      setWeakPoints((prev) => {
        const next = upsertWeakPoint(prev, wp, Date.now());
        saveWeakPoints(next);
        return next;
      });
    },
    [],
  );

  const markReviewed = useCallback((id: string, correct: boolean) => {
    setWeakPoints((prev) => {
      const next = markReviewedIn(prev, id, correct, Date.now());
      saveWeakPoints(next);
      return next;
    });
  }, []);

  const removeWeakPoint = useCallback((id: string) => {
    setWeakPoints((prev) => {
      const next = prev.filter((wp) => wp.id !== id);
      saveWeakPoints(next);
      return next;
    });
  }, []);

  const getWeakPointsByType = useCallback(
    (type: string): WeakPoint[] => {
      return weakPoints.filter((wp) => wp.type === type);
    },
    [weakPoints],
  );

  const clearAll = useCallback(() => {
    setWeakPoints([]);
    saveWeakPoints([]);
  }, []);

  return { weakPoints, addWeakPoint, markReviewed, removeWeakPoint, getWeakPointsByType, clearAll };
}
