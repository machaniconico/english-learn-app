// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import TypingPractice from './TypingPractice';
import type { PhraseItem } from '../data/types';

expect.extend(matchers);

beforeEach(() => {
  // Records persist in localStorage; isolate each test.
  localStorage.clear();
});

/** Play through both questions, getting `correctOf2` of them right. */
function playRun(correctOf2: 0 | 1 | 2) {
  // Q1
  type(correctOf2 >= 1 ? 'Good morning' : 'wrong');
  fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
  fireEvent.click(screen.getByRole('button', { name: '次へ →' }));
  // Q2
  type(correctOf2 >= 2 ? 'Thank you' : 'wrong');
  fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
  fireEvent.click(screen.getByRole('button', { name: '結果を見る' }));
}

const items: PhraseItem[] = [
  { id: '1', english: 'Good morning', japanese: 'おはよう', pronunciation: 'グッドモーニング' },
  { id: '2', english: 'Thank you', japanese: 'ありがとう', pronunciation: 'サンキュー' },
];

function type(value: string) {
  fireEvent.change(screen.getByLabelText('英語を入力'), { target: { value } });
}

describe('TypingPractice', () => {
  it('shows the japanese prompt and a disabled check button until typing', () => {
    renderWithRouter(<TypingPractice items={items} />);
    expect(screen.getByText('おはよう')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'チェック' })).toBeDisabled();
    type('hi');
    expect(screen.getByRole('button', { name: 'チェック' })).not.toBeDisabled();
  });

  it('accepts a correct answer (case/punctuation-insensitive) and counts it', () => {
    renderWithRouter(<TypingPractice items={items} />);
    type('good morning.');
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
    expect(screen.getByText('🎉 正解！')).toBeTruthy();
    expect(screen.getByText(/正解: 1/)).toBeTruthy();
  });

  it('rejects a misspelling, shows the correct spelling and the user input', () => {
    renderWithRouter(<TypingPractice items={items} />);
    type('good mornin');
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
    expect(screen.getByText('❌ 不正解')).toBeTruthy();
    expect(screen.getByText('Good morning')).toBeTruthy(); // correct spelling revealed
    expect(screen.getByText(/あなたの入力: good mornin/)).toBeTruthy();
  });

  it('reveals the answer with 答えを見る (no correct count)', () => {
    renderWithRouter(<TypingPractice items={items} />);
    fireEvent.click(screen.getByRole('button', { name: '答えを見る' }));
    expect(screen.getByText('答え')).toBeTruthy();
    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText(/正解: 0/)).toBeTruthy();
  });

  it('advances to a results screen with the final score', () => {
    renderWithRouter(<TypingPractice items={items} />);
    // Q1 correct
    type('Good morning');
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
    fireEvent.click(screen.getByRole('button', { name: '次へ →' }));
    // Q2 correct
    type('Thank you');
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
    fireEvent.click(screen.getByRole('button', { name: '結果を見る' }));

    expect(screen.getByText('タイピング練習 完了')).toBeTruthy();
    expect(screen.getByRole('status', { name: /2 \/ 2 正解/ })).toBeTruthy();
  });

  it('submits on Enter via the form', () => {
    renderWithRouter(<TypingPractice items={items} />);
    type('Good morning');
    fireEvent.submit(screen.getByLabelText('英語を入力').closest('form')!);
    expect(screen.getByText('🎉 正解！')).toBeTruthy();
  });

  it('does not double-count when the form is submitted again after checking', () => {
    renderWithRouter(<TypingPractice items={items} />);
    type('Good morning');
    const form = screen.getByLabelText('英語を入力').closest('form')!;
    fireEvent.submit(form);
    expect(screen.getByText(/正解: 1/)).toBeTruthy();
    // A second submit (e.g. stray Enter) must not increment again
    fireEvent.submit(form);
    expect(screen.getByText(/正解: 1/)).toBeTruthy();
  });

  it('restarts back to the first question with a reset score', () => {
    renderWithRouter(<TypingPractice items={items} />);
    type('Good morning');
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
    fireEvent.click(screen.getByRole('button', { name: '次へ →' }));
    type('Thank you');
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
    fireEvent.click(screen.getByRole('button', { name: '結果を見る' }));

    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));
    expect(screen.getByText('おはよう')).toBeTruthy();
    expect(screen.getByText(/正解: 0/)).toBeTruthy();
  });

  it('shows the personal best and play count on the results screen', () => {
    renderWithRouter(<TypingPractice items={items} />);
    playRun(2); // 100%

    expect(screen.getByText('タイピング練習 完了')).toBeTruthy();
    // Play count: "プレイ回数:" label with the count "1" in a sibling span.
    const playCount = screen.getByText(/プレイ回数:/);
    expect(playCount.textContent).toMatch(/プレイ回数:\s*1\s*回/);
    // best-related text (either celebration or quiet best) mentions 自己ベスト
    expect(screen.getByText(/自己ベスト/)).toBeTruthy();
  });

  it('celebrates a new personal best, but not on a later worse run', () => {
    // First run: 100% — a new best from 0
    const { unmount } = renderWithRouter(<TypingPractice items={items} />);
    playRun(2);
    expect(screen.getByText(/自己ベスト更新/)).toBeTruthy();
    unmount();

    // Second run (fresh mount, record restored): 50% — below the 100% best
    renderWithRouter(<TypingPractice items={items} />);
    playRun(1);
    expect(screen.queryByText(/自己ベスト更新/)).toBeNull();
    // Quiet best display still shows the retained 100%
    expect(screen.getByText(/自己ベスト 100%/)).toBeTruthy();
  });

  it('does not double-record a run across restart + replay (plays counts each run once)', () => {
    renderWithRouter(<TypingPractice items={items} />);
    playRun(2); // play #1
    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));
    playRun(2); // play #2

    const saved = JSON.parse(
      localStorage.getItem('english-learn-typing-records') ?? 'null',
    ) as { plays: number; history: unknown[] };
    expect(saved.plays).toBe(2);
    expect(saved.history).toHaveLength(2);
  });

  it('has no axe accessibility violations (initial and after an incorrect check)', async () => {
    const { container } = renderWithRouter(<TypingPractice items={items} />);
    expect(await axe(container)).toHaveNoViolations();
    // After a wrong check the feedback live-region + audio button render
    type('wrong');
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
