import { describe, it, expect } from 'vitest';
import { estimateReadingMinutes } from './readingTime';

describe('estimateReadingMinutes', () => {
  it('空文字・空白のみは 0(バッジ非表示の合図)', () => {
    expect(estimateReadingMinutes('')).toBe(0);
    expect(estimateReadingMinutes('   \n\t ')).toBe(0);
  });

  it('本文があれば最低1分', () => {
    expect(estimateReadingMinutes('Hello world')).toBe(1);
  });

  it('語数 / wpm を切り上げる(既定 wpm=200)', () => {
    const text200 = Array.from({ length: 200 }, () => 'word').join(' ');
    const text250 = Array.from({ length: 250 }, () => 'word').join(' ');
    const text400 = Array.from({ length: 400 }, () => 'word').join(' ');
    expect(estimateReadingMinutes(text200)).toBe(1); // 200/200=1
    expect(estimateReadingMinutes(text250)).toBe(2); // ceil(1.25)=2
    expect(estimateReadingMinutes(text400)).toBe(2); // 400/200=2
  });

  it('複数の空白・改行を区切りとして正しく語数を数える', () => {
    expect(estimateReadingMinutes('one   two\nthree\t four')).toBe(1); // 4語 → 1分
  });

  it('wpm をカスタムできる', () => {
    const text100 = Array.from({ length: 100 }, () => 'word').join(' ');
    expect(estimateReadingMinutes(text100, 100)).toBe(1); // 100/100=1
    expect(estimateReadingMinutes(text100, 50)).toBe(2); // 100/50=2
  });
});
