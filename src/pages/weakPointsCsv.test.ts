import { describe, it, expect } from 'vitest';
import {
  WEAKPOINTS_CSV_HEADER,
  getWeakPointQuestionText,
  weakPointsToCsv,
  buildWeakPointsCsvFilename,
} from './weakPointsCsv';
import type { WeakPoint } from '../hooks/useWeakPoints';

const HEADER = 'タイプ,問題,あなたの解答,正解,復習回数,最終結果,日時';

// テスト用の弱点ファクトリ。省略フィールドは安全な既定値で補う。
function wp(over: Partial<WeakPoint> = {}): WeakPoint {
  return {
    id: 'id',
    type: 'fill-in-blank',
    question: {},
    wrongAnswer: '',
    correctAnswer: '',
    timestamp: 0,
    reviewCount: 0,
    lastCorrect: false,
    ...over,
  };
}

const LABELS: Record<string, string> = {
  'fill-in-blank': 'TOEIC模試',
  'error-correction': '誤り訂正',
  part1: 'Part 1 写真描写',
  part2: 'Part 2 応答問題',
  dictation: 'ディクテーション',
  reorder: '語順クイズ',
};

describe('WEAKPOINTS_CSV_HEADER', () => {
  it('列順は タイプ,問題,あなたの解答,正解,復習回数,最終結果,日時', () => {
    expect(WEAKPOINTS_CSV_HEADER).toEqual([
      'タイプ',
      '問題',
      'あなたの解答',
      '正解',
      '復習回数',
      '最終結果',
      '日時',
    ]);
  });
});

describe('getWeakPointQuestionText', () => {
  it('fill-in-blank は sentence を抽出', () => {
    expect(getWeakPointQuestionText(wp({ question: { sentence: 'A ___ B' } }))).toBe('A ___ B');
  });

  it('error-correction は errorSentence を抽出', () => {
    expect(
      getWeakPointQuestionText(wp({ question: { errorSentence: 'He go home.' } })),
    ).toBe('He go home.');
  });

  it('part1/part2 は question を抽出', () => {
    expect(
      getWeakPointQuestionText(wp({ question: { question: 'How are you?' } })),
    ).toBe('How are you?');
  });

  it('description を抽出', () => {
    expect(
      getWeakPointQuestionText(wp({ question: { description: 'A photo of a desk.' } })),
    ).toBe('A photo of a desk.');
  });

  it('dictation は text を抽出', () => {
    expect(getWeakPointQuestionText(wp({ question: { text: 'Listen carefully.' } }))).toBe(
      'Listen carefully.',
    );
  });

  it('reorder は japanese を優先抽出', () => {
    expect(
      getWeakPointQuestionText(
        wp({ question: { japanese: '彼は走る', english: 'He runs' } }),
      ),
    ).toBe('彼は走る');
  });

  it('japanese が無ければ english を抽出', () => {
    expect(getWeakPointQuestionText(wp({ question: { english: 'He runs' } }))).toBe('He runs');
  });

  it('question が空オブジェクトなら空文字', () => {
    expect(getWeakPointQuestionText(wp({ question: {} }))).toBe('');
  });

  it('question が null なら空文字', () => {
    expect(getWeakPointQuestionText(wp({ question: null }))).toBe('');
  });

  it('優先順位: sentence > errorSentence > question', () => {
    expect(
      getWeakPointQuestionText(
        wp({ question: { sentence: 'S', errorSentence: 'E', question: 'Q' } }),
      ),
    ).toBe('S');
  });
});

