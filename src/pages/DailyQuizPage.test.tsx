import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/test-utils';
import DailyQuizPage from './DailyQuizPage';

describe('DailyQuizPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('デイリークイズの難易度選択を表示する', () => {
    renderWithRouter(<DailyQuizPage />);
    // sr-only の h1 と 見出し h2 の両方に出るため複数ヒットを許容
    expect(screen.getAllByText('デイリー10問クイズ').length).toBeGreaterThan(0);
    expect(screen.getByText('初級')).toBeTruthy();
  });

  it('スクリーンリーダー用の見出しを持つ', () => {
    renderWithRouter(<DailyQuizPage />);
    expect(screen.getByRole('heading', { name: 'デイリー10問クイズ', level: 1 })).toBeTruthy();
  });
});
