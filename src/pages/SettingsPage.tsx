import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import ThemeSetting from '../components/ThemeSetting';
import FontScaleSetting from '../components/FontScaleSetting';
import ReminderSettings from '../components/ReminderSettings';

/**
 * 設定ページ。
 * アプリ内に散在していた設定(テーマ・文字サイズ・リマインダー・データ管理)を
 * 一箇所に集約する。各設定カードは既存コンポーネントをそのまま再利用し、
 * ダークモード・レスポンシブ・a11y 規約はコンポーネント側に準拠する。
 * ページ見出し・コンテナ幅・戻るリンクのスタイルは ProgressPage 等の他ページに合わせる。
 */
export default function SettingsPage() {
  return (
    <div className="pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          設定
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Settings</p>
      </div>

      {/* テーマ: light/dark/system の3択(US-001 ThemeSetting) */}
      <ThemeSetting />

      {/* 文字サイズ: アプリ全体のルート font-size を 4 段階で切替 */}
      <FontScaleSetting />

      {/* リマインダー: 通知トグル・時刻・権限 */}
      <ReminderSettings />

      {/* データ管理: バックアップ/復元は専用ページ /backup へ遷移する導線 */}
      <section
        aria-labelledby="data-management-heading"
        className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 mb-6"
      >
        <h2
          id="data-management-heading"
          className="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          データ管理
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          学習データのバックアップと復元ができます。
        </p>
        {/* /backup への導線: Home のバックアップ導線と同じ Download アイコンで視覚的一貫性を保つ */}
        <Link
          to="/backup"
          className="mt-4 inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        >
          <Download aria-hidden="true" className="h-4 w-4" />
          データのバックアップ/復元
        </Link>
      </section>

      {/* Back link */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>
    </div>
  );
}
