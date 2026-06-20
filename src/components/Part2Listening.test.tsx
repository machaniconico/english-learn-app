// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import Part2Listening from './Part2Listening';
import type { Part2Question } from '../data/types';

expect.extend(matchers);

const questions: Part2Question[] = [
  {
    id: 'q1',
    question: 'Where is the meeting room?',
    questionJa: '会議室はどこですか？',
    responses: ['On the third floor.', 'At three o’clock.', 'Yes, it is.'],
    responsesJa: ['3階です。', '3時です。', 'はい、そうです。'],
    correctIndex: 0,
    explanation: 'Where で場所を尋ねているので場所を答える。',
    questionType: 'Where',
  },
  {
    id: 'q2',
    question: 'When does the store open?',
    questionJa: '店はいつ開きますか？',
    responses: ['Near the station.', 'At nine in the morning.', 'The manager does.'],
    responsesJa: ['駅の近くです。', '朝9時です。', '店長です。'],
    correctIndex: 1,
    explanation: 'When で時間を尋ねているので時間を答える。',
    questionType: 'When',
  },
];

describe('Part2Listening', () => {
  it('marks a correct selection, advances, and completes with full score', async () => {
    renderWithRouter(<Part2Listening questions={questions} />);

    // Q1: correctIndex 0 -> "応答 A"
    fireEvent.click(screen.getByRole('button', { name: '応答 A' }));

    // Correct feedback appears
    expect(screen.getByText(/正解/)).toBeTruthy();
    // Score reflects 1 correct out of 1 answered
    expect(screen.getByText(/Score: 1 \/ 1/)).toBeTruthy();

    // Advance to next question
    fireEvent.click(screen.getByRole('button', { name: /次の問題/ }));
    expect(screen.getByText(/Question 2 \/ 2/)).toBeTruthy();

    // Q2: correctIndex 1 -> "応答 B"
    fireEvent.click(screen.getByRole('button', { name: '応答 B' }));
    expect(screen.getByText(/正解/)).toBeTruthy();

    // Finish -> results screen
    fireEvent.click(screen.getByRole('button', { name: /結果を見る/ }));
    expect(screen.getByText('Results')).toBeTruthy();
    // 2 / 2 correct on results
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('100% correct')).toBeTruthy();
  });

  it('marks a wrong selection and keeps score at zero', () => {
    renderWithRouter(<Part2Listening questions={questions} />);

    // Q1 correct is A; choose B (wrong)
    fireEvent.click(screen.getByRole('button', { name: '応答 B' }));

    // Incorrect feedback names the correct answer (A)
    expect(screen.getByText(/不正解/)).toBeTruthy();
    // Score stays 0 / 1
    expect(screen.getByText(/Score: 0 \/ 1/)).toBeTruthy();
  });

  it('has no axe violations on the question screen', async () => {
    const { container } = renderWithRouter(<Part2Listening questions={questions} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
