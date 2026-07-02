import { DRILL_GENRES } from './drillTypes';
import type { DrillGenre, DrillQuestion } from './drillTypes';

/** 直近出題履歴として保持する最大件数。 */
export const DRILL_RECENT_CAP = 300;

type DrillGenreTotals = {
  answered: number;
  correct: number;
};

export type DrillGenreStats = Record<DrillGenre, DrillGenreTotals>;

function randomIndex(length: number, rand: () => number): number {
  const index = Math.floor(rand() * length);
  return Math.min(length - 1, Math.max(0, index));
}

function weakGenreWeight(totals: DrillGenreTotals): number {
  return (totals.answered - totals.correct + 1) / (totals.answered + 2);
}

function readGenreTotals(byGenre: DrillGenreStats, genre: DrillGenre): DrillGenreTotals {
  return byGenre[genre] ?? { answered: 0, correct: 0 };
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

/** 累計統計の正答率が低いジャンルほど高確率で1つ選ぶ。 */
export function pickWeakGenre(byGenre: DrillGenreStats, rand: () => number): DrillGenre {
  const weightedGenres = DRILL_GENRES.map(({ value }) => ({
    value,
    weight: weakGenreWeight(readGenreTotals(byGenre, value)),
  }));
  const totalWeight = weightedGenres.reduce((sum, genre) => sum + genre.weight, 0);
  let threshold = Math.min(totalWeight, Math.max(0, rand() * totalWeight));

  for (const genre of weightedGenres) {
    threshold -= genre.weight;
    if (threshold < 0) return genre.value;
  }

  return weightedGenres.at(-1)?.value ?? DRILL_GENRES[0].value;
}

/** 苦手順に並べる。同率の場合は DRILL_GENRES の表示順を維持する。 */
export function sortGenresByWeakness(byGenre: DrillGenreStats): DrillGenre[] {
  return DRILL_GENRES.map((genre, index) => ({
    value: genre.value,
    weight: weakGenreWeight(readGenreTotals(byGenre, genre.value)),
    index,
  }))
    .sort((a, b) => b.weight - a.weight || a.index - b.index)
    .map((genre) => genre.value);
}

/** 苦手優先モード用: 先頭は重み付き抽選、残りは苦手順 fallback。 */
export function orderedWeakGenres(byGenre: DrillGenreStats, rand: () => number): DrillGenre[] {
  const first = pickWeakGenre(byGenre, rand);
  return [first, ...sortGenresByWeakness(byGenre).filter((genre) => genre !== first)];
}
