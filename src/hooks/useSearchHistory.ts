import { useCallback, useState } from 'react';

// 検索履歴を保持する最大件数。これを超えると古いものから切り詰める。
export const MAX_HISTORY = 8;

export const STORAGE_KEY = 'english-learn-search-history';

// localStorage から履歴を読み込む。不正な JSON・非配列・文字列以外の要素は除外し、
// SSR や localStorage 未対応環境では安全に空配列へフォールバックする。
function loadHistory(): string[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string');
  } catch {
    return [];
  }
}

function saveHistory(history: string[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    /* 書き込み失敗時は無視(クォータ超過など) */
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(loadHistory);

  // クエリを trim して先頭に追加。空文字は無視し、大小無視で重複を除去し、
  // MAX_HISTORY 件に切り詰める。表示用に元の文字列(trim 後)を保持する。
  const addQuery = useCallback((q: string) => {
    const trimmed = q.trim();
    if (trimmed === '') return;
    setHistory((prev) => {
      const lower = trimmed.toLowerCase();
      const filtered = prev.filter((h) => h.toLowerCase() !== lower);
      const next = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  // 指定クエリを大小無視で履歴から削除して保存。
  const removeQuery = useCallback((q: string) => {
    const lower = q.toLowerCase();
    setHistory((prev) => {
      const next = prev.filter((h) => h.toLowerCase() !== lower);
      saveHistory(next);
      return next;
    });
  }, []);

  // 履歴を全消去して保存。
  const clear = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return { history, addQuery, removeQuery, clear };
}
