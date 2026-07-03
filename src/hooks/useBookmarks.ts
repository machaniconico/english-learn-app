import { useCallback, useEffect, useState } from 'react';

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

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>(loadBookmarks);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setBookmarks(loadBookmarks());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addBookmark = useCallback((item: BookmarkedItem) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === item.id)) return prev;
      const next = [item, ...prev];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => bookmarks.some((b) => b.id === id),
    [bookmarks],
  );

  const clearAll = useCallback(() => {
    setBookmarks([]);
    saveBookmarks([]);
  }, []);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearAll };
}
