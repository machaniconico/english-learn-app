// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import CustomDecksPage from './CustomDecksPage';
import { STORAGE_KEY } from '../hooks/useCustomDecks';
import type { CustomDeck } from '../data/types';

expect.extend(matchers);

const seedDeck: CustomDeck = {
  id: 'deck-1',
  name: 'ビジネス英語',
  description: 'TOEICビジネスメール頻出単語',
  items: [
    {
      id: 'item-1',
      english: 'colleague',
      japanese: '同僚',
      pronunciation: 'ˈkɒliːɡ',
    },
    {
      id: 'item-2',
      english: 'deadline',
      japanese: '締め切り',
      pronunciation: 'ˈdedlaɪn',
    },
  ],
  createdAt: 1_700_000_000_000,
  updatedAt: 1_700_000_000_000,
};

describe('CustomDecksPage', () => {
  describe('empty state', () => {
    it('renders empty state with page heading and CTA when no decks', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      expect(
        screen.getByRole('heading', { level: 1, name: 'カスタム単語帳' }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('まだ単語帳がありません'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: '＋ 最初の単語帳を作成' }),
      ).toBeInTheDocument();
    });

    it('shows the create form when CTA is clicked', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      fireEvent.click(screen.getByRole('button', { name: '＋ 最初の単語帳を作成' }));

      expect(
        screen.getByRole('form', { name: '新しい単語帳を作成' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('textbox', { name: /名前/ }),
      ).toBeInTheDocument();
    });

    it('has no accessibility violations in empty state', async () => {
      const { container } = renderWithRouter(<CustomDecksPage />, { route: '/decks' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('with seeded decks', () => {
    beforeEach(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([seedDeck]));
    });

    it('renders the deck list with name, item count, and action links', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      expect(
        screen.getByRole('heading', { level: 1, name: 'カスタム単語帳' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'ビジネス英語' }),
      ).toBeInTheDocument();
      expect(screen.getByText('2 語')).toBeInTheDocument();
      expect(screen.getByText('TOEICビジネスメール頻出単語')).toBeInTheDocument();

      expect(screen.getByRole('link', { name: /学習する/ })).toHaveAttribute(
        'href',
        '/decks/deck-1',
      );
      expect(screen.getByRole('link', { name: /編集/ })).toHaveAttribute(
        'href',
        '/decks/deck-1/edit',
      );
    });

    it('shows confirm step before deleting a deck', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      fireEvent.click(screen.getByRole('button', { name: '「ビジネス英語」を削除' }));

      expect(screen.getByRole('button', { name: '本当に削除' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });

    it('cancels delete when キャンセル is clicked', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      fireEvent.click(screen.getByRole('button', { name: '「ビジネス英語」を削除' }));
      fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }));

      // Original delete button is visible again
      expect(
        screen.getByRole('button', { name: '「ビジネス英語」を削除' }),
      ).toBeInTheDocument();
    });

    it('has no accessibility violations with deck list', async () => {
      const { container } = renderWithRouter(<CustomDecksPage />, { route: '/decks' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('create form', () => {
    it('shows validation error when submitting with empty name', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      // Open form via empty-state CTA
      fireEvent.click(screen.getByRole('button', { name: '＋ 最初の単語帳を作成' }));
      fireEvent.click(screen.getByRole('button', { name: '作成する' }));

      expect(
        screen.getByRole('alert'),
      ).toHaveTextContent('単語帳の名前を入力してください');
    });

    it('has no accessibility violations with form open', async () => {
      const { container } = renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      fireEvent.click(screen.getByRole('button', { name: '＋ 最初の単語帳を作成' }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
