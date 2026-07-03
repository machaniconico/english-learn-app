// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  scheduleSRSCard,
  sortDueCardsByUrgency,
  useSpacedRepetition,
  type SRSCard,
} from './useSpacedRepetition';

const TODAY = '2026-06-19';
const STORAGE_KEY = 'english-learn-srs';

function makeCard(overrides: Partial<SRSCard> = {}): SRSCard {
  return {
    id: 'c1',
    english: 'hello',
    japanese: 'こんにちは',
    pronunciation: 'həˈloʊ',
    source: 'test',
    interval: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReview: TODAY,
    lastReview: '',
    ...overrides,
  };
}

// Helper mirroring addDays for assertions (independent of implementation).
// ローカル暦日規約 (実装の toLocalDateStr と同じ) で文字列を組み立てる。
// 旧実装が toISOString().slice(0,10) (UTC 暦日) を使っていた頃はこのヘルパーも
// 同じ UTC 規約だったが、修正に合わせてローカル暦日規約に揃え直した。
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}

describe('useSpacedRepetition storage loading resilience', () => {
  it.each(['null', '{}', '"oops"', '42'])(
    'falls back to empty cards when localStorage contains non-array JSON: %s',
    (raw) => {
      localStorage.setItem(STORAGE_KEY, raw);

      const { result } = renderHook(() => useSpacedRepetition());

      expect(result.current.cards).toEqual([]);
      expect(result.current.getDueCards()).toEqual([]);
      expect(result.current.getStats()).toEqual({
        total: 0,
        due: 0,
        mastered: 0,
        learning: 0,
      });
      expect(result.current.isInSRS('anything')).toBe(false);
    },
  );

  it('filters malformed stored card entries and keeps valid SRS cards', () => {
    const valid = makeCard({ id: 'valid-card' });
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        valid,
        null,
        'oops',
        { id: 'missing-fields' },
        { ...valid, id: 123 },
      ]),
    );

    const { result } = renderHook(() => useSpacedRepetition());

    expect(result.current.cards).toEqual([valid]);
    expect(result.current.getStats().total).toBe(1);
    expect(result.current.isInSRS('valid-card')).toBe(true);
  });
});

