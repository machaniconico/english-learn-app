import { describe, it, expect } from 'vitest';
import { getRecoverySuggestion } from './recoverySuggestion';

describe('getRecoverySuggestion', () => {
  it('未学習(lastStudyDate 空)なら show=false', () => {
    expect(getRecoverySuggestion('', '2026-01-10')).toEqual({ show: false, daysAway: 0 });
  });

  it('離脱が threshold(既定3)未満なら show=false', () => {
    expect(getRecoverySuggestion('2026-01-08', '2026-01-10')).toEqual({
      show: false,
      daysAway: 2,
    });
  });

  it('離脱がちょうど threshold(3日)なら show=true', () => {
    expect(getRecoverySuggestion('2026-01-01', '2026-01-04')).toEqual({
      show: true,
      daysAway: 3,
    });
  });

  it('長期離脱では daysAway を返し show=true', () => {
    expect(getRecoverySuggestion('2026-01-01', '2026-01-15')).toEqual({
      show: true,
      daysAway: 14,
    });
  });

  it('threshold をカスタムできる', () => {
    expect(getRecoverySuggestion('2026-01-01', '2026-01-05', 5).show).toBe(false); // 4日<5
    expect(getRecoverySuggestion('2026-01-01', '2026-01-06', 5).show).toBe(true); // 5日>=5
  });
});
