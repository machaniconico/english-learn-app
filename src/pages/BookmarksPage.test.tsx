// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, within } from '../test/test-utils';
import BookmarksPage from './BookmarksPage';

expect.extend(matchers);

const STORAGE_KEY = 'english-learn-bookmarks';

const seed = [
  {
    id: 'b1',
    english: 'Good morning',
    japanese: 'おはようございます',
    pronunciation: 'gʊd ˈmɔːrnɪŋ',
    source: 'phrases/greetings/basic-1',
    addedAt: 1000,
  },
  {
    id: 'b2',
    english: 'Thank you',
    japanese: 'ありがとう',
    pronunciation: 'θæŋk juː',
    source: 'phrases/greetings/basic-2',
    addedAt: 2000,
  },
];

describe('BookmarksPage a11y', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  });

  it('renders the populated bookmark list with its heading and controls', () => {
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    expect(
      screen.getByRole('heading', { level: 1, name: 'ブックマーク' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('searchbox', { name: 'ブックマークを検索' }),
    ).toBeInTheDocument();
    // One unbookmark control per seeded item.
    expect(screen.getAllByRole('button', { name: 'ブックマーク解除' })).toHaveLength(
      seed.length,
    );
  });

  it('has no page-local accessibility violations', async () => {
    const { container } = renderWithRouter(<BookmarksPage />, {
      route: '/bookmarks',
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Round 42: 検索・並べ替えの動作。複数件のブックマークを seed して挙動を確認する。
const searchSeed = [
  {
    id: 'b-apple',
    english: 'Apple',
    japanese: 'りんご',
    pronunciation: 'ˈæp.əl',
    source: 'dictionary/fruit/apple',
    addedAt: 1000,
  },
  {
    id: 'b-dog',
    english: 'Dog',
    japanese: '犬',
    pronunciation: 'dɔːɡ',
    source: 'phrases/animals/dog-1',
    addedAt: 3000,
  },
  {
    id: 'b-zebra',
    english: 'Zebra',
    japanese: '縞馬',
    pronunciation: 'ˈziː.brə',
    source: 'dictionary/animals/zebra',
    addedAt: 2000,
  },
];

// カードの見出し(english)を表示順に並べた配列を返す。並べ替え順の検証に使う。
function visibleEnglishOrder(): string[] {
  return screen
    .getAllByRole('heading', { level: 2 })
    .map((h) => h.textContent ?? '');
}

describe('BookmarksPage search & sort (round 42)', () => {
  beforeEach(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searchSeed));
  });

  it('検索語を入力するとブックマークが絞り込まれる', () => {
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    // 初期状態は全 3 件が見える。
    expect(visibleEnglishOrder()).toEqual(
      expect.arrayContaining(['Apple', 'Dog', 'Zebra']),
    );

    const searchBox = screen.getByRole('searchbox', {
      name: 'ブックマークを検索',
    });
    fireEvent.change(searchBox, { target: { value: 'dog' } });

    // 'dog' は Dog のみに一致。
    const headings = visibleEnglishOrder();
    expect(headings).toEqual(['Dog']);
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    expect(screen.queryByText('Zebra')).not.toBeInTheDocument();
  });

  it('source でも絞り込める', () => {
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    const searchBox = screen.getByRole('searchbox', {
      name: 'ブックマークを検索',
    });
    // 'animals' は Dog(phrases/animals) と Zebra(dictionary/animals) に一致。
    fireEvent.change(searchBox, { target: { value: 'animals' } });

    const headings = visibleEnglishOrder();
    expect(headings).toContain('Dog');
    expect(headings).toContain('Zebra');
    expect(headings).not.toContain('Apple');
  });

  it('並べ替えセレクトを変えると順序が変わる', () => {
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    const sortSelect = screen.getByRole('combobox', { name: '並べ替え' });

    // 既定は newest(addedAt 降順): Dog(3000) > Zebra(2000) > Apple(1000)
    expect(visibleEnglishOrder()).toEqual(['Dog', 'Zebra', 'Apple']);

    // oldest(addedAt 昇順): Apple(1000) < Zebra(2000) < Dog(3000)
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    expect(visibleEnglishOrder()).toEqual(['Apple', 'Zebra', 'Dog']);

    // alphabetical(english 昇順): Apple, Dog, Zebra
    fireEvent.change(sortSelect, { target: { value: 'alphabetical' } });
    expect(visibleEnglishOrder()).toEqual(['Apple', 'Dog', 'Zebra']);
  });

  it('検索ヒット0件のとき専用の空状態メッセージを出す', () => {
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    const searchBox = screen.getByRole('searchbox', {
      name: 'ブックマークを検索',
    });
    fireEvent.change(searchBox, { target: { value: 'zzzzz' } });

    expect(
      screen.getByText('該当するブックマークがありません'),
    ).toBeInTheDocument();
    // ブックマーク0件の空状態メッセージとは区別される(こちらは出ない)。
    expect(
      screen.queryByText('まだブックマークがありません'),
    ).not.toBeInTheDocument();
    // カードは一切表示されない。
    expect(
      screen.queryAllByRole('button', { name: 'ブックマーク解除' }),
    ).toHaveLength(0);
  });

  it('検索結果の件数が live region に出る', () => {
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    const searchBox = screen.getByRole('searchbox', {
      name: 'ブックマークを検索',
    });
    fireEvent.change(searchBox, { target: { value: 'apple' } });

    const status = screen.getByRole('status');
    expect(within(status).getByText(/1 件の結果/)).toBeInTheDocument();
  });
});

// Round 47: CSV エクスポート。MyNotesPage.test の流儀(createObjectURL /
// revokeObjectURL / anchor.click をモック)を踏襲する。
describe('BookmarksPage CSV export (round 47)', () => {
  it('ブックマークがあるとき『CSVでエクスポート』ボタンが表示される', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    expect(
      screen.getByRole('button', { name: /ブックマークをCSVでエクスポート/ }),
    ).toBeInTheDocument();
  });

  it('ブックマーク0件(空状態)のときはエクスポートボタンが出ない', () => {
    localStorage.removeItem(STORAGE_KEY);
    renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

    expect(
      screen.queryByRole('button', { name: /ブックマークをCSVでエクスポート/ }),
    ).not.toBeInTheDocument();
  });

  it('クリックすると URL.createObjectURL / a.click / revokeObjectURL が呼ばれる', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));

    // jsdom は createObjectURL / revokeObjectURL を持たないのでモックする。
    // HTMLAnchorElement.prototype.click も jsdom では何もしないので明示モックし
    // ダウンロードトリガを検証できるようにする。
    const createObjectURL = vi.fn().mockReturnValue('blob:fake-url');
    const revokeObjectURL = vi.fn();
    const clickSpy = vi.fn();
    const createObjectURLDesc = Object.getOwnPropertyDescriptor(
      URL,
      'createObjectURL',
    );
    const revokeObjectURLDesc = Object.getOwnPropertyDescriptor(
      URL,
      'revokeObjectURL',
    );
    const clickDesc = Object.getOwnPropertyDescriptor(
      HTMLAnchorElement.prototype,
      'click',
    );
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: revokeObjectURL,
    });
    Object.defineProperty(HTMLAnchorElement.prototype, 'click', {
      configurable: true,
      value: clickSpy,
    });

    try {
      renderWithRouter(<BookmarksPage />, { route: '/bookmarks' });

      fireEvent.click(
        screen.getByRole('button', {
          name: /ブックマークをCSVでエクスポート/,
        }),
      );

      // createObjectURL が 1 回呼ばれ、Blob から URL を作る。
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      expect(createObjectURL.mock.calls[0][0]).toBeInstanceOf(Blob);
      // a.click() も呼ばれる(ダウンロードトリガ)。
      expect(clickSpy).toHaveBeenCalledTimes(1);
      // revokeObjectURL も呼ばれる(クリーンアップ)。
      expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    } finally {
      if (createObjectURLDesc) {
        Object.defineProperty(URL, 'createObjectURL', createObjectURLDesc);
      } else {
        delete (URL as Partial<typeof URL>).createObjectURL;
      }
      if (revokeObjectURLDesc) {
        Object.defineProperty(URL, 'revokeObjectURL', revokeObjectURLDesc);
      } else {
        delete (URL as Partial<typeof URL>).revokeObjectURL;
      }
      if (clickDesc) {
        Object.defineProperty(HTMLAnchorElement.prototype, 'click', clickDesc);
      } else {
        delete (HTMLAnchorElement.prototype as Partial<
          typeof HTMLAnchorElement.prototype
        >).click;
      }
    }
  });
});
