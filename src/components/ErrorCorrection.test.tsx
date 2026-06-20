// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, within } from '../test/test-utils';
import ErrorCorrection from './ErrorCorrection';
import type { ErrorCorrectionQuestion } from '../data/types';

expect.extend(matchers);

const questions: ErrorCorrectionQuestion[] = [
  {
    id: 'ec-1',
    sentence: 'She (A)have (B)three (C)red (D)apples.',
    segments: ['have', 'three', 'red', 'apples'],
    errorIndex: 0,
    correction: 'has',
    explanation: '主語が三人称単数なので has が正しい。',
  },
  {
    id: 'ec-2',
    sentence: 'They (A)went (B)to (C)the (D)store yesterday.',
    segments: ['went', 'to', 'the', 'store'],
    errorIndex: 2,
    correction: 'a',
    explanation: '初出の名詞なので冠詞は a が自然。',
  },
];

// The error segment text appears in both the rendered sentence and the segment
// button grid. Helper to grab the grid button (a <button> whose text is exactly
// the segment label, found among the grid buttons rendered after the sentence).
function getSegmentButton(label: string) {
  const buttons = screen
    .getAllByRole('button')
    .filter((b) => within(b).queryByText(label));
  // grid button is the one with the label letter span (A-D) sibling; pick the
  // last match which is the mobile grid button (sentence inline button comes first)
  return buttons[buttons.length - 1];
}

describe('ErrorCorrection', () => {
  it('has no axe violations on initial render', async () => {
    const { container } = renderWithRouter(<ErrorCorrection questions={questions} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the first question with progress and segments', () => {
    renderWithRouter(<ErrorCorrection questions={questions} />);
    expect(screen.getByText('Question 1 / 2')).toBeTruthy();
    // segment texts appear (inline + grid)
    expect(screen.getAllByText('have').length).toBeGreaterThan(0);
    expect(screen.getAllByText('apples').length).toBeGreaterThan(0);
  });

  it('marks correct when the error segment is selected and shows the correction', () => {
    renderWithRouter(<ErrorCorrection questions={questions} />);
    // errorIndex 0 -> segment "have"
    fireEvent.click(getSegmentButton('have'));

    const status = screen.getByRole('status');
    expect(within(status).getByText(/Correct! 正解!/)).toBeTruthy();
    // correction text shown
    expect(within(status).getByText('has')).toBeTruthy();
    expect(within(status).getByText(/主語が三人称単数/)).toBeTruthy();
  });

  it('marks incorrect when a non-error segment is selected', () => {
    renderWithRouter(<ErrorCorrection questions={questions} />);
    // pick segment "apples" (index 3), which is NOT the error (errorIndex 0)
    fireEvent.click(getSegmentButton('apples'));

    const status = screen.getByRole('status');
    expect(within(status).getByText(/Incorrect \/ 不正解/)).toBeTruthy();
    // still shows the actual correction
    expect(within(status).getByText('has')).toBeTruthy();
  });

  it('disables segment selection after answering (no double-count)', () => {
    renderWithRouter(<ErrorCorrection questions={questions} />);
    fireEvent.click(getSegmentButton('apples')); // wrong
    // score should reflect 0 correct out of 1 answered
    expect(screen.getByText('Score: 0 / 1')).toBeTruthy();
    // clicking another segment should do nothing (answered guard)
    fireEvent.click(getSegmentButton('have'));
    // feedback is still the incorrect one
    expect(within(screen.getByRole('status')).getByText(/Incorrect \/ 不正解/)).toBeTruthy();
  });

  it('advances to the next question and then to results, updating score', () => {
    renderWithRouter(<ErrorCorrection questions={questions} />);
    // Q1: correct
    fireEvent.click(getSegmentButton('have'));
    expect(screen.getByText('Score: 1 / 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Next Question/ }));

    // Q2
    expect(screen.getByText('Question 2 / 2')).toBeTruthy();
    // errorIndex 2 -> segment "the"; choose wrong segment "store" instead
    fireEvent.click(getSegmentButton('store'));
    expect(screen.getByText('Score: 1 / 2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /See Results/ }));

    // Results screen
    expect(screen.getByText('Results / 結果')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy(); // score
    expect(screen.getByText('/ 2')).toBeTruthy();
    // wrong answer review present for Q2
    expect(screen.getByText('間違えた問題の復習')).toBeTruthy();
  });

  it('supports keyboard selection (letter key) and advancing with Enter', () => {
    renderWithRouter(<ErrorCorrection questions={questions} />);
    // press "a" -> selects segment index 0 (the error) -> correct
    fireEvent.keyDown(window, { key: 'a' });
    expect(within(screen.getByRole('status')).getByText(/Correct! 正解!/)).toBeTruthy();
    // Enter advances
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByText('Question 2 / 2')).toBeTruthy();
  });
});
