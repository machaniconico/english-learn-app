import { useState, useEffect, useCallback, useRef } from 'react';
import { evaluateReminder, type ReminderSettings } from '../utils/reminder';

// 学習リマインダーの設定と通知発火を担うフック。
// 通知判定の純粋ロジックは src/utils/reminder.ts の evaluateReminder に委譲し、
// このフックは「設定の永続化」「権限管理」「while-open スケジューラ」のみを担う。

const STORAGE_KEY = 'english-learn-reminder';
const LAST_NOTIFIED_KEY = 'english-learn-reminder-last-notified';
const DEFAULT_SETTINGS: ReminderSettings = { enabled: false, time: '20:00' };
const INTERVAL_MS = 60_000;
const NOTIFICATION_ICON = '/icon-192.png';

export type ReminderPermission = NotificationPermission | 'unsupported';

export interface UseReminderArgs {
  /** 今日すでに学習したか(未学習時にリマインダー発火) */
  studiedToday: boolean;
  /** 現在の連続学習日数(メッセージ生成に使用) */
  currentStreak: number;
  /** 今日の日付文字列 'YYYY-MM-DD'(重複通知防止フラグのキーに使用) */
  todayStr: string;
}

export interface UseReminderResult {
  settings: ReminderSettings;
  setEnabled: (enabled: boolean) => void;
  setTime: (time: string) => void;
  permission: ReminderPermission;
  requestPermission: () => Promise<void>;
  canNotify: boolean;
}

function loadSettings(): ReminderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ReminderSettings>;
      if (
        parsed &&
        typeof parsed.enabled === 'boolean' &&
        typeof parsed.time === 'string'
      ) {
        return { enabled: parsed.enabled, time: parsed.time };
      }
    }
  } catch {
    /* ignore: 破損データは既定値にフォールバック */
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(s: ReminderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore: ストレージ不可環境でも動作を止めない */
  }
}

function loadLastNotified(): string | null {
  try {
    return localStorage.getItem(LAST_NOTIFIED_KEY);
  } catch {
    /* ignore */
  }
  return null;
}

function saveLastNotified(dateStr: string): void {
  try {
    localStorage.setItem(LAST_NOTIFIED_KEY, dateStr);
  } catch {
    /* ignore */
  }
}

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function initialPermission(): ReminderPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

export function useReminder(args: UseReminderArgs): UseReminderResult {
  const [settings, setSettings] = useState<ReminderSettings>(() => loadSettings());
  const [permission, setPermission] = useState<ReminderPermission>(() => initialPermission());

  // interval コールバックは安定な関数であってほしいため、最新値は ref 経由で読む。
  // これにより useEffect の再実行を enabled/permission 変更時だけに絞れる。
  // ref の更新は副作用として effect 内で行い、render 中の ref 書き込みを避ける。
  const argsRef = useRef(args);
  const settingsRef = useRef(settings);
  useEffect(() => {
    argsRef.current = args;
  }, [args]);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const setEnabled = useCallback((enabled: boolean) => {
    setSettings((prev) => {
      const next: ReminderSettings = { ...prev, enabled };
      saveSettings(next);
      return next;
    });
  }, []);

  const setTime = useCallback((time: string) => {
    setSettings((prev) => {
      const next: ReminderSettings = { ...prev, time };
      saveSettings(next);
      return next;
    });
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  const canNotify = permission === 'granted';

  // while-open スケジューラ: タブを開いている間だけ定期チェックし、
  // 条件が揃ったらその日に1回だけ new Notification を発火する。
  // タブを閉じている間は動かない(Service Worker 等のバックグラウンド想定なし)。
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (!settings.enabled || permission !== 'granted') return;

    const tick = () => {
      const s = settingsRef.current;
      const a = argsRef.current;
      if (!s.enabled) return;

      // 重複通知防止: 今日すでに通知済みならスキップ。
      if (loadLastNotified() === a.todayStr) return;

      const { reminderDue, message } = evaluateReminder({
        todayStr: a.todayStr,
        lastStudyDateStr: null,
        currentStreak: a.currentStreak,
        studiedToday: a.studiedToday,
        settings: s,
        nowHHMM: nowHHMM(),
      });

      if (reminderDue) {
        try {
          new Notification('学習リマインダー', {
            body: message,
            icon: NOTIFICATION_ICON,
          });
          saveLastNotified(a.todayStr);
        } catch {
          /* ignore: 通知生成失敗時は日付フラグも書かない(次回再試行を許す) */
        }
      }
    };

    const id = window.setInterval(tick, INTERVAL_MS);
    return () => {
      window.clearInterval(id);
    };
  }, [settings.enabled, permission]);

  return { settings, setEnabled, setTime, permission, requestPermission, canNotify };
}
