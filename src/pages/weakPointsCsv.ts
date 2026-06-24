// WeakPointsPage 用の弱点ノート CSV 生成純粋関数。
// React にもブラウザ API にも依存しないので、UI とは独立してテストできる。
// 間違えた問題を Excel 等で復習できる RFC4180 準拠の CSV 文字列を組み立てる。

import type { WeakPoint } from '../hooks/useWeakPoints';
// escapeCsvField は myNotesCsv で確立済の実装を再利用する(二重管理回避)。
import { escapeCsvField } from './myNotesCsv';

// CSV の列順を表すヘッダー。行の組み立てでもこの順序で並べる。
export const WEAKPOINTS_CSV_HEADER = [
  'タイプ',
  '問題',
  'あなたの解答',
  '正解',
  '復習回数',
  '最終結果',
  '日時',
] as const;

// WeakPoint.question(unknown)から表示用の問題文字列を抽出する。
// WeakPointsPage のカード表示と CSV で同じ文字列を使うため、ここに集約する。
// question が無い / どの形状にも当てはまらない場合は空文字を返す。
export function getWeakPointQuestionText(wp: WeakPoint): string {
  const q = wp.question as Record<string, unknown>;
  if (!q) return '';

  // fill-in-blank: sentence with blank
  if (typeof q.sentence === 'string') return q.sentence;
  // error-correction: sentence with error
  if (typeof q.errorSentence === 'string') return q.errorSentence;
  // part1/part2: question text or description
  if (typeof q.question === 'string') return q.question;
  if (typeof q.description === 'string') return q.description;
  // dictation: the text to hear
  if (typeof q.text === 'string') return q.text;
  // reorder: japanese hint or english answer
  if (typeof q.japanese === 'string') return q.japanese;
  if (typeof q.english === 'string') return q.english;

  return '';
}

// timestamp(ms)をローカル 'YYYY-MM-DD HH:mm' に整形する。
// 引数の timestamp のみを使い、内部で Date.now を呼ばない(決定的)。
function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

// 弱点の配列を CSV 文字列に変換する。
// 1 行目はヘッダー(WEAKPOINTS_CSV_HEADER を escapeCsvField してカンマ連結)。
// 各 item の行 = [タイプ(typeLabels[type] ?? type), 問題, あなたの解答, 正解,
//   復習回数, 最終結果(正解/不正解), 日時] を escapeCsvField してカンマ連結。
// 行区切りは CRLF('\r\n')。末尾に余分な改行は付けない。
// items が空でもヘッダー行のみの CSV を返す。null/undefined は ''。
export function weakPointsToCsv(
  items: WeakPoint[],
  typeLabels: Record<string, string>,
): string {
  const headerLine = WEAKPOINTS_CSV_HEADER.map(escapeCsvField).join(',');
  const lines = [headerLine];
  for (const item of items) {
    const fields = [
      typeLabels[item.type] ?? item.type,
      getWeakPointQuestionText(item),
      item.wrongAnswer ?? '',
      item.correctAnswer ?? '',
      String(item.reviewCount),
      item.lastCorrect ? '正解' : '不正解',
      formatTimestamp(item.timestamp),
    ].map(escapeCsvField);
    lines.push(fields.join(','));
  }
  return lines.join('\r\n');
}

// ダウンロードファイル名を組み立てる。
// date のローカル年月日で `weak-points-YYYY-MM-DD.csv` を返す。
// 月・日は 0 埋め 2 桁。
export function buildWeakPointsCsvFilename(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `weak-points-${yyyy}-${mm}-${dd}.csv`;
}
