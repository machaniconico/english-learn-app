// デイリー10問クイズの「達成ストリーク(連続日数)」と「直近成績履歴」を担う純粋ロジック。
// React/DOM/localStorage に依存しないので、UI からもテストからも直接呼べる。
//
// 設計方針:
//  - 達成日 = その日に1回でもデイリークイズを完了した日。
//  - ストリーク規約は study streak と同じ: 最新の達成日が today か昨日なら継続中とみなし、
//    そこから1日ずつ遡って連続している日数を数える。
//  - 日付は setId(`daily-quiz-YYYY-MM-DD-...`)から抽出する(timestamp ではなくローカル暦日基準)。

import type { QuizResult } from '../hooks/useAccuracy';
import type { QuizDifficulty } from '../data/dailyQuiz';

/** setId 例: `daily-quiz-2026-06-24-beginner-10` から日付部分 `2026-06-24` を取り出す。 */
const DAILY_QUIZ_SETID_DATE = /^daily-quiz-(\d{4}-\d{2}-\d{2})-/;

/**
 * デイリークイズの結果 setId からローカル暦日 'YYYY-MM-DD' を抽出する。
 * setId が期待形式でなければ null。
 */
export function getDailyQuizDate(result: { setId: string; timestamp: number }): string | null {
  const match = DAILY_QUIZ_SETID_DATE.exec(result.setId);
  return match ? match[1] : null;
}

export interface DailyQuizDayResult {
  date: string;
  pct: number;
  score: number;
  total: number;
  level?: string;
}

/** total>0 のとき正答率(%)を四捨五入で返す。total<=0 は 0。 */
function pctOf(score: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((score / total) * 100);
}

/**
 * daily-quiz の結果を「日ごとの最高 pct」に集約し、日付の新しい順で最大 limitDays 件返す。
 * 同一日に複数試行があれば最も pct の高い試行を採用し、score/total/level もその試行のものを使う。
 * 入力 results は破壊しない。
 */
export function getDailyQuizHistory(
  results: QuizResult[],
  limitDays: number,
): DailyQuizDayResult[] {
  const bestByDate = new Map<string, DailyQuizDayResult>();
  for (const r of results) {
    if (r.type !== 'daily-quiz') continue;
    const date = getDailyQuizDate(r);
    if (date === null) continue;
    const pct = pctOf(r.score, r.total);
    const existing = bestByDate.get(date);
    if (!existing || pct > existing.pct) {
      bestByDate.set(date, {
        date,
        pct,
        score: r.score,
        total: r.total,
        level: r.level,
      });
    }
  }
  return Array.from(bestByDate.values())
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, Math.max(0, limitDays));
}

