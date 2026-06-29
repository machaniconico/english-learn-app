import { useStudyTimer } from '../hooks/useStudyTimer';
import { useProgress } from '../hooks/useProgress';
import { evaluateReminder } from '../utils/reminder';

// 今日のローカル暦日を 'YYYY-MM-DD' で返す(ローカル暦日ベース)。
function getTodayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * ストリーク維持バナー。
 * useStudyTimer から連続日数と今日の学習有無を算出し、evaluateReminder で
 * streakAtRisk(streak>0 かつ今日未学習) のときだけ目立つバナーを表示する。
 * streakAtRisk でなければ null を返す(何も描画しない)。
 *
 * さらに useProgress の freezeTokens を読み、保護トークンがあれば
 * 「今日サボっても記録は守られる」安心メッセージを、無ければ緊急性を残す。
 */
export default function StreakBanner() {
  const { getSessions, getStreak } = useStudyTimer();
  const { progress } = useProgress();

  const todayStr = getTodayStr();
  const sessions = getSessions(1);
  const studiedToday = sessions.some((s) => s.date === todayStr);
  const currentStreak = getStreak().current;

  // streakAtRisk の判定だけ使う。settings/nowHHMM は streakAtRisk に影響しないため
  // リマインダー無効・時刻未到達の中立な値を渡す(reminderDue は必ず false になる)。
  const { streakAtRisk, message } = evaluateReminder({
    todayStr,
    lastStudyDateStr: null,
    currentStreak,
    studiedToday,
    settings: { enabled: false, time: '00:00' },
    nowHHMM: '00:00',
  });

  if (!streakAtRisk) return null;

  // 保護トークンは useProgress.streak(アプリ全体で表示する「N日連続」)を守る。
  // progress.streak が 0 のときは守る対象が無いため、保護メッセージは出さない
  // (freezeTokens があっても「記録は守られます」と誤主張しないようゲートする)。
  const freezeTokens = progress.freezeTokens;
  const protectedByFreeze = freezeTokens > 0 && progress.streak > 0;

  return (
    <div
      role="alert"
      className="animate-fade-in-up mb-6 rounded-2xl border border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/60 dark:to-amber-900/60 p-4 text-center"
    >
      <p className="text-sm font-bold text-orange-800 dark:text-orange-200">{message}</p>
      {protectedByFreeze ? (
        <p className="mt-1.5 text-xs font-medium text-sky-700 dark:text-sky-300">
          ❄️ ストリーク保護 ×{freezeTokens} があるので、今日できなくても記録は守られます
        </p>
      ) : (
        <p className="mt-1.5 text-xs font-medium text-orange-700 dark:text-orange-300">
          保護トークンはありません。今日学習しないと記録が途切れます
        </p>
      )}
    </div>
  );
}
