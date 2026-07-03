// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import StudyPlanPage from './StudyPlanPage';

expect.extend(matchers);

// --- localStorage seed helpers ---

function seedUserLevel(diagnosedAt: number | null) {
  localStorage.setItem(
    'english-learn-user-level',
    JSON.stringify({ level: 'A1', diagnosedAt, levelHistory: [] }),
  );
}

function seedSRS(due: number) {
  const today = new Date().toISOString().slice(0, 10);
  const cards = Array.from({ length: due }, (_, i) => ({
    id: `card-${i}`,
    english: `word${i}`,
    japanese: `語${i}`,
    pronunciation: '',
    source: 'test',
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    nextReview: today,
    lastReview: '',
  }));
  localStorage.setItem('english-learn-srs', JSON.stringify(cards));
}

function seedWeakPoints(count: number) {
  const wps = Array.from({ length: count }, (_, i) => ({
    id: `wp-${i}`,
    type: 'fill-in-blank',
    question: {},
    wrongAnswer: 'x',
    correctAnswer: 'y',
    timestamp: Date.now(),
    reviewCount: 0,
    lastCorrect: false,
  }));
  localStorage.setItem('english-learn-weak-points', JSON.stringify(wps));
}

function seedWeakPointItems(items: unknown[]) {
  localStorage.setItem('english-learn-weak-points', JSON.stringify(items));
}

function seedDailyGoal(minutes: number) {
  localStorage.setItem('english-learn-daily-goal', String(minutes));
}

function seedStudyTime(todayMinutes: number) {
  const now = Date.now();
  const d = new Date(now);
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const durationSec = todayMinutes * 60;
  localStorage.setItem(
    'english-learn-study-time',
    JSON.stringify({
      sessions: todayMinutes > 0
        ? [{ date: dateStr, startTime: now - durationSec * 1000, endTime: now, duration: durationSec, activity: 'lesson' }]
        : [],
      currentActivity: null,
      currentStart: null,
      lastInteraction: null,
    }),
  );
}

function seedStreak(streak: number) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  localStorage.setItem(
    'english-learn-progress',
    JSON.stringify({
      lessons: {},
      fillInBlankScores: {},
      readingScores: {},
      totalStudyTime: 0,
      streak,
      lastStudyDate: dateStr,
    }),
  );
}

beforeEach(() => {
  localStorage.clear();
});

// =====================================================================
// Scenario 1: Undiagnosed user (fresh install)
// Expects: HIGH diagnose card visible, challenge (LOW) always present
// =====================================================================
describe('Scenario: undiagnosed user', () => {
  beforeEach(() => {
    seedUserLevel(null);      // not diagnosed
    seedSRS(0);               // no SRS cards
    seedWeakPoints(0);
    seedDailyGoal(10);
    seedStudyTime(0);
    seedStreak(0);
  });

  it('shows the level diagnosis recommendation as a HIGH priority item', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.getByText('レベル診断テスト')).toBeTruthy();
    expect(screen.getByText('診断を受ける')).toBeTruthy();
    // reason text
    expect(
      screen.getByText('あなたに合った教材を提案するため、まずはレベル診断を受けましょう。'),
    ).toBeTruthy();
  });

  it('shows the HIGH priority pill for the diagnose card', () => {
    renderWithRouter(<StudyPlanPage />);
    // There should be at least one "高" pill
    const pills = screen.getAllByText('高');
    expect(pills.length).toBeGreaterThanOrEqual(1);
  });

  it('always shows the デイリーチャレンジ (LOW) habit item', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.getByText('デイリーチャレンジ')).toBeTruthy();
    expect(screen.getByText('挑戦する')).toBeTruthy();
    expect(screen.getByText('毎日の習慣づくりに挑戦しましょう。')).toBeTruthy();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<StudyPlanPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// =====================================================================
