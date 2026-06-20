import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * Render a component inside a router so <Link>/useParams etc. work in tests.
 * Pass `route` to set the initial URL (useful for pages that read params).
 */
export function renderWithRouter(ui: ReactElement, { route = '/' }: { route?: string } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

export * from '@testing-library/react';
