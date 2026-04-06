import { useState } from 'react';
import { Link } from 'react-router-dom';
import { part4Talks } from '../data/toeic/part4-listening';
import TalkListening from '../components/TalkListening';

const levelConfig = {
  beginner: {
    badge: 'bg-green-100 text-green-700 border-green-200',
    gradient: 'from-green-500 to-emerald-600',
    icon: '\u{1F331}',
  },
  intermediate: {
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    gradient: 'from-yellow-500 to-amber-600',
    icon: '\u{1F4C8}',
  },
  advanced: {
    badge: 'bg-red-100 text-red-700 border-red-200',
    gradient: 'from-red-500 to-rose-600',
    icon: '\u{1F525}',
  },
} as const;

const TYPE_ICONS: Record<string, string> = {
  announcement: '\u{1F4E2}',
  voicemail: '\u{1F4DE}',
  introduction: '\u{1F91D}',
  advertisement: '\u{1F4F0}',
  news: '\u{1F4FA}',
};

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export default function Part4Page() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');

  // Practice mode: render selected talk
  if (selectedId && selectedId !== '__all__') {
    const talk = part4Talks.find((t) => t.id === selectedId);

    if (!talk) {
      return (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">{'\u{1F625}'}</p>
          <p className="text-gray-500 text-lg">トークが見つかりませんでした。</p>
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            &larr; 問題一覧に戻る
          </button>
        </div>
      );
    }

    const config = levelConfig[talk.level];

    return (
      <div>
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4 cursor-pointer"
          >
            &larr; 問題一覧に戻る
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Part 4 Talk
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className="inline-flex items-center gap-1 mr-2">
                  {TYPE_ICONS[talk.type] || '\u{1F4AC}'} {talk.typeJa}
                </span>
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${config.badge} capitalize mr-2`}>
                  {talk.level}
                </span>
                {talk.questions.length} questions
              </p>
            </div>
          </div>
        </div>

        {/* Talk Listening */}
        <TalkListening talks={[talk]} />

        {/* Back link */}
        <div className="mt-8 text-center pb-6">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            {'\u{1F4CB}'} 問題一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  // All mode
  if (selectedId === '__all__') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
        <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer text-xl"
            aria-label="Close"
          >
            {'\u2715'}
          </button>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {'\u{1F3AF}'} 全トークチャレンジ
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              全{part4Talks.length}つのトークに連続で挑戦します
            </p>
          </div>
          <TalkListening talks={part4Talks} />
        </div>
      </div>
    );
  }

  const filtered =
    levelFilter === 'all'
      ? part4Talks
      : part4Talks.filter((t) => t.level === levelFilter);

  // Selection mode: show talk cards
  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-4xl mb-3">{'\u{1F399}'}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Part 4: Talks
        </h1>
        <p className="text-sm text-gray-500 mt-1">説明文問題 - トークを聞いて質問に答える</p>
        <p className="mt-3 text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
          アナウンス、留守番電話、ニュースなどのトークを聞いて、内容に関する質問に答えましょう。本番のTOEICと同様の実践練習です。
        </p>
      </div>

      {/* Back to home */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>

      {/* Level filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs text-gray-400 font-medium">Filter:</span>
        {(['all', 'beginner', 'intermediate', 'advanced'] as LevelFilter[]).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setLevelFilter(level)}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors cursor-pointer ${
              levelFilter === level
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
            }`}
          >
            {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Talk cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-10">
        {filtered.map((talk) => {
          const config = levelConfig[talk.level];

          return (
            <button
              key={talk.id}
              type="button"
              onClick={() => setSelectedId(talk.id)}
              className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-left cursor-pointer"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} text-2xl shadow-sm mb-4`}
              >
                {TYPE_ICONS[talk.type] || '\u{1F4AC}'}
              </div>

              {/* Badges */}
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  {talk.typeJa}
                </span>
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${config.badge} capitalize`}
                >
                  {talk.level}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {talk.typeJa}
              </h2>

              {/* Preview */}
              <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
                &ldquo;{talk.talk.slice(0, 80)}...&rdquo;
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  {talk.questions.length} 問
                </span>
                <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors">
                  開始する &rarr;
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Play All button */}
      <div className="text-center pb-10">
        <button
          type="button"
          onClick={() => setSelectedId('__all__')}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          {'\u{1F3AF}'} 全トークに挑戦する ({part4Talks.length} talks)
        </button>
      </div>
    </div>
  );
}
