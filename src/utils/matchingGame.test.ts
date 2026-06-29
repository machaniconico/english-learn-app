import { describe, it, expect } from 'vitest';
import {
  shuffleArray,
  formatTime,
  getStars,
  buildCards,
  type MatchingItem,
} from './matchingGame';

function items(n: number): MatchingItem[] {
  return Array.from({ length: n }, (_, i) => ({
    english: `en${i}`,
    japanese: `ja${i}`,
  }));
}

describe('formatTime', () => {
  it('秒を mm:ss にゼロ埋め整形する', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(600)).toBe('10:00');
  });
});

describe('getStars', () => {
  it('最少手(moves<=pairCount)で3つ星', () => {
    expect(getStars(5, 5)).toBe(3);
    expect(getStars(3, 5)).toBe(3);
  });

  it('pairCount*2 以下で2つ星', () => {
    expect(getStars(6, 5)).toBe(2);
    expect(getStars(10, 5)).toBe(2);
  });

  it('それ以上は1つ星', () => {
    expect(getStars(11, 5)).toBe(1);
    expect(getStars(100, 5)).toBe(1);
  });
});

describe('shuffleArray', () => {
  it('元配列を破壊せず、同じ要素を保持する', () => {
    const src = [1, 2, 3, 4, 5];
    const out = shuffleArray(src);
    expect(src).toEqual([1, 2, 3, 4, 5]); // 非破壊
    expect(out).toHaveLength(5);
    expect([...out].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]); // 同じ多重集合
  });
});

describe('buildCards', () => {
  it('各ペアにつき english/japanese の2枚を作る', () => {
    const cards = buildCards(items(4));
    expect(cards).toHaveLength(8); // 4ペア × 2
    const en = cards.filter((c) => c.type === 'english');
    const ja = cards.filter((c) => c.type === 'japanese');
    expect(en).toHaveLength(4);
    expect(ja).toHaveLength(4);
  });

  it('9件以上は8件(=16枚)に絞る', () => {
    const cards = buildCards(items(12));
    expect(cards).toHaveLength(16);
  });

  it('pairId は english/japanese で対応し、各 pairId が2枚ずつ存在する', () => {
    const cards = buildCards(items(3));
    for (let pid = 0; pid < 3; pid++) {
      const pair = cards.filter((c) => c.pairId === pid);
      expect(pair).toHaveLength(2);
      expect(pair.map((c) => c.type).sort()).toEqual(['english', 'japanese']);
    }
  });

  it('全カードが初期状態 matched=false', () => {
    const cards = buildCards(items(2));
    expect(cards.every((c) => c.matched === false)).toBe(true);
  });
});
