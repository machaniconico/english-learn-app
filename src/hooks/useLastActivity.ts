import { useCallback, useState } from 'react';

// 最後に開いた学習ページを localStorage に保存するキー。
export const STORAGE_KEY = 'english-learn-last-activity';

// 「前回の続き」再開カード1件分。path はルート相対、label は表示用の日本語名。
export interface LastActivity {
  path: string;
  label: string;
}

// 値が LastActivity の要件(path/label がともに string)を満たすかを確認する。
function isLastActivity(v: unknown): v is LastActivity {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.path === 'string' && typeof o.label === 'string';
}

// localStorage から最後に開いた学習ページを読み込む。不正な JSON・必須フィールドを
// 欠く要素は null にフォールバックし、SSR や localStorage 未対応環境では安全に null を返す。
function loadLast(): LastActivity | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isLastActivity(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveLast(item: LastActivity | null): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
  } catch {
    /* 書き込み失敗時は無視(クォータ超過など) */
  }
}

// 最後に開いた学習ページを localStorage に保持するフック。
// Layout 側で練習ページを開いた際に record し、Home 側で last を読んで再開カードを出す。
export function useLastActivity() {
  const [last, setLast] = useState<LastActivity | null>(loadLast);

  // item.path が '/' 始まりの文字列、item.label が非空文字列のときのみ保存・state 更新する。
  // それ以外は無視する。同じ path を連続記録しても問題ないが、値が変わらなければ
  // 無駄な setState を避けて同一参照のままにする。
  const record = useCallback((item: LastActivity) => {
    if (typeof item.path !== 'string' || !item.path.startsWith('/')) return;
    if (typeof item.label !== 'string' || item.label === '') return;
    setLast((prev) => {
      if (prev !== null && prev.path === item.path && prev.label === item.label) {
        return prev;
      }
      saveLast(item);
      return item;
    });
  }, []);

  // 最後に開いた学習ページを null にして保存。
  const clear = useCallback(() => {
    setLast((prev) => {
      if (prev === null) return prev;
      saveLast(null);
      return null;
    });
  }, []);

  return { last, record, clear };
}
