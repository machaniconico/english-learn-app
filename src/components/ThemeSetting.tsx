import { useRef } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useDarkMode, type Mode } from '../hooks/useDarkMode';

// テーマ選択肢と表示用メタデータ。
// label: 日本語選択肢名、icon: lucide-react アイコン。
const OPTIONS: Array<{ mode: Mode; label: string; Icon: typeof Sun }> = [
  { mode: 'light', label: 'ライト', Icon: Sun },
  { mode: 'dark', label: 'ダーク', Icon: Moon },
  { mode: 'system', label: 'システム', Icon: Monitor },
];

/**
 * テーマ設定カード。
 * useDarkMode の {mode, setMode} を介して light/dark/system の3択を切り替える。
 * ラジオグループ形式で a11y に対応し、ダークモードと十分なタッチターゲットを備える。
 * 矢印キーで選択を循環移動しフォーカスも追従させる(ARIA radiogroup パターン)。
 */
export default function ThemeSetting() {
  const { mode, setMode } = useDarkMode();
  // 各 radio ボタンへの参照を保持し、矢印キー移動で .focus() するために使う。
  const radioRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // 矢印キーで選択インデックスを循環移動し setMode + フォーカス移動を行う。
  // ArrowRight/ArrowDown=次、ArrowLeft/ArrowUp=前(末尾と先頭で折り返す)。
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const currentIndex = OPTIONS.findIndex((o) => o.mode === mode);
    if (currentIndex === -1) return;
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % OPTIONS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + OPTIONS.length) % OPTIONS.length;
    } else {
      return;
    }
    e.preventDefault();
    const next = OPTIONS[nextIndex];
    setMode(next.mode);
    // ボタンの DOM ノードは再利用されるため即座にフォーカス可能。
    radioRefs.current[nextIndex]?.focus();
  }

  return (
    <section
      aria-labelledby="theme-setting-heading"
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 mb-6"
    >
      <h2
        id="theme-setting-heading"
        className="text-lg font-bold text-gray-900 dark:text-gray-100"
      >
        テーマ
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        アプリの見た目を切り替えます。システムは端末の設定に追従します。
      </p>

      {/* セグメンテッドコントロール: radiogroup で選択状態を管理 */}
      <div
        role="radiogroup"
        aria-label="テーマ"
        aria-labelledby="theme-setting-heading"
        onKeyDown={handleKeyDown}
        className="mt-4 grid grid-cols-3 gap-2"
      >
        {OPTIONS.map(({ mode: optionMode, label, Icon }, index) => {
          const selected = optionMode === mode;
          return (
            <button
              key={optionMode}
              ref={(el) => {
                radioRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setMode(optionMode)}
              className={[
                'flex flex-col items-center justify-center gap-1 min-h-[44px] py-2 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800',
                selected
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
              ].join(' ')}
            >
              {/* アイコン + ラベルで選択肢を直感的に示す */}
              <Icon aria-hidden="true" className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
