// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render, screen, fireEvent } from '../test/test-utils';
import HomeQuiz from './HomeQuiz';
import { pickPracticeQuestions } from '../utils/practiceQuizSelect';
import { seededRandom } from '../utils/dailyQuizSelect';
import { getQuestionsByDifficulty } from '../data/dailyQuiz';

expect.extend(matchers);

/** seedOverride と同じ手順で「その回の出題」を再現する(正解インデックスを知るため)。 */
function reproduceBeginnerPick(seed: string, count = 10) {
  return pickPracticeQuestions(getQuestionsByDifficulty('beginner'), count, seededRandom(seed));
}

/** 出題画面で index 番目の選択肢を選んで次へ進める。 */
function chooseOptionAndAdvance(optionIndex: number) {
  const optionButtons = screen
    .getAllByRole('button')
    .filter((b) => b.getAttribute('aria-pressed') !== null);
  fireEvent.click(optionButtons[optionIndex]);
  fireEvent.click(screen.getByRole('button', { name: /次の問題|結果を見る/ }));
}

/** 出題画面で「先頭の選択肢を選んで次へ」を1問分進める。 */
function answerAndAdvance() {
  // 出題画面の選択肢ボタンは aria-pressed を持つ(設定画面のチップは play 中は無い)。
  const optionButtons = screen
    .getAllByRole('button')
    .filter((b) => b.getAttribute('aria-pressed') !== null);
  fireEvent.click(optionButtons[0]);
  const nextBtn = screen.getByRole('button', { name: /次の問題|結果を見る/ });
  fireEvent.click(nextBtn);
}

describe('HomeQuiz', () => {
  it('設定画面を表示し、難易度未選択のときスタートは無効', () => {
    render(<HomeQuiz />);
    expect(screen.getByRole('heading', { name: '練習クイズ' })).toBeTruthy();
    const start = screen.getByRole('button', { name: /難易度を選んでください/ });
    expect(start.hasAttribute('disabled')).toBe(true);
  });

  it('初級を選ぶと出題数は10の倍数(10/20)で、30は出ない', () => {
    render(<HomeQuiz />);
    fireEvent.click(screen.getByRole('button', { name: /初級/ }));
    expect(screen.getByRole('button', { name: '出題数 10 問' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '出題数 20 問' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: '出題数 30 問' })).toBeNull();
  });

  it('おまかせ(ミックス)では最大60問まで10の倍数で選べる', () => {
    render(<HomeQuiz />);
    fireEvent.click(screen.getByRole('button', { name: /おまかせ/ }));
    expect(screen.getByRole('button', { name: '出題数 60 問' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '出題数 30 問' })).toBeTruthy();
  });

  it('難易度を選ぶとスタートが有効になり、押すと出題が始まる', () => {
    render(<HomeQuiz seedOverride="fixed-seed" />);
    fireEvent.click(screen.getByRole('button', { name: /中級/ }));
    const start = screen.getByRole('button', { name: /中級 10問でスタート/ });
    expect(start.hasAttribute('disabled')).toBe(false);
    fireEvent.click(start);
    // 出題画面: 第 1 問 / 10 が出る
    expect(screen.getByText('第 1 問 / 10')).toBeTruthy();
  });

  it('回答すると解説が出て、全問終えると結果画面に遷移する', () => {
    render(<HomeQuiz seedOverride="fixed-seed" />);
    fireEvent.click(screen.getByRole('button', { name: /初級/ }));
    fireEvent.click(screen.getByRole('button', { name: /初級 10問でスタート/ }));

    // 1問目に回答 → 解説ラベルが出る
    const firstOptions = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-pressed') !== null);
    fireEvent.click(firstOptions[0]);
    expect(screen.getByText(/解説 \(/)).toBeTruthy();

    // 残りを進めて結果へ(1問目は回答済みなので次へ→以降9問)
    fireEvent.click(screen.getByRole('button', { name: /次の問題|結果を見る/ }));
    for (let i = 0; i < 9; i++) answerAndAdvance();

    expect(screen.getByRole('heading', { name: '練習クイズ完了!' })).toBeTruthy();
    expect(screen.getByRole('status', { name: /スコア .* \/ 10/ })).toBeTruthy();
  });

  it('結果から「設定を変える」で設定画面に戻れる', () => {
    render(<HomeQuiz seedOverride="fixed-seed" />);
    fireEvent.click(screen.getByRole('button', { name: /初級/ }));
    fireEvent.click(screen.getByRole('button', { name: /初級 10問でスタート/ }));
    for (let i = 0; i < 10; i++) answerAndAdvance();
    fireEvent.click(screen.getByRole('button', { name: '設定を変える' }));
    expect(screen.getByRole('heading', { name: '練習クイズ' })).toBeTruthy();
  });

  it('全問間違えると結果に復習ボタンが出て、押すと間違えた問題の復習が始まる', () => {
    const picked = reproduceBeginnerPick('fixed-seed');
    render(<HomeQuiz seedOverride="fixed-seed" />);
    fireEvent.click(screen.getByRole('button', { name: /初級/ }));
    fireEvent.click(screen.getByRole('button', { name: /初級 10問でスタート/ }));

    // 各問、正解ではない選択肢を選ぶ(全問不正解にする)。
    for (let i = 0; i < 10; i++) {
      const wrongIdx = picked[i].correctIndex === 0 ? 1 : 0;
      chooseOptionAndAdvance(wrongIdx);
    }

    // 結果画面: 10問とも間違えたので復習ボタンが出る。
    const reviewBtn = screen.getByRole('button', {
      name: /間違えた 10 問をもう一度復習する/,
    });
    fireEvent.click(reviewBtn);

    // 復習画面へ遷移(結果見出しは消え、間違えた最初の問題文が出る)。
    expect(screen.queryByRole('heading', { name: '練習クイズ完了!' })).toBeNull();
    expect(screen.getByText(picked[0].question)).toBeTruthy();
  });

  it('全問正解だと復習ボタンは出ない', () => {
    const picked = reproduceBeginnerPick('fixed-seed');
    render(<HomeQuiz seedOverride="fixed-seed" />);
    fireEvent.click(screen.getByRole('button', { name: /初級/ }));
    fireEvent.click(screen.getByRole('button', { name: /初級 10問でスタート/ }));

    for (let i = 0; i < 10; i++) {
      chooseOptionAndAdvance(picked[i].correctIndex);
    }

    expect(screen.getByRole('heading', { name: '練習クイズ完了!' })).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: /もう一度復習する/ }),
    ).toBeNull();
  });

  it('設定画面に axe 違反がない', async () => {
    const { container } = render(<HomeQuiz />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
