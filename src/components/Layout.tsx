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

export default function Layout() {
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
          <div className="flex items-center gap-4">
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
              to="/progress"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
            >
              <span>📊</span> 進捗
            </Link>
            <Link
              to="/"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors hidden sm:block"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        <Breadcrumbs />
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} English Learn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
