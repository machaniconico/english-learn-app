// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, fireEvent } from '../test/test-utils';
import MatchingGamePage from './MatchingGamePage';
import type { Section } from '../data/types';

expect.extend(matchers);

const mockSection: Section = {
  id: 'phrases',
  title: 'Common Phrases',
  titleJa: 'よく使うフレーズ',
  description: 'Common phrases',
  icon: '💬',
  color: 'blue',
  categories: [
    {
      id: 'greetings',
      title: 'Greetings',
      titleJa: 'あいさつ',
      description: 'Greeting phrases',
      icon: '👋',
      color: 'blue',
      lessons: [
        {
          id: 'lesson1',
          title: 'Basic Greetings',
          titleJa: '基本のあいさつ',
          description: 'Learn basic greetings',
          items: [
            {
              id: 'item1',
              english: 'Good morning',
              japanese: 'おはようございます',
              pronunciation: 'グッドモーニング',
            },
            {
              id: 'item2',
              english: 'Good evening',
              japanese: 'こんばんは',
              pronunciation: 'グッドイーブニング',
            },
            {
              id: 'item3',
              english: 'Thank you',
              japanese: 'ありがとうございます',
              pronunciation: 'サンキュー',
            },
          ],
        },
      ],
    },
  ],
};

vi.mock('../hooks/useSection', () => ({
  useSection: () => mockSection,
  useAllSections: () => [mockSection],
}));

beforeEach(() => {
  localStorage.clear();
});

function renderListMode() {
  return render(
    <MemoryRouter initialEntries={['/matching']}>
      <Routes>
        <Route path="/matching" element={<MatchingGamePage />} />
      </Routes>
    </MemoryRouter>
  );
}

function renderPlayMode(sectionId = 'phrases', categoryId = 'greetings') {
  return render(
    <MemoryRouter initialEntries={[`/matching/${sectionId}/${categoryId}`]}>
      <Routes>
        <Route path="/matching/:sectionId/:categoryId" element={<MatchingGamePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('MatchingGamePage – List mode', () => {
  it('renders the page heading and category links', () => {
    renderListMode();
    expect(screen.getByRole('heading', { name: 'マッチングゲーム' })).toBeTruthy();
    // Section heading for the mocked section
    expect(screen.getByRole('heading', { name: 'Common Phrases' })).toBeTruthy();
    // Category link
    expect(screen.getByRole('link', { name: /Greetings/ })).toBeTruthy();
  });

  it('has no axe accessibility violations in list mode', async () => {
    const { container } = renderListMode();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('MatchingGamePage – Play mode', () => {
  it('renders the game heading, category subtitle, and face-down cards', () => {
    renderPlayMode();
    expect(screen.getByRole('heading', { name: 'マッチングゲーム' })).toBeTruthy();
    // Category title is shown as a subtitle
    expect(screen.getByText(/Greetings.*あいさつ/)).toBeTruthy();
    // Cards start face-down
    const faceDownCards = screen.getAllByRole('button', { name: 'Face-down card' });
    expect(faceDownCards.length).toBeGreaterThan(0);
  });

  it('reveals a card when clicked', () => {
    renderPlayMode();
    const faceDownCards = screen.getAllByRole('button', { name: 'Face-down card' });
    fireEvent.click(faceDownCards[0]);
    // At least one card is now revealed (English or Japanese label)
    const revealed = screen.queryAllByRole('button', { name: /^(English|Japanese):/i });
    expect(revealed.length).toBeGreaterThan(0);
  });

  it('shows not-found message for an unknown category', () => {
    // useSection returns mockSection but the categoryId won't match
    render(
      <MemoryRouter initialEntries={['/matching/phrases/nonexistent']}>
        <Routes>
          <Route path="/matching/:sectionId/:categoryId" element={<MatchingGamePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('カテゴリが見つかりませんでした。')).toBeTruthy();
  });
});
