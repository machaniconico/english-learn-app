// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import DailyReviewPage from './DailyReviewPage';

expect.extend(matchers);

beforeEach(() => {
  localStorage.clear();
});

describe('DailyReviewPage', () => {
  it('shows the empty state when nothing is due', () => {
    renderWithRouter(<DailyReviewPage />);
    expect(screen.getByText('今日の復習はありません！')).toBeTruthy();
    expect(screen.queryByRole('button', { name: '答えを見る' })).toBeNull();
  });

  it('renders the review flow when an SRS card is due', () => {
    const dueCard = {
      id: 'c1',
      english: 'apple',
      japanese: 'りんご',
      pronunciation: 'アップル',
      source: 'src',
      interval: 1,
      easeFactor: 2.5,
      repetitions: 1,
      nextReview: '2000-01-01', // long past -> due
      lastReview: '1999-12-31',
    };
    localStorage.setItem('english-learn-srs', JSON.stringify([dueCard]));

    renderWithRouter(<DailyReviewPage />);
    expect(screen.getByText('りんご')).toBeTruthy();
    expect(screen.getByRole('button', { name: '答えを見る' })).toBeTruthy();
    expect(screen.queryByText('今日の復習はありません！')).toBeNull();
  });

  it('has no axe accessibility violations (empty state)', async () => {
    const { container } = renderWithRouter(<DailyReviewPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
