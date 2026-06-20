import { describe, it, expect } from 'vitest';
import { checkSpelling, normalizeSpelling } from './spellCheck';

describe('normalizeSpelling', () => {
  it('lowercases, trims, collapses spaces, and drops trailing punctuation', () => {
    expect(normalizeSpelling('  Good   Morning. ')).toBe('good morning');
    expect(normalizeSpelling('Hello!')).toBe('hello');
  });
});

describe('checkSpelling', () => {
  it('accepts an exact match ignoring case/whitespace/trailing punctuation', () => {
    expect(checkSpelling('Good morning', 'good morning')).toBe(true);
    expect(checkSpelling('Good morning', '  Good Morning. ')).toBe(true);
  });

  it('rejects a misspelling', () => {
    expect(checkSpelling('necessary', 'neccessary')).toBe(false);
  });

  it('rejects a missing word', () => {
    expect(checkSpelling('thank you', 'thank')).toBe(false);
  });

  it('rejects an empty answer', () => {
    expect(checkSpelling('hello', '')).toBe(false);
    expect(checkSpelling('hello', '   ')).toBe(false);
  });

  it('does not treat internal punctuation as removable', () => {
    expect(checkSpelling("it's fine", 'its fine')).toBe(false);
    expect(checkSpelling("it's fine", "it's fine")).toBe(true);
  });
});
