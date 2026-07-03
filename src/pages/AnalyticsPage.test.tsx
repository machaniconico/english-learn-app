// @vitest-environment jsdom
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { fireEvent, renderWithRouter, screen, within } from '../test/test-utils';
import type { AccuracyByLevel, AccuracyByType } from '../hooks/useAccuracy';
import AnalyticsPage from './AnalyticsPage';

const mockUseAccuracy = vi.hoisted(() => vi.fn());

vi.mock('../hooks/useAccuracy', () => ({
  useAccuracy: mockUseAccuracy,
}));

expect.extend(matchers);

const defaultByType: AccuracyByType[] = [
  { type: 'reorder', accuracy: 70, attempts: 2, total: 10 },
  { type: 'fill-in-blank', accuracy: 95, attempts: 2, total: 10 },
  { type: 'dictation', accuracy: 40, attempts: 2, total: 10 },
];

const defaultByLevel: AccuracyByLevel[] = [
  { level: 'advanced', accuracy: 88, attempts: 1 },
  { level: 'beginner', accuracy: 66, attempts: 1 },
  { level: 'intermediate', accuracy: 77, attempts: 1 },
];

const defaultTrends: Record<string, number[]> = {
  reorder: [60, 70],
  'fill-in-blank': [90, 95],
  dictation: [50, 40],
};

function setupAccuracyMock({
  byType = defaultByType.map((item) => ({ ...item })),
  byLevel = defaultByLevel.map((item) => ({ ...item })),
  trends = defaultTrends,
  freshTrendGetter = false,
}: {
  byType?: AccuracyByType[];
  byLevel?: AccuracyByLevel[];
  trends?: Record<string, number[]>;
  freshTrendGetter?: boolean;
} = {}) {
  const getOverallAccuracy = vi.fn(() => 74);
  const getAccuracyByType = vi.fn(() => byType);
  const getAccuracyByLevel = vi.fn(() => byLevel);
  const getWeakestTypes = vi.fn(() => []);
  const trendCalls: string[] = [];
  const createGetRecentTrend = () =>
    vi.fn((type: string, _lastN: number) => {
      trendCalls.push(type);
      return trends[type] ?? [];
    });

  if (freshTrendGetter) {
    mockUseAccuracy.mockImplementation(() => ({
      getOverallAccuracy,
      getAccuracyByType,
      getAccuracyByLevel,
      getRecentTrend: createGetRecentTrend(),
      getWeakestTypes,
    }));
  } else {
    mockUseAccuracy.mockReturnValue({
      getOverallAccuracy,
      getAccuracyByType,
      getAccuracyByLevel,
      getRecentTrend: createGetRecentTrend(),
      getWeakestTypes,
    });
  }

  return { byType, byLevel, trendCalls };
}

function getCardByHeading(name: string): HTMLElement {
  const heading = screen.getByRole('heading', { level: 2, name });
  const card = heading.parentElement;
  expect(card).not.toBeNull();
  return card as HTMLElement;
}

function expectLabelsInOrder(container: HTMLElement, labels: string[]) {
  const elements = labels.map((label) => within(container).getByText(label));
  for (let i = 0; i < elements.length - 1; i += 1) {
    expect(
      elements[i].compareDocumentPosition(elements[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  }
}

beforeEach(() => {
  mockUseAccuracy.mockReset();
  setupAccuracyMock();
});

describe('AnalyticsPage a11y', () => {
  it('renders the page heading and period controls', () => {
    renderWithRouter(<AnalyticsPage />, { route: '/analytics' });
    expect(
      screen.getByRole('heading', { level: 1, name: '学習分析' })
    ).toBeInTheDocument();
    // Period selector buttons are present.
    expect(screen.getByRole('button', { name: '7日' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '全期間' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = renderWithRouter(<AnalyticsPage />, { route: '/analytics' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('AnalyticsPage accuracy analysis ordering', () => {
  it('renders type accuracy descending and level order without mutating source arrays', () => {
    const byType: AccuracyByType[] = defaultByType.map((item) => ({ ...item }));
    const byLevel: AccuracyByLevel[] = defaultByLevel.map((item) => ({ ...item }));
    setupAccuracyMock({ byType, byLevel });

    renderWithRouter(<AnalyticsPage />, { route: '/analytics' });

    expectLabelsInOrder(getCardByHeading('問題タイプ別正答率'), [
      '穴埋め',
      '語順',
      'ディクテーション',
    ]);
    expectLabelsInOrder(getCardByHeading('レベル別正答率'), ['初級', '中級', '上級']);
    expect(byType.map((item) => item.type)).toEqual([
      'reorder',
      'fill-in-blank',
      'dictation',
    ]);
    expect(byLevel.map((item) => item.level)).toEqual([
      'advanced',
      'beginner',
      'intermediate',
    ]);
  });

  it('keeps trend type order stable after switching periods', () => {
    const byType: AccuracyByType[] = defaultByType.map((item) => ({ ...item }));
    const { trendCalls } = setupAccuracyMock({ byType, freshTrendGetter: true });

    renderWithRouter(<AnalyticsPage />, { route: '/analytics' });

    expectLabelsInOrder(getCardByHeading('正答率推移（直近10回）'), [
      '語順',
      '穴埋め',
      'ディクテーション',
    ]);

    fireEvent.click(screen.getByRole('button', { name: '30日' }));

    expectLabelsInOrder(getCardByHeading('正答率推移（直近10回）'), [
      '語順',
      '穴埋め',
      'ディクテーション',
    ]);
    expect(byType.map((item) => item.type)).toEqual([
      'reorder',
      'fill-in-blank',
      'dictation',
    ]);
    expect(trendCalls).toEqual([
      'reorder',
      'fill-in-blank',
      'dictation',
      'reorder',
      'fill-in-blank',
      'dictation',
    ]);
  });
});
