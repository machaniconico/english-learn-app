// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { render, screen, fireEvent } from '../test/test-utils';
import AudioButton from './AudioButton';

expect.extend(matchers);

describe('AudioButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('has an accessible 日本語 label and toggles aria-pressed when played', () => {
    render(<AudioButton text="hello" />);
    const btn = screen.getByRole('button', { name: '音声を再生' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    // mock fires onstart->onend synchronously; after a play cycle it is idle again
    expect(speechSynthesis.speak).toHaveBeenCalledTimes(1);
  });

  it('calls the onPlayed callback when played', () => {
    const onPlayed = vi.fn();
    render(<AudioButton text="hi" onPlayed={onPlayed} />);
    fireEvent.click(screen.getByRole('button', { name: '音声を再生' }));
    expect(onPlayed).toHaveBeenCalledTimes(1);
  });

  it('has no axe accessibility violations', async () => {
    const { container } = render(<AudioButton text="hello" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
