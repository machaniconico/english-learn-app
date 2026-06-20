// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import Part3Page from './Part3Page';

expect.extend(matchers);

describe('Part3Page', () => {
  it('renders the list view with heading and conversation cards', () => {
    const { container } = renderWithRouter(<Part3Page />);
    // Main heading
    expect(screen.getByRole('heading', { name: /Part 3: Conversations/i })).toBeTruthy();
    // At least one conversation card (there are multiple conversations in the data)
    const cards = container.querySelectorAll('button[type="button"]');
    // Filter buttons (all/beginner/intermediate/advanced) + conversation cards + "Play All" button
    expect(cards.length).toBeGreaterThan(4);
  });

  it('shows level filter buttons and filters by level when clicked', () => {
    renderWithRouter(<Part3Page />);

    const beginnerFilter = screen.getByRole('button', { name: 'Beginner' });
    expect(beginnerFilter).toBeTruthy();

    fireEvent.click(beginnerFilter);

    // After filtering, "Conversation 1" card title should still be present (beginner conversations exist)
    expect(screen.getAllByText(/^Conversation \d+/).length).toBeGreaterThan(0);
  });

  it('navigates into a conversation when a card is clicked and shows back button', () => {
    renderWithRouter(<Part3Page />);

    // Click the first conversation card ("Conversation 1")
    const convCards = screen.getAllByText(/^Conversation \d+/);
    fireEvent.click(convCards[0]);

    // Should now show the practice view with "Part 3 Conversation" heading
    expect(screen.getByRole('heading', { name: /Part 3 Conversation/i })).toBeTruthy();
    // Back button should be present
    expect(screen.getAllByRole('button', { name: /問題一覧に戻る/ }).length).toBeGreaterThan(0);
  });

  it('has no axe accessibility violations on the list view', async () => {
    const { container } = renderWithRouter(<Part3Page />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
