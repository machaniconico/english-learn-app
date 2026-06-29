import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordCategoryStats,
  topWeakCategories,
  loadCategoryHistory,
  saveCategoryHistory,
  CATEGORY_HISTORY_KEY,
  type CategoryHistory,
} from './categoryHistory';
import type { CategoryStat } from './quizCategoryBreakdown';

function stat(category: string, correct: number, total: number): CategoryStat {
  return { category, correct, total };
}

describe('recordCategoryStats', () => {
  it('新規カテゴリを追加する', () => {
    const next = recordCategoryStats({}, [stat('語彙', 3, 5)]);
    expect(next).toEqual({ 語彙: { correct: 3, total: 5 } });
  });

  it('既存カテゴリへ累積する(非破壊)', () => {
    const prev: CategoryHistory = { 語彙: { correct: 2, total: 4 } };
    const next = recordCategoryStats(prev, [stat('語彙', 3, 5), stat('文法', 1, 2)]);
    expect(next).toEqual({
      語彙: { correct: 5, total: 9 },
      文法: { correct: 1, total: 2 },
    });
    // prev は変更されない
    expect(prev).toEqual({ 語彙: { correct: 2, total: 4 } });
  });
});

describe('topWeakCategories', () => {
  it('正答率の低い順に最大 n 件返す', () => {
    const h: CategoryHistory = {
      語彙: { correct: 8, total: 10 }, // 80%
      文法: { correct: 2, total: 10 }, // 20%
      時制: { correct: 5, total: 10 }, // 50%
    };
    const top = topWeakCategories(h, 2);
    expect(top.map((c) => c.category)).toEqual(['文法', '時制']);
    expect(top[0].pct).toBe(20);
  });

  it('満点(correct===total)の分野は除外する', () => {
    const h: CategoryHistory = {
      語彙: { correct: 10, total: 10 }, // 満点 → 除外
      文法: { correct: 9, total: 10 }, // 90%
    };
    expect(topWeakCategories(h, 3).map((c) => c.category)).toEqual(['文法']);
  });

  it('同率なら母数(total)が多い方を優先', () => {
    const h: CategoryHistory = {
      語彙: { correct: 1, total: 2 }, // 50% total2
      文法: { correct: 5, total: 10 }, // 50% total10
    };
    expect(topWeakCategories(h, 1).map((c) => c.category)).toEqual(['文法']);
  });

  it('空履歴は空配列', () => {
    expect(topWeakCategories({}, 3)).toEqual([]);
  });
});

describe('load/saveCategoryHistory', () => {
  beforeEach(() => localStorage.clear());

  it('save→load のラウンドトリップ', () => {
    const h: CategoryHistory = { 語彙: { correct: 3, total: 5 } };
    saveCategoryHistory(h);
    expect(loadCategoryHistory()).toEqual(h);
  });

  it('未保存は空オブジェクト', () => {
    expect(loadCategoryHistory()).toEqual({});
  });

  it('壊れたJSONは空オブジェクト', () => {
    localStorage.setItem(CATEGORY_HISTORY_KEY, '{broken');
    expect(loadCategoryHistory()).toEqual({});
  });

  it('不正な値のエントリは弾く', () => {
    localStorage.setItem(
      CATEGORY_HISTORY_KEY,
      JSON.stringify({ 語彙: { correct: 3, total: 5 }, bad: { correct: 'x' }, nope: 42 }),
    );
    expect(loadCategoryHistory()).toEqual({ 語彙: { correct: 3, total: 5 } });
  });
});
