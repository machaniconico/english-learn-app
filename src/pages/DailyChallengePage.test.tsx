// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import DailyChallengePage from './DailyChallengePage';

expect.extend(matchers);

describe('DailyChallengePage a11y', () => {
  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<DailyChallengePage />, { route: '/daily' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the page heading and the daily challenge cards', () => {
    renderWithRouter(<DailyChallengePage />, { route: '/daily' });
    expect(
      screen.getByRole('heading', { level: 1, name: '今日のチャレンジ' }),
    ).toBeTruthy();
    // Each of the 5 challenge cards has a clickable header button.
    expect(
      screen.getByRole('button', { name: /Word of the Day/ }),
    ).toBeTruthy();
  });
});
