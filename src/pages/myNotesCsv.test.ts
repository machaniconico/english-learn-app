import { describe, it, expect } from 'vitest';
import {
  NOTES_CSV_HEADER,
  escapeCsvField,
  notesToCsv,
  buildNotesCsvFilename,
} from './myNotesCsv';
import type { NoteRow } from './myNotesFilter';

// テスト用の行ファクトリ。省略フィールドは安全な既定値で補う。
function row(over: Partial<NoteRow> = {}): NoteRow {
  return {
    wordId: 'id',
    note: '',
    english: null,
    japanese: null,
    ...over,
  };
}

describe('NOTES_CSV_HEADER', () => {
  it('列順は 英語, 日本語, メモ', () => {
    expect(NOTES_CSV_HEADER).toEqual(['英語', '日本語', 'メモ']);
  });
});

describe('escapeCsvField', () => {
  it('通常文字はそのまま返す', () => {
    expect(escapeCsvField('apple')).toBe('apple');
    expect(escapeCsvField('りんご')).toBe('りんご');
  });

  it('空文字はそのまま空文字', () => {
    expect(escapeCsvField('')).toBe('');
  });

  it('カンマを含む値は全体をクォート', () => {
    expect(escapeCsvField('a,b')).toBe('"a,b"');
    expect(escapeCsvField('1,000円')).toBe('"1,000円"');
  });

  it('二重引用符を含む値はクォートし内部の " を "" に二重化', () => {
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCsvField('"')).toBe('""""');
  });

  it('改行(LF)を含む値はクォート', () => {
    expect(escapeCsvField('line1\nline2')).toBe('"line1\nline2"');
  });

  it('改行(CR)を含む値はクォート', () => {
    expect(escapeCsvField('line1\rline2')).toBe('"line1\rline2"');
  });

  it('改行(CRLF)を含む値はクォート', () => {
    expect(escapeCsvField('line1\r\nline2')).toBe('"line1\r\nline2"');
  });

  it('カンマと二重引用符と改行が混在する値', () => {
    expect(escapeCsvField('a,"b"\nc')).toBe('"a,""b""\nc"');
  });
});

describe('notesToCsv', () => {
  it('空配列はヘッダー行のみ', () => {
    expect(notesToCsv([])).toBe('英語,日本語,メモ');
  });

  it('ヘッダーは日本語固定でカンマ区切り', () => {
    const csv = notesToCsv([]);
    expect(csv.startsWith('英語,日本語,メモ')).toBe(true);
  });

  it('複数行をヘッダー付きで出力し行区切りは CRLF', () => {
    const rows: NoteRow[] = [
      row({ english: 'Apple', japanese: 'りんご', note: '果物' }),
      row({ english: 'Dog', japanese: '犬', note: '動物' }),
    ];
    const expected = '英語,日本語,メモ\r\nApple,りんご,果物\r\nDog,犬,動物';
    expect(notesToCsv(rows)).toBe(expected);
  });

  it('english/japanese が null の場合は空文字として出力', () => {
    const rows: NoteRow[] = [
      row({ wordId: 'orphan-id', english: null, japanese: null, note: 'メモのみ' }),
    ];
    expect(notesToCsv(rows)).toBe('英語,日本語,メモ\r\n,,メモのみ');
  });

  it('note にカンマを含む場合はクォートされる', () => {
    const rows: NoteRow[] = [
      row({ english: 'Apple', japanese: 'りんご', note: '赤,甘い' }),
    ];
    expect(notesToCsv(rows)).toBe('英語,日本語,メモ\r\nApple,りんご,"赤,甘い"');
  });

  it('note に二重引用符を含む場合はクォートし "" に二重化', () => {
    const rows: NoteRow[] = [
      row({ english: 'Apple', japanese: 'りんご', note: 'say "hi"' }),
    ];
    expect(notesToCsv(rows)).toBe('英語,日本語,メモ\r\nApple,りんご,"say ""hi"""');
  });

  it('note に改行を含む場合はクォートされる(フィールド内改行保持)', () => {
    const rows: NoteRow[] = [
      row({ english: 'Apple', japanese: 'りんご', note: '1行目\n2行目' }),
    ];
    expect(notesToCsv(rows)).toBe('英語,日本語,メモ\r\nApple,りんご,"1行目\n2行目"');
  });

  it('english にカンマを含む場合もクォートされる', () => {
    const rows: NoteRow[] = [
      row({ english: 'a,b', japanese: null, note: 'x' }),
    ];
    expect(notesToCsv(rows)).toBe('英語,日本語,メモ\r\n"a,b",,x');
  });

  it('末尾に余分な改行を付けない', () => {
    const rows: NoteRow[] = [
      row({ english: 'A', japanese: 'あ', note: 'n1' }),
      row({ english: 'B', japanese: 'い', note: 'n2' }),
    ];
    const csv = notesToCsv(rows);
    expect(csv.endsWith('\r\n')).toBe(false);
    // 行数はヘッダー + 2 = 3 行(CRLF で split すると末尾に空要素が無い)
    expect(csv.split('\r\n')).toHaveLength(3);
  });

  it('行の列順は 英語, 日本語, メモ', () => {
    const rows: NoteRow[] = [
      row({ english: 'EN', japanese: 'JP', note: 'NOTE' }),
    ];
    expect(notesToCsv(rows)).toBe('英語,日本語,メモ\r\nEN,JP,NOTE');
  });
});

describe('buildNotesCsvFilename', () => {
  it('YYYY-MM-DD 形式(月日 0 埋め)でファイル名を返す', () => {
    // 2026年1月5日 → 月日が 0 埋めされる
    expect(buildNotesCsvFilename(new Date(2026, 0, 5))).toBe(
      'english-learn-word-notes-2026-01-05.csv',
    );
  });

  it('12月31日のような年末も正しく', () => {
    expect(buildNotesCsvFilename(new Date(2026, 11, 31))).toBe(
      'english-learn-word-notes-2026-12-31.csv',
    );
  });

  it('10月15日のような 2 桁月日はそのまま', () => {
    expect(buildNotesCsvFilename(new Date(2026, 9, 15))).toBe(
      'english-learn-word-notes-2026-10-15.csv',
    );
  });

  it('拡張子は .csv', () => {
    expect(buildNotesCsvFilename(new Date(2026, 0, 1))).toMatch(/\.csv$/);
  });

  it('現在時刻に依存しない(引数の日付のみを使う)', () => {
    // 固定 Date を使うので実行日に関わらず同じ結果になる
    expect(buildNotesCsvFilename(new Date(2025, 2, 9))).toBe(
      'english-learn-word-notes-2025-03-09.csv',
    );
  });
});
