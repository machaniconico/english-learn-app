// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as axeMatchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, waitFor, within } from '../test/test-utils';
import Dictionary from './Dictionary';
import { STORAGE_KEY, type RecentWord } from '../hooks/useRecentWords';

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

  describe('最近調べた単語', () => {
    beforeEach(() => {
      // setup.ts の afterEach で localStorage を掃除してくれるが、
      // シード投入テストの前で明示的に空にしておく。
      localStorage.clear();
    });

    it('localStorage にシードした最近調べた単語がデフォルト表示でチップとして出る', () => {
      const seeded: RecentWord[] = [
        { id: 'dog-id', english: 'dog', japanese: '犬' },
        { id: 'cat-id', english: 'cat', japanese: '猫' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      renderWithRouter(<Dictionary />);

      // デフォルト表示(検索・フィルタすべて未選択)なのでチップが表示される
      expect(screen.getByRole('button', { name: 'dog を検索' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'cat を検索' })).toBeInTheDocument();
      // セクション見出しとクリアボタンも出る
      expect(screen.getByRole('heading', { level: 2, name: '最近調べた単語' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '最近調べた単語をクリア' }),
      ).toBeInTheDocument();
    });

    it('チップをクリックすると検索語に反映され、デバウンス後に絞り込まれる', async () => {
      const seeded: RecentWord[] = [
        { id: 'dog-id', english: 'dog', japanese: '犬' },
        { id: 'cat-id', english: 'cat', japanese: '猫' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      renderWithRouter(<Dictionary />);
      const full = getResultCount();
      expect(full).toBe(501);

      fireEvent.click(screen.getByRole('button', { name: 'dog を検索' }));

      // 検索入力へ直ちに反映される
      expect(screen.getByRole('textbox', { name: '英単語を検索' })).toHaveValue('dog');

      // デバウンス後に結果が絞り込まれる
      await waitFor(
        () => {
          expect(getResultCount()).toBeLessThan(full);
        },
        { timeout: 2000 },
      );
      expect(screen.getByRole('heading', { level: 2, name: 'dog' })).toBeInTheDocument();
    });

    it('クリアボタンを押すと最近調べた単語のチップがすべて消える', () => {
      const seeded: RecentWord[] = [
        { id: 'dog-id', english: 'dog', japanese: '犬' },
        { id: 'cat-id', english: 'cat', japanese: '猫' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      renderWithRouter(<Dictionary />);
      expect(screen.getByRole('button', { name: 'dog を検索' })).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '最近調べた単語をクリア' }));

      // セクションごと非表示になる(チップも見出しもクリアボタンも消える)
      expect(screen.queryByRole('button', { name: 'dog を検索' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'cat を検索' })).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { level: 2, name: '最近調べた単語' }),
      ).not.toBeInTheDocument();
      // localStorage 上も空になっている
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([]);
    });

    it('単語カードの発音ボタンを再生すると最近調べた単語に記録される', async () => {
      renderWithRouter(<Dictionary />);

      // 初期状態では最近調べた単語セクションは無い
      expect(
        screen.queryByRole('heading', { level: 2, name: '最近調べた単語' }),
      ).not.toBeInTheDocument();

      // 最初の見出し "I" の発音ボタン(カード内で最初の 音声を再生)を再生する
      const playButtons = screen.getAllByRole('button', { name: '音声を再生' });
      fireEvent.click(playButtons[0]);

      // onPlayed 経由で "I" が最近調べた単語に記録され、チップが現れる
      expect(await screen.findByRole('button', { name: 'I を検索' })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: '最近調べた単語' }),
      ).toBeInTheDocument();
    });

    it('検索語が入力されているときは最近調べた単語セクションを表示しない', async () => {
      const seeded: RecentWord[] = [
        { id: 'dog-id', english: 'dog', japanese: '犬' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      renderWithRouter(<Dictionary />);
      expect(screen.getByRole('button', { name: 'dog を検索' })).toBeInTheDocument();

      typeQuery('dog');

      // デバウンス後にデフォルト表示でなくなるのでセクションが消える
      await waitFor(
        () => {
          expect(screen.queryByRole('button', { name: 'dog を検索' })).not.toBeInTheDocument();
        },
        { timeout: 2000 },
      );
    });

    it('カテゴリーフィルターが選択されているときは最近調べた単語セクションを表示しない', () => {
      const seeded: RecentWord[] = [
        { id: 'dog-id', english: 'dog', japanese: '犬' },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      renderWithRouter(<Dictionary />);
      expect(screen.getByRole('button', { name: 'dog を検索' })).toBeInTheDocument();

      // 動物カテゴリーを選ぶとデフォルト表示でなくなるのでセクションが消える
      fireEvent.click(screen.getByRole('button', { name: '動物' }));
      expect(screen.queryByRole('button', { name: 'dog を検索' })).not.toBeInTheDocument();
    });
  });
});
