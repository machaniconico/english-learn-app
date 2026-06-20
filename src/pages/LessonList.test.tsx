// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen } from '../test/test-utils';
import LessonList from './LessonList';
import type { Section } from '../data/types';

expect.extend(matchers);

const mockSection: Section = {
  id: 'phrases',
  title: 'Common Phrases',
  titleJa: 'よく使うフレーズ',
  description: 'Essential phrases for everyday situations',
  icon: '💬',
  color: 'indigo',
  categories: [
    {
      id: 'greetings',
      title: 'Greetings',
      titleJa: 'あいさつ',
      description: 'Common greeting phrases',
      icon: '👋',
      color: 'indigo',
      lessons: [
        {
          id: 'lesson-1',
          title: 'Hello and Hi',
          titleJa: 'こんにちは・やあ',
          description: 'Basic greeting expressions',
          items: [
            {
              id: 'p1',
              english: 'Hello',
              japanese: 'こんにちは',
              pronunciation: 'ハロー',
            },
            {
              id: 'p2',
              english: 'Hi there',
              japanese: 'やあ',
              pronunciation: 'ハイ ゼア',
            },
          ],
        },
        {
          id: 'lesson-2',
          title: 'Goodbye',
          titleJa: 'さようなら',
          description: 'Farewell expressions',
          items: [
            {
              id: 'p3',
              english: 'Goodbye',
              japanese: 'さようなら',
              pronunciation: 'グッバイ',
            },
          ],
        },
      ],
    },
  ],
};

vi.mock('../hooks/useSection', () => ({
  useSection: vi.fn(),
}));

import { useSection } from '../hooks/useSection';

const mockUseSection = vi.mocked(useSection);

function renderLessonList(sectionId = 'phrases', categoryId = 'greetings') {
  return render(
    <MemoryRouter initialEntries={[`/section/${sectionId}/${categoryId}`]}>
      <Routes>
        <Route path="/section/:sectionId/:categoryId" element={<LessonList />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LessonList', () => {
  it('shows the loading state while section data is not yet available', () => {
    mockUseSection.mockReturnValue(undefined);
    renderLessonList();
    // While loading, no category heading or lesson cards are shown
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    expect(screen.queryByText('Hello and Hi')).toBeNull();
  });

  it('renders category title and lesson cards when data is loaded', () => {
    mockUseSection.mockReturnValue(mockSection);
    renderLessonList();

    // Category heading and Japanese subtitle
    expect(screen.getByRole('heading', { level: 1, name: 'Greetings' })).toBeTruthy();
    expect(screen.getByText('あいさつ')).toBeTruthy();
    // Both lesson titles appear
    expect(screen.getByRole('heading', { level: 2, name: 'Hello and Hi' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: 'Goodbye' })).toBeTruthy();
    // Phrase count labels
    expect(screen.getByText('2 フレーズ')).toBeTruthy();
    expect(screen.getByText('1 フレーズ')).toBeTruthy();
    // Action links: 学習, カード, クイズ per lesson (2 lessons = 2 each)
    expect(screen.getAllByRole('link', { name: /学習/ }).length).toBe(2);
    expect(screen.getAllByRole('link', { name: /カード/ }).length).toBe(2);
    expect(screen.getAllByRole('link', { name: /クイズ/ }).length).toBe(2);
  });

  it('shows not-found message when category id does not match', () => {
    mockUseSection.mockReturnValue(mockSection);
    renderLessonList('phrases', 'no-such-category');
    expect(screen.getByText('カテゴリが見つかりませんでした。')).toBeTruthy();
    expect(screen.getByRole('link', { name: /ホームに戻る/ })).toBeTruthy();
  });

  it('has no axe accessibility violations when lesson list is rendered', async () => {
    mockUseSection.mockReturnValue(mockSection);
    const { container } = renderLessonList();
    expect(await axe(container)).toHaveNoViolations();
  });
});
