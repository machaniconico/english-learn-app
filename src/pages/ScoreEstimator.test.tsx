// @vitest-environment jsdom
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { sections } from '../data/sections';
import { screen, waitFor } from '../test/test-utils';
import { renderWithRouter } from '../test/test-utils';
import ScoreEstimator, { isScoreEstimate, loadHistory } from './ScoreEstimator';
import { estimateToeicScore } from './scoreEstimate';

vi.mock('./scoreEstimate', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./scoreEstimate')>();
  return {
    ...actual,
    estimateToeicScore: vi.fn(actual.estimateToeicScore),
  };
});

expect.extend(matchers);

const HISTORY_KEY = 'english-learn-score-history';

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

function countCurriculumItems(): number {
  return sections.reduce((sum, s) => {
    return sum + s.categories.reduce((cSum, c) => {
      return cSum + c.lessons.reduce((lSum, l) => lSum + l.items.length, 0);
    }, 0);
  }, 0);
}

type SeedProgressOptions = {
  lessons?: Record<string, { lessonId: string; completedItems: string[]; lastAccessed: number }>;
  fillInBlankScores?: Record<string, number>;
  readingScores?: Record<string, number>;
};

// Seed quiz data so the page renders its full (data-present) view rather than
// the "まだデータがありません" empty state. The page reads progress from the
// 'english-learn-progress' localStorage key; one fill-in-blank score is enough
// for `hasData` to be true.
function seedProgress({
  lessons = {},
  fillInBlankScores = { beginner: 80 },
  readingScores = {},
}: SeedProgressOptions = {}) {
  localStorage.setItem(
    'english-learn-progress',
    JSON.stringify({
      lessons,
      fillInBlankScores,
      readingScores,
      totalStudyTime: 0,
      streak: 0,
      lastStudyDate: '',
      freezeTokens: 0,
    }),
  );
}

describe('loadHistory', () => {
  it('returns an empty array for non-array storage data', () => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ score: 410 }));

    expect(loadHistory()).toEqual([]);
  });

  it('removes entries with missing or non-number fields and keeps valid entries', () => {
    const validEntry = { score: 410, low: 350, high: 470, timestamp: 1_700_000_000_000 };
    const laterValidEntry = { score: 450, low: 390, high: 510, timestamp: 1_700_000_100_000 };
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([
        validEntry,
        { score: 999, low: 900, timestamp: 1_700_000_050_000 },
        { score: '450', low: 390, high: 510, timestamp: 1_700_000_060_000 },
        { score: 470, low: 410, high: 530, timestamp: 'invalid' },
        null,
        laterValidEntry,
      ]),
    );

    expect(loadHistory()).toEqual([validEntry, laterValidEntry]);
  });

  it('identifies ScoreEstimate-shaped values', () => {
    expect(
      isScoreEstimate({ score: 410, low: 350, high: 470, timestamp: 1_700_000_000_000 }),
    ).toBe(true);
    expect(
      isScoreEstimate({ score: 410, low: 350, high: '470', timestamp: 1_700_000_000_000 }),
    ).toBe(false);
  });
});

describe('ScoreEstimator a11y smoke', () => {
  it('renders the score view with a heading and share control', () => {
    seedProgress();
    renderWithRouter(<ScoreEstimator />, { route: '/score' });

    expect(
      screen.getByRole('heading', { level: 1, name: 'TOEIC スコア予測' }),
    ).toBeTruthy();
    // ShareButton (shared component) exposes an accessible "共有" control.
    expect(screen.getByRole('button', { name: '共有' })).toBeTruthy();
  });

  it('has no axe violations', async () => {
    seedProgress();
    const { container } = renderWithRouter(<ScoreEstimator />, { route: '/score' });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('ScoreEstimator estimate', () => {
  it('uses the static curriculum total for the rendered and saved estimate', async () => {
    const curriculumTotal = countCurriculumItems();
    const completedItems = Math.floor(curriculumTotal / 2);
    const fillIn = { beginner: 80, intermediate: 60, advanced: 40 };
    const reading = { beginner: 70, intermediate: 50, advanced: 30 };
    const estimateToeicScoreMock = vi.mocked(estimateToeicScore);

    seedProgress({
      lessons: {
        synthetic: {
          lessonId: 'synthetic',
          completedItems: Array.from({ length: completedItems }, (_, i) => `item-${i}`),
          lastAccessed: 1,
        },
      },
      fillInBlankScores: fillIn,
      readingScores: {
        'reading-beginner-email': reading.beginner,
        'reading-intermediate-ad': reading.intermediate,
        'reading-advanced-double': reading.advanced,
      },
    });

    const expected = estimateToeicScore({
      fillIn,
      reading,
      completedItems,
      totalItems: curriculumTotal,
    });

    renderWithRouter(<ScoreEstimator />, { route: '/score' });

    expect(estimateToeicScoreMock).toHaveBeenLastCalledWith({
      fillIn,
      reading,
      completedItems,
      totalItems: curriculumTotal,
    });
    expect(screen.getByText(`推定スコア: ${expected.low} - ${expected.high}`)).toBeTruthy();
    await waitFor(() => {
      expect(loadHistory()[0]).toEqual(expect.objectContaining(expected));
    });
  });
});
