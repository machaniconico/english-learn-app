import { useSpacedRepetition } from '../hooks/useSpacedRepetition';

interface SRSButtonProps {
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
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-10 h-10 text-xs',
} as const;

export default function SRSButton({ item, source, size = 'md' }: SRSButtonProps) {
  const { addCard, removeCard, isInSRS } = useSpacedRepetition();
  const inSRS = isInSRS(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inSRS) {
      removeCard(item.id);
    } else {
      addCard({
        id: item.id,
        english: item.english,
        japanese: item.japanese,
        pronunciation: item.pronunciation,
        source,
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
        transition-all duration-200 cursor-pointer font-bold
        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
        ${
          inSRS
            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-indigo-500'
        }
      `}
      aria-label={inSRS ? 'SRSから削除' : 'SRSに追加'}
      title={inSRS ? 'SRSから削除' : 'SRSに追加'}
      style={{
        animation: inSRS ? 'srs-pop 0.3s ease-out' : 'none',
      }}
    >
      {inSRS ? (
        <svg className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        'SRS'
      )}
      <style>{`
        @keyframes srs-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </button>
  );
}
