import { describe, it, expect } from 'vitest';
import { computeLevelFromAnswers } from './useUserLevel';
import { levelTestQuestions } from '../data/levelTest';
import type { CEFRLevel } from './useUserLevel';

// In the diagnostic data, every correct answer is at correctIndex 0.
// So answering 0 = correct, answering a non-zero index = wrong.
const CORRECT = 0;
const WRONG = 1;

function questionsForLevel(level: CEFRLevel) {
  return levelTestQuestions.filter((q) => q.level === level);
}

/**
 * Build an answers map. For each level, answer the first `correctCount`
 * questions correctly and the rest wrong. Levels not present in `plan`
 * are left unanswered.
 */
function buildAnswers(plan: Partial<Record<CEFRLevel, number>>): Record<string, number> {
  const answers: Record<string, number> = {};
  for (const [level, correctCount] of Object.entries(plan) as [CEFRLevel, number][]) {
    const qs = questionsForLevel(level);
    qs.forEach((q, i) => {
      answers[q.id] = i < correctCount ? CORRECT : WRONG;
    });
  }
  return answers;
}

describe('computeLevelFromAnswers', () => {
  it('perfect score on every level yields the top reachable level (C1)', () => {
    const answers: Record<string, number> = {};
    for (const q of levelTestQuestions) {
      answers[q.id] = CORRECT;
    }
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('C1');
    // Sanity: each level tallied 5/5.
    for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]) {
      expect(result.scoreByLevel[lvl]).toEqual({ correct: 5, total: 5 });
    }
  });

  it('all-wrong answers yield the lowest level (A1)', () => {
    const answers: Record<string, number> = {};
    for (const q of levelTestQuestions) {
      answers[q.id] = WRONG;
    }
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('A1');
    expect(result.scoreByLevel.A1).toEqual({ correct: 0, total: 5 });
  });

  it('passes A1 and A2 (3/5 each) but fails B1 (2/5) -> A2', () => {
    const answers = buildAnswers({ A1: 3, A2: 3, B1: 2 });
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('A2');
    expect(result.scoreByLevel.A1.correct).toBe(3);
    expect(result.scoreByLevel.A2.correct).toBe(3);
    expect(result.scoreByLevel.B1.correct).toBe(2);
  });

  it('passes A1/A2/B1 (5/5 each) but fails B2 (0/5) -> B1', () => {
    const answers = buildAnswers({ A1: 5, A2: 5, B1: 5, B2: 0 });
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('B1');
    expect(result.scoreByLevel.B1.correct).toBe(5);
    expect(result.scoreByLevel.B2.correct).toBe(0);
  });

  it('stops at the first failed level even if a later level would pass (A1 pass, A2 fail) -> A1', () => {
    // A2 fails (break) so B1 success is never reached.
    const answers = buildAnswers({ A1: 5, A2: 2, B1: 5 });
    const result = computeLevelFromAnswers(answers);
    expect(result.level).toBe('A1');
  });
});
