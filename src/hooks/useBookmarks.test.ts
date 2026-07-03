// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookmarks, type BookmarkedItem } from './useBookmarks';

const STORAGE_KEY = 'english-learn-bookmarks';

function makeItem(id: string, overrides: Partial<BookmarkedItem> = {}): BookmarkedItem {
  return {
    id,
    english: `English ${id}`,
    japanese: `Japanese ${id}`,
    pronunciation: `pronunciation-${id}`,
    source: `phrases/greetings/${id}`,
    addedAt: Date.now(),
    ...overrides,
  };
}

describe('useBookmarks', () => {
  beforeEach(() => {
    // setup.ts clears localStorage in afterEach; this handles state before each test
    localStorage.clear();
  });

  describe('initial state', () => {
    it('returns empty bookmarks when localStorage has no data', () => {
      const { result } = renderHook(() => useBookmarks());
      expect(result.current.bookmarks).toEqual([]);
    });

    it('loads persisted bookmarks from localStorage on mount', () => {
      const item = makeItem('item-1');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([item]));

      const { result } = renderHook(() => useBookmarks());
      expect(result.current.bookmarks).toHaveLength(1);
      expect(result.current.bookmarks[0].id).toBe('item-1');
    });

    it('returns empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
      const { result } = renderHook(() => useBookmarks());
      expect(result.current.bookmarks).toEqual([]);
    });

    it.each(['null', '{}', '"x"', '42'])(
      'returns empty array when localStorage contains non-array JSON: %s',
      (raw) => {
        localStorage.setItem(STORAGE_KEY, raw);
        const { result } = renderHook(() => useBookmarks());
        expect(result.current.bookmarks).toEqual([]);
      },
    );

    it('filters malformed stored bookmark entries and keeps valid bookmarks', () => {
      const valid = makeItem('valid');
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          valid,
          null,
          'oops',
          { id: 'missing-fields' },
          { ...valid, addedAt: 'bad' },
        ]),
      );

      const { result } = renderHook(() => useBookmarks());

      expect(result.current.bookmarks).toEqual([valid]);
      expect(result.current.isBookmarked('valid')).toBe(true);
    });
  });

  describe('addBookmark', () => {
    it('adds an item to the bookmarks list', () => {
      const { result } = renderHook(() => useBookmarks());
      const item = makeItem('a1');

      act(() => {
        result.current.addBookmark(item);
      });

      expect(result.current.bookmarks).toHaveLength(1);
      expect(result.current.bookmarks[0].id).toBe('a1');
    });

    it('prepends new items (newest first)', () => {
      const { result } = renderHook(() => useBookmarks());
      const first = makeItem('first');
      const second = makeItem('second');

      act(() => {
        result.current.addBookmark(first);
      });
      act(() => {
        result.current.addBookmark(second);
      });

      expect(result.current.bookmarks[0].id).toBe('second');
      expect(result.current.bookmarks[1].id).toBe('first');
    });

    it('does not add a duplicate (same id)', () => {
      const { result } = renderHook(() => useBookmarks());
      const item = makeItem('dup');

      act(() => {
        result.current.addBookmark(item);
        result.current.addBookmark(item);
      });

      expect(result.current.bookmarks).toHaveLength(1);
    });

    it('persists to localStorage after add', () => {
      const { result } = renderHook(() => useBookmarks());
      const item = makeItem('persist-add');

      act(() => {
        result.current.addBookmark(item);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as BookmarkedItem[];
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('persist-add');
    });

    it('updates in-memory state when localStorage.setItem throws', () => {
      const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });
      try {
        const { result } = renderHook(() => useBookmarks());
        const item = makeItem('offline-add');

        expect(() => {
          act(() => {
            result.current.addBookmark(item);
          });
        }).not.toThrow();

        expect(result.current.bookmarks).toEqual([item]);
        expect(result.current.isBookmarked('offline-add')).toBe(true);
      } finally {
        spy.mockRestore();
      }
    });

    it('preserves additions from sibling hook instances in the same tree', () => {
      const { result } = renderHook(() => ({
        first: useBookmarks(),
        second: useBookmarks(),
      }));
      const a = makeItem('sibling-a');
      const b = makeItem('sibling-b');

      act(() => {
        result.current.first.addBookmark(a);
      });
      act(() => {
        result.current.second.addBookmark(b);
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as BookmarkedItem[];
      expect(stored.map((item) => item.id).sort()).toEqual(['sibling-a', 'sibling-b']);
      expect(result.current.first.bookmarks.map((item) => item.id).sort()).toEqual([
        'sibling-a',
        'sibling-b',
      ]);
      expect(result.current.second.bookmarks.map((item) => item.id).sort()).toEqual([
        'sibling-a',
        'sibling-b',
      ]);
    });
  });

  describe('removeBookmark', () => {
    it('removes an item by id', () => {
      const { result } = renderHook(() => useBookmarks());
      const item = makeItem('r1');

      act(() => {
        result.current.addBookmark(item);
      });
      act(() => {
        result.current.removeBookmark('r1');
      });

      expect(result.current.bookmarks).toHaveLength(0);
    });

    it('only removes the matching item when multiple exist', () => {
      const { result } = renderHook(() => useBookmarks());
      const a = makeItem('keep');
      const b = makeItem('gone');

      act(() => {
        result.current.addBookmark(a);
        result.current.addBookmark(b);
      });
      act(() => {
        result.current.removeBookmark('gone');
      });

      expect(result.current.bookmarks).toHaveLength(1);
      expect(result.current.bookmarks[0].id).toBe('keep');
    });

    it('is a no-op when id does not exist', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(makeItem('x'));
      });
      act(() => {
        result.current.removeBookmark('nonexistent');
      });

      expect(result.current.bookmarks).toHaveLength(1);
    });

    it('persists removal to localStorage', () => {
      const { result } = renderHook(() => useBookmarks());
      const item = makeItem('persist-remove');

      act(() => {
        result.current.addBookmark(item);
      });
      act(() => {
        result.current.removeBookmark('persist-remove');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as BookmarkedItem[];
      expect(stored).toHaveLength(0);
    });
  });

  describe('isBookmarked', () => {
    it('returns false when item is not bookmarked', () => {
      const { result } = renderHook(() => useBookmarks());
      expect(result.current.isBookmarked('missing')).toBe(false);
    });

    it('returns true after adding an item', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(makeItem('check'));
      });

      expect(result.current.isBookmarked('check')).toBe(true);
    });

    it('returns false after removing an item', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(makeItem('toggle-check'));
      });
      act(() => {
        result.current.removeBookmark('toggle-check');
      });

      expect(result.current.isBookmarked('toggle-check')).toBe(false);
    });
  });

  describe('add/remove toggle round-trip', () => {
    it('add → isBookmarked=true → remove → isBookmarked=false', () => {
      const { result } = renderHook(() => useBookmarks());
      const item = makeItem('toggle');

      act(() => {
        result.current.addBookmark(item);
      });
      expect(result.current.isBookmarked('toggle')).toBe(true);

      act(() => {
        result.current.removeBookmark('toggle');
      });
      expect(result.current.isBookmarked('toggle')).toBe(false);
    });

    it('can re-add an item after removal', () => {
      const { result } = renderHook(() => useBookmarks());
      const item = makeItem('re-add');

      act(() => { result.current.addBookmark(item); });
      act(() => { result.current.removeBookmark('re-add'); });
      act(() => { result.current.addBookmark(item); });

      expect(result.current.bookmarks).toHaveLength(1);
      expect(result.current.isBookmarked('re-add')).toBe(true);
    });
  });

  describe('clearAll', () => {
    it('removes all bookmarks', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(makeItem('c1'));
        result.current.addBookmark(makeItem('c2'));
        result.current.addBookmark(makeItem('c3'));
      });
      act(() => {
        result.current.clearAll();
      });

      expect(result.current.bookmarks).toHaveLength(0);
    });

    it('persists the cleared state to localStorage', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(makeItem('wipe'));
      });
      act(() => {
        result.current.clearAll();
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as BookmarkedItem[];
      expect(stored).toHaveLength(0);
    });
  });

  describe('persistence across remounts', () => {
    it('a new hook instance reads bookmarks saved by a previous instance', () => {
      const { result: first, unmount } = renderHook(() => useBookmarks());

      act(() => {
        first.current.addBookmark(makeItem('cross-mount'));
      });
      unmount();

      const { result: second } = renderHook(() => useBookmarks());
      expect(second.current.bookmarks).toHaveLength(1);
      expect(second.current.bookmarks[0].id).toBe('cross-mount');
      expect(second.current.isBookmarked('cross-mount')).toBe(true);
    });

    it('removal is visible after remount', () => {
      const item = makeItem('remount-remove');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([item]));

      const { result: first, unmount } = renderHook(() => useBookmarks());
      act(() => {
        first.current.removeBookmark('remount-remove');
      });
      unmount();

      const { result: second } = renderHook(() => useBookmarks());
      expect(second.current.bookmarks).toHaveLength(0);
    });

    it('pre-populated localStorage is reflected on initial render', () => {
      const items = [makeItem('pre-a'), makeItem('pre-b')];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

      const { result } = renderHook(() => useBookmarks());
      expect(result.current.bookmarks).toHaveLength(2);
      expect(result.current.isBookmarked('pre-a')).toBe(true);
      expect(result.current.isBookmarked('pre-b')).toBe(true);
    });
  });

  describe('cross-tab storage sync', () => {
    it('reacts to an external storage event for the correct key', () => {
      const { result } = renderHook(() => useBookmarks());
      const external = makeItem('external');

      act(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([external]));
        window.dispatchEvent(
          new StorageEvent('storage', { key: STORAGE_KEY }),
        );
      });

      expect(result.current.bookmarks).toHaveLength(1);
      expect(result.current.bookmarks[0].id).toBe('external');
    });

    it('ignores storage events for unrelated keys', () => {
      const { result } = renderHook(() => useBookmarks());

      act(() => {
        result.current.addBookmark(makeItem('existing'));
      });

      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', { key: 'some-other-key' }),
        );
      });

      // State must be unchanged
      expect(result.current.bookmarks).toHaveLength(1);
    });
  });
});
