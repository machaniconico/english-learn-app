// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, within, waitFor } from '../test/test-utils';
import SentenceReorder from './SentenceReorder';
import type { ReorderQuestion } from '../data/types';

expect.extend(matchers);

const questions: ReorderQuestion[] = [
  {
    id: 'r1',
    words: ['I', 'like', 'apples'],
    japanese: '私はりんごが好きです。',
    level: 'beginner',
  },
  {
    id: 'r2',
    words: ['She', 'reads', 'books'],
    japanese: '彼女は本を読みます。',
    level: 'beginner',
  },
];

// Build the correct answer by tapping the pool chips in the order required by
// the question. The pool is shuffled, so we find each word's "追加" button each
// time (the pool re-renders after every pick).
function buildAnswer(words: string[]) {
  for (const word of words) {
    const addBtn = screen.getByRole('button', { name: `${word} を追加` });
    fireEvent.click(addBtn);
  }
}

describe('SentenceReorder', () => {
  it('renders the first question with Japanese hint and pool chips', () => {
    renderWithRouter(<SentenceReorder questions={questions} />);
    expect(screen.getByText('私はりんごが好きです。')).toBeTruthy();
    expect(screen.getByText('Question 1 / 2')).toBeTruthy();
    const progressBar = screen.getByRole('progressbar', { name: '問題の進捗' });
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '2');
    // All three words are available to add
    for (const word of questions[0].words) {
      expect(screen.getByRole('button', { name: `${word} を追加` })).toBeTruthy();
    }
    // Check button is disabled before all words are placed
    const check = screen.getByRole('button', { name: 'チェックする' });
    expect((check as HTMLButtonElement).disabled).toBe(true);
  });

  it('builds the answer by tapping word chips and marks a correct arrangement as success', () => {
    renderWithRouter(<SentenceReorder questions={questions} />);

    buildAnswer(questions[0].words);

    const check = screen.getByRole('button', { name: 'チェックする' });
    expect((check as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(check);

    expect(screen.getByText('Correct! 正解！')).toBeTruthy();
    // Score should reflect the correct answer
    expect(screen.getByText('Score: 1 / 1')).toBeTruthy();
    // Next button appears
    expect(screen.getByRole('button', { name: /Next/ })).toBeTruthy();
  });

  it('marks a wrong arrangement as failure and shows the correct order + retry', async () => {
    renderWithRouter(<SentenceReorder questions={questions} />);

    // Tap words in reverse order to guarantee an incorrect arrangement
    const wrongOrder = [...questions[0].words].reverse();
    buildAnswer(wrongOrder);

    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));

    expect(screen.getByText('Incorrect / 不正解')).toBeTruthy();
    // Correct order is revealed
    const status = screen.getByRole('status');
    expect(within(status).getByText('I like apples')).toBeTruthy();
    // Score stays 0 out of 1 attempt
    expect(screen.getByText('Score: 0 / 1')).toBeTruthy();
    // Retry button is offered on a wrong answer
    expect(screen.getByRole('button', { name: 'もう一度挑戦' })).toBeTruthy();
  });

  it('retry resets the question so words can be rearranged again', () => {
    renderWithRouter(<SentenceReorder questions={questions} />);

    buildAnswer([...questions[0].words].reverse());
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));
    expect(screen.getByText('Incorrect / 不正解')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'もう一度挑戦' }));

    // Back to an unchecked state: all words are available again and check is disabled
    for (const word of questions[0].words) {
      expect(screen.getByRole('button', { name: `${word} を追加` })).toBeTruthy();
    }
    expect((screen.getByRole('button', { name: 'チェックする' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it('removes a placed word when its answer chip is tapped', () => {
    renderWithRouter(<SentenceReorder questions={questions} />);

    // Add one word, then remove it
    fireEvent.click(screen.getByRole('button', { name: 'I を追加' }));
    const removeBtn = screen.getByRole('button', { name: 'I を削除' });
    expect(removeBtn).toBeTruthy();
    fireEvent.click(removeBtn);

    // The remove button is gone and the word is back in the pool
    expect(screen.queryByRole('button', { name: 'I を削除' })).toBeNull();
    expect(screen.getByRole('button', { name: 'I を追加' })).toBeTruthy();
  });

  it('advances to the next question and reaches the results screen', () => {
    renderWithRouter(<SentenceReorder questions={questions} />);

    // Q1 correct
    buildAnswer(questions[0].words);
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));

    // Q2 now shown
    expect(screen.getByText('Question 2 / 2')).toBeTruthy();
    expect(screen.getByText('彼女は本を読みます。')).toBeTruthy();

    // Q2 correct -> See Results
    buildAnswer(questions[1].words);
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));
    fireEvent.click(screen.getByRole('button', { name: /結果を見る/ }));

    // Results screen
    expect(screen.getByText('Results / 結果')).toBeTruthy();
    expect(screen.getByText('Correct: 2')).toBeTruthy();
    const scoreBar = screen.getByRole('progressbar', { name: 'スコア' });
    expect(scoreBar).toHaveAttribute('aria-valuenow', '100');
    expect(scoreBar).toHaveAttribute('aria-valuemax', '100');
    // Restart button present
    expect(screen.getByRole('button', { name: 'もう一度' })).toBeTruthy();
  });

  it('shows a hint that places the first word', () => {
    renderWithRouter(<SentenceReorder questions={questions} />);

    fireEvent.click(screen.getByRole('button', { name: 'ヒントを見る' }));

    // First correct word ("I") gets moved into the answer area
    expect(screen.getByRole('button', { name: 'I を削除' })).toBeTruthy();
    // Hint text shown
    expect(screen.getByText(/最初のワードは/)).toBeTruthy();
  });

  it('supports Enter key to check then advance', async () => {
    renderWithRouter(<SentenceReorder questions={questions} />);

    buildAnswer(questions[0].words);
    // Enter checks
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => expect(screen.getByText('Correct! 正解！')).toBeTruthy());
    // Enter advances
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => expect(screen.getByText('Question 2 / 2')).toBeTruthy());
  });

  it('has no axe violations on initial render', async () => {
    const { container } = renderWithRouter(<SentenceReorder questions={questions} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
