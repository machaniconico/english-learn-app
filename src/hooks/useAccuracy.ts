import { useCallback, useRef } from 'react';

// --- Types ---

export interface QuizResult {
  type: 'fill-in-blank' | 'error-correction' | 'part1' | 'part2' | 'dictation' | 'reorder' | 'listening-quiz' | 'reading';
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

function trimResults(results: QuizResult[]): QuizResult[] {
  if (results.length <= MAX_RESULTS) return results;
  return results.slice(results.length - MAX_RESULTS);
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
    if (results.length === 0) return 0;
    const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
    if (totalQuestions === 0) return 0;
    return Math.round((totalCorrect / totalQuestions) * 100);
  }, []);

  const getAccuracyByType = useCallback((): AccuracyByType[] => {
    const results = loadResults();
    resultsRef.current = results;
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
  }, []);

  const getAccuracyByLevel = useCallback((): AccuracyByLevel[] => {
    const results = loadResults();
    resultsRef.current = results;
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
  }, []);

  const getRecentTrend = useCallback((type: string, lastN: number): number[] => {
    const results = loadResults();
    resultsRef.current = results;
    return results
      .filter((r) => r.type === type)
      .slice(-lastN)
      .map((r) => r.score);
  }, []);

  const getWeakestTypes = useCallback((): string[] => {
    const byType = getAccuracyByType();
    if (byType.length === 0) return [];
    const sorted = [...byType].sort((a, b) => a.accuracy - b.accuracy);
    const weakest = sorted[0].accuracy;
    return sorted.filter((t) => t.accuracy <= weakest + 5).map((t) => t.type);
  }, [getAccuracyByType]);

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
