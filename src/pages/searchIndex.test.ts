import { describe, it, expect } from 'vitest';
import { matchesQuery, groupResults } from './searchIndex';
import type { SearchResult, GroupKey } from './searchIndex';

function makeItem(overrides: Partial<SearchResult> = {}): SearchResult {
  return {
    id: 'x',
    english: 'Hello',
    japanese: 'こんにちは',
    pronunciation: 'həˈloʊ',
    example: 'Hello there',
    exampleJa: 'やあ、こんにちは',
    breadcrumb: 'a > b',
    link: '/x',
    group: 'phrases',
    ...overrides,
  };
}

const ALL_FILTERS = new Set<GroupKey>([
  'phrases',
  'vocabulary',
  'grammar',
  'idioms',
  'toeic',
  'dictionary',
]);

describe('matchesQuery', () => {
  it('matches english case-insensitively', () => {
    const item = makeItem({ english: 'Apple' });
    expect(matchesQuery(item, 'APPLE')).toBe(true);
    expect(matchesQuery(item, 'app')).toBe(true);
  });

  it('matches japanese substring', () => {
    const item = makeItem({ japanese: '林檎' });
    expect(matchesQuery(item, '檎')).toBe(true);
  });

  it('matches pronunciation', () => {
    const item = makeItem({
      english: 'zzz',
      japanese: 'zzz',
      pronunciation: 'ˈæpəl',
      example: undefined,
      exampleJa: undefined,
    });
    expect(matchesQuery(item, 'æpəl')).toBe(true);
  });

  it('matches example case-insensitively', () => {
    const item = makeItem({
      english: 'zzz',
      japanese: 'zzz',
      pronunciation: undefined,
      example: 'I like Bananas',
      exampleJa: undefined,
    });
    expect(matchesQuery(item, 'bananas')).toBe(true);
  });

  it('matches exampleJa substring', () => {
    const item = makeItem({
      english: 'zzz',
      japanese: 'zzz',
      pronunciation: undefined,
      example: undefined,
      exampleJa: 'バナナが好き',
    });
    expect(matchesQuery(item, 'バナナ')).toBe(true);
  });

  it('returns false on no match', () => {
    const item = makeItem({
      english: 'Hello',
      japanese: 'こんにちは',
      pronunciation: 'həˈloʊ',
      example: 'Hi',
      exampleJa: 'やあ',
    });
    expect(matchesQuery(item, 'xyzzy')).toBe(false);
  });
});

describe('groupResults', () => {
  it('returns all-empty buckets for a blank query', () => {
    const items = [makeItem({ english: 'Apple' })];
    const grouped = groupResults(items, '   ', ALL_FILTERS);
    expect(grouped).toEqual({
      phrases: [],
      vocabulary: [],
      grammar: [],
      idioms: [],
      toeic: [],
      dictionary: [],
    });
  });

  it('respects activeFilters (filtered-out group yields none)', () => {
    const items = [makeItem({ english: 'Apple', group: 'phrases' })];
    const filters = new Set<GroupKey>(['vocabulary']);
    const grouped = groupResults(items, 'apple', filters);
    expect(grouped.phrases).toHaveLength(0);
    expect(grouped.vocabulary).toHaveLength(0);
  });

  it('buckets items into the correct group', () => {
    const items = [
      makeItem({ id: '1', english: 'Apple', group: 'phrases' }),
      makeItem({ id: '2', english: 'Apple', group: 'dictionary' }),
      makeItem({ id: '3', english: 'Apple', group: 'toeic' }),
    ];
    const grouped = groupResults(items, 'apple', ALL_FILTERS);
    expect(grouped.phrases.map((i) => i.id)).toEqual(['1']);
    expect(grouped.dictionary.map((i) => i.id)).toEqual(['2']);
    expect(grouped.toeic.map((i) => i.id)).toEqual(['3']);
    expect(grouped.vocabulary).toHaveLength(0);
  });

  it('is case-insensitive end to end', () => {
    const items = [makeItem({ english: 'Banana', group: 'vocabulary' })];
    const grouped = groupResults(items, 'BANANA', ALL_FILTERS);
    expect(grouped.vocabulary).toHaveLength(1);
    expect(grouped.vocabulary[0].english).toBe('Banana');
  });
});
