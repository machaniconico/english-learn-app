// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, waitFor } from '../test/test-utils';
import TypingPracticePage from './TypingPracticePage';
import type { Section } from '../data/types';

expect.extend(matchers);

// Minimal section fixture with one PhraseItem so the page renders content.
const mockSection: Section = {
  id: 'phrases',
  title: 'Phrases',
  titleJa: 'フレーズ',
  description: 'Test phrases',
  icon: '💬',
  color: 'indigo',
  categories: [
    {
      id: 'cat1',
      title: 'Greetings',
      titleJa: 'あいさつ',
      description: '',
      icon: '👋',
      color: 'blue',
      lessons: [
        {
          id: 'les1',
          title: 'Basic',
          titleJa: '基本',
          description: '',
          items: [
            {
              id: 'p1',
              english: 'hello',
              japanese: 'こんにちは',
              pronunciation: 'ハロー',
            },
          ],
        },
      ],
    },
  ],
};

vi.mock('../data/sectionContent', () => ({
  loadSection: vi.fn(async (id: string) => (id === 'phrases' ? mockSection : null)),
  loadAllSections: vi.fn(async () => [mockSection]),
}));

beforeEach(() => {
  localStorage.clear();
});

describe('TypingPracticePage', () => {
  it('renders the page heading and Japanese prompt after section loads', async () => {
    renderWithRouter(<TypingPracticePage />);

    // Heading is always present immediately
    expect(screen.getByRole('heading', { name: 'タイピング練習' })).toBeTruthy();

    // After the async section loads the phrase appears
    await waitFor(() => {
      expect(screen.getByText('こんにちは')).toBeTruthy();
    });

    // Input and action buttons are visible
    expect(screen.getByRole('textbox', { name: '英語を入力' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '答えを見る' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'チェック' })).toBeTruthy();
  });

  it('reveals the correct answer when "答えを見る" is clicked', async () => {
    renderWithRouter(<TypingPracticePage />);

    await waitFor(() => {
      expect(screen.getByText('こんにちは')).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: '答えを見る' }));

    // After reveal: the answer text "hello" and the "次へ" / "結果を見る" button appear
    expect(screen.getByText('hello')).toBeTruthy();
    // Input is now disabled
    const input = screen.getByRole('textbox', { name: '英語を入力' }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    // The action buttons are replaced by the next button
    expect(screen.queryByRole('button', { name: '答えを見る' })).toBeNull();
    expect(screen.getByRole('button', { name: /次へ|結果を見る/ })).toBeTruthy();
  });

  it('marks a typed answer as correct and advances to the result screen', async () => {
    renderWithRouter(<TypingPracticePage />);

    await waitFor(() => {
      expect(screen.getByText('こんにちは')).toBeTruthy();
    });

    const input = screen.getByRole('textbox', { name: '英語を入力' });
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'チェック' }));

    // Correct feedback shown
    await waitFor(() => {
      expect(screen.getByText(/正解！/)).toBeTruthy();
    });

    // With one item, pressing 次へ → 結果を見る leads to the finished screen
    fireEvent.click(screen.getByRole('button', { name: /次へ|結果を見る/ }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'タイピング練習 完了' })).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: 'もう一度' })).toBeTruthy();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<TypingPracticePage />);

    // Wait for async content so axe sees the full rendered DOM
    await waitFor(() => {
      expect(screen.getByText('こんにちは')).toBeTruthy();
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});
