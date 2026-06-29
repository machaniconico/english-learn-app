import type { DailyQuizQuestion } from '../data/dailyQuiz';

export interface CategoryStat {
  category: string;
  correct: number;
  total: number;
}

export function quizCategoryBreakdown(
  questions: DailyQuizQuestion[],
  answers: (number | null)[],
): CategoryStat[] {
  const statsByCategory = new Map<string, CategoryStat>();
  const limit = Math.min(questions.length, answers.length);

  for (let i = 0; i < limit; i += 1) {
    const question = questions[i];
    const answer = answers[i];
    const existing = statsByCategory.get(question.category);
    const stat =
      existing ??
      {
        category: question.category,
        correct: 0,
        total: 0,
      };

    stat.total += 1;
    if (answer === question.correctIndex) {
      stat.correct += 1;
    }

    if (!existing) {
      statsByCategory.set(question.category, stat);
    }
  }

  return Array.from(statsByCategory.values());
}

/**
 * 最も苦手な分野(正答率 correct/total が最小)を1つ返す。
 * - 全問正解の分野しかない(苦手が無い)ときは null。
 * - 正答率が同率なら total が大きい方を優先(母数が多い=より確か)。
 */
export function weakestCategory(stats: CategoryStat[]): CategoryStat | null {
  const candidates = stats.filter((s) => s.total > 0 && s.correct < s.total);
  if (candidates.length === 0) return null;
  let weakest = candidates[0];
  for (let i = 1; i < candidates.length; i++) {
    const s = candidates[i];
    const r = s.correct / s.total;
    const rw = weakest.correct / weakest.total;
    if (r < rw || (r === rw && s.total > weakest.total)) weakest = s;
  }
  return weakest;
}
