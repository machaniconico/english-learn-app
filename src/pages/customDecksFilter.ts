// CustomDecksPage 用のデッキ検索・並べ替え純粋関数。
// React にもブラウザ API にも依存しないので、UI とは独立してテストできる。

import type { CustomDeck } from '../data/types';

// 並べ替えキー。UI の <select> の value として使う。
export type DeckSortKey = 'newest' | 'name' | 'updated' | 'size';

// 並べ替え選択肢。label は日本語で UI 表示に使う。
export const DECK_SORT_OPTIONS: { key: DeckSortKey; label: string }[] = [
  { key: 'newest', label: '作成が新しい順' },
  { key: 'updated', label: '更新が新しい順' },
  { key: 'name', label: '名前順' },
  { key: 'size', label: 'カード数が多い順' },
];

// query でデッキを部分一致フィルタする。大小無視・undefined 安全・空クエリは全件。
export function filterDecks(decks: CustomDeck[], query: string): CustomDeck[] {
  const q = query.trim().toLowerCase();
  if (q === '') return [...decks];

  return decks.filter((deck) => {
    // name は常に非 null。description は undefined の可能性があるので安全に。
    if (deck.name.toLowerCase().includes(q)) return true;
    if (deck.description !== undefined && deck.description.toLowerCase().includes(q)) return true;
    return false;
  });
}

// decks を key で並べ替える。引数を破壊せず新配列を返す。
export function sortDecks(decks: CustomDeck[], key: DeckSortKey): CustomDeck[] {
  const sorted = [...decks];

  switch (key) {
    case 'newest':
      // createdAt 降順(新しいほど先)。
      return sorted.sort((a, b) => b.createdAt - a.createdAt);
    case 'updated':
      // updatedAt 降順(最近更新したほど先)。
      return sorted.sort((a, b) => b.updatedAt - a.updatedAt);
    case 'name':
      // name 昇順(localeCompare で大小無視の辞書順)。
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'size':
      // items.length 降順(カード数が多いほど先)。
      return sorted.sort((a, b) => b.items.length - a.items.length);
    default:
      return sorted;
  }
}

// filter -> sort を合成した便利関数。UI 側はこれ1つを呼べばよい。
export function filterAndSortDecks(
  decks: CustomDeck[],
  query: string,
  key: DeckSortKey,
): CustomDeck[] {
  return sortDecks(filterDecks(decks, query), key);
}