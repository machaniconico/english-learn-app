import { describe, it, expect } from 'vitest';
import {
  getDailyQuizDate,
  getDailyQuizHistory,
  computeDailyQuizStreak,
  getDailyQuizSummary,
  recommendDifficulty,
} from './dailyQuizStats';
import type { QuizResult } from '../hooks/useAccuracy';

/** daily-quiz の結果を簡単に作るヘルパー。 */
function daily(
  date: string,
  score: number,
  total = 10,
  level = 'beginner',
  count = 10,
  timestamp = 0,
): QuizResult {
  return {
    type: 'daily-quiz',
    setId: `daily-quiz-${date}-${level}-${count}`,
    score,
    total,
    correct: score,
    level,
    timestamp,
  };
}

describe('getDailyQuizDate', () => {
  it('正常な setId から日付を抽出する', () => {
    expect(getDailyQuizDate({ setId: 'daily-quiz-2026-06-24-beginner-10', timestamp: 0 })).toBe(
      '2026-06-24',
    );
    expect(getDailyQuizDate({ setId: 'daily-quiz-2026-01-02-mixed-20', timestamp: 0 })).toBe(
      '2026-01-02',
    );
  });

  it('daily-quiz でない setId は null', () => {
    expect(getDailyQuizDate({ setId: 'fill-in-blank-set-3', timestamp: 0 })).toBeNull();
    expect(getDailyQuizDate({ setId: 'daily-quiz-2026-6-4-beginner-10', timestamp: 0 })).toBeNull();
    expect(getDailyQuizDate({ setId: 'daily-quiz-foo', timestamp: 0 })).toBeNull();
    expect(getDailyQuizDate({ setId: '', timestamp: 0 })).toBeNull();
  });
});

describe('getDailyQuizHistory', () => {
  it('同日複数試行はその日の最高 pct を採用する', () => {
    const results = [
      daily('2026-06-24', 4), // 40%
      daily('2026-06-24', 9), // 90% ← 採用
      daily('2026-06-24', 7), // 70%
    ];
    const history = getDailyQuizHistory(results, 5);
    expect(history).toHaveLength(1);
    expect(history[0].pct).toBe(90);
    expect(history[0].score).toBe(9);
    expect(history[0].total).toBe(10);
    expect(history[0].level).toBe('beginner');
  });

  it('日付の新しい順に並ぶ', () => {
    const results = [
      daily('2026-06-20', 5),
      daily('2026-06-24', 6),
      daily('2026-06-22', 7),
    ];
    const history = getDailyQuizHistory(results, 5);
    expect(history.map((h) => h.date)).toEqual(['2026-06-24', '2026-06-22', '2026-06-20']);
  });

  it('limitDays 件に制限される', () => {
    const results = [
      daily('2026-06-20', 5),
      daily('2026-06-21', 5),
      daily('2026-06-22', 5),
      daily('2026-06-23', 5),
      daily('2026-06-24', 5),
    ];
    const history = getDailyQuizHistory(results, 3);
    expect(history).toHaveLength(3);
    expect(history.map((h) => h.date)).toEqual(['2026-06-24', '2026-06-23', '2026-06-22']);
  });

  it('daily-quiz 以外は除外される', () => {
    const other: QuizResult = {
      type: 'fill-in-blank',
      setId: 'fill-in-blank-1',
      score: 10,
      total: 10,
      correct: 10,
      timestamp: 0,
    };
    const results = [other, daily('2026-06-24', 8)];
    const history = getDailyQuizHistory(results, 5);
    expect(history).toHaveLength(1);
    expect(history[0].date).toBe('2026-06-24');
  });

  it('total=0 の試行は pct=0 として扱う', () => {
    const results = [daily('2026-06-24', 0, 0)];
    const history = getDailyQuizHistory(results, 5);
    expect(history[0].pct).toBe(0);
  });
});

