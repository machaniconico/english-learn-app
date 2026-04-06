import { useState, useEffect, useMemo, useCallback } from 'react';
import { dictionary } from '../data/dictionary';
import { sections } from '../data/sections';
import { fillInBlankSets } from '../data/toeic/fill-in-blank';
import AudioButton from './AudioButton';
import type { PhraseItem } from '../data/types';

// --- Seeded random based on date string ---
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) | 0;
    return (hash >>> 0) / 4294967296;
  };
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// --- Gather all phrase items from all sections ---
function getAllPhraseItems(): PhraseItem[] {
  const items: PhraseItem[] = [];
  for (const section of sections) {
    for (const category of section.categories) {
      for (const lesson of category.lessons) {
        items.push(...lesson.items);
      }
    }
  }
  return items;
}

// --- Gather idiom items ---
function getIdiomItems(): PhraseItem[] {
  const idiomSection = sections.find(s => s.id === 'idioms');
  if (!idiomSection) return [];
  const items: PhraseItem[] = [];
  for (const category of idiomSection.categories) {
    for (const lesson of category.lessons) {
      items.push(...lesson.items);
    }
  }
  return items;
}

// --- localStorage helpers ---
function getStorageKey(date: string) {
  return `daily-challenge-${date}`;
}

interface DailyChallengeState {
  completed: boolean[];
}

