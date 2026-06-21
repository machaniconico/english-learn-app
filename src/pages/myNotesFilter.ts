// MyNotesPage 用のメモ検索・並べ替え純粋関数。
// React にもブラウザ API にも依存しないので、UI とは独立してテストできる。

// メモ一覧の1行分。entry が辞書に存在しない(孤児)場合は english/japanese が null になる。
export interface NoteRow {
  wordId: string;
  note: string;
  english: string | null;
  japanese: string | null;
}

// 並べ替えキー。UI の <select> の value として使う。
export type NoteSortKey = 'word-asc' | 'word-desc' | 'note-length-desc';

// 並べ替え選択肢。label は日本語で UI 表示に使う。
export const NOTE_SORT_OPTIONS: { key: NoteSortKey; label: string }[] = [
  { key: 'word-asc', label: '英語 A→Z' },
  { key: 'word-desc', label: '英語 Z→A' },
  { key: 'note-length-desc', label: 'メモが長い順' },
];

// row の表示見出し(英語、無ければ wordId)を返す。sort の一貫したキーとして使う。
function rowLabel(row: NoteRow): string {
  return row.english ?? row.wordId;
}

// query でメモ行を部分一致フィルタする。大小無視・null 安全・空クエリは全件。
export function filterNoteRows(rows: NoteRow[], query: string): NoteRow[] {
  const q = query.trim().toLowerCase();
  if (q === '') return [...rows];

  return rows.filter((row) => {
    // wordId は常に非 null。english/japanese/note は null の可能性があるので安全に。
    if (row.wordId.toLowerCase().includes(q)) return true;
    if (row.english !== null && row.english.toLowerCase().includes(q)) return true;
    if (row.japanese !== null && row.japanese.toLowerCase().includes(q)) return true;
    if (row.note.toLowerCase().includes(q)) return true;
    return false;
  });
}

// rows を key で並べ替える。引数を破壊せず新配列を返す。
export function sortNoteRows(rows: NoteRow[], key: NoteSortKey): NoteRow[] {
  const sorted = [...rows];

  switch (key) {
    case 'word-asc':
      return sorted.sort((a, b) =>
        rowLabel(a).localeCompare(rowLabel(b)),
      );
    case 'word-desc':
      return sorted.sort(
        (a, b) => rowLabel(b).localeCompare(rowLabel(a)),
      );
    case 'note-length-desc':
      // note.length 降順。同点は英語(無ければ wordId)昇順で安定タイブレーク。
      return sorted.sort((a, b) => {
        const byLen = b.note.length - a.note.length;
        if (byLen !== 0) return byLen;
        return rowLabel(a).localeCompare(rowLabel(b));
      });
    default:
      return sorted;
  }
}

// filter -> sort を合成した便利関数。UI 側はこれ1つを呼べばよい。
export function filterAndSortNoteRows(
  rows: NoteRow[],
  query: string,
  key: NoteSortKey,
): NoteRow[] {
  return sortNoteRows(filterNoteRows(rows, query), key);
}
