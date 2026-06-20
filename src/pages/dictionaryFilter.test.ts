import { describe, it, expect } from 'vitest';
import { filterDictionary } from './dictionaryFilter';
import type { DictionaryEntry } from '../data/types';

function entry(over: Partial<DictionaryEntry>): DictionaryEntry {
  return {
    id: 'x',
    english: 'word',
    japanese: '言葉',
    pronunciation: '/wɜːrd/',
    partOfSpeech: 'noun',
    category: '基本',
    example: 'A word.',
    exampleJa: '言葉。',
    level: 'beginner',
    ...over,
  };
}

const apple = entry({
  id: 'apple',
  english: 'Apple',
  japanese: 'りんご',
  category: '食べ物',
  level: 'beginner',
});
const dog = entry({
  id: 'dog',
  english: 'Dog',
  japanese: '犬',
  category: '動物',
  level: 'beginner',
});
const negotiate = entry({
  id: 'negotiate',
  english: 'Negotiate',
  japanese: '交渉する',
  category: '仕事',
  level: 'intermediate',
});

const fixture: DictionaryEntry[] = [apple, dog, negotiate];

const ALL = { query: '', category: 'すべて', level: 'すべて' };

describe('filterDictionary', () => {
  it('empty query + no filters returns all entries', () => {
    expect(filterDictionary(fixture, ALL)).toEqual(fixture);
  });

  it('matches english case-insensitively', () => {
    expect(filterDictionary(fixture, { ...ALL, query: 'app' })).toEqual([apple]);
    expect(filterDictionary(fixture, { ...ALL, query: 'APPLE' })).toEqual([
      apple,
    ]);
  });

  it('matches japanese', () => {
    expect(filterDictionary(fixture, { ...ALL, query: '犬' })).toEqual([dog]);
  });

  it("category 'すべて' applies no category filter", () => {
    expect(filterDictionary(fixture, { ...ALL, category: 'すべて' })).toEqual(
      fixture,
    );
  });

  it('a specific category filters', () => {
    expect(filterDictionary(fixture, { ...ALL, category: '動物' })).toEqual([
      dog,
    ]);
  });

  it("level '初級' keeps only beginner entries", () => {
    expect(filterDictionary(fixture, { ...ALL, level: '初級' })).toEqual([
      apple,
      dog,
    ]);
  });

  it("level '中級' keeps only intermediate entries", () => {
    expect(filterDictionary(fixture, { ...ALL, level: '中級' })).toEqual([
      negotiate,
    ]);
  });

  it('combined filters AND together', () => {
    expect(
      filterDictionary(fixture, {
        query: 'o',
        category: '動物',
        level: '初級',
      }),
    ).toEqual([dog]);
  });

  it('no match returns empty array', () => {
    expect(filterDictionary(fixture, { ...ALL, query: 'zzz' })).toEqual([]);
    expect(
      filterDictionary(fixture, { query: 'apple', category: '動物', level: 'すべて' }),
    ).toEqual([]);
  });

  it('whitespace-only query is treated as empty (trimmed)', () => {
    expect(filterDictionary(fixture, { ...ALL, query: '   ' })).toEqual(fixture);
  });
});
