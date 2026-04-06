import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { sections } from '../data/sections';
import { useMemo } from 'react';

interface RoadmapItem {
  icon: string;
  label: string;
  link?: string;
  description?: string;
}

interface Stage {
  number: number;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  bgColor: string;
  dotColor: string;
  lineColor: string;
  gradientFrom: string;
  gradientTo: string;
  goalLabel: string;
  goal: string;
  items: RoadmapItem[];
}

const stages: Stage[] = [
  {
    number: 1,
    title: '基礎を固めよう',
    subtitle: 'Build Your Foundation',
    color: 'text-green-700',
    borderColor: 'border-green-300',
    bgColor: 'bg-green-50',
    dotColor: 'bg-green-500',
    lineColor: 'from-green-400 to-blue-400',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-600',
    goalLabel: 'GOAL',
    goal: '基本的な英文が読めるようになる',
    items: [
      {
        icon: '\u{1F331}',
        label: '基本文法（be動詞、一般動詞、指示代名詞）',
        link: '/section/grammar/bg-basics',
      },
      {
        icon: '\u{1F4DD}',
        label: '基本単語（日常の言葉、人と生活、自然）',
        link: '/section/vocabulary/bv-daily',
      },
      {
        icon: '\u{1F44B}',
        label: '基本フレーズ（あいさつ、日常会話）',
        link: '/section/phrases/greetings',
      },
    ],
  },
  {
    number: 2,
    title: '会話力を伸ばそう',
    subtitle: 'Expand Your Communication',
    color: 'text-blue-700',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    dotColor: 'bg-blue-500',
    lineColor: 'from-blue-400 to-purple-400',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-indigo-600',
    goalLabel: 'GOAL',
    goal: '日常会話ができるようになる',
    items: [
      {
        icon: '\u{1F4AC}',
        label: '実用フレーズ（旅行、レストラン、ショッピング）',
        link: '/section/phrases/travel',
      },
      {
        icon: '\u{2753}',
        label: '質問パターン（疑問詞、Yes/No疑問文）',
        link: '/section/grammar/bg-questions',
      },
      {
        icon: '\u{2B50}',
        label: '基本パターン（can / there is / want to）',
        link: '/section/grammar/bg-essentials',
      },
      {
        icon: '\u{1F50A}',
        label: 'フラッシュカードで復習',
        description: '各レッスンのフラッシュカード機能で単語を定着させよう',
      },
    ],
  },
  {
    number: 3,
    title: 'ビジネス英語に挑戦',
    subtitle: 'Business English',
    color: 'text-purple-700',
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50',
    dotColor: 'bg-purple-500',
    lineColor: 'from-purple-400 to-orange-400',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-violet-600',
    goalLabel: 'GOAL',
    goal: 'ビジネスシーンで英語が使える',
    items: [
      {
        icon: '\u{1F4BC}',
        label: 'ビジネスフレーズ・単語',
        link: '/section/phrases/business',
      },
      {
        icon: '\u{1F4A1}',
        label: 'ビジネス基本単語（オフィス、メール）',
        link: '/section/vocabulary/vocab-business',
      },
      {
        icon: '\u{1F504}',
        label: '専門分野（金融、マーケティング、人事、製造）',
        link: '/section/vocabulary/vocab-finance',
      },
      {
        icon: '\u{1F4D6}',
        label: '応用文法（時制、品詞、文型パターン）',
        link: '/section/grammar/grammar-tenses',
      },
    ],
  },
  {
    number: 4,
    title: 'TOEIC対策',
    subtitle: 'TOEIC Preparation',
    color: 'text-orange-700',
    borderColor: 'border-orange-300',
    bgColor: 'bg-orange-50',
    dotColor: 'bg-orange-500',
    lineColor: 'from-orange-400 to-red-400',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-amber-600',
    goalLabel: 'GOAL',
    goal: 'TOEIC 600点以上',
    items: [
      {
        icon: '\u{1F3AF}',
        label: 'TOEIC頻出文法',
        link: '/section/grammar/grammar-toeic',
      },
      {
        icon: '\u{270F}\u{FE0F}',
        label: 'Part 5 穴埋め練習',
        link: '/toeic-practice',
      },
      {
        icon: '\u{1F4DA}',
        label: 'Part 7 読解練習',
        link: '/reading-practice',
      },
      {
        icon: '\u{1F3A7}',
        label: 'リスニング攻略',
        link: '/section/toeic/toeic-lst',
      },
      {
        icon: '\u{1F4D6}',
        label: '辞書で単語力強化',
        link: '/dictionary',
      },
    ],
  },
  {
    number: 5,
    title: '満点を目指す',
    subtitle: 'Aim for Perfect Score',
    color: 'text-red-700',
    borderColor: 'border-red-300',
    bgColor: 'bg-red-50',
    dotColor: 'bg-red-500',
    lineColor: 'from-red-400 to-red-600',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-rose-600',
    goalLabel: 'GOAL',
    goal: 'TOEIC 990点!',
    items: [
      {
        icon: '\u{1F4AA}',
        label: '上級穴埋め問題に挑戦',
        link: '/toeic-practice',
      },
      {
        icon: '\u{1F9E0}',
        label: '高難度読解問題',
        link: '/reading-practice',
      },
      {
        icon: '\u{1F50D}',
        label: 'Part 5 紛らわしい語彙を完璧に',
        link: '/section/toeic/toeic-p5v',
      },
      {
        icon: '\u{1F451}',
        label: '文型パターンをマスター',
        link: '/section/grammar/grammar-patterns',
      },
    ],
  },
];

