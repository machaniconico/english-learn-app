import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSection } from '../hooks/useSection';
import { useStudyTimer } from '../hooks/useStudyTimer';
import PronunciationPractice from '../components/PronunciationPractice';
import ContentLoading from '../components/ContentLoading';
import type { PhraseItem } from '../data/types';

const PRACTICE_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PronunciationPage() {
  const section = useSection('phrases');
  const { startTimer, stopTimer } = useStudyTimer();

  useEffect(() => {
    startTimer('pronunciation');
    return () => {
      stopTimer();
    };
  }, [startTimer, stopTimer]);

  const items: PhraseItem[] = useMemo(() => {
    if (!section) return [];
    const all = section.categories.flatMap((c) => c.lessons.flatMap((l) => l.items));
    return shuffle(all).slice(0, PRACTICE_SIZE);
  }, [section]);

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors mb-4"
        >
          &larr; ホーム
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">🎤</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">発音練習</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              フレーズを声に出して、発音をチェックしよう
            </p>
          </div>
        </div>
      </div>

      {section === undefined ? (
        <ContentLoading />
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500 py-20">練習できるフレーズがありません。</p>
      ) : (
        <PronunciationPractice items={items} />
      )}
    </div>
  );
}
