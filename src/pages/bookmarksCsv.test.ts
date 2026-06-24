import { describe, it, expect } from 'vitest';
import {
  BOOKMARKS_CSV_HEADER,
  bookmarksToCsv,
  buildBookmarksCsvFilename,
} from './bookmarksCsv';
import { escapeCsvField } from './myNotesCsv';
import type { BookmarkedItem } from '../hooks/useBookmarks';

// テスト用のブックマークファクトリ。省略フィールドは安全な既定値で補う。
function item(over: Partial<BookmarkedItem> = {}): BookmarkedItem {
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

// ローカル暦日でちょうど 2026-03-09 になる timestamp。
// new Date(year, monthIndex, day, ...) はローカルタイムで構築されるので
// 環境のタイムゾーンに依存せず保存日整形を検証できる。
const MAR_9_2026 = new Date(2026, 2, 9, 12, 0, 0).getTime();

describe('BOOKMARKS_CSV_HEADER', () => {
  it('列順は 英語, 日本語, 発音, 出典, 保存日', () => {
    expect(BOOKMARKS_CSV_HEADER).toEqual([
      '英語',
      '日本語',
      '発音',
      '出典',
      '保存日',
    ]);
  });
});

describe('escapeCsvField (myNotesCsv から再利用)', () => {
  it('通常文字はそのまま返す', () => {
    expect(escapeCsvField('apple')).toBe('apple');
    expect(escapeCsvField('りんご')).toBe('りんご');
  });

  it('空文字はそのまま空文字', () => {
    expect(escapeCsvField('')).toBe('');
  });

  it('カンマを含む値は全体をクォート', () => {
    expect(escapeCsvField('a,b')).toBe('"a,b"');
  });

  it('二重引用符を含む値はクォートし内部の " を "" に二重化', () => {
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""');
  });

  it('改行を含む値はクォート', () => {
    expect(escapeCsvField('line1\nline2')).toBe('"line1\nline2"');
    expect(escapeCsvField('line1\r\nline2')).toBe('"line1\r\nline2"');
  });
});

describe('bookmarksToCsv', () => {
  it('空配列はヘッダー行のみ', () => {
    expect(bookmarksToCsv([])).toBe('英語,日本語,発音,出典,保存日');
  });

  it('ヘッダーは日本語固定でカンマ区切り', () => {
    const csv = bookmarksToCsv([]);
    expect(csv.startsWith('英語,日本語,発音,出典,保存日')).toBe(true);
  });

  it('1件をヘッダー付きで出力し列順は 英語,日本語,発音,出典,保存日', () => {
    const csv = bookmarksToCsv([
      item({
        english: 'Good morning',
        japanese: 'おはよう',
        pronunciation: 'gʊd ˈmɔːrnɪŋ',
        source: 'phrases/greetings/basic-1',
        addedAt: MAR_9_2026,
      }),
    ]);
    expect(csv).toBe(
      '英語,日本語,発音,出典,保存日\r\nGood morning,おはよう,gʊd ˈmɔːrnɪŋ,phrases/greetings/basic-1,2026-03-09',
    );
  });

  it('複数行を出力し行区切りは CRLF', () => {
    const csv = bookmarksToCsv([
      item({ english: 'Apple', japanese: 'りんご', addedAt: MAR_9_2026 }),
      item({ english: 'Dog', japanese: '犬', addedAt: MAR_9_2026 }),
    ]);
    expect(csv).toBe(
      '英語,日本語,発音,出典,保存日\r\nApple,りんご,,,2026-03-09\r\nDog,犬,,,2026-03-09',
    );
  });

  it('保存日は addedAt(ms)をローカル暦日 YYYY-MM-DD に整形する', () => {
    const csv = bookmarksToCsv([
      item({ english: 'X', addedAt: new Date(2026, 0, 5, 8, 30).getTime() }),
    ]);
    expect(csv).toContain(',2026-01-05');
  });

  it('カンマを含む値はクォートされる', () => {
    const csv = bookmarksToCsv([
      item({ english: 'a,b', source: 'x,y', addedAt: MAR_9_2026 }),
    ]);
    expect(csv).toBe(
      '英語,日本語,発音,出典,保存日\r\n"a,b",,,"x,y",2026-03-09',
    );
  });

  it('二重引用符を含む値はクォートし "" に二重化', () => {
    const csv = bookmarksToCsv([
      item({ english: 'say "hi"', addedAt: MAR_9_2026 }),
    ]);
    expect(csv).toBe(
      '英語,日本語,発音,出典,保存日\r\n"say ""hi""",,,,2026-03-09',
    );
  });

  it('改行を含む値はクォートされ内部改行を保持する', () => {
    const csv = bookmarksToCsv([
      item({ japanese: '1行目\n2行目', addedAt: MAR_9_2026 }),
    ]);
    expect(csv).toBe(
      '英語,日本語,発音,出典,保存日\r\n,"1行目\n2行目",,,2026-03-09',
    );
  });

  it('null/undefined フィールドは空文字として出力', () => {
    // BookmarkedItem 型上は string だが、ストレージ由来で欠損しうるので防御的に検証。
    const broken = {
      id: 'b',
      english: null,
      japanese: undefined,
      pronunciation: null,
      source: undefined,
      addedAt: MAR_9_2026,
    } as unknown as BookmarkedItem;
    expect(bookmarksToCsv([broken])).toBe(
      '英語,日本語,発音,出典,保存日\r\n,,,,2026-03-09',
    );
  });

  it('末尾に余分な改行を付けない', () => {
    const csv = bookmarksToCsv([
      item({ english: 'A', addedAt: MAR_9_2026 }),
      item({ english: 'B', addedAt: MAR_9_2026 }),
    ]);
    expect(csv.endsWith('\r\n')).toBe(false);
    expect(csv.split('\r\n')).toHaveLength(3);
  });
});

describe('buildBookmarksCsvFilename', () => {
  it('bookmarks-YYYY-MM-DD.csv 形式(月日 0 埋め)でファイル名を返す', () => {
    expect(buildBookmarksCsvFilename(new Date(2026, 0, 5))).toBe(
      'bookmarks-2026-01-05.csv',
    );
  });

  it('年末も正しく', () => {
    expect(buildBookmarksCsvFilename(new Date(2026, 11, 31))).toBe(
      'bookmarks-2026-12-31.csv',
    );
  });

  it('2 桁月日はそのまま', () => {
    expect(buildBookmarksCsvFilename(new Date(2026, 9, 15))).toBe(
      'bookmarks-2026-10-15.csv',
    );
  });

  it('拡張子は .csv', () => {
    expect(buildBookmarksCsvFilename(new Date(2026, 0, 1))).toMatch(/\.csv$/);
  });

  it('現在時刻に依存しない(引数の日付のみを使う)', () => {
    expect(buildBookmarksCsvFilename(new Date(2025, 2, 9))).toBe(
      'bookmarks-2025-03-09.csv',
    );
  });
});
