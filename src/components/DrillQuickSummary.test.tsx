// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../test/test-utils';
import DrillQuickSummary, { type DrillAnswerRecord } from './DrillQuickSummary';
import type { DrillGenre, DrillQuestion } from '../utils/drillTypes';

function makeQuestion(genre: DrillGenre, id: string, prompt: string): DrillQuestion {
  return {
    id,
    genre,
    difficulty: 'beginner',
    prompt,
    options: ['選択肢A', '選択肢B', '選択肢C', '選択肢D'],
    correctIndex: 1,
    explanation: `解説 ${id}`,
  };
}

function makeRecord(
  genre: DrillGenre,
  id: string,
  prompt: string,
  correct: boolean,
  selectedIndex: number | null,
): DrillAnswerRecord {
  return { question: makeQuestion(genre, id, prompt), selectedIndex, correct };
}

describe('DrillQuickSummary', () => {
  const records: DrillAnswerRecord[] = [
    makeRecord('vocab', 'v1', 'apple の意味は?', true, 1),
    makeRecord('vocab', 'v2', 'banana の意味は?', false, 2),
    makeRecord('fill-blank', 'f1', '穴埋めの問題文', true, 1),
  ];

  it('スコア・正答率・ジャンル別内訳・間違い一覧を表示する', () => {
    render(
      <DrillQuickSummary records={records} onRestart={() => {}} onBackToSettings={() => {}} />,
    );

    expect(screen.getByRole('heading', { name: 'クイックセッション結果' })).toBeInTheDocument();
    expect(screen.getByLabelText('3問中2問正解 67パーセント')).toBeInTheDocument();

    // 回答があったジャンルだけ内訳に出す。
    expect(screen.getByLabelText('単語 2問中1問正解 50パーセント')).toBeInTheDocument();
    expect(screen.getByLabelText('穴埋め 1問中1問正解 100パーセント')).toBeInTheDocument();
    expect(screen.queryByLabelText(/リスニング/)).not.toBeInTheDocument();

    // 間違えた問題は設問と正解を出す。
    expect(screen.getByText('間違えた問題 (1)')).toBeInTheDocument();
    expect(screen.getByText('banana の意味は?')).toBeInTheDocument();
    expect(screen.getByText('選択肢B')).toBeInTheDocument();
  });

  it('もう一度・設定に戻るがそれぞれのコールバックを呼ぶ', () => {
    const onRestart = vi.fn();
    const onBackToSettings = vi.fn();
    render(
      <DrillQuickSummary
        records={records}
        onRestart={onRestart}
        onBackToSettings={onBackToSettings}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));
    fireEvent.click(screen.getByRole('button', { name: '設定に戻る' }));

    expect(onRestart).toHaveBeenCalledTimes(1);
    expect(onBackToSettings).toHaveBeenCalledTimes(1);
  });

  it('全問正解のときは間違い一覧を表示しない', () => {
    const allCorrect: DrillAnswerRecord[] = [
      makeRecord('vocab', 'v1', 'q1', true, 1),
      makeRecord('vocab', 'v2', 'q2', true, 1),
    ];
    render(
      <DrillQuickSummary records={allCorrect} onRestart={() => {}} onBackToSettings={() => {}} />,
    );

    expect(screen.getByLabelText('2問中2問正解 100パーセント')).toBeInTheDocument();
    expect(screen.queryByText(/間違えた問題/)).not.toBeInTheDocument();
  });
});
