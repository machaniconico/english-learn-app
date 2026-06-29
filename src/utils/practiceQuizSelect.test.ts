import { describe, it, expect } from 'vitest';
import {
  practiceCountOptions,
  pickPracticeQuestions,
  PRACTICE_COUNT_STEP,
} from './practiceQuizSelect';
import { seededRandom } from './dailyQuizSelect';
import type { DailyQuizQuestion } from '../data/dailyQuiz';

function makeQuestion(id: string): DailyQuizQuestion {
  return {
    id,
    difficulty: 'beginner',
    question: `Q ${id}`,
    questionJa: `問 ${id}`,
    options: ['a', 'b', 'c', 'd'],
    correctIndex: 0,
    explanation: 'because',
    category: '語彙',
  };
}

function makePool(n: number): DailyQuizQuestion[] {
  return Array.from({ length: n }, (_, i) => makeQuestion(`q${i}`));
}

describe('practiceCountOptions', () => {
  it('returns multiples of the step up to the pool size', () => {
    expect(practiceCountOptions(20)).toEqual([10, 20]);
    expect(practiceCountOptions(60)).toEqual([10, 20, 30, 40, 50, 60]);
    expect(PRACTICE_COUNT_STEP).toBe(10);
  });

  it('does not exceed the pool size (no partial step beyond pool)', () => {
    expect(practiceCountOptions(25)).toEqual([10, 20]);
  });

  it('falls back to the whole pool when smaller than one step', () => {
    expect(practiceCountOptions(7)).toEqual([7]);
  });

  it('returns an empty list for an empty pool', () => {
    expect(practiceCountOptions(0)).toEqual([]);
    expect(practiceCountOptions(-3)).toEqual([]);
  });
});

describe('pickPracticeQuestions', () => {
  it('returns exactly count questions when the pool is large enough', () => {
    const pool = makePool(60);
    const picked = pickPracticeQuestions(pool, 20, seededRandom('seed-a'));
    expect(picked).toHaveLength(20);
    // all picked items come from the pool and are unique
    const ids = new Set(picked.map((q) => q.id));
    expect(ids.size).toBe(20);
  });

  it('caps at the pool size when count exceeds it', () => {
    const pool = makePool(20);
    const picked = pickPracticeQuestions(pool, 50, seededRandom('seed-b'));
    expect(picked).toHaveLength(20);
  });

  it('is deterministic for the same seed and varies across seeds', () => {
    const pool = makePool(60);
    const a1 = pickPracticeQuestions(pool, 10, seededRandom('same')).map((q) => q.id);
    const a2 = pickPracticeQuestions(pool, 10, seededRandom('same')).map((q) => q.id);
    const b = pickPracticeQuestions(pool, 10, seededRandom('different')).map((q) => q.id);
    expect(a1).toEqual(a2);
    expect(a1).not.toEqual(b);
  });

  it('does not mutate the source pool', () => {
    const pool = makePool(10);
    const before = pool.map((q) => q.id);
    pickPracticeQuestions(pool, 5, seededRandom('x'));
    expect(pool.map((q) => q.id)).toEqual(before);
  });

  it('returns empty for empty pool or non-positive count', () => {
    expect(pickPracticeQuestions([], 10, seededRandom('y'))).toEqual([]);
    expect(pickPracticeQuestions(makePool(10), 0, seededRandom('y'))).toEqual([]);
  });
});
