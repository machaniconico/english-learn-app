// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen } from '../test/test-utils';
import StreakBanner from './StreakBanner';

const TIMER_STORAGE_KEY = 'english-learn-study-time';

// ---------------------------------------------------------------------------
// useStudyTimer の localStorage シードヘルパ
// ---------------------------------------------------------------------------
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function seedSession(dateStr: string, ts: number): void {
  localStorage.setItem(
    TIMER_STORAGE_KEY,
    JSON.stringify({
      sessions: [
        {
          date: dateStr,
          startTime: ts,
          endTime: ts + 300_000,
          duration: 300,
          activity: 'reading',
        },
      ],
      currentActivity: null,
      currentStart: null,
      lastInteraction: null,
    }),
  );
}

describe('StreakBanner', () => {
  it('streakAtRisk(連続記録あり・今日未学習)のときだけバナーを表示する', () => {
    // 昨日のセッションを仕込む: currentStreak=1, studiedToday=false → streakAtRisk=true。
    const now = Date.now();
    const yesterdayTs = now - 24 * 60 * 60 * 1000;
    seedSession(toDateStr(new Date(yesterdayTs)), yesterdayTs);

    renderWithRouter(<StreakBanner />);
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    // evaluateReminder の streakAtRisk メッセージ(currentStreak=1)。
    expect(banner.textContent).toContain('1日連続');
  });

  it('セッションがない(streak=0)ときは何も表示しない', () => {
    renderWithRouter(<StreakBanner />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('今日すでに学習済み(studiedToday=true)のときはバナーを表示しない', () => {
    // 今日のセッションを仕込む: currentStreak=1, studiedToday=true → streakAtRisk=false。
    const now = Date.now();
    seedSession(toDateStr(new Date(now)), now - 300_000);

    renderWithRouter(<StreakBanner />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
