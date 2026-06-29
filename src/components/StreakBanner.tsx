import { useProgress, applyStreakBreak } from '../hooks/useProgress';
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
 *
 * 連続記録は useProgress.streak(アプリ全体で表示する「N日連続」/ freeze が守る方)に
 * 統一して判定する。Home の進捗チップと同じソースを使うことで、同一画面で連続日数が
 * 食い違う不整合を防ぐ(以前は useStudyTimer 由来で別の値になりえた)。
 *
 * ロード直後の progress は updateStreak 適用前で stale な場合があるため、
 * applyStreakBreak で「今日時点の実効ストリーク/保護残数」を導出してから評価する。
 *
 * evaluateReminder で streakAtRisk(streak>0 かつ今日未学習) のときだけ目立つ
 * バナーを表示し、freeze 残数があれば「記録は守られる」、無ければ緊急性を伝える。
 * streakAtRisk でなければ null を返す(何も描画しない)。
 */
export default function StreakBanner() {
  const { progress } = useProgress();

  const todayStr = getTodayStr();
  // stale なロード値を今日時点へ補正(diff<=1 は据え置き、ギャップは reset/bridge)。
  const effective = applyStreakBreak(progress, todayStr);
  const currentStreak = effective.streak;
  const studiedToday = progress.lastStudyDate === todayStr;
  const freezeTokens = effective.freezeTokens;

  // streakAtRisk の判定だけ使う。settings/nowHHMM は streakAtRisk に影響しないため
  // リマインダー無効・時刻未到達の中立な値を渡す(reminderDue は必ず false になる)。
  const { streakAtRisk, message } = evaluateReminder({
    todayStr,
    lastStudyDateStr: progress.lastStudyDate || null,
    currentStreak,
    studiedToday,
    settings: { enabled: false, time: '00:00' },
    nowHHMM: '00:00',
  });

  if (!streakAtRisk) return null;

  // ここに来た時点で currentStreak > 0 が保証される(=守る対象が存在する)。
  const protectedByFreeze = freezeTokens > 0;

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