describe('weakPointsToCsv', () => {
  it('空配列はヘッダー行のみ', () => {
    expect(weakPointsToCsv([], LABELS)).toBe(HEADER);
  });

  it('行の列順とタイプラベル/最終結果/日時整形が正しい', () => {
    const items: WeakPoint[] = [
      wp({
        type: 'fill-in-blank',
        question: { sentence: 'The meeting will ___ at 3 PM.' },
        wrongAnswer: 'begins',
        correctAnswer: 'begin',
        reviewCount: 2,
        lastCorrect: true,
        timestamp: new Date(2026, 0, 5, 9, 7).getTime(),
      }),
    ];
    expect(weakPointsToCsv(items, LABELS)).toBe(
      `${HEADER}\r\nTOEIC模試,The meeting will ___ at 3 PM.,begins,begin,2,正解,2026-01-05 09:07`,
    );
  });

  it('lastCorrect false は 不正解', () => {
    const items: WeakPoint[] = [
      wp({
        type: 'part2',
        question: { question: 'How was it?' },
        wrongAnswer: 'a',
        correctAnswer: 'b',
        reviewCount: 0,
        lastCorrect: false,
        timestamp: new Date(2026, 11, 31, 23, 59).getTime(),
      }),
    ];
    expect(weakPointsToCsv(items, LABELS)).toBe(
      `${HEADER}\r\nPart 2 応答問題,How was it?,a,b,0,不正解,2026-12-31 23:59`,
    );
  });

  it('未知のタイプはラベル無しでそのまま出力', () => {
    const items: WeakPoint[] = [
      wp({
        type: 'mystery' as WeakPoint['type'],
        question: { text: 'x' },
        timestamp: new Date(2026, 5, 1, 0, 0).getTime(),
      }),
    ];
    expect(weakPointsToCsv(items, LABELS)).toBe(
      `${HEADER}\r\nmystery,x,,,0,不正解,2026-06-01 00:00`,
    );
  });

  it('カンマ/引用符/改行を含むフィールドはエスケープ', () => {
    const items: WeakPoint[] = [
      wp({
        type: 'fill-in-blank',
        question: { sentence: 'a,b' },
        wrongAnswer: 'say "hi"',
        correctAnswer: 'l1\nl2',
        reviewCount: 1,
        lastCorrect: false,
        timestamp: new Date(2026, 0, 1, 0, 0).getTime(),
      }),
    ];
    expect(weakPointsToCsv(items, LABELS)).toBe(
      `${HEADER}\r\nTOEIC模試,"a,b","say ""hi""","l1\nl2",1,不正解,2026-01-01 00:00`,
    );
  });

  it('question 無しは問題列が空文字', () => {
    const items: WeakPoint[] = [
      wp({
        type: 'fill-in-blank',
        question: {},
        wrongAnswer: 'w',
        correctAnswer: 'c',
        reviewCount: 0,
        lastCorrect: false,
        timestamp: new Date(2026, 0, 1, 0, 0).getTime(),
      }),
    ];
    expect(weakPointsToCsv(items, LABELS)).toBe(
      `${HEADER}\r\nTOEIC模試,,w,c,0,不正解,2026-01-01 00:00`,
    );
  });

  it('複数行は CRLF 区切りで末尾に余分な改行を付けない', () => {
    const items: WeakPoint[] = [
      wp({ question: { sentence: 'A' }, timestamp: new Date(2026, 0, 1, 1, 0).getTime() }),
      wp({ question: { sentence: 'B' }, timestamp: new Date(2026, 0, 1, 2, 0).getTime() }),
    ];
    const csv = weakPointsToCsv(items, LABELS);
    expect(csv.endsWith('\r\n')).toBe(false);
    expect(csv.split('\r\n')).toHaveLength(3);
  });

  it('日時整形は引数の timestamp のみを使い決定的', () => {
    const ts = new Date(2025, 2, 9, 4, 5).getTime();
    const items: WeakPoint[] = [wp({ question: { sentence: 'x' }, timestamp: ts })];
    expect(weakPointsToCsv(items, LABELS)).toBe(
      `${HEADER}\r\nTOEIC模試,x,,,0,不正解,2025-03-09 04:05`,
    );
  });
});

describe('buildWeakPointsCsvFilename', () => {
  it('weak-points-YYYY-MM-DD.csv 形式(月日 0 埋め)', () => {
    expect(buildWeakPointsCsvFilename(new Date(2026, 0, 5))).toBe('weak-points-2026-01-05.csv');
  });

  it('年末も正しく', () => {
    expect(buildWeakPointsCsvFilename(new Date(2026, 11, 31))).toBe('weak-points-2026-12-31.csv');
  });

  it('拡張子は .csv', () => {
    expect(buildWeakPointsCsvFilename(new Date(2026, 0, 1))).toMatch(/\.csv$/);
  });
});
