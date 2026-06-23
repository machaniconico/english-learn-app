// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter } from '../test/test-utils';
import DailyQuiz from './DailyQuiz';
import { selectDailyQuiz } from '../utils/dailyQuizSelect';

expect.extend(matchers);

const TODAY = '2026-06-23';

/** 出題画面まで進める(初級を選ぶ)。 */
function startBeginner() {
  const view = renderWithRouter(<DailyQuiz today={TODAY} />);
  fireEvent.click(screen.getByText('初級'));
  return view;
}

/** 現在の問題に1つ回答し「次へ/結果を見る」を押す。correct=true で正解を選ぶ。 */
function answerCurrent(questions: ReturnType<typeof selectDailyQuiz>, index: number, correct: boolean) {
  const q = questions[index];
  const correctText = q.options[q.correctIndex];
  const wrongText = q.options.find((o) => o !== correctText)!;
  fireEvent.click(screen.getByText(correct ? correctText : wrongText));
}

describe('DailyQuiz', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('最初に難易度選択画面を表示する', () => {
    renderWithRouter(<DailyQuiz today={TODAY} />);
    expect(screen.getByText('デイリー10問クイズ')).toBeTruthy();
    expect(screen.getByText('初級')).toBeTruthy();
    expect(screen.getByText('中級')).toBeTruthy();
    expect(screen.getByText('上級')).toBeTruthy();
  });

  it('難易度を選ぶと第1問が表示される', () => {
    startBeginner();
    expect(screen.getByText('第 1 問 / 10')).toBeTruthy();
  });

  it('選択肢を選ぶと解説が表示される', () => {
    const questions = selectDailyQuiz('beginner', TODAY);
    startBeginner();
    answerCurrent(questions, 0, true);
    expect(screen.getByText('🎉 正解!')).toBeTruthy();
    // 解説本文が出る
    expect(screen.getByText(questions[0].explanation)).toBeTruthy();
  });

  it('不正解を選ぶと不正解表示になる', () => {
    const questions = selectDailyQuiz('beginner', TODAY);
    startBeginner();
    answerCurrent(questions, 0, false);
    expect(screen.getByText('❌ 不正解')).toBeTruthy();
  });

  it('10問すべて回答すると結果画面に遷移しスコアを表示する', () => {
    const questions = selectDailyQuiz('beginner', TODAY);
    startBeginner();
    for (let i = 0; i < questions.length; i++) {
      answerCurrent(questions, i, true);
      // 回答後に「次の問題」または「結果を見る」を押す
      const nextLabel = i + 1 >= questions.length ? '結果を見る' : '次の問題 →';
      fireEvent.click(screen.getByText(nextLabel));
    }
    expect(screen.getByText('クイズ完了!')).toBeTruthy();
    // 全問正解なので 10 / 10
    expect(screen.getByLabelText(/スコア 10 \/ 10/)).toBeTruthy();
  });

  it('結果画面で全問の解説が振り返り表示される', () => {
    const questions = selectDailyQuiz('beginner', TODAY);
    startBeginner();
    for (let i = 0; i < questions.length; i++) {
      answerCurrent(questions, i, true);
      const nextLabel = i + 1 >= questions.length ? '結果を見る' : '次の問題 →';
      fireEvent.click(screen.getByText(nextLabel));
    }
    expect(screen.getByText('解説で振り返る')).toBeTruthy();
    // 全問の解説が存在する
    for (const q of questions) {
      expect(screen.getAllByText(q.explanation).length).toBeGreaterThan(0);
    }
  });

  it('完了後リロードしても結果画面が復元される', () => {
    const questions = selectDailyQuiz('beginner', TODAY);
    startBeginner();
    for (let i = 0; i < questions.length; i++) {
      answerCurrent(questions, i, true);
      const nextLabel = i + 1 >= questions.length ? '結果を見る' : '次の問題 →';
      fireEvent.click(screen.getByText(nextLabel));
    }
    // 再マウント(リロード相当)
    renderWithRouter(<DailyQuiz today={TODAY} />);
    expect(screen.getAllByText('クイズ完了!').length).toBeGreaterThan(0);
  });

  it('途中まで回答してリロードすると続きから再開する', () => {
    const questions = selectDailyQuiz('beginner', TODAY);
    const first = startBeginner();
    // 第1問だけ回答して次へ(第2問へ)
    answerCurrent(questions, 0, true);
    fireEvent.click(screen.getByText('次の問題 →'));
    expect(screen.getByText('第 2 問 / 10')).toBeTruthy();
    first.unmount();
    // 再マウントで第2問から
    renderWithRouter(<DailyQuiz today={TODAY} />);
    expect(screen.getByText('第 2 問 / 10')).toBeTruthy();
  });

  it('回答後に次へ進む前にリロードすると同じ問題の解説から再開する', () => {
    const questions = selectDailyQuiz('beginner', TODAY);
    const first = startBeginner();
    answerCurrent(questions, 0, true);
    expect(screen.getByText(questions[0].explanation)).toBeTruthy();
    first.unmount();

    renderWithRouter(<DailyQuiz today={TODAY} />);
    expect(screen.getByText('第 1 問 / 10')).toBeTruthy();
    expect(screen.getByText('🎉 正解!')).toBeTruthy();
    expect(screen.getByText(questions[0].explanation)).toBeTruthy();
  });

  it('「別の難易度に挑戦」で難易度選択に戻れる', () => {
    const questions = selectDailyQuiz('beginner', TODAY);
    startBeginner();
    for (let i = 0; i < questions.length; i++) {
      answerCurrent(questions, i, true);
      const nextLabel = i + 1 >= questions.length ? '結果を見る' : '次の問題 →';
      fireEvent.click(screen.getByText(nextLabel));
    }
    fireEvent.click(screen.getByText('別の難易度に挑戦'));
    expect(screen.getByText('まずは難易度を選んでください。', { exact: false })).toBeTruthy();
  });

  it('難易度選択画面にアクセシビリティ違反がない', async () => {
    const { container } = renderWithRouter(<DailyQuiz today={TODAY} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('出題画面にアクセシビリティ違反がない', async () => {
    const { container } = renderWithRouter(<DailyQuiz today={TODAY} />);
    fireEvent.click(screen.getByText('初級'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
