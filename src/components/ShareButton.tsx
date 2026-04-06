import { useState, useRef, useEffect } from 'react';

interface ShareButtonProps {
  score?: number;
  title?: string;
  text?: string;
}

export default function ShareButton({ score, title, text }: ShareButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const url = 'https://english-learn-app.pages.dev/';
  const defaultText = `English Learnで英語学習中！${score ? `スコア${score}%を達成！` : ''}`;
  const shareText = text ?? defaultText;
  const shareTitle = title ?? 'English Learn - 英語学習アプリ';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url });
        return;
      } catch {
        // User cancelled or error — fall through to dropdown
      }
    }
    setShowDropdown((prev) => !prev);
  }

  function shareOnX() {
    const tweetText = encodeURIComponent(`${shareText}\n${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'noopener');
    setShowDropdown(false);
  }

  function shareOnLINE() {
    const lineText = encodeURIComponent(`${shareText}\n${url}`);
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${lineText}`, '_blank', 'noopener');
    setShowDropdown(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowDropdown(false);
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
        aria-label="Share"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {copied ? 'Copied!' : 'Share'}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={shareOnX}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="w-5 text-center font-bold text-black">X</span>
            <span>X (Twitter) で共有</span>
          </button>
          <button
            onClick={shareOnLINE}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="w-5 text-center text-green-500 font-bold">L</span>
            <span>LINE で共有</span>
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>リンクをコピー</span>
          </button>
        </div>
      )}
    </div>
  );
}
