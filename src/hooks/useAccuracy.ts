import { useCallback, useRef } from 'react';

// --- Types ---

export interface QuizResult {
  type: 'fill-in-blank' | 'error-correction' | 'part1' | 'part2' | 'dictation' | 'reorder' | 'listening-quiz' | 'reading' | 'daily-quiz' | 'drill';
  setId: string;
  score: number;
  total: number;
  correct: number;
  timestamp: number;
  level?: string;
}

export interface AccuracyByType {
  type: string;
  accuracy: number;
  attempts: number;
}

export interface AccuracyByLevel {
  level: string;
  accuracy: number;
  attempts: number;
}

// --- Constants ---

const STORAGE_KEY = 'english-learn-accuracy';
const MAX_RESULTS = 500;
// drill はジャンル混合のエンドレス練習モードで、単一の苦手分野として推薦できないため除外。
const WEAKEST_TYPE_EXCLUDED_TYPES = new Set<string>(['drill']);

// --- Helpers ---

function loadResults(): QuizResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as QuizResult[];
  } catch {
    return [];
  }
}

function saveResults(results: QuizResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // storage full or unavailable
  }
}

export function trimResults(results: QuizResult[]): QuizResult[] {
  if (results.length <= MAX_RESULTS) return results;
  return results.slice(results.length - MAX_RESULTS);
}

// --- Pure computations ---

export function computeOverallAccuracy(results: QuizResult[]): number {
  if (results.length === 0) return 0;
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
  if (totalQuestions === 0) return 0;
  return Math.round((totalCorrect / totalQuestions) * 100);
}

export function computeAccuracyByType(results: QuizResult[]): AccuracyByType[] {
  const grouped: Record<string, { correct: number; total: number; attempts: number }> = {};
  for (const r of results) {
    if (!grouped[r.type]) {
      grouped[r.type] = { correct: 0, total: 0, attempts: 0 };
    }
    grouped[r.type].correct += r.correct;
    grouped[r.type].total += r.total;
    grouped[r.type].attempts += 1;
  }
  return Object.entries(grouped).map(([type, data]) => ({
    type,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    attempts: data.attempts,
  }));
}

export function computeAccuracyByLevel(results: QuizResult[]): AccuracyByLevel[] {
  const grouped: Record<string, { correct: number; total: number; attempts: number }> = {};
  for (const r of results) {
    const level = r.level ?? 'unknown';
    if (!grouped[level]) {
      grouped[level] = { correct: 0, total: 0, attempts: 0 };
    }
    grouped[level].correct += r.correct;
    grouped[level].total += r.total;
    grouped[level].attempts += 1;
  }
  return Object.entries(grouped)
    .filter(([level]) => level !== 'unknown')
    .map(([level, data]) => ({
      level,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      attempts: data.attempts,
    }));
}

export function computeRecentTrend(results: QuizResult[], type: string, lastN: number): number[] {
  return results
    .filter((r) => r.type === type)
    .slice(-lastN)
    .map((r) => r.score);
}

export function computeWeakestTypes(results: QuizResult[]): string[] {
  const byType = computeAccuracyByType(results).filter((t) => !WEAKEST_TYPE_EXCLUDED_TYPES.has(t.type));
  if (byType.length === 0) return [];
  const sorted = [...byType].sort((a, b) => a.accuracy - b.accuracy);
  const weakest = sorted[0].accuracy;
  return sorted.filter((t) => t.accuracy <= weakest + 5).map((t) => t.type);
}

// --- Hook ---

export function useAccuracy() {
  const resultsRef = useRef<QuizResult[]>(loadResults());

  const logResult = useCallback((result: Omit<QuizResult, 'timestamp'>): void => {
    const full: QuizResult = { ...result, timestamp: Date.now() };
    const results = trimResults(loadResults());
    results.push(full);
    resultsRef.current = results;
    saveResults(results);
  }, []);

  const getResultsByType = useCallback((type: string): QuizResult[] => {
    const results = loadResults();
    resultsRef.current = results;
    return results.filter((r) => r.type === type);
  }, []);

  const getOverallAccuracy = useCallback((): number => {
    const results = loadResults();
    resultsRef.current = results;
    return computeOverallAccuracy(results);
  }, []);

  const getAccuracyByType = useCallback((): AccuracyByType[] => {
    const results = loadResults();
    resultsRef.current = results;
    return computeAccuracyByType(results);
  }, []);

  const getAccuracyByLevel = useCallback((): AccuracyByLevel[] => {
    const results = loadResults();
    resultsRef.current = results;
    return computeAccuracyByLevel(results);
  }, []);

  const getRecentTrend = useCallback((type: string, lastN: number): number[] => {
    const results = loadResults();
    resultsRef.current = results;
    return computeRecentTrend(results, type, lastN);
  }, []);

  const getWeakestTypes = useCallback((): string[] => {
    const results = loadResults();
    resultsRef.current = results;
    return computeWeakestTypes(results);
  }, []);

  return {
    logResult,
    getResultsByType,
    getOverallAccuracy,
    getAccuracyByType,
    getAccuracyByLevel,
    getRecentTrend,
    getWeakestTypes,
  };
}
