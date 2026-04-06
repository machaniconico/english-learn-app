import { useState, useCallback, useEffect } from 'react';

export interface LessonProgress {
  lessonId: string;
  completedItems: string[];
  quizScore?: number;
  flashcardCompleted?: boolean;
  lastAccessed: number;
}

export interface ProgressData {
  lessons: Record<string, LessonProgress>;
  fillInBlankScores: Record<string, number>;
  readingScores: Record<string, number>;
  totalStudyTime: number;
  streak: number;
  lastStudyDate: string;
}

const STORAGE_KEY = 'english-learn-progress';

function getToday(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  return Math.round(Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function createDefaultProgress(): ProgressData {
  return {
    lessons: {},
    fillInBlankScores: {},
    readingScores: {},
    totalStudyTime: 0,
    streak: 0,
    lastStudyDate: '',
  };
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    return {
      lessons: parsed.lessons && typeof parsed.lessons === 'object' ? parsed.lessons : {},
      fillInBlankScores:
        parsed.fillInBlankScores && typeof parsed.fillInBlankScores === 'object'
          ? parsed.fillInBlankScores
          : {},
      readingScores:
        parsed.readingScores && typeof parsed.readingScores === 'object'
          ? parsed.readingScores
          : {},
      totalStudyTime:
        typeof parsed.totalStudyTime === 'number' ? parsed.totalStudyTime : 0,
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      lastStudyDate:
        typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : '',
    };
  } catch {
    return createDefaultProgress();
  }
}

function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  // Persist every state change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const touchStudyDate = useCallback((prev: ProgressData): ProgressData => {
    const today = getToday();
    if (prev.lastStudyDate === today) return prev;
    let streak = prev.streak;
    if (prev.lastStudyDate && daysBetween(prev.lastStudyDate, today) === 1) {
      streak += 1;
    } else if (prev.lastStudyDate !== today) {
      streak = 1;
    }
    return { ...prev, streak, lastStudyDate: today };
  }, []);

  const markItemCompleted = useCallback(
    (lessonId: string, itemId: string) => {
      setProgress((prev) => {
        const updated = touchStudyDate(prev);
        const existing = updated.lessons[lessonId] ?? {
          lessonId,
          completedItems: [],
          lastAccessed: Date.now(),
        };
        if (existing.completedItems.includes(itemId)) {
          return {
            ...updated,
            lessons: {
              ...updated.lessons,
              [lessonId]: { ...existing, lastAccessed: Date.now() },
            },
          };
        }
        return {
          ...updated,
          lessons: {
            ...updated.lessons,
            [lessonId]: {
              ...existing,
              completedItems: [...existing.completedItems, itemId],
              lastAccessed: Date.now(),
            },
          },
        };
      });
    },
    [touchStudyDate],
  );

  const saveQuizScore = useCallback(
    (lessonId: string, score: number) => {
      setProgress((prev) => {
        const updated = touchStudyDate(prev);
        const existing = updated.lessons[lessonId] ?? {
          lessonId,
          completedItems: [],
          lastAccessed: Date.now(),
        };
        const best = Math.max(existing.quizScore ?? 0, score);
        return {
          ...updated,
          lessons: {
            ...updated.lessons,
            [lessonId]: {
              ...existing,
              quizScore: best,
              lastAccessed: Date.now(),
            },
          },
        };
      });
    },
    [touchStudyDate],
  );

  const saveFillInBlankScore = useCallback(
    (setId: string, score: number) => {
      setProgress((prev) => {
        const updated = touchStudyDate(prev);
        const best = Math.max(updated.fillInBlankScores[setId] ?? 0, score);
        return {
          ...updated,
          fillInBlankScores: { ...updated.fillInBlankScores, [setId]: best },
        };
      });
    },
    [touchStudyDate],
  );

  const saveReadingScore = useCallback(
    (passageId: string, score: number) => {
      setProgress((prev) => {
        const updated = touchStudyDate(prev);
        const best = Math.max(updated.readingScores[passageId] ?? 0, score);
        return {
          ...updated,
          readingScores: { ...updated.readingScores, [passageId]: best },
        };
      });
    },
    [touchStudyDate],
  );

  const markFlashcardCompleted = useCallback(
    (lessonId: string) => {
      setProgress((prev) => {
        const updated = touchStudyDate(prev);
        const existing = updated.lessons[lessonId] ?? {
          lessonId,
          completedItems: [],
          lastAccessed: Date.now(),
        };
        return {
          ...updated,
          lessons: {
            ...updated.lessons,
            [lessonId]: {
              ...existing,
              flashcardCompleted: true,
              lastAccessed: Date.now(),
            },
          },
        };
      });
    },
    [touchStudyDate],
  );

  const getLessonProgress = useCallback(
    (lessonId: string): LessonProgress | null => {
      return progress.lessons[lessonId] ?? null;
    },
    [progress],
  );

  const getOverallStats = useCallback(() => {
    const lessonEntries = Object.values(progress.lessons);
    const totalItems = lessonEntries.reduce(
      (sum, l) => sum + l.completedItems.length,
      0,
    );
    const scores: number[] = [];
    for (const l of lessonEntries) {
      if (l.quizScore !== undefined) scores.push(l.quizScore);
    }
    for (const s of Object.values(progress.fillInBlankScores)) {
      scores.push(s);
    }
    for (const s of Object.values(progress.readingScores)) {
      scores.push(s);
    }
    const averageScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    return {
      totalItems,
      completedItems: totalItems,
      averageScore,
      streak: progress.streak,
    };
  }, [progress]);

  const updateStreak = useCallback(() => {
    setProgress((prev) => {
      const today = getToday();
      if (!prev.lastStudyDate) return prev;
      const diff = daysBetween(prev.lastStudyDate, today);
      if (diff > 1) {
        // streak broken
        return { ...prev, streak: 0 };
      }
      return prev;
    });
  }, []);

  return {
    progress,
    markItemCompleted,
    saveQuizScore,
    saveFillInBlankScore,
    saveReadingScore,
    markFlashcardCompleted,
    getLessonProgress,
    getOverallStats,
    updateStreak,
  };
}
