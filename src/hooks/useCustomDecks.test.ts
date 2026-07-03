// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useCustomDecks,
  loadDecks,
  saveDecks,
  makeDeck,
  makeItem,
  STORAGE_KEY,
} from './useCustomDecks';
import type { CustomDeck } from '../data/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFields(overrides: Partial<{ english: string; japanese: string; pronunciation: string }> = {}) {
  return {
    english: 'hello',
    japanese: 'こんにちは',
    pronunciation: 'həˈloʊ',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

describe('loadDecks', () => {
  beforeEach(() => localStorage.clear());

  it('returns [] when localStorage is empty', () => {
    expect(loadDecks()).toEqual([]);
  });

  it('returns [] when key is missing', () => {
    expect(loadDecks()).toEqual([]);
  });

  it('parses a valid stored array', () => {
    const deck = makeDeck('Test');
    saveDecks([deck]);
    const loaded = loadDecks();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe(deck.id);
  });

  it('returns [] on corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{{not-json}}');
    expect(loadDecks()).toEqual([]);
  });

  it.each(['null', '{}', '"x"', '42'])(
    'returns [] on non-array stored JSON: %s',
    (raw) => {
      localStorage.setItem(STORAGE_KEY, raw);
      expect(loadDecks()).toEqual([]);
    },
  );

  it('filters malformed stored deck entries and keeps valid decks', () => {
    const valid = makeDeck('Valid');
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        valid,
        null,
        'oops',
        { id: 'missing-items', name: 'Missing items' },
        { id: 123, name: 'Bad id', items: [] },
        { id: 'bad-items', name: 'Bad items', items: null },
      ]),
    );

    expect(loadDecks()).toEqual([valid]);
  });
});

describe('saveDecks / loadDecks round-trip', () => {
  beforeEach(() => localStorage.clear());

  it('persists and reloads a deck array', () => {
    const a = makeDeck('Alpha');
    const b = makeDeck('Beta', 'a description');
    saveDecks([a, b]);
    const loaded = loadDecks();
    expect(loaded).toHaveLength(2);
    expect(loaded[0].name).toBe('Alpha');
    expect(loaded[1].description).toBe('a description');
  });

  it('does not throw when localStorage.setItem throws', () => {
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    try {
      expect(() => saveDecks([makeDeck('Offline')])).not.toThrow();
    } finally {
      spy.mockRestore();
    }
  });
});

describe('makeDeck', () => {
  it('returns a deck with the given name', () => {
    const d = makeDeck('My Deck');
    expect(d.name).toBe('My Deck');
  });

  it('sets description when provided', () => {
    const d = makeDeck('D', 'desc');
    expect(d.description).toBe('desc');
  });

  it('description is undefined when omitted', () => {
    const d = makeDeck('D');
    expect(d.description).toBeUndefined();
  });

  it('starts with an empty items array', () => {
    const d = makeDeck('D');
    expect(d.items).toEqual([]);
  });

  it('createdAt and updatedAt are equal on creation', () => {
    const d = makeDeck('D');
    expect(d.createdAt).toBe(d.updatedAt);
    expect(typeof d.createdAt).toBe('number');
  });

  it('generates a non-empty string id', () => {
    const d = makeDeck('D');
    expect(typeof d.id).toBe('string');
    expect(d.id.length).toBeGreaterThan(0);
  });

  it('generates unique ids for successive calls', () => {
    const ids = new Set(Array.from({ length: 10 }, () => makeDeck('D').id));
    expect(ids.size).toBe(10);
  });
});

describe('makeItem', () => {
  it('returns a PhraseItem with the given fields', () => {
    const item = makeItem({ english: 'cat', japanese: '猫', pronunciation: 'kæt' });
    expect(item.english).toBe('cat');
    expect(item.japanese).toBe('猫');
    expect(item.pronunciation).toBe('kæt');
  });

  it('generates a unique string id', () => {
    const a = makeItem(makeFields());
    const b = makeItem(makeFields());
    expect(typeof a.id).toBe('string');
    expect(a.id).not.toBe(b.id);
  });

  it('passes through optional example fields', () => {
    const item = makeItem({
      english: 'run',
      japanese: '走る',
      pronunciation: 'rʌn',
      example: 'I run every day.',
      exampleJa: '私は毎日走る。',
    });
    expect(item.example).toBe('I run every day.');
    expect(item.exampleJa).toBe('私は毎日走る。');
  });
});

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

