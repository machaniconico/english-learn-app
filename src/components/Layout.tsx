import { Link, Outlet, useLocation } from 'react-router-dom';

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
    <nav className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 overflow-x-auto">
      <Link
        to="/"
        className="shrink-0 text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.to} className="flex items-center gap-1.5 min-w-0">
          <span className="text-gray-300">/</span>
          {i === crumbs.length - 1 ? (
            <span className="truncate text-gray-700 font-medium">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.to}
              className="truncate text-indigo-600 hover:text-indigo-800 transition-colors"
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

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl" role="img" aria-label="book">
              📖
            </span>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-indigo-700 group-hover:text-indigo-900 transition-colors">
                English Learn
              </h1>
              <p className="text-xs text-gray-400 -mt-0.5">英語学習</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/dictionary"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
            >
              <span>📖</span> 辞書
            </Link>
            <Link
              to="/reading-practice"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
            >
              <span>📄</span> 読解
            </Link>
            <Link
              to="/study-guide"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
            >
              <span>{'\u{1F5FA}\u{FE0F}'}</span> ロードマップ
            </Link>
            <Link
              to="/score"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
            >
              <span>{'\u{1F3C6}'}</span> スコア
            </Link>
            <Link
              to="/bookmarks"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
            >
              <span>{'\u2B50'}</span> ブックマーク
            </Link>
            <Link
              to="/progress"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
            >
              <span>📊</span> 進捗
            </Link>
            <Link
              to="/"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
        <Breadcrumbs />
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} English Learn. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex items-center justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
          {bottomNavItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 py-1 transition-colors ${
                  active
                    ? 'text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
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
