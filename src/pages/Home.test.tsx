// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import Home from './Home';
import type { SRSCard } from '../hooks/useSpacedRepetition';
import type { WeakPoint } from '../hooks/useWeakPoints';
import { STORAGE_KEY, type LastActivity } from '../hooks/useLastActivity';

expect.extend(matchers);

// 今日のローカル暦日を 'YYYY-MM-DD' で返す(useStudyTimer の getDateString と同等)。
function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('Home a11y smoke', () => {
  it('renders without axe violations', async () => {
    const { container } = renderWithRouter(<Home />, { route: '/' });

    // Light structure assertions so the test isn't axe-only.
    expect(screen.getByRole('heading', { level: 1, name: 'ホーム' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '英語を楽しく学ぼう' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /レベル診断テスト/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ドリルモード/ })).toHaveAttribute('href', '/drill');

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('places the single page h1 before any lower-level heading in DOM order', () => {
    renderWithRouter(<Home />, { route: '/' });

    const h1s = document.querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('ホーム');

    const headings = Array.from(document.querySelectorAll('h1,h2,h3'));
    expect(headings[0]).toBe(h1s[0]);
    expect(headings[0].tagName).toBe('H1');
  });
});

describe('Home 今日の復習 count', () => {
  it('shows the same review count from due SRS cards plus unmastered weak points', () => {
    const dueCards: SRSCard[] = [
      {
        id: 'due-card-1',
        english: 'apple',
        japanese: 'りんご',
        pronunciation: 'apple',
        source: 'test',
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReview: '2000-01-01',
        lastReview: '1999-12-31',
      },
      {
        id: 'due-card-2',
        english: 'book',
        japanese: '本',
        pronunciation: 'book',
        source: 'test',
        interval: 6,
        easeFactor: 2.3,
        repetitions: 1,
        nextReview: todayStr(),
        lastReview: '2000-01-01',
      },
      {
        id: 'future-card',
        english: 'future',
        japanese: '未来',
        pronunciation: 'future',
        source: 'test',
        interval: 10,
        easeFactor: 2.5,
        repetitions: 2,
        nextReview: '2999-01-01',
        lastReview: todayStr(),
      },
    ];
    const weakPoints: WeakPoint[] = [
      {
        id: 'weak-1',
        type: 'fill-in-blank',
        question: { prompt: 'test' },
        wrongAnswer: 'wrong',
        correctAnswer: 'right',
        timestamp: 1,
        reviewCount: 0,
        correctCount: 0,
        lastCorrect: false,
      },
      {
        id: 'weak-2',
        type: 'dictation',
        question: { prompt: 'test' },
        wrongAnswer: 'wrong',
        correctAnswer: 'right',
        timestamp: 2,
        reviewCount: 1,
        correctCount: 1,
        lastCorrect: true,
      },
      {
        id: 'mastered-weak',
        type: 'reorder',
        question: { prompt: 'test' },
        wrongAnswer: 'wrong',
        correctAnswer: 'right',
        timestamp: 3,
        reviewCount: 2,
        correctCount: 2,
        lastCorrect: true,
      },
    ];
    localStorage.setItem('english-learn-srs', JSON.stringify(dueCards));
    localStorage.setItem('english-learn-weak-points', JSON.stringify(weakPoints));

    renderWithRouter(<Home />, { route: '/' });

    expect(screen.getByText('復習タイミングの単語と弱点 4件')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /今日の復習/ })).toHaveAttribute('href', '/review');
  });
});

