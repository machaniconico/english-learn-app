import { Link, useParams } from 'react-router-dom';
import { reorderSets } from '../data/toeic/sentence-reorder';
import SentenceReorder from '../components/SentenceReorder';

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

export default function ReorderPage() {
  const { setId } = useParams<{ setId: string }>();

  // Quiz mode: render the selected set
  if (setId) {
    const set = reorderSets.find((s) => s.id === setId);

    if (!set) {
      return (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">{'\u{1F625}'}</p>
          <p className="text-gray-500 text-lg">問題セットが見つかりませんでした。</p>
          <Link
            to="/reorder"
            className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            &larr; 問題一覧に戻る
          </Link>
        </div>
      );
    }

    const config = levelConfig[set.level];

    return (
      <div>
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/reorder"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
          >
            &larr; 問題一覧に戻る
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {set.titleJa}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{set.title}</p>
            </div>
          </div>
        </div>

        {/* Quiz */}
        <SentenceReorder questions={set.questions} />

        {/* Back link */}
        <div className="mt-8 text-center pb-6">
          <Link
            to="/reorder"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            {'\u{1F4CB}'} 問題一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  // Selection mode: show set cards
  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-4xl mb-3">{'\u{1F500}'}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Sentence Reorder Quiz
        </h1>
        <p className="text-sm text-gray-500 mt-1">語順クイズ - 正しい英語の語順に並べ替えよう</p>
        <p className="mt-3 text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
          バラバラになった英単語を正しい語順に並べ替えて、英語の文構造を身につけましょう。
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

      {/* Set cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pb-10">
        {reorderSets.map((set) => {
          const config = levelConfig[set.level];

          return (
            <Link
              key={set.id}
              to={`/reorder/${set.id}`}
              className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
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
                  {set.level}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {set.titleJa}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{set.title}</p>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {set.description}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">
                  {set.questions.length} 問
                </span>
                <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-700 transition-colors">
                  開始する &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
