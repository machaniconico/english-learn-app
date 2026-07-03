// WeakPointsPage 用の並べ替え・フィルタ純粋関数。
// React にもブラウザ API にも依存しないので、UI とは独立してテストできる。
import type { WeakPoint } from '../hooks/useWeakPoints';
import { isWeakPointMastered } from '../utils/reviewQueue';

// マスター判定は daily review queue と同じ canonical 述語を使う。
export const isMastered = isWeakPointMastered;

// 並べ替えキー。UI の <select> の value として使う。
export type WeakPointSortKey = 'newest' | 'oldest' | 'mostReviewed' | 'leastReviewed';

// 並べ替え選択肢。label は日本語で UI 表示に使う。
export const WEAKPOINT_SORT_OPTIONS: { key: WeakPointSortKey; label: string }[] = [
  { key: 'newest', label: '新しい順' },
  { key: 'oldest', label: '古い順' },
  { key: 'mostReviewed', label: '復習回数が多い順' },
  { key: 'leastReviewed', label: '復習回数が少ない順' },
];

// items を key で並べ替える。引数を破壊せず([...items])新配列を返す。
// reviewCount 系の同数タイブレークは timestamp 降順(新しい順)。
export function sortWeakPoints(items: WeakPoint[], key: WeakPointSortKey): WeakPoint[] {
  const sorted = [...items];

  switch (key) {
    case 'newest':
      return sorted.sort((a, b) => b.timestamp - a.timestamp);
    case 'oldest':
      return sorted.sort((a, b) => a.timestamp - b.timestamp);
    case 'mostReviewed':
      return sorted.sort((a, b) => {
        const byCount = b.reviewCount - a.reviewCount;
        if (byCount !== 0) return byCount;
        return b.timestamp - a.timestamp;
      });
    case 'leastReviewed':
      return sorted.sort((a, b) => {
        const byCount = a.reviewCount - b.reviewCount;
        if (byCount !== 0) return byCount;
        return b.timestamp - a.timestamp;
      });
    default:
      return sorted;
  }
}

// type フィルタ -> 未習得フィルタ -> 並べ替え を合成した便利関数。
// UI 側はこれ1つを呼べばよい。引数は破壊しない。
export function filterAndSortWeakPoints(
  items: WeakPoint[],
  opts: { type: 'all' | WeakPoint['type']; unmasteredOnly: boolean; sort: WeakPointSortKey },
): WeakPoint[] {
  let result = items;
  if (opts.type !== 'all') {
    result = result.filter((wp) => wp.type === opts.type);
  }
  if (opts.unmasteredOnly) {
    result = result.filter((wp) => !isMastered(wp));
  }
  return sortWeakPoints(result, opts.sort);
}
