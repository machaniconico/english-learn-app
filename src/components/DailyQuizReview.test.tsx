// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DailyQuizReview from './DailyQuizReview';
import type { DailyQuizQuestion } from '../data/dailyQuiz';

/** テスト用の DailyQuizQuestion を作る。 */
function makeQuestion(id: string, correctIndex: number): DailyQuizQuestion {
  return {
    id,
    difficulty: 'beginner',
    question: `Question ${id}`,
    questionJa: `問題 ${id}`,
    options: [`opt-${id}-A`, `opt-${id}-B`, `opt-${id}-C`, `opt-${id}-D`],
    correctIndex,
    explanation: `解説テキスト ${id}`,
    category: '語彙',
  };
}

/** 現在の問題に回答する。correct=true で正解を選ぶ。 */
function answerCurrent(q: DailyQuizQuestion, correct: boolean) {
  const correctText = q.options[q.correctIndex];
  const wrongText = q.options.find((o) => o !== correctText)!;
  fireEvent.click(screen.getByText(correct ? correctText : wrongText));
}

describe('DailyQuizReview', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('渡された間違い問題の部分集合だけが出題される(第1問の文言と総数)', () => {
    const questions = [makeQuestion('x', 0), makeQuestion('y', 1)];
    render(<DailyQuizReview questions={questions} onClose={() => {}} />);
    expect(screen.getByText('間違えた問題の復習')).toBeTruthy();
    expect(screen.getByText('第 1 問 / 2')).toBeTruthy();
    expect(screen.getByText('Question x')).toBeTruthy();
    // 含まれない問題は最初は出ない
    expect(screen.queryByText('Question y')).toBeNull();
  });

  it('回答すると正誤と解説が表示される', () => {
    const questions = [makeQuestion('x', 0)];
    render(<DailyQuizReview questions={questions} onClose={() => {}} />);
    answerCurrent(questions[0], true);
    expect(screen.getByText('🎉 正解!')).toBeTruthy();
    expect(screen.getByText('解説テキスト x')).toBeTruthy();
  });

  it('誤答すると不正解表示になる', () => {
    const questions = [makeQuestion('x', 0)];
    render(<DailyQuizReview questions={questions} onClose={() => {}} />);
    answerCurrent(questions[0], false);
    expect(screen.getByText('❌ 不正解')).toBeTruthy();
  });

  it('最後まで解くと復習完了表示(正解数/総数)になる', () => {
    const questions = [makeQuestion('x', 0), makeQuestion('y', 1)];
    render(<DailyQuizReview questions={questions} onClose={() => {}} />);
    // 1問目: 正解
    answerCurrent(questions[0], true);
    fireEvent.click(screen.getByText('次の問題 →'));
    // 2問目: 誤答 → 結果を見る
    expect(screen.getByText('第 2 問 / 2')).toBeTruthy();
    answerCurrent(questions[1], false);
    fireEvent.click(screen.getByText('結果を見る'));
    // 完了表示: 2問中1問正解
    expect(screen.getByText('復習おつかれさま!')).toBeTruthy();
    expect(screen.getByLabelText('スコア 1 / 2')).toBeTruthy();
  });

  it('完了画面の「結果に戻る」で onClose が呼ばれる', () => {
    const onClose = vi.fn();
    const questions = [makeQuestion('x', 0)];
    render(<DailyQuizReview questions={questions} onClose={onClose} />);
    answerCurrent(questions[0], true);
    fireEvent.click(screen.getByText('結果を見る'));
    fireEvent.click(screen.getByText('復習おつかれさま!')); // no-op, ensures rendered
    fireEvent.click(screen.getByLabelText('結果に戻る'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('出題中の「復習をやめて結果に戻る」でも onClose が呼ばれる', () => {
    const onClose = vi.fn();
    const questions = [makeQuestion('x', 0), makeQuestion('y', 1)];
    render(<DailyQuizReview questions={questions} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('復習をやめて結果に戻る'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('空配列なら空表示で安全に onClose できる', () => {
    const onClose = vi.fn();
    render(<DailyQuizReview questions={[]} onClose={onClose} />);
    expect(screen.getByText('復習する問題はありません。')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('結果に戻る'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('復習中は localStorage に何も書き込まない', () => {
    const questions = [makeQuestion('x', 0), makeQuestion('y', 1)];
    render(<DailyQuizReview questions={questions} onClose={() => {}} />);
    // 全問解いて完了まで進める
    answerCurrent(questions[0], true);
    fireEvent.click(screen.getByText('次の問題 →'));
    answerCurrent(questions[1], true);
    fireEvent.click(screen.getByText('結果を見る'));
    // どのキーも増えていない(daily-quiz / accuracy 含め)
    expect(localStorage.length).toBe(0);
  });
});
