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
