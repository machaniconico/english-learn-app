// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import {
  renderWithRouter,
  screen,
  fireEvent,
  waitFor,
  within,
} from '../test/test-utils';
import SearchPage from './SearchPage';

expect.extend(matchers);

// "you" is a very common English token across the real content barrels
// (phrases / grammar / toeic / dictionary all contain it), so searching it
// reliably surfaces matches in multiple groups. Assertions stay robust to the
// real dataset: we assert "at least one result" / counts > 0, never exact counts.
const COMMON_QUERY = 'you';

function typeQuery(value: string) {
  const input = screen.getByRole('textbox', { name: 'コンテンツを検索' });
  // The input is debounced (setTimeout 300). fireEvent.change updates the
  // controlled value immediately; results appear after the debounce, which we
  // await via findBy*/waitFor with a generous timeout (real timers).
  fireEvent.change(input, { target: { value } });
  return input;
}

function countFromLine(el: HTMLElement | null): number {
  const m = (el?.textContent ?? '').match(/(\d+)\s*件/);
  return m ? Number(m[1]) : NaN;
}

// The Japanese group labels used in both headings and filter pills. A heading's
// textContent is e.g. "💬フレーズ" (icon span + label, no space) while a pill is
// "💬 フレーズ" (icon + space + label), so we match on the plain label text.
const GROUP_LABELS = ['フレーズ', '単語', '文法', '慣用句', 'TOEIC', '辞書'];

function labelOf(el: Element): string {
  const text = el.textContent ?? '';
  return GROUP_LABELS.find((l) => text.includes(l)) ?? '';
}

// Find the filter pill button (not a heading) whose accessible name contains the
// given plain group label.
function findFilterPill(label: string): HTMLElement | undefined {
  return screen
    .getAllByRole('button')
    .find(
      (btn) => btn.textContent?.includes(label) && btn.textContent !== 'すべて'
    );
}

describe('SearchPage', () => {
  it('shows the empty/prompt state for a blank query', () => {
    renderWithRouter(<SearchPage />);

    expect(
      screen.getByText('検索キーワードを入力してください')
    ).toBeInTheDocument();

    // No total-count line appears with no query.
    expect(screen.queryByText(/の検索結果/)).not.toBeInTheDocument();
  });

  it('surfaces matching results grouped with a total count after the debounce', async () => {
    renderWithRouter(<SearchPage />);

    const input = typeQuery(COMMON_QUERY);
    // Input reflects typed value immediately (debounce only affects results).
    expect(input).toHaveValue(COMMON_QUERY);

    // After the 300ms debounce, the total-count line appears with a count > 0.
    const countLine = await screen.findByText(
      /の検索結果/,
      {},
      { timeout: 2000 }
    );
    expect(countFromLine(countLine)).toBeGreaterThan(0);

    // Results are grouped: at least one group header (a level-2 heading).
    const groupHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(groupHeadings.length).toBeGreaterThan(0);

    // At least one matching result row rendered.
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('removes a group when its filter is toggled off', async () => {
    renderWithRouter(<SearchPage />);

    typeQuery(COMMON_QUERY);
    await screen.findByText(/の検索結果/, {}, { timeout: 2000 });

    // Pick a group that currently has results (its plain label).
    const headings = screen.getAllByRole('heading', { level: 2 });
    const targetLabel = labelOf(headings[0]);
    expect(targetLabel.length).toBeGreaterThan(0);

    const beforeCount = countFromLine(screen.getByText(/の検索結果/));

    // Toggle that group's filter pill OFF.
    const filterButton = findFilterPill(targetLabel);
    expect(filterButton).toBeTruthy();
    fireEvent.click(filterButton!);

    // The total count must drop (group removed). If it was the only group, the
    // no-results state is shown instead.
    await waitFor(
      () => {
        const line = screen.queryByText(/の検索結果/);
        if (line) {
          expect(countFromLine(line)).toBeLessThan(beforeCount);
        } else {
          expect(
            screen.getByText(/一致する結果がありません/)
          ).toBeInTheDocument();
        }
      },
      { timeout: 2000 }
    );

    // The toggled-off group's heading is no longer rendered.
    const remaining = screen
      .queryAllByRole('heading', { level: 2 })
      .map((h) => labelOf(h));
    expect(remaining).not.toContain(targetLabel);
  });

  it('narrows results to a single group via "すべて" then re-selecting one group', async () => {
    renderWithRouter(<SearchPage />);

    typeQuery(COMMON_QUERY);
    await screen.findByText(/の検索結果/, {}, { timeout: 2000 });

    const allCount = countFromLine(screen.getByText(/の検索結果/));
    const firstLabel = labelOf(screen.getAllByRole('heading', { level: 2 })[0]);
    expect(firstLabel.length).toBeGreaterThan(0);

    // Clear all filters -> no results.
    fireEvent.click(screen.getByRole('button', { name: 'すべて' }));
    await waitFor(
      () =>
        expect(
          screen.getByText(/一致する結果がありません/)
        ).toBeInTheDocument(),
      { timeout: 2000 }
    );

    // Re-select only the one group -> results narrowed to that group.
    const groupPill = findFilterPill(firstLabel);
    expect(groupPill).toBeTruthy();
    fireEvent.click(groupPill!);

    await screen.findByText(/の検索結果/, {}, { timeout: 2000 });
    const narrowedCount = countFromLine(screen.getByText(/の検索結果/));

    expect(narrowedCount).toBeGreaterThan(0);
    expect(narrowedCount).toBeLessThanOrEqual(allCount);
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.length).toBe(1);
    expect(labelOf(headings[0])).toBe(firstLabel);
  });

  it('has no detectable axe accessibility violations in the results state', async () => {
    const { container } = renderWithRouter(<SearchPage />);

    typeQuery(COMMON_QUERY);
    await screen.findByText(/の検索結果/, {}, { timeout: 2000 });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('exposes a polite live status region for result announcements', () => {
    const { container } = renderWithRouter(<SearchPage />);
    expect(within(container).getByRole('status')).toBeInTheDocument();
  });
});
