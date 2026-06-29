import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  buildCards,
  formatTime,
  getStars,
  type Card,
  type MatchingItem,
} from '../utils/matchingGame';

interface MatchingGameProps {
  items: MatchingItem[];
  title?: string;
}

export default function MatchingGame({ items, title }: MatchingGameProps) {
  const [cards, setCards] = useState<Card[]>(() => buildCards(items));
  const [selected, setSelected] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showMismatch, setShowMismatch] = useState(false);
  const [justMatched, setJustMatched] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const focusIndex = useRef(0);

  const pairCount = useMemo(() => {
    const selected = items.length > 8 ? 8 : items.length;
    return selected;
  }, [items.length]);

  // Derived completion state: true once every card is matched.
  const completed = cards.length > 0 && cards.every((c) => c.matched);

  // Timer (stops once the game is completed)
  useEffect(() => {
    if (isRunning && !completed) {
      timerRef.current = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, completed]);

  const handleCardClick = useCallback(
    (cardId: string) => {
      if (showMismatch) return;
      if (selected.includes(cardId)) return;

      const card = cards.find((c) => c.id === cardId);
      if (!card || card.matched) return;

      if (!isRunning && !completed) {
        setIsRunning(true);
      }

      const newSelected = [...selected, cardId];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setMoves((m) => m + 1);
        const [firstId, secondId] = newSelected;
        const first = cards.find((c) => c.id === firstId)!;
        const second = cards.find((c) => c.id === secondId)!;

        if (first.pairId === second.pairId && first.type !== second.type) {
          // Match found
          setJustMatched([firstId, secondId]);
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, matched: true }
                  : c
              )
            );
            setSelected([]);
            setJustMatched([]);
          }, 600);
        } else {
          // No match
          setShowMismatch(true);
          setTimeout(() => {
            setSelected([]);
            setShowMismatch(false);
          }, 1000);
        }
      }
    },
    [cards, selected, showMismatch, isRunning, completed]
  );

  const handlePlayAgain = useCallback(() => {
    setCards(buildCards(items));
    setSelected([]);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setShowMismatch(false);
    setJustMatched([]);
    focusIndex.current = 0;
  }, [items]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (completed) return;

      const visibleCards = cards.filter((c) => !c.matched);
      if (visibleCards.length === 0) return;

      const allCardIds = cards.map((c) => c.id);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown': {
          e.preventDefault();
          let next = focusIndex.current + 1;
          while (next < allCardIds.length && cards[next]?.matched) next++;
          if (next < allCardIds.length) {
            focusIndex.current = next;
            cardRefs.current.get(allCardIds[next])?.focus();
          }
          break;
        }
        case 'ArrowLeft':
        case 'ArrowUp': {
          e.preventDefault();
          let prev = focusIndex.current - 1;
          while (prev >= 0 && cards[prev]?.matched) prev--;
          if (prev >= 0) {
            focusIndex.current = prev;
            cardRefs.current.get(allCardIds[prev])?.focus();
          }
          break;
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cards, completed]);

  const stars = getStars(moves, pairCount);
  const matchedCount = cards.filter((c) => c.matched).length / 2;

  // Completion screen
  if (completed) {
    return (
      <div className="w-full max-w-lg mx-auto text-center">
        {title && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h2>
        )}
        <div
          role="status"
          aria-live="polite"
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 sm:p-10"
        >
          <div className="text-5xl mb-4 animate-bounce">
            {stars === 3 ? '🏆' : stars === 2 ? '🎉' : '👏'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            コンプリート！
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            全てのペアをマッチさせました！
          </p>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={`text-4xl transition-all duration-500 ${
                  s <= stars
                    ? 'scale-110 drop-shadow-lg'
                    : 'opacity-20 grayscale'
                }`}
                style={{
                  animationDelay: `${s * 200}ms`,
                }}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-indigo-50 dark:bg-indigo-900/40 rounded-xl p-4">
              <p className="text-sm text-indigo-400 dark:text-indigo-300 font-medium">タイム</p>
              <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                {formatTime(time)}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/40 rounded-xl p-4">
              <p className="text-sm text-purple-400 dark:text-purple-300 font-medium">手数</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{moves}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePlayAgain}
            className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-md hover:bg-indigo-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            🔄 もう一度
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {title && (
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 dark:text-gray-500">⏱</span>
          <span className="font-mono font-bold text-gray-700 dark:text-gray-300">
            {formatTime(time)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 dark:text-gray-500">🎯</span>
          <span className="font-bold text-gray-700 dark:text-gray-300">
            {matchedCount} / {pairCount}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 dark:text-gray-500">👆</span>
          <span className="font-bold text-gray-700 dark:text-gray-300">{moves} 手</span>
        </div>
      </div>

      {/* Live region for screen-reader announcements */}
      <p aria-live="polite" className="sr-only">
        {showMismatch
          ? '不正解です。もう一度選んでください'
          : justMatched.length
            ? 'マッチしました'
            : `${matchedCount} / ${pairCount} ペア`}
      </p>

      {/* Card grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {cards.map((card) => {
          const isSelected = selected.includes(card.id);
          const isRevealed = isSelected || card.matched;
          const isMismatch = isSelected && showMismatch;
          const isJustMatched = justMatched.includes(card.id);

          return (
            <button
              key={card.id}
              ref={(el) => {
                if (el) cardRefs.current.set(card.id, el);
              }}
              type="button"
              onClick={() => handleCardClick(card.id)}
              disabled={card.matched || showMismatch}
              className={`
                relative w-full aspect-[3/4] rounded-xl cursor-pointer
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                ${card.matched ? 'cursor-default' : ''}
                ${isMismatch ? 'animate-pulse' : ''}
              `}
              style={{ perspective: '600px' }}
              aria-label={
                isRevealed
                  ? `${card.type === 'english' ? 'English' : 'Japanese'}: ${card.text}`
                  : 'Face-down card'
              }
            >
              <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Back (face-down) */}
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md flex items-center justify-center border-2 border-indigo-400"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-white/40 text-3xl sm:text-4xl font-bold">
                    ?
                  </span>
                </div>

                {/* Front (face-up) */}
                <div
                  className={`
                    absolute inset-0 rounded-xl bg-white dark:bg-gray-800 shadow-md
                    flex items-center justify-center p-2 sm:p-3 text-center
                    border-2 transition-all duration-300
                    ${
                      card.matched
                        ? 'border-green-400 dark:border-green-700 shadow-green-200 dark:shadow-green-900/40 shadow-lg'
                        : card.type === 'english'
                          ? 'border-blue-300 dark:border-blue-700'
                          : 'border-purple-300 dark:border-purple-700'
                    }
                    ${isJustMatched ? 'ring-4 ring-green-300 dark:ring-green-600 scale-105' : ''}
                    ${isMismatch ? 'border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/40' : ''}
                  `}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div>
                    <p
                      className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${
                        card.type === 'english'
                          ? 'text-blue-400 dark:text-blue-300'
                          : 'text-purple-400 dark:text-purple-300'
                      }`}
                    >
                      {card.type === 'english' ? 'EN' : 'JA'}
                    </p>
                    <p
                      className={`text-sm sm:text-base font-bold leading-tight ${
                        card.matched
                          ? 'text-green-700 dark:text-green-300'
                          : isMismatch
                            ? 'text-red-600 dark:text-red-300'
                            : 'text-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {card.text}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Play again button */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handlePlayAgain}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          🔄 もう一度
        </button>
      </div>
    </div>
  );
}
