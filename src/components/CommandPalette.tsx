// コマンドパレット(⌘K / Ctrl+K)の UI コンポーネント。
// 検索ロジックは src/utils/commandPalette.ts の純粋関数 filterCommands に委譲し、
// ここでは描画・フォーカス制御・キーボード操作・遷移のみを担当する。
import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft } from 'lucide-react';
import { filterCommands } from '../utils/commandPalette';
import type { PaletteCommand } from '../utils/commandPalette';

interface CommandPaletteProps {
  /** パレットを開くか。false のとき何も描画しない。 */
  open: boolean;
  /** 閉じる(Esc・オーバーレイクリック・遷移時)に呼ばれる。 */
  onClose: () => void;
}

// 外側コンポーネント: open=false のとき null を返す。
// open になると Inner を新規マウントするので、query/activeIndex は毎回 default から始まり、
// open 変化に伴う state リセットを effect/ref 無しで実現できる(=lint 規約に適合)。
export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) return null;
  return <CommandPaletteInner onClose={onClose} />;
}

function CommandPaletteInner({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  // フラットな表示順に対する選択インデックス。
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // 各オプション要素への参照。scrollIntoView で選択中項目を可視化する。
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // filterCommands の返す順序がフラットな表示順=選択インデックスの基準になる。
  const results = useMemo(() => filterCommands(query), [query]);

  // マウント(=open化)時に入力へフォーカスする(autoFocus は使わず effect で .focus())。
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 選択中項目を表示領域内へスクロール(jsdom には scrollIntoView が無いため存在確認する)。
  useEffect(() => {
    const el = optionRefs.current[activeIndex];
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, results]);

  // 選択中コマンドへ遷移して閉じる共通処理。
  function runCommand(cmd: PaletteCommand) {
    navigate(cmd.path);
    onClose();
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length === 0) return;
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = results[activeIndex];
      if (cmd) runCommand(cmd);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }

  // group ごとにまとめつつ、filterCommands の返す順序(=フラットな表示順)を保つ。
  // 各項目に元の results 配列内インデックス(flatIndex)を付けて選択状態と対応させる。
  const groups: { group: PaletteCommand['group']; items: { cmd: PaletteCommand; flatIndex: number }[] }[] = [];
  results.forEach((cmd, flatIndex) => {
    const last = groups[groups.length - 1];
    if (last && last.group === cmd.group) {
      last.items.push({ cmd, flatIndex });
    } else {
      groups.push({ group: cmd.group, items: [{ cmd, flatIndex }] });
    }
  });

  return (
    // オーバーレイ: クリックで閉じる。キーボード操作はここで一括ハンドリング。
    <div
      role="dialog"
      aria-modal="true"
      aria-label="コマンドパレット"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[12vh]"
    >
      {/* モーダル本体: 背景クリックの伝播を止める。 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl"
      >
        {/* 検索入力 */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-4">
          <Search className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              // query が変わったら選択を先頭へリセットする。
              setActiveIndex(0);
            }}
            aria-label="コマンドを検索"
            placeholder="コマンドやページを検索..."
            className="w-full bg-transparent py-3.5 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
          />
        </div>

        {/* 結果リスト */}
        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            結果が見つかりません
          </p>
        ) : (
          <ul role="listbox" aria-label="コマンド候補" className="max-h-80 overflow-y-auto py-2">
            {groups.map((g) => (
              <li key={g.group} role="presentation">
                <div className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {g.group}
                </div>
                <ul role="presentation">
                  {g.items.map(({ cmd, flatIndex }) => {
                    const selected = flatIndex === activeIndex;
                    return (
                      <li
                        key={cmd.id}
                        ref={(el) => {
                          optionRefs.current[flatIndex] = el;
                        }}
                        role="option"
                        aria-selected={selected}
                        onClick={() => runCommand(cmd)}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 px-4 py-2 text-sm ${
                          selected
                            ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}
                      >
                        <span className="truncate">{cmd.label}</span>
                        {selected && (
                          <CornerDownLeft className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
