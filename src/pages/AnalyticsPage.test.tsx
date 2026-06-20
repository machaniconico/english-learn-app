// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import AnalyticsPage from './AnalyticsPage';

expect.extend(matchers);

describe('AnalyticsPage a11y', () => {
  it('renders the page heading and period controls', () => {
    renderWithRouter(<AnalyticsPage />, { route: '/analytics' });
    expect(
      screen.getByRole('heading', { level: 1, name: '学習分析' })
    ).toBeInTheDocument();
    // Period selector buttons are present.
    expect(screen.getByRole('button', { name: '7日' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '全期間' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<AnalyticsPage />, { route: '/analytics' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
