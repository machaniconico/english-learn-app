import { useCallback, useSyncExternalStore } from 'react';

export interface BookmarkedItem {
  id: string;
  english: string;
  japanese: string;
  pronunciation: string;
  source: string; // e.g., "phrases/greetings/basic-1"
  addedAt: number; // timestamp
}

const STORAGE_KEY = 'english-learn-bookmarks';

function isBookmarkedItem(value: unknown): value is BookmarkedItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.english === 'string' &&
    typeof item.japanese === 'string' &&
    typeof item.pronunciation === 'string' &&
    typeof item.source === 'string' &&
    typeof item.addedAt === 'number'
  );
}

function loadBookmarks(): BookmarkedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isBookmarkedItem);
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: BookmarkedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // storage full or unavailable
  }
}

let storeState: BookmarkedItem[] = loadBookmarks();
const listeners = new Set<() => void>();

function bookmarksEqual(a: BookmarkedItem[], b: BookmarkedItem[]): boolean {
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
      x.addedAt !== y.addedAt
    ) {
      return false;
    }
  }
  return true;
}

function getSnapshot(): BookmarkedItem[] {
  return storeState;
}

function syncStoreStateFromStorage(): void {
  const loaded = loadBookmarks();
  if (!bookmarksEqual(loaded, storeState)) {
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

function setStoreState(updater: (prev: BookmarkedItem[]) => BookmarkedItem[]): void {
  const next = updater(storeState);
  if (next === storeState) return;
  storeState = next;
  saveBookmarks(storeState);
  notify();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      const loaded = loadBookmarks();
      if (!bookmarksEqual(loaded, storeState)) {
        storeState = loaded;
        notify();
      }
    }
  });
}

export function useBookmarks() {
  if (listeners.size === 0) {
    syncStoreStateFromStorage();
  }
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const addBookmark = useCallback((item: BookmarkedItem) => {
    setStoreState((prev) => {
      if (prev.some((b) => b.id === item.id)) return prev;
      return [item, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setStoreState((prev) => {
      if (!prev.some((b) => b.id === id)) return prev;
      return prev.filter((b) => b.id !== id);
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  );

  const clearAll = useCallback(() => {
    setStoreState((prev) => {
      if (prev.length === 0) return prev;
      return [];
    });
  }, []);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearAll };
}
