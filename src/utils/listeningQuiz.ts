import type { PhraseItem } from '../data/types';
import { shuffleArray } from './array';

// リスニングクイズの誤答(distractor)生成ロジック(純粋)。
// ListeningQuiz.tsx から抽出。React/DOM 非依存でテスト可能。

/**
 * 正解(correctId)を除いた項目からランダムに count 件選び、その日本語訳を返す。
 * 正解は必ず除外される。候補が count に満たなければある分だけ返す。
 */
export function pickDistractors(
  items: PhraseItem[],
  correctId: string,
  count: number,
): string[] {
  const others = items.filter((item) => item.id !== correctId);
  const shuffled = shuffleArray(others);
  return shuffled.slice(0, count).map((item) => item.japanese);
}
