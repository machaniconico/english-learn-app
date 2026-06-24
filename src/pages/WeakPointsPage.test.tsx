// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { fireEvent } from '@testing-library/react';
import { renderWithRouter, screen, within } from '../test/test-utils';
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

function seedThree() {
  // Three weak points with distinct timestamps + reviewCounts.
  // wp-old: oldest, reviewCount 5 (most reviewed), not mastered.
  // wp-mid: middle, reviewCount 1, mastered (lastCorrect && reviewCount>=3? no — reviewCount 1) -> not mastered.
  // wp-new: newest, reviewCount 4, mastered (lastCorrect true).
  const items = [
    {
      id: 'wp-old',
      type: 'fill-in-blank',
      question: { sentence: 'OLD sentence' },
      wrongAnswer: 'w1',
      correctAnswer: 'c1',
      timestamp: 1000,
      reviewCount: 5,
      lastCorrect: false,
    },
    {
      id: 'wp-mid',
      type: 'fill-in-blank',
      question: { sentence: 'MID sentence' },
      wrongAnswer: 'w2',
      correctAnswer: 'c2',
      timestamp: 2000,
      reviewCount: 1,
      lastCorrect: false,
    },
    {
      id: 'wp-new',
      type: 'fill-in-blank',
      question: { sentence: 'NEW sentence' },
      wrongAnswer: 'w3',
      correctAnswer: 'c3',
      timestamp: 3000,
      reviewCount: 4,
      lastCorrect: true,
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Read the order of question sentences as rendered.
function renderedSentenceOrder(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('p'))
    .map((p) => p.textContent ?? '')
    .filter((t) => /(OLD|MID|NEW) sentence/.test(t));
}

describe('WeakPointsPage sort + unmastered filter', () => {
  beforeEach(() => {
    localStorage.clear();
    seedThree();
  });

  it('changes order via the sort select (most reviewed first)', () => {
    const { container } = renderWithRouter(<WeakPointsPage />, { route: '/weak-points' });

    // Default newest: NEW, MID, OLD
    expect(renderedSentenceOrder(container)).toEqual([
      'NEW sentence',
      'MID sentence',
      'OLD sentence',
    ]);

    const select = screen.getByLabelText('並べ替え') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'mostReviewed' } });

    // reviewCount desc: OLD(5), NEW(4), MID(1)
    expect(renderedSentenceOrder(container)).toEqual([
      'OLD sentence',
      'NEW sentence',
      'MID sentence',
    ]);
  });

  it('hides mastered items when "未習得のみ表示" is toggled on', () => {
    const { container } = renderWithRouter(<WeakPointsPage />, { route: '/weak-points' });
    expect(renderedSentenceOrder(container)).toHaveLength(3);

    const toggle = screen.getByLabelText('未習得のみ表示') as HTMLInputElement;
    fireEvent.click(toggle);

    // wp-new is mastered -> removed.
    const order = renderedSentenceOrder(container);
    expect(order).toHaveLength(2);
    expect(order).not.toContain('NEW sentence');
  });

  it('shows a dedicated empty state when filters match nothing', () => {
    // Seed a single mastered-only item, then filter to unmastered.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'only',
          type: 'fill-in-blank',
          question: { sentence: 'ONLY sentence' },
          wrongAnswer: 'w',
          correctAnswer: 'c',
          timestamp: 5000,
          reviewCount: 3,
          lastCorrect: true,
        },
      ]),
    );
    const { container } = renderWithRouter(<WeakPointsPage />, { route: '/weak-points' });

    const toggle = screen.getByLabelText('未習得のみ表示') as HTMLInputElement;
    fireEvent.click(toggle);

    expect(within(container).getByText('条件に合う弱点がありません')).toBeTruthy();
  });
});
