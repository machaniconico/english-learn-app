// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { renderWithRouter, screen } from '../test/test-utils';
import ErrorCorrectionPage from './ErrorCorrectionPage';

expect.extend(matchers);

describe('ErrorCorrectionPage', () => {
  it('shows the selection list with set cards in default mode', () => {
    renderWithRouter(<ErrorCorrectionPage />, { route: '/error-correction' });
    expect(
      screen.getByRole('heading', { level: 1, name: /Error Correction Practice/i })
    ).toBeInTheDocument();
    expect(screen.getByText('初級編')).toBeInTheDocument();
    const startLinks = screen.getAllByText(/開始する/);
    expect(startLinks.length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /ホームに戻る/ })).toBeInTheDocument();
  });

  it('has no axe accessibility violations on the selection screen', async () => {
    const { container } = renderWithRouter(<ErrorCorrectionPage />, {
      route: '/error-correction',
    });
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders the quiz view with question buttons when a valid setId is given', () => {
    render(
      <MemoryRouter initialEntries={['/error-correction/ec-beginner']}>
        <Routes>
          <Route path="/error-correction/:setId" element={<ErrorCorrectionPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: '初級編' })).toBeInTheDocument();
    // The ErrorCorrection component renders 4 segment buttons (A/B/C/D)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
    // First question text indicator
    expect(screen.getByText(/Question 1/)).toBeInTheDocument();
  });

  it('shows feedback after clicking an answer option', () => {
    render(
      <MemoryRouter initialEntries={['/error-correction/ec-beginner']}>
        <Routes>
          <Route path="/error-correction/:setId" element={<ErrorCorrectionPage />} />
        </Routes>
      </MemoryRouter>
    );
    const buttons = screen.getAllByRole('button');
    // Click the first segment button (option A)
    fireEvent.click(buttons[0]);
    // After answering, feedback text appears
    const feedback = screen.getByRole('status');
    expect(feedback).toBeInTheDocument();
    // Next button appears
    expect(
      screen.getByRole('button', { name: /Next Question|See Results/ })
    ).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown setId', () => {
    render(
      <MemoryRouter initialEntries={['/error-correction/no-such-set']}>
        <Routes>
          <Route path="/error-correction/:setId" element={<ErrorCorrectionPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('問題セットが見つかりませんでした。')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /問題一覧に戻る/ })).toBeInTheDocument();
  });
});
