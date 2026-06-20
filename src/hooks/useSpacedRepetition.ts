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

// ローカル暦日 (YYYY-MM-DD) を返すヘルパー。
// new Date().toISOString() は UTC 暦日を返すため、JST (UTC+9) のように
// UTC より東のタイムゾーンでは 00:00-09:00 の間に「前日」スタンプになり、
// SRS スケジュールが最大 1 日ずれる原因になる。
// タイムゾーンオフセットを打ち消してローカル暦日を取得する。
function toLocalDateStr(d: Date): string {
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}

function todayStr(): string {
  return toLocalDateStr(new Date());
}

// 入力 dateStr は 'T00:00:00' でローカル深夜としてパースし、ローカル日付で
// 日数加算した上で、出力も toLocalDateStr でローカル暦日に揃える。
// これにより todayStr() と addDays() が「その日」の定義で一致する。
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toLocalDateStr(d);
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

/**
 * Pure SM-2 scheduling update. Given a card, a review quality (0-5), and
 * today's date string, returns the updated card with new interval, easeFactor,
 * repetitions, nextReview (today + interval days) and lastReview (today).
 * This is a drop-in for the inline logic previously in reviewCard.
 */
export function scheduleSRSCard(
  card: SRSCard,
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  today: string,
): SRSCard {
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
        const today = todayStr();
        const next = prev.map((card) => {
          if (card.id !== id) return card;
          return scheduleSRSCard(card, quality, today);
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
