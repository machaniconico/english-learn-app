import { describe, it, expect } from 'vitest';
import {
  PALETTE_COMMANDS,
  filterCommands,
  type PaletteCommand,
} from './commandPalette';

// テスト用の最小コマンドセット。ランキングの順序検証に使う。
const sample: PaletteCommand[] = [
  { id: 'a', label: '辞書', path: '/dictionary', group: 'メイン', keywords: ['dictionary', 'jisho'] },
  { id: 'b', label: '読解', path: '/reading-practice', group: '練習', keywords: ['reading', 'dokkai'] },
  { id: 'c', label: 'Part3', path: '/part3-listening', group: 'リスニング', keywords: ['part3', 'part 3', 'listening'] },
];

describe('PALETTE_COMMANDS', () => {
  it('仕様の全目的地(34件)を定義している', () => {
    // メイン3 + 練習9(ドリル追加) + リスニング4 + 学習管理10(my-notes/daily-quiz追加) + ツール8 = 34
    expect(PALETTE_COMMANDS.length).toBe(34);
  });

  it('全コマンドが必須フィールドを持つ', () => {
    for (const cmd of PALETTE_COMMANDS) {
      expect(typeof cmd.id).toBe('string');
      expect(cmd.id.length).toBeGreaterThan(0);
      expect(typeof cmd.label).toBe('string');
      expect(cmd.label.length).toBeGreaterThan(0);
      expect(cmd.path.startsWith('/')).toBe(true);
      expect(['メイン', '練習', 'リスニング', '学習管理', 'ツール']).toContain(cmd.group);
      expect(Array.isArray(cmd.keywords)).toBe(true);
      expect(cmd.keywords.length).toBeGreaterThan(0);
    }
  });

  it('id が一意', () => {
    const ids = PALETTE_COMMANDS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('my-notes が 学習管理グループに存在する (US-002)', () => {
    const cmd = PALETTE_COMMANDS.find((c) => c.id === 'my-notes');
    expect(cmd).toBeDefined();
    expect(cmd?.path).toBe('/my-notes');
    expect(cmd?.group).toBe('学習管理');
    expect(cmd?.label).toBe('単語メモ');
  });

  it('daily-quiz が 学習管理グループに存在する', () => {
    const cmd = PALETTE_COMMANDS.find((c) => c.id === 'daily-quiz');
    expect(cmd).toBeDefined();
    expect(cmd?.path).toBe('/daily-quiz');
    expect(cmd?.group).toBe('学習管理');
    expect(cmd?.label).toBe('デイリー10問クイズ');
  });

  it('drill が 練習グループに存在し、日本語/英語クエリでヒットする', () => {
    const cmd = PALETTE_COMMANDS.find((c) => c.id === 'drill');
    expect(cmd).toBeDefined();
    expect(cmd?.path).toBe('/drill');
    expect(cmd?.group).toBe('練習');
    expect(cmd?.label).toBe('ドリルモード');

    expect(filterCommands('ドリル').some((c) => c.id === 'drill')).toBe(true);
    expect(filterCommands('drill').some((c) => c.id === 'drill')).toBe(true);
    expect(filterCommands('連続').some((c) => c.id === 'drill')).toBe(true);
  });

  it('path が一意', () => {
    const paths = PALETTE_COMMANDS.map((c) => c.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('主要な目的地が含まれる', () => {
    const paths = PALETTE_COMMANDS.map((c) => c.path);
    const expected = [
      '/',
      '/dictionary',
      '/search',
      '/toeic-practice',
      '/reading-practice',
      '/error-correction',
      '/dictation',
      '/reorder',
      '/matching',
      '/typing',
      '/pronunciation',
      '/drill',
      '/part1-listening',
      '/part2-listening',
      '/part3-listening',
      '/part4-listening',
      '/decks',
      '/bookmarks',
      '/srs',
      '/daily',
      '/daily-quiz',
      '/review',
      '/plan',
      '/study-guide',
      '/level-test',
      '/progress',
      '/analytics',
      '/weekly-report',
      '/weak-points',
      '/score',
      '/achievements',
      '/backup',
      '/settings',
    ];
    for (const p of expected) {
      expect(paths).toContain(p);
    }
  });
});

describe('filterCommands', () => {
  it('空クエリなら全コマンドを元の順序で返す', () => {
    expect(filterCommands('')).toEqual(PALETTE_COMMANDS);
    expect(filterCommands('   ')).toEqual(PALETTE_COMMANDS);
  });

  it('デフォルト引数で PALETTE_COMMANDS を使う', () => {
    expect(filterCommands('').length).toBe(PALETTE_COMMANDS.length);
  });

  it('大文字小文字を無視して一致する', () => {
    const lower = filterCommands('toeic');
    const upper = filterCommands('TOEIC');
    expect(lower.map((c) => c.id)).toEqual(upper.map((c) => c.id));
    expect(lower.length).toBeGreaterThan(0);
    expect(lower.some((c) => c.id === 'toeic-practice')).toBe(true);
  });

  it('前後空白を trim する', () => {
    expect(filterCommands('  toeic  ')).toEqual(filterCommands('toeic'));
  });

  it('label の前方一致が label 部分一致より上位に来る', () => {
    // rank 0: label前方一致 / rank 1: label部分一致 / rank 2: keyword一致 の順に並ぶこと
    const ordered = filterCommands('Part', [
      { id: 'kw', label: '別のラベル', path: '/x', group: 'ツール', keywords: ['part', 'p'] },
      { id: 'partial', label: '私のPartメモ', path: '/y', group: 'ツール', keywords: ['memo'] },
      { id: 'prefix', label: 'PartX', path: '/z', group: 'ツール', keywords: ['other'] },
    ]);
    // 期待順: prefix(rank0) → partial(rank1) → kw(rank2)
    expect(ordered.map((c) => c.id)).toEqual(['prefix', 'partial', 'kw']);
  });

  it('keyword 一致でヒットする (例 jisho → 辞書)', () => {
    const result = filterCommands('jisho');
    expect(result.some((c) => c.id === 'dictionary')).toBe(true);
  });

  it('ローマ字読み keyword でヒットする (例 dokkai → 読解)', () => {
    const result = filterCommands('dokkai');
    expect(result.some((c) => c.id === 'reading-practice')).toBe(true);
  });

  it('複数語 AND 検索: "part 3" が Part3 にヒットする', () => {
    const result = filterCommands('part 3');
    expect(result.some((c) => c.id === 'part3-listening')).toBe(true);
    // Part1/Part2/Part4 は '3' を含まないので除外される
    expect(result.some((c) => c.id === 'part1-listening')).toBe(false);
    expect(result.some((c) => c.id === 'part2-listening')).toBe(false);
    expect(result.some((c) => c.id === 'part4-listening')).toBe(false);
  });

  it('複数語 AND 検索: 全トークンがマッチするものだけ残す', () => {
    const result = filterCommands('weekly report');
    expect(result.some((c) => c.id === 'weekly-report')).toBe(true);
    expect(result.some((c) => c.id === 'daily')).toBe(false);
  });

  it('該当なしは空配列を返す', () => {
    expect(filterCommands('zzzzzznotexist')).toEqual([]);
  });

  it('設定ページが日本語/英語クエリでヒットする (US-003)', () => {
    // 日本語ラベル + ローマ字/英語キーワード両方で settings に絞り込めること。
    const byJapanese = filterCommands('設定');
    expect(byJapanese.some((c) => c.id === 'settings')).toBe(true);
    const byEnglish = filterCommands('settings');
    expect(byEnglish.some((c) => c.id === 'settings')).toBe(true);
    // ローマ字読み(せってい)でもヒットすること。
    const byRomaji = filterCommands('せってい');
    expect(byRomaji.some((c) => c.id === 'settings')).toBe(true);
  });

  it('単語メモが日本語クエリでヒットする (US-002)', () => {
    // 日本語ラベル「単語メモ」で my-notes に絞り込めること。
    const byJapanese = filterCommands('単語メモ');
    expect(byJapanese.some((c) => c.id === 'my-notes')).toBe(true);
    // 英語キーワードでもヒットすること。
    const byEnglish = filterCommands('memo');
    expect(byEnglish.some((c) => c.id === 'my-notes')).toBe(true);
    // ローマ字読みでもヒットすること。
    const byRomaji = filterCommands('tango memo');
    expect(byRomaji.some((c) => c.id === 'my-notes')).toBe(true);
  });

  it('同ランクは元の定義順を維持する(安定ソート)', () => {
    // 'Part' で Part1..Part4 がすべて label 前方一致(rank0) → 定義順に並ぶ
    const parts = filterCommands('Part').filter((c) => c.group === 'リスニング');
    expect(parts.map((c) => c.id)).toEqual([
      'part1-listening',
      'part2-listening',
      'part3-listening',
      'part4-listening',
    ]);
  });

  it('commands 引数で別リストを注入できる(純粋性)', () => {
    const custom: PaletteCommand[] = [
      { id: 'x', label: 'カスタム', path: '/x', group: 'メイン', keywords: ['custom'] },
    ];
    expect(filterCommands('custom', custom)).toEqual(custom);
    expect(filterCommands('', custom)).toEqual(custom);
  });

  it('入力配列を破壊しない(非破壊)', () => {
    const original = [...sample];
    filterCommands('辞書', sample);
    expect(sample).toEqual(original);
  });

  it('関数は純粋: 同入力には同出力', () => {
    const a = filterCommands('part 3');
    const b = filterCommands('part 3');
    expect(a).toEqual(b);
  });
});
