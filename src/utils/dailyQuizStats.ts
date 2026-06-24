// デイリー10問クイズの「達成ストリーク(連続日数)」と「直近成績履歴」を担う純粋ロジック。
// React/DOM/localStorage に依存しないので、UI からもテストからも直接呼べる。
//
// 設計方針:
//  - 達成日 = その日に1回でもデイリークイズを完了した日。
//  - ストリーク規約は study streak と同じ: 最新の達成日が today か昨日なら継続中とみなし、
//    そこから1日ずつ遡って連続している日数を数える。
//  - 日付は setId(`daily-quiz-YYYY-MM-DD-...`)から抽出する(timestamp ではなくローカル暦日基準)。

import type { QuizResult } from '../hooks/useAccuracy';

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
