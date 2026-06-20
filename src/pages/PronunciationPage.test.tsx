// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, waitFor } from '../test/test-utils';
import PronunciationPage from './PronunciationPage';
import type { Section } from '../data/types';

expect.extend(matchers);

const mockSection: Section = {
  id: 'phrases',
  title: 'Phrases',
  titleJa: 'フレーズ',
  description: 'Common English phrases',
  icon: '💬',
  color: 'indigo',
  categories: [
    {
      id: 'cat1',
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
          description: 'Simple greetings',
          items: [
            { id: 'p1', english: 'Hello, how are you?', japanese: 'こんにちは、お元気ですか？', pronunciation: 'ハロー、ハウ アー ユー？' },
            { id: 'p2', english: 'Good morning!', japanese: 'おはようございます！', pronunciation: 'グッド モーニング！' },
            { id: 'p3', english: 'Nice to meet you.', japanese: 'はじめまして。', pronunciation: 'ナイス トゥ ミート ユー。' },
          ],
        },
      ],
    },
  ],
};

vi.mock('../data/sectionContent', () => ({
  loadSection: vi.fn(async () => mockSection),
  loadAllSections: vi.fn(async () => [mockSection]),
}));

describe('PronunciationPage', () => {
  it('renders the page heading', () => {
    renderWithRouter(<PronunciationPage />);
    expect(screen.getByRole('heading', { level: 1, name: '発音練習' })).toBeInTheDocument();
  });

  it('shows a phrase card after section data loads', async () => {
    renderWithRouter(<PronunciationPage />);
    // After the async loadSection resolves, PronunciationPractice renders a phrase
    await waitFor(() => {
      expect(screen.getByText('このフレーズを発音しよう')).toBeInTheDocument();
    });
    // Progress indicator visible: "1 / N"
    expect(screen.getByText(/1 \/ \d+/)).toBeInTheDocument();
  });

  it('shows the skip button and allows skipping to the next phrase', async () => {
    renderWithRouter(<PronunciationPage />);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'スキップ' })).toBeInTheDocument();
    });

    const skipBtn = screen.getByRole('button', { name: 'スキップ' });
    skipBtn.click();

    // After skipping, the progress counter should advance (or finished screen appears)
    await waitFor(() => {
      const hasProgress = screen.queryByText(/2 \/ \d+/) !== null;
      const hasFinished = screen.queryByRole('heading', { level: 2, name: '発音練習 完了' }) !== null;
      expect(hasProgress || hasFinished).toBe(true);
    });
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<PronunciationPage />);
    await waitFor(() => {
      expect(screen.getByText('このフレーズを発音しよう')).toBeInTheDocument();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
