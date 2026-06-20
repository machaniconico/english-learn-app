// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import SRSButton from './SRSButton';

expect.extend(matchers);

const STORAGE_KEY = 'english-learn-srs';

const item = {
  id: 'phrase-001',
  english: 'Hello',
  japanese: 'こんにちは',
  pronunciation: 'həˈloʊ',
};

function getStored(): Array<{ id: string }> {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

describe('SRSButton', () => {
  it('starts not in SRS: aria-pressed false, "SRS追加" label, nothing persisted', () => {
    const { container } = renderWithRouter(<SRSButton item={item} source="lesson-1" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(btn).toHaveAttribute('aria-label', 'SRSに追加');
    // No checkmark icon yet; shows the "SRS" text label
    expect(btn).toHaveTextContent('SRS');
    expect(getStored()).toHaveLength(0);
    void container;
  });

  it('clicking adds to SRS: aria-pressed flips to true, label changes, persists with full payload', () => {
    renderWithRouter(<SRSButton item={item} source="lesson-1" />);
    const btn = screen.getByRole('button');

    fireEvent.click(btn);

    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(btn).toHaveAttribute('aria-label', 'SRSから削除');

    const stored = getStored();
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      id: 'phrase-001',
      english: 'Hello',
      japanese: 'こんにちは',
      pronunciation: 'həˈloʊ',
      source: 'lesson-1',
    });
  });

  it('clicking again removes from SRS: aria-pressed back to false, storage emptied', () => {
    renderWithRouter(<SRSButton item={item} source="lesson-1" />);
    const btn = screen.getByRole('button');

    fireEvent.click(btn); // add
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(getStored()).toHaveLength(1);

    fireEvent.click(btn); // remove
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    expect(btn).toHaveAttribute('aria-label', 'SRSに追加');
    expect(getStored()).toHaveLength(0);
  });

  it('reflects pre-existing SRS state from localStorage on mount', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'phrase-001',
          english: 'Hello',
          japanese: 'こんにちは',
          pronunciation: 'həˈloʊ',
          source: 'seed',
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0,
          nextReview: '2026-06-20',
          lastReview: '',
        },
      ]),
    );

    renderWithRouter(<SRSButton item={item} source="lesson-1" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(btn).toHaveAttribute('aria-label', 'SRSから削除');
  });

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<SRSButton item={item} source="lesson-1" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
