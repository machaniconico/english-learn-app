import { describe, expect, it } from 'vitest';
import { estimateReadingMinutes } from './readingTime';

function words(count: number): string {
  return Array.from({ length: count }, (_, index) => `word${index}`).join(' ');
}

describe('estimateReadingMinutes', () => {
  it('空文字や空白のみは 0 を返す', () => {
    expect(estimateReadingMinutes('')).toBe(0);
    expect(estimateReadingMinutes('   \n\t  ')).toBe(0);
  });

  it('短いテキストは最低1分を返す', () => {
    expect(estimateReadingMinutes('one two three')).toBe(1);
  });

  it('単語数がデフォルト wpm でちょうど割り切れる場合はその商を返す', () => {
    expect(estimateReadingMinutes(words(400))).toBe(2);
  });

  it('カスタム wpm を使って読了時間を計算する', () => {
    expect(estimateReadingMinutes(words(201), 100)).toBe(3);
  });

  it('端数がある場合は切り上げる', () => {
    expect(estimateReadingMinutes(words(401))).toBe(3);
  });

  it('連続空白・改行・タブ・前後空白を区切りとして扱う', () => {
    const text = '  alpha   beta\n gamma\t\tdelta  ';

    expect(estimateReadingMinutes(text, 3)).toBe(2);
  });
});
