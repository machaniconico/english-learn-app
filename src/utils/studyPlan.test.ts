// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { buildStudyPlan, planProgress } from './studyPlan';
import type { StudyPlanContext } from './studyPlan';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function baseCtx(overrides: Partial<StudyPlanContext> = {}): StudyPlanContext {
  return {
    hasDiagnosed: true,
    srsDue: 0,
    activeWeakPoints: 0,
    weakestTypes: [],
    todayMinutes: 0,
    goalMinutes: 0,
    streak: 0,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Rule 1 — !hasDiagnosed forces a HIGH diagnose item first
// ---------------------------------------------------------------------------

describe('Rule 1: !hasDiagnosed', () => {
  it('inserts a HIGH diagnose item when hasDiagnosed is false', () => {
    const plan = buildStudyPlan(baseCtx({ hasDiagnosed: false }));
    const diagnose = plan.find((i) => i.id === 'diagnose');
    expect(diagnose).toBeDefined();
    expect(diagnose!.priority).toBe('high');
    expect(diagnose!.route).toBe('/level-test');
    expect(diagnose!.cta).toBe('診断を受ける');
  });

  it('diagnose item is first in sorted order', () => {
    const plan = buildStudyPlan(
      baseCtx({ hasDiagnosed: false, srsDue: 3, activeWeakPoints: 2 }),
    );
    expect(plan[0].id).toBe('diagnose');
  });

  it('does not insert diagnose item when hasDiagnosed is true', () => {
    const plan = buildStudyPlan(baseCtx({ hasDiagnosed: true }));
    expect(plan.find((i) => i.id === 'diagnose')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Rule 2 — srsDue > 0 adds a HIGH review item
// ---------------------------------------------------------------------------

describe('Rule 2: srsDue', () => {
  it('inserts a HIGH srs item when srsDue > 0', () => {
    const plan = buildStudyPlan(baseCtx({ srsDue: 5 }));
    const srs = plan.find((i) => i.id === 'srs');
    expect(srs).toBeDefined();
    expect(srs!.priority).toBe('high');
    expect(srs!.route).toBe('/review');
    expect(srs!.reason).toBe('復習期限のカードが5枚あります。');
  });

  it('embeds the exact count in the reason', () => {
    const plan = buildStudyPlan(baseCtx({ srsDue: 12 }));
    expect(plan.find((i) => i.id === 'srs')!.reason).toBe(
      '復習期限のカードが12枚あります。',
    );
  });

  it('does not insert srs item when srsDue is 0', () => {
    const plan = buildStudyPlan(baseCtx({ srsDue: 0 }));
    expect(plan.find((i) => i.id === 'srs')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Rule 3 — goal item: HIGH if todayMinutes===0, MEDIUM otherwise
// ---------------------------------------------------------------------------

describe('Rule 3: goal item', () => {
  it('inserts HIGH goal item when todayMinutes is 0 and goalMinutes > 0', () => {
    const plan = buildStudyPlan(
      baseCtx({ goalMinutes: 30, todayMinutes: 0 }),
    );
    const goal = plan.find((i) => i.id === 'goal');
    expect(goal).toBeDefined();
    expect(goal!.priority).toBe('high');
    expect(goal!.reason).toBe('今日の目標まであと30分です。');
    expect(goal!.route).toBe('/daily');
  });

  it('inserts MEDIUM goal item when todayMinutes > 0 but < goalMinutes', () => {
    const plan = buildStudyPlan(
      baseCtx({ goalMinutes: 30, todayMinutes: 10 }),
    );
    const goal = plan.find((i) => i.id === 'goal');
    expect(goal).toBeDefined();
    expect(goal!.priority).toBe('medium');
    expect(goal!.reason).toBe('今日の目標まであと20分です。');
  });

  it('does not insert goal item when goal is already met', () => {
    const plan = buildStudyPlan(
      baseCtx({ goalMinutes: 30, todayMinutes: 30 }),
    );
    expect(plan.find((i) => i.id === 'goal')).toBeUndefined();
  });

  it('does not insert goal item when goalMinutes is 0', () => {
    const plan = buildStudyPlan(baseCtx({ goalMinutes: 0, todayMinutes: 5 }));
    expect(plan.find((i) => i.id === 'goal')).toBeUndefined();
  });

  it('does not insert goal item when todayMinutes exceeds goalMinutes', () => {
    const plan = buildStudyPlan(
      baseCtx({ goalMinutes: 20, todayMinutes: 25 }),
    );
    expect(plan.find((i) => i.id === 'goal')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Rule 4 — weak points
// ---------------------------------------------------------------------------

describe('Rule 4: weak points', () => {
  it('inserts a MEDIUM weak item when activeWeakPoints > 0 and weakestTypes is empty', () => {
    const plan = buildStudyPlan(baseCtx({ activeWeakPoints: 3 }));
    const weak = plan.find((i) => i.id === 'weak');
    expect(weak).toBeDefined();
    expect(weak!.priority).toBe('medium');
    expect(weak!.reason).toBe('苦手な項目が3件あります。');
    expect(weak!.route).toBe('/weak-points');
  });

  it('uses weakestTypes labels in reason when provided', () => {
    const plan = buildStudyPlan(
      baseCtx({
        activeWeakPoints: 5,
        weakestTypes: ['fill-in-blank', 'dictation'],
      }),
    );
    const weak = plan.find((i) => i.id === 'weak');
    expect(weak!.reason).toBe(
      '苦手な項目（fill-in-blank、dictation）を集中的に。',
    );
  });

  it('slices weakestTypes to at most 3 labels', () => {
    const plan = buildStudyPlan(
      baseCtx({
        activeWeakPoints: 10,
        weakestTypes: ['a', 'b', 'c', 'd', 'e'],
      }),
    );
    const weak = plan.find((i) => i.id === 'weak');
    expect(weak!.reason).toBe('苦手な項目（a、b、c）を集中的に。');
  });

  it('does not insert weak item when activeWeakPoints is 0', () => {
    const plan = buildStudyPlan(baseCtx({ activeWeakPoints: 0 }));
    expect(plan.find((i) => i.id === 'weak')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Rule 5 — LOW challenge item is always present
// ---------------------------------------------------------------------------

describe('Rule 5: challenge item always present', () => {
  it('always appends a LOW challenge item', () => {
    const plan = buildStudyPlan(baseCtx());
    const challenge = plan.find((i) => i.id === 'challenge');
    expect(challenge).toBeDefined();
    expect(challenge!.priority).toBe('low');
    expect(challenge!.route).toBe('/daily');
    expect(challenge!.cta).toBe('挑戦する');
  });

  it('uses streak copy when streak > 0', () => {
    const plan = buildStudyPlan(baseCtx({ streak: 7 }));
    expect(plan.find((i) => i.id === 'challenge')!.reason).toBe(
      '7日連続学習中！習慣を継続しましょう。',
    );
  });

  it('uses no-streak copy when streak is 0', () => {
    const plan = buildStudyPlan(baseCtx({ streak: 0 }));
    expect(plan.find((i) => i.id === 'challenge')!.reason).toBe(
      '毎日の習慣づくりに挑戦しましょう。',
    );
  });

  it('challenge item is present even when all other rules are inactive', () => {
    // fully diagnosed, nothing due, goal met, no weak points, no streak
    const plan = buildStudyPlan(
      baseCtx({
        hasDiagnosed: true,
        srsDue: 0,
        activeWeakPoints: 0,
        goalMinutes: 30,
        todayMinutes: 30,
        streak: 0,
      }),
    );
    expect(plan).toHaveLength(1);
    expect(plan[0].id).toBe('challenge');
    expect(plan[0].priority).toBe('low');
  });
});

// ---------------------------------------------------------------------------
// Sort order: high -> medium -> low, stable within priority
// ---------------------------------------------------------------------------

describe('Sort order', () => {
  it('returns items in high -> medium -> low order', () => {
    const plan = buildStudyPlan(
      baseCtx({
        hasDiagnosed: false,      // HIGH: diagnose
        srsDue: 2,                // HIGH: srs
        goalMinutes: 30,
        todayMinutes: 10,         // MEDIUM: goal
        activeWeakPoints: 3,      // MEDIUM: weak
        streak: 1,                // LOW: challenge
      }),
    );
    const priorities = plan.map((i) => i.priority);
    // all highs before mediums before lows
    let seenMedium = false;
    let seenLow = false;
    for (const p of priorities) {
      if (p === 'medium') seenMedium = true;
      if (p === 'low') seenLow = true;
      if (p === 'high') {
        expect(seenMedium).toBe(false);
        expect(seenLow).toBe(false);
      }
      if (p === 'medium') {
        expect(seenLow).toBe(false);
      }
    }
  });

  it('high items appear in insertion order: diagnose before srs', () => {
    const plan = buildStudyPlan(
      baseCtx({ hasDiagnosed: false, srsDue: 1 }),
    );
    const highIds = plan
      .filter((i) => i.priority === 'high')
      .map((i) => i.id);
    expect(highIds).toEqual(['diagnose', 'srs']);
  });

  it('goal HIGH comes after diagnose and srs', () => {
    const plan = buildStudyPlan(
      baseCtx({
        hasDiagnosed: false,
        srsDue: 1,
        goalMinutes: 30,
        todayMinutes: 0,
      }),
    );
    const ids = plan.map((i) => i.id);
    expect(ids.indexOf('diagnose')).toBeLessThan(ids.indexOf('srs'));
    expect(ids.indexOf('srs')).toBeLessThan(ids.indexOf('goal'));
  });
});

// ---------------------------------------------------------------------------
// planProgress
// ---------------------------------------------------------------------------

describe('planProgress', () => {
  it('goalPct is 0 when goalMinutes is 0', () => {
    const { goalPct } = planProgress(baseCtx({ goalMinutes: 0, todayMinutes: 10 }));
    expect(goalPct).toBe(0);
  });

  it('computes goalPct correctly', () => {
    const { goalPct } = planProgress(
      baseCtx({ goalMinutes: 30, todayMinutes: 15 }),
    );
    expect(goalPct).toBe(50);
  });

  it('clamps goalPct at 100 even when todayMinutes > goalMinutes', () => {
    const { goalPct } = planProgress(
      baseCtx({ goalMinutes: 20, todayMinutes: 25 }),
    );
    expect(goalPct).toBe(100);
  });

  it('rounds goalPct correctly (1/3 -> 33, not 33.33)', () => {
    const { goalPct } = planProgress(
      baseCtx({ goalMinutes: 30, todayMinutes: 10 }),
    );
    expect(goalPct).toBe(33);
  });

  it('goalMet is true when todayMinutes >= goalMinutes and goalMinutes > 0', () => {
    expect(
      planProgress(baseCtx({ goalMinutes: 30, todayMinutes: 30 })).goalMet,
    ).toBe(true);
    expect(
      planProgress(baseCtx({ goalMinutes: 30, todayMinutes: 31 })).goalMet,
    ).toBe(true);
  });

  it('goalMet is false when todayMinutes < goalMinutes', () => {
    expect(
      planProgress(baseCtx({ goalMinutes: 30, todayMinutes: 29 })).goalMet,
    ).toBe(false);
  });

  it('goalMet is false when goalMinutes is 0', () => {
    expect(
      planProgress(baseCtx({ goalMinutes: 0, todayMinutes: 60 })).goalMet,
    ).toBe(false);
  });

  it('recommendedCount counts only HIGH+MEDIUM items', () => {
    // diagnose=HIGH, srs=HIGH, goal=MEDIUM, weak=MEDIUM, challenge=LOW => 4
    const { recommendedCount } = planProgress(
      baseCtx({
        hasDiagnosed: false,
        srsDue: 2,
        goalMinutes: 30,
        todayMinutes: 10,
        activeWeakPoints: 3,
      }),
    );
    expect(recommendedCount).toBe(4);
  });

  it('recommendedCount is 0 when only the challenge item exists', () => {
    const { recommendedCount } = planProgress(
      baseCtx({
        hasDiagnosed: true,
        srsDue: 0,
        activeWeakPoints: 0,
        goalMinutes: 0,
      }),
    );
    expect(recommendedCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Celebratory / "everything done" state
// ---------------------------------------------------------------------------

describe('celebratory state', () => {
  it('returns only the challenge item when everything else is done', () => {
    const plan = buildStudyPlan(
      baseCtx({
        hasDiagnosed: true,
        srsDue: 0,
        activeWeakPoints: 0,
        goalMinutes: 30,
        todayMinutes: 30,
        streak: 5,
      }),
    );
    expect(plan).toHaveLength(1);
    expect(plan[0].id).toBe('challenge');
    expect(plan[0].priority).toBe('low');
  });

  it('goalMet is true and recommendedCount is 0 in celebratory state', () => {
    const ctx = baseCtx({
      hasDiagnosed: true,
      srsDue: 0,
      activeWeakPoints: 0,
      goalMinutes: 30,
      todayMinutes: 30,
    });
    const { goalMet, recommendedCount } = planProgress(ctx);
    expect(goalMet).toBe(true);
    expect(recommendedCount).toBe(0);
  });
});
