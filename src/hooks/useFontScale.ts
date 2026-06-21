import { useState, useEffect, useCallback } from 'react';

// 文字サイズの選択肢。rem ベースの Tailwind を前提に、
// html 要素の font-size を変更することでアプリ全体を拡縮する。
export type FontScale = 'small' | 'normal' | 'large' | 'xlarge';

// 各スケールに対応する html ルート font-size (px)。
// index.css 側に root font-size 指定は無く、既定は 16px (= 'normal')。
export const FONT_SCALE_PX: Record<FontScale, number> = {
  small: 14,
  normal: 16,
  large: 18,
  xlarge: 20,
};

const STORAGE_KEY = 'english-learn-font-scale';
const DEFAULT_SCALE: FontScale = 'normal';

function isFontScale(value: unknown): value is FontScale {
  return (
    value === 'small' ||
    value === 'normal' ||
    value === 'large' ||
    value === 'xlarge'
  );
}

// localStorage から保存済みスケールを読み込む。不正値や未対応環境では 'normal'。
function readStoredScale(): FontScale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isFontScale(saved)) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_SCALE;
}

// html 要素の font-size を指定スケールの px に反映する。
// SSR や document 未対応環境では何もしない。
function applyFontScale(scale: FontScale): void {
  if (typeof document === 'undefined') return;
  const px = FONT_SCALE_PX[scale];
  document.documentElement.style.fontSize = `${px}px`;
}

export function useFontScale() {
  const [scale, setScaleState] = useState<FontScale>(() => readStoredScale());

  // mount 時および scale 変更時に html の font-size を適用。
  // リロード後も保存済みスケールが復元・適用される。
  useEffect(() => {
    applyFontScale(scale);
  }, [scale]);

  const setScale = useCallback((next: FontScale) => {
    setScaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { scale, setScale };
}
