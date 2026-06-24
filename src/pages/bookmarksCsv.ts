// BookmarksPage 用のブックマーク CSV 生成純粋関数。
// React にもブラウザ API にも依存しないので、UI とは独立してテストできる。
// Excel/表計算ソフト等で再利用できる RFC4180 風の CSV 文字列を組み立てる。

import type { BookmarkedItem } from '../hooks/useBookmarks';
// escapeCsvField は myNotesCsv 側で確立済の実装を再利用し二重管理を避ける。
import { escapeCsvField } from './myNotesCsv';

// CSV の列順を表すヘッダー。行の組み立てでもこの順序で並べる。
export const BOOKMARKS_CSV_HEADER = [
  '英語',
  '日本語',
  '発音',
  '出典',
  '保存日',
] as const;

// addedAt(ミリ秒)をローカル暦日の 'YYYY-MM-DD' に整形する。
// UTC ではなくローカルの年月日を使う(toISOString だと UTC ずれで日付が前後しうる)。
function toLocalDateStr(ms: number): string {
  const d = new Date(ms);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ブックマーク配列を CSV 文字列に変換する。
// 1 行目はヘッダー(BOOKMARKS_CSV_HEADER を escapeCsvField してカンマ連結)。
// 各 item は [english, japanese, pronunciation, source, 保存日] を escapeCsvField してカンマ連結。
// 保存日は item.addedAt(ms)をローカル暦日 'YYYY-MM-DD' に整形(Date.now は呼ばない=決定的)。
// null/undefined フィールドは '' 扱い。行区切りは CRLF('\r\n')。末尾に余分な改行は付けない。
// items が空でもヘッダー行のみの CSV を返す。
export function bookmarksToCsv(items: BookmarkedItem[]): string {
  const headerLine = BOOKMARKS_CSV_HEADER.map(escapeCsvField).join(',');
  const lines = [headerLine];
  for (const item of items) {
    const fields = [
      item.english ?? '',
      item.japanese ?? '',
      item.pronunciation ?? '',
      item.source ?? '',
      toLocalDateStr(item.addedAt),
    ].map(escapeCsvField);
    lines.push(fields.join(','));
  }
  return lines.join('\r\n');
}

// ダウンロードファイル名を組み立てる。
// date のローカル年月日で `bookmarks-YYYY-MM-DD.csv` を返す。月・日は 0 埋め 2 桁。
export function buildBookmarksCsvFilename(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `bookmarks-${yyyy}-${mm}-${dd}.csv`;
}
