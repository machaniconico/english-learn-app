// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen } from '../test/test-utils';
import DailyGoalProgress from './DailyGoalProgress';

const GOAL_STORAGE_KEY = 'english-learn-daily-goal';
const TIMER_STORAGE_KEY = 'english-learn-study-time';

// 今日のローカル暦日を 'YYYY-MM-DD' で返す(useStudyTimer の日付フォーマットに合致)。
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// デイリー目標(分)を localStorage にシードする。useDailyGoal は数値文字列を読む。
function seedGoal(minutes: number): void {
  localStorage.setItem(GOAL_STORAGE_KEY, String(minutes));
}

// useStudyTimer の localStorage 形式に従い今日のセッションを1件シードする。
// duration は秒単位(8分=480, 15分=900)。
function seedTodaySession(durationSeconds: number): void {
  const now = Date.now();
  const today = toDateStr(new Date(now));
  localStorage.setItem(
    TIMER_STORAGE_KEY,
    JSON.stringify({
      sessions: [
        {
          date: today,
          startTime: now,
          endTime: now + durationSeconds * 1000,
          duration: durationSeconds,
          activity: 'reading',
        },
      ],
      currentActivity: null,
      currentStart: null,
      lastInteraction: null,
    }),
  );
}

describe('DailyGoalProgress', () => {
  it('目標10分・今日8分のとき 80% で進捗バーを表示する', () => {
    seedGoal(10);
    seedTodaySession(480); // 8分

    renderWithRouter(<DailyGoalProgress />);

    expect(screen.getByText('8 / 10 分')).toBeTruthy();
    expect(screen.getByText('80%')).toBeTruthy();

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '80');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-label', '今日の学習目標の進捗');

    // 未達成なので達成ラベルは出ない
    expect(screen.queryByText(/目標達成/)).toBeNull();
  });

  it('学習セッションがないとき 0% で表示する', () => {
    seedGoal(10);
    // セッション無し: getDailyBreakdown(1) は今日 0 分を返す

    renderWithRouter(<DailyGoalProgress />);

    expect(screen.getByText('0 / 10 分')).toBeTruthy();
    expect(screen.getByText('0%')).toBeTruthy();

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('目標以上の学習で 100% になり達成ラベルを表示する', () => {
    seedGoal(10);
    seedTodaySession(900); // 15分 > 10分 → goalProgressPct は 100 に頭打ち

    renderWithRouter(<DailyGoalProgress />);

    expect(screen.getByText('15 / 10 分')).toBeTruthy();
    expect(screen.getByText('100%')).toBeTruthy();

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText(/目標達成/)).toBeTruthy();
  });
});
