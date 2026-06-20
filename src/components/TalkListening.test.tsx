// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import TalkListening from './TalkListening';
import type { Part4Question } from '../data/types';

expect.extend(matchers);

// Two talks: talk A has 2 questions, talk B has 1 question. Total = 3 questions.
const talks: Part4Question[] = [
  {
    id: 't1',
    type: 'announcement',
    typeJa: 'お知らせ',
    talk: 'Attention all passengers, the train to Boston is now boarding at platform two.',
    level: 'beginner',
    questions: [
      {
        question: 'Where is the train going?',
        questionJa: '電車はどこ行きですか?',
        options: ['Boston', 'Chicago', 'Denver', 'Seattle'],
        correctIndex: 0,
        explanation: 'アナウンスでBoston行きと述べられています。',
      },
      {
        question: 'Which platform?',
        questionJa: 'どのプラットフォームですか?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctIndex: 1,
        explanation: 'platform twoと述べられています。',
      },
    ],
  },
  {
    id: 't2',
    type: 'voicemail',
    typeJa: '留守番電話',
    talk: 'Hi, this is Dr. Smith calling to confirm your appointment for Friday at ten.',
    level: 'intermediate',
    questions: [
      {
        question: 'What day is the appointment?',
        questionJa: '予約は何曜日ですか?',
        options: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
        correctIndex: 2,
        explanation: 'Fridayと述べられています。',
      },
    ],
  },
];

describe('TalkListening', () => {
  it('answers a question correctly and shows the correct marker + score', () => {
    renderWithRouter(<TalkListening talks={talks} />);

    // First question of first talk
    expect(screen.getByText('Where is the train going?')).toBeTruthy();
    // Score starts at 0 / 0 (no answers yet)
    expect(screen.getByText(/Score: 0 \/ 0/)).toBeTruthy();

    // Click the correct option (index 0 -> 'Boston')
    fireEvent.click(screen.getByText('Boston'));

    // Correct feedback appears
    expect(screen.getByText(/正解/)).toBeTruthy();
    // Score updates: 1 correct / 1 answered
    expect(screen.getByText(/Score: 1 \/ 1/)).toBeTruthy();
  });

  it('marks an incorrect answer and reveals the right answer label', () => {
    renderWithRouter(<TalkListening talks={talks} />);

    // Pick a wrong option (correct is 'Boston' / index 0). Click 'Chicago'.
    fireEvent.click(screen.getByText('Chicago'));

    // Incorrect feedback shows the correct answer label (A)
    expect(screen.getByText(/不正解/)).toBeTruthy();
    expect(screen.getByText(/正答は \(A\)/)).toBeTruthy();
    // Score: 0 correct / 1 answered
    expect(screen.getByText(/Score: 0 \/ 1/)).toBeTruthy();
  });

  it('progresses through questions, talks, and reaches the results screen', () => {
    renderWithRouter(<TalkListening talks={talks} />);

    // --- Talk 1, Question 1 (correct: Boston) ---
    expect(screen.getByText('Talk 1 / 2')).toBeTruthy();
    expect(screen.getByText('Question 1 / 2')).toBeTruthy();
    fireEvent.click(screen.getByText('Boston'));
    fireEvent.click(screen.getByText(/次の質問/));

    // --- Talk 1, Question 2 (correct: Two) ---
    expect(screen.getByText('Question 2 / 2')).toBeTruthy();
    fireEvent.click(screen.getByText('Two'));
    // Last question of talk -> button becomes "スクリプトを見る"
    fireEvent.click(screen.getByText(/スクリプトを見る/));

    // Script is now visible (talk text shown)
    expect(
      screen.getByText(/Attention all passengers/)
    ).toBeTruthy();

    // Move to next talk
    fireEvent.click(screen.getByText(/次のトーク/));

    // --- Talk 2, Question 1 (correct: Friday) ---
    expect(screen.getByText('Talk 2 / 2')).toBeTruthy();
    expect(screen.getByText('What day is the appointment?')).toBeTruthy();
    fireEvent.click(screen.getByText('Friday'));
    // Last question of last talk -> "スクリプトを見る"
    fireEvent.click(screen.getByText(/スクリプトを見る/));

    // Last talk -> button is "結果を見る"
    fireEvent.click(screen.getByText('結果を見る'));

    // --- Results screen ---
    expect(screen.getByText(/Results/)).toBeTruthy();
    // All 3 answered correctly
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText(/\/ 3/)).toBeTruthy();
    expect(screen.getByText('100% correct')).toBeTruthy();

    // Restart returns to first talk
    fireEvent.click(screen.getByText('もう一度挑戦'));
    expect(screen.getByText('Talk 1 / 2')).toBeTruthy();
    expect(screen.getByText(/Score: 0 \/ 0/)).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithRouter(<TalkListening talks={talks} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
