// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { screen } from '../test/test-utils';
import { renderWithRouter } from '../test/test-utils';
import ScoreEstimator from './ScoreEstimator';

expect.extend(matchers);

// Seed quiz data so the page renders its full (data-present) view rather than
// the "まだデータがありません" empty state. The page reads progress from the
// 'english-learn-progress' localStorage key; one fill-in-blank score is enough
// for `hasData` to be true.
function seedProgress() {
  localStorage.setItem(
    'english-learn-progress',
    JSON.stringify({
      lessons: {},
      fillInBlankScores: { beginner: 80 },
      readingScores: {},
      totalStudyTime: 0,
      streak: 0,
      lastStudyDate: '',
    }),
  );
}

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
