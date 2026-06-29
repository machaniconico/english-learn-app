import type { QuizSelectionMode } from '../data/dailyQuiz';

export const PRACTICE_PREFS_KEY = 'english-learn-practice-quiz-prefs';

export interface PracticePrefs {
  selection: QuizSelectionMode | null;
  count: number;
}

const DEFAULT_PREFS: PracticePrefs = { selection: null, count: 10 };

function isQuizSelectionMode(value: unknown): value is QuizSelectionMode {
  return (
    value === 'beginner' ||
    value === 'intermediate' ||
    value === 'advanced' ||
    value === 'mixed'
  );
}

function isValidCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 10 && value % 10 === 0;
}

export function loadPracticePrefs(): PracticePrefs {
  try {
    const raw = localStorage.getItem(PRACTICE_PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_PREFS;

    const prefs = parsed as Partial<Record<keyof PracticePrefs, unknown>>;

    return {
      selection: isQuizSelectionMode(prefs.selection) ? prefs.selection : null,
      count: isValidCount(prefs.count) ? prefs.count : 10,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePracticePrefs(prefs: PracticePrefs): void {
  try {
    localStorage.setItem(PRACTICE_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore persistence failures.
  }
}
