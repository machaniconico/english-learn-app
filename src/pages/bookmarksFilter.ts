// BookmarksPage 用のブックマーク検索・並べ替え純粋関数。
// React にもブラウザ API にも依存しないので、UI とは独立してテストできる。
// myNotesFilter.ts の流儀(関数構成・SORT_OPTIONS・合成関数)を踏襲する。

import type { BookmarkedItem } from '../hooks/useBookmarks';

// 並べ替えキー。UI の <select> の value として使う。
export type BookmarkSortKey = 'newest' | 'oldest' | 'alphabetical';

// 並べ替え選択肢。label は日本語で UI 表示に使う。
export const BOOKMARK_SORT_OPTIONS: { key: BookmarkSortKey; label: string }[] = [
  { key: 'newest', label: '新しい順' },
  { key: 'oldest', label: '古い順' },
  { key: 'alphabetical', label: 'アルファベット順' },
];

// query でブックマークを部分一致フィルタする。大小無視・空クエリは全件・入力非破壊。
// english / japanese / pronunciation / source のいずれかに一致すれば残す。
export function filterBookmarks(
  items: BookmarkedItem[],
  query: string,
): BookmarkedItem[] {
  const q = query.trim().toLowerCase();
  if (q === '') return [...items];

  return items.filter((item) => {
    if (item.english.toLowerCase().includes(q)) return true;
    if (item.japanese.toLowerCase().includes(q)) return true;
    if (item.pronunciation.toLowerCase().includes(q)) return true;
    if (item.source.toLowerCase().includes(q)) return true;
    return false;
  });
}

// items を key で並べ替える。引数を破壊せず新配列を返す(安定ソート)。
export function sortBookmarks(
  items: BookmarkedItem[],
  key: BookmarkSortKey,
): BookmarkedItem[] {
  const sorted = [...items];

  // Array.prototype.sort は ES2019 以降で安定。比較が 0(同 addedAt)の要素は
  // 入力順を保つ ので、ここでは余計なタイブレークを入れず元の並び(保存順)を維持する。
  switch (key) {
    case 'newest':
      // addedAt 降順。同点は入力順を保持(安定ソート)。
      return sorted.sort((a, b) => b.addedAt - a.addedAt);
    case 'oldest':
      // addedAt 昇順。同点は入力順を保持(安定ソート)。
      return sorted.sort((a, b) => a.addedAt - b.addedAt);
    case 'alphabetical':
      return sorted.sort((a, b) => a.english.localeCompare(b.english));
    default:
      return sorted;
  }
}

// filter -> sort を合成した便利関数。UI 側はこれ1つを呼べばよい。
export function filterAndSortBookmarks(
  items: BookmarkedItem[],
  query: string,
  key: BookmarkSortKey,
): BookmarkedItem[] {
  return sortBookmarks(filterBookmarks(items, query), key);
}
