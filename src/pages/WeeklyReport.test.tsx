// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, within } from '../test/test-utils';
import WeeklyReport from './WeeklyReport';
import type { StudySession } from '../hooks/useStudyTimer';
import type { LearningEvent } from '../hooks/useAnalytics';
import type { QuizResult } from '../hooks/useAccuracy';

expect.extend(matchers);

const PROGRESS_STORAGE_KEY = 'english-learn-progress';
const TIMER_STORAGE_KEY = 'english-learn-study-time';
const ACCURACY_STORAGE_KEY = 'english-learn-accuracy';
const USER_LEVEL_STORAGE_KEY = 'english-learn-user-level';

beforeEach(() => {
  localStorage.clear();
});

// Build a study session for today so the report shows data this-week
function makeSession(minutesAgo: number, durationSeconds: number): StudySession {
  const now = Date.now();
  const startTime = now - minutesAgo * 60 * 1000;
  const endTime = startTime + durationSeconds * 1000;
  const d = new Date(startTime);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return {
    date: `${year}-${month}-${day}`,
    startTime,
    endTime,
    duration: durationSeconds,
    activity: 'lesson',
  };
}

function makeEvent(minutesAgo: number, score: number): LearningEvent {
  return {
    type: 'quiz_complete',
    score,
    timestamp: Date.now() - minutesAgo * 60 * 1000,
  };
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysAgoStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return toDateStr(d);
}

function makeSessionDaysAgo(daysAgo: number): StudySession {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const startTime = d.getTime();
  const endTime = startTime + 10 * 60 * 1000;
  return {
    date: toDateStr(d),
    startTime,
    endTime,
    duration: 10 * 60,
    activity: 'lesson',
  };
}

function seedTimerSessions(sessions: StudySession[]): void {
  localStorage.setItem(
    TIMER_STORAGE_KEY,
    JSON.stringify({ sessions, currentActivity: null, currentStart: null, lastInteraction: null }),
  );
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

function seedUserLevel(): void {
  localStorage.setItem(
    USER_LEVEL_STORAGE_KEY,
    JSON.stringify({ level: 'A1', diagnosedAt: Date.now(), levelHistory: [] }),
  );
}

function seedAccuracyResults(results: QuizResult[]): void {
  localStorage.setItem(ACCURACY_STORAGE_KEY, JSON.stringify(results));
}

describe('WeeklyReport', () => {
  it('renders the page heading and period toggle buttons', () => {
    renderWithRouter(<WeeklyReport />);
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();
    expect(screen.getByText('学習レポート')).toBeTruthy();

    expect(screen.getByRole('button', { name: '今週' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '先週' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '今月' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '先月' })).toBeTruthy();
  });

  it('switches active period when a toggle button is clicked', () => {
    renderWithRouter(<WeeklyReport />);

    const thisWeekBtn = screen.getByRole('button', { name: '今週' });
    const lastWeekBtn = screen.getByRole('button', { name: '先週' });

    // Default is this-week
    expect(thisWeekBtn.getAttribute('aria-pressed')).toBe('true');
    expect(lastWeekBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(lastWeekBtn);

    expect(lastWeekBtn.getAttribute('aria-pressed')).toBe('true');
    expect(thisWeekBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('shows study-time stats when localStorage has session data', () => {
    const sessions: StudySession[] = [
      makeSession(30, 30 * 60),  // 30 min session
      makeSession(60, 30 * 60),  // another 30 min session -> 60 min total
    ];
    localStorage.setItem(
      TIMER_STORAGE_KEY,
      JSON.stringify({ sessions, currentActivity: null, currentStart: null, lastInteraction: null }),
    );

    const events: LearningEvent[] = [makeEvent(45, 90)];
    localStorage.setItem('english-learn-analytics', JSON.stringify(events));

    renderWithRouter(<WeeklyReport />);

    // 60 minutes total = 1時間
    expect(screen.getByText('1時間')).toBeTruthy();
    // Achievement for reaching 60 min
    expect(screen.getByText('1時間学習達成')).toBeTruthy();
    // Stat card labels
    expect(screen.getByText('総学習時間')).toBeTruthy();
    expect(screen.getByText('学習日数')).toBeTruthy();
  });

  it('uses useProgress/applyStreakBreak for current streak and clamps longest to at least current', () => {
    seedProgress({ streak: 9, lastStudyDate: daysAgoStr(3), freezeTokens: 2 });
    seedTimerSessions([
      makeSessionDaysAgo(10),
      makeSessionDaysAgo(9),
      makeSessionDaysAgo(8),
      makeSessionDaysAgo(7),
    ]);

    renderWithRouter(<WeeklyReport />);

    const streakCard = screen.getByRole('heading', { name: '連続学習記録' }).closest('div');
    expect(streakCard).not.toBeNull();
    const scoped = within(streakCard as HTMLElement);
    const currentLabel = scoped.getByText('現在の連続日数');
    const longestLabel = scoped.getByText('最長記録');
    const current = Number(currentLabel.previousElementSibling?.textContent);
    const longest = Number(longestLabel.previousElementSibling?.textContent);

    expect(current).toBe(9);
    expect(longest).toBeGreaterThanOrEqual(current);
  });

  it('does not show level-up suggestion for high accuracy with fewer than 20 total answers', () => {
    seedUserLevel();
    seedAccuracyResults([
      {
        type: 'fill-in-blank',
        setId: 'small-sample',
        score: 90,
        total: 10,
        correct: 9,
        timestamp: Date.now(),
      },
    ]);

    renderWithRouter(<WeeklyReport />);

    expect(screen.queryByText('レベルアップのチャンス！')).not.toBeInTheDocument();
    expect(screen.getByText('現在の正答率: 90% — 85%以上かつ20問以上でレベルアップを提案します')).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<WeeklyReport />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
