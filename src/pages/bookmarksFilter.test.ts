import { describe, it, expect } from 'vitest';
import {
  filterBookmarks,
  sortBookmarks,
  filterAndSortBookmarks,
  BOOKMARK_SORT_OPTIONS,
  type BookmarkSortKey,
} from './bookmarksFilter';
import type { BookmarkedItem } from '../hooks/useBookmarks';

// テスト用のブックマークファクトリ。省略フィールドは安全な既定値で補う。
function bm(over: Partial<BookmarkedItem> = {}): BookmarkedItem {
  return {
    id: 'id',
    english: '',
    japanese: '',
    pronunciation: '',
    source: '',
    addedAt: 0,
    ...over,
  };
}

const apple = bm({
  id: 'b-apple',
  english: 'Apple',
  japanese: 'りんご',
  pronunciation: 'ˈæp.əl',
  source: 'dictionary/fruit/apple',
  addedAt: 1000,
});
const dog = bm({
  id: 'b-dog',
  english: 'Dog',
  japanese: '犬',
  pronunciation: 'dɔːɡ',
  source: 'phrases/animals/dog-1',
  addedAt: 3000,
});
const zebra = bm({
  id: 'b-zebra',
  english: 'Zebra',
  japanese: '縞馬',
  pronunciation: 'ˈziː.brə',
  source: 'dictionary/animals/zebra',
  addedAt: 2000,
});

const fixture: BookmarkedItem[] = [apple, dog, zebra];

describe('filterBookmarks', () => {
  it('空クエリは全件を新しい配列で返す', () => {
    const result = filterBookmarks(fixture, '');
    expect(result).toEqual(fixture);
    expect(result).not.toBe(fixture);
  });

  it('空白のみのクエリは空とみなし全件', () => {
    expect(filterBookmarks(fixture, '   ')).toEqual(fixture);
  });

  it('english に部分一致(大小無視)', () => {
    expect(filterBookmarks(fixture, 'app')).toEqual([apple]);
    expect(filterBookmarks(fixture, 'APPLE')).toEqual([apple]);
    expect(filterBookmarks(fixture, 'dog')).toEqual([dog]);
  });

  it('japanese に部分一致', () => {
    expect(filterBookmarks(fixture, 'りんご')).toEqual([apple]);
    expect(filterBookmarks(fixture, '犬')).toEqual([dog]);
  });

  it('pronunciation に部分一致(大小無視)', () => {
    expect(filterBookmarks(fixture, 'brə')).toEqual([zebra]);
    // 'ÆP' を小文字化すると 'æp' になり apple の発音 'ˈæp.əl' に一致する。
    expect(filterBookmarks(fixture, 'ÆP')).toEqual([apple]);
  });

  it('source に部分一致', () => {
    expect(filterBookmarks(fixture, 'fruit')).toEqual([apple]);
    expect(filterBookmarks(fixture, 'phrases')).toEqual([dog]);
    // 'animals' は dog と zebra の source 両方に含まれる
    expect(filterBookmarks(fixture, 'animals')).toEqual([dog, zebra]);
  });

  it('一致なしは空配列', () => {
    expect(filterBookmarks(fixture, 'zzzzz')).toEqual([]);
  });

  it('元の配列を破壊しない', () => {
    const original = [...fixture];
    filterBookmarks(fixture, 'app');
    expect(fixture).toEqual(original);
  });
});

describe('sortBookmarks', () => {
  it('newest は addedAt 降順', () => {
    // addedAt: dog(3000) > zebra(2000) > apple(1000)
    expect(sortBookmarks(fixture, 'newest')).toEqual([dog, zebra, apple]);
  });

  it('oldest は addedAt 昇順', () => {
    expect(sortBookmarks(fixture, 'oldest')).toEqual([apple, zebra, dog]);
  });

  it('alphabetical は english 昇順', () => {
    // Apple, Dog, Zebra
    expect(sortBookmarks(fixture, 'alphabetical')).toEqual([apple, dog, zebra]);
  });

  it('newest/oldest の同点(同 addedAt)は入力順を保持する(安定ソート)', () => {
    const a = bm({ id: 'x', english: 'Banana', addedAt: 500 });
    const b = bm({ id: 'y', english: 'Avocado', addedAt: 500 });
    // 同時刻 → 入力順(a, b)をそのまま維持する(JS の安定ソートに依拠)。
    expect(sortBookmarks([a, b], 'newest')).toEqual([a, b]);
    expect(sortBookmarks([a, b], 'oldest')).toEqual([a, b]);
    // 入れ替えても入力順を保つ。
    expect(sortBookmarks([b, a], 'newest')).toEqual([b, a]);
    expect(sortBookmarks([b, a], 'oldest')).toEqual([b, a]);
  });

  it('元の配列を破壊しない', () => {
    const original = [...fixture];
    sortBookmarks(fixture, 'newest');
    expect(fixture).toEqual(original);
  });

  it('返り値は引数とは別の配列', () => {
    expect(sortBookmarks(fixture, 'alphabetical')).not.toBe(fixture);
  });
});

describe('filterAndSortBookmarks', () => {
  it('filter → sort を合成する', () => {
    // 'animals'(source)でフィルタ → dog, zebra が残る。
    // newest(addedAt 降順): dog(3000) > zebra(2000)
    expect(filterAndSortBookmarks(fixture, 'animals', 'newest')).toEqual([
      dog,
      zebra,
    ]);
    // oldest: zebra(2000) < dog(3000)
    expect(filterAndSortBookmarks(fixture, 'animals', 'oldest')).toEqual([
      zebra,
      dog,
    ]);
  });

  it('空クエリ + alphabetical は全件を英語昇順で返す', () => {
    expect(filterAndSortBookmarks(fixture, '', 'alphabetical')).toEqual([
      apple,
      dog,
      zebra,
    ]);
  });

  it('一致なしは空配列', () => {
    expect(filterAndSortBookmarks(fixture, 'zzz', 'newest')).toEqual([]);
  });
});

describe('BOOKMARK_SORT_OPTIONS', () => {
  it('3 つのキーを持つ', () => {
    expect(BOOKMARK_SORT_OPTIONS).toHaveLength(3);
    const keys = BOOKMARK_SORT_OPTIONS.map((o) => o.key);
    expect(keys).toEqual<BookmarkSortKey[]>([
      'newest',
      'oldest',
      'alphabetical',
    ]);
  });

  it('各キーに日本語 label が付いている', () => {
    const byKey = new Map(BOOKMARK_SORT_OPTIONS.map((o) => [o.key, o.label]));
    expect(byKey.get('newest')).toBe('新しい順');
    expect(byKey.get('oldest')).toBe('古い順');
    expect(byKey.get('alphabetical')).toBe('アルファベット順');
  });
});
