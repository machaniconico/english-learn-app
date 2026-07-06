// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, renderWithRouter, screen, waitFor } from '../test/test-utils';
import DrillReview from './DrillReview';
import type { DrillMistake } from '../utils/drillMistakes';
import type { DrillQuestion } from '../utils/drillTypes';

const STORAGE_KEY = 'english-learn-drill-mistakes';
const zeroRand = () => 0;

function makeQuestion(id: string, overrides: Partial<DrillQuestion> = {}): DrillQuestion {
  return {
    id,
    genre: 'vocab',
    difficulty: 'beginner',
    prompt: `Prompt ${id}`,
    options: [`Wrong A ${id}`, `Correct ${id}`, `Wrong C ${id}`, `Wrong D ${id}`],
    correctIndex: 1,
    explanation: `Explanation ${id}`,
    ...overrides,
  };
}

function makeMistake(
  id: string,
  overrides: Partial<Omit<DrillMistake, 'question'>> & { question?: DrillQuestion } = {},
): DrillMistake {
  return {
    question: overrides.question ?? makeQuestion(id),
    correctStreak: 0,
    wrongCount: 1,
    addedAt: 1000,
    lastSeenAt: 1000,
    ...overrides,
  };
}

function seedMistakes(mistakes: DrillMistake[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
}

function readMistakes(): DrillMistake[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as DrillMistake[];
}

function renderReview() {
  return renderWithRouter(<DrillReview rand={zeroRand} />, { route: '/drill/review' });
}

function optionButtons(): HTMLButtonElement[] {
  return screen
    .getAllByRole('button')
    .filter((button): button is HTMLButtonElement => button.getAttribute('aria-pressed') !== null);
}

describe('DrillReview', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('store seed 済みで出題が表示される', async () => {
    seedMistakes([makeMistake('q1')]);

    renderReview();

    expect(await screen.findByText('Prompt q1')).toBeInTheDocument();
    expect(screen.getByLabelText('残り問題数 1')).toBeInTheDocument();
  });

  it('正解1回であと1回表示を出し、storeに残す', async () => {
    seedMistakes([makeMistake('q1')]);
    renderReview();
    await screen.findByText('Prompt q1');

    fireEvent.click(optionButtons()[1]);

    expect(screen.getByRole('status')).toHaveTextContent('正解!');
    expect(screen.getByText('あと1回連続正解でマスター')).toBeInTheDocument();
    await waitFor(() => {
      const stored = readMistakes();
      expect(stored).toHaveLength(1);
      expect(stored[0].correctStreak).toBe(1);
    });
  });

  it('2回連続正解でマスター表示を出し、storeから消えて残数が減る', async () => {
    seedMistakes([makeMistake('q1', { correctStreak: 1 })]);
    renderReview();
    await screen.findByText('Prompt q1');

    fireEvent.click(optionButtons()[1]);

    expect(screen.getByRole('status')).toHaveTextContent('マスター!');
    await waitFor(() => {
      expect(readMistakes()).toEqual([]);
      expect(screen.getByLabelText('残り問題数 0')).toBeInTheDocument();
    });
  });

  it('不正解でstreakをリセットし、storeに残す', async () => {
    seedMistakes([makeMistake('q1', { correctStreak: 1, wrongCount: 2 })]);
    renderReview();
    await screen.findByText('Prompt q1');

    fireEvent.click(optionButtons()[0]);

    expect(screen.getByRole('status')).toHaveTextContent('不正解');
    expect(screen.getByText('あと2回連続正解でマスター')).toBeInTheDocument();
    await waitFor(() => {
      const stored = readMistakes();
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject({ correctStreak: 0, wrongCount: 3 });
    });
  });

  it('空storeでは空状態を表示する', async () => {
    renderReview();

    expect(await screen.findByText('間違えた問題はありません。')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ドリルへ戻る' })).toHaveAttribute('href', '/drill');
  });

  it('全問マスター後に完了状態を表示する', async () => {
    seedMistakes([makeMistake('q1', { correctStreak: 1 })]);
    renderReview();
    await screen.findByText('Prompt q1');

    fireEvent.click(optionButtons()[1]);
    fireEvent.click(screen.getByRole('button', { name: '次の問題 →' }));

    expect(await screen.findByText('すべてマスターしました! 🎉')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ドリルへ戻る' })).toHaveAttribute('href', '/drill');
  });

  it('数字キーで回答できる', async () => {
    seedMistakes([makeMistake('q1')]);
    renderReview();
    await screen.findByText('Prompt q1');

    fireEvent.keyDown(window, { key: '2' });

    expect(optionButtons()[1]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('正解!');
  });
});
