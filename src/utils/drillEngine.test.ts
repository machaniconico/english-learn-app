import { describe, expect, it } from 'vitest';
import { DRILL_GENRES } from './drillTypes';
import type { DrillDifficulty, DrillGenre, DrillQuestion } from './drillTypes';
import {
  DRILL_RECENT_CAP,
  orderedWeakGenres,
  pickNextQuestion,
  pickRandomGenre,
  pickWeakGenre,
  pushRecent,
  sortGenresByWeakness,
  type DrillGenreStats,
} from './drillEngine';

function makeQuestion(
  id: string,
  genre: DrillGenre = 'vocab',
  difficulty: DrillDifficulty = 'beginner',
): DrillQuestion {
  return {
    id,
    genre,
    difficulty,
    prompt: `問題 ${id}`,
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 0,
    explanation: `解説 ${id}`,
  };
}

describe('pickNextQuestion', () => {
  it('recentIds に含まれる問題を避けて候補から選ぶ', () => {
    const pool = [makeQuestion('a'), makeQuestion('b'), makeQuestion('c')];

    const picked = pickNextQuestion(pool, ['a'], () => 0.75);

    expect(picked?.id).toBe('c');
  });

  it('除外後の候補が1問だけならその問題を返す', () => {
    const pool = [makeQuestion('a'), makeQuestion('b'), makeQuestion('c')];

    const picked = pickNextQuestion(pool, ['a', 'c'], () => 0);

    expect(picked?.id).toBe('b');
  });

  it('プール一巡後は全体から選び直して出題を継続する', () => {
    const pool = [makeQuestion('a'), makeQuestion('b'), makeQuestion('c')];

    const picked = pickNextQuestion(pool, ['a', 'b', 'c'], () => 0.6);

    expect(picked?.id).toBe('b');
  });

  it('空プールなら null を返す', () => {
    expect(pickNextQuestion([], ['a'], () => 0)).toBeNull();
  });
});

describe('pushRecent', () => {
  it('末尾に id を追加し、cap 超過分を先頭から落とす', () => {
    expect(pushRecent(['a', 'b', 'c'], 'd', 3)).toEqual(['b', 'c', 'd']);
  });

  it('入力配列を破壊しない', () => {
    const recent = ['a', 'b'];

    const next = pushRecent(recent, 'c', 3);

    expect(next).toEqual(['a', 'b', 'c']);
    expect(next).not.toBe(recent);
    expect(recent).toEqual(['a', 'b']);
  });

  it('既定 cap は DRILL_RECENT_CAP 件に履歴を抑える', () => {
    const recent = Array.from({ length: DRILL_RECENT_CAP }, (_, index) => `q-${index}`);

    const next = pushRecent(recent, 'latest');

    expect(next).toHaveLength(DRILL_RECENT_CAP);
    expect(next[0]).toBe('q-1');
    expect(next.at(-1)).toBe('latest');
  });
});

describe('pickRandomGenre', () => {
  it('DRILL_GENRES の並びから乱数位置に対応するジャンルを返す', () => {
    const values = DRILL_GENRES.map((genre) => genre.value);

    for (let index = 0; index < values.length; index++) {
      const rand = () => (index + 0.01) / values.length;
      expect(pickRandomGenre(rand)).toBe(values[index]);
    }
  });

  it('乱数が上限境界に近くても最後のジャンルに丸める', () => {
    expect(pickRandomGenre(() => 1)).toBe(DRILL_GENRES.at(-1)?.value);
  });
});

describe('pickWeakGenre', () => {
  const byGenre: DrillGenreStats = {
    'fill-blank': { answered: 20, correct: 0 },
    vocab: { answered: 20, correct: 10 },
    'ja-en': { answered: 0, correct: 0 },
    'en-ja': { answered: 20, correct: 20 },
    listening: { answered: 10, correct: 8 },
  };

  it('ラプラス平滑化した誤答率が最も高いジャンルを最も高頻度で選ぶ', () => {
    const counts = Object.fromEntries(
      DRILL_GENRES.map(({ value }) => [value, 0]),
    ) as Record<DrillGenre, number>;

    for (let index = 0; index < 1000; index++) {
      const picked = pickWeakGenre(byGenre, () => (index + 0.5) / 1000);
      counts[picked] += 1;
    }

    expect(counts['fill-blank']).toBeGreaterThan(counts.vocab);
    expect(counts['fill-blank']).toBeGreaterThan(counts['ja-en']);
    expect(counts['fill-blank']).toBeGreaterThan(counts['en-ja']);
    expect(counts['fill-blank']).toBeGreaterThan(counts.listening);
  });

  it('未回答ジャンルと全問正解ジャンルにも出題機会を残す', () => {
    const counts = Object.fromEntries(
      DRILL_GENRES.map(({ value }) => [value, 0]),
    ) as Record<DrillGenre, number>;

    for (let index = 0; index < 1000; index++) {
      const picked = pickWeakGenre(byGenre, () => (index + 0.5) / 1000);
      counts[picked] += 1;
    }

    expect(counts['ja-en']).toBeGreaterThan(0);
    expect(counts['en-ja']).toBeGreaterThan(0);
  });

  it('苦手優先の fallback は先頭を重み付き抽選し、残りを苦手順に並べる', () => {
    const sorted = sortGenresByWeakness(byGenre);
    const ordered = orderedWeakGenres(byGenre, () => 0.75);

    expect(ordered[0]).toBe('ja-en');
    expect(ordered.slice(1)).toEqual(sorted.filter((genre) => genre !== 'ja-en'));
  });
});
