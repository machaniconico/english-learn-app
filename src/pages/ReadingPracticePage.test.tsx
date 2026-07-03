// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import ReadingPracticePage from './ReadingPracticePage';

expect.extend(matchers);

describe('ReadingPracticePage', () => {
  it('renders the list view with heading and level filter tabs', () => {
    renderWithRouter(<ReadingPracticePage />, { route: '/reading-practice' });

    expect(screen.getByRole('heading', { name: 'TOEIC Part 7 Reading Practice' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'すべて' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '初級' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '中級' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '上級' })).toBeTruthy();
  });

  it('shows an estimated reading time on each passage card', () => {
    renderWithRouter(<ReadingPracticePage />, { route: '/reading-practice' });
    // 少なくとも1枚のカードに「📖 約N分」が出る。
    expect(screen.getAllByText(/📖 約\d+分/).length).toBeGreaterThan(0);
  });

  it('filters passages by level when a tab is clicked', () => {
    renderWithRouter(<ReadingPracticePage />, { route: '/reading-practice' });

    const allButton = screen.getByRole('button', { name: 'すべて' });
    const beginnerButton = screen.getByRole('button', { name: '初級' });
    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(beginnerButton).toHaveAttribute('aria-pressed', 'false');

    // Count passage links before filtering
    const allLinks = screen.getAllByRole('link').filter((el) =>
      el.getAttribute('href')?.startsWith('/reading-practice/')
    );
    const totalCount = allLinks.length;
    expect(totalCount).toBeGreaterThan(0);

    // Click "初級" filter — should reduce the number of passage cards
    fireEvent.click(beginnerButton);
    expect(allButton).toHaveAttribute('aria-pressed', 'false');
    expect(beginnerButton).toHaveAttribute('aria-pressed', 'true');

    const filteredLinks = screen.getAllByRole('link').filter((el) =>
      el.getAttribute('href')?.startsWith('/reading-practice/')
    );
    expect(filteredLinks.length).toBeGreaterThan(0);
    expect(filteredLinks.length).toBeLessThan(totalCount);

    fireEvent.click(allButton);
    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(beginnerButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders the single passage view with title and back link', () => {
    render(
      <MemoryRouter initialEntries={['/reading-practice/reading-beginner-email']}>
        <Routes>
          <Route path="/reading-practice/:passageId" element={<ReadingPracticePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: '会議スケジュールの変更' })).toBeTruthy();
    const backLinks = screen.getAllByRole('link', { name: /読解問題一覧に戻る/ });
    expect(backLinks.length).toBeGreaterThan(0);
  });

  it('shows not-found state for an unknown passageId', () => {
    render(
      <MemoryRouter initialEntries={['/reading-practice/does-not-exist']}>
        <Routes>
          <Route path="/reading-practice/:passageId" element={<ReadingPracticePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('問題が見つかりませんでした。')).toBeTruthy();
    expect(screen.getByRole('link', { name: /読解問題一覧に戻る/ })).toBeTruthy();
  });

  it('has no axe accessibility violations on the list view', async () => {
    const { container } = renderWithRouter(<ReadingPracticePage />, {
      route: '/reading-practice',
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
