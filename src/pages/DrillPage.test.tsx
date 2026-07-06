// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, renderWithRouter, screen } from '../test/test-utils';
import DrillPage from './DrillPage';
import type { DrillMistake } from '../utils/drillMistakes';
import type { DrillQuestion } from '../utils/drillTypes';

const DRILL_MISTAKES_KEY = 'english-learn-drill-mistakes';

function makeDrillQuestion(id: string): DrillQuestion {
  return {
    id,
    genre: 'vocab',
    difficulty: 'beginner',
    prompt: `Prompt ${id}`,
    options: ['a', 'b', 'c', 'd'],
    correctIndex: 1,
    explanation: `Explanation ${id}`,
  };
}

function seedDrillMistakes(count: number): void {
  const mistakes: DrillMistake[] = Array.from({ length: count }, (_, index) => ({
    question: makeDrillQuestion(`q${index + 1}`),
    correctStreak: 0,
    wrongCount: 1,
    addedAt: 1000 + index,
    lastSeenAt: 1000 + index,
  }));
  localStorage.setItem(DRILL_MISTAKES_KEY, JSON.stringify(mistakes));
}

describe('DrillPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('ページ見出しと DrillMode の主要素を表示し、回答後に解説を出す', async () => {
    renderWithRouter(<DrillPage />, { route: '/drill' });

    expect(screen.getByRole('heading', { level: 1, name: 'ドリルモード' })).toBeInTheDocument();
    expect(screen.getByText(/止めるまで連続出題/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ホーム/ })).toHaveAttribute('href', '/');

    expect(screen.getByLabelText('難易度')).toBeInTheDocument();
    expect(screen.getByLabelText('ジャンル')).toBeInTheDocument();
    expect(await screen.findByText('第 1 問')).toBeInTheDocument();

    const answerButtons = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-pressed') !== null);
    fireEvent.click(answerButtons[0]);

    expect(screen.getByRole('status')).toHaveTextContent(/正解|不正解/);
    expect(screen.getByText(/解説 \(/)).toBeInTheDocument();
  });

  it('間違い問題があると復習導線を表示する', () => {
    seedDrillMistakes(3);

    renderWithRouter(<DrillPage />, { route: '/drill' });

    const link = screen.getByRole('link', { name: '間違い問題を復習 (3) →' });
    expect(link).toHaveAttribute('href', '/drill/review');
  });

  it('間違い問題がないと復習導線を表示しない', () => {
    renderWithRouter(<DrillPage />, { route: '/drill' });

    expect(screen.queryByRole('link', { name: /間違い問題を復習/ })).not.toBeInTheDocument();
  });
});
