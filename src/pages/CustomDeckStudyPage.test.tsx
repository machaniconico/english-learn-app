// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CustomDeckStudyPage from './CustomDeckStudyPage';
import { STORAGE_KEY } from '../hooks/useCustomDecks';
import type { CustomDeck } from '../data/types';

expect.extend(matchers);

const SRS_KEY = 'english-learn-srs';

const seedDeck: CustomDeck = {
  id: 'deck-test-1',
  name: 'テスト単語帳',
  description: '基本単語',
  items: [
    {
      id: 'item-1',
      english: 'Hello',
      japanese: 'こんにちは',
      pronunciation: 'həˈloʊ',
    },
    {
      id: 'item-2',
      english: 'Goodbye',
      japanese: 'さようなら',
      pronunciation: 'ɡʊdˈbaɪ',
    },
  ],
  createdAt: 1000,
  updatedAt: 2000,
};

const emptyDeck: CustomDeck = {
  id: 'deck-empty-1',
  name: '空の単語帳',
  items: [],
  createdAt: 1000,
  updatedAt: 1000,
};

function renderStudyPage(deckId: string) {
  return render(
    <MemoryRouter initialEntries={[`/decks/${deckId}`]}>
      <Routes>
        <Route path="/decks/:deckId" element={<CustomDeckStudyPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CustomDeckStudyPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('not-found state', () => {
    it('shows not-found heading when deckId does not exist', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      renderStudyPage('nonexistent');

      expect(
        screen.getByRole('heading', { level: 1, name: '単語帳が見つかりません' }),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '📚 単語帳一覧へ' })).toBeInTheDocument();
    });

    it('has no accessibility violations in not-found state', async () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      const { container } = renderStudyPage('nonexistent');
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('empty deck state', () => {
    beforeEach(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([emptyDeck]));
    });

    it('shows deck name and link to edit when deck has no items', () => {
      renderStudyPage(emptyDeck.id);

      expect(
        screen.getByRole('heading', { level: 1, name: emptyDeck.name }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: '✏️ 単語を追加する' }),
      ).toBeInTheDocument();
    });

    it('has no accessibility violations in empty state', async () => {
      const { container } = renderStudyPage(emptyDeck.id);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('populated deck state', () => {
    beforeEach(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([seedDeck]));
    });

    it('renders heading with deck name and item count', () => {
      renderStudyPage(seedDeck.id);

      expect(
        screen.getByRole('heading', { level: 1, name: seedDeck.name }),
      ).toBeInTheDocument();
      expect(screen.getByText(/2 語/)).toBeInTheDocument();
    });

    it('renders the edit link pointing to the edit route', () => {
      renderStudyPage(seedDeck.id);

      const editLink = screen.getByRole('link', { name: '✏️ 編集' });
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', `/decks/${seedDeck.id}/edit`);
    });

    it('renders the Flashcard with the first card english text visible', () => {
      renderStudyPage(seedDeck.id);

      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('adds all items to SRS when "SRSに追加" is clicked and shows result banner', () => {
      renderStudyPage(seedDeck.id);

      const srsButton = screen.getByRole('button', { name: '🧠 SRSに追加' });
      fireEvent.click(srsButton);

      // The page has multiple status live regions (the Flashcard flip announcer
      // and this SRS result banner), so disambiguate by the banner's text.
      const banner = screen
        .getAllByRole('status')
        .find((el) => /SRS に追加しました/.test(el.textContent ?? ''));
      expect(banner).toBeDefined();
      expect(banner?.textContent).toMatch(/2 語を SRS に追加しました/);
    });

    it('reports already-in count when items are already in SRS', () => {
      const existingCard = {
        id: 'item-1',
        english: 'Hello',
        japanese: 'こんにちは',
        pronunciation: 'həˈloʊ',
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        nextReview: '2026-06-20',
        lastReview: '',
      };
      localStorage.setItem(SRS_KEY, JSON.stringify([existingCard]));

      renderStudyPage(seedDeck.id);

      fireEvent.click(screen.getByRole('button', { name: '🧠 SRSに追加' }));

      const banner = screen
        .getAllByRole('status')
        .find((el) => /SRS に追加しました/.test(el.textContent ?? ''));
      expect(banner?.textContent).toMatch(/1 語を SRS に追加しました/);
      expect(banner?.textContent).toMatch(/1 語は追加済み/);
    });

    it('has no accessibility violations in populated state', async () => {
      const { container } = renderStudyPage(seedDeck.id);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
