// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { STORAGE_KEY } from '../hooks/useCustomDecks';
import CustomDeckEditPage from './CustomDeckEditPage';

expect.extend(matchers);

const DECK_ID = 'deck-test-001';
const SECOND_DECK_ID = 'deck-test-002';

const seedDeck = {
  id: DECK_ID,
  name: 'テスト単語帳',
  description: 'テスト用',
  items: [
    {
      id: 'item-001',
      english: 'appointment',
      japanese: '約束、予定',
      pronunciation: 'əˈpɔɪntmənt',
      example: 'I have an appointment at 3.',
      exampleJa: '3時に約束があります。',
    },
    {
      id: 'item-002',
      english: 'deadline',
      japanese: '締め切り',
      pronunciation: 'ˈdedlaɪn',
    },
  ],
  createdAt: 1000,
  updatedAt: 2000,
};

const secondDeck = {
  ...seedDeck,
  id: SECOND_DECK_ID,
  name: '別の単語帳',
  description: '別デッキ用',
  items: [
    {
      id: 'item-101',
      english: 'invoice',
      japanese: '請求書',
      pronunciation: 'ˈɪnvɔɪs',
    },
  ],
  createdAt: 3000,
  updatedAt: 4000,
};

function renderEditPage(deckId: string) {
  return render(
    <MemoryRouter initialEntries={[`/decks/${deckId}/edit`]}>
      <Routes>
        <Route path="/decks/:deckId/edit" element={<CustomDeckEditPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderEditPageForRerender(deckId: string) {
  const routeLocation = (currentDeckId: string) => ({
    pathname: `/decks/${currentDeckId}/edit`,
    search: '',
    hash: '',
    state: null,
    key: 'deck-edit-test-location',
  });
  const ui = (currentDeckId: string) => (
    <MemoryRouter initialEntries={['/']}>
      <Routes location={routeLocation(currentDeckId)}>
        <Route path="/decks/:deckId/edit" element={<CustomDeckEditPage />} />
      </Routes>
    </MemoryRouter>
  );
  const result = render(ui(deckId));
  return {
    ...result,
    rerenderDeckId: (nextDeckId: string) => result.rerender(ui(nextDeckId)),
  };
}

describe('CustomDeckEditPage', () => {
  describe('not-found state', () => {
    it('renders not-found heading when deckId is unknown', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      renderEditPage('nonexistent');

      expect(
        screen.getByRole('heading', { level: 1, name: '単語帳が見つかりません' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /単語帳一覧に戻る/ }),
      ).toBeInTheDocument();
    });
  });

  describe('populated deck', () => {
    beforeEach(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([seedDeck]));
    });

    it('renders page heading and back link', () => {
      renderEditPage(DECK_ID);

      expect(
        screen.getByRole('heading', { level: 1, name: '単語帳を編集' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /単語帳一覧/ }),
      ).toBeInTheDocument();
    });

    it('renders deck name in the name input', () => {
      renderEditPage(DECK_ID);

      const nameInput = screen.getByPlaceholderText('例: TOEIC頻出単語');
      expect(nameInput).toHaveValue('テスト単語帳');
    });

    it('reinitializes deck meta fields before saving after rerendering with another deckId', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([seedDeck, secondDeck]));
      const { rerenderDeckId } = renderEditPageForRerender(DECK_ID);

      expect(screen.getByLabelText(/名前/)).toHaveValue(seedDeck.name);
      expect(screen.getByLabelText('説明（任意）')).toHaveValue(seedDeck.description);

      fireEvent.click(screen.getByRole('button', { name: '保存' }));
      expect(screen.getByRole('status')).toHaveTextContent('保存しました');

      rerenderDeckId(SECOND_DECK_ID);

      expect(screen.getByLabelText(/名前/)).toHaveValue(secondDeck.name);
      expect(screen.getByLabelText('説明（任意）')).toHaveValue(secondDeck.description);
      expect(screen.queryByRole('status')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: '保存' }));

      const storedDecks = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? '[]',
      ) as Array<typeof seedDeck>;
      const storedFirstDeck = storedDecks.find((deck) => deck.id === DECK_ID);
      const storedSecondDeck = storedDecks.find((deck) => deck.id === SECOND_DECK_ID);
      expect(storedFirstDeck).toMatchObject({
        id: DECK_ID,
        name: seedDeck.name,
        description: seedDeck.description,
      });
      expect(storedSecondDeck).toMatchObject({
        id: SECOND_DECK_ID,
        name: secondDeck.name,
        description: secondDeck.description,
      });
    });

    it('renders seeded word items', () => {
      renderEditPage(DECK_ID);

      expect(screen.getByText('appointment')).toBeInTheDocument();
      expect(screen.getByText('deadline')).toBeInTheDocument();
    });

    it('shows word count in list section heading', () => {
      renderEditPage(DECK_ID);

      expect(screen.getAllByText(/2 語/).length).toBeGreaterThan(0);
    });

    it('adds a new word when form is filled and submitted', () => {
      renderEditPage(DECK_ID);

      fireEvent.change(screen.getByPlaceholderText('例: appointment'), {
        target: { value: 'negotiate' },
      });
      fireEvent.change(screen.getByPlaceholderText('例: 約束、予定'), {
        target: { value: '交渉する' },
      });

      fireEvent.click(screen.getByRole('button', { name: /＋ 追加/ }));

      expect(screen.getByText('negotiate')).toBeInTheDocument();
      expect(screen.getByText('交渉する')).toBeInTheDocument();
    });

    it('shows validation error when english is empty on add', () => {
      renderEditPage(DECK_ID);

      // Only fill japanese, leave english empty
      fireEvent.change(screen.getByPlaceholderText('例: 約束、予定'), {
        target: { value: '交渉する' },
      });

      fireEvent.click(screen.getByRole('button', { name: /＋ 追加/ }));

      expect(screen.getByRole('alert')).toHaveTextContent(
        '英語と日本語は必須です。',
      );
    });

    it('shows confirm-delete buttons when delete is clicked', () => {
      renderEditPage(DECK_ID);

      const deleteBtn = screen.getByRole('button', {
        name: '「appointment」を削除',
      });
      fireEvent.click(deleteBtn);

      expect(screen.getByRole('button', { name: '削除確認' })).toBeInTheDocument();
    });

    it('removes item after confirm-delete', () => {
      renderEditPage(DECK_ID);

      fireEvent.click(
        screen.getByRole('button', { name: '「appointment」を削除' }),
      );
      fireEvent.click(screen.getByRole('button', { name: '削除確認' }));

      expect(screen.queryByText('appointment')).not.toBeInTheDocument();
    });

    it('shows inline edit form when edit is clicked', () => {
      renderEditPage(DECK_ID);

      fireEvent.click(
        screen.getByRole('button', { name: '「appointment」を編集' }),
      );

      expect(
        screen.getByRole('form', { name: /appointment.*編集/ }),
      ).toBeInTheDocument();
    });
  });

  describe('empty deck', () => {
    beforeEach(() => {
      const emptyDeck = { ...seedDeck, items: [] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([emptyDeck]));
    });

    it('renders empty-state message when no words exist', () => {
      renderEditPage(DECK_ID);
      expect(screen.getByText('まだ単語がありません')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([seedDeck]));
    });

    it('has no accessibility violations on populated deck', async () => {
      const { container } = renderEditPage(DECK_ID);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
