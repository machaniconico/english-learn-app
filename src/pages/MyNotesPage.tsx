import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWordNotes } from '../hooks/useWordNotes';
import { dictionary } from '../data/dictionary';
import type { DictionaryEntry } from '../data/types';

// MyNotesPage: 辞書で単語に付けたメモ(useWordNotes)を横断で見返し・編集・削除する一覧ページ。
// ルーティング/ナビ配線はこのストーリーの範囲外(US-002 で行う)。
export default function MyNotesPage() {
  const { notes, setNote, removeNote } = useWordNotes();
  // 現在編集中の行の wordId(同時1件のみ)。null は編集中なし。
  const [editingId, setEditingId] = useState<string | null>(null);
  // 編集中 textarea の現在の入力内容。
  const [draft, setDraft] = useState('');

  // dictionary を id -> entry の Map にして O(1) で引けるようにする(一度だけ構築)。
  const dictById = useMemo(() => {
    const map = new Map<string, DictionaryEntry>();
    for (const entry of dictionary) {
      map.set(entry.id, entry);
    }
    return map;
  }, []);

  // notes を行の配列にする。空文字/空白のみのメモは「メモが付いている」とは
  // 見なさないので除外する。順序は Record の挿入順に依存しないよう wordId 昇順で固定。
  const rows = useMemo(() => {
    return Object.entries(notes)
      .filter(([, note]) => note.trim() !== '')
      .map(([wordId, note]) => ({ wordId, note, entry: dictById.get(wordId) ?? null }))
      .sort((a, b) => a.wordId.localeCompare(b.wordId));
  }, [notes, dictById]);

  const count = rows.length;

  // メモ編集を開始する: editingId をセットし、textarea に現在のメモを初期表示する。
  const handleStartEdit = (id: string, note: string) => {
    setEditingId(id);
    setDraft(note);
  };

  // メモを保存して編集を閉じる。空入力なら setNote が自動的に削除扱いになる。
  const handleSaveNote = (id: string) => {
    setNote(id, draft);
    setEditingId(null);
    setDraft('');
  };

  // 編集を破棄して閉じる。
  const handleCancelEdit = () => {
    setEditingId(null);
    setDraft('');
  };

  // メモを削除して編集を閉じる。
  const handleDeleteNote = (id: string) => {
    removeNote(id);
    setEditingId(null);
    setDraft('');
  };

  // 空状態: メモが1件もないときは辞書への導線を出す。
  if (count === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-5xl mb-4">📝</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          単語メモ 0 件
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          まだメモがありません。
          <br />
          辞書で単語にメモを追加できます。
        </p>
        <Link
          to="/dictionary"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          📖 辞書を見る
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📝</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              単語メモ {count} 件
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              辞書で追加した単語メモを一覧できます
            </p>
          </div>
        </div>
      </div>

      {/* メモ一覧 */}
      <div className="space-y-3 mb-8">
        {rows.map(({ wordId, note, entry }) => {
          // 辞書に一致する entry が無い wordId(孤児)でも本文は表示する。
          const english = entry?.english ?? '(辞書に存在しない単語)';
          const japanese = entry?.japanese ?? '';
          // aria-label 接頭辞: 辞書一致なら english、孤児なら wordId で一意に。
          const ariaPrefix = entry ? entry.english : wordId;
          const isEditing = editingId === wordId;
          return (
            <div
              key={wordId}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-600"
            >
              {/* 見出し行: english(見出し) + japanese(訳) */}
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
                  {english}
                </h2>
                {japanese && (
                  <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
                    {japanese}
                  </p>
                )}
                {!entry && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 break-all">
                    ID: {wordId}
                  </p>
                )}
              </div>

              {/* メモ本体(編集/表示で切り替え) */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                {isEditing ? (
                  // 編集中: textarea + 保存/キャンセル/削除
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      aria-label={`${ariaPrefix} のメモ`}
                      rows={3}
                      placeholder="この単語のメモを書く..."
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveNote(wordId)}
                        aria-label={`${ariaPrefix} のメモを保存`}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        aria-label={`${ariaPrefix} のメモ編集をキャンセル`}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        キャンセル
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(wordId)}
                        aria-label={`${ariaPrefix} のメモを削除`}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ) : (
                  // 表示状態: メモ本文 + 編集/削除
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 whitespace-pre-wrap break-words">
                      {note}
                    </p>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(wordId, note)}
                        aria-label={`${ariaPrefix} のメモを編集`}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        編集
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(wordId)}
                        aria-label={`${ariaPrefix} のメモを削除`}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
