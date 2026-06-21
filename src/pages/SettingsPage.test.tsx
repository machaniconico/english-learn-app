// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import { renderWithRouter, screen } from '../test/test-utils';
import SettingsPage from './SettingsPage';

expect.extend(matchers);

// ---------------------------------------------------------------------------
// Notification モック(ReminderSettings.test.tsx と同等の実装)
// jsdom/happy-dom は Notification を提供しないため、ReminderSettings 内の
// 権限系分岐を描画できるよう自前で取り付ける。今回は「許可済み」状態にし、
// 権限ボタン押下の副作用ではなくページ構造に焦点を合わせる。
// ---------------------------------------------------------------------------
function installNotificationMock(
  initialPermission: NotificationPermission = 'granted',
): void {
  const ctor = vi.fn();
  const requestPermission = vi.fn(async (): Promise<NotificationPermission> => 'granted');
  const permission = initialPermission;
  const mock = Object.assign(ctor, {
    get permission(): NotificationPermission {
      return permission;
    },
    requestPermission,
  }) as unknown as typeof Notification;
  vi.stubGlobal('Notification', mock);
}

describe('SettingsPage', () => {
  beforeEach(() => {
    // テーマ/文字サイズは setup.ts の matchMedia shim で描画可能。
    // リマインダー欄の「通知は許可されています」表示を安定させるため granted にする。
    installNotificationMock('granted');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    // setup.ts の afterEach が localStorage.clear() を実行する。
  });

  it('『設定』見出しと各設定カードが表示される', () => {
    renderWithRouter(<SettingsPage />, { route: '/settings' });
    // ページ見出し(h1)
    expect(
      screen.getByRole('heading', { level: 1, name: '設定' }),
    ).toBeInTheDocument();
    // テーマカード(US-001 ThemeSetting の h2)
    expect(
      screen.getByRole('heading', { level: 2, name: 'テーマ' }),
    ).toBeInTheDocument();
    // 文字サイズカード(FontScaleSetting の h2)
    expect(
      screen.getByRole('heading', { level: 2, name: '文字サイズ' }),
    ).toBeInTheDocument();
    // リマインダーカード(ReminderSettings の h2)
    expect(
      screen.getByRole('heading', { level: 2, name: 'リマインダー設定' }),
    ).toBeInTheDocument();
    // データ管理カード(本ページで追加した h2)
    expect(
      screen.getByRole('heading', { level: 2, name: 'データ管理' }),
    ).toBeInTheDocument();
  });

  it('テーマの3選択肢(ライト/ダーク/システム)が表示される', () => {
    renderWithRouter(<SettingsPage />, { route: '/settings' });
    const group = screen.getByRole('radiogroup', { name: 'テーマ' });
    expect(group).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /ライト/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /ダーク/ })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /システム/ })).toBeInTheDocument();
  });

  it('文字サイズの4選択肢が表示される', () => {
    renderWithRouter(<SettingsPage />, { route: '/settings' });
    expect(
      screen.getByRole('radiogroup', { name: '文字サイズ' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3 + 4); // テーマ3 + 文字サイズ4
  });

  it('リマインダーのトグルと時刻入力が表示される', () => {
    renderWithRouter(<SettingsPage />, { route: '/settings' });
    expect(
      screen.getByLabelText('リマインダーを有効にする'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('通知時刻')).toBeInTheDocument();
  });

  it('/backup へのリンクが存在する', () => {
    renderWithRouter(<SettingsPage />, { route: '/settings' });
    const link = screen.getByRole('link', { name: 'データのバックアップ/復元' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/backup');
  });

  it('ホームに戻るリンクが存在する', () => {
    renderWithRouter(<SettingsPage />, { route: '/settings' });
    expect(
      screen.getByRole('link', { name: /ホームに戻る/ }),
    ).toHaveAttribute('href', '/');
  });

  it('has no axe-detectable accessibility violations', async () => {
    const { container } = renderWithRouter(<SettingsPage />, {
      route: '/settings',
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
