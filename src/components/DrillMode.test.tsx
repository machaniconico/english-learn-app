// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../test/test-utils';
import DrillMode from './DrillMode';
import { buildDrillPool } from '../utils/drillQuestionBank';
import {
  DRILL_PREFS_KEY,
  DRILL_RECENT_KEY,
  DRILL_STATS_KEY,
  type DrillStatsData,
} from '../utils/drillStats';

const zeroRand = () => 0;

function setPrefs(genre: string, difficulty = 'beginner') {
  localStorage.setItem(DRILL_PREFS_KEY, JSON.stringify({ genre, difficulty }));
}

function optionButtons(): HTMLButtonElement[] {
  return screen
    .getAllByRole('button')
    .filter((button): button is HTMLButtonElement => button.getAttribute('aria-pressed') !== null);
}

async function renderReady(genre = 'vocab', difficulty = 'beginner') {
  setPrefs(genre, difficulty);
  render(<DrillMode rand={zeroRand} />);
  await screen.findByText('第 1 問');
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

  it('難易度とジャンルを出題中に変更し、次の問題から反映して設定も保存する', async () => {
    await renderReady('vocab', 'beginner');

    fireEvent.change(screen.getByLabelText('難易度'), { target: { value: 'expert' } });
    fireEvent.change(screen.getByLabelText('ジャンル'), { target: { value: 'listening' } });

    answerAndAdvance();

    expect(await screen.findByText('リスニング / 満点レベル')).toBeInTheDocument();
    const savedPrefs = JSON.parse(localStorage.getItem(DRILL_PREFS_KEY) ?? '{}') as {
      genre?: string;
      difficulty?: string;
    };
    expect(savedPrefs).toEqual({ genre: 'listening', difficulty: 'expert' });
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
