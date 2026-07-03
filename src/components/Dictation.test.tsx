// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, waitFor } from '../test/test-utils';
import Dictation from './Dictation';
import type { DictationItem } from '../data/types';

expect.extend(matchers);

const items: DictationItem[] = [
  {
    id: 'd1',
    sentence: 'I like coffee',
    japanese: '私はコーヒーが好きです',
    hint: 'a hot drink',
    level: 'beginner',
  },
  {
    id: 'd2',
    sentence: 'She runs fast',
    japanese: '彼女は速く走ります',
    level: 'beginner',
  },
];

function type(value: string) {
  const input = screen.getByLabelText('聞こえた英語を入力') as HTMLInputElement;
  fireEvent.change(input, { target: { value } });
  return input;
}

describe('Dictation', () => {
  it('renders the first question with progress and score', () => {
    renderWithRouter(<Dictation items={items} />);
    expect(screen.getByText('Question 1 / 2')).toBeTruthy();
    expect(screen.getByText('Score: 0 / 0')).toBeTruthy();
    const progressBar = screen.getByRole('progressbar', { name: '問題の進捗' });
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '2');
    expect(screen.getByLabelText('聞こえた英語を入力')).toBeTruthy();
  });

  it('disables check button until something is typed', () => {
    renderWithRouter(<Dictation items={items} />);
    const check = screen.getByRole('button', { name: 'チェックする' }) as HTMLButtonElement;
    expect(check.disabled).toBe(true);
    type('I like coffee');
    expect(check.disabled).toBe(false);
  });

  it('grades an exact match as Perfect and reveals the Japanese translation', () => {
    renderWithRouter(<Dictation items={items} />);
    type('I like coffee');
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));

    expect(screen.getByText('Perfect! 完璧！')).toBeTruthy();
    // Japanese revealed after answering
    expect(screen.getByText('私はコーヒーが好きです')).toBeTruthy();
    // Next button appears
    expect(screen.getByRole('button', { name: 'Next →' })).toBeTruthy();
  });

  it('grades a clearly wrong answer as Incorrect and shows the typed answer', () => {
    renderWithRouter(<Dictation items={items} />);
    type('totally different text here');
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));

    expect(screen.getByText('Incorrect / 不正解')).toBeTruthy();
    // Shows the user's own answer back in the feedback
    expect(screen.getByText('totally different text here')).toBeTruthy();
  });

  it('reveals a hint when the hint button is clicked', () => {
    renderWithRouter(<Dictation items={items} />);
    fireEvent.click(screen.getByRole('button', { name: 'ヒントを見る' }));
    expect(screen.getByText('a hot drink')).toBeTruthy();
  });

  it('advances to the next question and resets the input', async () => {
    renderWithRouter(<Dictation items={items} />);
    type('I like coffee');
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }));

    expect(screen.getByText('Question 2 / 2')).toBeTruthy();
    const input = screen.getByLabelText('聞こえた英語を入力') as HTMLInputElement;
    expect(input.value).toBe('');
    // Score carried over from the first perfect answer (10 of a possible 10 so far)
    expect(screen.getByText('Score: 10 / 10')).toBeTruthy();
  });

  it('shows the results screen after the last question with correct score', () => {
    renderWithRouter(<Dictation items={items} />);

    // Q1: perfect
    type('I like coffee');
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }));

    // Q2: wrong
    type('nonsense words');
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));
    fireEvent.click(screen.getByRole('button', { name: 'See Results / 結果を見る' }));

    expect(screen.getByText('Results / 結果')).toBeTruthy();
    // 1 perfect (10) + 1 wrong (0) = 10 of 20
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('Perfect: 1')).toBeTruthy();
    expect(screen.getByText('Wrong: 1')).toBeTruthy();
    const scoreBar = screen.getByRole('progressbar', { name: 'スコア' });
    expect(scoreBar).toHaveAttribute('aria-valuenow', '50');
    expect(scoreBar).toHaveAttribute('aria-valuemax', '100');
    // Mistakes review section shows the wrong item's translation
    expect(screen.getByText('彼女は速く走ります')).toBeTruthy();
  });

  it('restarts from the results screen back to the first question', () => {
    renderWithRouter(<Dictation items={items} />);
    type('I like coffee');
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }));
    type('nonsense words');
    fireEvent.click(screen.getByRole('button', { name: 'チェックする' }));
    fireEvent.click(screen.getByRole('button', { name: 'See Results / 結果を見る' }));

    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));
    expect(screen.getByText('Question 1 / 2')).toBeTruthy();
    expect(screen.getByText('Score: 0 / 0')).toBeTruthy();
  });

  it('toggles the playback speed button on and off', () => {
    renderWithRouter(<Dictation items={items} />);
    const speed = screen.getByRole('button', { name: '再生速度の切り替え' });
    expect(speed.getAttribute('aria-pressed')).toBe('false');
    expect(speed.textContent).toContain('1x');
    fireEvent.click(speed);
    expect(speed.getAttribute('aria-pressed')).toBe('true');
    expect(speed.textContent).toContain('0.6x');
  });

  it('has no accessibility violations on the question screen', async () => {
    const { container } = renderWithRouter(<Dictation items={items} />);
    await waitFor(async () => {
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
