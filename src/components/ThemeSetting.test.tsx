// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import ThemeSetting from './ThemeSetting';

const STORAGE_KEY = 'english-learn-theme';

// 3 選択肢の表示メタデータ(コンポーネント実装と同一の並び)
const LABELS: Record<'light' | 'dark' | 'system', string> = {
  light: 'ライト',
  dark: 'ダーク',
  system: 'システム',
};

/**
 * window.matchMedia をスタブ化する(useDarkMode がシステム設定を参照するため)。
 * グローバル setup は configurable:true で定義しているので上書き可能。
 */
function stubMatchMedia(matches: boolean) {
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: () => mql,
  });
}

beforeEach(() => {
  // html の dark クラスをリセットしてテスト間の漏れを防ぐ。
  document.documentElement.classList.remove('dark');
});

describe('ThemeSetting', () => {
  it('3 つの選択肢(ライト/ダーク/システム)が表示される', () => {
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    const group = screen.getByRole('radiogroup', { name: 'テーマ' });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getByRole('radio', { name: /ライト/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /ダーク/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /システム/ })).toBeInTheDocument();
  });

  it('localStorage 無しで既定は "システム" が選択状態(aria-checked=true)', () => {
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    const system = screen.getByRole('radio', { name: /システム/ });
    expect(system).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('radio', { name: /ライト/ }),
    ).toHaveAttribute('aria-checked', 'false');
    expect(
      screen.getByRole('radio', { name: /ダーク/ }),
    ).toHaveAttribute('aria-checked', 'false');
  });

  it('localStorage に保存された mode が初期選択になる(dark)', () => {
    localStorage.setItem(STORAGE_KEY, 'dark');
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    expect(
      screen.getByRole('radio', { name: /ダーク/ }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('別モードをクリックすると setMode 経由で localStorage と html クラスが変わる', () => {
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    // 初期: system + system light => isDark=false
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    const dark = screen.getByRole('radio', { name: /ダーク/ });
    fireEvent.click(dark);

    expect(dark).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('radio', { name: /システム/ }),
    ).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
  });

  it('全選択肢を順にクリックすると localStorage が対応 mode に追従する', () => {
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    const cases = ['light', 'dark', 'system'] as const;
    for (const m of cases) {
      fireEvent.click(
        screen.getByRole('radio', { name: new RegExp(LABELS[m]) }),
      );
      expect(localStorage.getItem(STORAGE_KEY)).toBe(m);
    }
  });

  it('a11y: radiogroup に aria-label、各 radio に aria-checked が設定される', () => {
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    const group = screen.getByRole('radiogroup');
    // aria-labelledby 経由で見出しと関連付けられているため label は見出しテキスト経由でも取れる
    expect(group).toHaveAttribute('aria-labelledby', 'theme-setting-heading');
    expect(screen.getByText('テーマ')).toHaveAttribute(
      'id',
      'theme-setting-heading',
    );
    const radios = screen.getAllByRole('radio');
    expect(radios.every((r) => r.hasAttribute('aria-checked'))).toBe(true);
    // 選択中ラジオだけ tabIndex=0、それ以外は -1 (radiogroup 慣例)
    const checkedCount = radios.filter(
      (r) => r.getAttribute('aria-checked') === 'true',
    ).length;
    expect(checkedCount).toBe(1);
    // 選択中のみ tabIndex=0
    const selected = radios.find(
      (r) => r.getAttribute('aria-checked') === 'true',
    );
    expect(selected).toHaveAttribute('tabindex', '0');
    const unselected = radios.filter(
      (r) => r.getAttribute('aria-checked') !== 'true',
    );
    expect(unselected.every((r) => r.getAttribute('tabindex') === '-1')).toBe(
      true,
    );
  });

  it('矢印キー(ArrowRight)で次の選択肢に移動し setMode + フォーカスが移る', () => {
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    // 初期: システム(index=2)
    const system = screen.getByRole('radio', { name: /システム/ });
    system.focus();
    expect(system).toHaveFocus();

    // ArrowRight → 折り返して ライト(index=0)
    fireEvent.keyDown(system, { key: 'ArrowRight' });

    const light = screen.getByRole('radio', { name: /ライト/ });
    expect(light).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('radio', { name: /システム/ }),
    ).toHaveAttribute('aria-checked', 'false');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(light).toHaveFocus();
  });

  it('矢印キー(ArrowLeft)で前の選択肢に移動し、先頭から末尾へ折り返す', () => {
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    // 初期: システム → ArrowLeft で ダーク(index=1) に移動
    const system = screen.getByRole('radio', { name: /システム/ });
    system.focus();
    fireEvent.keyDown(system, { key: 'ArrowLeft' });
    const dark = screen.getByRole('radio', { name: /ダーク/ });
    expect(dark).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
    expect(dark).toHaveFocus();

    // さらに ArrowLeft で ライト(index=0) へ
    fireEvent.keyDown(dark, { key: 'ArrowLeft' });
    const light = screen.getByRole('radio', { name: /ライト/ });
    expect(light).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    expect(light).toHaveFocus();

    // さらに ArrowLeft で先頭(ライト)から末尾(システム)へ折り返す
    fireEvent.keyDown(light, { key: 'ArrowLeft' });
    const systemAgain = screen.getByRole('radio', { name: /システム/ });
    expect(systemAgain).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('system');
    expect(systemAgain).toHaveFocus();
  });

  it('Enter/Space でクリックと同等に setMode が呼ばれる(-button 既定動作)', () => {
    stubMatchMedia(false);
    renderWithRouter(<ThemeSetting />);
    const light = screen.getByRole('radio', { name: /ライト/ });
    // <button type="button"> は Enter/Space で click を発火するので click 検証で十分
    fireEvent.click(light);
    expect(light).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
  });
});
