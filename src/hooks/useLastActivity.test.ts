// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useLastActivity,
  STORAGE_KEY,
  type LastActivity,
} from './useLastActivity';

const activity = (path: string, label: string): LastActivity => ({ path, label });

describe('useLastActivity', () => {
  beforeEach(() => {
    // setup.ts clears localStorage in afterEach; this handles state before each test
    localStorage.clear();
  });

  describe('initial state', () => {
    it('returns null when localStorage has no data', () => {
      const { result } = renderHook(() => useLastActivity());
      expect(result.current.last).toBeNull();
    });

    it('loads a persisted LastActivity from localStorage on mount', () => {
      const seeded: LastActivity = activity('/practice/grammar', '文法練習');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      const { result } = renderHook(() => useLastActivity());
      expect(result.current.last).toEqual(seeded);
    });

    it('returns null when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
      const { result } = renderHook(() => useLastActivity());
      expect(result.current.last).toBeNull();
    });

    it('returns null when localStorage contains a non-object value', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify('just-a-string'));
      const { result } = renderHook(() => useLastActivity());
      expect(result.current.last).toBeNull();
    });

    it('returns null when stored entry is missing required string fields', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ path: '/ok', label: 123 }),
      );
      const { result } = renderHook(() => useLastActivity());
      expect(result.current.last).toBeNull();
    });

    it('returns null when stored entry has path but no label', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ path: '/practice' }),
      );
      const { result } = renderHook(() => useLastActivity());
      expect(result.current.last).toBeNull();
    });
  });

  describe('record', () => {
    it('saves a valid activity to state and localStorage', () => {
      const { result } = renderHook(() => useLastActivity());

      act(() => {
        result.current.record(activity('/practice/listening', 'リスニング'));
      });

      expect(result.current.last).toEqual(activity('/practice/listening', 'リスニング'));
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? 'null',
      ) as LastActivity | null;
      expect(stored).toEqual(activity('/practice/listening', 'リスニング'));
    });

    it('overwrites the previous activity when a new one is recorded', () => {
      const { result } = renderHook(() => useLastActivity());

      act(() => {
        result.current.record(activity('/practice/grammar', '文法'));
      });
      act(() => {
        result.current.record(activity('/practice/reading', '読解'));
      });

      expect(result.current.last).toEqual(activity('/practice/reading', '読解'));
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? 'null',
      ) as LastActivity | null;
      expect(stored).toEqual(activity('/practice/reading', '読解'));
    });

    it('ignores a path that does not start with "/"', () => {
      const { result } = renderHook(() => useLastActivity());

      act(() => {
        result.current.record(activity('practice/grammar', '文法'));
      });

      expect(result.current.last).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('ignores an empty label', () => {
      const { result } = renderHook(() => useLastActivity());

      act(() => {
        result.current.record(activity('/practice/grammar', ''));
      });

      expect(result.current.last).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('ignores a non-string path', () => {
      const { result } = renderHook(() => useLastActivity());

      act(() => {
        result.current.record({ path: 42 as unknown as string, label: '数値path' });
      });

      expect(result.current.last).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('ignores a non-string label', () => {
      const { result } = renderHook(() => useLastActivity());

      act(() => {
        result.current.record({ path: '/practice', label: 99 as unknown as string });
      });

      expect(result.current.last).toBeNull();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('records the same path twice without error (idempotent)', () => {
      const { result } = renderHook(() => useLastActivity());
      const item = activity('/practice/grammar', '文法');

      act(() => {
        result.current.record(item);
      });
      // 同じ path/label を連続記録: state も localStorage も壊れず同一のまま
      act(() => {
        result.current.record(item);
      });

      expect(result.current.last).toEqual(item);
      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? 'null',
      ) as LastActivity | null;
      expect(stored).toEqual(item);
    });
  });

  describe('clear', () => {
    it('sets last to null after a record', () => {
      const { result } = renderHook(() => useLastActivity());

      act(() => {
        result.current.record(activity('/practice/speaking', 'スピーキング'));
      });
      act(() => {
        result.current.clear();
      });

      expect(result.current.last).toBeNull();
    });

    it('persists null to localStorage', () => {
      const { result } = renderHook(() => useLastActivity());

      act(() => {
        result.current.record(activity('/practice/writing', 'ライティング'));
      });
      act(() => {
        result.current.clear();
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      // null を JSON.stringify すると "null" 文字列
      expect(stored).toBe('null');
    });

    it('is a no-op when already null (no spurious writes)', () => {
      const { result } = renderHook(() => useLastActivity());
      // 何も記録していない状態で clear しても例外を出さない
      act(() => {
        result.current.clear();
      });
      expect(result.current.last).toBeNull();
    });
  });

  describe('persistence across remounts', () => {
    it('a new hook instance reads the activity saved by a previous instance', () => {
      const { result: first, unmount } = renderHook(() => useLastActivity());

      act(() => {
        first.current.record(activity('/practice/cross', '跨ぎ'));
      });
      unmount();

      const { result: second } = renderHook(() => useLastActivity());
      expect(second.current.last).toEqual(activity('/practice/cross', '跨ぎ'));
    });

    it('pre-populated localStorage is reflected on initial render', () => {
      const seeded: LastActivity = activity('/practice/pre', '前期');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      const { result } = renderHook(() => useLastActivity());
      expect(result.current.last).toEqual(seeded);
    });

    it('reflects null when previous instance cleared', () => {
      const { result: first, unmount } = renderHook(() => useLastActivity());

      act(() => {
        first.current.record(activity('/practice/wipe', 'ワイプ'));
      });
      act(() => {
        first.current.clear();
      });
      unmount();

      const { result: second } = renderHook(() => useLastActivity());
      expect(second.current.last).toBeNull();
    });
  });

  describe('SSR / unsupported environment safety', () => {
    it('returns null and does not throw when localStorage is undefined', () => {
      const original = globalThis.localStorage;
      // happy-dom では localStorage が定義されているので一時的に無効化
      // @ts-expect-error -- テスト用に localStorage を削除して未対応環境を再現
      delete globalThis.localStorage;
      try {
        const { result } = renderHook(() => useLastActivity());
        expect(result.current.last).toBeNull();

        // record / clear も localStorage が無くても例外を出さず、
        // メモリ上の state は通常通り更新される
        act(() => {
          result.current.record(activity('/ssr', 'SSR'));
        });
        expect(result.current.last).toEqual(activity('/ssr', 'SSR'));

        act(() => {
          result.current.clear();
        });
        expect(result.current.last).toBeNull();
      } finally {
        // 他のテストに影響しないよう必ず復元
        // @ts-expect-error -- 復元
        globalThis.localStorage = original;
      }
    });
  });
});
