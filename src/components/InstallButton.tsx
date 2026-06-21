import { Download } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

/**
 * PWA インストール可能なときだけ「アプリをインストール」ボタンを表示する。
 * canInstall=false の場合は何も描画しない(null)。
 */
export default function InstallButton() {
  const { canInstall, promptInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={() => {
        void promptInstall();
      }}
      aria-label="アプリをインストール"
      className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
    >
      <Download className="w-4 h-4" />
      アプリをインストール
    </button>
  );
}