function loadState(date: string): DailyChallengeState {
  try {
    const raw = localStorage.getItem(getStorageKey(date));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { completed: [false, false, false, false, false] };
}

function saveState(date: string, state: DailyChallengeState) {
  localStorage.setItem(getStorageKey(date), JSON.stringify(state));
}

// --- Challenge types ---
interface WordOfTheDay {
  type: 'word';
  word: typeof dictionary[number];
}

interface FillInBlankChallenge {
  type: 'fillInBlank';
  question: {
    sentence: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

interface TranslationQuiz {
  type: 'translation';
  phrase: PhraseItem;
}

interface ListeningChallenge {
  type: 'listening';
  phrase: PhraseItem;
  options: string[];
  correctIndex: number;
}

interface IdiomOfTheDay {
  type: 'idiom';
  idiom: PhraseItem;
}

type Challenge = WordOfTheDay | FillInBlankChallenge | TranslationQuiz | ListeningChallenge | IdiomOfTheDay;

const challengeTitles = [
  'Word of the Day',
  'Fill in the Blank',
  'Translation Quiz',
  'Listening Challenge',
  'Idiom of the Day',
];

const challengeTitlesJa = [
  '今日の単語',
  '空所補充',
  '翻訳クイズ',
  'リスニング',
  '今日の慣用句',
];

const challengeIcons = ['📖', '✏️', '🔄', '🎧', '💡'];

// --- Main Component ---
export default function DailyChallenge() {
  const today = getTodayString();
  const [state, setState] = useState<DailyChallengeState>(() => loadState(today));
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Fill-in-blank answer state
  const [fibSelected, setFibSelected] = useState<number | null>(null);
  const [fibSubmitted, setFibSubmitted] = useState(false);

  // Translation quiz state
  const [translationInput, setTranslationInput] = useState('');
  const [translationSubmitted, setTranslationSubmitted] = useState(false);

  // Listening challenge state
  const [listeningSelected, setListeningSelected] = useState<number | null>(null);
  const [listeningSubmitted, setListeningSubmitted] = useState(false);

  // Countdown
  const [countdown, setCountdown] = useState('');

  const completedCount = state.completed.filter(Boolean).length;
  const allCompleted = completedCount === 5;

  // Generate challenges deterministically based on today's date
  const challenges: Challenge[] = useMemo(() => {
    const rng = seededRandom(today);
    const allPhrases = getAllPhraseItems();
    const idiomItems = getIdiomItems();
    const allQuestions = fillInBlankSets.flatMap(s => s.questions);

    // 1. Word of the Day
    const wordIndex = Math.floor(rng() * dictionary.length);
    const word: WordOfTheDay = { type: 'word', word: dictionary[wordIndex] };

    // 2. Fill in the Blank
    const fibIndex = Math.floor(rng() * allQuestions.length);
    const fibQ = allQuestions[fibIndex];
    const fib: FillInBlankChallenge = {
      type: 'fillInBlank',
      question: {
        sentence: fibQ.sentence,
        options: [...fibQ.options],
        correctIndex: fibQ.correctIndex,
        explanation: fibQ.explanation,
      },
    };

    // 3. Translation Quiz
    const transIndex = Math.floor(rng() * allPhrases.length);
    const trans: TranslationQuiz = { type: 'translation', phrase: allPhrases[transIndex] };

    // 4. Listening Challenge
    const listenIndex = Math.floor(rng() * allPhrases.length);
    const correctPhrase = allPhrases[listenIndex];
    // Generate 2 wrong options
    const wrongOptions: string[] = [];
    const usedIndices = new Set<number>([listenIndex]);
    while (wrongOptions.length < 2 && usedIndices.size < allPhrases.length) {
      const idx = Math.floor(rng() * allPhrases.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        wrongOptions.push(allPhrases[idx].japanese);
      }
    }
    // Place correct answer at a random position
    const correctPos = Math.floor(rng() * 3);
    const listeningOptions = [...wrongOptions];
    listeningOptions.splice(correctPos, 0, correctPhrase.japanese);

    const listening: ListeningChallenge = {
      type: 'listening',
      phrase: correctPhrase,
      options: listeningOptions,
      correctIndex: correctPos,
    };

    // 5. Idiom of the Day
    const idiomPool = idiomItems.length > 0 ? idiomItems : allPhrases;
    const idiomIndex = Math.floor(rng() * idiomPool.length);
    const idiom: IdiomOfTheDay = { type: 'idiom', idiom: idiomPool[idiomIndex] };

    return [word, fib, trans, listening, idiom];
  }, [today]);

  // Save state whenever it changes
  useEffect(() => {
    saveState(today, state);
  }, [today, state]);

  // Show celebration when all completed
  useEffect(() => {
    if (allCompleted) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [allCompleted]);

  // Countdown timer
  useEffect(() => {
    if (!allCompleted) return;

    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${hours}時間 ${minutes}分 ${seconds}秒`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [allCompleted]);

  const markCompleted = useCallback((index: number) => {
    setState(prev => {
      if (prev.completed[index]) return prev;
      const newCompleted = [...prev.completed];
      newCompleted[index] = true;
      return { completed: newCompleted };
    });
  }, []);

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
      // Reset interactive states when opening a new card
      setFibSelected(null);
      setFibSubmitted(false);
      setTranslationInput('');
      setTranslationSubmitted(false);
      setListeningSelected(null);
      setListeningSubmitted(false);
    }
  };

  // --- Render challenge content ---
  function renderChallenge(challenge: Challenge, index: number) {
    switch (challenge.type) {
      case 'word': {
        const { word } = challenge;
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-indigo-700">{word.english}</span>
              <AudioButton text={word.english} size="sm" />
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{word.partOfSpeech}</span>
            </div>
            <p className="text-lg text-gray-700">{word.japanese} <span className="text-sm text-gray-400">({word.pronunciation})</span></p>
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <div className="flex items-center gap-2">
                <AudioButton text={word.example} size="sm" />
                <p className="text-sm text-gray-800 italic">"{word.example}"</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">{word.exampleJa}</p>
            </div>
            {!state.completed[index] && (
              <button
                type="button"
                onClick={() => markCompleted(index)}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                覚えた！
              </button>
            )}
          </div>
        );
      }

      case 'fillInBlank': {
        const { question } = challenge;
        return (
          <div className="space-y-3">
            <p className="text-gray-800 font-medium">{question.sentence}</p>
            <div className="grid grid-cols-2 gap-2">
              {question.options.map((opt, i) => {
                let btnClass = 'p-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ';
                if (fibSubmitted) {
                  if (i === question.correctIndex) {
                    btnClass += 'bg-green-100 border-green-400 text-green-800';
                  } else if (i === fibSelected) {
                    btnClass += 'bg-red-100 border-red-400 text-red-800';
                  } else {
                    btnClass += 'bg-gray-50 border-gray-200 text-gray-400';
                  }
                } else if (i === fibSelected) {
                  btnClass += 'bg-indigo-100 border-indigo-400 text-indigo-800';
                } else {
                  btnClass += 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50';
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={fibSubmitted}
                    onClick={() => setFibSelected(i)}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {fibSelected !== null && !fibSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setFibSubmitted(true);
                  markCompleted(index);
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                回答する
              </button>
            )}
            {fibSubmitted && (
              <div className={`p-3 rounded-lg text-sm ${fibSelected === question.correctIndex ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                {fibSelected === question.correctIndex ? '正解！ ' : '不正解... '}
                {question.explanation}
              </div>
            )}
          </div>
        );
      }

      case 'translation': {
        const { phrase } = challenge;
        const isCorrect = translationInput.trim().toLowerCase() === phrase.english.toLowerCase();
        return (
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">次の日本語を英語に翻訳してください：</p>
            <p className="text-lg font-bold text-gray-800">{phrase.japanese}</p>
            <input
              type="text"
              value={translationInput}
              onChange={(e) => setTranslationInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && translationInput.trim() && !translationSubmitted) {
                  setTranslationSubmitted(true);
                  markCompleted(index);
                }
              }}
              disabled={translationSubmitted}
              placeholder="英語を入力..."
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-gray-50"
            />
            {translationInput.trim() && !translationSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setTranslationSubmitted(true);
                  markCompleted(index);
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                回答する
              </button>
            )}
            {translationSubmitted && (
              <div className="space-y-2">
                <div className={`p-3 rounded-lg text-sm ${isCorrect ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                  {isCorrect ? '正解！' : (
                    <>
                      <p>正解: <span className="font-bold">{phrase.english}</span></p>
                      <p className="mt-1">あなたの回答: {translationInput}</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <AudioButton text={phrase.english} size="sm" />
                  <span className="text-sm text-gray-500">{phrase.pronunciation}</span>
                </div>
              </div>
            )}
          </div>
        );
      }

      case 'listening': {
        const { phrase, options, correctIndex } = challenge;
        return (
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">音声を聞いて、正しい日本語訳を選んでください：</p>
            <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-lg">
              <AudioButton text={phrase.english} size="lg" />
              <span className="text-sm text-gray-500">音声を再生</span>
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => {
                let btnClass = 'w-full text-left p-3 rounded-lg border text-sm font-medium transition-all cursor-pointer ';
                if (listeningSubmitted) {
                  if (i === correctIndex) {
                    btnClass += 'bg-green-100 border-green-400 text-green-800';
                  } else if (i === listeningSelected) {
                    btnClass += 'bg-red-100 border-red-400 text-red-800';
                  } else {
                    btnClass += 'bg-gray-50 border-gray-200 text-gray-400';
                  }
                } else if (i === listeningSelected) {
                  btnClass += 'bg-indigo-100 border-indigo-400 text-indigo-800';
                } else {
                  btnClass += 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50';
                }
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={listeningSubmitted}
                    onClick={() => setListeningSelected(i)}
                    className={btnClass}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {listeningSelected !== null && !listeningSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setListeningSubmitted(true);
                  markCompleted(index);
                }}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                回答する
              </button>
            )}
            {listeningSubmitted && (
              <div className={`p-3 rounded-lg text-sm ${listeningSelected === correctIndex ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                {listeningSelected === correctIndex ? '正解！' : `不正解... 正解は「${options[correctIndex]}」`}
                <p className="mt-1 text-gray-600">英語: <span className="font-medium">{phrase.english}</span></p>
              </div>
            )}
          </div>
        );
      }

      case 'idiom': {
        const { idiom } = challenge;
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-amber-700">{idiom.english}</span>
              <AudioButton text={idiom.english} size="sm" />
            </div>
            <p className="text-lg text-gray-700">{idiom.japanese}</p>
            {idiom.pronunciation && (
              <p className="text-sm text-gray-400">{idiom.pronunciation}</p>
            )}
            {idiom.example && (
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <div className="flex items-center gap-2">
                  <AudioButton text={idiom.example} size="sm" />
                  <p className="text-sm text-gray-800 italic">"{idiom.example}"</p>
                </div>
                {idiom.exampleJa && (
                  <p className="text-sm text-gray-500 mt-1">{idiom.exampleJa}</p>
                )}
              </div>
            )}
            {!state.completed[index] && (
              <button
                type="button"
                onClick={() => markCompleted(index)}
                className="mt-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
              >
                覚えた！
              </button>
            )}
          </div>
        );
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm text-gray-500 font-medium">{today}</p>
        <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Daily Challenge</h2>
        <div className="mt-2 inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-bold">
          <span>{completedCount}/5 完了</span>
          {allCompleted && <span className="text-green-600">✓</span>}
        </div>
      </div>

      {/* Celebration */}
      {showCelebration && (
        <div className="text-center py-4 animate-bounce">
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-lg font-bold text-indigo-700">全チャレンジ完了！</p>
          <p className="text-sm text-gray-500">素晴らしい！明日も頑張りましょう！</p>
        </div>
      )}

      {/* Countdown (shown when all completed) */}
      {allCompleted && !showCelebration && countdown && (
        <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
          <p className="text-sm text-gray-500">明日のチャレンジまで</p>
          <p className="text-lg font-bold text-indigo-700 mt-1">{countdown}</p>
        </div>
      )}

      {/* Challenge Cards */}
      <div className="space-y-3">
        {challenges.map((challenge, index) => {
          const isExpanded = expandedIndex === index;
          const isCompleted = state.completed[index];

          return (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isCompleted
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-gray-200 bg-white hover:border-indigo-200'
              }`}
            >
              {/* Card Header (clickable) */}
              <button
                type="button"
                onClick={() => toggleExpand(index)}
                className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
              >
                <span className="text-2xl shrink-0">{challengeIcons[index]}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{challengeTitles[index]}</p>
                  <p className="text-xs text-gray-500">{challengeTitlesJa[index]}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isCompleted && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white text-xs">
                      ✓
                    </span>
                  )}
                  <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  {renderChallenge(challenge, index)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
