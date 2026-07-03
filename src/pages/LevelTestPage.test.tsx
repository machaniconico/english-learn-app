// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { levelTestQuestions } from '../data/levelTest';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import LevelTestPage from './LevelTestPage';

expect.extend(matchers);

function startLevelTest() {
  fireEvent.click(screen.getByRole('button', { name: 'テストを始める' }));
}

function answerAndContinue(questionIndex: number, optionIndex: number) {
  const question = levelTestQuestions[questionIndex];
  expect(screen.getByRole('heading', { level: 2, name: question.question })).toBeTruthy();

  const optionButton = screen
    .getAllByRole('button')
    .find((button) => button.textContent?.includes(question.options[optionIndex]));
  expect(optionButton).toBeTruthy();

  fireEvent.click(optionButton as HTMLButtonElement);
  fireEvent.click(screen.getByRole('button', { name: '次の問題へ' }));
}

function wrongOptionIndex(questionIndex: number) {
  const question = levelTestQuestions[questionIndex];
  return (question.correctIndex + 1) % question.options.length;
}

describe('LevelTestPage a11y smoke', () => {
  it('renders the intro phase with no axe violations', async () => {
    const { container } = renderWithRouter(<LevelTestPage />, { route: '/level-test' });

    // Light structural assertions so the test isn't axe-only.
    expect(
      screen.getByRole('heading', { level: 1, name: 'レベル診断テスト' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'テストを始める' }),
    ).toBeTruthy();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('LevelTestPage adaptive stopping', () => {
  it('continues after two wrong answers in a level and can pass with three correct answers', () => {
    renderWithRouter(<LevelTestPage />, { route: '/level-test' });
    startLevelTest();

    answerAndContinue(0, wrongOptionIndex(0));
    answerAndContinue(1, wrongOptionIndex(1));

    expect(screen.queryByRole('heading', { level: 1, name: '診断結果' })).toBeNull();
    expect(
      screen.getByRole('heading', { level: 2, name: levelTestQuestions[2].question }),
    ).toBeTruthy();

    answerAndContinue(2, levelTestQuestions[2].correctIndex);
    answerAndContinue(3, levelTestQuestions[3].correctIndex);
    answerAndContinue(4, levelTestQuestions[4].correctIndex);

    expect(
      screen.getByRole('heading', { level: 2, name: levelTestQuestions[5].question }),
    ).toBeTruthy();
  });

  it('stops only after the third wrong answer in a level while questions remain', () => {
    renderWithRouter(<LevelTestPage />, { route: '/level-test' });
    startLevelTest();

    answerAndContinue(0, wrongOptionIndex(0));
    answerAndContinue(1, wrongOptionIndex(1));

    expect(screen.queryByRole('heading', { level: 1, name: '診断結果' })).toBeNull();

    answerAndContinue(2, wrongOptionIndex(2));

    expect(screen.getByRole('heading', { level: 1, name: '診断結果' })).toBeTruthy();
  });
});
