import { useState, useEffect, useCallback, useRef } from 'react';

// PWA インストールプロンプトAPI(Chromium系ブラウザのみ)の最小型定義。
// 標準の lib.dom には含まれないため、必要なプロパティだけを宣言する。
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UseInstallPromptResult {
  canInstall: boolean;
  promptInstall: () => Promise<void>;
}

/**
 * PWA のインストールプロンプトを捕捉し、ユーザー主導で表示できるようにするフック。
 * - beforeinstallprompt を受信したら preventDefault() してプロンプトを保留し canInstall=true に。
 * - promptInstall() を呼ぶと保留したプロンプトを表示し、終了後にクリアして canInstall=false に。
 * - appinstalled イベントでインストール完了を検知し canInstall=false に。
 * SSR / 非対応環境では何もしない(window 存在チェック)。
 */
export function useInstallPrompt(): UseInstallPromptResult {
  const [canInstall, setCanInstall] = useState(false);
  // リスナーと promptInstall 間で共有するため ref に保持する。
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // SSR や未対応環境では window がないので安全に何もしない。
    if (typeof window === 'undefined') return;

    function handleBeforeInstallPrompt(e: Event): void {
      const evt = e as BeforeInstallPromptEvent;
      // ブラウザ標準のミニインフォバーを抑止し、後で任意のタイミング出せるようにする。
      e.preventDefault();
      deferredPromptRef.current = evt;
      setCanInstall(true);
    }

    function handleAppInstalled(): void {
      deferredPromptRef.current = null;
      setCanInstall(false);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const deferred = deferredPromptRef.current;
    if (!deferred) return;
    // ユーザーの選択を待ってからプロンプト参照をクリアする。
    await deferred.prompt();
    deferredPromptRef.current = null;
    setCanInstall(false);
  }, []);

  return { canInstall, promptInstall };
}
