// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '../test/test-utils';
import DrillMode from './DrillMode';
import { buildDrillPool } from '../utils/drillQuestionBank';
import {
  DRILL_PREFS_KEY,
  DRILL_RECENT_KEY,
  DRILL_STATS_KEY,
  type DrillStatsData,
} from '../utils/drillStats';

const zeroRand = () => 0;
const PROGRESS_KEY = 'english-learn-progress';

interface StoredProgress {
  streak: number;
  lastStudyDate: string;
}

function todayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function readProgress(): StoredProgress {
  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) throw new Error('progress storage is missing');
  return JSON.parse(raw) as StoredProgress;
}

function setPrefs(genre: string, difficulty = 'beginner', timer = 'off') {
  localStorage.setItem(DRILL_PREFS_KEY, JSON.stringify({ genre, difficulty, timer }));
}

function optionButtons(): HTMLButtonElement[] {
  return screen
    .getAllByRole('button')
    .filter((button): button is HTMLButtonElement => button.getAttribute('aria-pressed') !== null);
}

async function renderReady(genre = 'vocab', difficulty = 'beginner', timer = 'off') {
  setPrefs(genre, difficulty, timer);
  render(<DrillMode rand={zeroRand} />);
  await screen.findByText('第 1 問');
}

function renderReadyWithFakeTimers(genre = 'vocab', difficulty = 'beginner', timer = 'off') {
  setPrefs(genre, difficulty, timer);
  render(<DrillMode rand={zeroRand} />);
  expect(screen.getByText('第 1 問')).toBeInTheDocument();
}

function answerCurrent(optionIndex = 0) {
  fireEvent.click(optionButtons()[optionIndex]);
}

function answerAndAdvance(optionIndex = 0) {
  answerCurrent(optionIndex);
  fireEvent.click(screen.getByRole('button', { name: '次の問題 →' }));
}

