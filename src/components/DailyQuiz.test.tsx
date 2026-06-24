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
    expect(screen.getByText('出題数と難易度を選んでください。', { exact: false })).toBeTruthy();
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

  // === Round 37: 出題数可変 + おまかせ + 設定記憶 ===

  it('選択画面に出題数 5/10/15/20 と おまかせ カードが表示される', () => {
    renderWithRouter(<DailyQuiz today={TODAY} />);
    const group = screen.getByRole('group', { name: '出題数を選ぶ' });
    expect(group).toBeTruthy();
    expect(screen.getByLabelText('出題数 5 問')).toBeTruthy();
    expect(screen.getByLabelText('出題数 10 問')).toBeTruthy();
    expect(screen.getByLabelText('出題数 15 問')).toBeTruthy();
    expect(screen.getByLabelText('出題数 20 問')).toBeTruthy();
    expect(screen.getByText('おまかせ')).toBeTruthy();
  });

  it('出題数 5 を選んで難易度カードを押すと 5 問になる', () => {
    renderWithRouter(<DailyQuiz today={TODAY} />);
    fireEvent.click(screen.getByLabelText('出題数 5 問'));
    fireEvent.click(screen.getByText('初級'));
    expect(screen.getByText('第 1 問 / 5')).toBeTruthy();
  });

  it('おまかせを選ぶと開始でき、最後まで到達できる', () => {
    const questions = selectDailyQuiz('mixed', TODAY, 10);
    renderWithRouter(<DailyQuiz today={TODAY} />);
    fireEvent.click(screen.getByText('おまかせ'));
    expect(screen.getByText('第 1 問 / 10')).toBeTruthy();
    for (let i = 0; i < questions.length; i++) {
      answerCurrent(questions, i, true);
      const nextLabel = i + 1 >= questions.length ? '結果を見る' : '次の問題 →';
      fireEvent.click(screen.getByText(nextLabel));
    }
    expect(screen.getByText('クイズ完了!')).toBeTruthy();
    expect(screen.getByText('難易度: おまかせ', { exact: false })).toBeTruthy();
  });

  it('出題数の選択が記憶され、再マウント時の既定になる', () => {
    const first = renderWithRouter(<DailyQuiz today={TODAY} />);
    fireEvent.click(screen.getByLabelText('出題数 15 問'));
    expect(screen.getByLabelText('出題数 15 問').getAttribute('aria-pressed')).toBe('true');
    first.unmount();
    // 別日(保存済みクイズ状態が無い状態)でも prefs の既定が反映される
    renderWithRouter(<DailyQuiz today="2026-07-01" />);
    expect(screen.getByLabelText('出題数 15 問').getAttribute('aria-pressed')).toBe('true');
    // 実際に開始すると 15 問になる
    fireEvent.click(screen.getByText('初級'));
    expect(screen.getByText('第 1 問 / 15')).toBeTruthy();
  });

  it('count=15 の途中状態を保存後マウントすると同じ問題数で復元する', () => {
    const questions = selectDailyQuiz('intermediate', TODAY, 15);
    const answers = new Array(15).fill(null);
    answers[0] = questions[0].correctIndex;
    localStorage.setItem(
      `english-learn-daily-quiz-${TODAY}`,
      JSON.stringify({
        selection: 'intermediate',
        count: 15,
        answers,
        currentIndex: 1,
        finished: false,
      }),
    );
    renderWithRouter(<DailyQuiz today={TODAY} />);
    expect(screen.getByText('第 2 問 / 15')).toBeTruthy();
  });

  // === Round 40: 達成ストリーク + 直近成績履歴 ===

  /** english-learn-accuracy に daily-quiz 結果を仕込む。 */
  function seedAccuracy(
    rows: { date: string; score: number; total?: number; level?: string }[],
  ) {
    const results = rows.map((r) => {
      const level = r.level ?? 'beginner';
      const total = r.total ?? 10;
      return {
        type: 'daily-quiz',
        setId: `daily-quiz-${r.date}-${level}-${total}`,
        score: r.score,
        total,
        correct: r.score,
        level,
        timestamp: 0,
      };
    });
    localStorage.setItem('english-learn-accuracy', JSON.stringify(results));
  }

  it('select 画面にストリークバッジと直近の成績が表示される', () => {
    // TODAY=2026-06-23 を含む連続3日
    seedAccuracy([
      { date: '2026-06-21', score: 5 }, // 50%
      { date: '2026-06-22', score: 7 }, // 70%
      { date: '2026-06-23', score: 9 }, // 90%
    ]);
    renderWithRouter(<DailyQuiz today={TODAY} />);
    // 🔥 3日連続 バッジ
    expect(screen.getByLabelText('デイリークイズ 3日連続達成中')).toBeTruthy();
    expect(screen.getByText('3日連続')).toBeTruthy();
    // 直近の成績見出しと pct
    expect(screen.getByText('直近の成績')).toBeTruthy();
    expect(screen.getByText('90%')).toBeTruthy();
    expect(screen.getByText('70%')).toBeTruthy();
    expect(screen.getByText('50%')).toBeTruthy();
    // 日付 M/D 表記(新しい順で先頭が 6/23)
    expect(screen.getByText('6/23')).toBeTruthy();
  });

  it('履歴がゼロのとき成績カードを出さない', () => {
    renderWithRouter(<DailyQuiz today={TODAY} />);
    expect(screen.queryByText('直近の成績')).toBeNull();
    expect(screen.queryByText(/日連続/)).toBeNull();
  });

  it('旧形式(difficulty のみ・count なし)でも後方互換で復元できる', () => {
    const questions = selectDailyQuiz('beginner', TODAY, 10);
    const answers = new Array(questions.length).fill(null);
    answers[0] = questions[0].correctIndex;
    // count フィールド無し / selection ではなく difficulty
    localStorage.setItem(
      `english-learn-daily-quiz-${TODAY}`,
      JSON.stringify({
        difficulty: 'beginner',
        answers,
        currentIndex: 1,
        finished: false,
      }),
    );
    renderWithRouter(<DailyQuiz today={TODAY} />);
    // answers.length(=10) が count として使われる
    expect(screen.getByText('第 2 問 / 10')).toBeTruthy();
  });
});
