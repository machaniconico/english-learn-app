// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReminder } from './useReminder';
import type { ReminderSettings } from '../utils/reminder';

const STORAGE_KEY = 'english-learn-reminder';
const LAST_NOTIFIED_KEY = 'english-learn-reminder-last-notified';
const INTERVAL_MS = 60_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStoredSettings(): ReminderSettings | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as ReminderSettings;
}

function getStoredLastNotified(): string | null {
  return localStorage.getItem(LAST_NOTIFIED_KEY);
}

// Notification コンストラクタ兼スタティック API のモックを window に取り付ける。
// `new Notification(title, options)` 呼び出しを記録しつつ、permission と
// requestPermission() の振る舞いを制御できる。
// 返り値の mock.ctor が `new Notification(...)` の呼び出しを記録する spy になる。
interface NotificationMock {
  ctor: ReturnType<typeof vi.fn>;
  requestPermission: ReturnType<typeof vi.fn>;
  setPermission: (p: NotificationPermission) => void;
}

let currentMock: NotificationMock | null = null;

function installNotificationMock(
  initialPermission: NotificationPermission = 'default',
): NotificationMock {
  const ctor = vi.fn();
  const requestPermission = vi.fn(async (): Promise<NotificationPermission> => 'granted');
  // permission はゲッター経由で読まれるため、インスタンス変数を経由して動的に参照させる。
  let permission = initialPermission;
  const mock = Object.assign(ctor, {
    get permission(): NotificationPermission {
      return permission;
    },
    requestPermission,
  }) as unknown as typeof Notification;
  vi.stubGlobal('Notification', mock);
  const wrapped: NotificationMock = {
    ctor,
    requestPermission,
    setPermission: (p: NotificationPermission) => {
      permission = p;
    },
  };
  currentMock = wrapped;
  return wrapped;
}

function clearNotificationMock(): void {
  vi.unstubAllGlobals();
  currentMock = null;
}

// 直近に installNotificationMock で取り付けたモックの ctor spy を返す。
function notificationCtor(): ReturnType<typeof vi.fn> {
  if (!currentMock) throw new Error('Notification mock not installed');
  return currentMock.ctor;
}

