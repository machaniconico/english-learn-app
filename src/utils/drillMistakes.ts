import type { DrillQuestion } from './drillTypes';

/** 2回連続正解でマスター(ストアから除去)。 */
export const MISTAKE_MASTER_STREAK = 2;
/** 溜めすぎ防止の上限。超過時は古い(addedAt 昇順)ものから捨てる。 */
export const DRILL_MISTAKES_CAP = 100;

export interface DrillMistake {
  question: DrillQuestion;
  correctStreak: number;
  wrongCount: number;
  addedAt: number;
  lastSeenAt: number;
}

function randomIndex(length: number, rand: () => number): number {
  const index = Math.floor(rand() * length);
  return Math.min(length - 1, Math.max(0, index));
}

function capMistakes(list: DrillMistake[], protectedId: string): DrillMistake[] {
  if (list.length <= DRILL_MISTAKES_CAP) return list;

  const overflow = list.length - DRILL_MISTAKES_CAP;
  const dropIds = new Set(
    list
      .filter((mistake) => mistake.question.id !== protectedId)
      .toSorted((a, b) => a.addedAt - b.addedAt)
      .slice(0, overflow)
      .map((mistake) => mistake.question.id),
  );

  return list.filter((mistake) => !dropIds.has(mistake.question.id));
}

export function addMistake(
  list: DrillMistake[],
  question: DrillQuestion,
  now: number,
): DrillMistake[] {
  const existingIndex = list.findIndex((mistake) => mistake.question.id === question.id);
  const next =
    existingIndex >= 0
      ? list.map((mistake, index) =>
          index === existingIndex
            ? {
                ...mistake,
                question,
                correctStreak: 0,
                wrongCount: mistake.wrongCount + 1,
                lastSeenAt: now,
              }
            : mistake,
        )
      : [
          ...list,
          {
            question,
            correctStreak: 0,
            wrongCount: 1,
            addedAt: now,
            lastSeenAt: now,
          },
        ];

  return capMistakes(next, question.id);
}

export function reviewMistake(
  list: DrillMistake[],
  id: string,
  correct: boolean,
  now: number,
): DrillMistake[] {
  const existingIndex = list.findIndex((mistake) => mistake.question.id === id);
  if (existingIndex < 0) return list;

  const mistake = list[existingIndex];
  if (correct) {
    const correctStreak = mistake.correctStreak + 1;
    if (correctStreak >= MISTAKE_MASTER_STREAK) {
      return list.filter((_, index) => index !== existingIndex);
    }

    return list.map((item, index) =>
      index === existingIndex ? { ...item, correctStreak, lastSeenAt: now } : item,
    );
  }

  return list.map((item, index) =>
    index === existingIndex
      ? {
          ...item,
          correctStreak: 0,
          wrongCount: item.wrongCount + 1,
          lastSeenAt: now,
        }
      : item,
  );
}

export function pickNextMistake(
  list: DrillMistake[],
  recentIds: string[],
  rand: () => number,
): DrillMistake | null {
  if (list.length === 0) return null;

  const recentIdSet = new Set(recentIds);
  const freshMistakes = list.filter((mistake) => !recentIdSet.has(mistake.question.id));
  const candidates = freshMistakes.length > 0 ? freshMistakes : list;

  return candidates[randomIndex(candidates.length, rand)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isValidQuestion(value: unknown): value is DrillQuestion {
  if (!isRecord(value)) return false;
  const correctIndex = value.correctIndex;
  if (
    typeof value.id !== 'string' ||
    typeof value.genre !== 'string' ||
    typeof value.difficulty !== 'string' ||
    typeof value.prompt !== 'string' ||
    !isStringArray(value.options) ||
    typeof correctIndex !== 'number' ||
    !Number.isInteger(correctIndex) ||
    typeof value.explanation !== 'string'
  ) {
    return false;
  }

  if (value.audioText !== undefined && typeof value.audioText !== 'string') return false;

  return correctIndex >= 0 && correctIndex < value.options.length;
}

export function isValidMistake(value: unknown): value is DrillMistake {
  if (!isRecord(value)) return false;

  return (
    isValidQuestion(value.question) &&
    isFiniteNumber(value.correctStreak) &&
    value.correctStreak >= 0 &&
    value.correctStreak < MISTAKE_MASTER_STREAK &&
    isFiniteNumber(value.wrongCount) &&
    value.wrongCount >= 1 &&
    isFiniteNumber(value.addedAt) &&
    isFiniteNumber(value.lastSeenAt)
  );
}