describe('Home 前回の続き card (US-002)', () => {
  it('shows the resume card with a Link to last.path when last-activity is seeded', () => {
    const seeded: LastActivity = { path: '/toeic-practice', label: 'TOEIC練習' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

    renderWithRouter(<Home />, { route: '/' });

    const card = screen.getByRole('link', { name: '前回の続き: TOEIC練習 を再開する' });
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('href', '/toeic-practice');
  });

  it('does not show the resume card when there is no last-activity', () => {
    renderWithRouter(<Home />, { route: '/' });
    expect(screen.queryByRole('link', { name: /前回の続き/ })).not.toBeInTheDocument();
  });

  it('clears last-activity and hides the card when the × button is clicked', () => {
    const seeded: LastActivity = { path: '/toeic-practice', label: 'TOEIC練習' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

    renderWithRouter(<Home />, { route: '/' });
    const clearBtn = screen.getByRole('button', { name: '前回の続きを閉じる' });
    fireEvent.click(clearBtn);

    // クリック後: カードが消え、localStorage も null に書き戻る。
    expect(screen.queryByRole('link', { name: '前回の続き: TOEIC練習 を再開する' })).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('null');
  });
});

describe('Home 復帰提案カード (round64)', () => {
  const PROGRESS_KEY = 'english-learn-progress';
  function seedLastStudy(daysAgo: number, extra: Record<string, unknown> = {}): void {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const lastStudyDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({
        lessons: {},
        fillInBlankScores: {},
        readingScores: {},
        totalStudyTime: 0,
        streak: 0,
        lastStudyDate,
        freezeTokens: 0,
        ...extra,
      }),
    );
  }

  it('3日以上ぶりのとき「おかえりなさい」カードを表示する', () => {
    seedLastStudy(5);
    renderWithRouter(<Home />, { route: '/' });
    expect(screen.getByText('おかえりなさい！')).toBeInTheDocument();
    expect(screen.getByText(/5日ぶりの学習/)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /クイズで再開する/ });
    expect(link).toHaveAttribute('href', '/daily-quiz');
  });

  it('今日学習済み(離脱0日)のときは復帰カードを出さない', () => {
    seedLastStudy(0, { streak: 1 });
    renderWithRouter(<Home />, { route: '/' });
    expect(screen.queryByText('おかえりなさい！')).not.toBeInTheDocument();
  });

  it('離脱が2日(threshold未満)なら復帰カードを出さない', () => {
    seedLastStudy(2);
    renderWithRouter(<Home />, { route: '/' });
    expect(screen.queryByText('おかえりなさい！')).not.toBeInTheDocument();
  });
});

describe('Home デイリー目標の進捗表示 (US-002)', () => {
  it('renders the daily-goal progressbar and 今日の目標 heading when goal & study-time are seeded', () => {
    // 目標分を 10 分に設定
    localStorage.setItem('english-learn-daily-goal', '10');
    // 今日のセッション(10分)を記録して達成状態にする
    const now = Date.now();
    const seeded = {
      sessions: [
        {
          date: todayStr(),
          startTime: now,
          endTime: now,
          duration: 600, // 秒 = 10分
          activity: 'test',
        },
      ],
      currentActivity: null,
      currentStart: null,
      lastInteraction: null,
    };
    localStorage.setItem('english-learn-study-time', JSON.stringify(seeded));

    renderWithRouter(<Home />, { route: '/' });

    // 進捗バー(role=progressbar)と『今日の目標』見出しが表示されること(最小アサーション)
    expect(screen.getByRole('progressbar', { name: '今日の学習目標の進捗' })).toBeInTheDocument();
    expect(screen.getByText('今日の目標')).toBeInTheDocument();
  });
});

describe('Home ストリーク保護チップ (Round 52)', () => {
  it('renders the freeze chip when progress.freezeTokens > 0', () => {
    // english-learn-progress に freezeTokens=2 と学習済みアイテムを入れて
    // hasProgress を成立させ、Progress Summary カードを表示させる。
    const seeded = {
      lessons: { l1: { lessonId: 'l1', completedItems: ['i1'], lastAccessed: 0 } },
      fillInBlankScores: {},
      readingScores: {},
      totalStudyTime: 0,
      streak: 5,
      lastStudyDate: '2026-01-01',
      freezeTokens: 2,
    };
    localStorage.setItem('english-learn-progress', JSON.stringify(seeded));

    renderWithRouter(<Home />, { route: '/' });

    expect(screen.getByText('❄️ ストリーク保護 ×2')).toBeInTheDocument();
  });
});
