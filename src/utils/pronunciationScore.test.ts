import { describe, it, expect } from 'vitest';
import { scorePronunciation, normalizeWord } from './pronunciationScore';

describe('normalizeWord', () => {
  it('lowercases and strips punctuation', () => {
    expect(normalizeWord('Hello,')).toBe('hello');
    expect(normalizeWord("don't")).toBe('dont');
    expect(normalizeWord('...')).toBe('');
  });
});

describe('scorePronunciation', () => {
  it('scores a perfect spoken match as 100', () => {
    const r = scorePronunciation('Good morning', 'good morning');
    expect(r.score).toBe(100);
    expect(r.matchedCount).toBe(2);
    expect(r.total).toBe(2);
    expect(r.words.every((w) => w.matched)).toBe(true);
  });

  it('is case- and punctuation-insensitive', () => {
    const r = scorePronunciation('How are you?', 'HOW are YOU');
    expect(r.score).toBe(100);
  });

  it('marks missing words and scores partial', () => {
    const r = scorePronunciation('I like coffee', 'I coffee');
    expect(r.matchedCount).toBe(2);
    expect(r.total).toBe(3);
    expect(r.score).toBe(67);
    const like = r.words.find((w) => w.word === 'like');
    expect(like?.matched).toBe(false);
  });

  it('is order-insensitive', () => {
    const r = scorePronunciation('thank you very much', 'much very thank you');
    expect(r.score).toBe(100);
  });

  it('ignores extra spoken words', () => {
    const r = scorePronunciation('hello', 'oh hello there');
    expect(r.score).toBe(100);
    expect(r.total).toBe(1);
  });

  it('does not double-count a single spoken word for repeated targets', () => {
    const r = scorePronunciation('bye bye', 'bye');
    expect(r.matchedCount).toBe(1);
    expect(r.total).toBe(2);
    expect(r.score).toBe(50);
  });

  it('returns 0 for an empty transcript', () => {
    const r = scorePronunciation('hello world', '');
    expect(r.score).toBe(0);
    expect(r.words.every((w) => !w.matched)).toBe(true);
  });

  it('excludes punctuation-only tokens from the scorable total', () => {
    const r = scorePronunciation('Yes , please', 'yes please');
    // "," is not scorable; total counts only "Yes" and "please"
    expect(r.total).toBe(2);
    expect(r.score).toBe(100);
  });
});
