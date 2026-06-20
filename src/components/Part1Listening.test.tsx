// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import Part1Listening from './Part1Listening';
import type { Part1Question } from '../data/types';

expect.extend(matchers);

const questions: Part1Question[] = [
  {
    id: 'p1q1',
    scenario: '男性が机に座ってパソコンで作業している。',
    scenarioEn: 'A man is working at a desk in the office.',
    options: [
      'A man is typing on a keyboard.',
      'A man is closing a window.',
      'A man is watering plants.',
      'A man is reading a newspaper.',
    ],
    correctIndex: 0,
    explanation: '男性はキーボードを打っているので A が正解です。',
  },
  {
    id: 'p1q2',
    scenario: '女性がレストランで料理を運んでいる。',
    scenarioEn: 'A woman is serving food at a restaurant.',
    options: [
      'A woman is cleaning the floor.',
      'A woman is carrying a tray of food.',
      'A woman is opening a door.',
      'A woman is paying the bill.',
    ],
    correctIndex: 1,
    explanation: '女性は料理ののったトレイを運んでいるので B が正解です。',
  },
];

// Each option button is rendered with aria-label `選択肢 {LETTER}` before answering.
const selectOption = (letter: string) =>
  screen.getByRole('button', { name: new RegExp(`^選択肢 ${letter}$`) });

describe('Part1Listening', () => {
  it('reveals option text and marks a correct selection, advancing score', () => {
    renderWithRouter(<Part1Listening questions={questions} />);

    // Before answering option text is hidden ("...").
    expect(screen.queryByText(questions[0].options[0])).not.toBeInTheDocument();
    expect(
      screen.getByText(`Score: 0 / 0`, { exact: false })
    ).toBeInTheDocument();

    // Correct answer for Q1 is index 0 => label A.
    fireEvent.click(selectOption('A'));

    // Option text is now revealed.
    expect(screen.getByText(questions[0].options[0])).toBeInTheDocument();
    // Correct feedback shown.
    expect(screen.getByText('Correct! 正解!')).toBeInTheDocument();
    expect(screen.getByText(questions[0].explanation)).toBeInTheDocument();
    // Score advanced to 1 / 1.
    expect(
      screen.getByText('Score: 1 / 1', { exact: false })
    ).toBeInTheDocument();
  });

  it('marks a wrong selection as incorrect without incrementing score', () => {
    renderWithRouter(<Part1Listening questions={questions} />);

    // Q1 correct is A; pick B (wrong).
    fireEvent.click(selectOption('B'));

    expect(screen.getByText('Incorrect / 不正解')).toBeInTheDocument();
    // Score stays at 0 of 1 attempted.
    expect(
      screen.getByText('Score: 0 / 1', { exact: false })
    ).toBeInTheDocument();
  });

  it('advances to the next question and shows results on completion', () => {
    renderWithRouter(<Part1Listening questions={questions} />);

    // Q1: answer correctly.
    fireEvent.click(selectOption('A'));
    expect(
      screen.getByText('Question 1 / 2', { exact: false })
    ).toBeInTheDocument();

    // Advance to Q2.
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }));
    expect(
      screen.getByText('Question 2 / 2', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText(questions[1].scenario)).toBeInTheDocument();

    // Q2: answer correctly (index 1 => B).
    fireEvent.click(selectOption('B'));
    expect(screen.getByText('Correct! 正解!')).toBeInTheDocument();

    // Finish to results screen.
    fireEvent.click(
      screen.getByRole('button', { name: /See Results|結果を見る/ })
    );

    expect(screen.getByText('Results / 結果')).toBeInTheDocument();
    expect(screen.getByText('100% correct')).toBeInTheDocument();
    // Restart button available.
    expect(
      screen.getByRole('button', { name: 'もう一度' })
    ).toBeInTheDocument();
  });

  it('has no axe violations in the question view', async () => {
    const { container } = renderWithRouter(
      <Part1Listening questions={questions} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
