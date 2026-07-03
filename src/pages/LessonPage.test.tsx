// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, fireEvent } from '../test/test-utils';
import LessonPage from './LessonPage';
import type { Section } from '../data/types';

expect.extend(matchers);

// Mock useSection so tests don't depend on async dynamic imports.
const mockSection: Section = {
  id: 'phrases',
  title: 'Phrases',
  titleJa: 'フレーズ',
  description: 'Common phrases',
  icon: '💬',
  color: 'blue',
  categories: [
    {
      id: 'greetings',
      title: 'Greetings',
      titleJa: 'あいさつ',
      description: 'Greeting phrases',
      icon: '👋',
      color: 'blue',
      lessons: [
        {
          id: 'lesson1',
          title: 'Basic Greetings',
          titleJa: '基本のあいさつ',
          description: 'Learn basic greetings',
          items: [
            {
              id: 'item1',
              english: 'Good morning',
              japanese: 'おはようございます',
              pronunciation: 'グッドモーニング',
              example: 'Good morning, everyone!',
              exampleJa: 'みなさん、おはようございます！',
            },
            {
              id: 'item2',
              english: 'Good evening',
              japanese: 'こんばんは',
              pronunciation: 'グッドイーブニング',
            },
          ],
        },
      ],
    },
  ],
};

vi.mock('../hooks/useSection', () => ({
  useSection: () => mockSection,
}));

function renderLesson(lessonId = 'lesson1') {
  return render(
    <MemoryRouter initialEntries={[`/section/phrases/greetings/${lessonId}`]}>
      <Routes>
        <Route
          path="/section/:sectionId/:categoryId/:lessonId"
          element={<LessonPage />}
        />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('LessonPage', () => {
  it('renders the lesson title, description, and phrase items', () => {
    renderLesson();
    expect(screen.getByRole('heading', { level: 1, name: 'Basic Greetings' })).toBeTruthy();
    expect(screen.getByText('基本のあいさつ')).toBeTruthy();
    expect(screen.getByText('Learn basic greetings')).toBeTruthy();
    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText('Good evening')).toBeTruthy();
    expect(screen.getByText('おはようございます')).toBeTruthy();
    expect(screen.getByText('こんばんは')).toBeTruthy();
  });

  it('shows listening progress at 0% initially and practice navigation links', () => {
    renderLesson();
    expect(screen.getByText('0 / 2 (0%)')).toBeTruthy();
    const progressBar = screen.getByRole('progressbar', { name: 'リスニング進捗' });
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByRole('link', { name: /フラッシュカードで練習/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: /リスニングクイズ/ })).toBeTruthy();
  });

  it('marks an item listened and updates progress when audio play button is clicked', () => {
    renderLesson();
    // Confirm リスニング済み is not shown initially
    expect(screen.queryByText('リスニング済み')).toBeNull();
    // All audio play buttons have aria-label "音声を再生"
    const playButtons = screen.getAllByRole('button', { name: '音声を再生' });
    // Click the first play button (for "Good morning")
    fireEvent.click(playButtons[0]);
    // Progress should update to 1/2
    expect(screen.getByText('1 / 2 (50%)')).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'リスニング進捗' })).toHaveAttribute(
      'aria-valuenow',
      '50',
    );
    expect(screen.getByText('リスニング済み')).toBeTruthy();
  });

  it('shows not-found when the lesson id does not exist', () => {
    renderLesson('nonexistent');
    expect(screen.getByText('レッスンが見つかりませんでした。')).toBeTruthy();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderLesson();
    expect(await axe(container)).toHaveNoViolations();
  });
});
