// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, waitFor } from '../test/test-utils';
import MatchingGame from './MatchingGame';

expect.extend(matchers);

interface Item {
  english: string;
  japanese: string;
}

// Helper: read a card's identity by clicking it (reveals aria-label) — but instead
// we identify face-down cards via the underlying text content, which is always
// rendered in the DOM (the front face exists even while rotated). The accessible
// name is "Face-down card" until revealed, so we locate cards by their text node.

function getAllCardButtons(): HTMLButtonElement[] {
  return screen
    .getAllByRole('button')
    .filter((b) => b.textContent?.includes('?')) as HTMLButtonElement[];
}

// Find the card button whose front face contains the given text.
function findCardByText(text: string): HTMLButtonElement {
  const buttons = screen.getAllByRole('button') as HTMLButtonElement[];
  const match = buttons.find(
    (b) =>
      b.getAttribute('aria-label') === 'Face-down card' &&
      b.textContent?.includes(text)
  );
  if (!match) throw new Error(`No face-down card found containing "${text}"`);
  return match;
}

// Match a single pair (english + japanese) by clicking the two cards and waiting
// for the 600ms match animation to resolve.
async function matchPair(item: Item) {
  fireEvent.click(findCardByText(item.english));
  fireEvent.click(findCardByText(item.japanese));
}

describe('MatchingGame', () => {
  const items: Item[] = [
    { english: 'apple', japanese: 'りんご' },
    { english: 'dog', japanese: 'いぬ' },
  ];

  it('has no axe violations on initial render', async () => {
    const { container } = renderWithRouter(
      <MatchingGame items={items} title="マッチングゲーム" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the title and a face-down card for every english + japanese term', () => {
    renderWithRouter(<MatchingGame items={items} title="テストゲーム" />);

    expect(screen.getByText('テストゲーム')).toBeInTheDocument();
    // 2 pairs -> 4 cards, all face-down with "?" marker.
    expect(getAllCardButtons().length).toBe(4);
    // All cards start with the "Face-down card" accessible name.
    const faceDown = (screen.getAllByRole('button') as HTMLButtonElement[]).filter(
      (b) => b.getAttribute('aria-label') === 'Face-down card'
    );
    expect(faceDown.length).toBe(4);
  });

  it('reveals a card and starts the move counter on a mismatch, then hides them again', async () => {
    renderWithRouter(<MatchingGame items={items} title="ミス" />);

    // Click a mismatched pair: apple (english) + いぬ (japanese, wrong pair).
    fireEvent.click(findCardByText('apple'));
    fireEvent.click(findCardByText('いぬ'));

    // A move is registered.
    await waitFor(() => {
      expect(screen.getByText('1 手')).toBeInTheDocument();
    });

    // After the 1000ms mismatch timeout, both cards flip back (become face-down).
    await waitFor(
      () => {
        const faceDown = (
          screen.getAllByRole('button') as HTMLButtonElement[]
        ).filter((b) => b.getAttribute('aria-label') === 'Face-down card');
        expect(faceDown.length).toBe(4);
      },
      { timeout: 2000 }
    );
  });

  it('keeps a correctly matched pair revealed and updates the matched counter', async () => {
    renderWithRouter(<MatchingGame items={items} title="マッチ" />);

    await matchPair({ english: 'apple', japanese: 'りんご' });

    // After the 600ms match animation, the matched counter shows 1 / 2.
    await waitFor(
      () => {
        expect(screen.getByText('1 / 2')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // The matched cards are now disabled (cannot be re-clicked).
    const matchedButtons = (
      screen.getAllByRole('button') as HTMLButtonElement[]
    ).filter((b) => b.getAttribute('aria-label')?.includes('apple'));
    expect(matchedButtons.length).toBeGreaterThan(0);
    matchedButtons.forEach((b) => expect(b).toBeDisabled());
  });

  it('shows the completion (コンプリート) screen once every pair is matched', async () => {
    renderWithRouter(<MatchingGame items={items} title="完了" />);

    await matchPair({ english: 'apple', japanese: 'りんご' });
    await waitFor(
      () => expect(screen.getByText('1 / 2')).toBeInTheDocument(),
      { timeout: 2000 }
    );

    await matchPair({ english: 'dog', japanese: 'いぬ' });

    await waitFor(
      () => {
        expect(screen.getByText('コンプリート！')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Completion screen offers a "play again" button.
    expect(
      screen.getByRole('button', { name: /もう一度/ })
    ).toBeInTheDocument();
    // Stats are shown.
    expect(screen.getByText('タイム')).toBeInTheDocument();
    expect(screen.getByText('手数')).toBeInTheDocument();
  });

  it('resets the board when "もう一度" is clicked after completion', async () => {
    renderWithRouter(<MatchingGame items={items} title="リセット" />);

    await matchPair({ english: 'apple', japanese: 'りんご' });
    await waitFor(
      () => expect(screen.getByText('1 / 2')).toBeInTheDocument(),
      { timeout: 2000 }
    );
    await matchPair({ english: 'dog', japanese: 'いぬ' });
    await waitFor(
      () => expect(screen.getByText('コンプリート！')).toBeInTheDocument(),
      { timeout: 2000 }
    );

    fireEvent.click(screen.getByRole('button', { name: /もう一度/ }));

    // Back to the playing board: 4 face-down cards, counter reset to 0 / 2.
    await waitFor(() => {
      expect(screen.getByText('0 / 2')).toBeInTheDocument();
    });
    expect(getAllCardButtons().length).toBe(4);
    expect(screen.queryByText('コンプリート！')).not.toBeInTheDocument();
  });

  it('moves with arrow keys from the currently focused card after a click', () => {
    const manyItems: Item[] = [
      { english: 'apple', japanese: 'りんご' },
      { english: 'dog', japanese: 'いぬ' },
      { english: 'cat', japanese: 'ねこ' },
      { english: 'book', japanese: 'ほん' },
    ];
    renderWithRouter(<MatchingGame items={manyItems} title="フォーカス" />);

    const cards = getAllCardButtons();
    expect(cards.length).toBe(8);

    cards[5].focus();
    expect(document.activeElement).toBe(cards[5]);

    fireEvent.click(cards[5]);
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    expect(document.activeElement).toBe(cards[6]);
  });
});