// 今日 20:05 に固定(既定時刻 20:00 を過ぎた状態)。必要に応じて上書き。
function pinTime(date: Date): void {
  vi.useFakeTimers();
  vi.setSystemTime(date);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useReminder', () => {
  beforeEach(() => {
    // デフォルト: Notification は対応環境で権限 default とする。
    installNotificationMock('default');
  });

  afterEach(() => {
    vi.useRealTimers();
    clearNotificationMock();
    // setup.ts の afterEach が localStorage.clear() を実行する。
  });

  // -------------------------------------------------------------------------
  // 1. 返り値の形と localStorage 永続化
  // -------------------------------------------------------------------------

  describe('settings persistence', () => {
    it('初期状態は既定設定 {enabled:false, time:"20:00"} を返す', () => {
      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );
      expect(result.current.settings).toEqual({ enabled: false, time: '20:00' });
      expect(result.current.permission).toBe('default');
      expect(result.current.canNotify).toBe(false);
    });

    it('保存済み設定が localStorage から復元される', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ enabled: true, time: '07:30' }),
      );
      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );
      expect(result.current.settings).toEqual({ enabled: true, time: '07:30' });
    });

    it('setEnabled(true) が設定を更新し localStorage に永続化する', () => {
      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );
      act(() => {
        result.current.setEnabled(true);
      });
      expect(result.current.settings.enabled).toBe(true);
      expect(getStoredSettings()).toEqual({ enabled: true, time: '20:00' });
    });

    it('setTime("21:15") が設定を更新し localStorage に永続化する', () => {
      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );
      act(() => {
        result.current.setTime('21:15');
      });
      expect(result.current.settings.time).toBe('21:15');
      expect(getStoredSettings()).toEqual({ enabled: false, time: '21:15' });
    });

    it('破損した localStorage 値は既定設定にフォールバックする(クラッシュしない)', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json');
      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );
      expect(result.current.settings).toEqual({ enabled: false, time: '20:00' });
    });
  });

  // -------------------------------------------------------------------------
  // 2. requestPermission
  // -------------------------------------------------------------------------

  describe('requestPermission', () => {
    it('Notification.requestPermission を呼び permission を更新する', async () => {
      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );
      expect(result.current.permission).toBe('default');

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.permission).toBe('granted');
      expect(result.current.canNotify).toBe(true);
      expect(currentMock?.requestPermission).toHaveBeenCalled();
    });

    it('requestPermission が拒否された場合は permission が denied になる', async () => {
      // モックの requestPermission を denied 返しに切り替える。
      currentMock?.requestPermission.mockResolvedValueOnce('denied');
      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );

      await act(async () => {
        await result.current.requestPermission();
      });

      expect(result.current.permission).toBe('denied');
      expect(result.current.canNotify).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 3. 通知発火(1日1回・重複防止)
  // -------------------------------------------------------------------------

  describe('notification firing', () => {
    it('enabled & granted & !studiedToday & 時刻到達 で1回だけ new Notification が呼ばれる', () => {
      // 今日 20:05 に固定(既定時刻 20:00 到達済み)。
      pinTime(new Date('2026-06-21T20:05:00'));

      // 権限 granted で取り付け直す。
      installNotificationMock('granted');

      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 3, todayStr: '2026-06-21' }),
      );

      act(() => {
        result.current.setEnabled(true);
      });

      // まだ発火していない(インターバル経過前)。
      expect(notificationCtor()).not.toHaveBeenCalled();

      // インターバル(60秒)を1回分進める。
      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS);
      });

      expect(notificationCtor()).toHaveBeenCalledTimes(1);
      // body は evaluateReminder の streakAtRisk メッセージ(currentStreak=3)。
      expect(notificationCtor()).toHaveBeenCalledWith(
        '学習リマインダー',
        expect.objectContaining({
          icon: '/icon-192.png',
          body: expect.stringContaining('3日連続'),
        }),
      );
      // 重複防止フラグが今日の日付で保存される。
      expect(getStoredLastNotified()).toBe('2026-06-21');
    });

    it('同日内にインターバルがもう1回回っても2回目は発火しない(重複防止)', () => {
      pinTime(new Date('2026-06-21T20:05:00'));
      installNotificationMock('granted');

      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 1, todayStr: '2026-06-21' }),
      );

      act(() => {
        result.current.setEnabled(true);
      });

      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS);
      });
      expect(notificationCtor()).toHaveBeenCalledTimes(1);

      // さらにもう1回インターバルを進めても発火しない。
      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS);
      });
      expect(notificationCtor()).toHaveBeenCalledTimes(1);
      expect(getStoredLastNotified()).toBe('2026-06-21');
    });

    it('disabled のときは時刻到達しても発火しない', () => {
      pinTime(new Date('2026-06-21T20:05:00'));
      installNotificationMock('granted');

      renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );
      // enabled は既定 false のまま何もしない。

      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS);
      });

      expect(notificationCtor()).not.toHaveBeenCalled();
    });

    it('権限が granted でなければ発火しない', () => {
      pinTime(new Date('2026-06-21T20:05:00'));
      // 権限 default のまま(beforeEach で取り付けたモック)。
      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );

      act(() => {
        result.current.setEnabled(true);
      });

      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS);
      });

      expect(notificationCtor()).not.toHaveBeenCalled();
    });

    it('今日すでに学習済み(studiedToday=true)のときは発火しない', () => {
      pinTime(new Date('2026-06-21T20:05:00'));
      installNotificationMock('granted');

      const { result } = renderHook(() =>
        useReminder({ studiedToday: true, currentStreak: 5, todayStr: '2026-06-21' }),
      );

      act(() => {
        result.current.setEnabled(true);
      });

      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS);
      });

      expect(notificationCtor()).not.toHaveBeenCalled();
    });

    it('時刻到達前(20:00より前)は発火しない', () => {
      pinTime(new Date('2026-06-21T19:30:00'));
      installNotificationMock('granted');

      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 2, todayStr: '2026-06-21' }),
      );

      act(() => {
        result.current.setEnabled(true);
      });

      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS);
      });

      expect(notificationCtor()).not.toHaveBeenCalled();
    });

    it('日付が変わったら再び発火可能になる(last-notified は今日の日付でのみ抑制)', () => {
      // 前日 23:55 に開始(前日分として通知済みの状態を localStorage に仕込む)。
      // リマインダー時刻は 00:00 に設定し、翌日 00:05 に到達して発火させる。
      pinTime(new Date('2026-06-21T23:55:00'));
      installNotificationMock('granted');
      localStorage.setItem(LAST_NOTIFIED_KEY, '2026-06-21');

      const { result, rerender } = renderHook(
        ({ studiedToday, currentStreak, todayStr }) =>
          useReminder({ studiedToday, currentStreak, todayStr }),
        {
          initialProps: {
            studiedToday: false,
            currentStreak: 2,
            todayStr: '2026-06-21',
          },
        },
      );

      act(() => {
        result.current.setEnabled(true);
      });
      // 時刻を 00:00 に設定(翌日 00:05 に到達させるため)。
      act(() => {
        result.current.setTime('00:00');
      });

      // 日付が変わって翌日 00:05 に進め、args も翌日の情報に切り替える。
      act(() => {
        vi.setSystemTime(new Date('2026-06-22T00:05:00'));
      });
      rerender({
        studiedToday: false,
        currentStreak: 2,
        todayStr: '2026-06-22',
      });

      // インターバル経過で発火(昨晩セットした interval が1回分発火)。
      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS);
      });

      expect(notificationCtor()).toHaveBeenCalledTimes(1);
      expect(getStoredLastNotified()).toBe('2026-06-22');
    });
  });

  // -------------------------------------------------------------------------
  // 4. cleanup / 未対応環境
  // -------------------------------------------------------------------------

  describe('cleanup and unsupported environment', () => {
    it('アンマウント後にインターバルは停止し通知は発火しない', () => {
      pinTime(new Date('2026-06-21T20:05:00'));
      installNotificationMock('granted');

      const { result, unmount } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );

      act(() => {
        result.current.setEnabled(true);
      });

      unmount();

      act(() => {
        vi.advanceTimersByTime(INTERVAL_MS * 5);
      });

      expect(notificationCtor()).not.toHaveBeenCalled();
    });

    it('Notification 未対応環境では permission==="unsupported" かつクラッシュしない', () => {
      // まず通常のモックを外し、window から Notification を完全に削除する。
      clearNotificationMock();
      try {
        delete (window as unknown as { Notification?: unknown }).Notification;
      } catch {
        /* ignore */
      }
      // happy-dom によってはプロパティが残る場合があるので、
      // 削除可能にしてから消して 'Notification' in window を false にする。
      if ('Notification' in window) {
        try {
          Object.defineProperty(window, 'Notification', {
            configurable: true,
            value: undefined,
          });
          delete (window as unknown as { Notification?: unknown }).Notification;
        } catch {
          /* ignore */
        }
      }

      const { result } = renderHook(() =>
        useReminder({ studiedToday: false, currentStreak: 0, todayStr: '2026-06-21' }),
      );

      expect(result.current.permission).toBe('unsupported');
      expect(result.current.canNotify).toBe(false);

      // requestPermission を呼んでもクラッシュせず、状態は unsupported のまま。
      expect(() => {
        void result.current.requestPermission();
      }).not.toThrow();

      // enabled を true にしてもインターバルはセットされずクラッシュしない。
      act(() => {
        result.current.setEnabled(true);
      });
      expect(result.current.settings.enabled).toBe(true);
    });
  });
});
