// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchHistory, MAX_HISTORY, STORAGE_KEY } from './useSearchHistory';

describe('useSearchHistory', () => {
  beforeEach(() => {
    // setup.ts clears localStorage in afterEach; this handles state before each test
    localStorage.clear();
  });

  describe('initial state', () => {
    it('returns empty history when localStorage has no data', () => {
      const { result } = renderHook(() => useSearchHistory());
      expect(result.current.history).toEqual([]);
    });

    it('loads persisted history from localStorage on mount (newest-first)', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(['apple', 'banana', 'cherry']));

      const { result } = renderHook(() => useSearchHistory());
      expect(result.current.history).toEqual(['apple', 'banana', 'cherry']);
    });

    it('returns empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
      const { result } = renderHook(() => useSearchHistory());
      expect(result.current.history).toEqual([]);
    });

    it('returns empty array when localStorage contains a non-array value', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
      const { result } = renderHook(() => useSearchHistory());
      expect(result.current.history).toEqual([]);
    });

    it('filters out non-string elements from stored data', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(['ok', 123, null, { bad: true }, 'also-ok']),
      );
      const { result } = renderHook(() => useSearchHistory());
      expect(result.current.history).toEqual(['ok', 'also-ok']);
    });
  });

  describe('addQuery', () => {
    it('adds a query to the front of the history (newest-first)', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('apple');
      });
      act(() => {
        result.current.addQuery('banana');
      });

      expect(result.current.history).toEqual(['banana', 'apple']);
    });

    it('persists to localStorage after add', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('persist-add');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
      expect(stored).toEqual(['persist-add']);
    });

    it('ignores empty string', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('');
      });

      expect(result.current.history).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('ignores whitespace-only queries (trims to empty)', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('   ');
      });
      act(() => {
        result.current.addQuery('\t\n');
      });

      expect(result.current.history).toEqual([]);
    });

    it('trims surrounding whitespace before storing', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('  hello world  ');
      });

      expect(result.current.history).toEqual(['hello world']);
    });

    it('removes case-insensitive duplicates and keeps the newest at the front', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('Apple');
      });
      act(() => {
        result.current.addQuery('Banana');
      });
      act(() => {
        result.current.addQuery('APPLE');
      });

      // 重複は1つに統合され、最新の 'APPLE' が先頭に来る
      expect(result.current.history).toEqual(['APPLE', 'Banana']);
    });

    it('preserves the original display string (does not lowercase on save)', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('Hello World');
      });

      expect(result.current.history[0]).toBe('Hello World');
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
      expect(stored[0]).toBe('Hello World');
    });

    it(`truncates to MAX_HISTORY (${MAX_HISTORY}) entries, dropping the oldest`, () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        for (let i = 1; i <= MAX_HISTORY + 3; i++) {
          result.current.addQuery(`q${i}`);
        }
      });

      expect(result.current.history).toHaveLength(MAX_HISTORY);
      // 最新の MAX_HISTORY 件が残り、古いものは落ちる
      expect(result.current.history[0]).toBe(`q${MAX_HISTORY + 3}`);
      expect(result.current.history[MAX_HISTORY - 1]).toBe(`q4`);
    });
  });

  describe('removeQuery', () => {
    it('removes a query (case-insensitive) from the history', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('apple');
        result.current.addQuery('banana');
      });
      act(() => {
        result.current.removeQuery('APPLE');
      });

      expect(result.current.history).toEqual(['banana']);
    });

    it('is a no-op when the query does not exist', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('keep');
      });
      act(() => {
        result.current.removeQuery('nonexistent');
      });

      expect(result.current.history).toEqual(['keep']);
    });

    it('persists removal to localStorage', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('persist-remove');
      });
      act(() => {
        result.current.removeQuery('persist-remove');
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
      expect(stored).toEqual([]);
    });
  });

  describe('clear', () => {
    it('removes all history entries', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('a');
        result.current.addQuery('b');
        result.current.addQuery('c');
      });
      act(() => {
        result.current.clear();
      });

      expect(result.current.history).toEqual([]);
    });

    it('persists the cleared state to localStorage', () => {
      const { result } = renderHook(() => useSearchHistory());

      act(() => {
        result.current.addQuery('wipe');
      });
      act(() => {
        result.current.clear();
      });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
      expect(stored).toEqual([]);
    });
  });

  describe('persistence across remounts', () => {
    it('a new hook instance reads history saved by a previous instance', () => {
      const { result: first, unmount } = renderHook(() => useSearchHistory());

      act(() => {
        first.current.addQuery('cross-mount');
      });
      unmount();

      const { result: second } = renderHook(() => useSearchHistory());
      expect(second.current.history).toEqual(['cross-mount']);
    });

    it('pre-populated localStorage is reflected on initial render', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(['pre-a', 'pre-b']));

      const { result } = renderHook(() => useSearchHistory());
      expect(result.current.history).toEqual(['pre-a', 'pre-b']);
    });

    it('removal is visible after remount', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(['keep', 'drop']));

      const { result: first, unmount } = renderHook(() => useSearchHistory());
      act(() => {
        first.current.removeQuery('drop');
      });
      unmount();

      const { result: second } = renderHook(() => useSearchHistory());
      expect(second.current.history).toEqual(['keep']);
    });
  });
});
