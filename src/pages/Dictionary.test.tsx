// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as axeMatchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, waitFor, within } from '../test/test-utils';
import Dictionary from './Dictionary';

expect.extend(axeMatchers);

/**
 * Page-level behavior tests for the Dictionary page.
 *
 * These exercise the REAL data barrel (src/data/dictionary.ts, 501 entries)
 * rendered through the real filter (filterDictionary). The search input is
 * debounced (setTimeout 200ms inside a useEffect), so query-driven assertions
 * use waitFor with a generous timeout rather than fake timers — this keeps the
 * async act() wrapping that RTL provides.
 *
 * Assertions are robust: presence/absence of a known entry and a decreasing
 * count, never brittle exact-count snapshots (except the known full total).
 */

// Reads the integer count from the `N 件の結果` status line.
function getResultCount(): number {
  const status = screen.getByText(/件の結果/);
  const match = status.textContent?.match(/(\d+)/);
  if (!match) throw new Error(`could not parse count from "${status.textContent}"`);
  return Number(match[1]);
}

function typeQuery(value: string): void {
  const search = screen.getByRole('textbox', { name: '英単語を検索' });
  fireEvent.change(search, { target: { value } });
}

describe('Dictionary page', () => {
  it('renders the heading, search box, and the full dictionary count', () => {
    renderWithRouter(<Dictionary />);

    expect(
      screen.getByRole('heading', { level: 1, name: '英和辞書' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '英単語を検索' })).toBeInTheDocument();

    // All 501 entries are present before any filtering.
    expect(getResultCount()).toBe(501);

    // "I" is the very first dictionary entry, visible without "load more".
    expect(
      screen.getByRole('heading', { level: 2, name: 'I' }),
    ).toBeInTheDocument();
  });

  it('narrows the list to matching entries after the debounce when typing a query', async () => {
    renderWithRouter(<Dictionary />);

    const full = getResultCount();
    expect(full).toBe(501);

    typeQuery('dog');

    // After debounce: "dog" surfaces and the result count drops below the full set.
    await waitFor(
      () => {
        expect(getResultCount()).toBeLessThan(full);
      },
      { timeout: 2000 },
    );

    expect(screen.getByRole('heading', { level: 2, name: 'dog' })).toBeInTheDocument();
    // "allocate" (a business word) is not a match for "dog".
    expect(
      screen.queryByRole('heading', { level: 2, name: 'allocate' }),
    ).not.toBeInTheDocument();
  });

  it('shows the empty state for a query that matches nothing', async () => {
    renderWithRouter(<Dictionary />);

    typeQuery('zzzzqqqxx');

    expect(await screen.findByText('検索結果がありません')).toBeInTheDocument();
    await waitFor(() => {
      expect(getResultCount()).toBe(0);
    });
    // The reset affordance is offered in the empty state.
    expect(
      screen.getByRole('button', { name: 'フィルターをリセット' }),
    ).toBeInTheDocument();
  });

  it('narrows results when selecting a category filter, and widens again when cleared', async () => {
    renderWithRouter(<Dictionary />);

    const full = getResultCount();

    // The category chips live in a scrollable row; pick the "動物" (animals) chip.
    const animalsChip = screen.getByRole('button', { name: '動物' });
    fireEvent.click(animalsChip);

    await waitFor(() => {
      expect(getResultCount()).toBeLessThan(full);
    });
    expect(animalsChip).toHaveAttribute('aria-pressed', 'true');
    // "dog" is in 動物 — still present after narrowing.
    expect(screen.getByRole('heading', { level: 2, name: 'dog' })).toBeInTheDocument();

    expect(getResultCount()).toBeGreaterThan(0);

    // Returning to "すべて" restores the full set. There are two "すべて" chips
    // (category + level); the category one comes first in the DOM.
    const allChips = screen.getAllByRole('button', { name: 'すべて' });
    fireEvent.click(allChips[0]);
    await waitFor(() => {
      expect(getResultCount()).toBe(full);
    });
  });

  it('narrows results when selecting a level filter (中級)', async () => {
    renderWithRouter(<Dictionary />);

    const full = getResultCount();

    // Level chips are 「すべて / 初級 / 中級」. Selecting 中級 (intermediate)
    // must drop the count and surface an intermediate-only word.
    fireEvent.click(screen.getByRole('button', { name: '中級' }));

    await waitFor(() => {
      expect(getResultCount()).toBeLessThan(full);
    });

    const intermediateCount = getResultCount();
    expect(intermediateCount).toBeGreaterThan(0);

    // Combine with a query for a known intermediate word ("allocate").
    typeQuery('allocate');

    expect(
      await screen.findByRole('heading', { level: 2, name: 'allocate' }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(getResultCount()).toBeLessThanOrEqual(intermediateCount);
    });
  });

  it('has no detectable axe accessibility violations on initial render', async () => {
    const { container } = renderWithRouter(<Dictionary />);

    const results = await axe(container);
    // axeFindings: none filtered — the page renders clean.
    expect(results).toHaveNoViolations();
  });

  it('exposes the alphabet quick-jump buttons', () => {
    renderWithRouter(<Dictionary />);
    const a = screen.getByRole('button', { name: 'A' });
    expect(a).toHaveAttribute('aria-pressed', 'false');
    expect(within(a).getByText('A')).toBeInTheDocument();
  });
});
