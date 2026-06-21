// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecentWords, MAX, STORAGE_KEY, type RecentWord } from './useRecentWords';

const word = (id: string, english = id, japanese = `${id}の和訳`): RecentWord => ({
  id,
  english,
  japanese,
});

describe('useRecentWords', () => {
  beforeEach(() => {
    // setup.ts clears localStorage in afterEach; this handles state before each test
    localStorage.clear();
  });

  describe('initial state', () => {
    it('returns empty list when localStorage has no data', () => {
      const { result } = renderHook(() => useRecentWords());
      expect(result.current.recent).toEqual([]);
    });

    it('loads persisted recent words from localStorage on mount (newest-first)', () => {
      const seeded: RecentWord[] = [
        word('apple', 'apple', 'りんご'),
        word('banana', 'banana', 'バナナ'),
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      const { result } = renderHook(() => useRecentWords());
      expect(result.current.recent).toEqual(seeded);
    });

    it('returns empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
      const { result } = renderHook(() => useRecentWords());
      expect(result.current.recent).toEqual([]);
    });

    it('returns empty array when localStorage contains a non-array value', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
      const { result } = renderHook(() => useRecentWords());
      expect(result.current.recent).toEqual([]);
    });

    it('filters out entries missing required string fields', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          word('ok', 'ok', 'OK'),
          { id: 'no-english', japanese: '欠落' },
          { id: 123, english: 'bad-id', japanese: '数値id' },
          { id: 'null-jp', english: 'bad', japanese: null },
          { english: 'missing-id', japanese: 'なし' },
          'just-a-string',
          null,
          word('also-ok', 'also-ok', 'これもOK'),
        ]),
      );

      const { result } = renderHook(() => useRecentWords());
      expect(result.current.recent).toEqual([
        word('ok', 'ok', 'OK'),
        word('also-ok', 'also-ok', 'これもOK'),
      ]);
    });
  });

  describe('addWord', () => {
    it('adds a word to the front of the list (newest-first)', () => {
      const { result } = renderHook(() => useRecentWords());

      act(() => {
        result.current.addWord(word('apple', 'apple', 'りんご'));
      });
      act(() => {
        result.current.addWord(word('banana', 'banana', 'バナナ'));
      });

      expect(result.current.recent).toEqual([
        word('banana', 'banana', 'バナナ'),
        word('apple', 'apple', 'りんご'),
      ]);
    });

    it('persists to localStorage after add', () => {
      const { result } = renderHook(() => useRecentWords());

      act(() => {
        result.current.addWord(word('persist-add', 'persist', '永続化'));
      });

      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? '[]',
      ) as RecentWord[];
      expect(stored).toEqual([word('persist-add', 'persist', '永続化')]);
    });

    it('ignores empty english', () => {
      const { result } = renderHook(() => useRecentWords());

      act(() => {
        result.current.addWord(word('empty-en', '', '空の英語'));
      });

      expect(result.current.recent).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('moves a word to the front when the same id is added again (dedupe by id)', () => {
      const { result } = renderHook(() => useRecentWords());

      act(() => {
        result.current.addWord(word('apple', 'apple', 'りんご'));
        result.current.addWord(word('banana', 'banana', 'バナナ'));
        result.current.addWord(word('cherry', 'cherry', 'さくらんぼ'));
      });
      act(() => {
        // 同一 id で再追加: 内容が上書きされ先頭に繰り上げ、重複しない
        result.current.addWord(word('apple', 'apple', 'りんご(再)'));
      });

      expect(result.current.recent).toEqual([
        word('apple', 'apple', 'りんご(再)'),
        word('cherry', 'cherry', 'さくらんぼ'),
        word('banana', 'banana', 'バナナ'),
      ]);
    });

    it('dedupes by english when ids differ but english matches', () => {
      const { result } = renderHook(() => useRecentWords());

      act(() => {
        result.current.addWord(word('a1', 'apple', 'りんご'));
        result.current.addWord(word('b1', 'banana', 'バナナ'));
      });
      act(() => {
        // id は異なるが english が一致する: 既存を差し替え先頭へ
        result.current.addWord(word('a2', 'apple', 'りんご2'));
      });

      expect(result.current.recent).toEqual([
        word('a2', 'apple', 'りんご2'),
        word('b1', 'banana', 'バナナ'),
      ]);
    });

    it(`truncates to MAX (${MAX}) entries, dropping the oldest`, () => {
      const { result } = renderHook(() => useRecentWords());

      act(() => {
        for (let i = 1; i <= MAX + 3; i++) {
          result.current.addWord(word(`w${i}`, `en${i}`, `和${i}`));
        }
      });

      expect(result.current.recent).toHaveLength(MAX);
      // 最新の MAX 件が残り、古いものは落ちる
      expect(result.current.recent[0]).toEqual(word(`w${MAX + 3}`, `en${MAX + 3}`, `和${MAX + 3}`));
      expect(result.current.recent[MAX - 1]).toEqual(word('w4', 'en4', '和4'));
    });
  });

  describe('clear', () => {
    it('removes all recent words', () => {
      const { result } = renderHook(() => useRecentWords());

      act(() => {
        result.current.addWord(word('a', 'a', 'エー'));
        result.current.addWord(word('b', 'b', 'ビー'));
      });
      act(() => {
        result.current.clear();
      });

      expect(result.current.recent).toEqual([]);
    });

    it('persists the cleared state to localStorage', () => {
      const { result } = renderHook(() => useRecentWords());

      act(() => {
        result.current.addWord(word('wipe', 'wipe', 'ワイプ'));
      });
      act(() => {
        result.current.clear();
      });

      const stored = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? '[]',
      ) as RecentWord[];
      expect(stored).toEqual([]);
    });
  });

  describe('persistence across remounts', () => {
    it('a new hook instance reads words saved by a previous instance', () => {
      const { result: first, unmount } = renderHook(() => useRecentWords());

      act(() => {
        first.current.addWord(word('cross-mount', 'cross', '跨ぎ'));
      });
      unmount();

      const { result: second } = renderHook(() => useRecentWords());
      expect(second.current.recent).toEqual([word('cross-mount', 'cross', '跨ぎ')]);
    });

    it('pre-populated localStorage is reflected on initial render', () => {
      const seeded: RecentWord[] = [word('pre-a', 'preA', '前期A'), word('pre-b', 'preB', '前期B')];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

      const { result } = renderHook(() => useRecentWords());
      expect(result.current.recent).toEqual(seeded);
    });
  });

  describe('SSR / unsupported environment safety', () => {
    it('returns empty list and does not throw when localStorage is undefined', () => {
      const original = globalThis.localStorage;
      // happy-dom では localStorage が定義されているので一時的に無効化
      // @ts-expect-error -- テスト用に localStorage を削除して未対応環境を再現
      delete globalThis.localStorage;
      try {
        const { result } = renderHook(() => useRecentWords());
        expect(result.current.recent).toEqual([]);

        // addWord / clear も localStorage が無くても例外を出さず、
        // メモリ上の state は通常通り更新される
        act(() => {
          result.current.addWord(word('s', 's', 'SSR'));
        });
        expect(result.current.recent).toEqual([word('s', 's', 'SSR')]);

        act(() => {
          result.current.clear();
        });
        expect(result.current.recent).toEqual([]);
      } finally {
        // 他のテストに影響しないよう必ず復元
        // @ts-expect-error -- 復元
        globalThis.localStorage = original;
      }
    });
  });
});
