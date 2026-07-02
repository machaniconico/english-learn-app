import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DRILL_PREFS_KEY,
  DRILL_RECENT_KEY,
  DRILL_STATS_KEY,
  createEmptyDrillStats,
  loadDrillPrefs,
  loadDrillRecent,
  loadDrillStats,
  recordDrillAnswer,
  saveDrillPrefs,
  saveDrillRecent,
  saveDrillStats,
} from './drillStats';
import type { DrillPrefs, DrillStatsData } from './drillStats';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('createEmptyDrillStats', () => {
  it('total/byGenre/byDifficulty をすべてゼロで初期化する', () => {
    const stats = createEmptyDrillStats();

    expect(stats.total).toEqual({ answered: 0, correct: 0 });
    expect(stats.byGenre).toEqual({
      'fill-blank': { answered: 0, correct: 0 },
      vocab: { answered: 0, correct: 0 },
      'ja-en': { answered: 0, correct: 0 },
      'en-ja': { answered: 0, correct: 0 },
      listening: { answered: 0, correct: 0 },
    });
    expect(stats.byDifficulty).toEqual({
      beginner: { answered: 0, correct: 0 },
      intermediate: { answered: 0, correct: 0 },
      advanced: { answered: 0, correct: 0 },
      expert: { answered: 0, correct: 0 },
    });
  });

  it('呼び出しごとに新しいオブジェクトを返す', () => {
    const a = createEmptyDrillStats();
    const b = createEmptyDrillStats();

    expect(a).not.toBe(b);
    expect(a.total).not.toBe(b.total);
    expect(a.byGenre.vocab).not.toBe(b.byGenre.vocab);
  });
});

describe('recordDrillAnswer', () => {
  it('正解時に total/byGenre/byDifficulty を加算する', () => {
    const stats = createEmptyDrillStats();

    const next = recordDrillAnswer(stats, 'vocab', 'beginner', true);

    expect(next.total).toEqual({ answered: 1, correct: 1 });
    expect(next.byGenre.vocab).toEqual({ answered: 1, correct: 1 });
    expect(next.byDifficulty.beginner).toEqual({ answered: 1, correct: 1 });
    expect(next.byGenre.listening).toEqual({ answered: 0, correct: 0 });
    expect(next.byDifficulty.expert).toEqual({ answered: 0, correct: 0 });
  });

  it('不正解時は answered だけを加算する', () => {
    const stats = createEmptyDrillStats();

    const next = recordDrillAnswer(stats, 'listening', 'advanced', false);

    expect(next.total).toEqual({ answered: 1, correct: 0 });
    expect(next.byGenre.listening).toEqual({ answered: 1, correct: 0 });
    expect(next.byDifficulty.advanced).toEqual({ answered: 1, correct: 0 });
  });

  it('入力 stats を破壊しない', () => {
    const stats = createEmptyDrillStats();
    const before = structuredClone(stats);

    const next = recordDrillAnswer(stats, 'ja-en', 'intermediate', true);

    expect(stats).toEqual(before);
    expect(next).not.toBe(stats);
    expect(next.total).not.toBe(stats.total);
    expect(next.byGenre).not.toBe(stats.byGenre);
    expect(next.byDifficulty).not.toBe(stats.byDifficulty);
  });
});

