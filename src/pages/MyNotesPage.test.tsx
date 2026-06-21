// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
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
});
