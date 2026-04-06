import { Link, Outlet, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { useStudyTimer } from '../hooks/useStudyTimer';

function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  const crumbs = paths.map((segment, index) => {
    const to = '/' + paths.slice(0, index + 1).join('/');
    const label = decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { to, label };
  });

  return (
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 overflow-x-auto">
      <Link
        to="/"
        className="shrink-0 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
      >
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.to} className="flex items-center gap-1.5 min-w-0">
          <span className="text-gray-300 dark:text-gray-600">/</span>
          {i === crumbs.length - 1 ? (
            <span className="truncate text-gray-700 dark:text-gray-300 font-medium">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.to}
              className="truncate text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

const bottomNavItems = [
  { to: '/', label: 'ホーム', icon: '🏠' },
  { to: '/dictionary', label: '辞書', icon: '📖' },
  { to: '/toeic-practice', label: '練習', icon: '🎯' },
  { to: '/bookmarks', label: 'ブックマーク', icon: '⭐' },
  { to: '/progress', label: '進捗', icon: '📊' },
];

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Layout() {
  const location = useLocation();
  const { isDark, toggle } = useDarkMode();
  const { isTracking, currentDuration, stopTimer } = useStudyTimer();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl" role="img" aria-label="book">
              📖
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-400 group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors">
                English Learn
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 -mt-0.5">英語学習</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {/* Study timer indicator */}
            {isTracking && (
              <button
                onClick={stopTimer}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors text-sm font-mono"
                aria-label="学習タイマーを停止"
                title="クリックで停止"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="tabular-nums">{formatTimer(currentDuration)}</span>
              </button>
            )}
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {/* Mobile search icon */}
            <Link
              to="/search"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              aria-label="検索"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/search"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              検索
            </Link>
            <Link
              to="/dictionary"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>📖</span> 辞書
            </Link>
            <Link
              to="/reading-practice"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>📄</span> 読解
            </Link>
            <Link
              to="/study-guide"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>{'\u{1F5FA}\u{FE0F}'}</span> ロードマップ
            </Link>
            <Link
              to="/score"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>{'\u{1F3C6}'}</span> スコア
            </Link>
            <Link
              to="/analytics"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>{'\u{1F4C8}'}</span> 分析
            </Link>
            <Link
              to="/srs"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>{'\uD83E\uDDE0'}</span> SRS
            </Link>
            <Link
              to="/bookmarks"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>{'\u2B50'}</span> ブックマーク
            </Link>
            <Link
              to="/progress"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
            >
              <span>📊</span> 進捗
            </Link>
            <Link
              to="/"
              className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
        <Breadcrumbs />
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} English Learn. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="flex items-center justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
          {bottomNavItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 py-1 transition-colors ${
                  active
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span
                  className={`text-[10px] mt-0.5 truncate ${
                    active ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
