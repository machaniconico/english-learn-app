import { useReminder } from '../hooks/useReminder';
import { useStudyTimer } from '../hooks/useStudyTimer';

// 今日のローカル暦日を 'YYYY-MM-DD' で返す。
// useStudyTimer の getDateString と同一規約で生成する(ローカル暦日ベース)。
function getTodayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 学習リマインダー設定カード。
 * useReminder(設定・権限) と useStudyTimer(今日の学習有無・連続日数) を組み合わせ、
 * 有効トグル / 通知時刻 / 通知許可ボタン / 未対応環境メッセージ を表示する。
 * ダークモードと a11y(label と input の関連付け・aria) に対応する。
 */
export default function ReminderSettings() {
  const { getSessions, getStreak } = useStudyTimer();

  // 今日の日付文字列と学習状態・連続日数を算出。
  // getSessions(1) は直近24時間のセッションを返すため、その中から
  // 今日のローカル暦日(date)に一致する session があれば studiedToday とみなす。
  const todayStr = getTodayStr();
  const sessions = getSessions(1);
  const studiedToday = sessions.some((s) => s.date === todayStr);
  const currentStreak = getStreak().current;

  const { settings, setEnabled, setTime, permission, requestPermission } = useReminder({
    studiedToday,
    currentStreak,
    todayStr,
  });

  return (
    <section
      aria-labelledby="reminder-settings-heading"
      className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6 mb-6"
    >
      <h2
        id="reminder-settings-heading"
        className="text-lg font-bold text-gray-900 dark:text-gray-100"
      >
        リマインダー設定
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        毎日決まった時刻に学習を促す通知を受け取れます。
      </p>

      {/* 有効トグル: チェックボックス + label の関連付け */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <label
          htmlFor="reminder-enabled"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          リマインダーを有効にする
        </label>
        <input
          id="reminder-enabled"
          type="checkbox"
          role="switch"
          checked={settings.enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-5 w-9 cursor-pointer accent-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        />
      </div>

      {/* 通知時刻: time 入力 + label の関連付け */}
      <div className="mt-4">
        <label
          htmlFor="reminder-time"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          通知時刻
        </label>
        <input
          id="reminder-time"
          type="time"
          value={settings.time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 block w-full max-w-[12rem] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
        />
      </div>

      {/* 権限: 未対応環境 / 未許可 / 許可済み の3状態を表示 */}
      <div className="mt-4">
        {permission === 'unsupported' ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            お使いの環境は通知に未対応です
          </p>
        ) : permission === 'granted' ? (
          <p className="text-sm text-green-600 dark:text-green-400">通知は許可されています</p>
        ) : (
          <button
            type="button"
            onClick={() => {
              void requestPermission();
            }}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800"
          >
            通知を許可
          </button>
        )}
      </div>
    </section>
  );
}
