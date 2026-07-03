// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, within, act } from '../test/test-utils';
import DailyChallenge from './DailyChallenge';

expect.extend(matchers);

type RenderedChallenge = ReturnType<typeof renderWithRouter>;

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function storageKey(date = todayString()): string {
  return `english-learn-daily-challenge-${date}`;
}

function readStoredState(): { completed: boolean[] } {
  const raw = localStorage.getItem(storageKey());
  if (!raw) throw new Error('daily challenge state was not saved');
  return JSON.parse(raw) as { completed: boolean[] };
}

function getChallengeCard(title: string): HTMLElement {
  const header = screen.getByText(title).closest('button');
  if (!header?.parentElement) throw new Error(`Challenge card not found: ${title}`);
  return header.parentElement;
}

function expandChallenge(title: string): HTMLElement {
  const header = screen.getByText(title).closest('button');
  if (!header) throw new Error(`Challenge header not found: ${title}`);
  fireEvent.click(header);
  return getChallengeCard(title);
}

function getOptionButtons(card: HTMLElement): HTMLButtonElement[] {
  return within(card).getAllByRole('button').filter(
    button => button.getAttribute('aria-pressed') !== null && !button.hasAttribute('aria-label'),
  ) as HTMLButtonElement[];
}

function submitOptionChallenge(card: HTMLElement, optionIndex: number): HTMLElement {
  const options = getOptionButtons(card);
  if (optionIndex >= options.length) {
    throw new Error(`Option ${optionIndex} is not available`);
  }
  fireEvent.click(options[optionIndex]);
  fireEvent.click(within(card).getByRole('button', { name: '回答する' }));
  return within(card).getByRole('status');
}

function statusIsCorrect(status: HTMLElement): boolean {
  return (status.textContent ?? '').trim().startsWith('正解！');
}

function renderWithOptionOutcome(title: string, expectedCorrect: boolean): {
  view: RenderedChallenge;
  card: HTMLElement;
  status: HTMLElement;
} {
  for (let optionIndex = 0; optionIndex < 6; optionIndex += 1) {
    localStorage.clear();
    const view = renderWithRouter(<DailyChallenge />);
    const card = expandChallenge(title);
    const options = getOptionButtons(card);
    if (optionIndex >= options.length) {
      view.unmount();
      break;
    }

    const status = submitOptionChallenge(card, optionIndex);
    if (statusIsCorrect(status) === expectedCorrect) {
      return { view, card, status };
    }

    view.unmount();
  }

  throw new Error(`Could not find ${expectedCorrect ? 'correct' : 'incorrect'} option for ${title}`);
}

