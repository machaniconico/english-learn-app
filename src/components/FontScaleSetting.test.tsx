// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import FontScaleSetting from './FontScaleSetting';
import { FONT_SCALE_PX, type FontScale } from '../hooks/useFontScale';

const STORAGE_KEY = 'english-learn-font-scale';

// 4 選択肢の表示メタデータ(コンポーネント実装と同一の並び)
const LABELS: Record<FontScale, string> = {
  small: '小',
  normal: '標準',
  large: '大',
  xlarge: '特大',
};

beforeEach(() => {
  // html の font-size をリセットしてテスト間の漏れを防ぐ。
  document.documentElement.style.fontSize = '';
});

describe('FontScaleSetting', () => {
  it('4 つの選択肢(小/標準/大/特大)が表示される', () => {
    renderWithRouter(<FontScaleSetting />);
    const group = screen.getByRole('radiogroup', { name: '文字サイズ' });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    expect(screen.getByRole('radio', { name: /^小$/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^標準$/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^大$/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /^特大$/ })).toBeInTheDocument();
  });

  it('localStorage 無しで既定は "標準" が選択状態(aria-checked=true)', () => {
    renderWithRouter(<FontScaleSetting />);
    const normal = screen.getByRole('radio', { name: /^標準$/ });
    expect(normal).toHaveAttribute('aria-checked', 'true');
    // 他の 3 つは false
    (['small', 'large', 'xlarge'] as const).forEach((s) => {
      expect(
        screen.getByRole('radio', { name: new RegExp(`^${LABELS[s]}$`) }),
      ).toHaveAttribute('aria-checked', 'false');
    });
  });

  it('localStorage に保存されたスケールが初期選択になる', () => {
    localStorage.setItem(STORAGE_KEY, 'large');
    renderWithRouter(<FontScaleSetting />);
    expect(
      screen.getByRole('radio', { name: /^大$/ }),
    ).toHaveAttribute('aria-checked', 'true');
  });

  it('別サイズをクリックすると選択が移り setScale 経由で html の fontSize が変わる', () => {
    renderWithRouter(<FontScaleSetting />);
    // 初期: 標準 = 16px
    expect(document.documentElement.style.fontSize).toBe(
      `${FONT_SCALE_PX.normal}px`,
    );

    const xlarge = screen.getByRole('radio', { name: /^特大$/ });
    fireEvent.click(xlarge);

    expect(xlarge).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('radio', { name: /^標準$/ }),
    ).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement.style.fontSize).toBe(
      `${FONT_SCALE_PX.xlarge}px`,
    );
    expect(localStorage.getItem(STORAGE_KEY)).toBe('xlarge');
  });

  it('全選択肢を順にクリックすると html が対応 px に追従する', () => {
    renderWithRouter(<FontScaleSetting />);
    const cases: Array<{ scale: FontScale; px: string }> = [
      { scale: 'small', px: `${FONT_SCALE_PX.small}px` },
      { scale: 'normal', px: `${FONT_SCALE_PX.normal}px` },
      { scale: 'large', px: `${FONT_SCALE_PX.large}px` },
      { scale: 'xlarge', px: `${FONT_SCALE_PX.xlarge}px` },
    ];
    for (const { scale, px } of cases) {
      fireEvent.click(
        screen.getByRole('radio', { name: new RegExp(`^${LABELS[scale]}$`) }),
      );
      expect(document.documentElement.style.fontSize).toBe(px);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(scale);
    }
  });

  it('a11y: radiogroup に aria-label、各 radio に aria-checked が設定される', () => {
    renderWithRouter(<FontScaleSetting />);
    const group = screen.getByRole('radiogroup');
    // aria-labelledby 経由で見出しと関連付けられているため label は見出しテキスト経由でも取れる
    expect(group).toHaveAttribute('aria-labelledby', 'font-scale-setting-heading');
    expect(screen.getByText('文字サイズ')).toHaveAttribute(
      'id',
      'font-scale-setting-heading',
    );
    const radios = screen.getAllByRole('radio');
    expect(radios.every((r) => r.hasAttribute('aria-checked'))).toBe(true);
    // 選択中ラジオだけ tabIndex=0、それ以外は -1 (radiogroup 慣例)
    const checkedCount = radios.filter(
      (r) => r.getAttribute('aria-checked') === 'true',
    ).length;
    expect(checkedCount).toBe(1);
  });

  it('矢印キー(ArrowRight)で次の選択肢に移動し setScale + フォーカスが移る', () => {
    renderWithRouter(<FontScaleSetting />);
    // 初期: 標準(index=1) = 16px
    expect(document.documentElement.style.fontSize).toBe(
      `${FONT_SCALE_PX.normal}px`,
    );
    const normal = screen.getByRole('radio', { name: /^標準$/ });
    normal.focus();
    expect(normal).toHaveFocus();

    // ArrowRight → 次: 大(index=2) = 18px、フォーカスも移動
    fireEvent.keyDown(normal, { key: 'ArrowRight' });

    const large = screen.getByRole('radio', { name: /^大$/ });
    expect(large).toHaveAttribute('aria-checked', 'true');
    expect(
      screen.getByRole('radio', { name: /^標準$/ }),
    ).toHaveAttribute('aria-checked', 'false');
    expect(document.documentElement.style.fontSize).toBe(
      `${FONT_SCALE_PX.large}px`,
    );
    expect(localStorage.getItem(STORAGE_KEY)).toBe('large');
    expect(large).toHaveFocus();
  });

  it('矢印キー(ArrowLeft)で前の選択肢に移動し、先頭から末尾へ折り返す', () => {
    renderWithRouter(<FontScaleSetting />);
    // 初期: 標準 → ArrowLeft で 小 に移動
    const normal = screen.getByRole('radio', { name: /^標準$/ });
    normal.focus();
    fireEvent.keyDown(normal, { key: 'ArrowLeft' });
    const small = screen.getByRole('radio', { name: /^小$/ });
    expect(small).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement.style.fontSize).toBe(
      `${FONT_SCALE_PX.small}px`,
    );
    expect(small).toHaveFocus();

    // さらに ArrowLeft で先頭(小)から末尾(特大)へ折り返す
    fireEvent.keyDown(small, { key: 'ArrowLeft' });
    const xlarge = screen.getByRole('radio', { name: /^特大$/ });
    expect(xlarge).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement.style.fontSize).toBe(
      `${FONT_SCALE_PX.xlarge}px`,
    );
    expect(xlarge).toHaveFocus();
  });
});
