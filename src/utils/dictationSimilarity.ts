// ディクテーション(書き取り)の採点に使う純粋ロジック。
// Dictation.tsx から抽出(挙動は変更なし)。React/DOM 非依存でテスト可能。

/** 採点結果のグレード。 */
export type ResultGrade = 'perfect' | 'close' | 'wrong';

/** 比較用に正規化する: 小文字化・英数と空白以外を除去・連続空白を1つに・前後trim。 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 2文字列のレーベンシュタイン距離(編集距離)。 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/** 正規化後の類似度(0-1)。完全一致は1、どちらか空なら0、それ以外は (len-dist)/len。 */
export function calcSimilarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return 1;
  if (na.length === 0 || nb.length === 0) return 0;

  const len = Math.max(na.length, nb.length);
  const dist = levenshtein(na, nb);
  return Math.max(0, (len - dist) / len);
}

/** 入力と正解から採点。完全一致=perfect、0.8超=close、それ以外=wrong。 */
export function gradeResult(
  typed: string,
  correct: string,
): { grade: ResultGrade; similarity: number } {
  const similarity = calcSimilarity(typed, correct);
  if (similarity === 1) return { grade: 'perfect', similarity };
  if (similarity > 0.8) return { grade: 'close', similarity };
  return { grade: 'wrong', similarity };
}
