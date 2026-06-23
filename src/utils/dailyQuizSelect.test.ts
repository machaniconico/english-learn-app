import { describe, it, expect } from 'vitest';
import {
  seededRandom,
  shuffleWith,
  selectDailyQuiz,
  getTodayString,
  DAILY_QUIZ_COUNT,
} from './dailyQuizSelect';
import {
  dailyQuizQuestions,
  getQuestionsByDifficulty,
  type DailyQuizQuestion,
  type QuizDifficulty,
} from '../data/dailyQuiz';

function makePool(prefix: string, n: number, difficulty: QuizDifficulty = 'beginner'): DailyQuizQuestion[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `${prefix}-${i}`,
    difficulty,
    question: `Q${i} _____ ?`,
    questionJa: `問題${i}`,
    options: ['a', 'b', 'c', 'd'],
    correctIndex: 0,
    explanation: `解説${i}`,
    category: '語彙',
  }));
}

describe('seededRandom', () => {
  it('同じシードからは同じ乱数列を返す(決定的)', () => {
    const a = seededRandom('2026-06-23-beginner');
    const b = seededRandom('2026-06-23-beginner');
    const seqA = [a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('異なるシードからは異なる乱数列になる', () => {
    const a = seededRandom('2026-06-23-beginner');
    const b = seededRandom('2026-06-24-beginner');
    expect([a(), a(), a()]).not.toEqual([b(), b(), b()]);
  });

  it('生成値は 0 以上 1 未満', () => {
    const r = seededRandom('seed');
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('shuffleWith', () => {
  it('元の配列を破壊しない', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffleWith(original, seededRandom('x'));
    expect(original).toEqual(copy);
  });

  it('同じ要素をすべて保持する(順序だけ変える)', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const shuffled = shuffleWith(arr, seededRandom('seed'));
    expect([...shuffled].sort((a, b) => a - b)).toEqual(arr);
  });

  it('同じ乱数生成器シードなら同じ並びになる', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const s1 = shuffleWith(arr, seededRandom('same'));
    const s2 = shuffleWith(arr, seededRandom('same'));
    expect(s1).toEqual(s2);
  });
});

describe('selectDailyQuiz', () => {
  it('既定で DAILY_QUIZ_COUNT(10)問を返す', () => {
    const pool = makePool('p', 20);
    const result = selectDailyQuiz('beginner', '2026-06-23', DAILY_QUIZ_COUNT, pool);
    expect(result).toHaveLength(10);
  });

  it('同じ日付・難易度なら毎回同じ問題・同じ並びを返す(決定的)', () => {
    const pool = makePool('p', 20);
    const a = selectDailyQuiz('beginner', '2026-06-23', 10, pool);
    const b = selectDailyQuiz('beginner', '2026-06-23', 10, pool);
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
  });

  it('日付が変わると別の問題セットになる', () => {
    const pool = makePool('p', 20);
    const day1 = selectDailyQuiz('beginner', '2026-06-23', 10, pool).map((q) => q.id);
    const day2 = selectDailyQuiz('beginner', '2026-06-24', 10, pool).map((q) => q.id);
    expect(day1).not.toEqual(day2);
  });

  it('難易度が変わると別のシードになる', () => {
    const pool = makePool('p', 20);
    const easy = selectDailyQuiz('beginner', '2026-06-23', 10, pool).map((q) => q.id);
    const hard = selectDailyQuiz('advanced', '2026-06-23', 10, pool).map((q) => q.id);
    expect(easy).not.toEqual(hard);
  });

  it('重複なく問題を返す', () => {
    const pool = makePool('p', 20);
    const result = selectDailyQuiz('beginner', '2026-06-23', 10, pool);
    const ids = result.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('プールが要求数より少なければプール数だけ返す', () => {
    const pool = makePool('p', 6);
    const result = selectDailyQuiz('beginner', '2026-06-23', 10, pool);
    expect(result).toHaveLength(6);
  });

  it('プールが空なら空配列を返す', () => {
    const result = selectDailyQuiz('beginner', '2026-06-23', 10, []);
    expect(result).toEqual([]);
  });
});

describe('getTodayString', () => {
  it('YYYY-MM-DD 形式で返し、月日はゼロ埋めする', () => {
    expect(getTodayString(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(getTodayString(new Date(2026, 11, 31))).toBe('2026-12-31');
  });
});

describe('問題バンクの健全性', () => {
  const difficulties: QuizDifficulty[] = ['beginner', 'intermediate', 'advanced'];

  it('各難易度に最低10問ある(デイリー10問を満たせる)', () => {
    for (const d of difficulties) {
      expect(getQuestionsByDifficulty(d).length).toBeGreaterThanOrEqual(10);
    }
  });

  it('全問のIDが一意である', () => {
    const ids = dailyQuizQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('各問は4択で correctIndex が範囲内', () => {
    for (const q of dailyQuizQuestions) {
      expect(q.options).toHaveLength(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
    }
  });

  it('各問に空でない解説と問題文・和訳がある', () => {
    for (const q of dailyQuizQuestions) {
      expect(q.explanation.trim().length).toBeGreaterThan(0);
      expect(q.question.trim().length).toBeGreaterThan(0);
      expect(q.questionJa.trim().length).toBeGreaterThan(0);
    }
  });

  it('選択肢に重複がない', () => {
    for (const q of dailyQuizQuestions) {
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  });
});
