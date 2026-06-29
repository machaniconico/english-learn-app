import { describe, it, expect } from 'vitest';
import { quizCategoryBreakdown } from './quizCategoryBreakdown';
import type { DailyQuizQuestion } from '../data/dailyQuiz';

function q(
  id: string,
  category: DailyQuizQuestion['category'],
  correctIndex: number,
): DailyQuizQuestion {
  return {
    id,
    difficulty: 'beginner',
    question: `Q ${id}`,
    questionJa: `問 ${id}`,
    options: ['a', 'b', 'c', 'd'],
    correctIndex,
    explanation: 'because',
    category,
  };
}

describe('quizCategoryBreakdown', () => {
  it('空入力では空配列を返す', () => {
    expect(quizCategoryBreakdown([], [])).toEqual([]);
  });

  it('カテゴリごとに total と correct を集計する', () => {
    const questions = [
      q('1', '語彙', 0),
      q('2', '文法', 1),
      q('3', '語彙', 2),
    ];
    const answers = [0, 3, 2]; // 語彙2問中2問正解、文法1問中0問正解
    const result = quizCategoryBreakdown(questions, answers);
    expect(result).toEqual([
      { category: '語彙', correct: 2, total: 2 },
      { category: '文法', correct: 0, total: 1 },
    ]);
  });

  it('カテゴリは初出順に並ぶ', () => {
    const questions = [q('1', '時制', 0), q('2', '熟語', 0), q('3', '時制', 0)];
    const result = quizCategoryBreakdown(questions, [0, 0, 0]);
    expect(result.map((s) => s.category)).toEqual(['時制', '熟語']);
  });

  it('未回答(null)は不正解として total のみ加算する', () => {
    const questions = [q('1', '前置詞', 1), q('2', '前置詞', 2)];
    const answers = [null, 2];
    expect(quizCategoryBreakdown(questions, answers)).toEqual([
      { category: '前置詞', correct: 1, total: 2 },
    ]);
  });

  it('answers が短い場合は min 長で安全に処理する', () => {
    const questions = [q('1', '語彙', 0), q('2', '文法', 0)];
    const answers = [0]; // 1問分のみ
    expect(quizCategoryBreakdown(questions, answers)).toEqual([
      { category: '語彙', correct: 1, total: 1 },
    ]);
  });

  it('入力配列を破壊しない', () => {
    const questions = [q('1', '語彙', 0)];
    const answers = [0];
    quizCategoryBreakdown(questions, answers);
    expect(questions).toHaveLength(1);
    expect(answers).toEqual([0]);
  });
});
