// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import Part4Page from './Part4Page';

expect.extend(matchers);

describe('Part4Page', () => {
  it('renders the talk list / hero section', () => {
    const { container } = renderWithRouter(<Part4Page />);
    // Hero heading
    expect(screen.getByRole('heading', { name: /Part 4: Talks/i })).toBeTruthy();
    // Subtitle
    expect(screen.getByText(/説明文問題/)).toBeTruthy();
    // Level filter buttons
    expect(screen.getByRole('button', { name: 'All' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Beginner' })).toBeTruthy();
    // Play-all button
    expect(screen.getByRole('button', { name: /全トークに挑戦する/ })).toBeTruthy();
    // Home link
    expect(screen.getByRole('link', { name: /ホームに戻る/ })).toBeTruthy();

    void container; // used in a11y test below
  });

  it('filters talks by level when a filter button is clicked', () => {
    renderWithRouter(<Part4Page />);

    // Click "Beginner" filter
    fireEvent.click(screen.getByRole('button', { name: 'Beginner' }));

    // At least one talk card with level badge "beginner" should be visible
    const beginnerBadges = screen.getAllByText('beginner');
    expect(beginnerBadges.length).toBeGreaterThan(0);

    // "advanced" badge should not appear (all advanced talks hidden)
    expect(screen.queryByText('advanced')).toBeNull();
  });

  it('navigates into a talk and shows the practice UI', () => {
    renderWithRouter(<Part4Page />);

    // Click the first talk card (first "開始する" arrow text — grab first card button)
    const startLinks = screen.getAllByText(/開始する/);
    fireEvent.click(startLinks[0].closest('button') as HTMLElement);

    // Should now show "Part 4 Talk" heading and back button
    expect(screen.getByRole('heading', { name: /Part 4 Talk/i })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /問題一覧に戻る/ }).length).toBeGreaterThan(0);

    // Should show Play Talk button from TalkListening
    expect(screen.getByRole('button', { name: /Play Talk/ })).toBeTruthy();

    // Click back — should return to list
    fireEvent.click(screen.getAllByRole('button', { name: /問題一覧に戻る/ })[0]);
    expect(screen.getByRole('heading', { name: /Part 4: Talks/i })).toBeTruthy();
  });

  it('has no axe accessibility violations on the talk list', async () => {
    const { container } = renderWithRouter(<Part4Page />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
