// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import DictationPage from './DictationPage';

expect.extend(matchers);

beforeEach(() => {
  localStorage.clear();
});

describe('DictationPage', () => {
  it('renders the selection view with set cards and heading', () => {
    renderWithRouter(<DictationPage />, { route: '/dictation' });
    expect(
      screen.getByRole('heading', { level: 1, name: /Dictation Practice/i })
    ).toBeInTheDocument();
    // Each set card has an "開始する" link
    expect(screen.getAllByText(/開始する/).length).toBeGreaterThan(0);
    // Back to home link
    expect(screen.getByRole('link', { name: /ホームに戻る/ })).toBeInTheDocument();
  });

  it('renders the practice view when a valid setId is provided', () => {
    render(
      <MemoryRouter initialEntries={['/dictation/dictation-beginner']}>
        <Routes>
          <Route path="/dictation/:setId" element={<DictationPage />} />
        </Routes>
      </MemoryRouter>
    );
    // The set title should appear
    expect(screen.getByRole('heading', { level: 1, name: /初級ディクテーション/i })).toBeInTheDocument();
    // The listening input should be visible
    expect(screen.getByRole('textbox', { name: /聞こえた英語を入力/ })).toBeInTheDocument();
    // The play button should be visible
    expect(screen.getByRole('button', { name: /再生する/ })).toBeInTheDocument();
  });

  it('shows the check button after typing input and fires feedback on submit', () => {
    render(
      <MemoryRouter initialEntries={['/dictation/dictation-beginner']}>
        <Routes>
          <Route path="/dictation/:setId" element={<DictationPage />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByRole('textbox', { name: /聞こえた英語を入力/ });
    // チェックする is disabled initially (empty input)
    const checkBtn = screen.getByRole('button', { name: /チェックする/ });
    expect(checkBtn).toBeDisabled();

    // Type the correct answer
    fireEvent.change(input, { target: { value: 'The meeting starts at ten.' } });
    expect(checkBtn).not.toBeDisabled();

    // Submit
    fireEvent.click(checkBtn);

    // Feedback appears
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Perfect/i)).toBeInTheDocument();
  });

  it('has no axe accessibility violations on the selection view', async () => {
    const { container } = renderWithRouter(<DictationPage />, { route: '/dictation' });
    expect(await axe(container)).toHaveNoViolations();
  });
});