describe('computeDailyQuizStreak', () => {
  const today = '2026-06-24';

  it('today を含む連続3日で 3', () => {
    const results = [
      daily('2026-06-22', 5),
      daily('2026-06-23', 5),
      daily('2026-06-24', 5),
    ];
    expect(computeDailyQuizStreak(results, today)).toBe(3);
  });

  it('today 当日のみで 1', () => {
    expect(computeDailyQuizStreak([daily('2026-06-24', 5)], today)).toBe(1);
  });

  it('today に無く昨日に有れば昨日起点で継続中', () => {
    const results = [
      daily('2026-06-22', 5),
      daily('2026-06-23', 5), // 昨日まで連続2日
    ];
    expect(computeDailyQuizStreak(results, today)).toBe(2);
  });

  it('間が空いたら途切れる(直近の連続のみ数える)', () => {
    const results = [
      daily('2026-06-19', 5),
      daily('2026-06-20', 5),
      // 21,22 が空く
      daily('2026-06-23', 5),
      daily('2026-06-24', 5),
    ];
    expect(computeDailyQuizStreak(results, today)).toBe(2);
  });

  it('today も昨日も達成が無ければ 0(過去にあっても継続なし)', () => {
    const results = [daily('2026-06-20', 5), daily('2026-06-21', 5)];
    expect(computeDailyQuizStreak(results, today)).toBe(0);
  });

  it('達成が無ければ 0', () => {
    expect(computeDailyQuizStreak([], today)).toBe(0);
  });

  it('同日複数試行は1日として数える', () => {
    const results = [
      daily('2026-06-23', 5),
      daily('2026-06-24', 4),
      daily('2026-06-24', 9),
    ];
    expect(computeDailyQuizStreak(results, today)).toBe(2);
  });
});

describe('getDailyQuizSummary', () => {
  const today = '2026-06-24';

  it('streak / daysPlayed / bestPct / history を集約する', () => {
    const results = [
      daily('2026-06-22', 6), // 60%
      daily('2026-06-23', 9), // 90%
      daily('2026-06-24', 4), // 40%
      daily('2026-06-24', 7), // 70%(同日最高)
    ];
    const summary = getDailyQuizSummary(results, today, 5);
    expect(summary.streak).toBe(3);
    expect(summary.daysPlayed).toBe(3);
    expect(summary.bestPct).toBe(90);
    expect(summary.history).toHaveLength(3);
    expect(summary.history[0].date).toBe('2026-06-24');
    expect(summary.history[0].pct).toBe(70);
  });

  it('bestPct は履歴の limitDays に依らず全達成日の最高を取る', () => {
    const results = [
      daily('2026-06-20', 10), // 100% ← 全体最高だが limit からは外れる
      daily('2026-06-22', 5),
      daily('2026-06-23', 5),
      daily('2026-06-24', 5),
    ];
    const summary = getDailyQuizSummary(results, today, 2);
    expect(summary.history).toHaveLength(2);
    expect(summary.bestPct).toBe(100);
  });

  it('空入力では全て 0 / 空配列', () => {
    const summary = getDailyQuizSummary([], today, 5);
    expect(summary).toEqual({ streak: 0, daysPlayed: 0, bestPct: 0, history: [] });
  });

  it('入力 results を破壊しない', () => {
    const results = [daily('2026-06-24', 7), daily('2026-06-23', 5)];
    const snapshot = JSON.parse(JSON.stringify(results));
    getDailyQuizSummary(results, today, 5);
    expect(results).toEqual(snapshot);
  });
});

