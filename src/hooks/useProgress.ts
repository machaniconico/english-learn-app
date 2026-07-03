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
  freezeTokens: number;
}

const STORAGE_KEY = 'english-learn-progress';

export const MAX_FREEZE_TOKENS = 3;
export const FREEZE_EARN_INTERVAL = 7;

/**
 * 次の保護トークン獲得まであと何日(連続学習)かを返す。
 * すでに最大保有(freezeTokens >= MAX_FREEZE_TOKENS)なら null。
 * それ以外は streak を FREEZE_EARN_INTERVAL で割った剰余から、次の倍数までの日数。
 * (剰余0=ちょうど倍数のときは次の獲得まで FREEZE_EARN_INTERVAL 日)
 */
export function daysUntilNextFreezeToken(streak: number, freezeTokens: number): number | null {
  if (freezeTokens >= MAX_FREEZE_TOKENS) return null;
  const rem = ((streak % FREEZE_EARN_INTERVAL) + FREEZE_EARN_INTERVAL) % FREEZE_EARN_INTERVAL;
  return rem === 0 ? FREEZE_EARN_INTERVAL : FREEZE_EARN_INTERVAL - rem;
}

function getToday(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  return Math.round(Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

/** Pure: shift a YYYY-MM-DD date by `delta` days (local-midnight parse to avoid TZ off-by-one). */
export function addDays(dateStr: string, delta: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Pure streak transition. Drop-in for the original inline `touchStudyDate`
 * body: same-day is a no-op (returns prev unchanged), a consecutive day
 * (daysBetween === 1) increments the streak, and any other case (gap or
 * first-ever study) resets the streak to 1.
 */
export function applyStudyDate(prev: ProgressData, today: string): ProgressData {
  if (prev.lastStudyDate === today) return prev;
  let streak = prev.streak;
  let freezeTokens = prev.freezeTokens;
  if (prev.lastStudyDate && daysBetween(prev.lastStudyDate, today) === 1) {
    streak += 1;
    if (streak > 0 && streak % FREEZE_EARN_INTERVAL === 0) {
      freezeTokens = Math.min(MAX_FREEZE_TOKENS, freezeTokens + 1);
    }
  } else if (prev.lastStudyDate !== today) {
    streak = 1;
  }
  return { ...prev, streak, lastStudyDate: today, freezeTokens };
}

/**
 * Pure streak-break transition used by `updateStreak`. If there is no recorded
 * study date, or the gap to `today` is more than one day, the streak is reset
 * to 0; otherwise the data is returned unchanged.
 */
export function applyStreakBreak(prev: ProgressData, today: string): ProgressData {
  if (!prev.lastStudyDate) return prev;
  const diff = daysBetween(prev.lastStudyDate, today);
  if (diff <= 1) return prev;
  const missedDays = diff - 1;
  if (prev.streak > 0 && prev.freezeTokens >= missedDays) {
    // 保護で穴埋め: lastStudyDate を前日へブリッジし streak を維持
    return {
      ...prev,
      freezeTokens: prev.freezeTokens - missedDays,
      lastStudyDate: addDays(today, -1),
    };
  }
  return { ...prev, streak: 0 };
}

function createDefaultProgress(): ProgressData {
  return {
    lessons: {},
    fillInBlankScores: {},
    readingScores: {},
    totalStudyTime: 0,
    streak: 0,
    lastStudyDate: '',
    freezeTokens: 0,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeLessons(value: unknown): Record<string, LessonProgress> {
  if (!isRecord(value)) return {};

  const lessons: Record<string, LessonProgress> = {};
  for (const [lessonId, lesson] of Object.entries(value)) {
    if (!isRecord(lesson)) continue;

    const sanitized: LessonProgress = {
      lessonId: typeof lesson.lessonId === 'string' ? lesson.lessonId : lessonId,
      completedItems: Array.isArray(lesson.completedItems)
        ? lesson.completedItems
        : [],
      lastAccessed: typeof lesson.lastAccessed === 'number' ? lesson.lastAccessed : 0,
    };

    if (typeof lesson.quizScore === 'number') {
      sanitized.quizScore = lesson.quizScore;
    }
    if (typeof lesson.flashcardCompleted === 'boolean') {
      sanitized.flashcardCompleted = lesson.flashcardCompleted;
    }

    lessons[lessonId] = sanitized;
  }
  return lessons;
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return createDefaultProgress();
    return {
      lessons: sanitizeLessons(parsed.lessons),
      fillInBlankScores:
        parsed.fillInBlankScores && typeof parsed.fillInBlankScores === 'object'
          ? (parsed.fillInBlankScores as Record<string, number>)
          : {},
      readingScores:
        parsed.readingScores && typeof parsed.readingScores === 'object'
          ? (parsed.readingScores as Record<string, number>)
          : {},
      totalStudyTime:
        typeof parsed.totalStudyTime === 'number' ? parsed.totalStudyTime : 0,
      streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
      lastStudyDate:
        typeof parsed.lastStudyDate === 'string' ? parsed.lastStudyDate : '',
      freezeTokens:
        typeof parsed.freezeTokens === 'number' && parsed.freezeTokens >= 0
          ? Math.min(MAX_FREEZE_TOKENS, Math.floor(parsed.freezeTokens))
          : 0,
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
    return applyStudyDate(applyStreakBreak(prev, today), today);
  }, []);

  const recordStudyDay = useCallback(() => {
    setProgress((prev) => touchStudyDate(prev));
  }, [touchStudyDate]);

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
    setProgress((prev) => applyStreakBreak(prev, getToday()));
  }, []);

  return {
    progress,
    markItemCompleted,
    saveQuizScore,
    saveFillInBlankScore,
    saveReadingScore,
    markFlashcardCompleted,
    recordStudyDay,
    getLessonProgress,
    getOverallStats,
    updateStreak,
  };
}