// Scenario 2: Diagnosed user with due SRS cards and active weak points
// Expects: HIGH srs card, MEDIUM weak item, LOW challenge, no diagnose
// =====================================================================
describe('Scenario: diagnosed user with due SRS cards', () => {
  beforeEach(() => {
    seedUserLevel(Date.now() - 1000); // diagnosed
    seedSRS(5);                        // 5 due cards
    seedWeakPoints(3);                 // 3 non-mastered weak points
    seedDailyGoal(10);
    seedStudyTime(5);                  // 5 min studied (goal not met, todayMinutes > 0)
    seedStreak(3);
  });

  it('shows the SRS review card with correct reason text', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.getByText('今日の復習')).toBeTruthy();
    expect(screen.getByText('復習期限のカードが5枚あります。')).toBeTruthy();
  });

  it('does NOT show the diagnose recommendation for a diagnosed user', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.queryByText('レベル診断テスト')).toBeNull();
  });

  it('shows 苦手分野の克服 for active weak points', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.getByText('苦手分野の克服')).toBeTruthy();
  });

  it('counts only weak points that are not mastered by correctCount', () => {
    seedSRS(0);
    seedDailyGoal(0);
    seedWeakPointItems([
      {
        id: 'active-once-correct',
        type: 'fill-in-blank',
        question: {},
        wrongAnswer: 'x',
        correctAnswer: 'y',
        timestamp: Date.now(),
        reviewCount: 2,
        correctCount: 1,
        lastCorrect: true,
      },
      {
        id: 'mastered',
        type: 'fill-in-blank',
        question: {},
        wrongAnswer: 'x',
        correctAnswer: 'y',
        timestamp: Date.now(),
        reviewCount: 2,
        correctCount: 2,
        lastCorrect: true,
      },
      {
        id: 'legacy-review-count-only',
        type: 'fill-in-blank',
        question: {},
        wrongAnswer: 'x',
        correctAnswer: 'y',
        timestamp: Date.now(),
        reviewCount: 5,
        lastCorrect: true,
      },
    ]);

    renderWithRouter(<StudyPlanPage />);

    expect(screen.getByText('苦手な項目が2件あります。')).toBeTruthy();
  });

  it('shows the streak in the header', () => {
    renderWithRouter(<StudyPlanPage />);
    // streak value "3" is rendered in the header
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('shows the daily challenge with streak reason', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.getByText('3日連続学習中！習慣を継続しましょう。')).toBeTruthy();
  });

  it('shows LOW priority pill for the challenge item', () => {
    renderWithRouter(<StudyPlanPage />);
    const pills = screen.getAllByText('低');
    expect(pills.length).toBeGreaterThanOrEqual(1);
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<StudyPlanPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// =====================================================================
// Scenario 3: Goal just met — celebratory state
// Expects: celebratory panel visible; LOW challenge still shown
// =====================================================================
describe('Scenario: goal met with no pending high/medium items', () => {
  beforeEach(() => {
    seedUserLevel(Date.now() - 1000); // diagnosed
    seedSRS(0);                        // no due cards
    seedWeakPoints(0);                 // no weak points
    seedDailyGoal(10);
    seedStudyTime(10);                 // exactly met
    seedStreak(7);
  });

  it('shows the celebratory completion panel', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.getByText('今日のおすすめは完了です！')).toBeTruthy();
  });

  it('still shows the デイリーチャレンジ habit card', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.getByText('デイリーチャレンジ')).toBeTruthy();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<StudyPlanPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// =====================================================================
// Scenario 4: todayMinutes === 0 with goal set → goal card is HIGH
// =====================================================================
describe('Scenario: no study done yet today, goal set', () => {
  beforeEach(() => {
    seedUserLevel(Date.now() - 1000); // diagnosed
    seedSRS(0);
    seedWeakPoints(0);
    seedDailyGoal(20);
    seedStudyTime(0);                  // zero minutes
    seedStreak(0);
  });

  it('shows today\'s goal card at HIGH priority when todayMinutes is 0', () => {
    renderWithRouter(<StudyPlanPage />);
    expect(screen.getByText('今日の学習目標')).toBeTruthy();
    expect(screen.getByText('今日の目標まであと20分です。')).toBeTruthy();
    // HIGH pill present
    const pills = screen.getAllByText('高');
    expect(pills.length).toBeGreaterThanOrEqual(1);
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<StudyPlanPage />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
