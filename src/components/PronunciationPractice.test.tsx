// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import PronunciationPractice from './PronunciationPractice';
import type { PhraseItem } from '../data/types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

expect.extend(matchers);

vi.mock('../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: vi.fn(),
}));

const mockedHook = vi.mocked(useSpeechRecognition);

function setHook(over: Partial<ReturnType<typeof useSpeechRecognition>> = {}) {
  mockedHook.mockReturnValue({
    startListening: vi.fn(),
    stopListening: vi.fn(),
    listening: false,
    transcript: '',
    supported: true,
    ...over,
  });
}

const items: PhraseItem[] = [
  { id: '1', english: 'Good morning', japanese: 'おはよう', pronunciation: 'グッドモーニング' },
  { id: '2', english: 'Thank you', japanese: 'ありがとう', pronunciation: 'サンキュー' },
];

describe('PronunciationPractice', () => {
  beforeEach(() => {
    setHook();
  });

  it('shows the first target phrase, japanese, and a record button', () => {
    renderWithRouter(<PronunciationPractice items={items} />);
    expect(screen.getByText('Good morning')).toBeTruthy();
    expect(screen.getByText('おはよう')).toBeTruthy();
    const progressBar = screen.getByRole('progressbar', { name: '発音練習の進捗' });
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '2');
    expect(screen.getByRole('button', { name: '録音して発音する' })).toBeTruthy();
  });

  it('scores a perfect spoken match and highlights all words green', () => {
    setHook({ transcript: 'good morning', listening: false });
    renderWithRouter(<PronunciationPractice items={items} />);
    fireEvent.click(screen.getByRole('button', { name: '録音して発音する' }));

    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText(/2\/2 語一致/)).toBeTruthy();
    // transcript echoed
    expect(screen.getByText(/good morning/)).toBeTruthy();
  });

  it('scores a partial match and marks the missed word', () => {
    setHook({ transcript: 'morning', listening: false });
    renderWithRouter(<PronunciationPractice items={items} />);
    fireEvent.click(screen.getByRole('button', { name: '録音して発音する' }));
    // "Good" missed -> 50%
    expect(screen.getByText('50%')).toBeTruthy();
    expect(screen.getByText(/1\/2 語一致/)).toBeTruthy();
    expect(screen.getByLabelText('Good 不一致')).toHaveClass('line-through');
    expect(screen.getByLabelText('morning 一致')).toBeTruthy();
  });

  it('advances through items and shows an average score on the results screen', () => {
    setHook({ transcript: 'good morning', listening: false });
    renderWithRouter(<PronunciationPractice items={items} />);

    // Item 1: perfect
    fireEvent.click(screen.getByRole('button', { name: '録音して発音する' }));
    fireEvent.click(screen.getByRole('button', { name: '次へ →' }));

    // Item 2 ("Thank you") with the same transcript -> 0 match
    expect(screen.getByText('Thank you')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '録音して発音する' }));
    fireEvent.click(screen.getByRole('button', { name: '結果を見る' }));

    expect(screen.getByText('発音練習 完了')).toBeTruthy();
    // avg of 100 and 0 = 50
    expect(screen.getByRole('status').getAttribute('aria-label')).toMatch(/50 パーセント/);
  });

  it('retry re-records without double-counting the discarded attempt', () => {
    setHook({ transcript: 'good morning', listening: false });
    const single: PhraseItem[] = [items[0]];
    renderWithRouter(<PronunciationPractice items={single} />);

    fireEvent.click(screen.getByRole('button', { name: '録音して発音する' }));
    expect(screen.getByText('100%')).toBeTruthy();
    // Retry the same item
    fireEvent.click(screen.getByRole('button', { name: 'もう一度話す' }));
    // Finish (single item -> "結果を見る")
    fireEvent.click(screen.getByRole('button', { name: '結果を見る' }));

    expect(screen.getByText('発音練習 完了')).toBeTruthy();
    // Only ONE phrase counted (retry did not append a second score)
    expect(screen.getByText(/1フレーズの平均一致率/)).toBeTruthy();
    expect(screen.getByRole('status').getAttribute('aria-label')).toMatch(/100 パーセント/);
  });

  it('skipping an item excludes it from the average', () => {
    setHook({ transcript: 'good morning', listening: false });
    renderWithRouter(<PronunciationPractice items={items} />);

    // Item 1: record (100%) then next
    fireEvent.click(screen.getByRole('button', { name: '録音して発音する' }));
    fireEvent.click(screen.getByRole('button', { name: '次へ →' }));
    // Item 2: skip without recording
    fireEvent.click(screen.getByRole('button', { name: 'スキップ' }));

    expect(screen.getByText('発音練習 完了')).toBeTruthy();
    // Only the recorded item counts -> 1 phrase, avg 100
    expect(screen.getByText(/1フレーズの平均一致率/)).toBeTruthy();
    expect(screen.getByRole('status').getAttribute('aria-label')).toMatch(/100 パーセント/);
  });

  it('does not show a stale result for the next item before it is recorded', () => {
    // Mock keeps returning a transcript, but the next item must NOT show a result
    // until it is actually recorded (the recordedIndex guard).
    setHook({ transcript: 'good morning', listening: false });
    renderWithRouter(<PronunciationPractice items={items} />);

    fireEvent.click(screen.getByRole('button', { name: '録音して発音する' }));
    fireEvent.click(screen.getByRole('button', { name: '次へ →' }));

    // Now on item 2: no result/score should be displayed yet
    expect(screen.getByText('Thank you')).toBeTruthy();
    expect(screen.queryByText(/語一致/)).toBeNull();
    expect(screen.getByRole('button', { name: '録音して発音する' })).toBeTruthy();
  });

  it('shows an unsupported message when speech recognition is unavailable', () => {
    setHook({ supported: false });
    renderWithRouter(<PronunciationPractice items={items} />);
    expect(screen.getByRole('alert').textContent).toMatch(/音声認識に対応していません/);
    expect(screen.queryByRole('button', { name: '録音して発音する' })).toBeNull();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<PronunciationPractice items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
