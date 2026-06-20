// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import StudyGuide from './StudyGuide';

expect.extend(matchers);

describe('StudyGuide a11y', () => {
  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<StudyGuide />, { route: '/study-guide' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the roadmap heading and quick-nav links', () => {
    renderWithRouter(<StudyGuide />, { route: '/study-guide' });
    expect(
      screen.getByRole('heading', { level: 1, name: '学習ロードマップ' }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: /ホーム/ })).toBeTruthy();
  });
});
