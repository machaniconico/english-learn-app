import { describe, it, expect } from 'vitest';
import { scheduleSRSCard, type SRSCard } from './useSpacedRepetition';

const TODAY = '2026-06-19';

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
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

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
