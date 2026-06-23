// デイリー10問クイズの「その日の問題選び」を担う純粋ロジック。
// React/DOM に依存しないので、UI からもテストからも直接呼べる。
//
// 設計方針:
//  - 同じ日付 + 同じ難易度なら、毎回まったく同じ10問・同じ並びを返す(決定的)。
//    → 一日の途中でリロードしても問題が入れ替わらない。
//  - 翌日になれば自動的に別の10問が出る(日付がシードに入るため)。

import type { DailyQuizQuestion, QuizDifficulty } from '../data/dailyQuiz';
import { getQuestionsByDifficulty } from '../data/dailyQuiz';

/** 1回のデイリークイズで出題する問題数。 */
export const DAILY_QUIZ_COUNT = 10;

/**
 * 文字列シードから決定的な疑似乱数生成器を作る(mulberry32 系)。
 * 同じシードなら同じ乱数列を返す。
 */
export function seededRandom(seed: string): () => number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash |= 0;
    hash = (hash + 0x6d2b79f5) | 0;
    let t = Math.imul(hash ^ (hash >>> 15), 1 | hash);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 配列を、与えた乱数生成器で決定的にシャッフルした新しい配列を返す。
 * Fisher-Yates。元配列は破壊しない。
 */
export function shuffleWith<T>(arr: readonly T[], rand: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 指定した日付・難易度の「その日の10問」を決定的に選んで返す。
 *
 * @param difficulty 難易度
 * @param dateStr    日付文字列(例 "2026-06-23")。シードの一部に使う。
 * @param count      出題数(既定 10)。プールが少なければプール数まで。
 * @param pool       テスト用に差し替え可能な問題プール(既定は難易度別の全問)
 */
export function selectDailyQuiz(
  difficulty: QuizDifficulty,
  dateStr: string,
  count: number = DAILY_QUIZ_COUNT,
  pool: DailyQuizQuestion[] = getQuestionsByDifficulty(difficulty),
): DailyQuizQuestion[] {
  if (pool.length === 0) return [];
  const rand = seededRandom(`${dateStr}-${difficulty}`);
  const shuffled = shuffleWith(pool, rand);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** ローカル日付を "YYYY-MM-DD" 形式で返す。 */
export function getTodayString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
