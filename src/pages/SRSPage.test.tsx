// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test/test-utils';
import SRSPage from './SRSPage';

expect.extend(matchers);

describe('SRSPage a11y', () => {
  it('has no page-local a11y violations on the dashboard (empty state)', async () => {
    const { container } = renderWithRouter(<SRSPage />, { route: '/srs' });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the main heading and an entry-point link', () => {
    renderWithRouter(<SRSPage />, { route: '/srs' });

    expect(
      screen.getByRole('heading', { level: 1, name: 'SRS 間隔反復学習' }),
    ).toBeTruthy();
    // Empty state CTA linking back to lessons
    expect(screen.getByRole('link', { name: 'レッスンを見る' })).toBeTruthy();
  });
});
