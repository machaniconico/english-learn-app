// 汎用の配列ユーティリティ(純粋関数)。React/DOM 非依存でテスト可能。

/** Fisher-Yates シャッフル(新配列を返す・元配列は破壊しない)。 */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** 2つの文字列配列が同じ長さ・同じ順序で一致するか。 */
export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}
