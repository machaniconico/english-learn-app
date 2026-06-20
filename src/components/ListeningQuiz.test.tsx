// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, within } from '../test/test-utils';
import ListeningQuiz from './ListeningQuiz';
import type { PhraseItem } from '../data/types';

expect.extend(matchers);

const items: PhraseItem[] = [
  { id: '1', english: 'Hello', japanese: 'こんにちは', pronunciation: 'ヘロー' },
  { id: '2', english: 'Thank you', japanese: 'ありがとう', pronunciation: 'サンキュー' },
  { id: '3', english: 'Goodbye', japanese: 'さようなら', pronunciation: 'グッバイ' },
  { id: '4', english: 'Yes', japanese: 'はい', pronunciation: 'イエス' },
  { id: '5', english: 'No', japanese: 'いいえ', pronunciation: 'ノー' },
];

// ListeningQuiz shuffles the question pool and the options with Math.random.
// Stubbing Math.random to ~1 makes the component's Fisher-Yates shuffle a no-op
// (j = floor(0.9999999 * (i+1)) === i, so every element swaps with itself).
// => question N asks items[N], and the correct option is ALWAYS index 0.
// This gives the tests deterministic ground truth without reading the
// component's own correct-marker (no circularity).
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.9999999);
});
afterEach(() => {
  vi.restoreAllMocks();
});

function getOptionButtons() {
  return screen.getAllByRole('button').filter((b) => {
    const label = b.textContent ?? '';
    return items.some((it) => label.includes(it.japanese));
  });
}

describe('ListeningQuiz', () => {
  it('renders the first question, audio prompt, and exactly 4 options', () => {
    renderWithRouter(<ListeningQuiz items={items} />);
    expect(screen.getByText(/Question 1 \//)).toBeTruthy();
    expect(screen.getByLabelText('Play audio')).toBeTruthy();
    expect(getOptionButtons()).toHaveLength(4);
    expect(screen.queryByRole('button', { name: /Next Question|See Results/ })).toBeNull();
  });

  it('scores a CORRECT pick (option 0) as 1/1 with a success message', () => {
    renderWithRouter(<ListeningQuiz items={items} />);
    // Identity shuffle => option index 0 is the correct answer for question 1 (items[0]).
    fireEvent.click(getOptionButtons()[0]);

    const feedback = screen.getByRole('status');
    expect(feedback.textContent).toMatch(/Correct/);
    expect(screen.getByText(/Score: 1 \/ 1/)).toBeTruthy();

    // Options lock after answering, and exactly the chosen option 0 is marked ○.
    const opts = getOptionButtons();
    opts.forEach((b) => expect(b).toBeDisabled());
    const marked = opts.filter((b) => within(b).queryByText('○'));
    expect(marked).toHaveLength(1);
    expect(marked[0].textContent ?? '').toContain(items[0].japanese);
  });

  it('scores a WRONG pick (option 1) as 0/1 and reveals the correct japanese', () => {
    renderWithRouter(<ListeningQuiz items={items} />);
    // Identity shuffle => option index 1 is a distractor (wrong) for question 1.
    fireEvent.click(getOptionButtons()[1]);

    const feedback = screen.getByRole('status');
    expect(feedback.textContent).toMatch(/Incorrect/);
    // The correct answer (items[0].japanese) is revealed in the feedback line.
    expect(feedback.textContent).toContain(items[0].japanese);
    expect(screen.getByText(/Score: 0 \/ 1/)).toBeTruthy();
  });

  it('advances through every question, tallies an all-correct score, and restarts', () => {
    renderWithRouter(<ListeningQuiz items={items} />);

    // Answer all questions correctly (option 0 each time under the identity shuffle).
    for (let i = 0; i < items.length; i++) {
      expect(screen.getByText(new RegExp(`Question ${i + 1} /`))).toBeTruthy();
      fireEvent.click(getOptionButtons()[0]);
      fireEvent.click(screen.getByRole('button', { name: /Next Question|See Results/ }));
    }

    expect(screen.getByText('Quiz Complete!')).toBeTruthy();
    const status = screen.getByRole('status');
    // All correct => score equals the number of questions.
    expect(status.getAttribute('aria-label')).toMatch(
      new RegExp(`スコア ${items.length} / ${items.length}`),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }));
    expect(screen.getByText(/Question 1 \//)).toBeTruthy();
  });

  it('has no obvious accessibility violations on initial render', async () => {
    const { container } = renderWithRouter(<ListeningQuiz items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