describe('loadDrillStats/saveDrillStats', () => {
  it('save→load で統計を復元する', () => {
    const stats = recordDrillAnswer(createEmptyDrillStats(), 'en-ja', 'expert', true);

    saveDrillStats(stats);

    expect(loadDrillStats()).toEqual(stats);
  });

  it('未保存なら空統計を返す', () => {
    expect(loadDrillStats()).toEqual(createEmptyDrillStats());
  });

  it('壊れた JSON なら空統計にフォールバックする', () => {
    localStorage.setItem(DRILL_STATS_KEY, '{broken');

    expect(loadDrillStats()).toEqual(createEmptyDrillStats());
  });

  it('数値でない totals を含む不正な形なら空統計にフォールバックする', () => {
    localStorage.setItem(
      DRILL_STATS_KEY,
      JSON.stringify({
        total: { answered: '1', correct: 0 },
        byGenre: {},
        byDifficulty: {},
      }),
    );

    expect(loadDrillStats()).toEqual(createEmptyDrillStats());
  });

  it('必須ジャンルが欠ける不正な形なら空統計にフォールバックする', () => {
    const invalid: Partial<DrillStatsData> = {
      total: { answered: 1, correct: 1 },
      byGenre: { vocab: { answered: 1, correct: 1 } } as DrillStatsData['byGenre'],
      byDifficulty: createEmptyDrillStats().byDifficulty,
    };
    localStorage.setItem(DRILL_STATS_KEY, JSON.stringify(invalid));

    expect(loadDrillStats()).toEqual(createEmptyDrillStats());
  });

  it('localStorage.getItem が例外を投げても空統計を返す', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    expect(loadDrillStats()).toEqual(createEmptyDrillStats());
  });

  it('localStorage.setItem が例外を投げてもクラッシュしない', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => saveDrillStats(createEmptyDrillStats())).not.toThrow();
  });
});

describe('loadDrillRecent/saveDrillRecent', () => {
  it('save→load で id 配列を復元する', () => {
    saveDrillRecent(['a', 'b']);

    expect(loadDrillRecent()).toEqual(['a', 'b']);
  });

  it('未保存なら空配列を返す', () => {
    expect(loadDrillRecent()).toEqual([]);
  });

  it('壊れた JSON や配列でない値なら空配列にフォールバックする', () => {
    localStorage.setItem(DRILL_RECENT_KEY, '{broken');
    expect(loadDrillRecent()).toEqual([]);

    localStorage.setItem(DRILL_RECENT_KEY, JSON.stringify({ ids: ['a'] }));
    expect(loadDrillRecent()).toEqual([]);
  });

  it('文字列以外を含む配列なら空配列にフォールバックする', () => {
    localStorage.setItem(DRILL_RECENT_KEY, JSON.stringify(['a', 1, 'b']));

    expect(loadDrillRecent()).toEqual([]);
  });

  it('localStorage 例外を握りつぶす', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    expect(loadDrillRecent()).toEqual([]);

    vi.restoreAllMocks();
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => saveDrillRecent(['a'])).not.toThrow();
  });
});

describe('loadDrillPrefs/saveDrillPrefs', () => {
  const defaultPrefs: DrillPrefs = { genre: 'random', difficulty: 'beginner' };

  it('save→load で設定を復元する', () => {
    const prefs: DrillPrefs = { genre: 'listening', difficulty: 'expert' };

    saveDrillPrefs(prefs);

    expect(loadDrillPrefs()).toEqual(prefs);
  });

  it('苦手優先ジャンル設定を復元する', () => {
    const prefs: DrillPrefs = { genre: 'weak', difficulty: 'intermediate' };

    saveDrillPrefs(prefs);

    expect(loadDrillPrefs()).toEqual(prefs);
  });

  it('未保存なら既定設定を返す', () => {
    expect(loadDrillPrefs()).toEqual(defaultPrefs);
  });

  it('壊れた JSON なら既定設定にフォールバックする', () => {
    localStorage.setItem(DRILL_PREFS_KEY, '{broken');

    expect(loadDrillPrefs()).toEqual(defaultPrefs);
  });

  it('ジャンルや難易度が不正なら既定設定にフォールバックする', () => {
    localStorage.setItem(
      DRILL_PREFS_KEY,
      JSON.stringify({ genre: 'unknown', difficulty: 'expert' }),
    );
    expect(loadDrillPrefs()).toEqual(defaultPrefs);

    localStorage.setItem(
      DRILL_PREFS_KEY,
      JSON.stringify({ genre: 'vocab', difficulty: 'unknown' }),
    );
    expect(loadDrillPrefs()).toEqual(defaultPrefs);
  });

  it('localStorage 例外を握りつぶす', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    expect(loadDrillPrefs()).toEqual(defaultPrefs);

    vi.restoreAllMocks();
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => saveDrillPrefs(defaultPrefs)).not.toThrow();
  });
});
