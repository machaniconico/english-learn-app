// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import WeakPointsPage from './WeakPointsPage';

expect.extend(matchers);

const STORAGE_KEY = 'english-learn-weak-points';

function seedWeakPoints() {
  const items = [
    {
      id: 'wp-1',
      type: 'fill-in-blank',
      question: { sentence: 'The meeting will ___ at 3 PM.' },
      wrongAnswer: 'begins',
      correctAnswer: 'begin',
      timestamp: 1700000000000,
      reviewCount: 1,
      lastCorrect: false,
    },
    {
      id: 'wp-2',
      type: 'part2',
      question: { question: 'How was the conference?' },
      wrongAnswer: 'At 5 PM.',
      correctAnswer: 'It was great.',
      timestamp: 1700000100000,
      reviewCount: 3,
      lastCorrect: true,
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

describe('WeakPointsPage a11y', () => {
  beforeEach(() => {
    seedWeakPoints();
  });

  it('has no axe violations when weak points are present', async () => {
    const { container } = renderWithRouter(<WeakPointsPage />, { route: '/weak-points' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the page heading and a delete control', () => {
    renderWithRouter(<WeakPointsPage />, { route: '/weak-points' });
    expect(screen.getByRole('heading', { level: 1, name: '弱点克服' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: '削除' }).length).toBeGreaterThan(0);
  });
});