function discoverTranslationAnswer(): string {
  localStorage.clear();
  const view = renderWithRouter(<DailyChallenge />);
  const card = expandChallenge('Translation Quiz');
  const input = within(card).getByLabelText('英語の訳を入力');
  fireEvent.change(input, { target: { value: '__daily_challenge_wrong_answer__' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  const status = within(card).getByRole('status');
  const match = (status.textContent ?? '').match(/正解:\s*(.*?)あなたの回答:/);
  view.unmount();

  if (!match) throw new Error('Could not discover translation answer from feedback');
  return match[1].trim();
}

function completeAllChallenges() {
  let card = expandChallenge('Word of the Day');
  fireEvent.click(within(card).getByRole('button', { name: '覚えた！' }));

  card = expandChallenge('Fill in the Blank');
  submitOptionChallenge(card, 0);

  card = expandChallenge('Translation Quiz');
  const input = within(card).getByLabelText('英語の訳を入力');
  fireEvent.change(input, { target: { value: '__completion_attempt__' } });
  fireEvent.keyDown(input, { key: 'Enter' });

  card = expandChallenge('Listening Challenge');
  submitOptionChallenge(card, 0);

  card = expandChallenge('Idiom of the Day');
  fireEvent.click(within(card).getByRole('button', { name: '覚えた！' }));
}

describe('DailyChallenge', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the header and all five challenge cards', () => {
    const { container } = renderWithRouter(<DailyChallenge />);
    expect(screen.getByText('Daily Challenge')).toBeTruthy();
    expect(screen.getByText('0/5 完了')).toBeTruthy();
    expect(screen.getByText('Word of the Day')).toBeTruthy();
    expect(screen.getByText('Fill in the Blank')).toBeTruthy();
    expect(screen.getByText('Translation Quiz')).toBeTruthy();
    expect(screen.getByText('Listening Challenge')).toBeTruthy();
    expect(screen.getByText('Idiom of the Day')).toBeTruthy();
    // No content visible yet (cards are collapsed)
    expect(container.querySelector('[role="status"]')).toBeNull();
  });

  it('expands a challenge card when clicked and shows its content', () => {
    renderWithRouter(<DailyChallenge />);
    // Click the "Word of the Day" card header button
    const wordCardButton = screen.getByText('Word of the Day').closest('button');
    expect(wordCardButton).not.toBeNull();
    fireEvent.click(wordCardButton!);
    // After expanding, the "覚えた！" button for the word challenge should appear
    expect(screen.getByRole('button', { name: '覚えた！' })).toBeTruthy();
  });

  it('marks a word-of-the-day card as completed when 覚えた is clicked', () => {
    renderWithRouter(<DailyChallenge />);
    // Expand the word card
    const wordCardButton = screen.getByText('Word of the Day').closest('button');
    fireEvent.click(wordCardButton!);
    // Click the 覚えた！ button
    fireEvent.click(screen.getByRole('button', { name: '覚えた！' }));
    // Counter should now say 1/5 completed
    expect(screen.getByText('1/5 完了')).toBeTruthy();
  });

  it('marks a correct fill-in-the-blank selection and persists completion', () => {
    const { status } = renderWithOptionOutcome('Fill in the Blank', true);

    expect(status.textContent?.trim().startsWith('正解！')).toBe(true);
    expect(screen.getByText('1/5 完了')).toBeTruthy();
    expect(readStoredState().completed[1]).toBe(true);
  });

  it('shows incorrect feedback for a wrong fill-in-the-blank selection', () => {
    const { status } = renderWithOptionOutcome('Fill in the Blank', false);

    expect(status.textContent?.trim().startsWith('不正解...')).toBe(true);
  });

  it('accepts a case-insensitive translation answer submitted with Enter', () => {
    const answer = discoverTranslationAnswer();
    localStorage.clear();
    renderWithRouter(<DailyChallenge />);
    const card = expandChallenge('Translation Quiz');
    const input = within(card).getByLabelText('英語の訳を入力');

    fireEvent.change(input, { target: { value: answer.toUpperCase() } });
    fireEvent.keyDown(input, { key: 'Enter' });

    const status = within(card).getByRole('status');
    expect(status.textContent?.trim().startsWith('正解！')).toBe(true);
    expect(screen.getByText('1/5 完了')).toBeTruthy();
    expect(readStoredState().completed[2]).toBe(true);
  });

  it('shows incorrect feedback for a mismatched translation answer', () => {
    renderWithRouter(<DailyChallenge />);
    const card = expandChallenge('Translation Quiz');
    const input = within(card).getByLabelText('英語の訳を入力');

    fireEvent.change(input, { target: { value: '__not_the_translation__' } });
    fireEvent.click(within(card).getByRole('button', { name: '回答する' }));

    const status = within(card).getByRole('status');
    expect(status.textContent).toContain('正解:');
    expect(status.textContent).toContain('あなたの回答: __not_the_translation__');
  });

  it('judges correct and incorrect listening selections', () => {
    const correct = renderWithOptionOutcome('Listening Challenge', true);
    expect(correct.status.textContent?.trim().startsWith('正解！')).toBe(true);
    expect(screen.getByText('1/5 完了')).toBeTruthy();
    correct.view.unmount();

    const wrong = renderWithOptionOutcome('Listening Challenge', false);
    expect(wrong.status.textContent?.trim().startsWith('不正解...')).toBe(true);
  });

  it('shows the all-complete celebration and dismisses it after three seconds', () => {
    vi.useFakeTimers();
    renderWithRouter(<DailyChallenge />);

    completeAllChallenges();

    expect(screen.getByText('5/5 完了')).toBeTruthy();
    expect(screen.getByText('全チャレンジ完了！')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('全チャレンジ完了！')).toBeNull();
  });

  it('falls back to default state for corrupted localStorage and still completes an answer', () => {
    const invalidStates = ['{}', '{"completed":"x"}', 'not json'];

    for (const invalidState of invalidStates) {
      localStorage.clear();
      localStorage.setItem(storageKey(), invalidState);

      let view: RenderedChallenge | undefined;
      expect(() => {
        view = renderWithRouter(<DailyChallenge />);
      }).not.toThrow();
      if (!view) throw new Error('DailyChallenge did not render');

      expect(screen.getByText('0/5 完了')).toBeTruthy();
      expect(() => {
        const card = expandChallenge('Word of the Day');
        fireEvent.click(within(card).getByRole('button', { name: '覚えた！' }));
      }).not.toThrow();
      expect(screen.getByText('1/5 完了')).toBeTruthy();

      view.unmount();
    }
  });

  it('restores completion state when revisiting on the same day', () => {
    const first = renderWithRouter(<DailyChallenge />);
    let card = expandChallenge('Word of the Day');
    fireEvent.click(within(card).getByRole('button', { name: '覚えた！' }));
    expect(readStoredState().completed[0]).toBe(true);
    first.unmount();

    renderWithRouter(<DailyChallenge />);
    expect(screen.getByText('1/5 完了')).toBeTruthy();
    card = expandChallenge('Word of the Day');
    expect(within(card).queryByRole('button', { name: '覚えた！' })).toBeNull();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<DailyChallenge />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
