// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import AchievementsPage from './AchievementsPage';

expect.extend(matchers);

beforeEach(() => {
  localStorage.clear();
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

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<AchievementsPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
