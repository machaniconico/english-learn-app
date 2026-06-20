// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import ProgressPage from './ProgressPage';

expect.extend(matchers);

describe('ProgressPage a11y smoke', () => {
  it('renders the progress heading and key structure', () => {
    renderWithRouter(<ProgressPage />, { route: '/progress' });
    expect(
      screen.getByRole('heading', { level: 1, name: '学習の進捗' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'セクション別の進捗' }),
    ).toBeInTheDocument();
  });

  it('has no axe-detectable accessibility violations', async () => {
    const { container } = renderWithRouter(<ProgressPage />, {
      route: '/progress',
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
