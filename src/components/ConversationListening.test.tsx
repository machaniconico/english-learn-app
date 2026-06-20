// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import ConversationListening from './ConversationListening';
import type { Part3Question } from '../data/types';

expect.extend(matchers);

const conversations: Part3Question[] = [
  {
    id: 'c1',
    level: 'beginner',
    conversation: [
      { speaker: 'Man', text: 'Where is the meeting?' },
      { speaker: 'Woman', text: 'In room 5 at noon.' },
    ],
    questions: [
      {
        question: 'Where is the meeting?',
        questionJa: '会議はどこですか？',
        options: ['Room 5', 'Room 6', 'Room 7', 'Room 8'],
        correctIndex: 0,
        explanation: 'She says room 5.',
      },
      {
        question: 'When is the meeting?',
        questionJa: '会議はいつですか？',
        options: ['Morning', 'Noon', 'Evening', 'Night'],
        correctIndex: 1,
        explanation: 'She says at noon.',
      },
    ],
  },
  {
    id: 'c2',
    level: 'intermediate',
    conversation: [{ speaker: 'Woman', text: 'The report is due Friday.' }],
    questions: [
      {
        question: 'When is the report due?',
        questionJa: 'レポートの締め切りは？',
        options: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
        correctIndex: 2,
        explanation: 'She says Friday.',
      },
    ],
  },
];

describe('ConversationListening', () => {
  it('answers a sub-question correctly, advances through questions, and progresses conversations to the results screen', () => {
    renderWithRouter(<ConversationListening conversations={conversations} />);

    // First conversation header + first question
    expect(screen.getByText('Conversation 1 / 2')).toBeTruthy();
    expect(screen.getByText('Question 1 / 2')).toBeTruthy();
    expect(screen.getByText('Where is the meeting?')).toBeTruthy();

    // Answer Q1 correctly (correctIndex 0 -> "Room 5")
    fireEvent.click(screen.getByText('Room 5'));
    // Correct feedback shown
    expect(screen.getByText('🎉 正解！')).toBeTruthy();
    // Score reflects 1 correct out of 1 answered
    expect(screen.getByText('Score: 1 / 1')).toBeTruthy();

    // Advance to next question within the same conversation
    fireEvent.click(screen.getByText('次の質問 →'));
    expect(screen.getByText('Question 2 / 2')).toBeTruthy();

    // Answer Q2 incorrectly (pick "Morning", correct is "Noon")
    fireEvent.click(screen.getByText('Morning'));
    expect(screen.getByText(/不正解。正答は \(B\)/)).toBeTruthy();
    // Score: still 1 correct, now 2 answered
    expect(screen.getByText('Score: 1 / 2')).toBeTruthy();

    // Last question of conversation -> button shows script prompt
    fireEvent.click(screen.getByText('スクリプトを見る →'));
    // Script revealed (conversation text appears)
    expect(screen.getByText('In room 5 at noon.')).toBeTruthy();

    // Move to next conversation
    fireEvent.click(screen.getByText('次の会話 →'));
    expect(screen.getByText('Conversation 2 / 2')).toBeTruthy();
    expect(screen.getByText('When is the report due?')).toBeTruthy();

    // Answer the single question of conv 2 correctly ("Friday")
    fireEvent.click(screen.getByText('Friday'));
    expect(screen.getByText('Score: 2 / 3')).toBeTruthy();

    // Last (only) question of the last conversation -> button shows script prompt
    fireEvent.click(screen.getByText('スクリプトを見る →'));
    // Last conversation -> next button reads "結果を見る"
    fireEvent.click(screen.getByText('結果を見る'));

    // Results screen: 2 correct out of 3 total questions
    expect(screen.getByText('Results / 結果')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('/ 3')).toBeTruthy();
  });

  it('has no axe violations on the question screen', async () => {
    const { container } = renderWithRouter(
      <ConversationListening conversations={conversations} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
