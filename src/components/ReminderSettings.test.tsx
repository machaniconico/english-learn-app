// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { renderWithRouter, screen, fireEvent } from '../test/test-utils';
import ReminderSettings from './ReminderSettings';

const REMINDER_STORAGE_KEY = 'english-learn-reminder';
const TIMER_STORAGE_KEY = 'english-learn-study-time';

// ---------------------------------------------------------------------------
// Notification モック(useReminder.test.ts と同等の実装)
// jsdom/happy-dom はどちらも Notification を提供しないため、権限系の挙動を
// テストするには自前で取り付ける必要がある。
// ---------------------------------------------------------------------------
interface NotificationMock {
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
    requestPermission,
    setPermission: (p: NotificationPermission) => {
      permission = p;
    },
  };
}

// ---------------------------------------------------------------------------
// useStudyTimer の localStorage シードヘルパ
// ---------------------------------------------------------------------------
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function seedTodaySession(): void {
  const now = Date.now();
  const today = toDateStr(new Date(now));
  localStorage.setItem(
    TIMER_STORAGE_KEY,
    JSON.stringify({
      sessions: [
        {
          date: today,
          startTime: now - 300_000,
          endTime: now - 240_000,
          duration: 300,
          activity: 'reading',
        },
      ],
      currentActivity: null,
      currentStart: null,
      lastInteraction: null,
    }),
  );
}

describe('ReminderSettings', () => {
  beforeEach(() => {
    installNotificationMock('default');
  });

  afterEach(() => {
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
  // 今日学習済みの表示への影動(回帰)
  // -------------------------------------------------------------------------

  it('今日のセッションが存在する場合はトグル操作が壊れない(studiedToday 連携)', () => {
    seedTodaySession();
    renderWithRouter(<ReminderSettings />);
    const toggle = screen.getByLabelText('リマインダーを有効にする') as HTMLInputElement;
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(true);
  });
});
