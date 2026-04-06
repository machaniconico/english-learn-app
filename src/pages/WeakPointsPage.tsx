import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeakPoints, type WeakPoint } from '../hooks/useWeakPoints';

const TYPE_LABELS: Record<WeakPoint['type'], string> = {
  'fill-in-blank': 'TOEIC模試',
  'error-correction': '誤り訂正',
  part1: 'Part 1 写真描写',
  part2: 'Part 2 応答問題',
  dictation: 'ディクテーション',
  reorder: '語順クイズ',
};

const TYPE_ICONS: Record<WeakPoint['type'], string> = {
  'fill-in-blank': '\u{1F4DD}',
  'error-correction': '\u{1F50D}',
  part1: '\u{1F5BC}',
  part2: '\u{1F3A4}',
  dictation: '\u{270D}',
  reorder: '\u{1F500}',
};

type FilterType = 'all' | WeakPoint['type'];

function formatDate(ts: number): string {
  const d = new Date(ts);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

function getQuestionDisplay(wp: WeakPoint): string {
  const q = wp.question as Record<string, unknown>;
  if (!q) return '';

  // fill-in-blank: sentence with blank
  if (typeof q.sentence === 'string') return q.sentence;
  // error-correction: sentence with error
  if (typeof q.errorSentence === 'string') return q.errorSentence;
  // part1/part2: question text or description
  if (typeof q.question === 'string') return q.question;
  if (typeof q.description === 'string') return q.description;
  // dictation: the text to hear
  if (typeof q.text === 'string') return q.text;
  // reorder: japanese hint or english answer
  if (typeof q.japanese === 'string') return q.japanese;
  if (typeof q.english === 'string') return q.english;

  return '';
}

export default function WeakPointsPage() {
  const { weakPoints, removeWeakPoint, clearAll } = useWeakPoints();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showClearMasteredConfirm, setShowClearMasteredConfirm] = useState(false);

  // Available types (only show tabs for types that have weak points)
  const availableTypes = useMemo(() => {
    const types = new Set(weakPoints.map((wp) => wp.type));
    return Array.from(types) as WeakPoint['type'][];
  }, [weakPoints]);

  // Filtered list
  const filtered = useMemo(() => {
    if (filter === 'all') return weakPoints;
    return weakPoints.filter((wp) => wp.type === filter);
  }, [weakPoints, filter]);

  // Stats
  const stats = useMemo(() => {
    const byType: Record<string, number> = {};
    for (const wp of weakPoints) {
      byType[wp.type] = (byType[wp.type] || 0) + 1;
    }
    const masteredCount = weakPoints.filter(
      (wp) => wp.lastCorrect && wp.reviewCount >= 3,
    ).length;
    return { total: weakPoints.length, byType, masteredCount };
  }, [weakPoints]);

  const handleClearMastered = () => {
    const masteredIds = weakPoints
      .filter((wp) => wp.lastCorrect && wp.reviewCount >= 3)
      .map((wp) => wp.id);
    for (const id of masteredIds) {
      removeWeakPoint(id);
    }
    setShowClearMasteredConfirm(false);
  };

  const handleClearAll = () => {
    clearAll();
    setShowClearConfirm(false);
  };

  // Empty state
  if (weakPoints.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">{'\u{1F389}'}</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {'\u5F31\u70B9\u304C\u3042\u308A\u307E\u305B\u3093\uFF01\u7D20\u6674\u3089\u3057\u3044\uFF01'}
        </h1>
        <p className="text-gray-500 mb-6">
          {'\u554F\u984C\u3092\u9593\u9055\u3048\u308B\u3068\u81EA\u52D5\u7684\u306B\u3053\u3053\u306B\u8FFD\u52A0\u3055\u308C\u307E\u3059\u3002'}
          <br />
          {'\u5F15\u304D\u7D9A\u304D\u7DF4\u7FD2\u3092\u7D9A\u3051\u307E\u3057\u3087\u3046\uFF01'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
        >
          {'\u{1F4D6}'} {'\u30DB\u30FC\u30E0\u306B\u623B\u308B'}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          &larr; {'\u30DB\u30FC\u30E0'}
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{'\u{1F4AA}'}</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {'\u5F31\u70B9\u514B\u670D'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {'\u9593\u9055\u3048\u305F\u554F\u984C\u3092\u5FA9\u7FD2\u3057\u3088\u3046'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-red-50">
            <p className="text-2xl font-bold text-red-600">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-0.5">{'\u7DCF\u5F31\u70B9\u6570'}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50">
            <p className="text-2xl font-bold text-green-600">{stats.masteredCount}</p>
            <p className="text-xs text-gray-500 mt-0.5">{'\u30DE\u30B9\u30BF\u30FC\u6E08\u307F'}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{availableTypes.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{'\u30BF\u30A4\u30D7\u6570'}</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-50">
            <p className="text-2xl font-bold text-amber-600">
              {stats.total - stats.masteredCount}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{'\u672A\u514B\u670D'}</p>
          </div>
        </div>
      </div>

      {/* Type Breakdown */}
      {availableTypes.length > 1 && (
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-medium text-gray-400 mb-2">{'\u30BF\u30A4\u30D7\u5225\u5185\u8A33'}</p>
          <div className="flex flex-wrap gap-2">
            {availableTypes.map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                <span>{TYPE_ICONS[type]}</span>
                {TYPE_LABELS[type]}: {stats.byType[type] || 0}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 w-fit min-w-full sm:min-w-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {'\u3059\u3079\u3066'} ({stats.total})
          </button>
          {availableTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === type
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {TYPE_ICONS[type]} {TYPE_LABELS[type]} ({stats.byType[type] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {stats.masteredCount > 0 && (
          <>
            {!showClearMasteredConfirm ? (
              <button
                type="button"
                onClick={() => setShowClearMasteredConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors cursor-pointer shadow-sm"
              >
                {'\u2713'} {'\u30DE\u30B9\u30BF\u30FC\u6E08\u307F\u3092\u30AF\u30EA\u30A2'} ({stats.masteredCount})
              </button>
            ) : (
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearMastered}
                  className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors cursor-pointer"
                >
                  {'\u78BA\u8A8D'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearMasteredConfirm(false)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {'\u30AD\u30E3\u30F3\u30BB\u30EB'}
                </button>
              </div>
            )}
          </>
        )}

        <div className="flex-1" />

        {!showClearConfirm ? (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors cursor-pointer"
          >
            {'\u3059\u3079\u3066\u30AF\u30EA\u30A2'}
          </button>
        ) : (
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
            >
              {'\u672C\u5F53\u306B\u524A\u9664'}
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {'\u30AD\u30E3\u30F3\u30BB\u30EB'}
            </button>
          </div>
        )}
      </div>

      {/* Weak Point Cards */}
      <div className="space-y-3 mb-8">
        {filtered.map((wp) => {
          const questionText = getQuestionDisplay(wp);
          return (
            <div
              key={wp.id}
              className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 transition-all duration-200 hover:border-indigo-200"
            >
              {/* Type badge + date */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {TYPE_ICONS[wp.type]} {TYPE_LABELS[wp.type]}
                </span>
                <span className="text-[10px] text-gray-400">{formatDate(wp.timestamp)}</span>
              </div>

              {/* Question */}
              {questionText && (
                <p className="text-sm sm:text-base font-medium text-gray-900 mb-3 leading-relaxed">
                  {questionText}
                </p>
              )}

              {/* Answers comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-100">
                  <span className="text-xs mt-0.5 shrink-0">{'\u{274C}'}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-red-400 mb-0.5">
                      {'\u3042\u306A\u305F\u306E\u56DE\u7B54'}
                    </p>
                    <p className="text-sm text-red-700 break-words">{wp.wrongAnswer}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-green-50 border border-green-100">
                  <span className="text-xs mt-0.5 shrink-0">{'\u{2705}'}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-green-400 mb-0.5">
                      {'\u6B63\u3057\u3044\u7B54\u3048'}
                    </p>
                    <p className="text-sm text-green-700 break-words">{wp.correctAnswer}</p>
                  </div>
                </div>
              </div>

              {/* Footer: review stats + actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400">
                    {'\u5FA9\u7FD2'}: {wp.reviewCount}{'\u56DE'}
                  </span>
                  {wp.reviewCount > 0 && (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                        wp.lastCorrect ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {wp.lastCorrect ? '\u{2705} \u524D\u56DE\u6B63\u89E3' : '\u{274C} \u524D\u56DE\u4E0D\u6B63\u89E3'}
                    </span>
                  )}
                  {wp.lastCorrect && wp.reviewCount >= 3 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                      {'\u{1F451}'} {'\u30DE\u30B9\u30BF\u30FC'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeWeakPoint(wp.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 text-gray-400 text-[10px] font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                >
                  {'\u524A\u9664'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty filtered state */}
      {filtered.length === 0 && filter !== 'all' && (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">{'\u{1F389}'}</p>
          <p className="text-gray-500 text-sm">
            {'\u3053\u306E\u30BF\u30A4\u30D7\u306E\u5F31\u70B9\u306F\u3042\u308A\u307E\u305B\u3093\uFF01'}
          </p>
        </div>
      )}
    </div>
  );
}