/** 'YYYY-MM-DD' を1日進めた文字列を返す。 */
function addDay(dateStr: string, delta: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 2つの 'YYYY-MM-DD' の差(絶対値・日数)。 */
function diffDays(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round(Math.abs(da.getTime() - db.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * daily-quiz の達成日集合(setId から抽出した日付の重複なし集合)を返す。
 */
function achievedDates(results: QuizResult[]): Set<string> {
  const set = new Set<string>();
  for (const r of results) {
    if (r.type !== 'daily-quiz') continue;
    const date = getDailyQuizDate(r);
    if (date !== null) set.add(date);
  }
  return set;
}

/**
 * デイリークイズの連続達成日数を数える。
 * 規約(study streak と同じ): 最新の達成日が today か昨日なら継続中とみなし、その起点から
 * 1日ずつ遡って diffDays===1 が続く限り連続数を数える。達成が無ければ 0。
 */
export function computeDailyQuizStreak(results: QuizResult[], today: string): number {
  const dates = achievedDates(results);
  if (dates.size === 0) return 0;

  const yesterday = addDay(today, -1);
  // 起点: today に達成があれば today、無ければ昨日に達成があれば昨日。どちらも無ければ継続なし。
  let cursor: string | null = null;
  if (dates.has(today)) cursor = today;
  else if (dates.has(yesterday)) cursor = yesterday;
  if (cursor === null) return 0;

  let streak = 0;
  while (cursor !== null && dates.has(cursor)) {
    streak += 1;
    const prev = addDay(cursor, -1);
    cursor = diffDays(prev, cursor) === 1 && dates.has(prev) ? prev : null;
  }
  return streak;
}

export interface DailyQuizSummary {
  streak: number;
  daysPlayed: number;
  bestPct: number;
  history: DailyQuizDayResult[];
}

/**
 * デイリークイズの達成サマリを返す。
 *  - streak: 連続達成日数
 *  - daysPlayed: 達成日のユニーク数
 *  - bestPct: 日別集約での最高 pct(無ければ 0)
 *  - history: 直近 limitDays 件の日別成績(新しい順)
 * 入力 results は破壊しない。
 */
export function getDailyQuizSummary(
  results: QuizResult[],
  today: string,
  limitDays: number,
): DailyQuizSummary {
  const streak = computeDailyQuizStreak(results, today);
  const history = getDailyQuizHistory(results, limitDays);
  const daysPlayed = achievedDates(results).size;
  // bestPct は履歴の表示件数に依らず全達成日の集約最大を取る。
  const allDays = getDailyQuizHistory(results, Number.MAX_SAFE_INTEGER);
  const bestPct = allDays.reduce((max, d) => (d.pct > max ? d.pct : max), 0);
  return { streak, daysPlayed, bestPct, history };
}

// =====================================================================
// Round 41: 難易度ランプ提案(直近成績に応じて次の難易度をやさしく推薦)
// =====================================================================

/** 難易度のやさしい→難しい順。up/down はこの並びに沿って1段ずらす。 */
const DIFFICULTY_ORDER: QuizDifficulty[] = ['beginner', 'intermediate', 'advanced'];

/** ある level 文字列が具体難易度(beginner/intermediate/advanced)か判定する。 */
function isQuizDifficulty(level: string | undefined): level is QuizDifficulty {
  return level === 'beginner' || level === 'intermediate' || level === 'advanced';
}

/** 難易度の推薦結果。次に挑戦すべき難易度を1段だけ提案する。 */
export interface DifficultyRecommendation {
  /** 'up' = 一つ上を提案 / 'down' = 一つ下を提案 */
  direction: 'up' | 'down';
  /** 推薦する難易度 */
  suggested: QuizDifficulty;
  /** 判定の元になった現在レベル(最新の具体難易度試行の level) */
  basedOn: QuizDifficulty;
  /** 判定に使った直近試行の平均 pct(整数) */
  avgPct: number;
  /** 判定に使った試行数 */
  attempts: number;
}

/**
 * デイリークイズの直近成績から、次に挑戦すべき難易度をやさしく推薦する。
 *
 * 判定方針:
 *  - 対象は daily-quiz かつ level が具体難易度(mixed や未設定は除外)の結果のみ。
 *  - 「現在レベル」= 最新(timestamp 最大)の具体難易度試行の level。該当が無ければ null。
 *  - そのレベルでの直近 window 件(timestamp 降順で上位)を取り平均 pct を出す。
 *  - attempts < minAttempts ならデータ不足として null(うるさく勧めない)。
 *  - avgPct >= upThreshold かつ advanced でなければ up(一つ上を提案)。
 *  - avgPct < downThreshold かつ beginner でなければ down(一つ下を提案)。
 *  - それ以外(ちょうど良い / 端で上下不可)は null。
 *
 * pct は total>0 のとき round(score/total*100)、total<=0 は 0 として扱う(除外しない)。
 * 入力 results は破壊しない。決定的。
 */
export function recommendDifficulty(
  results: QuizResult[],
  opts?: {
    window?: number;
    upThreshold?: number;
    downThreshold?: number;
    minAttempts?: number;
  },
): DifficultyRecommendation | null {
  const window = opts?.window ?? 3;
  const upThreshold = opts?.upThreshold ?? 85;
  const downThreshold = opts?.downThreshold ?? 50;
  const minAttempts = opts?.minAttempts ?? 2;

  // 対象=具体難易度の daily-quiz 試行のみ。入力は破壊せずコピーして扱う。
  const specific = results.filter(
    (r) => r.type === 'daily-quiz' && isQuizDifficulty(r.level),
  );
  if (specific.length === 0) return null;

  // 最新(timestamp 最大)の試行の level を現在レベルとする。
  // timestamp が同値の場合は入力順で後勝ち(reduce で後の要素を採用)。
  const latest = specific.reduce((acc, r) => (r.timestamp >= acc.timestamp ? r : acc));
  const basedOn = latest.level as QuizDifficulty;

  // 現在レベルの試行を timestamp 降順で並べ、上位 window 件で平均 pct を出す。
  const sameLevel = specific
    .filter((r) => r.level === basedOn)
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, Math.max(0, window));

  const attempts = sameLevel.length;
  if (attempts < minAttempts) return null;

  const sumPct = sameLevel.reduce((sum, r) => sum + pctOf(r.score, r.total), 0);
  const avgPct = Math.round(sumPct / attempts);

  const idx = DIFFICULTY_ORDER.indexOf(basedOn);

  if (avgPct >= upThreshold && idx < DIFFICULTY_ORDER.length - 1) {
    return {
      direction: 'up',
      suggested: DIFFICULTY_ORDER[idx + 1],
      basedOn,
      avgPct,
      attempts,
    };
  }

  if (avgPct < downThreshold && idx > 0) {
    return {
      direction: 'down',
      suggested: DIFFICULTY_ORDER[idx - 1],
      basedOn,
      avgPct,
      attempts,
    };
  }

  return null;
}
