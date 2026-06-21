import { useRef } from 'react';
import { useFontScale, type FontScale } from '../hooks/useFontScale';

// 文字サイズの選択肢と表示用メタデータ。
// label: 日本語の選択肢名、a: 相対サイズを直感的に伝える 'A' の文字サイズクラス。
const OPTIONS: Array<{ scale: FontScale; label: string; a: string }> = [
  { scale: 'small', label: '小', a: 'text-xs' },
  { scale: 'normal', label: '標準', a: 'text-sm' },
  { scale: 'large', label: '大', a: 'text-base' },
  { scale: 'xlarge', label: '特大', a: 'text-xl' },
];

/**
 * 文字サイズ設定カード。
 * useFontScale を介して html ルートの font-size を 4 段階(小/標準/大/特大)で切り替える。
 * ラジオグループ形式で a11y に対応し、ダークモードと十分なタッチターゲットを備える。
 * 矢印キーで選択を循環移動しフォーカスも追従させる(ARIA radiogroup パターン)。
 */
export default function FontScaleSetting() {
  const { scale, setScale } = useFontScale();
  // 各 radio ボタンへの参照を保持し、矢印キー移動で .focus() するために使う。
  const radioRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // 矢印キーで選択インデックスを循環移動し setScale + フォーカス移動を行う。
  // ArrowRight/ArrowDown=次、ArrowLeft/ArrowUp=前(末尾と先頭で折り返す)。
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const currentIndex = OPTIONS.findIndex((o) => o.scale === scale);
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
    setScale(next.scale);
    // ボタンの DOM ノードは再利用されるため即座にフォーカス可能。
    radioRefs.current[nextIndex]?.focus();
  }

  return (
    <section
      aria-labelledby="font-scale-setting-heading"
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 mb-6"
    >
      <h2
        id="font-scale-setting-heading"
        className="text-lg font-bold text-gray-900 dark:text-gray-100"
      >
        文字サイズ
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        読み物の文字サイズを調整できます。アプリ全体に反映されます。
      </p>

      {/* セグメンテッドコントロール: radiogroup で選択状態を管理 */}
      <div
        role="radiogroup"
        aria-label="文字サイズ"
        aria-labelledby="font-scale-setting-heading"
        onKeyDown={handleKeyDown}
        className="mt-4 grid grid-cols-4 gap-2"
      >
        {OPTIONS.map(({ scale: optionScale, label, a }, index) => {
          const selected = optionScale === scale;
          return (
            <button
              key={optionScale}
              ref={(el) => {
                radioRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setScale(optionScale)}
              className={[
                'flex flex-col items-center justify-center gap-1 min-h-[44px] py-2 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800',
                selected
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
              ].join(' ')}
            >
              {/* 相対サイズで 'A' を見せることで直感的に大きさを伝える */}
              <span aria-hidden="true" className={`font-bold leading-none ${a}`}>
                A
              </span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
