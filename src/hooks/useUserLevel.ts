import { useState, useCallback, useEffect } from 'react';

// --- CEFR Level System ---

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface LevelInfo {
  level: CEFRLevel;
  label: string;
  labelJa: string;
  description: string;
  toeicMin: number;
  toeicMax: number;
  color: string;
}

export const LEVEL_INFO: Record<CEFRLevel, LevelInfo> = {
  A1: {
    level: 'A1',
    label: 'Beginner',
    labelJa: '入門',
    description: '基本的な表現や自己紹介ができる',
    toeicMin: 120,
    toeicMax: 220,
    color: 'emerald',
  },
  A2: {
    level: 'A2',
    label: 'Elementary',
    labelJa: '初級',
    description: '日常的な表現や簡単なやり取りができる',
    toeicMin: 225,
    toeicMax: 545,
    color: 'blue',
  },
  B1: {
    level: 'B1',
    label: 'Intermediate',
    labelJa: '中級',
    description: '日常の話題について意見を述べられる',
    toeicMin: 550,
    toeicMax: 785,
    color: 'amber',
  },
  B2: {
    level: 'B2',
    label: 'Upper Intermediate',
    labelJa: '中上級',
    description: '複雑な話題でも流暢にコミュニケーションできる',
    toeicMin: 785,
    toeicMax: 940,
    color: 'purple',
  },
  C1: {
    level: 'C1',
    label: 'Advanced',
    labelJa: '上級',
    description: '高度な内容を正確に理解し表現できる',
    toeicMin: 945,
    toeicMax: 990,
    color: 'rose',
  },
};

export const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export function getLevelIndex(level: CEFRLevel): number {
  return CEFR_ORDER.indexOf(level);
}

export function isLevelAtLeast(userLevel: CEFRLevel, requiredLevel: CEFRLevel): boolean {
  return getLevelIndex(userLevel) >= getLevelIndex(requiredLevel);
}

/** Map beginner/intermediate/advanced to CEFR */
export function mapContentLevel(level: 'beginner' | 'intermediate' | 'advanced'): CEFRLevel {
  switch (level) {
    case 'beginner': return 'A2';
    case 'intermediate': return 'B1';
    case 'advanced': return 'B2';
  }
}

/** Estimate TOEIC score from CEFR level */
export function estimateToeicFromLevel(level: CEFRLevel): { min: number; max: number; mid: number } {
  const info = LEVEL_INFO[level];
  return {
    min: info.toeicMin,
    max: info.toeicMax,
    mid: Math.round((info.toeicMin + info.toeicMax) / 2),
  };
}

// --- User Level Data ---

export interface UserLevelData {
  level: CEFRLevel;
  diagnosedAt: number | null; // timestamp of diagnostic test
  levelHistory: { level: CEFRLevel; date: string; source: 'diagnostic' | 'auto' }[];
}

const STORAGE_KEY = 'english-learn-user-level';

function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function createDefault(): UserLevelData {
  return {
    level: 'A1',
    diagnosedAt: null,
    levelHistory: [],
  };
}

function load(): UserLevelData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefault();
    const parsed = JSON.parse(raw);
    return {
      level: CEFR_ORDER.includes(parsed.level) ? parsed.level : 'A1',
      diagnosedAt: typeof parsed.diagnosedAt === 'number' ? parsed.diagnosedAt : null,
      levelHistory: Array.isArray(parsed.levelHistory) ? parsed.levelHistory : [],
    };
  } catch {
    return createDefault();
  }
}

function save(data: UserLevelData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

// --- Hook ---

export function useUserLevel() {
  const [data, setData] = useState<UserLevelData>(load);

  useEffect(() => {
    save(data);
  }, [data]);

  const setLevel = useCallback((level: CEFRLevel, source: 'diagnostic' | 'auto' = 'diagnostic') => {
    setData((prev) => ({
      ...prev,
      level,
      diagnosedAt: source === 'diagnostic' ? Date.now() : prev.diagnosedAt,
      levelHistory: [
        ...prev.levelHistory,
        { level, date: getToday(), source },
      ],
    }));
  }, []);

  const hasDiagnosed = data.diagnosedAt !== null;

  const levelInfo = LEVEL_INFO[data.level];

  const getNextLevel = useCallback((): CEFRLevel | null => {
    const idx = getLevelIndex(data.level);
    return idx < CEFR_ORDER.length - 1 ? CEFR_ORDER[idx + 1] : null;
  }, [data.level]);

  const checkLevelUp = useCallback((accuracy: number): CEFRLevel | null => {
    // If accuracy is consistently high, suggest level up
    if (accuracy >= 85) {
      const next = getNextLevel();
      return next;
    }
    return null;
  }, [getNextLevel]);

  return {
    level: data.level,
    levelInfo,
    hasDiagnosed,
    diagnosedAt: data.diagnosedAt,
    levelHistory: data.levelHistory,
    setLevel,
    getNextLevel,
    checkLevelUp,
  };
}
