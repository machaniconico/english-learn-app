// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import FillInBlankPage from './FillInBlankPage';

expect.extend(matchers);

describe('FillInBlankPage a11y (selection view)', () => {
  it('renders the heading and set links', () => {
    renderWithRouter(<FillInBlankPage />, { route: '/toeic-practice' });
    expect(
      screen.getByRole('heading', { level: 1, name: /TOEIC Part 5 Practice/i })
    ).toBeInTheDocument();
    // At least one set card link should be present.
    expect(
      screen.getAllByRole('link', { name: /開始する/ }).length
    ).toBeGreaterThan(0);
  });

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<FillInBlankPage />, {
      route: '/toeic-practice',
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
