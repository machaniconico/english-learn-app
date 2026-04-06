import { Link, useParams } from 'react-router-dom';
import { sections } from '../data/sections';
import ListeningQuiz from '../components/ListeningQuiz';

export default function QuizPage() {
  const { sectionId, categoryId, lessonId } = useParams<{
    sectionId: string;
    categoryId: string;
    lessonId: string;
  }>();

  const section = sections.find((s) => s.id === sectionId);
  const category = section?.categories.find((c) => c.id === categoryId);
  const lesson = category?.lessons.find((l) => l.id === lessonId);

  if (!section || !category || !lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">😥</p>
        <p className="text-gray-500 text-lg">レッスンが見つかりませんでした。</p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          &larr; ホームに戻る
        </Link>
      </div>
    );
  }

  const lessonPath = `/section/${sectionId}/${categoryId}/${lessonId}`;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to={lessonPath}
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          &larr; {lesson.title} に戻る
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎧</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              リスニングクイズ
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {lesson.title} - {lesson.titleJa}
            </p>
          </div>
        </div>
      </div>

      {/* Quiz component */}
      <ListeningQuiz items={lesson.items} />

      {/* Back to lesson */}
      <div className="mt-8 text-center pb-6">
        <Link
          to={lessonPath}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors"
        >
          📖 レッスンに戻る
        </Link>
      </div>
    </div>
  );
}
