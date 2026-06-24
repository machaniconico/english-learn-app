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

  describe('search and sort', () => {
    const deckA: CustomDeck = {
      id: 'd-a',
      name: 'Apple Words',
      description: 'りんご',
      items: [
        { id: 'i1', english: 'apple', japanese: 'りんご', pronunciation: 'æpl' },
      ],
      createdAt: 1_700_000_000_000,
      updatedAt: 1_700_000_000_000,
    };
    const deckB: CustomDeck = {
      id: 'd-b',
      name: 'Zebra Words',
      description: 'しましま',
      items: [
        { id: 'i1', english: 'zebra', japanese: '縞馬', pronunciation: 'z' },
        { id: 'i2', english: 'zoo', japanese: '動物園', pronunciation: 'z' },
      ],
      createdAt: 1_700_000_001_000,
      updatedAt: 1_700_000_002_000,
    };
    const deckC: CustomDeck = {
      id: 'd-c',
      name: 'Business Phrases',
      description: 'TOEIC',
      items: [
        { id: 'i1', english: 'a', japanese: 'a', pronunciation: 'a' },
        { id: 'i2', english: 'b', japanese: 'b', pronunciation: 'b' },
        { id: 'i3', english: 'c', japanese: 'c', pronunciation: 'c' },
      ],
      createdAt: 1_700_000_003_000,
      updatedAt: 1_700_000_003_000,
    };

    beforeEach(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([deckA, deckB, deckC]));
    });

    it('renders the search box and sort select when decks exist', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      expect(
        screen.getByRole('searchbox', { name: 'デッキを検索' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { name: '並べ替え' }),
      ).toBeInTheDocument();
    });

    it('filters decks by search query typing into the search box', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      // 初期状態: 3 デッキすべて見えている
      const initialHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(initialHeadings).toHaveLength(3);

      const search = screen.getByRole('searchbox', { name: 'デッキを検索' });
      fireEvent.change(search, { target: { value: 'Apple' } });

      // Apple Words だけ残る
      const after = screen.getAllByRole('heading', { level: 2 });
      expect(after).toHaveLength(1);
      expect(screen.getByText('Apple Words')).toBeInTheDocument();
      // ヒットしなかった Zebra / Business は消える
      expect(screen.queryByText('Zebra Words')).not.toBeInTheDocument();
      expect(screen.queryByText('Business Phrases')).not.toBeInTheDocument();
    });

    it('shows the no-match empty state when search hits nothing', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      const search = screen.getByRole('searchbox', { name: 'デッキを検索' });
      fireEvent.change(search, { target: { value: 'zzzzzz' } });

      expect(screen.getByText('該当するデッキがありません')).toBeInTheDocument();
      expect(screen.queryByText('Apple Words')).not.toBeInTheDocument();
      expect(screen.queryByText('Zebra Words')).not.toBeInTheDocument();
      expect(screen.queryByText('Business Phrases')).not.toBeInTheDocument();
    });

    it('changes deck order when sort select is set to 名前順', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      // 既定(newest)は createdAt 降順: deckC(3_000) > deckB(1_000) > deckA(0_000)
      const before = screen
        .getAllByRole('heading', { level: 2 })
        .map((h) => h.textContent);
      expect(before).toEqual(['Business Phrases', 'Zebra Words', 'Apple Words']);

      const select = screen.getByRole('combobox', { name: '並べ替え' });
      fireEvent.change(select, { target: { value: 'name' } });

      // 名前昇順 localeCompare: Apple Words, Business Phrases, Zebra Words
      const after = screen
        .getAllByRole('heading', { level: 2 })
        .map((h) => h.textContent);
      expect(after).toEqual(['Apple Words', 'Business Phrases', 'Zebra Words']);
    });

    it('changes deck order when sort select is set to カード数が多い順', () => {
      renderWithRouter(<CustomDecksPage />, { route: '/decks' });

      const select = screen.getByRole('combobox', { name: '並べ替え' });
      fireEvent.change(select, { target: { value: 'size' } });

      // size 降順: deckC(3) > deckB(2) > deckA(1)
      const after = screen
        .getAllByRole('heading', { level: 2 })
        .map((h) => h.textContent);
      expect(after).toEqual(['Business Phrases', 'Zebra Words', 'Apple Words']);
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
