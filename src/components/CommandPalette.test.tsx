// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CommandPalette from './CommandPalette';

expect.extend(matchers);

// jsdom には scrollIntoView が無いので no-op を生やす(選択中項目スクロールで呼ばれる)。
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// 現在地を表示する小コンポーネント。遷移先 path を実 router 経由で検証する。
function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

// CommandPalette を実 router 配下に置いてレンダリングするヘルパ。
function renderPalette(props: { open: boolean; onClose: () => void }) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <CommandPalette open={props.open} onClose={props.onClose} />
      <Routes>
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CommandPalette', () => {
  it('renders nothing when open=false', () => {
    renderPalette({ open: false, onClose: vi.fn() });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByLabelText('コマンドを検索')).toBeNull();
  });

  it('focuses the search input on mount when open', () => {
    renderPalette({ open: true, onClose: vi.fn() });
    const input = screen.getByLabelText('コマンドを検索');
    expect(input).toHaveFocus();
  });

  it('filters candidates as the user types (jisho/辞書)', () => {
    renderPalette({ open: true, onClose: vi.fn() });
    const input = screen.getByLabelText('コマンドを検索');

    // 入力前は多数の候補が出ている。
    expect(screen.getByRole('option', { name: /ホーム/ })).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'jisho' } });

    // 「辞書」が残り、無関係な多くが消える。
    expect(screen.getByRole('option', { name: /辞書/ })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /ホーム/ })).toBeNull();
    expect(screen.queryByRole('option', { name: /タイピング/ })).toBeNull();
  });

  it('shows a not-found message when nothing matches', () => {
    renderPalette({ open: true, onClose: vi.fn() });
    const input = screen.getByLabelText('コマンドを検索');
    fireEvent.change(input, { target: { value: 'zzzznomatch' } });
    expect(screen.getByText('結果が見つかりません')).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('navigates with ArrowDown + Enter and calls onClose', () => {
    const onClose = vi.fn();
    renderPalette({ open: true, onClose });
    const dialog = screen.getByRole('dialog');

    // 先頭は「ホーム」(/) なので、ArrowDown で 2 番目「辞書」(/dictionary) を選ぶ。
    fireEvent.keyDown(dialog, { key: 'ArrowDown' });
    fireEvent.keyDown(dialog, { key: 'Enter' });

    expect(screen.getByTestId('location')).toHaveTextContent('/dictionary');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('navigates on item click and calls onClose', () => {
    const onClose = vi.fn();
    renderPalette({ open: true, onClose });
    fireEvent.click(screen.getByRole('option', { name: /辞書/ }));
    expect(screen.getByTestId('location')).toHaveTextContent('/dictionary');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    renderPalette({ open: true, onClose });
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the overlay is clicked', () => {
    const onClose = vi.fn();
    renderPalette({ open: true, onClose });
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has no axe accessibility violations when open', async () => {
    const { container } = renderPalette({ open: true, onClose: vi.fn() });
    expect(await axe(container)).toHaveNoViolations();
  });
});