const motivationalQuotes = [
  { text: 'A journey of a thousand miles begins with a single step.', ja: '千里の道も一歩から' },
  { text: 'Practice makes perfect.', ja: '練習は裏切らない' },
  { text: "The more you learn, the more you earn.", ja: '学べば学ぶほど、世界が広がる' },
  { text: "Believe you can and you're halfway there.", ja: '信じれば、もう半分達成している' },
];

function countAllItems(): number {
  let total = 0;
  for (const section of sections) {
    for (const category of section.categories) {
      for (const lesson of category.lessons) {
        total += lesson.items.length;
      }
    }
  }
  return total;
}

function getSectionCompletedCount(
  sectionId: string,
  lessons: Record<string, { completedItems: string[] }>,
): number {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return 0;
  let completed = 0;
  for (const category of section.categories) {
    for (const lesson of category.lessons) {
      const lp = lessons[lesson.id];
      if (lp) completed += lp.completedItems.length;
    }
  }
  return completed;
}

function getSectionTotalCount(sectionId: string): number {
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return 0;
  let total = 0;
  for (const category of section.categories) {
    for (const lesson of category.lessons) {
      total += lesson.items.length;
    }
  }
  return total;
}

export default function StudyGuide() {
  const { progress, getOverallStats } = useProgress();
  const stats = getOverallStats();
  const totalAvailable = useMemo(() => countAllItems(), []);
  const completionPct =
    totalAvailable > 0 ? Math.round((stats.totalItems / totalAvailable) * 100) : 0;

  // Determine current stage based on progress
  const currentStage = useMemo(() => {
    const grammarBeginnerDone =
      getSectionCompletedCount('grammar', progress.lessons) > 0;
    const vocabBeginnerDone =
      getSectionCompletedCount('vocabulary', progress.lessons) > 0;
    const phrasesDone =
      getSectionCompletedCount('phrases', progress.lessons) > 0;
    const toeicDone =
      getSectionCompletedCount('toeic', progress.lessons) > 0;

    const grammarPct =
      getSectionTotalCount('grammar') > 0
        ? getSectionCompletedCount('grammar', progress.lessons) /
          getSectionTotalCount('grammar')
        : 0;
    const vocabPct =
      getSectionTotalCount('vocabulary') > 0
        ? getSectionCompletedCount('vocabulary', progress.lessons) /
          getSectionTotalCount('vocabulary')
        : 0;

    if (completionPct >= 80) return 5;
    if (toeicDone && grammarPct > 0.5) return 4;
    if (phrasesDone && vocabPct > 0.3) return 3;
    if (grammarBeginnerDone || vocabBeginnerDone) return 2;
    return 1;
  }, [progress.lessons, completionPct]);

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg mb-4">
          {'\u{1F5FA}\u{FE0F}'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          学習ロードマップ
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Study Roadmap: Beginner to TOEIC-Ready
        </p>
        <p className="mt-3 text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
          初心者からTOEIC高得点まで、5つのステージで
          <br className="hidden sm:inline" />
          あなたの英語力を段階的にレベルアップ!
        </p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-10 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-800">
            {'\u{1F4CA}'} 全体の進捗
          </span>
          <span className="text-sm font-bold text-indigo-700">
            {completionPct}%
          </span>
        </div>
        <div className="h-3 bg-white/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {stats.totalItems} / {totalAvailable} アイテム学習済み
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {stages.map((stage, stageIndex) => {
          const isCurrentStage = stage.number === currentStage;
          const isPastStage = stage.number < currentStage;
          const isLastStage = stageIndex === stages.length - 1;

          return (
            <div key={stage.number} className="relative">
              {/* Connector line to next stage */}
              {!isLastStage && (
                <div className="absolute left-5 sm:left-6 top-14 bottom-0 w-0.5">
                  <div
                    className={`w-full h-full ${
                      isPastStage
                        ? `bg-gradient-to-b ${stage.lineColor}`
                        : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}

              {/* Stage row */}
              <div className="relative flex gap-4 sm:gap-6 mb-4">
                {/* Timeline dot */}
                <div className="relative z-10 shrink-0 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-extrabold text-sm sm:text-base shadow-lg ${
                      isPastStage || isCurrentStage
                        ? `bg-gradient-to-br ${stage.gradientFrom} ${stage.gradientTo}`
                        : 'bg-gray-300'
                    } ${isCurrentStage ? 'ring-4 ring-offset-2 ring-opacity-50 ring-current' : ''}`}
                    style={
                      isCurrentStage
                        ? { boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.2)' }
                        : undefined
                    }
                  >
                    {isPastStage ? '\u{2713}' : stage.number}
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
                    isCurrentStage
                      ? `${stage.borderColor} ${stage.bgColor} shadow-lg`
                      : isPastStage
                        ? 'border-gray-200 bg-white/80'
                        : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Current stage marker */}
                  {isCurrentStage && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold mb-3 animate-pulse">
                      <span>{'\u{1F4CD}'}</span>
                      <span>現在地 - You are here</span>
                    </div>
                  )}

                  {/* Stage title */}
                  <div className="mb-4">
                    <h2
                      className={`text-lg sm:text-xl font-extrabold ${
                        isPastStage || isCurrentStage
                          ? stage.color
                          : 'text-gray-400'
                      }`}
                    >
                      Stage {stage.number}: {stage.title}
                    </h2>
                    <p
                      className={`text-xs mt-0.5 ${
                        isPastStage || isCurrentStage
                          ? 'text-gray-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Items */}
                  <ul className="space-y-2.5 mb-4">
                    {stage.items.map((item, itemIndex) => {
                      const content = (
                        <div
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                            item.link
                              ? 'hover:bg-white/80 hover:shadow-sm cursor-pointer group'
                              : ''
                          } ${
                            isPastStage || isCurrentStage
                              ? ''
                              : 'opacity-60'
                          }`}
                        >
                          <span className="text-lg shrink-0 mt-0.5">
                            {item.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-sm font-medium ${
                                item.link
                                  ? 'text-gray-800 group-hover:text-indigo-700'
                                  : 'text-gray-700'
                              } transition-colors`}
                            >
                              {item.label}
                            </span>
                            {item.description && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {item.link && (
                            <span className="text-xs text-indigo-400 group-hover:text-indigo-600 shrink-0 mt-1 transition-colors">
                              &rarr;
                            </span>
                          )}
                        </div>
                      );

                      return item.link ? (
                        <li key={itemIndex}>
                          <Link to={item.link}>{content}</Link>
                        </li>
                      ) : (
                        <li key={itemIndex}>{content}</li>
                      );
                    })}
                  </ul>

                  {/* Goal */}
                  <div
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
                      isPastStage
                        ? 'bg-green-100/80'
                        : isCurrentStage
                          ? `${stage.bgColor} border ${stage.borderColor}`
                          : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-400 tracking-wider">
                      {stage.goalLabel}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        isPastStage
                          ? 'text-green-700'
                          : isCurrentStage
                            ? stage.color
                            : 'text-gray-400'
                      }`}
                    >
                      {isPastStage && '\u{2705} '}
                      {stage.goal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivational quote between stages */}
              {!isLastStage && motivationalQuotes[stageIndex] && (
                <div className="ml-14 sm:ml-18 mb-6 pl-4 border-l-2 border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 italic">
                    "{motivationalQuotes[stageIndex].text}"
                  </p>
                  <p className="text-xs text-gray-300 mt-0.5">
                    - {motivationalQuotes[stageIndex].ja}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final message */}
      <div className="mt-8 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 text-center">
        <p className="text-3xl mb-3">{'\u{1F3C6}'}</p>
        <p className="text-sm font-bold text-gray-800">
          あなたのペースで、一歩ずつ進めていこう!
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Every expert was once a beginner. Keep going!
        </p>
      </div>

      {/* Quick navigation */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/"
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="text-2xl">{'\u{1F3E0}'}</span>
          <span className="text-xs font-medium text-gray-600">ホーム</span>
        </Link>
        <Link
          to="/toeic-practice"
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="text-2xl">{'\u{270F}\u{FE0F}'}</span>
          <span className="text-xs font-medium text-gray-600">TOEIC模試</span>
        </Link>
        <Link
          to="/dictionary"
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="text-2xl">{'\u{1F4D6}'}</span>
          <span className="text-xs font-medium text-gray-600">辞書</span>
        </Link>
        <Link
          to="/progress"
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <span className="text-2xl">{'\u{1F4CA}'}</span>
          <span className="text-xs font-medium text-gray-600">進捗</span>
        </Link>
      </div>
    </div>
  );
}
