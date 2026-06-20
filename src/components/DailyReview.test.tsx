// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import DailyReview from './DailyReview';
import type { ReviewItem } from '../utils/reviewQueue';
import type { SRSCard } from '../hooks/useSpacedRepetition';
import type { WeakPoint } from '../hooks/useWeakPoints';

expect.extend(matchers);

const srsCard: SRSCard = {
  id: 'card-1',
  english: 'apple',
  japanese: 'りんご',
  pronunciation: 'アップル',
  source: 'src',
  interval: 1,
  easeFactor: 2.5,
  repetitions: 1,
  nextReview: '2026-01-01',
  lastReview: '2025-12-31',
};

const weakPoint: WeakPoint = {
  id: 'wp-1',
  type: 'fill-in-blank',
  question: {},
  wrongAnswer: 'go',
  correctAnswer: 'went',
  timestamp: 0,
  reviewCount: 0,
  lastCorrect: false,
};

const items: ReviewItem[] = [
  { kind: 'srs', id: 'srs-card-1', card: srsCard },
  { kind: 'weak', id: 'weak-wp-1', weak: weakPoint },
];

describe('DailyReview', () => {
  it('shows the SRS prompt (japanese), flips to the english answer, and rates with SM-2 quality', () => {
    const onReviewSrs = vi.fn();
    const onReviewWeak = vi.fn();
    renderWithRouter(
      <DailyReview items={items} onReviewSrs={onReviewSrs} onReviewWeak={onReviewWeak} />,
    );

    // Front: japanese prompt, english hidden
    expect(screen.getByText('りんご')).toBeTruthy();
    expect(screen.queryByText('apple')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '答えを見る' }));
    expect(screen.getByText('apple')).toBeTruthy();

    // Rate "普通" -> quality 4, calls back with the underlying card id (not the queue id)
    fireEvent.click(screen.getByRole('button', { name: '普通' }));
    expect(onReviewSrs).toHaveBeenCalledWith('card-1', 4);
  });

  it('advances to the weak point, reveals the correct answer, and records the result', () => {
    const onReviewSrs = vi.fn();
    const onReviewWeak = vi.fn();
    renderWithRouter(
      <DailyReview items={items} onReviewSrs={onReviewSrs} onReviewWeak={onReviewWeak} />,
    );

    // Clear the SRS card first
    fireEvent.click(screen.getByRole('button', { name: '答えを見る' }));
    fireEvent.click(screen.getByRole('button', { name: '簡単' }));

    // Now the weak point: shows the previous wrong answer, correct answer hidden
    expect(screen.getByText('go')).toBeTruthy();
    expect(screen.queryByText('went')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: '答えを見る' }));
    expect(screen.getByText('went')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'できた' }));
    expect(onReviewWeak).toHaveBeenCalledWith('wp-1', true);
  });

  it('shows a completion screen after the last item', () => {
    renderWithRouter(
      <DailyReview items={items} onReviewSrs={vi.fn()} onReviewWeak={vi.fn()} />,
    );
    // srs
    fireEvent.click(screen.getByRole('button', { name: '答えを見る' }));
    fireEvent.click(screen.getByRole('button', { name: '簡単' }));
    // weak
    fireEvent.click(screen.getByRole('button', { name: '答えを見る' }));
    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));

    expect(screen.getByText('復習完了！')).toBeTruthy();
    expect(screen.getByText(/2件の復習を終えました/)).toBeTruthy();
  });

  it('marks a weak point incorrect when "もう一度" is chosen', () => {
    const onReviewWeak = vi.fn();
    renderWithRouter(
      <DailyReview
        items={[{ kind: 'weak', id: 'weak-wp-1', weak: weakPoint }]}
        onReviewSrs={vi.fn()}
        onReviewWeak={onReviewWeak}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '答えを見る' }));
    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));
    expect(onReviewWeak).toHaveBeenCalledWith('wp-1', false);
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(
      <DailyReview items={items} onReviewSrs={vi.fn()} onReviewWeak={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
