// Pure word-level pronunciation scoring: compares a spoken transcript against a
// target phrase, presence-matching word by word (order-insensitive, forgiving),
// so a learner gets credit for every target word they said regardless of order.

export interface WordMatch {
  /** the original target token (with its casing/punctuation, for display) */
  word: string;
  /** whether the spoken transcript contained this word */
  matched: boolean;
}

export interface PronunciationResult {
  /** percentage of scorable target words that were matched (0-100) */
  score: number;
  /** per-target-word match state, in target order, for highlighting */
  words: WordMatch[];
  matchedCount: number;
  /** number of scorable words (punctuation-only tokens excluded) */
  total: number;
}

/** Lowercase and strip everything except letters/digits (drops punctuation, apostrophes). */
export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function scorePronunciation(target: string, spoken: string): PronunciationResult {
  const targetTokens = tokenize(target);
  const spokenPool = tokenize(spoken).map(normalizeWord).filter(Boolean);

  const words: WordMatch[] = targetTokens.map((token) => {
    const norm = normalizeWord(token);
    if (!norm) {
      // punctuation-only token: not scorable, treat as matched so it never penalizes
      return { word: token, matched: true };
    }
    const idx = spokenPool.indexOf(norm);
    if (idx >= 0) {
      spokenPool.splice(idx, 1); // consume so duplicates aren't double-counted
      return { word: token, matched: true };
    }
    return { word: token, matched: false };
  });

  const scorable = words.filter((w) => normalizeWord(w.word) !== '');
  const matchedCount = scorable.filter((w) => w.matched).length;
  const total = scorable.length;
  const score = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

  return { score, words, matchedCount, total };
}
