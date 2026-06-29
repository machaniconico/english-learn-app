/**
 * 英文テキストの推定読了時間(分)を返す。
 * 語数(空白区切りの非空トークン数) / wpm を切り上げ、本文があれば最低1分。
 * 空テキストは 0(=バッジ非表示の合図)。
 */
export function estimateReadingMinutes(text: string, wpm = 200): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  return Math.max(1, Math.ceil(words / wpm));
}
