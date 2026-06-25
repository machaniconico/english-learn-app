// Pure achievement evaluation: turns the learner's aggregate stats into a list
// of badges with unlocked state and progress, so the UI is a dumb renderer.

export interface AchievementInput {
  /** consecutive study-day streak */
  streak: number;
  /** total completed lesson items */
  completedItems: number;
  /** SRS cards reached "mastered" (interval > 21 days) */
  srsMastered: number;
  /** overall quiz accuracy, 0-100 */
  overallAccuracy: number;
  /** total recorded quiz attempts (gates the accuracy badge) */
  accuracyAttempts: number;
  /** cumulative study minutes */
  totalStudyMinutes: number;
  /** has the user completed the level diagnostic */
  hasDiagnosed: boolean;
  /** consecutive daily-quiz day streak */
  dailyQuizStreak: number;
  /** best typing-practice accuracy reached, 0-100 (0 if never played) */
  typingBestPct: number;
  /** total typing-practice plays (gates the typing-perfect badge) */
  typingPlays: number;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: { current: number; target: number };
}

interface AchievementDef {
  id: string;
  icon: string;
  title: string;
  description: string;
  target: number;
  current: (i: AchievementInput) => number;
  /** extra unlock requirement beyond current >= target */
  gate?: (i: AchievementInput) => boolean;
}

const ACCURACY_MIN_ATTEMPTS = 20;

const DEFS: AchievementDef[] = [
  { id: 'streak-3', icon: '🔥', title: '3日連続', description: '3日連続で学習', target: 3, current: (i) => i.streak },
  { id: 'streak-7', icon: '⚡', title: '1週間連続', description: '7日連続で学習', target: 7, current: (i) => i.streak },
  { id: 'streak-30', icon: '🏆', title: '1ヶ月連続', description: '30日連続で学習', target: 30, current: (i) => i.streak },
  { id: 'items-10', icon: '🌱', title: '学習スタート', description: '10アイテム完了', target: 10, current: (i) => i.completedItems },
  { id: 'items-50', icon: '📚', title: '勉強家', description: '50アイテム完了', target: 50, current: (i) => i.completedItems },
  { id: 'items-100', icon: '🎓', title: '努力の証', description: '100アイテム完了', target: 100, current: (i) => i.completedItems },
  { id: 'srs-10', icon: '🧠', title: '記憶の達人', description: 'SRSで10語マスター', target: 10, current: (i) => i.srsMastered },
  { id: 'srs-50', icon: '💎', title: '単語コレクター', description: 'SRSで50語マスター', target: 50, current: (i) => i.srsMastered },
  {
    id: 'accuracy-80',
    icon: '🎯',
    title: '正確無比',
    description: `正答率80%以上（${ACCURACY_MIN_ATTEMPTS}問以上）`,
    target: 80,
    current: (i) => i.overallAccuracy,
    gate: (i) => i.accuracyAttempts >= ACCURACY_MIN_ATTEMPTS,
  },
  { id: 'time-60', icon: '⏱️', title: '1時間達成', description: '累計60分学習', target: 60, current: (i) => i.totalStudyMinutes },
  { id: 'time-300', icon: '⏰', title: '5時間達成', description: '累計300分学習', target: 300, current: (i) => i.totalStudyMinutes },
  { id: 'diagnosed', icon: '🧭', title: 'スタート地点', description: 'レベル診断テストを完了', target: 1, current: (i) => (i.hasDiagnosed ? 1 : 0) },
  { id: 'dq-streak-3', icon: '📅', title: 'デイリー3日', description: 'デイリークイズ3日連続', target: 3, current: (i) => i.dailyQuizStreak },
  { id: 'dq-streak-7', icon: '🗓️', title: 'デイリー皆勤', description: 'デイリークイズ7日連続', target: 7, current: (i) => i.dailyQuizStreak },
  {
    id: 'typing-perfect',
    icon: '⌨️',
    title: '完璧タイピング',
    description: 'タイピングで正確率100%達成',
    target: 100,
    current: (i) => i.typingBestPct,
    gate: (i) => i.typingPlays >= 1,
  },
];

export function evaluateAchievements(input: AchievementInput): Achievement[] {
  return DEFS.map((d) => {
    const current = d.current(input);
    const meetsTarget = current >= d.target;
    const unlocked = meetsTarget && (d.gate ? d.gate(input) : true);
    return {
      id: d.id,
      icon: d.icon,
      title: d.title,
      description: d.description,
      unlocked,
      progress: { current: Math.min(current, d.target), target: d.target },
    };
  });
}

export function countUnlocked(achievements: Achievement[]): number {
  return achievements.filter((a) => a.unlocked).length;
}
