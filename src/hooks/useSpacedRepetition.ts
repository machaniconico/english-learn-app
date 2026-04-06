import { useCallback, useEffect, useState } from 'react';

export interface SRSCard {
  id: string;
  english: string;
  japanese: string;
  pronunciation: string;
  source: string;
  // SRS fields
  interval: number; // days until next review
  easeFactor: number; // starts at 2.5
  repetitions: number; // successful repetitions in a row
  nextReview: string; // ISO date string YYYY-MM-DD
  lastReview: string; // ISO date string
}

export interface SRSStats {
  total: number;
  due: number;
  mastered: number;
  learning: number;
}

const STORAGE_KEY = 'english-learn-srs';

function todayStr(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function loadCards(): SRSCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SRSCard[];
  } catch {
    return [];
  }
}

function saveCards(cards: SRSCard[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function useSpacedRepetition() {
  const [cards, setCards] = useState<SRSCard[]>(loadCards);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setCards(loadCards());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addCard = useCallback(
    (card: Omit<SRSCard, 'interval' | 'easeFactor' | 'repetitions' | 'nextReview' | 'lastReview'>) => {
      setCards((prev) => {
        if (prev.some((c) => c.id === card.id)) return prev;
        const today = todayStr();
        const newCard: SRSCard = {
          ...card,
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0,
          nextReview: today,
          lastReview: '',
        };
        const next = [newCard, ...prev];
        saveCards(next);
        return next;
      });
    },
    [],
  );

  const reviewCard = useCallback(
    (id: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => {
      setCards((prev) => {
        const next = prev.map((card) => {
          if (card.id !== id) return card;

          const today = todayStr();
          let { interval, easeFactor, repetitions } = card;

          if (quality < 3) {
            // Failed: reset
            repetitions = 0;
            interval = 1;
          } else {
            // Passed
            if (repetitions === 0) {
              interval = 1;
            } else if (repetitions === 1) {
              interval = 6;
            } else {
              interval = Math.round(interval * easeFactor);
            }
            easeFactor = Math.max(
              1.3,
              easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
            );
            repetitions++;
          }

          return {
            ...card,
            interval,
            easeFactor,
            repetitions,
            nextReview: addDays(today, interval),
            lastReview: today,
          };
        });
        saveCards(next);
        return next;
      });
    },
    [],
  );

  const getDueCards = useCallback((): SRSCard[] => {
    const today = todayStr();
    return cards.filter((c) => c.nextReview <= today);
  }, [cards]);

  const getStats = useCallback((): SRSStats => {
    const today = todayStr();
    const due = cards.filter((c) => c.nextReview <= today).length;
    const mastered = cards.filter((c) => c.interval > 21).length;
    const learning = cards.length - mastered;
    return { total: cards.length, due, mastered, learning };
  }, [cards]);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveCards(next);
      return next;
    });
  }, []);

  const isInSRS = useCallback(
    (id: string) => cards.some((c) => c.id === id),
    [cards],
  );

  return { cards, addCard, reviewCard, getDueCards, getStats, removeCard, isInSRS };
}
