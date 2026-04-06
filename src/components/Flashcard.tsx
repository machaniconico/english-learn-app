import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PhraseItem } from '../data/types';
import AudioButton from './AudioButton';

interface FlashcardProps {
  items: PhraseItem[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Flashcard({ items }: FlashcardProps) {
  const [deck, setDeck] = useState<PhraseItem[]>(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = useMemo(() => deck[currentIndex], [deck, currentIndex]);
  const total = deck.length;

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  }, [currentIndex, total]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setFlipped(false);
    }
  }, [currentIndex]);

  const toggleFlip = useCallback(() => {
    setFlipped((f) => !f);
  }, []);

  const handleShuffle = useCallback(() => {
    setDeck(shuffleArray(items));
    setCurrentIndex(0);
    setFlipped(false);
  }, [items]);

  const handleReset = useCallback(() => {
    setDeck(items);
    setCurrentIndex(0);
    setFlipped(false);
  }, [items]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case 'ArrowRight':
          goNext();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        case ' ':
          e.preventDefault();
          toggleFlip();
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, toggleFlip]);

  if (!current) return null;

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span className="font-medium">
          {currentIndex + 1} / {total}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleShuffle}
            className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
            title="Shuffle cards"
          >
            🔀 Shuffle
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
            title="Reset to original order"
          >
            ↻ Reset
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={toggleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') toggleFlip();
        }}
        aria-label={flipped ? 'Showing answer, click to see question' : 'Showing question, click to see answer'}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front face */}
          <div
            className="w-full min-h-[260px] sm:min-h-[300px] rounded-2xl bg-white border border-gray-200 shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center gap-4"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              English
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 text-center leading-relaxed">
              {current.english}
            </p>
            <div onClick={(e) => e.stopPropagation()}>
              <AudioButton text={current.english} size="lg" />
            </div>
            {current.example && (
              <p className="text-sm text-gray-400 text-center italic mt-2">
                {current.example}
              </p>
            )}
            <p className="text-xs text-gray-300 mt-auto">
              tap to flip
            </p>
          </div>

          {/* Back face */}
          <div
            className="w-full min-h-[260px] sm:min-h-[300px] rounded-2xl bg-indigo-50 border border-indigo-200 shadow-lg p-6 sm:p-8 flex flex-col items-center justify-center gap-3 absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
              Japanese
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-800 text-center leading-relaxed">
              {current.japanese}
            </p>
            <p className="text-lg text-indigo-500 text-center">
              {current.pronunciation}
            </p>
            {current.exampleJa && (
              <p className="text-sm text-indigo-400 text-center italic mt-1">
                {current.exampleJa}
              </p>
            )}
            <p className="text-xs text-indigo-300 mt-auto">
              tap to flip back
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          ← Prev
        </button>
        <p className="text-xs text-gray-400 hidden sm:block">
          ← → arrows to navigate, space to flip
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          disabled={currentIndex === total - 1}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
