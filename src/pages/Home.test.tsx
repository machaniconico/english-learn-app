// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import Home from './Home';

expect.extend(matchers);

describe('Home a11y smoke', () => {
  it('renders without axe violations', async () => {
    const { container } = renderWithRouter(<Home />, { route: '/' });

    // Light structure assertions so the test isn't axe-only.
    expect(screen.getByRole('heading', { level: 1, name: '英語を楽しく学ぼう' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /レベル診断テスト/ })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
