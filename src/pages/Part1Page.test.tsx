// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { renderWithRouter, screen } from '../test/test-utils';
import Part1Page from './Part1Page';
import { part1Sets } from '../data/toeic/part1-listening';

expect.extend(matchers);

describe('Part1Page', () => {
  it('renders the selection list with all set cards', () => {
    renderWithRouter(<Part1Page />);

    // Hero heading
    expect(screen.getByRole('heading', { name: 'TOEIC Part 1 Practice' })).toBeTruthy();

    // Each set should have a card link
    for (const set of part1Sets) {
      expect(screen.getByRole('link', { name: new RegExp(set.titleJa) })).toBeTruthy();
    }
  });

  it('shows the quiz for a valid setId param', () => {
    const firstSet = part1Sets[0];

    render(
      <MemoryRouter initialEntries={[`/part1-listening/${firstSet.id}`]}>
        <Routes>
          <Route path="/part1-listening/:setId" element={<Part1Page />} />
        </Routes>
      </MemoryRouter>,
    );

    // The set title heading should appear
    expect(screen.getByRole('heading', { name: firstSet.titleJa })).toBeTruthy();

    // First question scenario should be visible
    expect(screen.getByText(firstSet.questions[0].scenario)).toBeTruthy();

    // Answer option buttons should be present (aria-label pattern used by Part1Listening)
    expect(screen.getByRole('button', { name: '選択肢 A' })).toBeTruthy();
  });

  it('shows an error message for an unknown setId', () => {
    render(
      <MemoryRouter initialEntries={['/part1-listening/nonexistent-set']}>
        <Routes>
          <Route path="/part1-listening/:setId" element={<Part1Page />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('問題セットが見つかりませんでした。')).toBeTruthy();
    expect(screen.getByRole('link', { name: /問題一覧に戻る/ })).toBeTruthy();
  });

  it('has no axe accessibility violations on the selection list', async () => {
    const { container } = renderWithRouter(<Part1Page />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
