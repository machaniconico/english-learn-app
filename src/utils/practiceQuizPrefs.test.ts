// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadPracticePrefs,
  savePracticePrefs,
  PRACTICE_PREFS_KEY,
} from './practiceQuizPrefs';

beforeEach(() => {
  localStorage.clear();
});

describe('practiceQuizPrefs', () => {
  it('未保存のときは既定値 {selection:null, count:10} を返す', () => {
    expect(loadPracticePrefs()).toEqual({ selection: null, count: 10 });
  });

  it('有効な selection / count を復元する', () => {
    localStorage.setItem(
      PRACTICE_PREFS_KEY,
      JSON.stringify({ selection: 'intermediate', count: 20 }),
    );
    expect(loadPracticePrefs()).toEqual({ selection: 'intermediate', count: 20 });
  });

  it('不正な selection は null に落とす', () => {
    localStorage.setItem(
      PRACTICE_PREFS_KEY,
      JSON.stringify({ selection: 'expert', count: 30 }),
    );
    expect(loadPracticePrefs()).toEqual({ selection: null, count: 30 });
  });

  it('10の倍数でない/10未満/非整数の count は 10 に落とす', () => {
    const cases = [
      { count: 25, expected: 10 },
      { count: 5, expected: 10 },
      { count: 0, expected: 10 },
      { count: 12.5, expected: 10 },
      { count: 'x', expected: 10 },
    ];
    for (const c of cases) {
      localStorage.setItem(
        PRACTICE_PREFS_KEY,
        JSON.stringify({ selection: 'beginner', count: c.count }),
      );
      expect(loadPracticePrefs().count).toBe(c.expected);
    }
  });

  it('壊れた JSON でも既定値を返す(例外を投げない)', () => {
    localStorage.setItem(PRACTICE_PREFS_KEY, '{not json');
    expect(loadPracticePrefs()).toEqual({ selection: null, count: 10 });
  });

  it('save→load のラウンドトリップが一致する', () => {
    savePracticePrefs({ selection: 'mixed', count: 60 });
    expect(loadPracticePrefs()).toEqual({ selection: 'mixed', count: 60 });
  });
});
