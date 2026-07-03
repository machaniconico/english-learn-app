import { DRILL_DIFFICULTIES, DRILL_GENRES, DRILL_TIMERS } from './drillTypes';
import type { DrillDifficulty, DrillGenre, DrillGenreSelection, DrillTimer } from './drillTypes';

export const DRILL_STATS_KEY = 'english-learn-drill-stats';
export const DRILL_RECENT_KEY = 'english-learn-drill-recent';
export const DRILL_PREFS_KEY = 'english-learn-drill-prefs';

export interface DrillTotals {
  answered: number;
  correct: number;
}

export interface DrillStatsData {
  total: DrillTotals;
  byGenre: Record<DrillGenre, DrillTotals>;
  byDifficulty: Record<DrillDifficulty, DrillTotals>;
}

export interface DrillPrefs {
  genre: DrillGenreSelection;
  difficulty: DrillDifficulty;
  timer: DrillTimer;
}

const DEFAULT_PREFS: DrillPrefs = { genre: 'random', difficulty: 'beginner', timer: 'off' };
const DRILL_GENRE_VALUES = DRILL_GENRES.map((genre) => genre.value);
const DRILL_DIFFICULTY_VALUES = DRILL_DIFFICULTIES.map((difficulty) => difficulty.value);
const DRILL_TIMER_VALUES = DRILL_TIMERS.map((timer) => timer.value);

function emptyTotals(): DrillTotals {
  return { answered: 0, correct: 0 };
}

function cloneTotals(totals: DrillTotals): DrillTotals {
  return { answered: totals.answered, correct: totals.correct };
}

function incrementTotals(totals: DrillTotals, correct: boolean): DrillTotals {
  return {
    answered: totals.answered + 1,
    correct: totals.correct + (correct ? 1 : 0),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDrillTotals(value: unknown): value is DrillTotals {
  if (!isRecord(value)) return false;

  const { answered, correct } = value;
  return (
    typeof answered === 'number' &&
    typeof correct === 'number' &&
    Number.isInteger(answered) &&
    Number.isInteger(correct) &&
    answered >= 0 &&
    correct >= 0 &&
    correct <= answered
  );
}

function readTotalsRecord<T extends string>(
  source: unknown,
  keys: readonly T[],
): Record<T, DrillTotals> | null {
  if (!isRecord(source)) return null;

  const result = {} as Record<T, DrillTotals>;
  for (const key of keys) {
    const totals = source[key];
    if (!isDrillTotals(totals)) return null;
    result[key] = cloneTotals(totals);
  }
  return result;
}

function isDrillGenre(value: unknown): value is DrillGenre {
  return DRILL_GENRE_VALUES.includes(value as DrillGenre);
}

function isDrillGenreSelection(value: unknown): value is DrillGenreSelection {
  return value === 'random' || value === 'weak' || isDrillGenre(value);
}

function isDrillDifficulty(value: unknown): value is DrillDifficulty {
  return DRILL_DIFFICULTY_VALUES.includes(value as DrillDifficulty);
}

function isDrillTimer(value: unknown): value is DrillTimer {
  return DRILL_TIMER_VALUES.includes(value as DrillTimer);
}

/** 累計統計のゼロ値を毎回新しいオブジェクトで返す。 */
export function createEmptyDrillStats(): DrillStatsData {
  const byGenre = {} as Record<DrillGenre, DrillTotals>;
  for (const { value } of DRILL_GENRES) {
    byGenre[value] = emptyTotals();
  }

  const byDifficulty = {} as Record<DrillDifficulty, DrillTotals>;
  for (const { value } of DRILL_DIFFICULTIES) {
    byDifficulty[value] = emptyTotals();
  }

  return {
    total: emptyTotals(),
    byGenre,
    byDifficulty,
  };
}

/** 1回答分を累計へ反映する。入力 stats は破壊しない。 */
export function recordDrillAnswer(
  stats: DrillStatsData,
  genre: DrillGenre,
  difficulty: DrillDifficulty,
  correct: boolean,
): DrillStatsData {
  return {
    total: incrementTotals(stats.total, correct),
    byGenre: {
      ...stats.byGenre,
      [genre]: incrementTotals(stats.byGenre[genre], correct),
    },
    byDifficulty: {
      ...stats.byDifficulty,
      [difficulty]: incrementTotals(stats.byDifficulty[difficulty], correct),
    },
  };
}

export function loadDrillStats(): DrillStatsData {
  try {
    if (typeof localStorage === 'undefined') return createEmptyDrillStats();

    const raw = localStorage.getItem(DRILL_STATS_KEY);
    if (!raw) return createEmptyDrillStats();

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || !isDrillTotals(parsed.total)) return createEmptyDrillStats();

    const byGenre = readTotalsRecord(parsed.byGenre, DRILL_GENRE_VALUES);
    const byDifficulty = readTotalsRecord(parsed.byDifficulty, DRILL_DIFFICULTY_VALUES);
    if (!byGenre || !byDifficulty) return createEmptyDrillStats();

    return {
      total: cloneTotals(parsed.total),
      byGenre,
      byDifficulty,
    };
  } catch {
    return createEmptyDrillStats();
  }
}

export function saveDrillStats(stats: DrillStatsData): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(DRILL_STATS_KEY, JSON.stringify(stats));
  } catch {
    // localStorage が使えない環境や容量超過は UI 側を止めない。
  }
}

export function loadDrillRecent(): string[] {
  try {
    if (typeof localStorage === 'undefined') return [];

    const raw = localStorage.getItem(DRILL_RECENT_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === 'string')) return [];
    return [...parsed];
  } catch {
    return [];
  }
}

export function saveDrillRecent(ids: string[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(DRILL_RECENT_KEY, JSON.stringify(ids));
  } catch {
    // 永続化失敗時もドリル進行は継続する。
  }
}

export function loadDrillPrefs(): DrillPrefs {
  try {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_PREFS };

    const raw = localStorage.getItem(DRILL_PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return { ...DEFAULT_PREFS };

    const { genre, difficulty, timer } = parsed;
    if (!isDrillGenreSelection(genre) || !isDrillDifficulty(difficulty)) return { ...DEFAULT_PREFS };

    return { genre, difficulty, timer: isDrillTimer(timer) ? timer : DEFAULT_PREFS.timer };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function saveDrillPrefs(prefs: DrillPrefs): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(DRILL_PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // 設定保存に失敗しても回答フローは止めない。
  }
}
