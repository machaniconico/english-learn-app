// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import Flashcard from './Flashcard';
import type { PhraseItem } from '../data/types';

expect.extend(matchers);

const items: PhraseItem[] = [
  {
    id: '1',
    english: 'Good morning',
    japanese: 'おはようございます',
    pronunciation: 'グッド モーニング',
    example: 'Good morning, everyone.',
    exampleJa: 'みなさん、おはよう。',
  },
  { id: '2', english: 'Thank you', japanese: 'ありがとう', pronunciation: 'サンキュー' },
  { id: '3', english: 'See you later', japanese: 'また後で', pronunciation: 'シー ユー レイター' },
];

// Flip state is exposed via the dedicated flip button: its label is
// 答えを見る (front) / 問題に戻る (back) and aria-pressed reflects flipped.
function flipButton() {
  return screen.getByRole('button', { name: /答えを見る|問題に戻る/ });
}
function isFlipped() {
  return flipButton().getAttribute('aria-pressed') === 'true';
}

describe('Flashcard', () => {
  it('shows the English front of the first card with progress 1 / total', () => {
    renderWithRouter(<Flashcard items={items} />);
    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText('1 / 3')).toBeTruthy();
    expect(flipButton()).toHaveAccessibleName('答えを見る');
    expect(isFlipped()).toBe(false);
  });

  it('flips via the dedicated flip button and back again', () => {
    renderWithRouter(<Flashcard items={items} />);
    expect(isFlipped()).toBe(false);

    fireEvent.click(flipButton());
    expect(isFlipped()).toBe(true);
    expect(flipButton()).toHaveAccessibleName('問題に戻る');

    fireEvent.click(flipButton());
    expect(isFlipped()).toBe(false);
  });

  it('flips when the card surface itself is clicked (mouse convenience)', () => {
    renderWithRouter(<Flashcard items={items} />);
    // Clicking the English text bubbles to the card's onClick handler.
    fireEvent.click(screen.getByText('Good morning'));
    expect(isFlipped()).toBe(true);
  });

  it('flips via the global Space-key shortcut (fired off a non-button target)', () => {
    renderWithRouter(<Flashcard items={items} />);
    fireEvent.keyDown(document.body, { key: ' ' });
    expect(isFlipped()).toBe(true);
    fireEvent.keyDown(document.body, { key: ' ' });
    expect(isFlipped()).toBe(false);
  });

  it('does NOT run the global flip when Space targets a button (no double toggle)', () => {
    renderWithRouter(<Flashcard items={items} />);
    // The global handler bails for button targets so a focused button's own
    // Space activation is not duplicated by the window-level flip.
    fireEvent.keyDown(screen.getByRole('button', { name: /Next/ }), { key: ' ' });
    expect(isFlipped()).toBe(false);
  });

  it('navigates with the global ArrowRight / ArrowLeft shortcuts', () => {
    renderWithRouter(<Flashcard items={items} />);
    expect(screen.getByText('Good morning')).toBeTruthy();
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(screen.getByText('Thank you')).toBeTruthy();
    expect(screen.getByText('2 / 3')).toBeTruthy();
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(screen.getByText('Good morning')).toBeTruthy();
  });

  it('navigates to the next and previous items with Next / Prev buttons', () => {
    renderWithRouter(<Flashcard items={items} />);
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByText('2 / 3')).toBeTruthy();
    expect(screen.getByText('Thank you')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Prev/ }));
    expect(screen.getByText('1 / 3')).toBeTruthy();
    expect(screen.getByText('Good morning')).toBeTruthy();
  });

  it('disables Prev on the first card and Next on the last card', () => {
    renderWithRouter(<Flashcard items={items} />);
    const prev = screen.getByRole('button', { name: /Prev/ }) as HTMLButtonElement;
    const next = screen.getByRole('button', { name: /Next/ }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    fireEvent.click(next);
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByText('3 / 3')).toBeTruthy();
    expect((screen.getByRole('button', { name: /Next/ }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: /Prev/ }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('resets the flipped state when navigating to another card', () => {
    renderWithRouter(<Flashcard items={items} />);
    fireEvent.click(flipButton());
    expect(isFlipped()).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByText('Thank you')).toBeTruthy();
    expect(isFlipped()).toBe(false);
  });

  it('has no axe accessibility violations on initial render', async () => {
    const { container } = renderWithRouter(<Flashcard items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
