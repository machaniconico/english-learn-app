// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, fireEvent } from '../test/test-utils';
import FlashcardPage from './FlashcardPage';
import type { Section } from '../data/types';

expect.extend(matchers);

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
              pronunciation: 'オハヨウゴザイマス',
            },
            {
              id: 'item2',
              english: 'Good evening',
              japanese: 'こんばんは',
              pronunciation: 'コンバンハ',
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

function renderFlashcard(lessonId = 'lesson1') {
  return render(
    <MemoryRouter initialEntries={[`/section/phrases/greetings/${lessonId}/flashcard`]}>
      <Routes>
        <Route
          path="/section/:sectionId/:categoryId/:lessonId/flashcard"
          element={<FlashcardPage />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('FlashcardPage', () => {
  it('renders the heading and lesson info', () => {
    renderFlashcard();
    expect(screen.getByRole('heading', { name: 'フラッシュカード' })).toBeTruthy();
    // Subtitle paragraph shows lesson.titleJa
    expect(screen.getByText(/基本のあいさつ/)).toBeTruthy();
  });

  it('shows the first card (English) and the flip button', () => {
    renderFlashcard();
    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByRole('button', { name: '答えを見る' })).toBeTruthy();
  });

  it('flips the card when the flip button is clicked', () => {
    renderFlashcard();
    const flipBtn = screen.getByRole('button', { name: '答えを見る' });
    fireEvent.click(flipBtn);
    expect(screen.getByRole('button', { name: '問題に戻る' })).toBeTruthy();
  });

  it('shows not-found when the lesson id does not exist', () => {
    renderFlashcard('nonexistent');
    expect(screen.getByText('レッスンが見つかりませんでした。')).toBeTruthy();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderFlashcard();
    expect(await axe(container)).toHaveNoViolations();
  });
});
