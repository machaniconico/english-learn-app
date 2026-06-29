// トップ画面の「練習クイズ」の出題選択を担う純粋ロジック。
// デイリークイズ(日付で決定的・1日1セット)とは別物で、ユーザーが
// 難易度と出題数(10の倍数)を指定して何度でも挑戦できる練習用。
// React/DOM に依存しないので UI からもテストからも直接呼べる。

import type { DailyQuizQuestion } from '../data/dailyQuiz';
import { shuffleWith } from './dailyQuizSelect';

/** 出題数の刻み(10の倍数)。 */
export const PRACTICE_COUNT_STEP = 10;

/**
 * プールの大きさから、選べる出題数(10の倍数)の一覧を返す。
 * 例) poolSize=20 → [10, 20]、poolSize=60 → [10,20,30,40,50,60]。
 *
 * プールが刻みに満たない(0 < poolSize < 10)場合は、その場で出せる
 * 最大数(=poolSize)だけを1件返す。poolSize=0 のときは空配列。
 */
export function practiceCountOptions(poolSize: number): number[] {
  if (poolSize <= 0) return [];
  const options: number[] = [];
  for (let n = PRACTICE_COUNT_STEP; n <= poolSize; n += PRACTICE_COUNT_STEP) {
    options.push(n);
  }
  if (options.length === 0) options.push(poolSize);
  return options;
}

/**
 * プールから count 問を、与えた乱数生成器で決定的にシャッフルして選ぶ。
 * count がプール数を超える場合はプール数まで。元配列は破壊しない。
 */
export function pickPracticeQuestions(
  pool: readonly DailyQuizQuestion[],
  count: number,
  rand: () => number,
): DailyQuizQuestion[] {
  if (pool.length === 0 || count <= 0) return [];
  return shuffleWith(pool, rand).slice(0, Math.min(count, pool.length));
}
