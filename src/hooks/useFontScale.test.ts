// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFontScale, FONT_SCALE_PX, type FontScale } from './useFontScale';

const STORAGE_KEY = 'english-learn-font-scale';

beforeEach(() => {
  // html の font-size をリセットしてテスト間の漏れを防ぐ。
  document.documentElement.style.fontSize = '';
});

describe('useFontScale — exports', () => {
  it('FONT_SCALE_PX が仕様通りの px マップを公開する', () => {
    expect(FONT_SCALE_PX).toEqual({
      small: 14,
      normal: 16,
      large: 18,
      xlarge: 20,
    });
  });

  it('FontScale 型は 4 値のみ (型レベル保証の軽量ランタイム確認)', () => {
    const keys = Object.keys(FONT_SCALE_PX) as FontScale[];
    expect(keys).toEqual(['small', 'normal', 'large', 'xlarge']);
  });
});

describe('useFontScale — 初期状態', () => {
  it('localStorage 無しで既定 "normal" を返し、html に 16px を適用する', () => {
    const { result } = renderHook(() => useFontScale());
    expect(result.current.scale).toBe('normal');
    expect(document.documentElement.style.fontSize).toBe('16px');
  });

  it('localStorage に "xlarge" を入れて再 render で復元し html に 20px を適用する', () => {
    localStorage.setItem(STORAGE_KEY, 'xlarge');
    const { result } = renderHook(() => useFontScale());
    expect(result.current.scale).toBe('xlarge');
    expect(document.documentElement.style.fontSize).toBe('20px');
  });

  it('localStorage に "small" を入れて復元し html に 14px を適用する', () => {
    localStorage.setItem(STORAGE_KEY, 'small');
    const { result } = renderHook(() => useFontScale());
    expect(result.current.scale).toBe('small');
    expect(document.documentElement.style.fontSize).toBe('14px');
  });

  it('不正値は "normal" にフォールバックし html に 16px を適用する', () => {
    localStorage.setItem(STORAGE_KEY, 'huge');
    const { result } = renderHook(() => useFontScale());
    expect(result.current.scale).toBe('normal');
    expect(document.documentElement.style.fontSize).toBe('16px');
  });

  it('localStorage へのアクセスが例外を投げる環境でも "normal" にフォールバックする', () => {
    const original = localStorage.getItem;
    Object.defineProperty(localStorage, 'getItem', {
      configurable: true,
      value: () => {
        throw new Error('storage disabled');
      },
    });
    try {
      const { result } = renderHook(() => useFontScale());
      expect(result.current.scale).toBe('normal');
    } finally {
      Object.defineProperty(localStorage, 'getItem', {
        configurable: true,
        value: original,
      });
    }
  });
});

describe('useFontScale — setScale', () => {
  it('setScale("large") で scale 更新 + localStorage 保存 + html が 18px になる', () => {
    const { result } = renderHook(() => useFontScale());

    act(() => {
      result.current.setScale('large');
    });

    expect(result.current.scale).toBe('large');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('large');
    expect(document.documentElement.style.fontSize).toBe('18px');
  });

  it('setScale で全スケールを順に切り替えると html が対応 px に追従する', () => {
    const { result } = renderHook(() => useFontScale());

    const cases: Array<{ scale: FontScale; px: string }> = [
      { scale: 'small', px: '14px' },
      { scale: 'normal', px: '16px' },
      { scale: 'large', px: '18px' },
      { scale: 'xlarge', px: '20px' },
    ];

    for (const { scale: s, px } of cases) {
      act(() => {
        result.current.setScale(s);
      });
      expect(result.current.scale).toBe(s);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(s);
      expect(document.documentElement.style.fontSize).toBe(px);
    }
  });

  it('setScale は localStorage へ永続化する (例外時も state は更新される)', () => {
    const { result } = renderHook(() => useFontScale());
    // setItem を上書きする前に退避し、finally で確実に元実装へ復元する。
    // 復元漏れは後続テストの localStorage 永続化を形骸化させるため危険。
    const original = localStorage.setItem;
    Object.defineProperty(localStorage, 'setItem', {
      configurable: true,
      value: () => {
        throw new Error('storage disabled');
      },
    });
    try {
      act(() => {
        result.current.setScale('xlarge');
      });
      // 保存が失敗しても state と html への反映は行われる
      expect(result.current.scale).toBe('xlarge');
      expect(document.documentElement.style.fontSize).toBe('20px');
    } finally {
      Object.defineProperty(localStorage, 'setItem', {
        configurable: true,
        value: original,
      });
    }
  });
});

describe('useFontScale — localStorage ラウンドトリップ', () => {
  it('一方のインスタンスで書いた値が別インスタンスで復元される', () => {
    const first = renderHook(() => useFontScale());

    act(() => {
      first.result.current.setScale('large');
    });
    // setScale が実際に localStorage へ永続化したことを直接検証する。
    // ここで no-op 化した setItem が混入すると即座に検出できる。
    expect(localStorage.getItem(STORAGE_KEY)).toBe('large');
    first.unmount();

    const second = renderHook(() => useFontScale());
    expect(second.result.current.scale).toBe('large');
    expect(document.documentElement.style.fontSize).toBe('18px');
    second.unmount();
  });
});
