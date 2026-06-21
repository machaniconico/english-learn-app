// 学習リマインダーとストリーク維持の判定を行う純粋ロジック。
// React/DOM に依存せず、入力から状態とメッセージを導出する。

export interface ReminderSettings {
  /** リマインダー有効/無効 */
  enabled: boolean;
  /** 通知時刻 'HH:MM' 24時間表記（ゼロ埋め前提） */
  time: string;
}

export interface ReminderState {
  /** 連続記録があるのに今日まだ学習していない状態 */
  streakAtRisk: boolean;
  /** 設定時刻に達し、未学習でリマインダーを表示すべき状態 */
  reminderDue: boolean;
  /** ユーザー向け日本語メッセージ */
  message: string;
}

export interface ReminderInput {
  todayStr: string;
  lastStudyDateStr: string | null;
  currentStreak: number;
  studiedToday: boolean;
  settings: ReminderSettings;
  nowHHMM: string;
}

/**
 * 'HH:MM' 形式（ゼロ埋め・24時間）か検証する。
 * 辞書順比較が時刻比較として安全に行える前提を保証する。
 */
export function isValidHHMM(s: string): boolean {
  if (typeof s !== 'string' || s.length !== 5 || s[2] !== ':') return false;
  const hh = s.slice(0, 2);
  const mm = s.slice(3, 5);
  if (!/^\d{2}$/.test(hh) || !/^\d{2}$/.test(mm)) return false;
  const h = Number(hh);
  const m = Number(mm);
  return h >= 0 && h <= 23 && m >= 0 && m <= 59;
}

export function evaluateReminder(input: ReminderInput): ReminderState {
  const { currentStreak, studiedToday, settings, nowHHMM } = input;

  const streakAtRisk = currentStreak > 0 && !studiedToday;

  const timesValid = isValidHHMM(nowHHMM) && isValidHHMM(settings.time);
  const reminderDue =
    settings.enabled && !studiedToday && timesValid && nowHHMM >= settings.time;

  let message: string;
  if (streakAtRisk) {
    message = `🔥 ${currentStreak}日連続学習中！今日もやって記録を伸ばそう`;
  } else if (studiedToday) {
    message = '今日の学習は完了！素晴らしい👏';
  } else {
    message = '今日の学習を始めましょう📚';
  }

  return { streakAtRisk, reminderDue, message };
}
