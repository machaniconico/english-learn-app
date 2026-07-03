import { describe, expect, it } from 'vitest';
import { DRILL_DIFFICULTIES, DRILL_GENRES } from './drillTypes';
import type { DrillDifficulty, DrillGenre, DrillQuestion } from './drillTypes';
import { buildDrillPool } from './drillQuestionBank';
import {
  DRILL_RECENT_CAP,
  WEAK_DIFFICULTY_MIN_SAMPLES,
  orderedGenres,
  orderedWeakGenres,
  pickNextQuestion,
  pickRandomGenre,
  pickWeakGenre,
  projectGenreStatsForDifficulty,
  pushRecent,
  resolveNextQuestion,
  sortGenresByWeakness,
  type DrillGenreDifficultyStats,
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

function makeGenreStats(overrides: Partial<DrillGenreStats> = {}): DrillGenreStats {
  return {
    'fill-blank': { answered: 0, correct: 0 },
    vocab: { answered: 0, correct: 0 },
    'ja-en': { answered: 0, correct: 0 },
    'en-ja': { answered: 0, correct: 0 },
    listening: { answered: 0, correct: 0 },
    ...overrides,
  };
}

function makeGenreDifficultyStats(
  overrides: Partial<
    Record<DrillGenre, Partial<Record<DrillDifficulty, DrillGenreStats[DrillGenre]>>>
  > = {},
): DrillGenreDifficultyStats {
  const stats = {} as DrillGenreDifficultyStats;

  for (const { value: genre } of DRILL_GENRES) {
    const byDifficulty = {} as DrillGenreDifficultyStats[DrillGenre];
    for (const { value: difficulty } of DRILL_DIFFICULTIES) {
      const totals = overrides[genre]?.[difficulty] ?? { answered: 0, correct: 0 };
      byDifficulty[difficulty] = { answered: totals.answered, correct: totals.correct };
    }
    stats[genre] = byDifficulty;
  }

  return stats;
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

describe('orderedGenres', () => {
  it('単一ジャンル選択ならそのジャンルだけを返す', () => {
    expect(
      orderedGenres('listening', 'beginner', makeGenreStats(), makeGenreDifficultyStats(), () => 0),
    ).toEqual(['listening']);
  });

  it('random は抽選ジャンルを先頭にし、残りの全ジャンルを重複なく並べる', () => {
    const rand = () => 0.25;
    const ordered = orderedGenres(
      'random',
      'beginner',
      makeGenreStats(),
      makeGenreDifficultyStats(),
      rand,
    );
    const allGenres = DRILL_GENRES.map((genre) => genre.value);

    expect(ordered[0]).toBe(pickRandomGenre(rand));
    expect(ordered).toHaveLength(allGenres.length);
    expect(new Set(ordered)).toEqual(new Set(allGenres));
  });

  it('weak は orderedWeakGenres と同じ苦手優先順を返す', () => {
    const byGenre = makeGenreStats({
      'fill-blank': { answered: 20, correct: 0 },
      vocab: { answered: 20, correct: 10 },
      'ja-en': { answered: 20, correct: 15 },
      'en-ja': { answered: 20, correct: 20 },
      listening: { answered: 0, correct: 0 },
    });
    const rand = () => 0;

    const ordered = orderedGenres('weak', 'beginner', byGenre, makeGenreDifficultyStats(), rand);

    expect(ordered).toEqual(orderedWeakGenres(byGenre, rand));
    expect(ordered[0]).toBe('fill-blank');
  });

  it('weak は難易度スライスが閾値以上なら選択中難易度の苦手順を使う', () => {
    const byGenre = makeGenreStats({
      'fill-blank': { answered: 40, correct: 0 },
      vocab: { answered: 20, correct: 20 },
      'ja-en': { answered: 20, correct: 20 },
      'en-ja': { answered: 20, correct: 18 },
      listening: { answered: 0, correct: 0 },
    });
    const byGenreDifficulty = makeGenreDifficultyStats({
      'fill-blank': { beginner: { answered: 20, correct: 20 } },
      vocab: { beginner: { answered: 20, correct: 20 } },
      'ja-en': { beginner: { answered: 20, correct: 0 } },
      'en-ja': { beginner: { answered: 20, correct: 18 } },
    });
    const rand = () => 0.35;

    const ordered = orderedGenres('weak', 'beginner', byGenre, byGenreDifficulty, rand);

    expect(ordered).toEqual(['ja-en', 'listening', 'en-ja', 'fill-blank', 'vocab']);
    expect(ordered).not.toEqual(orderedWeakGenres(byGenre, rand));
  });

  it('weak は難易度スライスが閾値未満なら全体 byGenre にフォールバックする', () => {
    const byGenre = makeGenreStats({
      'fill-blank': { answered: 40, correct: 0 },
      vocab: { answered: 20, correct: 20 },
      'ja-en': { answered: 20, correct: 20 },
      'en-ja': { answered: 20, correct: 18 },
      listening: { answered: 0, correct: 0 },
    });
    const byGenreDifficulty = makeGenreDifficultyStats({
      'ja-en': {
        beginner: { answered: WEAK_DIFFICULTY_MIN_SAMPLES - 1, correct: 0 },
      },
    });
    const rand = () => 0.35;

    const ordered = orderedGenres('weak', 'beginner', byGenre, byGenreDifficulty, rand);

    expect(ordered).toEqual(orderedWeakGenres(byGenre, rand));
    expect(ordered[0]).toBe('fill-blank');
  });
});

describe('projectGenreStatsForDifficulty', () => {
  it('指定難易度の genre×difficulty セルを genre→totals に射影する', () => {
    const byGenreDifficulty = makeGenreDifficultyStats({
      vocab: {
        beginner: { answered: 3, correct: 2 },
        advanced: { answered: 10, correct: 10 },
      },
      listening: {
        beginner: { answered: 4, correct: 1 },
      },
    });

    const projected = projectGenreStatsForDifficulty(byGenreDifficulty, 'beginner');

    expect(projected).toEqual(
      makeGenreStats({
        vocab: { answered: 3, correct: 2 },
        listening: { answered: 4, correct: 1 },
      }),
    );
  });
});

describe('resolveNextQuestion', () => {
  it('決定的乱数で単一ジャンル・難易度の問題を返し、recent に id を追加する', () => {
    const recentIds = ['already-seen'];
    const expectedQuestion = buildDrillPool('vocab', 'beginner', () => 0)[0];

    const result = resolveNextQuestion(
      'vocab',
      'beginner',
      recentIds,
      makeGenreStats(),
      makeGenreDifficultyStats(),
      () => 0,
    );

    expect(result?.question.id).toBe(expectedQuestion.id);
    expect(result?.question.genre).toBe('vocab');
    expect(result?.question.difficulty).toBe('beginner');
    expect(result?.recent).toEqual([...recentIds, expectedQuestion.id]);
    expect(recentIds).toEqual(['already-seen']);
  });

  it('現行プールがすべて recent 済みでも全体から選び直して継続する', () => {
    const pool = buildDrillPool('vocab', 'beginner', () => 0);
    const recentIds = pool.map((question) => question.id);

    const result = resolveNextQuestion(
      'vocab',
      'beginner',
      recentIds,
      makeGenreStats(),
      makeGenreDifficultyStats(),
      () => 0,
    );

    expect(result?.question.id).toBe(pool[0].id);
    expect(result?.recent).toEqual([...recentIds, pool[0].id]);
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
