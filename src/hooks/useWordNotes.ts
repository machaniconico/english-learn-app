import { useCallback, useState } from 'react';

// 単語メモの集合: wordId -> メモ本文
export type WordNotes = Record<string, string>;

export const STORAGE_KEY = 'english-learn-word-notes';

// localStorage からメモを読み込む。SSR / 不正データ / 例外時は {} にフォールバック
function loadNotes(): WordNotes {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    // 各値が string でないキーは除外して読み込む
    const result: WordNotes = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string') {
        result[key] = value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

// localStorage へメモを書き込む。書き込み失敗時は静かに無視(state は更新済み)
function saveNotes(notes: WordNotes): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // QuotaExceededError などの失敗時は UI 側の state を優先し、例外は握り潰す
  }
}

export function useWordNotes() {
  const [notes, setNotes] = useState<WordNotes>(loadNotes);

  // 未登録 id は空文字を返す
  const getNote = useCallback((id: string): string => notes[id] ?? '', [notes]);

  // id が空なら no-op。text は trim し、結果が空なら removeNote 相当。非空なら trim 後を保存
  const setNote = useCallback((id: string, text: string): void => {
    if (!id) return;
    const trimmed = text.trim();
    setNotes((prev) => {
      if (trimmed === '') {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        saveNotes(next);
        return next;
      }
      if (prev[id] === trimmed) return prev;
      const next = { ...prev, [id]: trimmed };
      saveNotes(next);
      return next;
    });
  }, []);

  // 該当 id を削除。存在しなくても安全(no-op)
  const removeNote = useCallback((id: string): void => {
    setNotes((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      saveNotes(next);
      return next;
    });
  }, []);

  return { notes, getNote, setNote, removeNote };
}
