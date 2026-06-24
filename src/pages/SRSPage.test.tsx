// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../test/test-utils';
import SRSPage from './SRSPage';
import type { SRSCard } from '../hooks/useSpacedRepetition';

expect.extend(matchers);

const STORAGE_KEY = 'english-learn-srs';

// ローカル暦日 (実装の toLocalDateStr と同じ規約) を返すヘルパー。
function toLocalDateStr(d: Date): string {
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}
function daysFromToday(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toLocalDateStr(d);
}

function makeStoredCard(overrides: Partial<SRSCard> = {}): SRSCard {
  return {
    id: 'c1',
    english: 'apple',
    japanese: 'りんご',
    pronunciation: 'ˈæpəl',
    source: 'test',
    interval: 5,
    easeFactor: 2.5,
    repetitions: 2,
    nextReview: daysFromToday(0),
    lastReview: '',
    ...overrides,
  };
}

describe('SRSPage a11y', () => {
  it('has no page-local a11y violations on the dashboard (empty state)', async () => {
    const { container } = renderWithRouter(<SRSPage />, { route: '/srs' });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the main heading and an entry-point link', () => {
    renderWithRouter(<SRSPage />, { route: '/srs' });

    expect(
      screen.getByRole('heading', { level: 1, name: 'SRS 間隔反復学習' }),
    ).toBeTruthy();
    // Empty state CTA linking back to lessons
    expect(screen.getByRole('link', { name: 'レッスンを見る' })).toBeTruthy();
  });
});

describe('SRSPage urgency ordering (Round 38)', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it('復習開始時、最も期日の早い(最も超過した)カードが最初に出る', () => {
    const cards: SRSCard[] = [
      makeStoredCard({ id: 'late', english: 'late-word', nextReview: daysFromToday(0) }),
      makeStoredCard({ id: 'early', english: 'early-word', nextReview: daysFromToday(-10) }),
      makeStoredCard({ id: 'mid', english: 'mid-word', nextReview: daysFromToday(-3) }),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));

    renderWithRouter(<SRSPage />, { route: '/srs' });
    fireEvent.click(screen.getByRole('button', { name: '復習を開始' }));

    // 最初に出題されるのは最も期日が早い 'early-word'。
    expect(screen.getByText('early-word')).toBeTruthy();
    expect(screen.queryByText('late-word')).toBeNull();
    expect(screen.queryByText('mid-word')).toBeNull();
  });

  it('カード一覧に超過バッジ(今日 / N日超過)が表示される', () => {
    const cards: SRSCard[] = [
      makeStoredCard({ id: 'today', english: 'today-word', nextReview: daysFromToday(0) }),
      makeStoredCard({ id: 'over', english: 'over-word', nextReview: daysFromToday(-4) }),
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));

    renderWithRouter(<SRSPage />, { route: '/srs' });

    // 今日が期日 → 「今日」バッジ
    expect(screen.getByText('今日')).toBeTruthy();
    // 4日超過 → 「4日超過」バッジ
    expect(screen.getByText('4日超過')).toBeTruthy();
    expect(screen.getByText(/超過/)).toBeTruthy();
  });
});
