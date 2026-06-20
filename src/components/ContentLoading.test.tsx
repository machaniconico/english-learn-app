// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import ContentLoading from './ContentLoading';

expect.extend(matchers);

describe('ContentLoading', () => {
  it('renders a status role with the accessible label 読み込み中', () => {
    renderWithRouter(<ContentLoading />);
    const status = screen.getByRole('status', { name: '読み込み中' });
    expect(status).toBeInTheDocument();
  });

  it('exposes 読み込み中 text for screen readers', () => {
    renderWithRouter(<ContentLoading />);
    // The sr-only span provides visible-to-AT text content
    expect(screen.getByText('読み込み中')).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<ContentLoading />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
