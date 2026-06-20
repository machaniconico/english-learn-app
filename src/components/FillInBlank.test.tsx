// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, within } from '../test/test-utils';
import FillInBlank from './FillInBlank';
import type { FillInBlankQuestion } from '../data/types';

expect.extend(matchers);

// Option text lives in its own <span> inside the option <button>; the button's
// accessible name also includes the A/B/C/D label, so we locate the option by
// its exact text node and walk up to the enclosing button.
function clickOption(text: string) {
  const span = screen.getByText(text, { selector: 'span' });
  const button = span.closest('button');
  if (!button) throw new Error(`No button found for option "${text}"`);
  fireEvent.click(button);
}

const questions: FillInBlankQuestion[] = [
  {
    id: 'q1',
    sentence: 'I _____ to school every day.',
    options: ['go', 'goes', 'going', 'gone'],
    correctIndex: 0,
    explanation: '主語が I のときは原形 go を使います。',
    category: 'grammar',
  },
  {
    id: 'q2',
    sentence: 'She is interested _____ music.',
    options: ['on', 'in', 'at', 'for'],
    correctIndex: 1,
    explanation: 'be interested in で「〜に興味がある」という意味です。',
    category: 'preposition',
  },
];

describe('FillInBlank', () => {
  it('has no axe violations on initial render', async () => {
    const { container } = renderWithRouter(<FillInBlank questions={questions} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows the first question with its options', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    expect(screen.getByText('Question 1 / 2')).toBeTruthy();
    expect(screen.getByText('go', { selector: 'span' })).toBeTruthy();
    expect(screen.getByText('goes', { selector: 'span' })).toBeTruthy();
  });

  it('marks a correct selection and shows positive feedback', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    clickOption('go');

    expect(screen.getByText(/Correct! 正解!/)).toBeTruthy();
    // explanation appears in the feedback region
    expect(screen.getAllByText('主語が I のときは原形 go を使います。').length).toBeGreaterThan(0);
    // score reflects the correct answer
    expect(screen.getByText('Score: 1 / 1')).toBeTruthy();
  });

  it('marks a wrong selection, shows incorrect feedback + explanation', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    clickOption('goes');

    expect(screen.getByText(/Incorrect \/ 不正解/)).toBeTruthy();
    expect(screen.getAllByText('主語が I のときは原形 go を使います。').length).toBeGreaterThan(0);
    // score stays at 0 correct
    expect(screen.getByText('Score: 0 / 1')).toBeTruthy();
  });

  it('does not allow changing the answer once selected', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    clickOption('goes');
    expect(screen.getByText(/Incorrect \/ 不正解/)).toBeTruthy();

    // clicking another option should be ignored (still incorrect, score still 0)
    clickOption('going');
    expect(screen.getByText(/Incorrect \/ 不正解/)).toBeTruthy();
    expect(screen.getByText('Score: 0 / 1')).toBeTruthy();
  });

  it('advances to the next question via the Next button', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    clickOption('go');
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }));

    expect(screen.getByText('Question 2 / 2')).toBeTruthy();
    expect(screen.getByText('She is interested', { exact: false })).toBeTruthy();
    expect(screen.getByText('in', { selector: 'span' })).toBeTruthy();
  });

  it('shows the results screen with the final score after the last question', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    // Q1 correct
    clickOption('go');
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }));
    // Q2 correct
    clickOption('in');
    fireEvent.click(screen.getByRole('button', { name: /See Results \/ 結果を見る/ }));

    expect(screen.getByText('Results / 結果')).toBeTruthy();
    expect(screen.getByText('100% correct')).toBeTruthy();

    const status = screen.getByRole('status');
    expect(within(status).getByText('2')).toBeTruthy();
    expect(within(status).getByText('/ 2')).toBeTruthy();
    // a perfect score has no review section
    expect(screen.queryByText('間違えた問題の復習')).toBeNull();
  });

  it('lists wrong answers in the results review section', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    // Q1 wrong
    clickOption('goes');
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }));
    // Q2 wrong
    clickOption('at');
    fireEvent.click(screen.getByRole('button', { name: /See Results \/ 結果を見る/ }));

    expect(screen.getByText('間違えた問題の復習')).toBeTruthy();
    expect(screen.getByText('0% correct')).toBeTruthy();
    // both wrong explanations show in review
    expect(
      screen.getByText('be interested in で「〜に興味がある」という意味です。')
    ).toBeTruthy();
  });

  it('supports keyboard selection (number keys) and Enter to advance', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    // press "1" selects first option (correct for Q1)
    fireEvent.keyDown(window, { key: '1' });
    expect(screen.getByText(/Correct! 正解!/)).toBeTruthy();

    // Enter advances to next question
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByText('Question 2 / 2')).toBeTruthy();
  });

  it('restarts the quiz from the results screen', () => {
    renderWithRouter(<FillInBlank questions={questions} />);
    clickOption('go');
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }));
    clickOption('in');
    fireEvent.click(screen.getByRole('button', { name: /See Results \/ 結果を見る/ }));

    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));
    expect(screen.getByText('Question 1 / 2')).toBeTruthy();
    expect(screen.getByText('Score: 0 / 0')).toBeTruthy();
  });
});
