// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithRouter, screen } from '../test/test-utils';
import StreakBanner from './StreakBanner';

const PROGRESS_STORAGE_KEY = 'english-learn-progress';

// ---------------------------------------------------------------------------
// useProgress(=canonical なストリーク/保護トークン)の localStorage シードヘルパ
// ---------------------------------------------------------------------------
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** today から daysAgo 日前のローカル暦日文字列を返す(daysAgo=0 で今日)。 */
function daysAgoStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return toDateStr(d);
}

function seedProgress(opts: { streak: number; lastStudyDate: string; freezeTokens?: number }): void {
  localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({
      lessons: {},
      fillInBlankScores: {},
      readingScores: {},
      totalStudyTime: 0,
      streak: opts.streak,
      lastStudyDate: opts.lastStudyDate,
      freezeTokens: opts.freezeTokens ?? 0,
    }),
  );
}

describe('StreakBanner', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('streakAtRisk(連続記録あり・昨日学習・今日未学習)のときだけバナーを表示する', () => {
    seedProgress({ streak: 1, lastStudyDate: daysAgoStr(1) });

    renderWithRouter(<StreakBanner />);
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner.textContent).toContain('1日連続');
  });

  it('記録がない(streak=0)ときは何も表示しない', () => {
    renderWithRouter(<StreakBanner />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('今日すでに学習済み(lastStudyDate=today)のときはバナーを表示しない', () => {
    seedProgress({ streak: 5, lastStudyDate: daysAgoStr(0) });

    renderWithRouter(<StreakBanner />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('streakAtRisk かつ保護トークンがあるとき、保護残数と安心メッセージを表示する', () => {
    seedProgress({ streak: 7, lastStudyDate: daysAgoStr(1), freezeTokens: 2 });

    renderWithRouter(<StreakBanner />);
    const banner = screen.getByRole('alert');
    expect(banner.textContent).toContain('ストリーク保護 ×2');
    expect(banner.textContent).toContain('記録は守られます');
    expect(banner.textContent).not.toContain('記録が途切れます');
  });

  it('streakAtRisk かつ保護トークンが0のとき、途切れる警告を表示する', () => {
    seedProgress({ streak: 3, lastStudyDate: daysAgoStr(1), freezeTokens: 0 });

    renderWithRouter(<StreakBanner />);
    const banner = screen.getByRole('alert');
    expect(banner.textContent).toContain('記録が途切れます');
    expect(banner.textContent).not.toContain('守られます');
  });

  it('stale な記録(数日前が最終・保護トークンなし)は実効ストリークが0になり表示しない', () => {
    // lastStudyDate が3日前 → 2日分の穴。トークン0なので applyStreakBreak が streak=0 に。
    seedProgress({ streak: 9, lastStudyDate: daysAgoStr(3), freezeTokens: 0 });

    renderWithRouter(<StreakBanner />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('数日前が最終でも保護トークンで穴埋めできるなら、ブリッジ後の実効状態で表示する', () => {
    // lastStudyDate が3日前(2日分の穴)、トークン2 → ブリッジで streak 維持・トークンは0に。
    // 元の lastStudyDate は today でないので studiedToday=false → at-risk。
    seedProgress({ streak: 9, lastStudyDate: daysAgoStr(3), freezeTokens: 2 });

    renderWithRouter(<StreakBanner />);
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    // ブリッジで残数0になったため、保護メッセージではなく緊急メッセージになる。
    expect(banner.textContent).toContain('記録が途切れます');
  });
});
