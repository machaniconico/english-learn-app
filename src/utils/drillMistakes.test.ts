import { describe, expect, it } from 'vitest';
import type { DrillQuestion } from './drillTypes';
import {
  addMistake,
  DRILL_MISTAKES_CAP,
  isValidMistake,
  pickNextMistake,
  reviewMistake,
  type DrillMistake,
} from './drillMistakes';

function makeQuestion(id: string, overrides: Partial<DrillQuestion> = {}): DrillQuestion {
  return {
    id,
    genre: 'vocab',
    difficulty: 'beginner',
    prompt: `Prompt ${id}`,
    options: ['a', 'b', 'c', 'd'],
    correctIndex: 1,
    explanation: `Explanation ${id}`,
    ...overrides,
  };
}

function makeMistake(
  id: string,
  overrides: Partial<Omit<DrillMistake, 'question'>> & { question?: DrillQuestion } = {},
): DrillMistake {
  return {
    question: overrides.question ?? makeQuestion(id),
    correctStreak: 0,
    wrongCount: 1,
    addedAt: 1000,
    lastSeenAt: 1000,
    ...overrides,
  };
}

describe('addMistake', () => {
  it('adds a new mistake with initial counters and timestamps', () => {
    const now = 12345;
    const question = makeQuestion('q1');

    const next = addMistake([], question, now);

    expect(next).toEqual([
      {
        question,
        correctStreak: 0,
        wrongCount: 1,
        addedAt: now,
        lastSeenAt: now,
      },
    ]);
  });

  it('updates an existing mistake without changing addedAt or position', () => {
    const firstQuestion = makeQuestion('q1', { options: ['old-a', 'old-b'] });
    const updatedQuestion = makeQuestion('q1', { options: ['new-a', 'new-b'] });
    const other = makeMistake('q2', { addedAt: 500, lastSeenAt: 500 });
    const list = [
      makeMistake('q1', {
        question: firstQuestion,
        correctStreak: 1,
        wrongCount: 3,
        addedAt: 100,
        lastSeenAt: 200,
      }),
      other,
    ];

    const next = addMistake(list, updatedQuestion, 999);

    expect(next).toHaveLength(2);
    expect(next[0]).toEqual({
      question: updatedQuestion,
      correctStreak: 0,
      wrongCount: 4,
      addedAt: 100,
      lastSeenAt: 999,
    });
    expect(next[1]).toBe(other);
  });

  it('drops the oldest mistake over the cap while keeping the newly added id', () => {
    const list = Array.from({ length: DRILL_MISTAKES_CAP }, (_, index) =>
      makeMistake(`old-${index}`, {
        addedAt: index,
        lastSeenAt: index,
      }),
    );

    const next = addMistake(list, makeQuestion('newest'), 10000);

    expect(next).toHaveLength(DRILL_MISTAKES_CAP);
    expect(next.some((mistake) => mistake.question.id === 'old-0')).toBe(false);
    expect(next.some((mistake) => mistake.question.id === 'newest')).toBe(true);
  });

  it('does not mutate the input list or existing mistake object', () => {
    const original = makeMistake('q1', {
      correctStreak: 1,
      wrongCount: 2,
      addedAt: 100,
      lastSeenAt: 200,
    });
    const list = [original];

    const next = addMistake(list, makeQuestion('q1', { prompt: 'Updated' }), 300);

    expect(list).toHaveLength(1);
    expect(list[0]).toEqual(original);
    expect(next).not.toBe(list);
    expect(next[0]).not.toBe(original);
  });
});

describe('reviewMistake', () => {
  it('increments correctStreak on first correct review without removing the item', () => {
    const list = [makeMistake('q1')];

    const next = reviewMistake(list, 'q1', true, 2000);

    expect(next).toHaveLength(1);
    expect(next[0]).toMatchObject({ correctStreak: 1, lastSeenAt: 2000 });
  });

  it('removes a mistake after the second consecutive correct review', () => {
    const list = [makeMistake('q1', { correctStreak: 1 }), makeMistake('q2')];

    const next = reviewMistake(list, 'q1', true, 2000);

    expect(next.map((mistake) => mistake.question.id)).toEqual(['q2']);
  });

  it('resets correctStreak and increments wrongCount after an incorrect review', () => {
    const list = [makeMistake('q1', { correctStreak: 1, wrongCount: 2 })];

    const next = reviewMistake(list, 'q1', false, 3000);

    expect(next[0]).toMatchObject({
      correctStreak: 0,
      wrongCount: 3,
      lastSeenAt: 3000,
    });
  });

  it('returns the same list reference when the id does not exist', () => {
    const existing = makeMistake('q1');
    const list = [existing];

    const next = reviewMistake(list, 'missing', true, 4000);

    expect(next).toBe(list);
    expect(next[0]).toBe(existing);
  });
});

describe('pickNextMistake', () => {
  it('returns null for an empty list', () => {
    expect(pickNextMistake([], [], () => 0)).toBeNull();
  });

  it('prefers candidates not included in recentIds', () => {
    const list = [makeMistake('q1'), makeMistake('q2'), makeMistake('q3')];

    const picked = pickNextMistake(list, ['q1'], () => 0.75);

    expect(picked?.question.id).toBe('q3');
  });

  it('falls back to the full list when all mistakes are recent', () => {
    const list = [makeMistake('q1'), makeMistake('q2')];

    const picked = pickNextMistake(list, ['q1', 'q2'], () => 0.5);

    expect(picked?.question.id).toBe('q2');
  });
});

describe('isValidMistake', () => {
  it('returns true for a valid mistake shape', () => {
    expect(isValidMistake(makeMistake('q1'))).toBe(true);
  });

  it('returns false when question is missing', () => {
    const value = {
      correctStreak: 0,
      wrongCount: 1,
      addedAt: 100,
      lastSeenAt: 100,
    };

    expect(isValidMistake(value)).toBe(false);
  });

  it('returns false when numeric fields are not numbers', () => {
    expect(
      isValidMistake({
        ...makeMistake('q1'),
        wrongCount: '1',
      }),
    ).toBe(false);
  });
});
