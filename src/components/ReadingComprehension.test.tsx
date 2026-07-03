// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import ReadingComprehension from './ReadingComprehension';
import type { ReadingPassage } from '../data/types';

expect.extend(matchers);

const passage: ReadingPassage = {
  id: 'p1',
  title: 'Office Notice',
  titleJa: 'オフィスのお知らせ',
  type: 'Notice',
  typeJa: 'お知らせ',
  passage: 'The meeting room will be closed on Friday for maintenance.',
  level: 'beginner',
  questions: [
    {
      id: 'q1',
      question: 'When will the room be closed?',
      questionJa: '部屋はいつ閉まりますか?',
      options: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      correctIndex: 2,
      explanation: '本文に Friday と書かれています。',
    },
    {
      id: 'q2',
      question: 'Why will it be closed?',
      questionJa: 'なぜ閉まりますか?',
      options: ['Maintenance', 'Holiday', 'Party', 'Cleaning'],
      correctIndex: 0,
      explanation: '本文に maintenance と書かれています。',
    },
  ],
};

describe('ReadingComprehension', () => {
  it('selecting the correct option reveals the correct explanation and increments score', () => {
    renderWithRouter(<ReadingComprehension passage={passage} />);

    // First question shown
    expect(screen.getByText('When will the room be closed?')).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar', { name: '問題の進捗' });
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '2');

    // Pick the correct answer from the fixture (correctIndex 2 = 'Friday')
    fireEvent.click(screen.getByRole('button', { name: /Friday/ }));

    // Correct feedback + explanation revealed
    expect(screen.getByText('Correct! 正解!')).toBeInTheDocument();
    expect(screen.getByText('本文に Friday と書かれています。')).toBeInTheDocument();

    // Score reflects the correct answer
    expect(screen.getByText('Score: 1 / 1')).toBeInTheDocument();
  });

  it('selecting a wrong option shows incorrect feedback and disables further selection', () => {
    renderWithRouter(<ReadingComprehension passage={passage} />);

    // Wrong choice: 'Monday' (index 0), correct is index 2
    fireEvent.click(screen.getByRole('button', { name: /Monday/ }));

    expect(screen.getByText('Incorrect / 不正解')).toBeInTheDocument();
    expect(screen.getByText('Score: 0 / 1')).toBeInTheDocument();

    // Options are now disabled (answered=true)
    expect(screen.getByRole('button', { name: /Friday/ })).toBeDisabled();
  });

  it('advances through questions and shows the final score on completion', () => {
    renderWithRouter(<ReadingComprehension passage={passage} />);

    // Q1: correct
    fireEvent.click(screen.getByRole('button', { name: /Friday/ }));
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }));

    // Q2 now shown
    expect(screen.getByText('Why will it be closed?')).toBeInTheDocument();
    expect(screen.getByText('Question 2 / 2')).toBeInTheDocument();

    // Q2: correct (index 0 = 'Maintenance')
    fireEvent.click(screen.getByRole('button', { name: /Maintenance/ }));

    // Last question -> button becomes results
    fireEvent.click(screen.getByRole('button', { name: /See Results/ }));

    // Results screen: 2 / 2, 100%
    expect(screen.getByText('Results / 結果')).toBeInTheDocument();
    expect(screen.getByText('/ 2')).toBeInTheDocument();
    expect(screen.getByText('100% correct')).toBeInTheDocument();
    const scoreBar = screen.getByRole('progressbar', { name: 'スコア' });
    expect(scoreBar).toHaveAttribute('aria-valuenow', '100');
    expect(scoreBar).toHaveAttribute('aria-valuemax', '100');
    // Score number (large indigo total) is 2 of 2 correct
    const score = screen.getByText('/ 2').previousElementSibling;
    expect(score).toHaveTextContent('2');
  });

  it('restart from results returns to the first question', () => {
    renderWithRouter(<ReadingComprehension passage={passage} />);

    fireEvent.click(screen.getByRole('button', { name: /Monday/ }));
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }));
    fireEvent.click(screen.getByRole('button', { name: /Holiday/ }));
    fireEvent.click(screen.getByRole('button', { name: /See Results/ }));

    expect(screen.getByText('Results / 結果')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));

    // Back to first question, fresh state
    expect(screen.getByText('When will the room be closed?')).toBeInTheDocument();
    expect(screen.getByText('Question 1 / 2')).toBeInTheDocument();
    expect(screen.getByText('Score: 0 / 0')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(
      <ReadingComprehension passage={passage} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
