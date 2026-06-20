// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import LevelTestPage from './LevelTestPage';

expect.extend(matchers);

describe('LevelTestPage a11y smoke', () => {
  it('renders the intro phase with no axe violations', async () => {
    const { container } = renderWithRouter(<LevelTestPage />, { route: '/level-test' });

    // Light structural assertions so the test isn't axe-only.
    expect(
      screen.getByRole('heading', { level: 1, name: 'レベル診断テスト' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'テストを始める' }),
    ).toBeTruthy();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
