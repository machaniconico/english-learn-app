// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import AchievementsPage from './AchievementsPage';

expect.extend(matchers);

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('AchievementsPage', () => {
  it('renders the daily goal section and the badge grid', () => {
    renderWithRouter(<AchievementsPage />);
    expect(screen.getByRole('heading', { name: '達成バッジ' })).toBeTruthy();
    expect(screen.getByText('今日の学習目標')).toBeTruthy();
    // A known badge title is present
    expect(screen.getByText('3日連続')).toBeTruthy();
    // Fresh user: nothing unlocked
    expect(screen.getByText(/^0 \/ \d+ 達成$/)).toBeTruthy();
  });

  it('lets the user change the daily goal and persists it (aria-pressed reflects state)', () => {
    renderWithRouter(<AchievementsPage />);
    // default goal is 10 -> the 10分 chip is pressed
    expect(screen.getByRole('button', { name: '10分' }).getAttribute('aria-pressed')).toBe('true');

    const btn20 = screen.getByRole('button', { name: '20分' });
    fireEvent.click(btn20);
    expect(btn20.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '10分' }).getAttribute('aria-pressed')).toBe('false');
    expect(localStorage.getItem('english-learn-daily-goal')).toBe('20');
  });

  it('shows a locked badge with partial progress when items are partially completed', () => {
    // 25 completed items -> items-50 badge is locked at 25/50
    localStorage.setItem(
      'english-learn-progress',
      JSON.stringify({
        lessons: { l1: { lessonId: 'l1', completedItems: Array.from({ length: 25 }, (_, i) => `i${i}`), lastAccessed: 0 } },
        fillInBlankScores: {},
        readingScores: {},
        totalStudyTime: 0,
        streak: 0,
        lastStudyDate: '',
      }),
    );
    renderWithRouter(<AchievementsPage />);
    expect(screen.getByText('25 / 50')).toBeTruthy();
  });

  it("counts only today's study minutes, not a yesterday-evening session still within 24h", () => {
    const now = Date.now();
    const dateStr = (t: number) => {
      const d = new Date(t);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    // Goal 30 so the ring distinguishes today=10 (33%) from the bug today=30 (100%).
    localStorage.setItem('english-learn-daily-goal', '30');
    localStorage.setItem(
      'english-learn-study-time',
      JSON.stringify({
        sessions: [
          // 10 min today
          { date: dateStr(now), startTime: now - 600_000, endTime: now, duration: 600, activity: 'lesson' },
          // 20 min "yesterday evening" but still inside the rolling 24h window
          {
            date: dateStr(now - 24 * 3600 * 1000),
            startTime: now - 23 * 3600 * 1000,
            endTime: now - 23 * 3600 * 1000 + 1_200_000,
            duration: 1200,
            activity: 'lesson',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      }),
    );
    renderWithRouter(<AchievementsPage />);
    // today's 10 min only (not 30) against a 30-min goal -> 33% (bug would show 100%)
    expect(screen.getByRole('status', { name: /33 パーセント/ })).toBeTruthy();
  });

  it('shows the streak-protection section with the current freeze-token count', () => {
    localStorage.setItem(
      'english-learn-progress',
      JSON.stringify({
        lessons: {},
        fillInBlankScores: {},
        readingScores: {},
        totalStudyTime: 0,
        streak: 14,
        lastStudyDate: '',
        freezeTokens: 2,
      }),
    );
    renderWithRouter(<AchievementsPage />);
    expect(screen.getByRole('heading', { name: 'ストリーク保護' })).toBeTruthy();
    expect(screen.getByText('2 / 3 個')).toBeTruthy();
    expect(screen.getByRole('img', { name: /ストリーク保護トークン 2 \/ 3 個/ })).toBeTruthy();
  });

  it('defaults the freeze-token count to 0 for a fresh user', () => {
    renderWithRouter(<AchievementsPage />);
    expect(screen.getByText('0 / 3 個')).toBeTruthy();
  });

  it('shows a countdown to the next freeze token when not maxed', () => {
    // streak=5, tokens=1 → 次の獲得まで 7-5=2 日。
    localStorage.setItem(
      'english-learn-progress',
      JSON.stringify({
        lessons: {},
        fillInBlankScores: {},
        readingScores: {},
        totalStudyTime: 0,
        streak: 5,
        lastStudyDate: '',
        freezeTokens: 1,
      }),
    );
    renderWithRouter(<AchievementsPage />);
    expect(screen.getByText('あと2日連続でトークンを1つ獲得')).toBeTruthy();
  });

  it('shows a maxed message when freeze tokens are at the cap', () => {
    localStorage.setItem(
      'english-learn-progress',
      JSON.stringify({
        lessons: {},
        fillInBlankScores: {},
        readingScores: {},
        totalStudyTime: 0,
        streak: 30,
        lastStudyDate: '',
        freezeTokens: 3,
      }),
    );
    renderWithRouter(<AchievementsPage />);
    expect(screen.getByText('最大まで保有しています')).toBeTruthy();
  });

  it('shows the weekly goal section and persists weekly goal changes (default 60)', () => {
    renderWithRouter(<AchievementsPage />);
    expect(screen.getByRole('heading', { name: '今週の学習目標' })).toBeTruthy();
    // 既定 60 分が選択済み(週用 aria-label で daily の 30分等と区別)。
    expect(
      screen.getByRole('button', { name: '今週の目標 60分' }).getAttribute('aria-pressed'),
    ).toBe('true');

    const btn120 = screen.getByRole('button', { name: '今週の目標 120分' });
    fireEvent.click(btn120);
    expect(btn120.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('english-learn-weekly-goal')).toBe('120');
  });

  it('sums the current calendar week into the weekly progress bar', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 24, 12, 0, 0)); // Wednesday

    const now = Date.now();
    const dateStr = (t: number) => {
      const d = new Date(t);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    const monday = new Date(2026, 5, 22, 10, 0, 0).getTime();
    localStorage.setItem('english-learn-weekly-goal', '60');
    localStorage.setItem(
      'english-learn-study-time',
      JSON.stringify({
        sessions: [
          { date: dateStr(now), startTime: now - 1_800_000, endTime: now, duration: 1800, activity: 'lesson' }, // 30分
          {
            date: dateStr(monday),
            startTime: monday,
            endTime: monday + 900_000,
            duration: 900, // 15分
            activity: 'lesson',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      }),
    );
    renderWithRouter(<AchievementsPage />);
    // 45分 / 60分 = 75%
    expect(screen.getByRole('progressbar', { name: '今週の学習目標の進捗' })).toHaveAttribute(
      'aria-valuenow',
      '75',
    );
  });

  it('shows 0 weekly minutes on Monday when only the previous week has sessions', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 22, 12, 0, 0)); // Monday

    const previousSunday = new Date(2026, 5, 21, 12, 0, 0).getTime();
    const dateStr = (t: number) => {
      const d = new Date(t);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    localStorage.setItem('english-learn-weekly-goal', '60');
    localStorage.setItem(
      'english-learn-study-time',
      JSON.stringify({
        sessions: [
          {
            date: dateStr(previousSunday),
            startTime: previousSunday,
            endTime: previousSunday + 2_700_000,
            duration: 2700, // 45分。直近7日なら入るが、月曜起点の今週には入らない。
            activity: 'lesson',
          },
        ],
        currentActivity: null,
        currentStart: null,
        lastInteraction: null,
      }),
    );

    renderWithRouter(<AchievementsPage />);

    expect(document.body).toHaveTextContent(/今週\s*0分\s*\/\s*目標 60分/);
    expect(screen.getByRole('progressbar', { name: '今週の学習目標の進捗' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<AchievementsPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
