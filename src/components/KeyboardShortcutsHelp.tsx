// キーボードショートカット一覧モーダル(? キーで起動)。
// 表示するショートカットは本ファイル内の配列として定義し、
// ここでは描画・フォーカス制御・閉じる操作(× / Esc / オーバーレイ)のみを担当する。
import { useEffect, useRef } from 'react';
import { Keyboard, X } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  /** ヘルプを開くか。false のとき何も描画しない。 */
  open: boolean;
  /** 閉じる(× / Esc / オーバーレイクリック)時に呼ばれる。 */
  onClose: () => void;
}

// 一覧に表示するショートカット定義。
// keys: 1 つ以上のキー表記。複数ある場合は "/" 区切りで代替表記として並べる(例: ⌘K / Ctrl+K)。
//       単一表記内で複数キーが必要な場合は文字列内で "+" で結合する(例: "Ctrl+K")。
// description: そのショートカットの役割。kbd chip は装飾扱いなので、説明文だけで意味が通るようにする。
const SHORTCUTS: { keys: string[]; description: string }[] = [
  { keys: ['⌘K', 'Ctrl+K'], description: 'コマンドパレットを開く' },
  { keys: ['?'], description: 'このヘルプを開く' },
  { keys: ['Esc'], description: '閉じる(モーダル/パレット)' },
  { keys: ['↑', '↓'], description: '項目を移動(コマンドパレット・設定)' },
  { keys: ['Enter'], description: '選択/移動先へ移動(コマンドパレット)' },
];

// 外側コンポーネント: open=false のとき null を返す。
// open になると Inner を新規マウントするので、effect の再実行を毎回保証できる。
export default function KeyboardShortcutsHelp({ open, onClose }: KeyboardShortcutsHelpProps) {
  if (!open) return null;
  return <KeyboardShortcutsHelpInner onClose={onClose} />;
}

function KeyboardShortcutsHelpInner({ onClose }: { onClose: () => void }) {
  // マウント(=open 化)時にクローズボタンへフォーカスする(autoFocus は使わず effect で .focus())。
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    // オーバーレイ: クリックで閉じる。Esc キーもここで一括ハンドリング(子要素から伝播する)。
    <div
      role="dialog"
      aria-modal="true"
      aria-label="キーボードショートカット"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          closeButtonRef.current?.focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
    >
      {/* モーダル本体: 背景クリックの伝播を止める。 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl"
      >
        {/* ヘッダ: 見出しとクローズボタン */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              キーボードショートカット
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="閉じる"
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* ショートカット一覧 */}
        <ul className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {SHORTCUTS.map((item) => (
            <li key={item.description} className="flex items-center justify-between gap-4 px-5 py-3">
              {/* キー表記: 代替表記があれば " / " 区切りで並べる。chip 群は装飾扱い(aria-hidden)。 */}
              <div className="flex flex-wrap items-center gap-1.5" aria-hidden="true">
                {item.keys.map((key, idx) => (
                  <span key={key} className="flex items-center gap-1.5">
                    {idx > 0 && <span className="text-gray-400 dark:text-gray-500">/</span>}
                    <kbd className="inline-flex items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 font-mono text-sm text-gray-800 dark:text-gray-100">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
              {/* 説明文: kbd chip が装飾でもこちらで意味が通るようにする。 */}
              <span className="text-sm text-gray-600 dark:text-gray-300 text-right">{item.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
