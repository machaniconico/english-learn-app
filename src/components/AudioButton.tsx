import { useState } from 'react';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'w-8 h-8 text-base',
  md: 'w-10 h-10 text-lg',
  lg: 'w-12 h-12 text-xl',
} as const;

const speeds = [0.5, 0.75, 1] as const;

export default function AudioButton({ text, size = 'md' }: AudioButtonProps) {
  const { speak, stop, speaking, rate, setRate } = useSpeechSynthesis();
  const [showSpeed, setShowSpeed] = useState(false);

  const handleClick = () => {
    if (speaking) {
      stop();
    } else {
      speak(text);
    }
  };

  const handleSpeedClick = (speed: number) => {
    setRate(speed);
    setShowSpeed(false);
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowSpeed((v) => !v);
        }}
        className={`
          ${sizeStyles[size]}
          inline-flex items-center justify-center rounded-full
          bg-indigo-100 text-indigo-700
          hover:bg-indigo-200 active:scale-95
          transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
          ${speaking ? 'animate-pulse bg-indigo-200 ring-2 ring-indigo-400' : ''}
        `}
        aria-label={speaking ? 'Stop audio' : 'Play audio'}
        title="Click to play, right-click for speed"
      >
        {speaking ? '🔊' : '🔈'}
      </button>

      <button
        type="button"
        onClick={() => setShowSpeed((v) => !v)}
        className={`
          ${size === 'sm' ? 'text-[10px] px-1 py-0.5' : 'text-xs px-1.5 py-0.5'}
          rounded bg-gray-100 text-gray-500
          hover:bg-gray-200 hover:text-gray-700
          transition-colors cursor-pointer
          focus:outline-none focus:ring-1 focus:ring-indigo-300
        `}
        aria-label="Change playback speed"
      >
        {rate}x
      </button>

      {showSpeed && (
        <div className="absolute top-full left-0 mt-1 z-10 flex gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5">
          {speeds.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => handleSpeedClick(speed)}
              className={`
                px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer
                focus:outline-none focus:ring-1 focus:ring-indigo-300
                ${
                  rate === speed
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'
                }
              `}
            >
              {speed}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
