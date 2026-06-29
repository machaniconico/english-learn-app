import { describe, it, expect } from 'vitest';
import {
  emptyTypingRecord,
  isNewTypingBest,
  recordTypingAttempt,
  recentAccuracyAverage,
  accuracyTrend,
  TYPING_HISTORY_LIMIT,
  type TypingAttempt,
  type TypingRecord,
} from './typingRecords';

function attempt(pct: number, timestamp = 1000): TypingAttempt {
  return { pct, correct: pct, total: 100, timestamp };
}

describe('emptyTypingRecord', () => {
  it('starts at zero with empty history', () => {
    expect(emptyTypingRecord()).toEqual({ bestPct: 0, plays: 0, history: [] });
  });

  it('returns a fresh object each call', () => {
    const a = emptyTypingRecord();
    const b = emptyTypingRecord();
    expect(a).not.toBe(b);
    expect(a.history).not.toBe(b.history);
  });
});

describe('isNewTypingBest', () => {
  it('is true when pct beats the previous best', () => {
    expect(isNewTypingBest({ bestPct: 50, plays: 1, history: [] }, 60)).toBe(true);
  });

  it('is false when pct equals the previous best', () => {
    expect(isNewTypingBest({ bestPct: 80, plays: 1, history: [] }, 80)).toBe(false);
  });

  it('is false when pct is below the previous best', () => {
    expect(isNewTypingBest({ bestPct: 80, plays: 1, history: [] }, 40)).toBe(false);
  });

  it('is true on the first play (best 0) for any pct > 0', () => {
    expect(isNewTypingBest(emptyTypingRecord(), 1)).toBe(true);
    expect(isNewTypingBest(emptyTypingRecord(), 100)).toBe(true);
  });

  it('is false for pct 0 even on the first play', () => {
    expect(isNewTypingBest(emptyTypingRecord(), 0)).toBe(false);
  });
});

describe('recordTypingAttempt', () => {
  it('raises bestPct only when the attempt beats it', () => {
    const r1 = recordTypingAttempt(emptyTypingRecord(), attempt(70));
    expect(r1.bestPct).toBe(70);
    const r2 = recordTypingAttempt(r1, attempt(50));
    expect(r2.bestPct).toBe(70); // not lowered
    const r3 = recordTypingAttempt(r2, attempt(90));
    expect(r3.bestPct).toBe(90);
  });

  it('increments plays each time', () => {
    let r: TypingRecord = emptyTypingRecord();
    r = recordTypingAttempt(r, attempt(10));
    r = recordTypingAttempt(r, attempt(20));
    r = recordTypingAttempt(r, attempt(30));
    expect(r.plays).toBe(3);
  });

  it('prepends the new attempt to history (newest first)', () => {
    let r: TypingRecord = emptyTypingRecord();
    r = recordTypingAttempt(r, attempt(10, 1));
    r = recordTypingAttempt(r, attempt(20, 2));
    expect(r.history[0].timestamp).toBe(2);
    expect(r.history[1].timestamp).toBe(1);
  });

  it('caps history at TYPING_HISTORY_LIMIT, dropping the oldest', () => {
    let r: TypingRecord = emptyTypingRecord();
    for (let i = 1; i <= TYPING_HISTORY_LIMIT + 5; i++) {
      r = recordTypingAttempt(r, attempt(i, i));
    }
    expect(r.history).toHaveLength(TYPING_HISTORY_LIMIT);
    // newest is the last one added
    expect(r.history[0].timestamp).toBe(TYPING_HISTORY_LIMIT + 5);
    // oldest retained is timestamp 6 (1..5 dropped)
    expect(r.history[TYPING_HISTORY_LIMIT - 1].timestamp).toBe(6);
    // plays keeps counting beyond the history cap
    expect(r.plays).toBe(TYPING_HISTORY_LIMIT + 5);
  });

  it('does not mutate the previous record', () => {
    const prev = emptyTypingRecord();
    const frozenHistory = prev.history;
    const next = recordTypingAttempt(prev, attempt(55));
    expect(prev.bestPct).toBe(0);
    expect(prev.plays).toBe(0);
    expect(prev.history).toBe(frozenHistory);
    expect(prev.history).toHaveLength(0);
    expect(next).not.toBe(prev);
  });

  it('is deterministic and does not generate its own timestamp', () => {
    const a = attempt(42, 12345);
    const r = recordTypingAttempt(emptyTypingRecord(), a);
    expect(r.history[0].timestamp).toBe(12345);
  });
});

function recordWith(pcts: number[]): TypingRecord {
  // history は新しい順。pcts も新しい順で渡す。
  return { bestPct: Math.max(0, ...pcts), plays: pcts.length, history: pcts.map((p) => attempt(p)) };
}

describe('recentAccuracyAverage', () => {
  it('履歴が無ければ 0', () => {
    expect(recentAccuracyAverage(emptyTypingRecord())).toBe(0);
  });

  it('直近の平均を四捨五入で返す', () => {
    expect(recentAccuracyAverage(recordWith([80, 90, 70]))).toBe(80); // (80+90+70)/3=80
    expect(recentAccuracyAverage(recordWith([81, 90, 70]))).toBe(80); // 241/3=80.33→80
    expect(recentAccuracyAverage(recordWith([82, 90, 70]))).toBe(81); // 242/3=80.67→81
  });

  it('limit で直近 N 件に絞る', () => {
    // 新しい順 [100, 0, 0] のうち直近1件だけ → 100
    expect(recentAccuracyAverage(recordWith([100, 0, 0]), 1)).toBe(100);
  });
});

describe('accuracyTrend', () => {
  it('履歴が2件未満なら 0', () => {
    expect(accuracyTrend(emptyTypingRecord())).toBe(0);
    expect(accuracyTrend(recordWith([75]))).toBe(0);
  });

  it('最新 - 最古 を返す(正なら上達)', () => {
    // 新しい順 [90, ..., 70] → 90 - 70 = 20
    expect(accuracyTrend(recordWith([90, 80, 70]))).toBe(20);
  });

  it('低下は負の値', () => {
    // 新しい順 [60, 70, 85] → 60 - 85 = -25
    expect(accuracyTrend(recordWith([60, 70, 85]))).toBe(-25);
  });
});
