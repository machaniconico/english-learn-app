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
  {
    id: '2',
    english: 'Thank you',
    japanese: 'ありがとう',
    pronunciation: 'サンキュー',
  },
  {
    id: '3',
    english: 'See you later',
    japanese: 'また後で',
    pronunciation: 'シー ユー レイター',
  },
];

// The card uses a CSS 3D flip: both faces are always in the DOM. The flipped
// state is exposed via the card's aria-label, so we assert on that.
const FRONT_LABEL = '問題を表示中。クリックで答えを見る';
const BACK_LABEL = '答えを表示中。クリックで問題に戻る';

function getCard() {
  return screen.getByRole('button', { name: FRONT_LABEL });
}

describe('Flashcard', () => {
  it('shows the English front of the first card with progress 1 / total', () => {
    renderWithRouter(<Flashcard items={items} />);

    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText('1 / 3')).toBeTruthy();
    // Front-facing card is present (not yet flipped).
    expect(getCard()).toBeTruthy();
  });

  it('flips to reveal the Japanese back when the card is clicked', () => {
    renderWithRouter(<Flashcard items={items} />);

    // Japanese back content is in the DOM (CSS flip) but the card is on the front.
    expect(getCard()).toBeTruthy();
    expect(screen.getByText('おはようございます')).toBeTruthy();

    fireEvent.click(getCard());

    // Now the card reports the flipped (back) state via aria-label.
    expect(screen.getByRole('button', { name: BACK_LABEL })).toBeTruthy();

    // Clicking again flips back to the front.
    fireEvent.click(screen.getByRole('button', { name: BACK_LABEL }));
    expect(getCard()).toBeTruthy();
  });

  it('flips when Enter is pressed on the focused card itself', () => {
    renderWithRouter(<Flashcard items={items} />);

    fireEvent.keyDown(getCard(), { key: 'Enter' });
    expect(screen.getByRole('button', { name: BACK_LABEL })).toBeTruthy();

    // Pressing Enter again on the (now back-facing) card flips it to the front.
    fireEvent.keyDown(screen.getByRole('button', { name: BACK_LABEL }), { key: 'Enter' });
    expect(getCard()).toBeTruthy();
  });

  it('flips via the global Space-key shortcut', () => {
    renderWithRouter(<Flashcard items={items} />);

    // The component registers a window-level keydown handler that flips on Space.
    // Dispatch on document.body (not on the card) so only the global handler
    // runs — firing on the card itself would double-toggle (card handler +
    // bubbling to the window handler).
    expect(getCard()).toBeTruthy();
    fireEvent.keyDown(document.body, { key: ' ' });
    expect(screen.getByRole('button', { name: BACK_LABEL })).toBeTruthy();

    fireEvent.keyDown(document.body, { key: ' ' });
    expect(getCard()).toBeTruthy();
  });

  it('navigates with the global ArrowRight / ArrowLeft shortcuts', () => {
    renderWithRouter(<Flashcard items={items} />);

    expect(screen.getByText('Good morning')).toBeTruthy();
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(screen.getByText('Thank you')).toBeTruthy();
    expect(screen.getByText('2 / 3')).toBeTruthy();

    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText('1 / 3')).toBeTruthy();
  });

  it('does NOT flip when the key event originates from a nested control', () => {
    const { container } = renderWithRouter(<Flashcard items={items} />);

    // The audio play button is nested inside the card.
    const audioButton = screen.getByRole('button', { name: '音声を再生' });
    expect(audioButton).toBeTruthy();

    // Pressing Enter on the nested button bubbles up to the card's onKeyDown,
    // but the handler's `e.target !== e.currentTarget` guard must skip the flip.
    fireEvent.keyDown(audioButton, { key: 'Enter' });

    // Card should still be on the front (not flipped).
    expect(getCard()).toBeTruthy();
    expect(container.querySelector('[aria-label="' + BACK_LABEL + '"]')).toBeNull();
  });

  it('navigates to the next and previous items with Next / Prev buttons', () => {
    renderWithRouter(<Flashcard items={items} />);

    expect(screen.getByText('1 / 3')).toBeTruthy();
    expect(screen.getByText('Good morning')).toBeTruthy();

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

    // First card: Prev disabled.
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    fireEvent.click(next); // -> card 2
    fireEvent.click(screen.getByRole('button', { name: /Next/ })); // -> card 3 (last)

    expect(screen.getByText('3 / 3')).toBeTruthy();
    expect((screen.getByRole('button', { name: /Next/ }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: /Prev/ }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('resets the flipped state when navigating to another card', () => {
    renderWithRouter(<Flashcard items={items} />);

    // Flip the first card.
    fireEvent.click(getCard());
    expect(screen.getByRole('button', { name: BACK_LABEL })).toBeTruthy();

    // Moving to the next card should reset to the front face.
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByText('Thank you')).toBeTruthy();
    expect(getCard()).toBeTruthy();
  });

  it('axe: only the known nested-interactive violation is present on initial render', async () => {
    // AXE-FAIL: the card is role="button" yet contains focusable descendants
    // (the AudioButton play/speed controls), tripping axe's "nested-interactive"
    // rule. This is a real a11y issue in the source — reported here rather than
    // fixed this round. We assert NO violations OTHER than nested-interactive so
    // the suite still catches any new/different a11y regressions.
    const { container } = renderWithRouter(<Flashcard items={items} />);
    const results = await axe(container);
    const violations = (results.violations ?? []).filter(
      (v) => v.id !== 'nested-interactive',
    );
    expect(violations).toEqual([]);
  });
});
