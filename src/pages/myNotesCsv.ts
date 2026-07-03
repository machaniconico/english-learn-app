// MyNotesPage 用のメモ CSV 生成純粋関数。
// React にもブラウザ API にも依存しないので、UI とは独立してテストできる。
// Anki/Excel 等で再利用できる RFC4180 準拠の CSV 文字列を組み立てる。

import type { NoteRow } from './myNotesFilter';

// CSV の列順を表すヘッダー。行の組み立てでもこの順序で並べる。
export const NOTES_CSV_HEADER = ['英語', '日本語', 'メモ'] as const;

// RFC4180 準拠で 1 フィールドをエスケープする。
// CSV/数式インジェクション対策として、表計算ソフトで数式扱いされうる先頭文字は
// シングルクォートで無害化してから既存の引用符ラップを適用する。
// 値に " , \n, \r のいずれかを含む場合は全体を " で囲み、内部の " は "" に二重化する。
// いずれも含まない場合はそのまま返す。空文字はそのまま ''。
export function escapeCsvField(value: string): string {
  if (value === '') return '';
  const sanitized = /^[=+\-@\t]/.test(value) ? `'${value}` : value;
  if (/[",\n\r]/.test(sanitized)) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
}

// メモ行の配列を CSV 文字列に変換する。
// 1 行目はヘッダー(NOTES_CSV_HEADER を escapeCsvField してカンマ連結)。
// 各 row は [english ?? '', japanese ?? '', note] を escapeCsvField してカンマ連結。
// 行区切りは CRLF('\r\n')。末尾に余分な改行は付けない。
// rows が空でもヘッダー行のみの CSV を返す。
export function notesToCsv(rows: NoteRow[]): string {
  const headerLine = NOTES_CSV_HEADER.map(escapeCsvField).join(',');
  const lines = [headerLine];
  for (const row of rows) {
    const fields = [row.english ?? '', row.japanese ?? '', row.note].map(
      escapeCsvField,
    );
    lines.push(fields.join(','));
  }
  return lines.join('\r\n');
}

// ダウンロードファイル名を組み立てる。
// date のローカル年月日で `english-learn-word-notes-YYYY-MM-DD.csv` を返す。
// 月・日は 0 埋め 2 桁。
export function buildNotesCsvFilename(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `english-learn-word-notes-${yyyy}-${mm}-${dd}.csv`;
}
