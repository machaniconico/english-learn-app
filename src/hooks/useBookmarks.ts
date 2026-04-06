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

function loadBookmarks(): BookmarkedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BookmarkedItem[];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: BookmarkedItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
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
