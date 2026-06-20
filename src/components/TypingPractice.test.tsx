// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import TypingPractice from './TypingPractice';
import type { PhraseItem } from '../data/types';

expect.extend(matchers);

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

  it('has no axe accessibility violations (initial and after an incorrect check)', async () => {
    const { container } = renderWithRouter(<TypingPractice items={items} />);
    expect(await axe(container)).toHaveNoViolations();
    // After a wrong check the feedback live-region + audio button render
    type('wrong');
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
