import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sections } from '../data/sections';
import AudioButton from '../components/AudioButton';
import BookmarkButton from '../components/BookmarkButton';
import SRSButton from '../components/SRSButton';
import { useStudyTimer } from '../hooks/useStudyTimer';

export default function LessonPage() {
  const { sectionId, categoryId, lessonId } = useParams<{
    sectionId: string;
    categoryId: string;
    lessonId: string;
  }>();

  const section = sections.find((s) => s.id === sectionId);
  const category = section?.categories.find((c) => c.id === categoryId);
  const lesson = category?.lessons.find((l) => l.id === lessonId);

  const [listenedIds, setListenedIds] = useState<Set<string>>(new Set());
  const { startTimer, stopTimer } = useStudyTimer();

  useEffect(() => {
    startTimer('lesson');
    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer]);

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

  const basePath = `/section/${sectionId}/${categoryId}/${lessonId}`;
  const progress = lesson.items.length > 0
    ? Math.round((listenedIds.size / lesson.items.length) * 100)
    : 0;

  function markListened(id: string) {
    setListenedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/section/${sectionId}/${categoryId}`}
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          &larr; {category.title}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {lesson.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{lesson.titleJa}</p>
        <p className="mt-2 text-gray-600">{lesson.description}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">リスニング進捗</span>
          <span className="text-indigo-600 font-bold">
            {listenedIds.size} / {lesson.items.length} ({progress}%)
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Phrase cards */}
      <div className="space-y-4 mb-8">
        {lesson.items.map((item, index) => (
          <div
            key={item.id}
            className={`rounded-xl border bg-white p-5 transition-all duration-200 ${
              listenedIds.has(item.id)
                ? 'border-indigo-200 bg-indigo-50/30'
                : 'border-gray-200'
            }`}
          >
            {/* Number + English */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                    {item.english}
                  </p>
                  <p className="text-base text-gray-700 mt-1">{item.japanese}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {item.pronunciation}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <SRSButton
                  item={item}
                  source={`${sectionId}/${categoryId}/${lessonId}`}
                  size="md"
                />
                <BookmarkButton
                  item={item}
                  source={`${sectionId}/${categoryId}/${lessonId}`}
                  size="md"
                />
                <div onClick={() => markListened(item.id)}>
                  <AudioButton text={item.english} size="md" />
                </div>
              </div>
            </div>

            {/* Example sentence */}
            {item.example && (
              <div className="mt-4 ml-10 pl-4 border-l-2 border-indigo-200 bg-indigo-50/50 rounded-r-lg py-3 pr-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.example}
                    </p>
                    {item.exampleJa && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.exampleJa}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <AudioButton text={item.example} size="sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Listened indicator */}
            {listenedIds.has(item.id) && (
              <div className="mt-3 ml-10 text-xs text-indigo-500 font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                リスニング済み
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Practice buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pb-6">
        <Link
          to={`${basePath}/flashcard`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold text-base hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
        >
          <span className="text-xl">🃏</span>
          フラッシュカードで練習
        </Link>
        <Link
          to={`${basePath}/quiz`}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
        >
          <span className="text-xl">🎧</span>
          リスニングクイズ
        </Link>
      </div>
    </div>
  );
}
