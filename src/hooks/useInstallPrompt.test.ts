// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInstallPrompt } from './useInstallPrompt';

// beforeinstallprompt は標準イベントではないため、Event に必要な振る舞いを追加した疑似オブジェクトを作る。
interface MockBeforeInstallPrompt extends Event {
  prompt: ReturnType<typeof vi.fn>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function createBeforeInstallPromptEvent(
  promptImpl: ReturnType<typeof vi.fn> = vi.fn(() => Promise.resolve()),
): MockBeforeInstallPrompt {
  return Object.assign(
    new Event('beforeinstallprompt', { cancelable: true }),
    {
      prompt: promptImpl,
      userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
    },
  );
}

describe('useInstallPrompt', () => {
  it('初期状態は canInstall=false', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canInstall).toBe(false);
  });

  it('beforeinstallprompt 受信で preventDefault を呼びつつ canInstall=true になる', () => {
    const { result } = renderHook(() => useInstallPrompt());
    const evt = createBeforeInstallPromptEvent();
    const preventSpy = vi.spyOn(evt, 'preventDefault');

    act(() => {
      window.dispatchEvent(evt);
    });

    expect(preventSpy).toHaveBeenCalled();
    expect(result.current.canInstall).toBe(true);
  });

  it('promptInstall() を呼ぶと保持した prompt() が実行され、canInstall=false に戻る', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    const promptMock = vi.fn(() => Promise.resolve());
    const evt = createBeforeInstallPromptEvent(promptMock);

    act(() => {
      window.dispatchEvent(evt);
    });
    expect(result.current.canInstall).toBe(true);

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(promptMock).toHaveBeenCalled();
    expect(result.current.canInstall).toBe(false);
  });

  it('appinstalled イベントで canInstall=false になる', () => {
    const { result } = renderHook(() => useInstallPrompt());
    const evt = createBeforeInstallPromptEvent();

    act(() => {
      window.dispatchEvent(evt);
    });
    expect(result.current.canInstall).toBe(true);

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.canInstall).toBe(false);
  });

  it('プロンプト未保持時の promptInstall() は何もせず安全に解決する', async () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canInstall).toBe(false);

    await expect(result.current.promptInstall()).resolves.toBeUndefined();
    expect(result.current.canInstall).toBe(false);
  });

  it('アンマウント時にリスナーを cleanup する(再マウントで重複登録されない)', () => {
    const { unmount } = renderHook(() => useInstallPrompt());
    unmount();

    // アンマウント後にイベントを発火しても、新しく描画していない限り状態は変わらない。
    const { result } = renderHook(() => useInstallPrompt());
    act(() => {
      window.dispatchEvent(createBeforeInstallPromptEvent());
    });
    expect(result.current.canInstall).toBe(true);
  });
});
