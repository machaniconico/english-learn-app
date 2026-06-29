// 神経衰弱(マッチングゲーム)の純粋ロジック。
// MatchingGame.tsx から抽出(挙動は変更なし)。React/DOM 非依存でテスト可能。

export interface MatchingItem {
  english: string;
  japanese: string;
}

export interface Card {
  id: string;
  text: string;
  pairId: number;
  type: 'english' | 'japanese';
  matched: boolean;
}

/** Fisher-Yates シャッフル(新配列を返す・元配列は破壊しない)。 */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** 秒を mm:ss 形式に整形する。 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * 手数とペア数から星評価(1-3)を返す。
 * moves<=pairCount(最少手)で3、<=pairCount*2 で2、それ以外は1。
 */
export function getStars(moves: number, pairCount: number): number {
  const perfect = pairCount;
  const good = pairCount * 2;
  if (moves <= perfect) return 3;
  if (moves <= good) return 2;
  return 1;
}

/**
 * items から表(英語)・裏(日本語)のカード列を組み立てる。
 * 9件以上はシャッフルして先頭8件を採用。各ペアに english/japanese の2枚を作り、
 * 最後に全カードをシャッフルして返す。
 */
export function buildCards(items: MatchingItem[]): Card[] {
  const selected = items.length > 8 ? shuffleArray(items).slice(0, 8) : items;
  const cards: Card[] = [];
  selected.forEach((item, i) => {
    cards.push({
      id: `en-${i}`,
      text: item.english,
      pairId: i,
      type: 'english',
      matched: false,
    });
    cards.push({
      id: `ja-${i}`,
      text: item.japanese,
      pairId: i,
      type: 'japanese',
      matched: false,
    });
  });
  return shuffleArray(cards);
}
