import { DRILL_GENRES } from './drillTypes';
import type { DrillGenre, DrillQuestion } from './drillTypes';

/** 直近出題履歴として保持する最大件数。 */
export const DRILL_RECENT_CAP = 300;

function randomIndex(length: number, rand: () => number): number {
  const index = Math.floor(rand() * length);
  return Math.min(length - 1, Math.max(0, index));
}

/**
 * 直近履歴にない問題を優先して1問選ぶ。
 * プール一巡で候補が空になった場合は全体から選び直し、出題を止めない。
 */
export function pickNextQuestion(
  pool: DrillQuestion[],
  recentIds: string[],
  rand: () => number,
): DrillQuestion | null {
  if (pool.length === 0) return null;

  const recentIdSet = new Set(recentIds);
  const freshPool = pool.filter((question) => !recentIdSet.has(question.id));
  const candidates = freshPool.length > 0 ? freshPool : pool;

  return candidates[randomIndex(candidates.length, rand)];
}

/** 履歴末尾に id を追加し、cap を超えた古い履歴を先頭から落とす(非破壊)。 */
export function pushRecent(
  recent: string[],
  id: string,
  cap: number = DRILL_RECENT_CAP,
): string[] {
  if (cap <= 0) return [];

  const next = [...recent, id];
  return next.length > cap ? next.slice(next.length - cap) : next;
}

/** UI の「ランダム」選択時に、全ジャンルから等確率で1つ選ぶ。 */
export function pickRandomGenre(rand: () => number): DrillGenre {
  return DRILL_GENRES[randomIndex(DRILL_GENRES.length, rand)].value;
}
