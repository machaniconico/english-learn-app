// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import Home from './Home';
import { STORAGE_KEY, type LastActivity } from '../hooks/useLastActivity';

expect.extend(matchers);

describe('Home a11y smoke', () => {
  it('renders without axe violations', async () => {
    const { container } = renderWithRouter(<Home />, { route: '/' });

    // Light structure assertions so the test isn't axe-only.
    expect(screen.getByRole('heading', { level: 1, name: '英語を楽しく学ぼう' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /レベル診断テスト/ })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Home 前回の続き card (US-002)', () => {
  it('shows the resume card with a Link to last.path when last-activity is seeded', () => {
    const seeded: LastActivity = { path: '/toeic-practice', label: 'TOEIC練習' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

    renderWithRouter(<Home />, { route: '/' });

    const card = screen.getByRole('link', { name: '前回の続き: TOEIC練習 を再開する' });
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('href', '/toeic-practice');
  });

  it('does not show the resume card when there is no last-activity', () => {
    renderWithRouter(<Home />, { route: '/' });
    expect(screen.queryByRole('link', { name: /前回の続き/ })).not.toBeInTheDocument();
  });

  it('clears last-activity and hides the card when the × button is clicked', () => {
    const seeded: LastActivity = { path: '/toeic-practice', label: 'TOEIC練習' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

    renderWithRouter(<Home />, { route: '/' });
    const clearBtn = screen.getByRole('button', { name: '前回の続きを閉じる' });
    fireEvent.click(clearBtn);

    // クリック後: カードが消え、localStorage も null に書き戻る。
    expect(screen.queryByRole('link', { name: '前回の続き: TOEIC練習 を再開する' })).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('null');
  });
});
