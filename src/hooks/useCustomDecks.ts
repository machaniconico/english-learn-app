import { useCallback, useEffect, useState } from 'react';
import type { PhraseItem, CustomDeck } from '../data/types';

export const STORAGE_KEY = 'english-learn-custom-decks';

function genId(): string {
  return crypto.randomUUID?.() ?? `deck-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function loadDecks(): CustomDeck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CustomDeck[];
  } catch {
    return [];
  }
}

export function saveDecks(decks: CustomDeck[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function makeDeck(name: string, description?: string): CustomDeck {
  const now = Date.now();
  return {
    id: genId(),
    name,
    description,
    items: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function makeItem(fields: Omit<PhraseItem, 'id'>): PhraseItem {
  return { id: genId(), ...fields };
}

export function useCustomDecks() {
  const [decks, setDecks] = useState<CustomDeck[]>(loadDecks);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setDecks(loadDecks());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const getDeck = useCallback(
    (id: string) => decks.find((d) => d.id === id),
    [decks],
  );

  const createDeck = useCallback((name: string, description?: string): CustomDeck => {
    const deck = makeDeck(name, description);
    setDecks((prev) => {
      const next = [...prev, deck];
      saveDecks(next);
      return next;
    });
    return deck;
  }, []);

  const renameDeck = useCallback((id: string, name: string, description?: string): void => {
    setDecks((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, name, description, updatedAt: Date.now() } : d,
      );
      saveDecks(next);
      return next;
    });
  }, []);

  const deleteDeck = useCallback((id: string): void => {
    setDecks((prev) => {
      const next = prev.filter((d) => d.id !== id);
      saveDecks(next);
      return next;
    });
  }, []);

  const addItem = useCallback((deckId: string, fields: Omit<PhraseItem, 'id'>): void => {
    const item = makeItem(fields);
    setDecks((prev) => {
      const next = prev.map((d) =>
        d.id === deckId
          ? { ...d, items: [...d.items, item], updatedAt: Date.now() }
          : d,
      );
      saveDecks(next);
      return next;
    });
  }, []);

  const updateItem = useCallback(
    (deckId: string, itemId: string, patch: Partial<Omit<PhraseItem, 'id'>>): void => {
      setDecks((prev) => {
        const next = prev.map((d) =>
          d.id === deckId
            ? {
                ...d,
                items: d.items.map((it) =>
                  it.id === itemId ? { ...it, ...patch } : it,
                ),
                updatedAt: Date.now(),
              }
            : d,
        );
        saveDecks(next);
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback((deckId: string, itemId: string): void => {
    setDecks((prev) => {
      const next = prev.map((d) =>
        d.id === deckId
          ? { ...d, items: d.items.filter((it) => it.id !== itemId), updatedAt: Date.now() }
          : d,
      );
      saveDecks(next);
      return next;
    });
  }, []);

  return {
    decks,
    getDeck,
    createDeck,
    renameDeck,
    deleteDeck,
    addItem,
    updateItem,
    removeItem,
  };
}
