// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import ReorderPage from './ReorderPage';

expect.extend(matchers);

describe('ReorderPage (selection mode) a11y', () => {
  it('renders the heading and set cards', () => {
    renderWithRouter(<ReorderPage />, { route: '/reorder' });

    // Page heading present
    expect(
      screen.getByRole('heading', { level: 1, name: /Sentence Reorder Quiz/i })
    ).toBeInTheDocument();

    // Each set card is a link leading into the quiz
    const cardLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href')?.startsWith('/reorder/'));
    expect(cardLinks.length).toBeGreaterThan(0);
  });

  it('has no page-local accessibility violations', async () => {
    const { container } = renderWithRouter(<ReorderPage />, { route: '/reorder' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
