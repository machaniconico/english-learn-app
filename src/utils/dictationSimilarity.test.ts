import { describe, it, expect } from 'vitest';
import {
  normalize,
  levenshtein,
  calcSimilarity,
  gradeResult,
} from './dictationSimilarity';

describe('normalize', () => {
  it('小文字化し、記号を除去し、空白を畳んで trim する', () => {
    expect(normalize('  Hello, World!! ')).toBe('hello world');
    expect(normalize('It’s   a\tTEST.')).toBe('its a test');
  });

  it('英数字は保持する', () => {
    expect(normalize('Plan B2 for 2026')).toBe('plan b2 for 2026');
  });
});

describe('levenshtein', () => {
  it('同一文字列は距離0', () => {
    expect(levenshtein('abc', 'abc')).toBe(0);
  });

  it('1文字の置換・挿入・削除は距離1', () => {
    expect(levenshtein('abc', 'abd')).toBe(1);
    expect(levenshtein('abc', 'abcd')).toBe(1);
    expect(levenshtein('abc', 'ab')).toBe(1);
  });

  it('空文字との距離は相手の長さ', () => {
    expect(levenshtein('', 'hello')).toBe(5);
    expect(levenshtein('hello', '')).toBe(5);
  });

  it('古典例 kitten→sitting は3', () => {
    expect(levenshtein('kitten', 'sitting')).toBe(3);
  });
});

describe('calcSimilarity', () => {
  it('正規化して完全一致なら1(記号・大小・空白差を無視)', () => {
    expect(calcSimilarity('Hello, world!', 'hello world')).toBe(1);
  });

  it('どちらか空(正規化後)なら0', () => {
    expect(calcSimilarity('', 'hello')).toBe(0);
    expect(calcSimilarity('!!!', 'hello')).toBe(0); // 記号のみ→正規化で空
  });

  it('部分一致は (len-dist)/len', () => {
    // "abcd" vs "abce": len4, dist1 → 0.75
    expect(calcSimilarity('abcd', 'abce')).toBeCloseTo(0.75, 5);
  });
});

describe('gradeResult', () => {
  it('完全一致は perfect (similarity 1)', () => {
    expect(gradeResult('The cat sat.', 'the cat sat')).toEqual({
      grade: 'perfect',
      similarity: 1,
    });
  });

  it('類似度 0.8 超は close', () => {
    // 10文字中9一致 → 0.9 > 0.8 → close
    const r = gradeResult('abcdefghij', 'abcdefghiX');
    expect(r.grade).toBe('close');
    expect(r.similarity).toBeGreaterThan(0.8);
  });

  it('類似度 0.8 以下は wrong', () => {
    const r = gradeResult('abcd', 'abXY'); // 4文字中2一致 → 0.5
    expect(r.grade).toBe('wrong');
  });

  it('境界: ちょうど 0.8 は wrong(0.8超でないため)', () => {
    // "abcde" vs "abcdX": len5 dist1 → 0.8 ちょうど → wrong
    const r = gradeResult('abcde', 'abcdX');
    expect(r.similarity).toBeCloseTo(0.8, 5);
    expect(r.grade).toBe('wrong');
  });
});
