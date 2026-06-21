// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWordNotes, STORAGE_KEY } from './useWordNotes';

describe('useWordNotes', () => {
  beforeEach(() => {
    // setup.ts が afterEach で localStorage.clear() するが、各テスト前方でも確実にクリア
    localStorage.clear();
  });

  describe('initial state', () => {
    it('returns empty notes and getNote returns empty string when no data', () => {
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.notes).toEqual({});
      expect(result.current.getNote('any-id')).toBe('');
    });

    it('loads persisted notes from localStorage on mount', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ w1: 'メモ1', w2: 'メモ2' }));
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.notes).toEqual({ w1: 'メモ1', w2: 'メモ2' });
      expect(result.current.getNote('w1')).toBe('メモ1');
    });

    it('returns empty object when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.notes).toEqual({});
    });

    it('returns empty object when stored value is an array (not an object)', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(['not', 'an', 'object']));
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.notes).toEqual({});
    });

    it('returns empty object when stored value is null', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(null));
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.notes).toEqual({});
    });

    it('returns empty object when stored value is a primitive', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(42));
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.notes).toEqual({});
    });

    it('filters out non-string values from stored object', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ok: 'good', bad: 123, nested: { x: true }, fine: 'str' }),
      );
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.notes).toEqual({ ok: 'good', fine: 'str' });
    });
  });

  describe('setNote', () => {
    it('saves a note, persists to localStorage, and reflects in getNote', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => {
        result.current.setNote('apple', 'りんごのメモ');
      });
      expect(result.current.notes['apple']).toBe('りんごのメモ');
      expect(result.current.getNote('apple')).toBe('りんごのメモ');
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
      expect(stored).toEqual({ apple: 'りんごのメモ' });
    });

    it('trims surrounding whitespace before saving', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => {
        result.current.setNote('w', '  hello world  ');
      });
      expect(result.current.notes['w']).toBe('hello world');
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
      expect(stored).toEqual({ w: 'hello world' });
    });

    it('treats empty string as removal (deletes existing note)', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => {
        result.current.setNote('w', 'メモ');
      });
      act(() => {
        result.current.setNote('w', '');
      });
      expect(result.current.notes).toEqual({});
      expect(result.current.getNote('w')).toBe('');
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({});
    });

    it('treats whitespace-only string as removal', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => {
        result.current.setNote('w', 'メモ');
      });
      act(() => {
        result.current.setNote('w', '   \t\n  ');
      });
      expect(result.current.notes).toEqual({});
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({});
    });

    it('ignores empty id (no-op, nothing persisted)', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => {
        result.current.setNote('', 'something');
      });
      expect(result.current.notes).toEqual({});
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('whitespace-only setNote on unregistered id is a no-op', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => {
        result.current.setNote('new', '   ');
      });
      expect(result.current.notes).toEqual({});
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('updates an existing note to a new value', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => { result.current.setNote('w', 'first'); });
      act(() => { result.current.setNote('w', 'second'); });
      expect(result.current.notes['w']).toBe('second');
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({ w: 'second' });
    });

    it('persists multiple distinct ids independently', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => { result.current.setNote('a', 'A'); });
      act(() => { result.current.setNote('b', 'B'); });
      act(() => { result.current.setNote('c', 'C'); });
      expect(result.current.notes).toEqual({ a: 'A', b: 'B', c: 'C' });
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({ a: 'A', b: 'B', c: 'C' });
    });
  });

  describe('removeNote', () => {
    it('removes a note by id and persists', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => { result.current.setNote('a', 'A'); });
      act(() => { result.current.setNote('b', 'B'); });
      act(() => { result.current.removeNote('a'); });
      expect(result.current.notes).toEqual({ b: 'B' });
      expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({ b: 'B' });
    });

    it('is a no-op when id does not exist', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => { result.current.setNote('keep', 'K'); });
      act(() => { result.current.removeNote('nonexistent'); });
      expect(result.current.notes).toEqual({ keep: 'K' });
    });

    it('is a no-op on empty state', () => {
      const { result } = renderHook(() => useWordNotes());
      act(() => { result.current.removeNote('anything'); });
      expect(result.current.notes).toEqual({});
    });
  });

  describe('persistence across remounts', () => {
    it('a new hook instance reads notes saved by a previous instance', () => {
      const { result: first, unmount } = renderHook(() => useWordNotes());
      act(() => { first.current.setNote('cross', 'mount'); });
      unmount();

      const { result: second } = renderHook(() => useWordNotes());
      expect(second.current.notes).toEqual({ cross: 'mount' });
      expect(second.current.getNote('cross')).toBe('mount');
    });

    it('pre-populated localStorage is reflected on initial render', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ pre1: 'A', pre2: 'B' }));
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.notes).toEqual({ pre1: 'A', pre2: 'B' });
      expect(result.current.getNote('pre1')).toBe('A');
    });

    it('removal is visible after remount', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ keep: 'K', drop: 'D' }));
      const { result: first, unmount } = renderHook(() => useWordNotes());
      act(() => { first.current.removeNote('drop'); });
      unmount();

      const { result: second } = renderHook(() => useWordNotes());
      expect(second.current.notes).toEqual({ keep: 'K' });
    });

    it('setNote trim-then-delete then remount yields empty', () => {
      const { result: first, unmount } = renderHook(() => useWordNotes());
      act(() => { first.current.setNote('w', 'メモ'); });
      act(() => { first.current.setNote('w', '   '); });
      unmount();

      const { result: second } = renderHook(() => useWordNotes());
      expect(second.current.notes).toEqual({});
    });
  });

  describe('resilience', () => {
    it('falls back to {} when localStorage.getItem throws', () => {
      const spy = vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
      });
      try {
        const { result } = renderHook(() => useWordNotes());
        expect(result.current.notes).toEqual({});
      } finally {
        spy.mockRestore();
      }
    });

    it('state updates and does not throw when localStorage.setItem throws', () => {
      const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });
      try {
        const { result } = renderHook(() => useWordNotes());
        act(() => {
          result.current.setNote('x', 'value');
        });
        // state は更新され、例外で落ちない
        expect(result.current.notes['x']).toBe('value');
        expect(result.current.getNote('x')).toBe('value');
      } finally {
        spy.mockRestore();
      }
    });

    it('removeNote does not throw when localStorage.setItem throws', () => {
      // 予め localStorage にデータを入れておき、削除パスで setItem が呼ばれるようにする
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: 'v' }));
      const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });
      try {
        const { result } = renderHook(() => useWordNotes());
        act(() => {
          result.current.removeNote('x');
        });
        // state からは削除されている
        expect('x' in result.current.notes).toBe(false);
      } finally {
        spy.mockRestore();
      }
    });

    it('getNote returns empty string for unregistered id without touching storage', () => {
      const { result } = renderHook(() => useWordNotes());
      expect(result.current.getNote('missing')).toBe('');
    });
  });
});
