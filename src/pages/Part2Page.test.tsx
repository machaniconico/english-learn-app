// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderWithRouter, screen } from '../test/test-utils';
import Part2Page from './Part2Page';
import { part2Sets } from '../data/toeic/part2-listening';

expect.extend(matchers);

describe('Part2Page', () => {
  it('renders the selection screen with all set cards when no setId param', () => {
    renderWithRouter(<Part2Page />);

    expect(screen.getByRole('heading', { name: 'Part 2: Question-Response' })).toBeTruthy();

    for (const set of part2Sets) {
      expect(screen.getByText(set.titleJa)).toBeTruthy();
    }

    const startLinks = screen.getAllByText(/開始する/);
    expect(startLinks.length).toBeGreaterThanOrEqual(part2Sets.length);
  });

  it('renders the set practice view when a valid setId param is provided', () => {
    const firstSet = part2Sets[0];

    render(
      <MemoryRouter initialEntries={[`/part2-listening/${firstSet.id}`]}>
        <Routes>
          <Route path="/part2-listening/:setId" element={<Part2Page />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: firstSet.titleJa })).toBeTruthy();
    expect(screen.getByText(firstSet.title)).toBeTruthy();
    const backLinks = screen.getAllByText(/問題一覧に戻る/);
    expect(backLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('shows the not-found message for an unknown setId', () => {
    render(
      <MemoryRouter initialEntries={['/part2-listening/does-not-exist']}>
        <Routes>
          <Route path="/part2-listening/:setId" element={<Part2Page />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('問題セットが見つかりませんでした。')).toBeTruthy();
    expect(screen.getByRole('link', { name: /問題一覧に戻る/ })).toBeTruthy();
  });

  it('has no axe accessibility violations on the selection screen', async () => {
    const { container } = renderWithRouter(<Part2Page />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
