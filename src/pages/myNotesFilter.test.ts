import { describe, it, expect } from 'vitest';
import {
  filterNoteRows,
  sortNoteRows,
  filterAndSortNoteRows,
  NOTE_SORT_OPTIONS,
  type NoteRow,
  type NoteSortKey,
} from './myNotesFilter';

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

const apple = row({
  wordId: 'dict-apple',
  english: 'Apple',
  japanese: 'りんご',
  note: '果物',
});
const dog = row({
  wordId: 'dict-dog',
  english: 'Dog',
  japanese: '犬',
  note: '動物の犬。忠誠心の象徴。',
});
const zebra = row({
  wordId: 'dict-zebra',
  english: 'Zebra',
  japanese: '縞馬',
  note: 'ab',
});
const orphan = row({
  wordId: 'orphan-id',
  english: null,
  japanese: null,
  note: '辞書に無い単語のメモ',
});

const fixture: NoteRow[] = [apple, dog, zebra, orphan];

describe('filterNoteRows', () => {
  it('空クエリは全件を新しい配列で返す', () => {
    const result = filterNoteRows(fixture, '');
    expect(result).toEqual(fixture);
    // 同じ要素でも新配列(破壊しないことの目安)
    expect(result).not.toBe(fixture);
  });

  it('空白のみのクエリは空とみなす', () => {
    expect(filterNoteRows(fixture, '   ')).toEqual(fixture);
  });

  it('english に部分一致(大小無視)', () => {
    expect(filterNoteRows(fixture, 'app')).toEqual([apple]);
    expect(filterNoteRows(fixture, 'APPLE')).toEqual([apple]);
    expect(filterNoteRows(fixture, 'dog')).toEqual([dog]);
  });

  it('japanese に部分一致', () => {
    expect(filterNoteRows(fixture, 'りんご')).toEqual([apple]);
    expect(filterNoteRows(fixture, '犬')).toEqual([dog]);
  });

  it('note に部分一致', () => {
    expect(filterNoteRows(fixture, '果物')).toEqual([apple]);
    expect(filterNoteRows(fixture, '動物')).toEqual([dog]);
  });

  it('wordId に部分一致', () => {
    expect(filterNoteRows(fixture, 'orphan-id')).toEqual([orphan]);
    expect(filterNoteRows(fixture, 'dict-apple')).toEqual([apple]);
  });

  it('null フィールド(english/japanese)は安全にスキップ', () => {
    // orphan は english/japanese が null。note 経由で引けること。
    expect(filterNoteRows(fixture, '辞書に無い')).toEqual([orphan]);
    // english/japanese が null でも落ちないこと(全件フィルタの上で)
    expect(filterNoteRows([orphan], '')).toEqual([orphan]);
  });

  it('一致なしは空配列', () => {
    expect(filterNoteRows(fixture, 'zzzzz')).toEqual([]);
  });

  it('元の配列を破壊しない', () => {
    const original = [...fixture];
    filterNoteRows(fixture, 'app');
    expect(fixture).toEqual(original);
  });
});

describe('sortNoteRows', () => {
  it('word-asc は英語(無ければ wordId)昇順', () => {
    // localeCompare の既定は大小無視の辞書順。
    //   Apple, Dog, orphan-id(english 無し), Zebra の順
    expect(sortNoteRows(fixture, 'word-asc')).toEqual([
      apple,
      dog,
      orphan,
      zebra,
    ]);
  });

  it('word-desc は英語(無ければ wordId)降順', () => {
    expect(sortNoteRows(fixture, 'word-desc')).toEqual([
      zebra,
      orphan,
      dog,
      apple,
    ]);
  });

  it('note-length-desc は note が長い順', () => {
    // 文字数: dog(12) > orphan(10) > apple(2) = zebra(2)
    //   dog.note    = "動物の犬。忠誠心の象徴。" (length 12)
    //   orphan.note = "辞書に無い単語のメモ"     (length 10)
    //   apple.note  = "果物"                      (length 2)
    //   zebra.note  = "ab"                        (length 2)
    // 期待順: dog, orphan, apple, zebra(apple と zebra は同長 → 英語昇順で Apple < Zebra)
    expect(sortNoteRows(fixture, 'note-length-desc')).toEqual([
      dog,
      orphan,
      apple,
      zebra,
    ]);
  });

  it('note-length-desc の同点は英語昇順で安定タイブレーク', () => {
    // apple と zebra は note.length がどちらも 2。
    // 英語昇順なので Apple が Zebra より先。
    const result = sortNoteRows(fixture, 'note-length-desc');
    const appleIdx = result.indexOf(apple);
    const zebraIdx = result.indexOf(zebra);
    expect(appleIdx).toBeLessThan(zebraIdx);
  });

  it('元の配列を破壊しない', () => {
    const original = [...fixture];
    sortNoteRows(fixture, 'word-desc');
    expect(fixture).toEqual(original);
  });

  it('返り値は引数とは別の配列', () => {
    expect(sortNoteRows(fixture, 'word-asc')).not.toBe(fixture);
  });
});

describe('filterAndSortNoteRows', () => {
  it('filter → sort を合成する', () => {
    // 'a' でフィルタすると Apple, Zebra, orphan(辞書に無い単語のメモ) が残る。
    // note-length-desc で並べ替え:
    //   apple.note(2), zebra.note(2), orphan.note(10)
    //   → orphan, apple, zebra(apple と zebra は同長 → Apple < Zebra)
    expect(filterAndSortNoteRows(fixture, 'a', 'note-length-desc')).toEqual([
      orphan,
      apple,
      zebra,
    ]);
  });

  it('空クエリ + word-asc は全件を英語昇順で返す', () => {
    expect(filterAndSortNoteRows(fixture, '', 'word-asc')).toEqual([
      apple,
      dog,
      orphan,
      zebra,
    ]);
  });

  it('一致なしは空配列', () => {
    expect(filterAndSortNoteRows(fixture, 'zzz', 'word-asc')).toEqual([]);
  });
});

describe('NOTE_SORT_OPTIONS', () => {
  it('3 つのキーを持つ', () => {
    expect(NOTE_SORT_OPTIONS).toHaveLength(3);
    const keys = NOTE_SORT_OPTIONS.map((o) => o.key);
    expect(keys).toEqual<NoteSortKey[]>([
      'word-asc',
      'word-desc',
      'note-length-desc',
    ]);
  });

  it('各キーに日本語 label が付いている', () => {
    const byKey = new Map(NOTE_SORT_OPTIONS.map((o) => [o.key, o.label]));
    expect(byKey.get('word-asc')).toBe('英語 A→Z');
    expect(byKey.get('word-desc')).toBe('英語 Z→A');
    expect(byKey.get('note-length-desc')).toBe('メモが長い順');
  });
});
