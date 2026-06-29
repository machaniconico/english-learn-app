import type { CategoryStat } from './quizCategoryBreakdown';

export const CATEGORY_HISTORY_KEY = 'english-learn-category-history';

/** 分野ごとの累積正答。{ [category]: { correct, total } } */
export type CategoryHistory = Record<string, { correct: number; total: number }>;

/** クイズ1回分の分野別集計を累積履歴へ畳み込む(純粋・非破壊)。 */
export function recordCategoryStats(
  prev: CategoryHistory,
  stats: CategoryStat[],
): CategoryHistory {
  const next: CategoryHistory = { ...prev };
  for (const s of stats) {
    const cur = next[s.category] ?? { correct: 0, total: 0 };
    next[s.category] = { correct: cur.correct + s.correct, total: cur.total + s.total };
  }
  return next;
}

export interface WeakCategory {
  category: string;
  correct: number;
  total: number;
  pct: number;
}

/** 正答率の低い順に最大 n 件。total>0 かつ未満点(correct<total)の分野のみ。同率は母数が多い方優先。 */
export function topWeakCategories(history: CategoryHistory, n: number): WeakCategory[] {
  return Object.entries(history)
    .map(([category, v]) => ({
      category,
      correct: v.correct,
      total: v.total,
      pct: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    }))
    .filter((c) => c.total > 0 && c.correct < c.total)
    .sort((a, b) => a.pct - b.pct || b.total - a.total)
    .slice(0, n);
}

/** localStorage から履歴を読む。壊れていれば空。 */
export function loadCategoryHistory(): CategoryHistory {
  try {
    const raw = localStorage.getItem(CATEGORY_HISTORY_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const result: CategoryHistory = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (v && typeof v === 'object') {
        const correct = (v as Record<string, unknown>).correct;
        const total = (v as Record<string, unknown>).total;
        if (typeof correct === 'number' && typeof total === 'number' && total >= 0) {
          result[k] = { correct, total };
        }
      }
    }
    return result;
  } catch {
    return {};
  }
}

/** localStorage へ履歴を保存(失敗は握りつぶす)。 */
export function saveCategoryHistory(history: CategoryHistory): void {
  try {
    localStorage.setItem(CATEGORY_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}
