// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, within } from '../test/test-utils';
import Layout from './Layout';

expect.extend(matchers);

// jsdom does not implement matchMedia; useDarkMode reads it on mount.
// Provide a minimal, non-listening implementation (defaults to light scheme).
beforeAll(() => {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  }
});

/**
 * Layout renders the app chrome around an <Outlet/>. We mount it as the
 * route element with a single index child so the Outlet has page content,
 * mirroring how App.tsx wires it up.
 */
function renderLayout(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<h1>ページ本文</h1>} />
          <Route path="dictionary" element={<h1>辞書ページ</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('Layout', () => {
  it('renders the skip link targeting #main-content', () => {
    renderLayout();
    const skip = screen.getByRole('link', { name: '本文へスキップ' });
    expect(skip).toBeInTheDocument();
    expect(skip).toHaveAttribute('href', '#main-content');
  });

  it('renders a <main> landmark with id="main-content" containing the outlet content', () => {
    renderLayout();
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
    // The outlet page content is rendered inside <main>.
    expect(within(main).getByRole('heading', { name: 'ページ本文' })).toBeInTheDocument();
  });

  it('exposes navigation landmarks with accessible names', () => {
    renderLayout();
    const navs = screen.getAllByRole('navigation');
    const names = navs.map((n) => n.getAttribute('aria-label'));
    // Global desktop nav and the mobile bottom nav are always present.
    expect(names).toContain('グローバルナビゲーション');
    expect(names).toContain('メインメニュー');
    // Every nav landmark must have an accessible name (no anonymous landmarks).
    for (const nav of navs) {
      expect(nav).toHaveAttribute('aria-label');
      expect(nav.getAttribute('aria-label')?.trim().length).toBeGreaterThan(0);
    }
  });

  it('renders the site title as a non-link span inside the header link', () => {
    renderLayout();
    expect(screen.getByText('English Learn').tagName).toBe('SPAN');
  });

  it('renders a dark-mode toggle button with an accessible name that toggles on click', () => {
    renderLayout();
    // Initial (light) state: button offers to switch to dark mode.
    const toggle = screen.getByRole('button', { name: 'ダークモードに切り替え' });
    expect(toggle).toBeInTheDocument();

    fireEvent.click(toggle);

    // After toggling, the same control now offers to switch back to light mode.
    const toggled = screen.getByRole('button', { name: 'ライトモードに切り替え' });
    expect(toggled).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ダークモードに切り替え' })).not.toBeInTheDocument();
  });

  it('does not render breadcrumbs on the index route but does on a nested route', () => {
    const { unmount } = renderLayout('/');
    expect(screen.queryByRole('navigation', { name: 'パンくずリスト' })).not.toBeInTheDocument();
    unmount();

    renderLayout('/dictionary');
    expect(screen.getByRole('navigation', { name: 'パンくずリスト' })).toBeInTheDocument();
  });

  it('has no detectable a11y violations on initial render', async () => {
    const { container } = renderLayout();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('opens the command palette when Ctrl+K is pressed on window', () => {
    renderLayout();
    // 初期状態ではパレット(検索入力)は出ていない。
    expect(screen.queryByRole('textbox', { name: 'コマンドを検索' })).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

    // ショートカットでパレットの検索入力が出現する。
    expect(screen.getByRole('textbox', { name: 'コマンドを検索' })).toBeInTheDocument();
  });

  it('closes the command palette when Escape is pressed after opening', () => {
    renderLayout();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const input = screen.getByRole('textbox', { name: 'コマンドを検索' });
    expect(input).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByRole('textbox', { name: 'コマンドを検索' })).not.toBeInTheDocument();
  });

  it('opens the keyboard shortcuts help when "?" is pressed on window', () => {
    renderLayout();
    // 初期状態ではヘルプダイアログは出ていない。
    expect(screen.queryByRole('dialog', { name: 'キーボードショートカット' })).not.toBeInTheDocument();

    // window の keydown に ? を発火するとヘルプが開く。
    fireEvent.keyDown(window, { key: '?' });

    // ダイアログとその見出しが出現する。
    const dialog = screen.getByRole('dialog', { name: 'キーボードショートカット' });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole('heading', { name: 'キーボードショートカット' })).toBeInTheDocument();
  });

  it('does not open the keyboard shortcuts help when "?" is pressed while focused on an input', () => {
    // 入力欄を持つ子ルートを独自にマウントし、Layout の Outlet 経由で表示する。
    render(
      <MemoryRouter initialEntries={['/input']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="input" element={<input type="text" placeholder="入力欄" />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText('入力欄') as HTMLInputElement;
    input.focus();
    expect(document.activeElement).toBe(input);

    // 入力フォーカス中に ? を打ってもヘルプは開かない(テキスト入力を妨げない)。
    fireEvent.keyDown(window, { key: '?' });

    expect(screen.queryByRole('dialog', { name: 'キーボードショートカット' })).not.toBeInTheDocument();
  });
});
