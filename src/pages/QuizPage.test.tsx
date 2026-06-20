// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import QuizPage from './QuizPage';

expect.extend(matchers);

// ---------------------------------------------------------------------------
// Stable mock data
// ---------------------------------------------------------------------------

const ITEMS = [
  { id: 'i1', english: 'Hello', japanese: 'こんにちは', pronunciation: 'ハロー' },
  { id: 'i2', english: 'Good morning', japanese: 'おはようございます', pronunciation: 'グッドモーニング' },
  { id: 'i3', english: 'Good evening', japanese: 'こんばんは', pronunciation: 'グッドイーブニング' },
  { id: 'i4', english: 'Good night', japanese: 'おやすみなさい', pronunciation: 'グッドナイト' },
  { id: 'i5', english: 'Goodbye', japanese: 'さようなら', pronunciation: 'グッドバイ' },
];

const MOCK_LESSON = {
  id: 'greetings-basic',
  title: 'Basic Greetings',
  titleJa: '基本のあいさつ',
  description: 'Learn basic greetings',
  items: ITEMS,
};

const MOCK_SECTION = {
  id: 'phrases',
  title: 'Phrases',
  titleJa: 'フレーズ',
  description: 'Common phrases',
  icon: '💬',
  color: 'indigo',
  categories: [
    {
      id: 'greetings',
      title: 'Greetings',
      titleJa: 'あいさつ',
      description: 'Greeting phrases',
      icon: '👋',
      color: 'blue',
      lessons: [MOCK_LESSON],
    },
  ],
};

// ---------------------------------------------------------------------------
// Module mocks — hoisted so they apply before imports resolve
// ---------------------------------------------------------------------------

// useSection always returns the full mock; no async dynamic imports needed.
vi.mock('../hooks/useSection', () => ({
  useSection: () => MOCK_SECTION,
}));

// useParams is mocked so MemoryRouter (without a matched Route) provides params.
// Default: valid params that resolve to MOCK_LESSON.
const mockUseParams = vi.fn(() => ({
  sectionId: 'phrases',
  categoryId: 'greetings',
  lessonId: 'greetings-basic',
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const ROUTE = '/section/phrases/greetings/greetings-basic/quiz';

describe('QuizPage', () => {
  it('renders the page heading, lesson title, and Play Audio button', () => {
    renderWithRouter(<QuizPage />, { route: ROUTE });
    expect(screen.getByRole('heading', { name: 'リスニングクイズ' })).toBeTruthy();
    // Lesson title appears in the subtitle paragraph (and also in the back-link)
    expect(screen.getAllByText(/Basic Greetings/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Play audio' })).toBeTruthy();
  });

  it('shows the not-found state when the lesson id does not exist', () => {
    mockUseParams.mockReturnValueOnce({
      sectionId: 'phrases',
      categoryId: 'greetings',
      lessonId: 'nonexistent',
    });
    renderWithRouter(<QuizPage />, {
      route: '/section/phrases/greetings/nonexistent/quiz',
    });
    expect(screen.getByText('レッスンが見つかりませんでした。')).toBeTruthy();
    expect(screen.getByRole('link', { name: /ホームに戻る/ })).toBeTruthy();
  });

  it('shows 4 answer options and feedback after selecting one', () => {
    renderWithRouter(<QuizPage />, { route: ROUTE });

    // The quiz renders 4 choice buttons; each has aria-pressed attribute
    const options = screen.getAllByRole('button', { pressed: false });
    // Filter to the option buttons (exclude Play audio button which has aria-label)
    const choiceButtons = options.filter(
      (btn) => btn.getAttribute('aria-label') === null,
    );
    expect(choiceButtons.length).toBe(4);

    // Select the first option
    fireEvent.click(choiceButtons[0]);

    // A live-region status message appears with "Correct" or "Incorrect"
    const feedback = screen.getByRole('status');
    expect(feedback.textContent).toMatch(/Correct|Incorrect/);

    // "Next Question" or "See Results" button appears
    expect(
      screen.getByRole('button', { name: /Next Question|See Results/ }),
    ).toBeTruthy();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<QuizPage />, { route: ROUTE });
    expect(await axe(container)).toHaveNoViolations();
  });
});
