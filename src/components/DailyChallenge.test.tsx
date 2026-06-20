// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import DailyChallenge from './DailyChallenge';

expect.extend(matchers);

describe('DailyChallenge', () => {
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

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<DailyChallenge />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
