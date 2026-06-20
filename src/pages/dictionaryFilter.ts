import type { DictionaryEntry } from '../data/types';

export function filterDictionary(
  entries: DictionaryEntry[],
  opts: { query: string; category: string; level: string },
): DictionaryEntry[] {
  const query = opts.query.toLowerCase().trim();

  return entries.filter((entry: DictionaryEntry) => {
    // Search filter
    if (
      query &&
      !entry.english.toLowerCase().includes(query) &&
      !entry.japanese.includes(query)
    ) {
      return false;
    }

    // Category filter
    if (opts.category !== 'すべて' && entry.category !== opts.category) {
      return false;
    }

    // Level filter
    if (opts.level === '初級' && entry.level !== 'beginner') return false;
    if (opts.level === '中級' && entry.level !== 'intermediate') return false;

    return true;
  });
}
