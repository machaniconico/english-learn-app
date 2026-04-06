import { useState } from 'react';
import { Link } from 'react-router-dom';
import { part3Conversations } from '../data/toeic/part3-listening';
import ConversationListening from '../components/ConversationListening';

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

type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export default function Part3Page() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');

  // Practice mode: render selected conversation
  if (selectedId) {
    const conv = part3Conversations.find((c) => c.id === selectedId);

    if (!conv) {
      return (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">{'\u{1F625}'}</p>
          <p className="text-gray-500 text-lg">会話が見つかりませんでした。</p>
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

    const config = levelConfig[conv.level];

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
                Part 3 Conversation
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${config.badge} capitalize mr-2`}>
                  {conv.level}
                </span>
                {conv.questions.length} questions
              </p>
            </div>
          </div>
        </div>

        {/* Conversation Listening */}
        <ConversationListening conversations={[conv]} />

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

  const filtered =
    levelFilter === 'all'
      ? part3Conversations
      : part3Conversations.filter((c) => c.level === levelFilter);

  // Selection mode: show conversation cards
  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-4xl mb-3">{'\u{1F5E3}'}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Part 3: Conversations
        </h1>
        <p className="text-sm text-gray-500 mt-1">会話問題 - 会話を聞いて質問に答える</p>
        <p className="mt-3 text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
          2人の会話を聞き、内容に関する質問に答えましょう。本番のTOEICと同様に、テキストは隠れた状態で聞き取りに挑戦できます。
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

      {/* Conversation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-10">
        {filtered.map((conv) => {
          const config = levelConfig[conv.level];
          const firstLine = conv.conversation[0];

          return (
            <button
              key={conv.id}
              type="button"
              onClick={() => setSelectedId(conv.id)}
              className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-left cursor-pointer"
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} text-2xl shadow-sm mb-4`}
              >
                {config.icon}
              </div>

              {/* Level badge */}
              <div className="mb-3">
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${config.badge} capitalize`}
                >
                  {conv.level}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                Conversation {part3Conversations.indexOf(conv) + 1}
              </h2>

              {/* Preview */}
              <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2">
                {firstLine.speaker}: &ldquo;{firstLine.text.slice(0, 60)}...&rdquo;
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  {conv.conversation.length} lines / {conv.questions.length} 問
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
          onClick={() => {
            // Start from first conversation in "all" mode
            setSelectedId('__all__');
          }}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
        >
          {'\u{1F3AF}'} 全会話に挑戦する ({part3Conversations.length} conversations)
        </button>
      </div>

      {/* All mode */}
      {selectedId === '__all__' && (
        <AllConversationsModal
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

function AllConversationsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl p-6 sm:p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer text-xl"
          aria-label="Close"
        >
          {'\u2715'}
        </button>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {'\u{1F3AF}'} 全会話チャレンジ
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            全{part3Conversations.length}つの会話に連続で挑戦します
          </p>
        </div>
        <ConversationListening conversations={part3Conversations} />
      </div>
    </div>
  );
}
