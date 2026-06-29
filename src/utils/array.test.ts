import { describe, it, expect } from 'vitest';
import { shuffleArray, arraysEqual } from './array';

describe('shuffleArray', () => {
  it('元配列を破壊せず、同じ多重集合を返す', () => {
    const src = ['a', 'b', 'c', 'd'];
    const out = shuffleArray(src);
    expect(src).toEqual(['a', 'b', 'c', 'd']); // 非破壊
    expect(out).toHaveLength(4);
    expect([...out].sort()).toEqual(['a', 'b', 'c', 'd']); // 要素保持
  });

  it('空配列・1要素はそのまま', () => {
    expect(shuffleArray([])).toEqual([]);
    expect(shuffleArray([42])).toEqual([42]);
  });
});

describe('arraysEqual', () => {
  it('同じ順序・同じ要素なら true', () => {
    expect(arraysEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
  });

  it('順序が違えば false', () => {
    expect(arraysEqual(['a', 'b', 'c'], ['a', 'c', 'b'])).toBe(false);
  });

  it('長さが違えば false', () => {
    expect(arraysEqual(['a', 'b'], ['a', 'b', 'c'])).toBe(false);
  });

  it('空配列同士は true', () => {
    expect(arraysEqual([], [])).toBe(true);
  });

  it('1要素の差を検出する', () => {
    expect(arraysEqual(['x'], ['y'])).toBe(false);
  });
});
