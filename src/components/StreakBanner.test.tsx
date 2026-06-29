// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderWithRouter, screen } from '../test/test-utils';
import StreakBanner from './StreakBanner';

const TIMER_STORAGE_KEY = 'english-learn-study-time';
const PROGRESS_STORAGE_KEY = 'english-learn-progress';

// useProgress の freezeTokens / streak をシードする。
function seedFreezeTokens(freezeTokens: number, streak = 1): void {
  localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({
      lessons: {},
      fillInBlankScores: {},
      readingScores: {},
      totalStudyTime: 0,
      streak,
      lastStudyDate: '',
      freezeTokens,
    }),
  );
}

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

  it('streakAtRisk かつ保護トークンがあるとき、保護残数と安心メッセージを表示する', () => {
    const now = Date.now();
    const yesterdayTs = now - 24 * 60 * 60 * 1000;
    seedSession(toDateStr(new Date(yesterdayTs)), yesterdayTs);
    seedFreezeTokens(2);

    renderWithRouter(<StreakBanner />);
    const banner = screen.getByRole('alert');
    expect(banner.textContent).toContain('ストリーク保護 ×2');
    expect(banner.textContent).toContain('記録は守られます');
    // 緊急(途切れる)メッセージは出さない。
    expect(banner.textContent).not.toContain('記録が途切れます');
  });

  it('streakAtRisk かつ保護トークンが0のとき、途切れる警告を表示する', () => {
    const now = Date.now();
    const yesterdayTs = now - 24 * 60 * 60 * 1000;
    seedSession(toDateStr(new Date(yesterdayTs)), yesterdayTs);
    seedFreezeTokens(0);

    renderWithRouter(<StreakBanner />);
    const banner = screen.getByRole('alert');
    expect(banner.textContent).toContain('記録が途切れます');
    expect(banner.textContent).not.toContain('守られます');
  });

  it('保護トークンがあっても progress.streak=0 なら、守る対象が無いので保護メッセージは出さない', () => {
    // タイマー側の streak は at-risk だが、canonical な progress.streak は 0。
    const now = Date.now();
    const yesterdayTs = now - 24 * 60 * 60 * 1000;
    seedSession(toDateStr(new Date(yesterdayTs)), yesterdayTs);
    seedFreezeTokens(2, 0);

    renderWithRouter(<StreakBanner />);
    const banner = screen.getByRole('alert');
    expect(banner.textContent).toContain('記録が途切れます');
    expect(banner.textContent).not.toContain('守られます');
  });
});