describe('recommendDifficulty', () => {
  it('中級で直近平均>=85% なら上級を提案する(up)', () => {
    const results = [
      daily('2026-06-22', 9, 10, 'intermediate', 10, 1), // 90%
      daily('2026-06-23', 9, 10, 'intermediate', 10, 2), // 90%
      daily('2026-06-24', 8, 10, 'intermediate', 10, 3), // 80%  平均 86.6→87
    ];
    const rec = recommendDifficulty(results);
    expect(rec).not.toBeNull();
    expect(rec!.direction).toBe('up');
    expect(rec!.suggested).toBe('advanced');
    expect(rec!.basedOn).toBe('intermediate');
    expect(rec!.avgPct).toBe(87);
    expect(rec!.attempts).toBe(3);
  });

  it('上級で平均>=85% でも端なので提案しない(null)', () => {
    const results = [
      daily('2026-06-23', 10, 10, 'advanced', 10, 1), // 100%
      daily('2026-06-24', 9, 10, 'advanced', 10, 2), // 90%
    ];
    expect(recommendDifficulty(results)).toBeNull();
  });

  it('中級で平均<50% なら初級を提案する(down)', () => {
    const results = [
      daily('2026-06-23', 4, 10, 'intermediate', 10, 1), // 40%
      daily('2026-06-24', 3, 10, 'intermediate', 10, 2), // 30%  平均 35
    ];
    const rec = recommendDifficulty(results);
    expect(rec).not.toBeNull();
    expect(rec!.direction).toBe('down');
    expect(rec!.suggested).toBe('beginner');
    expect(rec!.basedOn).toBe('intermediate');
    expect(rec!.avgPct).toBe(35);
  });

  it('初級で平均<50% でも端なので提案しない(null)', () => {
    const results = [
      daily('2026-06-23', 3, 10, 'beginner', 10, 1), // 30%
      daily('2026-06-24', 2, 10, 'beginner', 10, 2), // 20%
    ];
    expect(recommendDifficulty(results)).toBeNull();
  });

  it('中級でちょうど良い成績(50<=avg<85)なら提案しない(null)', () => {
    const results = [
      daily('2026-06-23', 7, 10, 'intermediate', 10, 1), // 70%
      daily('2026-06-24', 6, 10, 'intermediate', 10, 2), // 60%  平均 65
    ];
    expect(recommendDifficulty(results)).toBeNull();
  });

  it('attempts < minAttempts(既定2)なら提案しない(null)', () => {
    const results = [daily('2026-06-24', 10, 10, 'intermediate', 10, 1)]; // 1件のみ
    expect(recommendDifficulty(results)).toBeNull();
  });

  it('データが無ければ null', () => {
    expect(recommendDifficulty([])).toBeNull();
  });

  it('mixed の結果は判定対象外(mixed だけなら null)', () => {
    const results = [
      daily('2026-06-23', 10, 10, 'mixed', 10, 1),
      daily('2026-06-24', 10, 10, 'mixed', 10, 2),
    ];
    expect(recommendDifficulty(results)).toBeNull();
  });

  it('mixed が混在しても具体難易度のみで判定する', () => {
    const results = [
      daily('2026-06-21', 0, 10, 'mixed', 10, 1), // 除外
      daily('2026-06-22', 9, 10, 'intermediate', 10, 2), // 90%
      daily('2026-06-23', 0, 10, 'mixed', 10, 3), // 除外(timestamp 最大でも mixed は無視)
      daily('2026-06-24', 9, 10, 'intermediate', 10, 4), // 90%
    ];
    const rec = recommendDifficulty(results);
    expect(rec).not.toBeNull();
    expect(rec!.basedOn).toBe('intermediate');
    expect(rec!.direction).toBe('up');
    expect(rec!.avgPct).toBe(90);
    expect(rec!.attempts).toBe(2);
  });

  it('現在レベルは最新試行の level で決まる(レベルを跨いだ履歴で最新が中級なら中級基準)', () => {
    const results = [
      daily('2026-06-20', 2, 10, 'advanced', 10, 1), // 上級(古い)
      daily('2026-06-23', 9, 10, 'intermediate', 10, 2), // 中級 90%
      daily('2026-06-24', 8, 10, 'intermediate', 10, 3), // 中級 80%(最新)
    ];
    const rec = recommendDifficulty(results);
    expect(rec).not.toBeNull();
    expect(rec!.basedOn).toBe('intermediate');
    expect(rec!.direction).toBe('up');
    expect(rec!.avgPct).toBe(85); // (90+80)/2
    expect(rec!.attempts).toBe(2);
  });

  it('平均は直近 window 件(既定3)のみで計算する', () => {
    const results = [
      daily('2026-06-20', 0, 10, 'intermediate', 10, 1), // 0% 古い→除外される
      daily('2026-06-22', 9, 10, 'intermediate', 10, 2), // 90%
      daily('2026-06-23', 9, 10, 'intermediate', 10, 3), // 90%
      daily('2026-06-24', 9, 10, 'intermediate', 10, 4), // 90%
    ];
    const rec = recommendDifficulty(results);
    expect(rec).not.toBeNull();
    expect(rec!.avgPct).toBe(90); // 直近3件のみ→90、古い0%は含まない
    expect(rec!.attempts).toBe(3);
  });

  it('閾値はオプションで上書きできる', () => {
    const results = [
      daily('2026-06-23', 7, 10, 'beginner', 10, 1), // 70%
      daily('2026-06-24', 8, 10, 'beginner', 10, 2), // 80%  平均 75
    ];
    const rec = recommendDifficulty(results, { upThreshold: 70 });
    expect(rec).not.toBeNull();
    expect(rec!.direction).toBe('up');
    expect(rec!.suggested).toBe('intermediate');
  });

  it('入力 results を破壊しない', () => {
    const results = [
      daily('2026-06-23', 9, 10, 'intermediate', 10, 1),
      daily('2026-06-24', 9, 10, 'intermediate', 10, 2),
    ];
    const snapshot = JSON.parse(JSON.stringify(results));
    recommendDifficulty(results);
    expect(results).toEqual(snapshot);
  });
});
