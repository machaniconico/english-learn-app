// Pure recommendation engine — no hooks, no localStorage, no side effects.
// All logic is deterministic given a StudyPlanContext.

export type PlanPriority = 'high' | 'medium' | 'low';

export interface StudyPlanItem {
  id: string;
  title: string;
  reason: string;
  route: string;
  cta: string;
  priority: PlanPriority;
}

export interface StudyPlanContext {
  hasDiagnosed: boolean;
  srsDue: number;         // SRS cards due today
  activeWeakPoints: number; // non-mastered weak points
  weakestTypes: string[]; // labels, may be empty
  todayMinutes: number;
  goalMinutes: number;
  streak: number;
}

/**
 * Build a prioritized study plan for today.
 *
 * Rules (encoded exactly — tests depend on this):
 * 1. !hasDiagnosed  -> HIGH: diagnose item
 * 2. srsDue > 0     -> HIGH: review item
 * 3. goalMinutes>0 && todayMinutes<goalMinutes
 *      -> HIGH if todayMinutes===0 else MEDIUM: goal item
 * 4. activeWeakPoints>0 -> MEDIUM: weak item
 * 5. ALWAYS append LOW: challenge/habit item
 *
 * Result is sorted high -> medium -> low, stable within a priority.
 */
export function buildStudyPlan(ctx: StudyPlanContext): StudyPlanItem[] {
  const items: StudyPlanItem[] = [];

  // Rule 1 — level diagnosis
  if (!ctx.hasDiagnosed) {
    items.push({
      id: 'diagnose',
      title: 'レベル診断テスト',
      route: '/level-test',
      cta: '診断を受ける',
      priority: 'high',
      reason: 'あなたに合った教材を提案するため、まずはレベル診断を受けましょう。',
    });
  }

  // Rule 2 — SRS cards due
  if (ctx.srsDue > 0) {
    items.push({
      id: 'srs',
      title: '今日の復習',
      route: '/review',
      cta: '復習する',
      priority: 'high',
      reason: `復習期限のカードが${ctx.srsDue}枚あります。`,
    });
  }

  // Rule 3 — daily goal not yet met
  if (ctx.goalMinutes > 0 && ctx.todayMinutes < ctx.goalMinutes) {
    const remaining = ctx.goalMinutes - ctx.todayMinutes;
    items.push({
      id: 'goal',
      title: '今日の学習目標',
      route: '/daily',
      cta: '学習する',
      priority: ctx.todayMinutes === 0 ? 'high' : 'medium',
      reason: `今日の目標まであと${remaining}分です。`,
    });
  }

  // Rule 4 — weak points
  if (ctx.activeWeakPoints > 0) {
    const reason =
      ctx.weakestTypes.length > 0
        ? `苦手な項目（${ctx.weakestTypes.slice(0, 3).join('、')}）を集中的に。`
        : `苦手な項目が${ctx.activeWeakPoints}件あります。`;
    items.push({
      id: 'weak',
      title: '苦手分野の克服',
      route: '/weak-points',
      cta: '復習する',
      priority: 'medium',
      reason,
    });
  }

  // Rule 5 — always append a low habit/challenge item
  const challengeReason =
    ctx.streak > 0
      ? `${ctx.streak}日連続学習中！習慣を継続しましょう。`
      : '毎日の習慣づくりに挑戦しましょう。';
  items.push({
    id: 'challenge',
    title: 'デイリーチャレンジ',
    route: '/daily',
    cta: '挑戦する',
    priority: 'low',
    reason: challengeReason,
  });

  // Sort: high -> medium -> low, preserving insertion order within priority
  const order: Record<PlanPriority, number> = { high: 0, medium: 1, low: 2 };
  return items.sort((a, b) => order[a.priority] - order[b.priority]);
}

/**
 * Derive progress metadata for the plan header.
 *
 * goalPct  = goalMinutes>0 ? min(100, round(todayMinutes/goalMinutes*100)) : 0
 * goalMet  = goalMinutes>0 && todayMinutes>=goalMinutes
 * recommendedCount = number of HIGH+MEDIUM items in the plan
 */
export function planProgress(ctx: StudyPlanContext): {
  goalPct: number;
  goalMet: boolean;
  recommendedCount: number;
} {
  const goalPct =
    ctx.goalMinutes > 0
      ? Math.min(100, Math.round((ctx.todayMinutes / ctx.goalMinutes) * 100))
      : 0;
  const goalMet = ctx.goalMinutes > 0 && ctx.todayMinutes >= ctx.goalMinutes;
  const plan = buildStudyPlan(ctx);
  const recommendedCount = plan.filter(
    (item) => item.priority === 'high' || item.priority === 'medium',
  ).length;
  return { goalPct, goalMet, recommendedCount };
}
