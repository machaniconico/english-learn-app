import { Link } from 'react-router-dom';
import { useCallback, useRef, useState } from 'react';
import {
  collectBackup,
  serializeBackup,
  parseBackup,
  applyBackup,
  summarizeBackup,
} from '../utils/backup';
import type { BackupFile } from '../utils/backup';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function BackupPage() {
  const [importedBackup, setImportedBackup] = useState<BackupFile | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [restoreMode, setRestoreMode] = useState<'replace' | 'merge'>('replace');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Collect current backup summary on render
  const currentBackup = collectBackup();
  const currentEntries = summarizeBackup(currentBackup);
  const totalBytes = currentEntries.reduce((sum, e) => sum + e.bytes, 0);

  const handleExport = useCallback(() => {
    const backup = collectBackup();
    const json = serializeBackup(backup);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `english-learn-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportedBackup(null);
    setImportError(null);
    setSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') {
        setImportError('ファイルの読み込みに失敗しました。');
        return;
      }
      try {
        const backup = parseBackup(text);
        setImportedBackup(backup);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'ファイルの解析に失敗しました。');
      }
    };
    reader.onerror = () => {
      setImportError('ファイルの読み込み中にエラーが発生しました。');
    };
    reader.readAsText(file);
  }, []);

  const handleRestore = useCallback(() => {
    if (!importedBackup) return;
    const confirmed = window.confirm(
      restoreMode === 'replace'
        ? '既存のすべての学習データを削除してバックアップで置き換えます。よろしいですか？'
        : 'バックアップのデータを既存のデータにマージします。同じキーは上書きされます。よろしいですか？',
    );
    if (!confirmed) return;

    try {
      const { applied } = applyBackup(importedBackup, restoreMode);
      setSuccessMessage(
        `復元が完了しました。${applied}件のデータを読み込みました。ページを再読み込みすると反映されます。`,
      );
      setImportError(null);
      setImportedBackup(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setImportError(
        err instanceof Error
          ? `復元に失敗しました: ${err.message}`
          : '復元中にエラーが発生しました。',
      );
    }
  }, [importedBackup, restoreMode]);

  const importedEntries = importedBackup ? summarizeBackup(importedBackup) : [];

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          バックアップ / 復元
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          学習データはこのブラウザにのみ保存されています。バックアップを取っておくと、ブラウザのデータ消去や端末の移行時に復元できます。
        </p>
      </div>

      {/* Export Section */}
      <section
        aria-labelledby="export-heading"
        className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 mb-6"
      >
        <h2
          id="export-heading"
          className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4"
        >
          エクスポート
        </h2>

        {currentEntries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            保存された学習データがありません。
          </p>
        ) : (
          <>
            <ul className="space-y-2 mb-4" aria-label="現在の学習データ">
              {currentEntries.map((entry) => (
                <li
                  key={entry.key}
                  className="flex items-center justify-between py-1.5 border-b border-gray-50 dark:border-gray-700 last:border-b-0"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{entry.label}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-3">
                    {formatBytes(entry.bytes)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-5 border-t border-gray-100 dark:border-gray-700 pt-2">
              <span>合計 {currentEntries.length} 件</span>
              <span>{formatBytes(totalBytes)}</span>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleExport}
          className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold px-6 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          バックアップをダウンロード
        </button>
      </section>

      {/* Import Section */}
      <section
        aria-labelledby="import-heading"
        className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 mb-6"
      >
        <h2
          id="import-heading"
          className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4"
        >
          インポート（復元）
        </h2>

        <div className="mb-4">
          <label
            htmlFor="backup-file-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            バックアップファイルを選択
          </label>
          <input
            id="backup-file-input"
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 dark:text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />
        </div>

        {/* Error */}
        {importError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4 mb-4"
          >
            <p className="text-sm text-red-700 dark:text-red-400">{importError}</p>
          </div>
        )}

        {/* Preview */}
        {importedBackup && (
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-4 mb-4">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">
              エクスポート日時: {formatDate(importedBackup.exportedAt)}
            </p>
            <ul className="space-y-1.5 mb-3" aria-label="インポートするデータ">
              {importedEntries.map((entry) => (
                <li
                  key={entry.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{entry.label}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 ml-3">
                    {formatBytes(entry.bytes)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-indigo-100 dark:border-indigo-800 pt-2">
              合計 {importedEntries.length} 件
            </div>
          </div>
        )}

        {/* Mode choice + Restore button (shown once a backup is previewed) */}
        {importedBackup && (
          <div className="space-y-4">
            <fieldset>
              <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                復元モード
              </legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
                  <input
                    type="radio"
                    name="restore-mode"
                    value="replace"
                    checked={restoreMode === 'replace'}
                    onChange={() => setRestoreMode('replace')}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">置き換え</span>
                </label>
                <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
                  <input
                    type="radio"
                    name="restore-mode"
                    value="merge"
                    checked={restoreMode === 'merge'}
                    onChange={() => setRestoreMode('merge')}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">マージ</span>
                </label>
              </div>
            </fieldset>

            <button
              type="button"
              onClick={handleRestore}
              className="min-h-[44px] w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold px-6 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              復元する
            </button>
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 p-4 mt-4"
          >
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-3">{successMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[44px] inline-flex items-center justify-center rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 font-semibold px-4 py-2 text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              ページを再読み込み
            </button>
          </div>
        )}
      </section>

      {/* Back link */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>
    </div>
  );
}
