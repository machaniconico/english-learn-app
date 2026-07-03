import { useCallback, useSyncExternalStore } from 'react';

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

type StoredSRSCard = Omit<SRSCard, 'source'> & { source?: unknown };

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

export function todayStr(): string {
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

function isStoredSRSCard(value: unknown): value is StoredSRSCard {
  if (typeof value !== 'object' || value === null) return false;
  const card = value as Record<string, unknown>;
  return (
    typeof card.id === 'string' &&
    typeof card.english === 'string' &&
    typeof card.japanese === 'string' &&
    typeof card.pronunciation === 'string' &&
    (card.source === undefined || typeof card.source === 'string') &&
    typeof card.interval === 'number' &&
    typeof card.easeFactor === 'number' &&
    typeof card.repetitions === 'number' &&
    typeof card.nextReview === 'string' &&
    typeof card.lastReview === 'string'
  );
}

function normalizeSRSCard(card: StoredSRSCard): SRSCard {
  return {
    ...card,
    source: typeof card.source === 'string' ? card.source : '',
  };
}

function loadCards(): SRSCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredSRSCard).map(normalizeSRSCard);
  } catch {
    return [];
  }
}

function saveCards(cards: SRSCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // storage full or unavailable
  }
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

/**
 * Pure urgency sort for due SRS cards. Returns a NEW array (does not mutate
 * the input); callers can sort freely without disturbing storage order.
 *
 * Ordering keys (ascending priority, most urgent first):
 *  1) nextReview asc — earlier due date / more overdue comes first.
 *     YYYY-MM-DD sorts lexicographically the same as chronologically, so
 *     localeCompare is sufficient.
 *  2) repetitions asc — fewer consecutive successes (freshly failed / early
 *     learning cards) are prioritised.
 *  3) easeFactor asc — harder-to-remember cards first.
 *  4) interval asc — shorter intervals (less consolidated) first.
 *  5) id asc — fully deterministic, stable tie-break.
 *
 * `today` is accepted for forward compatibility but the ordering above is
 * deterministic and does not depend on it.
 */
export function sortDueCardsByUrgency(cards: SRSCard[], _today: string): SRSCard[] {
  return [...cards].sort((a, b) => {
    const byNext = a.nextReview.localeCompare(b.nextReview);
    if (byNext !== 0) return byNext;
    if (a.repetitions !== b.repetitions) return a.repetitions - b.repetitions;
    if (a.easeFactor !== b.easeFactor) return a.easeFactor - b.easeFactor;
    if (a.interval !== b.interval) return a.interval - b.interval;
    return a.id.localeCompare(b.id);
  });
}

let storeState: SRSCard[] = loadCards();
const listeners = new Set<() => void>();

function cardsEqual(a: SRSCard[], b: SRSCard[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (
      x.id !== y.id ||
      x.english !== y.english ||
      x.japanese !== y.japanese ||
      x.pronunciation !== y.pronunciation ||
      x.source !== y.source ||
      x.interval !== y.interval ||
      x.easeFactor !== y.easeFactor ||
      x.repetitions !== y.repetitions ||
      x.nextReview !== y.nextReview ||
      x.lastReview !== y.lastReview
    ) {
      return false;
    }
  }
  return true;
}

function getSnapshot(): SRSCard[] {
  return storeState;
}

function syncStoreStateFromStorage(): void {
  const loaded = loadCards();
  if (!cardsEqual(loaded, storeState)) {
    storeState = loaded;
  }
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    syncStoreStateFromStorage();
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

function setStoreState(updater: (prev: SRSCard[]) => SRSCard[]): void {
  const next = updater(storeState);
  if (next === storeState) return;
  storeState = next;
  saveCards(storeState);
  notify();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      const loaded = loadCards();
      if (!cardsEqual(loaded, storeState)) {
        storeState = loaded;
        notify();
      }
    }
  });
}

export function useSpacedRepetition() {
  if (listeners.size === 0) {
    syncStoreStateFromStorage();
  }
  const cards = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const addCard = useCallback(
    (card: Omit<SRSCard, 'interval' | 'easeFactor' | 'repetitions' | 'nextReview' | 'lastReview'>) => {
      setStoreState((prev) => {
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
        return [newCard, ...prev];
      });
    },
    [],
  );

  const reviewCard = useCallback(
    (id: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => {
      setStoreState((prev) => {
        if (!prev.some((card) => card.id === id)) return prev;
        const today = todayStr();
        return prev.map((card) => {
          if (card.id !== id) return card;
          return scheduleSRSCard(card, quality, today);
        });
      });
    },
    [],
  );

  const getDueCards = useCallback((): SRSCard[] => {
    const today = todayStr();
    const due = cards.filter((c) => c.nextReview <= today);
    return sortDueCardsByUrgency(due, today);
  }, [cards]);

  const getStats = useCallback((): SRSStats => {
    const today = todayStr();
    const due = cards.filter((c) => c.nextReview <= today).length;
    const mastered = cards.filter((c) => c.interval > 21).length;
    const learning = cards.length - mastered;
    return { total: cards.length, due, mastered, learning };
  }, [cards]);

  const removeCard = useCallback((id: string) => {
    setStoreState((prev) => {
      if (!prev.some((c) => c.id === id)) return prev;
      return prev.filter((c) => c.id !== id);
    });
  }, []);

  const isInSRS = useCallback(
    (id: string) => cards.some((c) => c.id === id),
    [cards],
  );

  return { cards, addCard, reviewCard, getDueCards, getStats, removeCard, isInSRS };
}
