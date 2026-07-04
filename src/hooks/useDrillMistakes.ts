import { useCallback, useSyncExternalStore } from 'react';
import type { DrillQuestion } from '../utils/drillTypes';
import {
  addMistake,
  isValidMistake,
  reviewMistake,
  type DrillMistake,
} from '../utils/drillMistakes';

const STORAGE_KEY = 'english-learn-drill-mistakes';

function loadMistakes(): DrillMistake[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidMistake);
  } catch {
    return [];
  }
}

function saveMistakes(list: DrillMistake[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage full or unavailable
  }
}

let storeState: DrillMistake[] = loadMistakes();
const listeners = new Set<() => void>();

function questionsEqual(a: DrillQuestion, b: DrillQuestion): boolean {
  if (
    a.id !== b.id ||
    a.genre !== b.genre ||
    a.difficulty !== b.difficulty ||
    a.prompt !== b.prompt ||
    a.audioText !== b.audioText ||
    a.correctIndex !== b.correctIndex ||
    a.explanation !== b.explanation ||
    a.options.length !== b.options.length
  ) {
    return false;
  }

  for (let i = 0; i < a.options.length; i++) {
    if (a.options[i] !== b.options[i]) return false;
  }
  return true;
}

function mistakesEqual(a: DrillMistake[], b: DrillMistake[]): boolean {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (
      x.correctStreak !== y.correctStreak ||
      x.wrongCount !== y.wrongCount ||
      x.addedAt !== y.addedAt ||
      x.lastSeenAt !== y.lastSeenAt ||
      !questionsEqual(x.question, y.question)
    ) {
      return false;
    }
  }

  return true;
}

function getSnapshot(): DrillMistake[] {
  return storeState;
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) {
    const loaded = loadMistakes();
    if (!mistakesEqual(loaded, storeState)) {
      storeState = loaded;
    }
  }

  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(): void {
  for (const listener of listeners) listener();
}

function setStoreState(updater: (prev: DrillMistake[]) => DrillMistake[]): void {
  const next = updater(storeState);
  if (next === storeState) return;

  storeState = next;
  saveMistakes(storeState);
  notify();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      const loaded = loadMistakes();
      if (!mistakesEqual(loaded, storeState)) {
        storeState = loaded;
        notify();
      }
    }
  });
}

export function useDrillMistakes() {
  const mistakes = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const add = useCallback((question: DrillQuestion) => {
    setStoreState((prev) => addMistake(prev, question, Date.now()));
  }, []);

  const review = useCallback((id: string, correct: boolean) => {
    setStoreState((prev) => reviewMistake(prev, id, correct, Date.now()));
  }, []);

  const clearAll = useCallback(() => {
    setStoreState(() => []);
  }, []);

  return {
    mistakes,
    pendingCount: mistakes.length,
    addMistake: add,
    reviewMistake: review,
    clearAll,
  };
}
