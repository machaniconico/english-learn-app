import { describe, it, expect } from 'vitest'
import { drillExpertQuestions } from './drillExpert'
import { DRILL_GENRES, type DrillGenre } from '../utils/drillTypes'

// 満点レベル手書き問題バンクの機械検証。
// 受け入れ基準: 各ジャンル30問以上(計150問以上)・id 一意・options 4件重複なし・
// correctIndex 範囲内・explanation 20文字以上・全問 expert・listening は audioText 非空。

// id 規約: exp-<ジャンル略称>-NNN(fill-blank→fb / vocab→vc / ja-en→je / en-ja→ej / listening→ls)
const GENRE_ID_PREFIX: Record<DrillGenre, string> = {
  'fill-blank': 'exp-fb-',
  vocab: 'exp-vc-',
  'ja-en': 'exp-je-',
  'en-ja': 'exp-ej-',
  listening: 'exp-ls-',
}

describe('drillExpertQuestions', () => {
  it('合計 150 問以上ある', () => {
    expect(drillExpertQuestions.length).toBeGreaterThanOrEqual(150)
  })

  it('各ジャンル 30 問以上ある', () => {
    for (const { value } of DRILL_GENRES) {
      const count = drillExpertQuestions.filter((q) => q.genre === value).length
      expect(count, `ジャンル ${value} は 30 問以上必要`).toBeGreaterThanOrEqual(30)
    }
  })

  it('全問 difficulty が expert', () => {
    for (const q of drillExpertQuestions) {
      expect(q.difficulty, q.id).toBe('expert')
    }
  })

  it('id がバンク内で一意', () => {
    const ids = drillExpertQuestions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('id がジャンル別の命名規約(exp-xx-NNN)に従う', () => {
    for (const q of drillExpertQuestions) {
      expect(
        q.id.startsWith(GENRE_ID_PREFIX[q.genre]),
        `${q.id} は ${GENRE_ID_PREFIX[q.genre]}NNN 形式であるべき`,
      ).toBe(true)
      expect(q.id).toMatch(/^exp-(fb|vc|je|ej|ls)-\d{3}$/)
    }
  })

  it('options が 4 件・文字列重複なし', () => {
    for (const q of drillExpertQuestions) {
      expect(q.options, q.id).toHaveLength(4)
      expect(new Set(q.options).size, `${q.id} の選択肢に重複がある`).toBe(4)
    }
  })

  it('correctIndex が 0〜3 の整数で選択肢の範囲内', () => {
    for (const q of drillExpertQuestions) {
      expect(Number.isInteger(q.correctIndex), q.id).toBe(true)
      expect(q.correctIndex, q.id).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex, q.id).toBeLessThan(q.options.length)
    }
  })

  it('explanation が日本語解説として 20 文字以上ある', () => {
    for (const q of drillExpertQuestions) {
      expect(q.explanation.length, q.id).toBeGreaterThanOrEqual(20)
    }
  })

  it('listening は全問 audioText が非空', () => {
    const listening = drillExpertQuestions.filter((q) => q.genre === 'listening')
    expect(listening.length).toBeGreaterThanOrEqual(30)
    for (const q of listening) {
      expect((q.audioText ?? '').trim().length, `${q.id} は audioText 必須`).toBeGreaterThan(0)
    }
  })

  it('prompt と各選択肢が空文字でない', () => {
    for (const q of drillExpertQuestions) {
      expect(q.prompt.trim().length, q.id).toBeGreaterThan(0)
      for (const opt of q.options) {
        expect(opt.trim().length, `${q.id} に空の選択肢がある`).toBeGreaterThan(0)
      }
    }
  })
})
