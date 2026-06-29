import { describe, it, expect } from 'vitest';
import { pickDistractors } from './listeningQuiz';
import type { PhraseItem } from '../data/types';

function item(id: string, japanese: string): PhraseItem {
  return { id, english: `en-${id}`, japanese } as PhraseItem;
}

const pool = [
  item('1', 'いち'),
  item('2', 'に'),
  item('3', 'さん'),
  item('4', 'よん'),
  item('5', 'ご'),
];

describe('pickDistractors', () => {
  it('正解(correctId)の項目は必ず除外される', () => {
    // correct='1'(いち) を除いた4件から選ぶので「いち」は決して含まれない。
    for (let i = 0; i < 20; i++) {
      const d = pickDistractors(pool, '1', 3);
      expect(d).not.toContain('いち');
    }
  });

  it('count 件を返す(候補が十分なとき)', () => {
    expect(pickDistractors(pool, '1', 3)).toHaveLength(3);
  });

  it('候補が count に満たなければある分だけ返す', () => {
    const small = [item('1', 'a'), item('2', 'b')];
    // correct='1' を除くと1件 → count=3 でも1件
    expect(pickDistractors(small, '1', 3)).toHaveLength(1);
  });

  it('返り値はすべて非正解項目の日本語訳', () => {
    const d = pickDistractors(pool, '1', 4);
    const allowed = new Set(['に', 'さん', 'よん', 'ご']);
    expect(d.every((x) => allowed.has(x))).toBe(true);
    // 4件すべて(重複なし)
    expect(new Set(d).size).toBe(4);
  });

  it('correctId が存在しなくても全件から選べる', () => {
    const d = pickDistractors(pool, 'nonexistent', 5);
    expect(d).toHaveLength(5);
  });
});
