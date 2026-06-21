// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';

describe('KeyboardShortcutsHelp', () => {
  it('renders nothing when open=false', () => {
    render(<KeyboardShortcutsHelp open={false} onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText('キーボードショートカット')).toBeNull();
  });

  it('renders the heading and major shortcuts with descriptions when open', () => {
    render(<KeyboardShortcutsHelp open={true} onClose={vi.fn()} />);
    // 見出し
    expect(screen.getByText('キーボードショートカット')).toBeInTheDocument();
    // 主要ショートカットのキー表記
    expect(screen.getByText('⌘K')).toBeInTheDocument();
    expect(screen.getByText('Ctrl+K')).toBeInTheDocument();
    expect(screen.getByText('Esc')).toBeInTheDocument();
    expect(screen.getByText('Enter')).toBeInTheDocument();
    // 説明文
    expect(screen.getByText('コマンドパレットを開く')).toBeInTheDocument();
    expect(screen.getByText('このヘルプを開く')).toBeInTheDocument();
    expect(screen.getByText('閉じる(モーダル/パレット)')).toBeInTheDocument();
    expect(screen.getByText('項目を移動(コマンドパレット・設定)')).toBeInTheDocument();
    expect(screen.getByText('選択/移動先へ移動(コマンドパレット)')).toBeInTheDocument();
  });

  it('has role=dialog, aria-modal=true and aria-label', () => {
    render(<KeyboardShortcutsHelp open={true} onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'キーボードショートカット');
  });

  it('focuses the close button on mount', () => {
    render(<KeyboardShortcutsHelp open={true} onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: '閉じる' })).toHaveFocus();
  });

  it('calls onClose when the × button is clicked', () => {
    const onClose = vi.fn();
    render(<KeyboardShortcutsHelp open={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: '閉じる' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<KeyboardShortcutsHelp open={true} onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the overlay is clicked', () => {
    const onClose = vi.fn();
    render(<KeyboardShortcutsHelp open={true} onClose={onClose} />);
    // オーバーレイが role=dialog を持つので、dialog 本体のクリック = オーバーレイクリック。
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the modal body is clicked', () => {
    const onClose = vi.fn();
    render(<KeyboardShortcutsHelp open={true} onClose={onClose} />);
    // モーダル内の見出しをクリックしても伝播で閉じないこと(stopPropagation)を確認。
    fireEvent.click(screen.getByText('キーボードショートカット'));
    expect(onClose).not.toHaveBeenCalled();
  });
});
