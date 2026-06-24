import { describe, it, expect } from 'vitest';
import {
  filterDecks,
  sortDecks,
  filterAndSortDecks,
  DECK_SORT_OPTIONS,
  type DeckSortKey,
} from './customDecksFilter';
import type { CustomDeck } from '../data/types';

// テスト用のデッキファクトリ。省略フィールドは安全な既定値で補う。
function deck(over: Partial<CustomDeck> = {}): CustomDeck {
  return {
    id: 'id',
    name: 'deck',
    description: undefined,
    items: [],
    createdAt: 0,
    updatedAt: 0,
    ...over,
  };
}

const apple = deck({
  id: 'd-apple',
  name: 'Apple Words',
  description: 'りんご関連の単語',
  items: [
    { id: 'i1', english: 'apple', japanese: 'りんご', pronunciation: 'æpl' },
  ],
  createdAt: 1_000,
  updatedAt: 1_500,
});
const zebra = deck({
  id: 'd-zebra',
  name: 'Zebra Words',
  description: '動物のしましま',
  items: [
    { id: 'i1', english: 'zebra', japanese: '縞馬', pronunciation: 'z' },
    { id: 'i2', english: 'zoo', japanese: '動物園', pronunciation: 'z' },
  ],
  createdAt: 2_000,
  updatedAt: 1_000,
});
const nodesc = deck({
  id: 'd-nodesc',
  name: 'NoDescription Deck',
  description: undefined,
  items: [],
  createdAt: 500,
  updatedAt: 2_000,
});

const fixture: CustomDeck[] = [apple, zebra, nodesc];

describe('filterDecks', () => {
  it('空クエリは全件を新しい配列で返す', () => {
    const result = filterDecks(fixture, '');
    expect(result).toEqual(fixture);
    // 同じ要素でも新配列(破壊しないことの目安)
    expect(result).not.toBe(fixture);
  });

  it('空白のみのクエリは空とみなす', () => {
    expect(filterDecks(fixture, '   ')).toEqual(fixture);
  });

  it('name に部分一致(大小無視)', () => {
    expect(filterDecks(fixture, 'apple')).toEqual([apple]);
    expect(filterDecks(fixture, 'APPLE')).toEqual([apple]);
    expect(filterDecks(fixture, 'zebra')).toEqual([zebra]);
  });

  it('description に部分一致', () => {
    expect(filterDecks(fixture, 'りんご')).toEqual([apple]);
    expect(filterDecks(fixture, '動物')).toEqual([zebra]);
  });

  it('description が undefined のデッキでも落ちず name で引ける', () => {
    expect(filterDecks(fixture, 'NoDescription')).toEqual([nodesc]);
    // 全件フィルタ上でも落ちないこと
    expect(filterDecks([nodesc], '')).toEqual([nodesc]);
    // description に無い文字列を投げても落ちないこと
    expect(filterDecks([nodesc], 'りんご')).toEqual([]);
  });

  it('一致なしは空配列', () => {
    expect(filterDecks(fixture, 'zzzzz')).toEqual([]);
  });

  it('元の配列を破壊しない', () => {
    const original = [...fixture];
    filterDecks(fixture, 'apple');
    expect(fixture).toEqual(original);
  });
});

describe('sortDecks', () => {
  it('newest は createdAt 降順(新しいほど先)', () => {
    // createdAt: zebra(2000) > apple(1000) > nodesc(500)
    expect(sortDecks(fixture, 'newest')).toEqual([zebra, apple, nodesc]);
  });

  it('updated は updatedAt 降順(最近更新が先)', () => {
    // updatedAt: nodesc(2000) > apple(1500) > zebra(1000)
    expect(sortDecks(fixture, 'updated')).toEqual([nodesc, apple, zebra]);
  });

  it('name は名前昇順(localeCompare)', () => {
    // Apple Words, NoDescription Deck, Zebra Words の順
    expect(sortDecks(fixture, 'name')).toEqual([apple, nodesc, zebra]);
  });

  it('size は items.length 降順(カード数が多いほど先)', () => {
    // items.length: zebra(2) > apple(1) > nodesc(0)
    expect(sortDecks(fixture, 'size')).toEqual([zebra, apple, nodesc]);
  });

  it('同じキー同士は安定(入力順を維持)', () => {
    // apple と同じ createdAt のデッキを2つ追加し、入力順を保つことを確認。
    const a = deck({ id: 'a', name: 'A', createdAt: 100, updatedAt: 0 });
    const b = deck({ id: 'b', name: 'B', createdAt: 100, updatedAt: 0 });
    const c = deck({ id: 'c', name: 'C', createdAt: 100, updatedAt: 0 });
    const list = [a, b, c];
    // 全て同 createdAt なので入力順 [a, b, c] が維持される(Array.prototype.sort は安定)。
    expect(sortDecks(list, 'newest')).toEqual([a, b, c]);
  });

  it('元の配列を破壊しない', () => {
    const original = [...fixture];
    sortDecks(fixture, 'newest');
    expect(fixture).toEqual(original);
  });

  it('返り値は引数とは別の配列', () => {
    expect(sortDecks(fixture, 'newest')).not.toBe(fixture);
  });
});

describe('filterAndSortDecks', () => {
  it('filter → sort を合成する', () => {
    // 'a' でフィルタ: Apple Words, Zebra Words が残る(description にも a は含まれない前提を確認)
    //   apple.name 'Apple Words'.includes('a') -> true
    //   zebra.name 'Zebra Words'.includes('a') -> true
    //   nodesc.name 'NoDescription Deck'.includes('a') -> false
    //   apple.description 'りんご関連の単語' -> 'a' 含まず
    //   zebra.description '動物のしましま' -> 'a' 含まず
    // newest で並べ替え: createdAt apple(1000) > zebra(2000) の降順 -> zebra, apple
    expect(filterAndSortDecks(fixture, 'a', 'newest')).toEqual([zebra, apple]);
  });

  it('空クエリ + newest は全件を createdAt 降順で返す', () => {
    expect(filterAndSortDecks(fixture, '', 'newest')).toEqual([zebra, apple, nodesc]);
  });

  it('一致なしは空配列', () => {
    expect(filterAndSortDecks(fixture, 'zzz', 'newest')).toEqual([]);
  });
});

describe('DECK_SORT_OPTIONS', () => {
  it('4 つのキーを持つ', () => {
    expect(DECK_SORT_OPTIONS).toHaveLength(4);
    const keys = DECK_SORT_OPTIONS.map((o) => o.key);
    expect(keys).toEqual<DeckSortKey[]>(['newest', 'updated', 'name', 'size']);
  });

  it('各キーに日本語 label が付いている', () => {
    const byKey = new Map(DECK_SORT_OPTIONS.map((o) => [o.key, o.label]));
    expect(byKey.get('newest')).toBe('作成が新しい順');
    expect(byKey.get('updated')).toBe('更新が新しい順');
    expect(byKey.get('name')).toBe('名前順');
    expect(byKey.get('size')).toBe('カード数が多い順');
  });
});