describe('DrillMode', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('出題、回答、解説、次の問題のループを3問以上継続できる', async () => {
    await renderReady();

    answerAndAdvance();
    await screen.findByText('第 2 問');
    answerAndAdvance();
    await screen.findByText('第 3 問');
    answerAndAdvance();

    expect(await screen.findByText('第 4 問')).toBeInTheDocument();
    expect(screen.getByLabelText(/今回 3問中\d問正解 \d+パーセント/)).toBeInTheDocument();
  });

  it('難易度とジャンルとタイマーを出題中に変更し、次の問題から反映して設定も保存する', async () => {
    await renderReady('vocab', 'beginner');

    fireEvent.change(screen.getByLabelText('難易度'), { target: { value: 'expert' } });
    fireEvent.change(screen.getByLabelText('ジャンル'), { target: { value: 'listening' } });
    fireEvent.change(screen.getByLabelText('タイマー'), { target: { value: '20' } });

    answerAndAdvance();

    expect(await screen.findByText('リスニング / 満点レベル')).toBeInTheDocument();
    const savedPrefs = JSON.parse(localStorage.getItem(DRILL_PREFS_KEY) ?? '{}') as {
      genre?: string;
      difficulty?: string;
      timer?: string;
    };
    expect(savedPrefs).toEqual({ genre: 'listening', difficulty: 'expert', timer: '20' });
  });

  it('回答ごとにセッションと累計を更新し、累計とrecentをlocalStorageに保存する', async () => {
    await renderReady();

    answerCurrent();

    expect(screen.getByLabelText(/今回 1問中\d問正解 \d+パーセント/)).toBeInTheDocument();
    expect(screen.getByLabelText(/全期間 1問中\d問正解 \d+パーセント/)).toBeInTheDocument();

    const savedStats = JSON.parse(
      localStorage.getItem(DRILL_STATS_KEY) ?? '{}',
    ) as DrillStatsData;
    const savedRecent = JSON.parse(localStorage.getItem(DRILL_RECENT_KEY) ?? '[]') as string[];

    expect(savedStats.total.answered).toBe(1);
    expect(savedStats.total.correct).toBeGreaterThanOrEqual(0);
    expect(savedRecent).toHaveLength(1);
  });

  it('回答確定ごとに学習日を記録し、同じ日ならストリークを二重加算しない', async () => {
    await renderReady();

    await waitFor(() => {
      const progress = readProgress();
      expect(progress.streak).toBe(0);
      expect(progress.lastStudyDate).toBe('');
    });

    answerAndAdvance();

    await waitFor(() => {
      const progress = readProgress();
      expect(progress.streak).toBe(1);
      expect(progress.lastStudyDate).toBe(todayString());
    });

    await screen.findByText('第 2 問');
    answerCurrent();

    await waitFor(() => {
      const progress = readProgress();
      expect(progress.streak).toBe(1);
      expect(progress.lastStudyDate).toBe(todayString());
    });
  });

  it('リスニングは自動再生し、回答前は英文を隠して回答後に表示する', async () => {
    const [expected] = buildDrillPool('listening', 'beginner', zeroRand);
    await renderReady('listening', 'beginner');

    await waitFor(() => {
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });
    expect(screen.getByText('音声を聞いて、内容に合う答えを選んでください。')).toBeInTheDocument();
    expect(screen.queryByText(expected.prompt)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '🔊 もう一度聞く' }));
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2);

    answerCurrent();

    expect(screen.getByText(`英文: ${expected.prompt}`)).toBeInTheDocument();
  });

  it('回答直後にaria-liveの正解または不正解と解説を表示する', async () => {
    await renderReady();

    answerCurrent();

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'assertive');
    expect(status).toHaveTextContent(/正解|不正解/);
    expect(screen.getByText(/解説 \(/)).toBeInTheDocument();
  });

  it('タイマーが0になると時間切れとして不正解を記録し、選択肢クリックを無効にする', async () => {
    vi.useFakeTimers();
    renderReadyWithFakeTimers('vocab', 'beginner', '10');

    expect(screen.getByRole('timer', { name: '残り時間 10秒' })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(9_000);
    });
    expect(screen.getByRole('timer', { name: '残り時間 1秒' })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1_000);
    });

    expect(screen.getByRole('status')).toHaveTextContent('時間切れ');
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    expect(screen.getByText(/解説 \(/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '次の問題 →' })).toBeInTheDocument();
    expect(screen.getByLabelText('今回 1問中0問正解 0パーセント')).toBeInTheDocument();
    optionButtons().forEach((button) => {
      expect(button).toBeDisabled();
    });

    const savedStats = JSON.parse(
      localStorage.getItem(DRILL_STATS_KEY) ?? '{}',
    ) as DrillStatsData;
    expect(savedStats.total).toEqual({ answered: 1, correct: 0 });
    expect(savedStats.byGenre.vocab).toEqual({ answered: 1, correct: 0 });
    expect(savedStats.byDifficulty.beginner).toEqual({ answered: 1, correct: 0 });

    fireEvent.click(optionButtons()[0]);
    const statsAfterDisabledClick = JSON.parse(
      localStorage.getItem(DRILL_STATS_KEY) ?? '{}',
    ) as DrillStatsData;
    expect(statsAfterDisabledClick.total).toEqual({ answered: 1, correct: 0 });
  });

  it('タイマーオフではカウントダウンも時間切れも発生しない', async () => {
    vi.useFakeTimers();
    renderReadyWithFakeTimers('vocab', 'beginner', 'off');

    expect(screen.queryByRole('timer')).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(30_000);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(optionButtons()[0]).not.toBeDisabled();
    const savedStats = JSON.parse(
      localStorage.getItem(DRILL_STATS_KEY) ?? '{}',
    ) as DrillStatsData;
    expect(savedStats.total).toEqual({ answered: 0, correct: 0 });
  });

  it('回答するとカウントダウンが止まり、その後タイマーが満了しても二重記録しない', async () => {
    vi.useFakeTimers();
    renderReadyWithFakeTimers('vocab', 'beginner', '10');

    await act(async () => {
      vi.advanceTimersByTime(3_000);
    });
    expect(screen.getByRole('timer', { name: '残り時間 7秒' })).toBeInTheDocument();

    fireEvent.click(optionButtons()[0]);

    // 回答した瞬間にタイマー表示は消え、1問だけ記録される。
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    const afterAnswer = JSON.parse(
      localStorage.getItem(DRILL_STATS_KEY) ?? '{}',
    ) as DrillStatsData;
    expect(afterAnswer.total.answered).toBe(1);

    // 元の持ち時間を大きく超えて進めても、時間切れによる二重記録は起きない。
    await act(async () => {
      vi.advanceTimersByTime(20_000);
    });
    const afterTimeout = JSON.parse(
      localStorage.getItem(DRILL_STATS_KEY) ?? '{}',
    ) as DrillStatsData;
    expect(afterTimeout.total.answered).toBe(1);
    expect(screen.queryByText('時間切れ')).not.toBeInTheDocument();
  });

  it('出題中にタイマーを変更すると残り時間がリセットされ、オフにすると時間切れが止まる', async () => {
    vi.useFakeTimers();
    renderReadyWithFakeTimers('vocab', 'beginner', '10');

    await act(async () => {
      vi.advanceTimersByTime(4_000);
    });
    expect(screen.getByRole('timer', { name: '残り時間 6秒' })).toBeInTheDocument();

    // 10→20 に変更すると新しい持ち時間で数え直す。
    fireEvent.change(screen.getByLabelText('タイマー'), { target: { value: '20' } });
    expect(screen.getByRole('timer', { name: '残り時間 20秒' })).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(5_000);
    });
    expect(screen.getByRole('timer', { name: '残り時間 15秒' })).toBeInTheDocument();

    // 途中でオフにするとタイマーが消え、以降いくら進めても時間切れにならない。
    fireEvent.change(screen.getByLabelText('タイマー'), { target: { value: 'off' } });
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.queryByText('時間切れ')).not.toBeInTheDocument();
    const savedStats = JSON.parse(
      localStorage.getItem(DRILL_STATS_KEY) ?? '{}',
    ) as DrillStatsData;
    expect(savedStats.total).toEqual({ answered: 0, correct: 0 });
  });

  it('終了時にdrillとしてuseAccuracyへ記録し、もう一度で再開できる', async () => {
    await renderReady();

    answerCurrent();
    fireEvent.click(screen.getByRole('button', { name: '終了' }));

    expect(screen.getByRole('heading', { name: 'ドリルモード終了' })).toBeInTheDocument();

    const results = JSON.parse(localStorage.getItem('english-learn-accuracy') ?? '[]') as {
      type?: string;
      setId?: string;
      total?: number;
      correct?: number;
      score?: number;
    }[];
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ type: 'drill', setId: 'drill', total: 1 });
    expect(results[0].score).toBeGreaterThanOrEqual(0);

    fireEvent.click(screen.getByRole('button', { name: 'もう一度' }));
    expect(await screen.findByText('第 1 問')).toBeInTheDocument();
    expect(screen.getByLabelText(/今回 0問中0問正解 0パーセント/)).toBeInTheDocument();
  });
});
