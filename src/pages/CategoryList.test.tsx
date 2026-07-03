// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, fireEvent } from '../test/test-utils';
import CategoryList from './CategoryList';
import type { Section } from '../data/types';

expect.extend(matchers);

// ---------------------------------------------------------------------------
// Mock section data
// ---------------------------------------------------------------------------
const mockSection: Section = {
  id: 'phrases',
  title: 'Common Phrases',
  titleJa: 'よく使うフレーズ',
  description: 'Essential phrases for everyday situations',
  icon: '💬',
  color: 'indigo',
  categories: [
    {
      id: 'greetings',
      title: 'Greetings',
      titleJa: 'あいさつ',
      description: 'Learn basic greetings',
      icon: '👋',
      color: 'blue',
      lessons: [
        {
          id: 'lesson-greet-1',
          title: 'Basic Greetings',
          titleJa: '基本のあいさつ',
          description: 'Everyday greeting expressions',
          items: [
            { id: 'g1', english: 'Hello', japanese: 'こんにちは', pronunciation: 'ハロー' },
            { id: 'g2', english: 'Good morning', japanese: 'おはようございます', pronunciation: 'グッドモーニング' },
          ],
        },
      ],
    },
    {
      id: 'farewells',
      title: 'Farewells',
      titleJa: 'お別れ',
      description: 'Saying goodbye',
      icon: '👋',
      color: 'green',
      lessons: [
        {
          id: 'lesson-fare-1',
          title: 'Basic Farewells',
          titleJa: '別れの言葉',
          description: 'Common farewell phrases',
          items: [
            { id: 'f1', english: 'Goodbye', japanese: 'さようなら', pronunciation: 'グッバイ' },
          ],
        },
      ],
    },
  ],
};

// useSection is mocked so tests run synchronously without async loading
const mockUseSection = vi.fn<[string | undefined], Section | null | undefined>(
  () => mockSection,
);

vi.mock('../hooks/useSection', () => ({
  useSection: (id: string | undefined) => mockUseSection(id),
  useAllSections: () => [mockSection],
}));

beforeEach(() => {
  localStorage.clear();
  mockUseSection.mockReturnValue(mockSection);
});

function renderCategoryList(sectionId = 'phrases') {
  return render(
    <MemoryRouter initialEntries={[`/section/${sectionId}`]}>
      <Routes>
        <Route path="/section/:sectionId" element={<CategoryList />} />
      </Routes>
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CategoryList', () => {
  it('renders the section heading and category links', () => {
    renderCategoryList();

    // Section title
    expect(screen.getByRole('heading', { level: 1, name: 'Common Phrases' })).toBeTruthy();

    // Both category card headings
    expect(screen.getByRole('heading', { name: 'Greetings' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Farewells' })).toBeTruthy();

    // Category links point to the correct paths
    const greetLink = screen.getByRole('link', { name: /Greetings/ });
    expect((greetLink as HTMLAnchorElement).href).toMatch(/\/section\/phrases\/greetings/);

    // Back link to home is present
    expect(screen.getByRole('link', { name: /ホーム/ })).toBeTruthy();

    // Diagnostic test prompt shown (user not yet diagnosed)
    expect(screen.getByRole('link', { name: /レベル診断テストを受ける/i })).toBeTruthy();
  });

  it('filters categories by CEFR level when a level button is clicked', () => {
    renderCategoryList();

    // Both categories are present initially (Farewells renders as a locked card,
    // but its heading is still in the DOM).
    expect(screen.getByRole('heading', { name: 'Greetings' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Farewells' })).toBeTruthy();

    // The filter row appears because the two categories span different CEFR
    // levels: with sectionId 'phrases', Greetings maps to A1 and Farewells to B1.
    const allBtn = screen.getByRole('button', { name: /全レベル/i });
    const a1Btn = screen.getByRole('button', { name: /^A1/ });
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    expect(a1Btn).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(a1Btn);
    expect(allBtn).toHaveAttribute('aria-pressed', 'false');
    expect(a1Btn).toHaveAttribute('aria-pressed', 'true');

    // Filtering actually removed the B1 category and kept the A1 one.
    expect(screen.getByRole('heading', { name: 'Greetings' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Farewells' })).toBeNull();

    // Clicking "全レベル" restores all category headings.
    fireEvent.click(allBtn);
    expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    expect(a1Btn).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('heading', { name: 'Greetings' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Farewells' })).toBeTruthy();
  });

  it('shows the not-found state for an unknown section id', () => {
    mockUseSection.mockReturnValue(null);
    renderCategoryList('unknown-section');
    expect(screen.getByText('セクションが見つかりませんでした。')).toBeTruthy();
    expect(screen.getByRole('link', { name: /ホームに戻る/ })).toBeTruthy();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderCategoryList();
    expect(await axe(container)).toHaveNoViolations();
  });
});
