// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import BookmarksPage from './BookmarksPage';

expect.extend(matchers);

const STORAGE_KEY = 'english-learn-bookmarks';

const seed = [
  {
    id: 'b1',
    english: 'Good morning',
    japanese: 'おはようございます',
    pronunciation: 'gʊd ˈmɔːrnɪŋ',
    source: 'phrases/greetings/basic-1',
    addedAt: 1000,
  },
  {
    id: 'b2',
    english: 'Thank you',
    japanese: 'ありがとう',
    pronunciation: 'θæŋk juː',
    source: 'phrases/greetings/basic-2',
    addedAt: 2000,
  },
];

describe('BookmarksPage a11y', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  });

  it('renders the populated bookmark list with its heading and controls', () => {
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    expect(
      screen.getByRole('heading', { level: 1, name: 'ブックマーク' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'ブックマークを検索' }),
    ).toBeInTheDocument();
    // One unbookmark control per seeded item.
    expect(screen.getAllByRole('button', { name: 'ブックマーク解除' })).toHaveLength(
      seed.length,
    );
  });

  it('has no page-local accessibility violations', async () => {
    const { container } = renderWithRouter(<BookmarksPage />, {
      route: '/bookmarks',
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
