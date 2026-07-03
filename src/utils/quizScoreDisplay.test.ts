import { describe, expect, it } from 'vitest';
import { percentage, scoreBarColor, scoreEmoji } from './quizScoreDisplay';

describe('percentage', () => {
  it('rounds correct over total to the nearest percentage', () => {
    expect(percentage(2, 3)).toBe(67);
    expect(percentage(1, 6)).toBe(17);
    expect(percentage(4, 5)).toBe(80);
  });

  it('returns 0 when total is 0 or less', () => {
    expect(percentage(1, 0)).toBe(0);
    expect(percentage(1, -1)).toBe(0);
  });
});

describe('scoreBarColor', () => {
  it('uses green at 80 and above', () => {
    expect(scoreBarColor(80)).toBe('bg-green-500');
    expect(scoreBarColor(100)).toBe('bg-green-500');
  });

  it('uses yellow from 60 through 79', () => {
    expect(scoreBarColor(60)).toBe('bg-yellow-500');
    expect(scoreBarColor(79)).toBe('bg-yellow-500');
  });

  it('uses red below 60', () => {
    expect(scoreBarColor(59)).toBe('bg-red-500');
  });
});

describe('scoreEmoji', () => {
  it('uses celebration at 80 and above', () => {
    expect(scoreEmoji(80)).toBe('🎉');
    expect(scoreEmoji(100)).toBe('🎉');
  });

  it('uses thumbs up from 60 through 79', () => {
    expect(scoreEmoji(60)).toBe('👍');
    expect(scoreEmoji(79)).toBe('👍');
  });

  it('uses flex below 60', () => {
    expect(scoreEmoji(59)).toBe('💪');
  });
});
