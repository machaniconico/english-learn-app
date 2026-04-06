import { useBookmarks } from '../hooks/useBookmarks';

interface BookmarkButtonProps {
  item: {
    id: string;
    english: string;
    japanese: string;
    pronunciation: string;
  };
  source: string;
  size?: 'sm' | 'md';
}

const sizeStyles = {
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-lg',
} as const;

export default function BookmarkButton({
  item,
  source,
  size = 'md',
}: BookmarkButtonProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(item.id);
    } else {
      addBookmark({
        ...item,
        source,
        addedAt: Date.now(),
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        ${sizeStyles[size]}
        inline-flex items-center justify-center rounded-full
        transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
        ${
          bookmarked
            ? 'bg-amber-100 text-amber-500 hover:bg-amber-200 scale-100'
            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-amber-400'
        }
      `}
      aria-label={bookmarked ? 'ブックマーク解除' : 'ブックマークに追加'}
      title={bookmarked ? 'ブックマーク解除' : 'ブックマークに追加'}
      style={{
        animation: bookmarked ? 'bookmark-pop 0.3s ease-out' : 'none',
      }}
    >
      {bookmarked ? '\u2605' : '\u2606'}
      <style>{`
        @keyframes bookmark-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}