describe('useCustomDecks', () => {
  beforeEach(() => localStorage.clear());

  // --- initial state ---

  describe('initial state', () => {
    it('starts with an empty decks array when localStorage is empty', () => {
      const { result } = renderHook(() => useCustomDecks());
      expect(result.current.decks).toEqual([]);
    });

    it('loads persisted decks on mount', () => {
      const deck = makeDeck('Pre-existing');
      saveDecks([deck]);
      const { result } = renderHook(() => useCustomDecks());
      expect(result.current.decks).toHaveLength(1);
      expect(result.current.decks[0].name).toBe('Pre-existing');
    });

    it('returns empty array when localStorage is corrupt on mount', () => {
      localStorage.setItem(STORAGE_KEY, 'CORRUPT{{{');
      const { result } = renderHook(() => useCustomDecks());
      expect(result.current.decks).toEqual([]);
    });
  });

  // --- createDeck ---

  describe('createDeck', () => {
    it('adds a new deck to state', () => {
      const { result } = renderHook(() => useCustomDecks());

      act(() => { result.current.createDeck('New Deck'); });

      expect(result.current.decks).toHaveLength(1);
      expect(result.current.decks[0].name).toBe('New Deck');
    });

    it('returns the newly created deck', () => {
      const { result } = renderHook(() => useCustomDecks());
      let created: CustomDeck | undefined;

      act(() => { created = result.current.createDeck('Returned Deck', 'desc'); });

      expect(created).toBeDefined();
      expect(created!.name).toBe('Returned Deck');
      expect(created!.description).toBe('desc');
    });

    it('persists to localStorage', () => {
      const { result } = renderHook(() => useCustomDecks());

      act(() => { result.current.createDeck('Persist Me'); });

      const stored = loadDecks();
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('Persist Me');
    });

    it('accumulates multiple decks', () => {
      const { result } = renderHook(() => useCustomDecks());

      act(() => { result.current.createDeck('Alpha'); });
      act(() => { result.current.createDeck('Beta'); });

      expect(result.current.decks).toHaveLength(2);
    });

    it('new deck starts with empty items array', () => {
      const { result } = renderHook(() => useCustomDecks());

      act(() => { result.current.createDeck('Empty'); });

      expect(result.current.decks[0].items).toEqual([]);
    });

    it('updates in-memory state when localStorage.setItem throws during createDeck and addItem', () => {
      const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });
      try {
        const { result } = renderHook(() => useCustomDecks());
        let deck: CustomDeck | undefined;

        expect(() => {
          act(() => { deck = result.current.createDeck('Offline Deck'); });
        }).not.toThrow();

        expect(result.current.decks).toHaveLength(1);
        expect(result.current.decks[0].name).toBe('Offline Deck');

        expect(() => {
          act(() => { result.current.addItem(deck!.id, makeFields({ english: 'offline' })); });
        }).not.toThrow();

        expect(result.current.getDeck(deck!.id)!.items).toHaveLength(1);
        expect(result.current.getDeck(deck!.id)!.items[0].english).toBe('offline');
      } finally {
        spy.mockRestore();
      }
    });
  });

  // --- getDeck ---

  describe('getDeck', () => {
    it('returns undefined when id is not found', () => {
      const { result } = renderHook(() => useCustomDecks());
      expect(result.current.getDeck('missing')).toBeUndefined();
    });

    it('returns the matching deck', () => {
      const { result } = renderHook(() => useCustomDecks());
      let created: CustomDeck | undefined;

      act(() => { created = result.current.createDeck('Find Me'); });

      expect(result.current.getDeck(created!.id)).toBeDefined();
      expect(result.current.getDeck(created!.id)!.name).toBe('Find Me');
    });
  });

  // --- renameDeck ---

  describe('renameDeck', () => {
    it('updates the deck name', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Old Name'); });
      act(() => { result.current.renameDeck(deck!.id, 'New Name'); });

      expect(result.current.getDeck(deck!.id)!.name).toBe('New Name');
    });

    it('updates the description', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Deck'); });
      act(() => { result.current.renameDeck(deck!.id, 'Deck', 'Updated desc'); });

      expect(result.current.getDeck(deck!.id)!.description).toBe('Updated desc');
    });

    it('bumps updatedAt', async () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Bump'); });
      const before = result.current.getDeck(deck!.id)!.updatedAt;

      await new Promise((r) => setTimeout(r, 2));

      act(() => { result.current.renameDeck(deck!.id, 'Bumped'); });

      const after = result.current.getDeck(deck!.id)!.updatedAt;
      expect(after).toBeGreaterThanOrEqual(before);
    });

    it('persists the rename to localStorage', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Before'); });
      act(() => { result.current.renameDeck(deck!.id, 'After'); });

      const stored = loadDecks();
      expect(stored.find((d) => d.id === deck!.id)!.name).toBe('After');
    });

    it('is a no-op for unknown id (no error)', () => {
      const { result } = renderHook(() => useCustomDecks());

      act(() => { result.current.createDeck('Safe'); });

      expect(() =>
        act(() => { result.current.renameDeck('ghost-id', 'Ghost'); }),
      ).not.toThrow();

      expect(result.current.decks).toHaveLength(1);
      expect(result.current.decks[0].name).toBe('Safe');
    });
  });

  // --- deleteDeck ---

  describe('deleteDeck', () => {
    it('removes the deck from state', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Delete Me'); });
      act(() => { result.current.deleteDeck(deck!.id); });

      expect(result.current.decks).toHaveLength(0);
    });

    it('only removes the matching deck', () => {
      const { result } = renderHook(() => useCustomDecks());
      let keep: CustomDeck | undefined;
      let gone: CustomDeck | undefined;

      act(() => {
        keep = result.current.createDeck('Keep');
        gone = result.current.createDeck('Gone');
      });
      act(() => { result.current.deleteDeck(gone!.id); });

      expect(result.current.decks).toHaveLength(1);
      expect(result.current.decks[0].id).toBe(keep!.id);
    });

    it('persists the deletion to localStorage', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Bye'); });
      act(() => { result.current.deleteDeck(deck!.id); });

      expect(loadDecks()).toHaveLength(0);
    });

    it('is a no-op for unknown id', () => {
      const { result } = renderHook(() => useCustomDecks());

      act(() => { result.current.createDeck('Alive'); });
      act(() => { result.current.deleteDeck('does-not-exist'); });

      expect(result.current.decks).toHaveLength(1);
    });
  });

  // --- addItem ---

  describe('addItem', () => {
    it('appends an item to the deck', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields()); });

      expect(result.current.getDeck(deck!.id)!.items).toHaveLength(1);
    });

    it('item gets a generated id', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields()); });

      const item = result.current.getDeck(deck!.id)!.items[0];
      expect(typeof item.id).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
    });

    it('item has the provided fields', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => {
        result.current.addItem(deck!.id, {
          english: 'cat',
          japanese: '猫',
          pronunciation: 'kæt',
          example: 'The cat sat.',
          exampleJa: '猫が座った。',
        });
      });

      const item = result.current.getDeck(deck!.id)!.items[0];
      expect(item.english).toBe('cat');
      expect(item.japanese).toBe('猫');
      expect(item.pronunciation).toBe('kæt');
      expect(item.example).toBe('The cat sat.');
      expect(item.exampleJa).toBe('猫が座った。');
    });

    it('bumps updatedAt', async () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      const before = result.current.getDeck(deck!.id)!.updatedAt;

      await new Promise((r) => setTimeout(r, 2));
      act(() => { result.current.addItem(deck!.id, makeFields()); });

      const after = result.current.getDeck(deck!.id)!.updatedAt;
      expect(after).toBeGreaterThanOrEqual(before);
    });

    it('persists added item to localStorage', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields({ english: 'dog' })); });

      const stored = loadDecks();
      expect(stored.find((d) => d.id === deck!.id)!.items[0].english).toBe('dog');
    });

    it('accumulates multiple items', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields({ english: 'one' })); });
      act(() => { result.current.addItem(deck!.id, makeFields({ english: 'two' })); });

      expect(result.current.getDeck(deck!.id)!.items).toHaveLength(2);
    });
  });

  // --- updateItem ---

  describe('updateItem', () => {
    it('updates a field on the item', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields({ english: 'old' })); });
      const itemId = result.current.getDeck(deck!.id)!.items[0].id;

      act(() => { result.current.updateItem(deck!.id, itemId, { english: 'new' }); });

      expect(result.current.getDeck(deck!.id)!.items[0].english).toBe('new');
    });

    it('does not touch other fields when patching one', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => {
        result.current.addItem(deck!.id, {
          english: 'run',
          japanese: '走る',
          pronunciation: 'rʌn',
        });
      });
      const itemId = result.current.getDeck(deck!.id)!.items[0].id;

      act(() => { result.current.updateItem(deck!.id, itemId, { english: 'sprint' }); });

      const item = result.current.getDeck(deck!.id)!.items[0];
      expect(item.japanese).toBe('走る');
      expect(item.pronunciation).toBe('rʌn');
    });

    it('bumps updatedAt', async () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields()); });
      const itemId = result.current.getDeck(deck!.id)!.items[0].id;
      const before = result.current.getDeck(deck!.id)!.updatedAt;

      await new Promise((r) => setTimeout(r, 2));
      act(() => { result.current.updateItem(deck!.id, itemId, { english: 'updated' }); });

      expect(result.current.getDeck(deck!.id)!.updatedAt).toBeGreaterThanOrEqual(before);
    });

    it('persists the update to localStorage', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields({ english: 'before' })); });
      const itemId = result.current.getDeck(deck!.id)!.items[0].id;

      act(() => { result.current.updateItem(deck!.id, itemId, { english: 'after' }); });

      const stored = loadDecks();
      expect(stored.find((d) => d.id === deck!.id)!.items[0].english).toBe('after');
    });
  });

  // --- removeItem ---

  describe('removeItem', () => {
    it('removes the item from the deck', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields()); });
      const itemId = result.current.getDeck(deck!.id)!.items[0].id;

      act(() => { result.current.removeItem(deck!.id, itemId); });

      expect(result.current.getDeck(deck!.id)!.items).toHaveLength(0);
    });

    it('only removes the matching item', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields({ english: 'keep' })); });
      act(() => { result.current.addItem(deck!.id, makeFields({ english: 'remove' })); });

      const items = result.current.getDeck(deck!.id)!.items;
      const removeId = items.find((i) => i.english === 'remove')!.id;

      act(() => { result.current.removeItem(deck!.id, removeId); });

      const remaining = result.current.getDeck(deck!.id)!.items;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].english).toBe('keep');
    });

    it('bumps updatedAt', async () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields()); });
      const itemId = result.current.getDeck(deck!.id)!.items[0].id;
      const before = result.current.getDeck(deck!.id)!.updatedAt;

      await new Promise((r) => setTimeout(r, 2));
      act(() => { result.current.removeItem(deck!.id, itemId); });

      expect(result.current.getDeck(deck!.id)!.updatedAt).toBeGreaterThanOrEqual(before);
    });

    it('persists removal to localStorage', () => {
      const { result } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = result.current.createDeck('Words'); });
      act(() => { result.current.addItem(deck!.id, makeFields()); });
      const itemId = result.current.getDeck(deck!.id)!.items[0].id;

      act(() => { result.current.removeItem(deck!.id, itemId); });

      const stored = loadDecks();
      expect(stored.find((d) => d.id === deck!.id)!.items).toHaveLength(0);
    });
  });

  // --- persistence across remounts ---

  describe('persistence across remounts', () => {
    it('a new hook instance reads decks saved by a previous instance', () => {
      const { result: first, unmount } = renderHook(() => useCustomDecks());

      act(() => { first.current.createDeck('Persisted Deck'); });
      unmount();

      const { result: second } = renderHook(() => useCustomDecks());
      expect(second.current.decks).toHaveLength(1);
      expect(second.current.decks[0].name).toBe('Persisted Deck');
    });

    it('items added before unmount are visible after remount', () => {
      const { result: first, unmount } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = first.current.createDeck('Words'); });
      act(() => { first.current.addItem(deck!.id, makeFields({ english: 'apple' })); });
      unmount();

      const { result: second } = renderHook(() => useCustomDecks());
      const reloaded = second.current.getDeck(deck!.id);
      expect(reloaded).toBeDefined();
      expect(reloaded!.items).toHaveLength(1);
      expect(reloaded!.items[0].english).toBe('apple');
    });

    it('deletion is visible after remount', () => {
      const { result: first, unmount } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = first.current.createDeck('To Delete'); });
      act(() => { first.current.deleteDeck(deck!.id); });
      unmount();

      const { result: second } = renderHook(() => useCustomDecks());
      expect(second.current.decks).toHaveLength(0);
    });

    it('rename is visible after remount', () => {
      const { result: first, unmount } = renderHook(() => useCustomDecks());
      let deck: CustomDeck | undefined;

      act(() => { deck = first.current.createDeck('Before Remount'); });
      act(() => { first.current.renameDeck(deck!.id, 'After Remount'); });
      unmount();

      const { result: second } = renderHook(() => useCustomDecks());
      expect(second.current.getDeck(deck!.id)!.name).toBe('After Remount');
    });
  });

  // --- cross-tab storage sync ---

  describe('cross-tab storage sync', () => {
    it('reacts to an external storage event for the correct key', () => {
      const { result } = renderHook(() => useCustomDecks());
      const external = makeDeck('External Deck');

      act(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([external]));
        window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
      });

      expect(result.current.decks).toHaveLength(1);
      expect(result.current.decks[0].name).toBe('External Deck');
    });

    it('ignores storage events for unrelated keys', () => {
      const { result } = renderHook(() => useCustomDecks());

      act(() => { result.current.createDeck('Mine'); });

      act(() => {
        window.dispatchEvent(new StorageEvent('storage', { key: 'unrelated-key' }));
      });

      expect(result.current.decks).toHaveLength(1);
    });
  });
});
