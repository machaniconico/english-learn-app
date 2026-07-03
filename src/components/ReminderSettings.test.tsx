// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import ReminderSettings from './ReminderSettings';

const REMINDER_STORAGE_KEY = 'english-learn-reminder';
const PROGRESS_STORAGE_KEY = 'english-learn-progress';
const INTERVAL_MS = 60_000;

// ---------------------------------------------------------------------------
// Notification モック(useReminder.test.ts と同等の実装)
// jsdom/happy-dom はどちらも Notification を提供しないため、権限系の挙動を
// テストするには自前で取り付ける必要がある。
// ---------------------------------------------------------------------------
interface NotificationMock {
  ctor: ReturnType<typeof vi.fn>;
  requestPermission: ReturnType<typeof vi.fn>;
  setPermission: (p: NotificationPermission) => void;
}

function installNotificationMock(
  initialPermission: NotificationPermission = 'default',
): NotificationMock {
  const ctor = vi.fn();
  const requestPermission = vi.fn(async (): Promise<NotificationPermission> => 'granted');
  let permission = initialPermission;
  const mock = Object.assign(ctor, {
    get permission(): NotificationPermission {
      return permission;
    },
    requestPermission,
  }) as unknown as typeof Notification;
  vi.stubGlobal('Notification', mock);
  return {
    ctor,
    requestPermission,
    setPermission: (p: NotificationPermission) => {
      permission = p;
    },
  };
}

// ---------------------------------------------------------------------------
// useProgress の localStorage シードヘルパ
// ---------------------------------------------------------------------------
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysAgoStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return toDateStr(d);
}

function seedProgress(opts: { streak: number; lastStudyDate: string; freezeTokens?: number }): void {
  localStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify({
      lessons: {},
      fillInBlankScores: {},
      readingScores: {},
      totalStudyTime: 0,
      streak: opts.streak,
      lastStudyDate: opts.lastStudyDate,
      freezeTokens: opts.freezeTokens ?? 0,
    }),
  );
}

function pinTime(date: Date): void {
  vi.useFakeTimers();
  vi.setSystemTime(date);
}

describe('ReminderSettings', () => {
  beforeEach(() => {
    installNotificationMock('default');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    // setup.ts の afterEach が localStorage.clear() を実行する。
  });

  // -------------------------------------------------------------------------
  // トグル
  // -------------------------------------------------------------------------

  it('トグルをオンにすると設定が有効化され localStorage に永続化される', () => {
    renderWithRouter(<ReminderSettings />);
    const toggle = screen.getByLabelText('リマインダーを有効にする') as HTMLInputElement;
    expect(toggle.checked).toBe(false);

    fireEvent.click(toggle);

    expect(toggle.checked).toBe(true);
    const stored = JSON.parse(localStorage.getItem(REMINDER_STORAGE_KEY) || 'null');
    expect(stored).toEqual({ enabled: true, time: '20:00' });
  });

  it('localStorage に enabled:true が保存されていれば初期状態でオン', () => {
    localStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify({ enabled: true, time: '07:30' }),
    );
    renderWithRouter(<ReminderSettings />);
    const toggle = screen.getByLabelText('リマインダーを有効にする') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
  });

  // -------------------------------------------------------------------------
  // 時刻入力
  // -------------------------------------------------------------------------

  it('時刻を変更すると setTime 経由で設定に反映される', () => {
    renderWithRouter(<ReminderSettings />);
    const timeInput = screen.getByLabelText('通知時刻') as HTMLInputElement;
    expect(timeInput.value).toBe('20:00');

    fireEvent.change(timeInput, { target: { value: '21:15' } });

    expect(timeInput.value).toBe('21:15');
    const stored = JSON.parse(localStorage.getItem(REMINDER_STORAGE_KEY) || 'null');
    expect(stored).toEqual({ enabled: false, time: '21:15' });
  });

  // -------------------------------------------------------------------------
  // 通知許可ボタン
  // -------------------------------------------------------------------------

  it('権限が default のとき「通知を許可」ボタンが表示され、クリックで requestPermission が呼ばれる', async () => {
    const mock = installNotificationMock('default');
    renderWithRouter(<ReminderSettings />);
    const btn = screen.getByRole('button', { name: '通知を許可' });
    expect(btn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(btn);
    });

    expect(mock.requestPermission).toHaveBeenCalled();
    // requestPermission のモックは 'granted' を返すため、許可済みメッセージに切り替わる。
    expect(screen.getByText('通知は許可されています')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '通知を許可' })).not.toBeInTheDocument();
  });

  it('権限が granted のときは許可ボタンを表示せず「通知は許可されています」と表示する', () => {
    installNotificationMock('granted');
    renderWithRouter(<ReminderSettings />);
    expect(screen.queryByRole('button', { name: '通知を許可' })).not.toBeInTheDocument();
    expect(screen.getByText('通知は許可されています')).toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // 未対応環境
  // -------------------------------------------------------------------------

  it('Notification 未対応環境では「お使いの環境は通知に未対応です」を表示する', () => {
    // jsdom はデフォルトで Notification を持たないため、モックを外すだけで再現できる。
    vi.unstubAllGlobals();
    try {
      delete (window as unknown as { Notification?: unknown }).Notification;
    } catch {
      /* ignore */
    }

    renderWithRouter(<ReminderSettings />);
    expect(screen.getByText('お使いの環境は通知に未対応です')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '通知を許可' })).not.toBeInTheDocument();
  });

  // -------------------------------------------------------------------------
  // useProgress 由来の streak/studiedToday 連携
  // -------------------------------------------------------------------------

  it('freeze で継続している streak を通知本文へ渡す', () => {
    pinTime(new Date('2026-06-21T20:05:00'));
    const mock = installNotificationMock('granted');
    localStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify({ enabled: true, time: '20:00' }),
    );
    seedProgress({ streak: 9, lastStudyDate: daysAgoStr(3), freezeTokens: 2 });

    renderWithRouter(<ReminderSettings />);

    act(() => {
      vi.advanceTimersByTime(INTERVAL_MS);
    });

    expect(mock.ctor).toHaveBeenCalledTimes(1);
    expect(mock.ctor).toHaveBeenCalledWith(
      '学習リマインダー',
      expect.objectContaining({
        body: expect.stringContaining('9日連続'),
        icon: '/icon-192.png',
      }),
    );
  });

  it('progress.lastStudyDate が今日ならセッションがなくても通知しない(studiedToday 連携)', () => {
    pinTime(new Date('2026-06-21T20:05:00'));
    const mock = installNotificationMock('granted');
    localStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify({ enabled: true, time: '20:00' }),
    );
    seedProgress({ streak: 5, lastStudyDate: daysAgoStr(0), freezeTokens: 0 });

    renderWithRouter(<ReminderSettings />);

    act(() => {
      vi.advanceTimersByTime(INTERVAL_MS);
    });

    expect(mock.ctor).not.toHaveBeenCalled();
  });

  it('progress.lastStudyDate が今日の場合もトグル操作が壊れない(studiedToday 連携)', () => {
    seedProgress({ streak: 1, lastStudyDate: daysAgoStr(0) });
    renderWithRouter(<ReminderSettings />);
    const toggle = screen.getByLabelText('リマインダーを有効にする') as HTMLInputElement;
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(true);
  });
});
