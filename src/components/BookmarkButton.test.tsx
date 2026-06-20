// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import BookmarkButton from './BookmarkButton';

expect.extend(matchers);

const STORAGE_KEY = 'english-learn-bookmarks';

const item = {
  id: 'phrase-001',
  english: 'Good morning',
  japanese: 'おはようございます',
  pronunciation: 'グッドモーニング',
};
const source = 'phrases/greetings/basic-1';

function readStorage(): unknown[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

describe('BookmarkButton', () => {
  it('starts not bookmarked (aria-pressed false, empty/outline star)', () => {
    renderWithRouter(<BookmarkButton item={item} source={source} />);

    const button = screen.getByRole('button', { name: 'ブックマークに追加' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveTextContent('☆'); // outline star
    expect(readStorage()).toHaveLength(0);
  });

  it('clicking bookmarks the item: aria-pressed true, filled star, and persists to localStorage', () => {
    renderWithRouter(<BookmarkButton item={item} source={source} />);

    const button = screen.getByRole('button', { name: 'ブックマークに追加' });
    fireEvent.click(button);

    // aria-label/state flips
    const pressed = screen.getByRole('button', { name: 'ブックマーク解除' });
    expect(pressed).toHaveAttribute('aria-pressed', 'true');
    expect(pressed).toHaveTextContent('★'); // filled star

    // persisted with the source + the item fields
    const stored = readStorage() as Array<Record<string, unknown>>;
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      id: item.id,
      english: item.english,
      japanese: item.japanese,
      pronunciation: item.pronunciation,
      source,
    });
    expect(typeof stored[0].addedAt).toBe('number');
  });

  it('clicking again removes the bookmark: reverts to not-pressed and clears storage', () => {
    renderWithRouter(<BookmarkButton item={item} source={source} />);

    const button = screen.getByRole('button', { name: 'ブックマークに追加' });

    // bookmark
    fireEvent.click(button);
    expect(
      screen.getByRole('button', { name: 'ブックマーク解除' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(readStorage()).toHaveLength(1);

    // un-bookmark
    fireEvent.click(screen.getByRole('button', { name: 'ブックマーク解除' }));
    const reverted = screen.getByRole('button', { name: 'ブックマークに追加' });
    expect(reverted).toHaveAttribute('aria-pressed', 'false');
    expect(reverted).toHaveTextContent('☆');
    expect(readStorage()).toHaveLength(0);
  });

  it('reflects pre-existing bookmark state from localStorage on mount', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...item, source, addedAt: Date.now() }]),
    );

    renderWithRouter(<BookmarkButton item={item} source={source} />);

    const button = screen.getByRole('button', { name: 'ブックマーク解除' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveTextContent('★');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithRouter(
      <BookmarkButton item={item} source={source} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
