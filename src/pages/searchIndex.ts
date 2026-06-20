// --- Types ---

export interface SearchResult {
  id: string;
  english: string;
  japanese: string;
  pronunciation?: string;
  example?: string;
  exampleJa?: string;
  partOfSpeech?: string;
  breadcrumb: string;
  link: string;
  group: GroupKey;
}

export type GroupKey = 'phrases' | 'vocabulary' | 'grammar' | 'idioms' | 'toeic' | 'dictionary';

// --- Pure logic ---

export function matchesQuery(item: SearchResult, query: string): boolean {
  const q = query.toLowerCase();
  return (
    item.english.toLowerCase().includes(q) ||
    item.japanese.includes(q) ||
    (item.pronunciation?.toLowerCase().includes(q) ?? false) ||
    (item.example?.toLowerCase().includes(q) ?? false) ||
    (item.exampleJa?.includes(q) ?? false)
  );
}

export function groupResults(
  items: SearchResult[],
  query: string,
  activeFilters: Set<GroupKey>
): Record<GroupKey, SearchResult[]> {
  const result: Record<GroupKey, SearchResult[]> = {
    phrases: [],
    vocabulary: [],
    grammar: [],
    idioms: [],
    toeic: [],
    dictionary: [],
  };

  if (!query.trim()) return result;

  for (const item of items) {
    if (!activeFilters.has(item.group)) continue;
    if (matchesQuery(item, query)) {
      result[item.group].push(item);
    }
  }

  return result;
}