describe('scheduleSRSCard (SM-2)', () => {
  describe('failing reviews (quality < 3)', () => {
    it('resets repetitions to 0 and interval to 1 for quality 0', () => {
      const card = makeCard({ interval: 30, repetitions: 5, easeFactor: 2.2 });
      const result = scheduleSRSCard(card, 0, TODAY);
      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    it('resets for quality 1 and 2 as well', () => {
      for (const q of [1, 2] as const) {
        const card = makeCard({ interval: 12, repetitions: 3 });
        const result = scheduleSRSCard(card, q, TODAY);
        expect(result.repetitions).toBe(0);
        expect(result.interval).toBe(1);
      }
    });

    it('does NOT change easeFactor on failure', () => {
      const card = makeCard({ easeFactor: 2.5, interval: 10, repetitions: 4 });
      const result = scheduleSRSCard(card, 1, TODAY);
      expect(result.easeFactor).toBe(2.5);
    });

    it('sets nextReview to today + 1 day on failure', () => {
      const card = makeCard({ interval: 30, repetitions: 5 });
      const result = scheduleSRSCard(card, 0, TODAY);
      expect(result.nextReview).toBe(addDays(TODAY, 1));
      expect(result.lastReview).toBe(TODAY);
    });
  });

  describe('passing reviews (quality >= 3): interval progression', () => {
    it('first pass (repetitions 0) -> interval 1', () => {
      const card = makeCard({ repetitions: 0, interval: 0 });
      const result = scheduleSRSCard(card, 5, TODAY);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
    });

    it('second pass (repetitions 1) -> interval 6', () => {
      const card = makeCard({ repetitions: 1, interval: 1 });
      const result = scheduleSRSCard(card, 5, TODAY);
      expect(result.interval).toBe(6);
      expect(result.repetitions).toBe(2);
    });

    it('third+ pass -> interval = round(prevInterval * easeFactor)', () => {
      const card = makeCard({ repetitions: 2, interval: 6, easeFactor: 2.5 });
      const result = scheduleSRSCard(card, 5, TODAY);
      // easeFactor for quality 5: 2.5 + (0.1 - 0) = 2.6, but interval is
      // computed from the PREVIOUS easeFactor (2.5) before the update.
      expect(result.interval).toBe(Math.round(6 * 2.5)); // 15
      expect(result.repetitions).toBe(3);
    });

    it('fourth pass uses the updated easeFactor & interval from prior round', () => {
      // Simulate chaining two passes at quality 5.
      let card = makeCard({ repetitions: 2, interval: 6, easeFactor: 2.5 });
      card = scheduleSRSCard(card, 5, TODAY); // interval 15, ef 2.6, reps 3
      expect(card.interval).toBe(15);
      expect(card.easeFactor).toBeCloseTo(2.6, 10);
      const result = scheduleSRSCard(card, 5, TODAY); // round(15 * 2.6) = 39
      expect(result.interval).toBe(Math.round(15 * 2.6)); // 39
      expect(result.repetitions).toBe(4);
    });
  });

  describe('easeFactor update formula', () => {
    it('quality 5 increases easeFactor by 0.1', () => {
      const card = makeCard({ repetitions: 1, easeFactor: 2.5 });
      const result = scheduleSRSCard(card, 5, TODAY);
      // 2.5 + (0.1 - (0)*(...)) = 2.6
      expect(result.easeFactor).toBeCloseTo(2.6, 10);
    });

    it('quality 4 leaves easeFactor unchanged', () => {
      const card = makeCard({ repetitions: 1, easeFactor: 2.5 });
      const result = scheduleSRSCard(card, 4, TODAY);
      // delta = 0.1 - 1*(0.08 + 1*0.02) = 0.1 - 0.1 = 0
      expect(result.easeFactor).toBeCloseTo(2.5, 10);
    });

    it('quality 3 decreases easeFactor', () => {
      const card = makeCard({ repetitions: 1, easeFactor: 2.5 });
      const result = scheduleSRSCard(card, 3, TODAY);
      // delta = 0.1 - 2*(0.08 + 2*0.02) = 0.1 - 2*0.12 = 0.1 - 0.24 = -0.14
      expect(result.easeFactor).toBeCloseTo(2.36, 10);
    });

    it('never drops below the 1.3 floor after repeated low-but-passing reviews', () => {
      let card = makeCard({ repetitions: 5, interval: 20, easeFactor: 1.4 });
      // Each quality-3 review subtracts 0.14 from easeFactor; repeat enough
      // times that the raw value would go well below 1.3.
      for (let i = 0; i < 10; i++) {
        card = scheduleSRSCard(card, 3, TODAY);
        expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
      }
      expect(card.easeFactor).toBe(1.3);
    });

    it('clamps exactly to 1.3 when formula would undershoot', () => {
      const card = makeCard({ repetitions: 2, interval: 6, easeFactor: 1.35 });
      const result = scheduleSRSCard(card, 3, TODAY);
      // 1.35 - 0.14 = 1.21 -> clamped to 1.3
      expect(result.easeFactor).toBe(1.3);
    });
  });

  describe('nextReview / lastReview dates', () => {
    it('nextReview equals today advanced by the new interval', () => {
      const card = makeCard({ repetitions: 1, interval: 1 });
      const result = scheduleSRSCard(card, 5, TODAY);
      expect(result.interval).toBe(6);
      expect(result.nextReview).toBe(addDays(TODAY, 6));
    });

    it('lastReview is set to today', () => {
      const card = makeCard();
      const result = scheduleSRSCard(card, 5, TODAY);
      expect(result.lastReview).toBe(TODAY);
    });

    it('honors a different today value', () => {
      const card = makeCard({ repetitions: 0 });
      const result = scheduleSRSCard(card, 4, '2026-01-01');
      expect(result.interval).toBe(1);
      expect(result.nextReview).toBe(addDays('2026-01-01', 1));
      expect(result.lastReview).toBe('2026-01-01');
    });
  });

  describe('repetitions increment behaviour', () => {
    it('increments repetitions on each pass', () => {
      let card = makeCard({ repetitions: 0 });
      card = scheduleSRSCard(card, 4, TODAY);
      expect(card.repetitions).toBe(1);
      card = scheduleSRSCard(card, 4, TODAY);
      expect(card.repetitions).toBe(2);
      card = scheduleSRSCard(card, 4, TODAY);
      expect(card.repetitions).toBe(3);
    });

    it('preserves non-SRS card fields unchanged', () => {
      const card = makeCard({ repetitions: 1, interval: 1 });
      const result = scheduleSRSCard(card, 5, TODAY);
      expect(result.id).toBe(card.id);
      expect(result.english).toBe(card.english);
      expect(result.japanese).toBe(card.japanese);
      expect(result.pronunciation).toBe(card.pronunciation);
      expect(result.source).toBe(card.source);
    });
  });
});

// ---------------------------------------------------------------------------
// Round 38: 緊急度ソート (sortDueCardsByUrgency / getDueCards の順序保証)
// ---------------------------------------------------------------------------
describe('sortDueCardsByUrgency (Round 38)', () => {
  it('期日が早いカードが先頭に来る (nextReview 昇順)', () => {
    const cards = [
      makeCard({ id: 'late', nextReview: '2026-06-20' }),
      makeCard({ id: 'early', nextReview: '2026-06-10' }),
      makeCard({ id: 'mid', nextReview: '2026-06-15' }),
    ];
    const sorted = sortDueCardsByUrgency(cards, TODAY);
    expect(sorted.map((c) => c.id)).toEqual(['early', 'mid', 'late']);
  });

  it('同一 nextReview なら repetitions が小さいカードが先', () => {
    const cards = [
      makeCard({ id: 'r5', nextReview: '2026-06-15', repetitions: 5 }),
      makeCard({ id: 'r0', nextReview: '2026-06-15', repetitions: 0 }),
      makeCard({ id: 'r2', nextReview: '2026-06-15', repetitions: 2 }),
    ];
    const sorted = sortDueCardsByUrgency(cards, TODAY);
    expect(sorted.map((c) => c.id)).toEqual(['r0', 'r2', 'r5']);
  });

  it('同一 nextReview・同一 repetitions なら easeFactor が小さいカードが先', () => {
    const cards = [
      makeCard({ id: 'ef-high', nextReview: '2026-06-15', repetitions: 1, easeFactor: 2.8 }),
      makeCard({ id: 'ef-low', nextReview: '2026-06-15', repetitions: 1, easeFactor: 1.4 }),
      makeCard({ id: 'ef-mid', nextReview: '2026-06-15', repetitions: 1, easeFactor: 2.0 }),
    ];
    const sorted = sortDueCardsByUrgency(cards, TODAY);
    expect(sorted.map((c) => c.id)).toEqual(['ef-low', 'ef-mid', 'ef-high']);
  });

  it('さらに同一なら interval → id で決定的にタイブレークする', () => {
    const base = { nextReview: '2026-06-15', repetitions: 1, easeFactor: 2.5 };
    // interval で先に分かれるケース
    const byInterval = sortDueCardsByUrgency(
      [
        makeCard({ id: 'i30', ...base, interval: 30 }),
        makeCard({ id: 'i1', ...base, interval: 1 }),
        makeCard({ id: 'i10', ...base, interval: 10 }),
      ],
      TODAY,
    );
    expect(byInterval.map((c) => c.id)).toEqual(['i1', 'i10', 'i30']);

    // interval も同一なら id の localeCompare 昇順
    const byId = sortDueCardsByUrgency(
      [
        makeCard({ id: 'zeta', ...base, interval: 5 }),
        makeCard({ id: 'alpha', ...base, interval: 5 }),
        makeCard({ id: 'mu', ...base, interval: 5 }),
      ],
      TODAY,
    );
    expect(byId.map((c) => c.id)).toEqual(['alpha', 'mu', 'zeta']);
  });

  it('入力配列を破壊しない (元配列の順序が不変・新しい配列を返す)', () => {
    const cards = [
      makeCard({ id: 'b', nextReview: '2026-06-20' }),
      makeCard({ id: 'a', nextReview: '2026-06-10' }),
    ];
    const before = cards.map((c) => c.id);
    const sorted = sortDueCardsByUrgency(cards, TODAY);
    expect(cards.map((c) => c.id)).toEqual(before); // 元配列は不変
    expect(sorted).not.toBe(cards); // 別インスタンス
    expect(sorted.map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('getDueCards() は緊急度順で返す (due 集合は不変・順序のみ変化)', () => {
    vi.useFakeTimers();
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-540);
    vi.setSystemTime(new Date('2026-06-15T03:00:00Z')); // 2026-06-15 12:00 JST

    // localStorage 格納順は緊急度の逆 (期日が遅い順) にしておく。
    const stored: SRSCard[] = [
      {
        id: 'd-late',
        english: 'late',
        japanese: '',
        pronunciation: '',
        source: 'test',
        interval: 5,
        easeFactor: 2.5,
        repetitions: 3,
        nextReview: '2026-06-15',
        lastReview: '',
      },
      {
        id: 'd-early',
        english: 'early',
        japanese: '',
        pronunciation: '',
        source: 'test',
        interval: 5,
        easeFactor: 2.5,
        repetitions: 3,
        nextReview: '2026-06-10',
        lastReview: '',
      },
      {
        // 未 due (将来) → due 集合に含まれない
        id: 'not-due',
        english: 'future',
        japanese: '',
        pronunciation: '',
        source: 'test',
        interval: 5,
        easeFactor: 2.5,
        repetitions: 3,
        nextReview: '2026-06-30',
        lastReview: '',
      },
    ];
    localStorage.setItem('english-learn-srs', JSON.stringify(stored));

    const { result } = renderHook(() => useSpacedRepetition());
    const due = result.current.getDueCards();
    // due 集合は従来通り {d-late, d-early}、順序は期日の早い d-early が先頭。
    expect(due.map((c) => c.id)).toEqual(['d-early', 'd-late']);

    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
  });
});

// ---------------------------------------------------------------------------
// Regression: タイムゾーン由来の UTC/ローカル暦日ずれ (US-002)
// ---------------------------------------------------------------------------
// 旧実装では todayStr()/addDays() が toISOString().slice(0,10) (UTC 暦日) を
// 返していたため、JST (UTC+9) ユーザーが 00:00-09:00 にレビュー/カード追加を
// 行うと lastReview/nextReview が前日スタンプになり、SRS スケジュールが最大
// 1 日ずれるバグがあった。修正後はローカル暦日を返すことを検証する。
// todayStr() は非 export なので addCard が nextReview に stamp する today を
// 経由して観測し、addDays() は scheduleSRSCard の nextReview 経由で観測する。
describe('timezone correctness (US-002)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('todayStr() はローカル暦日を返す (UTC ではない): UTC+9 の早朝に前日ずれしない', () => {
    // JST は UTC+9 → getTimezoneOffset() は -540 を返す
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-540);
    // 2026-06-21 02:00 JST == 2026-06-20 17:00 UTC (UTC 暦日だと前日)
    vi.setSystemTime(new Date('2026-06-20T17:00:00Z'));

    const { result } = renderHook(() => useSpacedRepetition());
    act(() => {
      result.current.addCard({
        id: 'tz1',
        english: 'hello',
        japanese: 'こんにちは',
        pronunciation: 'həˈloʊ',
        source: 'test',
      });
    });

    // addCard は nextReview に todayStr() を stamp する。
    // 旧実装なら UTC 暦日 '2026-06-20' になるが、修正後はローカル暦日 '2026-06-21'。
    expect(result.current.cards[0].nextReview).toBe('2026-06-21');
  });

  it('JST 09:00 直前 (08:59 JST) でも同じローカル日付が stamp される', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-540);
    // 2026-06-21 08:59 JST == 2026-06-20 23:59 UTC (まだ UTC 暦日だと前日)
    vi.setSystemTime(new Date('2026-06-20T23:59:00Z'));

    const { result } = renderHook(() => useSpacedRepetition());
    act(() => {
      result.current.addCard({
        id: 'tz2',
        english: 'morning',
        japanese: '朝',
        pronunciation: 'ˈmɔːrnɪŋ',
        source: 'test',
      });
    });

    expect(result.current.cards[0].nextReview).toBe('2026-06-21');
  });

  it('addDays() は todayStr() と同じローカル暦日規約で日付を進める (JST)', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-540);

    // today='2026-06-21' で interval=6 のカードを first-pass した想定。
    // scheduleSRSCard は first-pass (reps 0) で interval=1, 次に second-pass
    // (reps 1) で interval=6 を設定する。reps=1 のカードで quality>=3 を
    // 渡すと nextReview は addDays(today, 6) になる。
    const card = makeCard({ repetitions: 1, interval: 1 });
    const result = scheduleSRSCard(card, 5, '2026-06-21');

    // 旧実装の addDays は JST で addDays('2026-06-21', 6) → '2026-06-26'
    // (UTC 暦日) を返してしまい 1 日短く評価されていた。修正後はローカル暦日
    // で '2026-06-27' になる。
    expect(result.nextReview).toBe('2026-06-27');
    expect(result.nextReview).toBe(addDays('2026-06-21', 6));
  });

  it('getDueCards の比較がローカル暦日で一貫する: JST 早朝に前日カードが due にならない', () => {
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(-540);
    vi.setSystemTime(new Date('2026-06-20T17:00:00Z')); // 2026-06-21 02:00 JST

    // nextReview が '2026-06-21' (ローカル今日) のカードは due。
    // nextReview が '2026-06-22' (ローカル明日) のカードは due ではない。
    const dueCard: SRSCard = {
      id: 'due',
      english: 'due',
      japanese: '今日',
      pronunciation: '',
      source: 'test',
      interval: 1,
      easeFactor: 2.5,
      repetitions: 1,
      nextReview: '2026-06-21',
      lastReview: '2026-06-20',
    };
    const notDueCard: SRSCard = {
      ...dueCard,
      id: 'not-due',
      nextReview: '2026-06-22',
    };
    localStorage.setItem('english-learn-srs', JSON.stringify([dueCard, notDueCard]));

    const { result } = renderHook(() => useSpacedRepetition());
    const due = result.current.getDueCards();
    expect(due.map((c) => c.id)).toEqual(['due']);
  });

  it('UTC-5 (ニューヨーク EST) の夜でもローカル暦日に stamp される', () => {
    // EST は UTC-5 → getTimezoneOffset() は 300 を返す
    vi.spyOn(Date.prototype, 'getTimezoneOffset').mockReturnValue(300);
    // 2026-06-21 22:00 EST == 2026-06-22 03:00 UTC (UTC 暦日だと翌日)
    vi.setSystemTime(new Date('2026-06-22T03:00:00Z'));

    const { result } = renderHook(() => useSpacedRepetition());
    act(() => {
      result.current.addCard({
        id: 'tz3',
        english: 'night',
        japanese: '夜',
        pronunciation: 'naɪt',
        source: 'test',
      });
    });

    // ローカル暦日 '2026-06-21' (UTC 暦日 '2026-06-22' ではない)
    expect(result.current.cards[0].nextReview).toBe('2026-06-21');
  });
});
