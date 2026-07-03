// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, waitFor } from '../test/test-utils';
import ShareButton from './ShareButton';

expect.extend(matchers);

const URL = 'https://english-learn-app.pages.dev/';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ShareButton', () => {
  describe('with navigator.share available', () => {
    let shareMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      shareMock = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', {
        ...navigator,
        share: shareMock,
      });
    });

    it('calls navigator.share with title, generated text, and url on click', async () => {
      renderWithRouter(<ShareButton score={80} />);
      fireEvent.click(screen.getByRole('button', { name: '共有' }));

      await waitFor(() => expect(shareMock).toHaveBeenCalledTimes(1));
      expect(shareMock).toHaveBeenCalledWith({
        title: 'English Learn - 英語学習アプリ',
        text: 'English Learnで英語学習中！スコア80%を達成！',
        url: URL,
      });
    });

    it('uses provided title/text props over defaults', async () => {
      renderWithRouter(<ShareButton title="My Title" text="My custom text" />);
      fireEvent.click(screen.getByRole('button', { name: '共有' }));

      await waitFor(() => expect(shareMock).toHaveBeenCalledTimes(1));
      expect(shareMock).toHaveBeenCalledWith({
        title: 'My Title',
        text: 'My custom text',
        url: URL,
      });
    });

    it('does not open the dropdown when native share succeeds', async () => {
      renderWithRouter(<ShareButton />);
      fireEvent.click(screen.getByRole('button', { name: '共有' }));

      await waitFor(() => expect(shareMock).toHaveBeenCalled());
      // dropdown items should not appear
      expect(screen.queryByText('リンクをコピー')).not.toBeInTheDocument();
    });

    it('falls back to opening the dropdown when native share is rejected', async () => {
      shareMock.mockRejectedValueOnce(new Error('cancelled'));
      renderWithRouter(<ShareButton />);
      fireEvent.click(screen.getByRole('button', { name: '共有' }));

      // after the rejected promise resolves, dropdown opens
      expect(await screen.findByText('リンクをコピー')).toBeInTheDocument();
      expect(screen.getByText('X (Twitter) で共有')).toBeInTheDocument();
      expect(screen.getByText('LINE で共有')).toBeInTheDocument();
    });
  });

  describe('without navigator.share (dropdown + clipboard fallback)', () => {
    let writeTextMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      writeTextMock = vi.fn().mockResolvedValue(undefined);
      vi.spyOn(window, 'open').mockImplementation(() => null);
      vi.stubGlobal('navigator', {
        ...navigator,
        share: undefined,
        clipboard: { writeText: writeTextMock },
      });
    });

    it('toggles the dropdown open on the first click', () => {
      renderWithRouter(<ShareButton />);
      const trigger = screen.getByRole('button', { name: '共有' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('リンクをコピー')).toBeInTheDocument();
    });

    it('copies the url to clipboard and shows feedback when "リンクをコピー" is clicked', async () => {
      renderWithRouter(<ShareButton />);
      fireEvent.click(screen.getByRole('button', { name: '共有' }));
      fireEvent.click(screen.getByText('リンクをコピー'));

      await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith(URL));

      // trigger button label switches to copied feedback
      // (the button keeps aria-label="共有", so match on its visible text content)
      expect(await screen.findByText('コピーしました！')).toBeInTheDocument();
      // dropdown closes after copying
      expect(screen.queryByText('リンクをコピー')).not.toBeInTheDocument();
    });

    it('returns focus to the share trigger after copying the link', async () => {
      renderWithRouter(<ShareButton />);
      const trigger = screen.getByRole('button', { name: '共有' });
      fireEvent.click(trigger);

      const copyButton = screen.getByRole('button', { name: 'リンクをコピー' });
      copyButton.focus();
      expect(document.activeElement).toBe(copyButton);

      fireEvent.click(copyButton);

      await waitFor(() => expect(writeTextMock).toHaveBeenCalledWith(URL));
      await waitFor(() => expect(document.activeElement).toBe(trigger));
      expect(screen.queryByRole('button', { name: 'リンクをコピー' })).not.toBeInTheDocument();
      expect(document.activeElement).not.toBe(document.body);
    });

    it('closes the dropdown on Escape and returns focus to the share trigger', () => {
      renderWithRouter(<ShareButton />);
      const trigger = screen.getByRole('button', { name: '共有' });
      fireEvent.click(trigger);

      const copyButton = screen.getByRole('button', { name: 'リンクをコピー' });
      copyButton.focus();
      expect(document.activeElement).toBe(copyButton);

      fireEvent.keyDown(copyButton, { key: 'Escape' });

      expect(screen.queryByRole('button', { name: 'リンクをコピー' })).not.toBeInTheDocument();
      expect(document.activeElement).toBe(trigger);
    });

    it('has no accessibility violations with the dropdown open', async () => {
      const { container } = renderWithRouter(<ShareButton score={90} />);
      fireEvent.click(screen.getByRole('button', { name: '共有' }));
      expect(screen.getByText('リンクをコピー')).toBeInTheDocument();

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
