// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { act } from '@testing-library/react';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import InstallButton from './InstallButton';

// beforeinstallprompt は標準イベントではないため Event を拡張した疑似オブジェクトを作る。
interface MockBeforeInstallPrompt extends Event {
  prompt: ReturnType<typeof vi.fn>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function fireBeforeInstallPrompt(
  promptImpl: ReturnType<typeof vi.fn> = vi.fn(() => Promise.resolve()),
): MockBeforeInstallPrompt {
  const evt = Object.assign(
    new Event('beforeinstallprompt', { cancelable: true }),
    {
      prompt: promptImpl,
      userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
    },
  );
  act(() => {
    window.dispatchEvent(evt);
  });
  return evt;
}

describe('InstallButton', () => {
  it('canInstall=false のときは何も描画しない', () => {
    renderWithRouter(<InstallButton />);
    expect(screen.queryByRole('button', { name: 'アプリをインストール' })).not.toBeInTheDocument();
  });

  it('beforeinstallprompt 受信後にボタンが表示される', () => {
    renderWithRouter(<InstallButton />);
    fireBeforeInstallPrompt();

    expect(screen.getByRole('button', { name: 'アプリをインストール' })).toBeInTheDocument();
  });

  it('ボタンをクリックすると promptInstall() 経由で prompt() が呼ばれる', async () => {
    renderWithRouter(<InstallButton />);
    const promptMock = vi.fn(() => Promise.resolve());
    fireBeforeInstallPrompt(promptMock);

    const button = screen.getByRole('button', { name: 'アプリをインストール' });
    // 非同期の promptInstall() の解決まで act 内で待つ。
    await act(async () => {
      fireEvent.click(button);
    });

    // クリックで promptInstall() → モックの prompt() が呼ばれる。
    expect(promptMock).toHaveBeenCalled();
  });

  it('クリック後は canInstall が false になりボタンが消える', async () => {
    renderWithRouter(<InstallButton />);
    const promptMock = vi.fn(() => Promise.resolve());
    fireBeforeInstallPrompt(promptMock);

    const button = screen.getByRole('button', { name: 'アプリをインストール' });
    await act(async () => {
      fireEvent.click(button);
    });

    // 非同期 state 更新が反映されボタンは非表示になる。
    expect(screen.queryByRole('button', { name: 'アプリをインストール' })).not.toBeInTheDocument();
  });
});
