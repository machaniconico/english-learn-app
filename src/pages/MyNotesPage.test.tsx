// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import MyNotesPage from './MyNotesPage';
import { STORAGE_KEY as WORD_NOTES_KEY } from '../hooks/useWordNotes';

/**
 * MyNotesPage のページ単位テスト。
 * useWordNotes は localStorage('english-learn-word-notes')をソースにするので、
 * 各ケースでシードを投入してから render する。setup.ts の afterEach が
 * localStorage をクリアしてくれるが、シード前の状態は明示的に空にしておく。
 */

describe('MyNotesPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('notes が空のとき空状態メッセージと /dictionary への導線が出る', () => {
    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // 空状態メッセージ(<br /> で分割されているので正規表現で部分一致)
    expect(screen.getByText(/まだメモがありません。/)).toBeInTheDocument();
    // /dictionary への Link が存在する
    const link = screen.getByRole('link', { name: '📖 辞書を見る' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dictionary');
    // 一覧の見出し(件数)は 0 件
    expect(
      screen.getByRole('heading', { level: 1, name: '単語メモ 0 件' }),
    ).toBeInTheDocument();
  });

  it('localStorage にシードした既知の dict id のメモが english と本文と共に表示される', () => {
    // dict-basic-1 は dictionary の1件目("I" / "私")
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({ 'dict-basic-1': 'これは私のメモです' }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // english 見出し(h2)
    expect(screen.getByRole('heading', { level: 2, name: 'I' })).toBeInTheDocument();
    // 訳
    expect(screen.getByText('私')).toBeInTheDocument();
    // メモ本文
    expect(screen.getByText('これは私のメモです')).toBeInTheDocument();
    // 件数見出し
    expect(
      screen.getByRole('heading', { level: 1, name: '単語メモ 1 件' }),
    ).toBeInTheDocument();
  });

  it('『削除』を押すとその行のメモが画面と localStorage から消える', () => {
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({ 'dict-basic-1': '消されるメモ' }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // 事前にメモ本文が表示されている
    expect(screen.getByText('消されるメモ')).toBeInTheDocument();

    // 表示状態の『削除』ボタンを押す
    fireEvent.click(screen.getByRole('button', { name: 'I のメモを削除' }));

    // メモ本文が消える → 空状態に遷移
    expect(screen.queryByText('消されるメモ')).not.toBeInTheDocument();
    expect(screen.getByText(/まだメモがありません。/)).toBeInTheDocument();

    // localStorage からも消える
    const stored = JSON.parse(localStorage.getItem(WORD_NOTES_KEY) ?? '{}');
    expect(stored['dict-basic-1']).toBeUndefined();
  });

  it('『編集』→textarea に既存メモ→値変更→『保存』で新しいメモ本文が表示される', () => {
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({ 'dict-basic-1': '元のメモ' }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // 編集を開く
    fireEvent.click(screen.getByRole('button', { name: 'I のメモを編集' }));

    // textarea に既存メモが初期表示されている
    const textarea = screen.getByRole('textbox', { name: 'I のメモ' });
    expect(textarea).toHaveValue('元のメモ');

    // 値を変更して保存
    fireEvent.change(textarea, { target: { value: '書き換えたメモ' } });
    fireEvent.click(screen.getByRole('button', { name: 'I のメモを保存' }));

    // 新しいメモ本文が表示される(元のメモは消える)
    expect(screen.getByText('書き換えたメモ')).toBeInTheDocument();
    expect(screen.queryByText('元のメモ')).not.toBeInTheDocument();

    // localStorage にも新しいメモが永続化されている
    const stored = JSON.parse(localStorage.getItem(WORD_NOTES_KEY) ?? '{}');
    expect(stored['dict-basic-1']).toBe('書き換えたメモ');
  });

  it('辞書に存在しない wordId(孤児)でも wordId とメモ本文がフォールバック表示される', () => {
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({ 'orphan-id-xyz': '孤児のメモ' }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // フォールバック見出し
    expect(
      screen.getByRole('heading', { level: 2, name: '(辞書に存在しない単語)' }),
    ).toBeInTheDocument();
    // wordId が表示される
    expect(screen.getByText(/ID: orphan-id-xyz/)).toBeInTheDocument();
    // メモ本文も表示される
    expect(screen.getByText('孤児のメモ')).toBeInTheDocument();
  });

  it('『キャンセル』を押すと編集が破棄され元のメモ表示に戻る', () => {
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({ 'dict-basic-1': '元のメモ' }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    fireEvent.click(screen.getByRole('button', { name: 'I のメモを編集' }));
    const textarea = screen.getByRole('textbox', { name: 'I のメモ' });
    fireEvent.change(textarea, { target: { value: '書き換え' } });
    fireEvent.click(
      screen.getByRole('button', { name: 'I のメモ編集をキャンセル' }),
    );

    // 元のメモが表示される(書き換えは破棄)
    expect(screen.getByText('元のメモ')).toBeInTheDocument();
    expect(screen.queryByText('書き換え')).not.toBeInTheDocument();
    // localStorage は変更されない
    const stored = JSON.parse(localStorage.getItem(WORD_NOTES_KEY) ?? '{}');
    expect(stored['dict-basic-1']).toBe('元のメモ');
  });

  // ---- US-002: 検索 + 並べ替え ----

  it('メモ1件以上のとき検索 input と並べ替え select が表示される', () => {
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({ 'dict-basic-1': 'メモ' }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // 検索 input(type=search -> searchbox role)と並べ替え select(combobox role)
    expect(screen.getByRole('searchbox', { name: 'メモを検索' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '並べ替え' })).toBeInTheDocument();
  });

  it('メモ0件のとき検索UIは表示されず空状態のままである', () => {
    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // 空状態メッセージ
    expect(screen.getByText(/まだメモがありません。/)).toBeInTheDocument();
    // 検索UIは出ない
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('検索 input に英語/和訳/メモの一部を入れると一致行だけ残り他が消える', () => {
    // dict-basic-1 = "I"/"私", dict-basic-2 = "you"/"あなた", dict-basic-3 = "he"/"彼"
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({
        'dict-basic-1': 'apple 好き',
        'dict-basic-2': 'dog 好き',
        'dict-basic-3': 'cat 好き',
      }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // 事前に3件すべて表示されている
    expect(screen.getByRole('heading', { level: 2, name: 'I' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'you' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'he' })).toBeInTheDocument();

    const search = screen.getByRole('searchbox', { name: 'メモを検索' });

    // 英語で検索 -> you 行だけ残る
    fireEvent.change(search, { target: { value: 'you' } });
    expect(screen.getByRole('heading', { level: 2, name: 'you' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'I' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'he' })).not.toBeInTheDocument();

    // クリア -> 3件に戻る
    fireEvent.change(search, { target: { value: '' } });
    expect(screen.getByRole('heading', { level: 2, name: 'I' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'he' })).toBeInTheDocument();

    // 和訳で検索 -> he 行だけ残る(『彼』は dict-basic-3 の和訳)
    fireEvent.change(search, { target: { value: '彼' } });
    expect(screen.getByRole('heading', { level: 2, name: 'he' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'I' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'you' })).not.toBeInTheDocument();

    // クリア
    fireEvent.change(search, { target: { value: '' } });

    // メモ本文で検索 -> I 行だけ残る(『apple』は dict-basic-1 のメモ)
    fireEvent.change(search, { target: { value: 'apple' } });
    expect(screen.getByRole('heading', { level: 2, name: 'I' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'you' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: 'he' })).not.toBeInTheDocument();
  });

  it('ヒット無しのクエリで『該当するメモがありません』が表示される', () => {
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({ 'dict-basic-1': 'メモ' }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    const search = screen.getByRole('searchbox', { name: 'メモを検索' });
    fireEvent.change(search, { target: { value: 'zzzzzz' } });

    // 検索結果0件のメッセージ
    expect(screen.getByText('該当するメモがありません')).toBeInTheDocument();
    // 空状態の辞書導線(別物)は出ない
    expect(screen.queryByText(/まだメモがありません。/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '📖 辞書を見る' })).not.toBeInTheDocument();
  });

  it('並べ替え select を変更すると順序が変わる(先頭行の英語で確認)', () => {
    // dict-basic-1 = "I", dict-basic-2 = "you", dict-basic-3 = "he"
    // note を長さ順に変えておき、note-length-desc で確定的な順序を作る。
    //   dict-basic-2 のメモを一番長くすると、note-length-desc の先頭は 'you' になる。
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({
        'dict-basic-1': '中程度',
        'dict-basic-2': '一番長いメモ',
        'dict-basic-3': '短',
      }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    const select = screen.getByRole('combobox', { name: '並べ替え' });

    // 既定(word-asc=英語 A→Z)では『you』は先頭ではない(y は I/h より後)
    const headingsBefore = screen.getAllByRole('heading', { level: 2 });
    expect(headingsBefore[0].textContent).not.toBe('you');

    // 『メモが長い順』に変更 -> 一番長いメモ(dict-basic-2)の行が先頭に来る
    fireEvent.change(select, { target: { value: 'note-length-desc' } });
    const headingsAfter = screen.getAllByRole('heading', { level: 2 });
    expect(headingsAfter[0].textContent).toBe('you');

    // 『英語 Z→A』に変更 -> 先頭が変わる(word-desc は word-asc の逆順)
    fireEvent.change(select, { target: { value: 'word-desc' } });
    const headingsDesc = screen.getAllByRole('heading', { level: 2 });
    expect(headingsDesc[0].textContent).not.toBe(headingsBefore[0].textContent);
  });

  // ---- US-002: CSV エクスポート ----

  it('メモ1件以上のとき『CSVをエクスポート』ボタンが表示される', () => {
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({ 'dict-basic-1': 'メモ' }),
    );

    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // aria-label で部分一致(テキストとアイコン両方含むため name に 'CSVをエクスポート' を含む)
    const btn = screen.getByRole('button', { name: /メモをCSVでエクスポート/ });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it('『CSVをエクスポート』をクリックすると URL.createObjectURL が呼ばれる', () => {
    localStorage.setItem(
      WORD_NOTES_KEY,
      JSON.stringify({
        'dict-basic-1': 'apple 好き',
        'dict-basic-2': 'dog 好き',
      }),
    );

    // jsdom は createObjectURL / revokeObjectURL を持たないのでモックする。
    // HTMLAnchorElement.prototype.click も jsdom では何もしないが、明示的にモックして
    // クリック時の副作用(a.click が呼ばれたこと)を確認できるようにする。
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
      writable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: revokeObjectURL,
    });
    Object.defineProperty(HTMLAnchorElement.prototype, 'click', {
      configurable: true,
      writable: true,
      value: clickSpy,
    });

    try {
      renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

      fireEvent.click(
        screen.getByRole('button', { name: /メモをCSVでエクスポート/ }),
      );

      // createObjectURL が 1 回呼ばれる(Blob から URL を作る)
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      // a.click() も呼ばれる(ダウンロードトリガ)
      expect(clickSpy).toHaveBeenCalledTimes(1);
      // revokeObjectURL も呼ばれる(クリーンアップ)
      expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    } finally {
      // モックを必ず復元する(他テストへの影響を防ぐ)
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
        delete (HTMLAnchorElement.prototype as Partial<typeof HTMLAnchorElement.prototype>).click;
      }
    }
  });

  it('メモ0件(空状態)のときはエクスポートボタンが出ない', () => {
    renderWithRouter(<MyNotesPage />, { route: '/my-notes' });

    // 空状態メッセージ
    expect(screen.getByText(/まだメモがありません。/)).toBeInTheDocument();
    // エクスポートボタンは出ない(空状態は従来の辞書導線のみ)
    expect(
      screen.queryByRole('button', { name: /メモをCSVでエクスポート/ }),
    ).not.toBeInTheDocument();
  });
});
