import { useCallback, useState } from 'react';

// 最近調べた単語を保持する最大件数。これを超えると古いものから切り詰める。
export const MAX = 10;

export const STORAGE_KEY = 'english-learn-recent-words';

// 辞書ページで最近調べた単語の1件分。
export interface RecentWord {
  id: string;
  english: string;
  japanese: string;
}

// 値が RecentWord の要件(id/english/japanese がすべて string)を満たすかを確認する。
function isRecentWord(v: unknown): v is RecentWord {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.english === 'string' &&
    typeof o.japanese === 'string'
  );
}

// localStorage から最近調べた単語を読み込む。不正な JSON・非配列・必須フィールドを
// 欠く要素は除外し、SSR や localStorage 未対応環境では安全に空配列へフォールバックする。
function loadRecent(): RecentWord[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentWord);
  } catch {
    return [];
  }
}

function saveRecent(words: RecentWord[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  } catch {
    /* 書き込み失敗時は無視(クォータ超過など) */
  }
}

// 辞書で最近調べた単語を localStorage に保持するリングバッファ。
// 発音再生(AudioButton の onPlayed)をトリガーに addWord で記録する。
export function useRecentWords() {
  const [recent, setRecent] = useState<RecentWord[]>(loadRecent);

  // 単語を先頭に追加する。同一 id または同一 english の既存要素は重複として
  // 取り除き(再度調べたら最新へ繰り上げ)、MAX 件に切り詰めて保存する。
  // english が空文字のときは何もしない。
  const addWord = useCallback((w: RecentWord) => {
    if (w.english === '') return;
    setRecent((prev) => {
      const filtered = prev.filter(
        (item) => item.id !== w.id && item.english !== w.english,
      );
      const next = [w, ...filtered].slice(0, MAX);
      saveRecent(next);
      return next;
    });
  }, []);

  // 最近調べた単語を全消去して保存。
  const clear = useCallback(() => {
    setRecent([]);
    saveRecent([]);
  }, []);

  return { recent, addWord, clear };
}
