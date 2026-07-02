// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { fireEvent, renderWithRouter, screen } from '../test/test-utils';
import DrillPage from './DrillPage';

describe('DrillPage', () => {
  it('ページ見出しと DrillMode の主要素を表示し、回答後に解説を出す', async () => {
    renderWithRouter(<DrillPage />, { route: '/drill' });

    expect(screen.getByRole('heading', { level: 1, name: 'ドリルモード' })).toBeInTheDocument();
    expect(screen.getByText(/止めるまで連続出題/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ホーム/ })).toHaveAttribute('href', '/');

    expect(screen.getByLabelText('難易度')).toBeInTheDocument();
    expect(screen.getByLabelText('ジャンル')).toBeInTheDocument();
    expect(await screen.findByText('第 1 問')).toBeInTheDocument();

    const answerButtons = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-pressed') !== null);
    fireEvent.click(answerButtons[0]);

    expect(screen.getByRole('status')).toHaveTextContent(/正解|不正解/);
    expect(screen.getByText(/解説 \(/)).toBeInTheDocument();
  });
});
