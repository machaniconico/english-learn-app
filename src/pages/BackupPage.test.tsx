// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen, fireEvent, waitFor } from '../test/test-utils';
import BackupPage from './BackupPage';
import { BACKUP_PREFIX } from '../utils/backup';

expect.extend(matchers);

// Seed some english-learn-* data so the export summary is non-empty
const seedStorage = () => {
  localStorage.setItem(`${BACKUP_PREFIX}progress`, JSON.stringify({ lessons: {} }));
  localStorage.setItem(`${BACKUP_PREFIX}bookmarks`, JSON.stringify([]));
  localStorage.setItem(`${BACKUP_PREFIX}theme`, 'dark');
};

beforeEach(() => {
  localStorage.clear();
  seedStorage();

  // Mock URL.createObjectURL and revokeObjectURL
  vi.stubGlobal('URL', {
    ...URL,
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('BackupPage', () => {
  it('renders the page heading and explanation', () => {
    renderWithRouter(<BackupPage />, { route: '/backup' });
    expect(
      screen.getByRole('heading', { level: 1, name: 'バックアップ / 復元' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/学習データはこのブラウザにのみ保存/)).toBeInTheDocument();
  });

  it('shows the export summary with seeded data categories', () => {
    renderWithRouter(<BackupPage />, { route: '/backup' });
    // Known labels for seeded keys
    expect(screen.getByText('学習進捗')).toBeInTheDocument();
    expect(screen.getByText('ブックマーク')).toBeInTheDocument();
    expect(screen.getByText('テーマ設定')).toBeInTheDocument();
    // Download button present
    expect(
      screen.getByRole('button', { name: 'バックアップをダウンロード' }),
    ).toBeInTheDocument();
  });

  it('shows empty state when no data is stored', () => {
    localStorage.clear();
    renderWithRouter(<BackupPage />, { route: '/backup' });
    expect(screen.getByText('保存された学習データがありません。')).toBeInTheDocument();
  });

  it('triggers a file download on export button click', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    renderWithRouter(<BackupPage />, { route: '/backup' });
    fireEvent.click(screen.getByRole('button', { name: 'バックアップをダウンロード' }));

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();
  });

  it('shows a parse error when an invalid JSON file is selected', async () => {
    renderWithRouter(<BackupPage />, { route: '/backup' });

    const input = screen.getByLabelText('バックアップファイルを選択');
    const invalidJson = new Blob(['not-json'], { type: 'application/json' });
    const file = new File([invalidJson], 'bad.json', { type: 'application/json' });

    // Simulate FileReader by firing change and resolving the reader asynchronously
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert')).toHaveTextContent('JSONの解析に失敗しました');
  });

  it('shows a parse error when the file is valid JSON but not an english-learn-app backup', async () => {
    renderWithRouter(<BackupPage />, { route: '/backup' });

    const input = screen.getByLabelText('バックアップファイルを選択');
    const wrongApp = new Blob([JSON.stringify({ app: 'other-app', data: {} })], {
      type: 'application/json',
    });
    const file = new File([wrongApp], 'wrong.json', { type: 'application/json' });

    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert')).toHaveTextContent('このアプリのバックアップではありません');
  });

  it('shows preview after selecting a valid backup file', async () => {
    const validBackup = {
      app: 'english-learn-app',
      version: 1,
      exportedAt: new Date('2024-01-15T10:00:00').getTime(),
      data: {
        'english-learn-progress': '{"lessons":{}}',
        'english-learn-theme': '"light"',
      },
    };
    const backupJson = JSON.stringify(validBackup);

    // Stub FileReader so onload fires synchronously with our JSON
    const OriginalFileReader = globalThis.FileReader;
    class MockFileReader extends OriginalFileReader {
      readAsText(): void {
        // Schedule as a microtask so the handler is set before we fire
        Promise.resolve().then(() => {
          Object.defineProperty(this, 'result', { value: backupJson, configurable: true });
          this.onload?.({ target: this } as ProgressEvent<FileReader>);
        });
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);

    renderWithRouter(<BackupPage />, { route: '/backup' });

    const input = screen.getByLabelText('バックアップファイルを選択');
    const file = new File([backupJson], 'backup.json', { type: 'application/json' });
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    fireEvent.change(input);

    // Preview list is rendered via aria-label "インポートするデータ"
    await waitFor(() => {
      expect(screen.getByRole('list', { name: 'インポートするデータ' })).toBeInTheDocument();
    });
    // Mode radios appear
    expect(screen.getByRole('radio', { name: '置き換え' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'マージ' })).toBeInTheDocument();
    // Restore button appears
    expect(screen.getByRole('button', { name: '復元する' })).toBeInTheDocument();
  });

  it('has no axe accessibility violations', async () => {
    const { container } = renderWithRouter(<BackupPage />, { route: '/backup' });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
