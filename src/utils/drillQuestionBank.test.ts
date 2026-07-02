import { describe, expect, it } from 'vitest'
import { drillExpertQuestions } from '../data/drillExpert'
import { seededRandom } from './dailyQuizSelect'
import { buildDrillPool } from './drillQuestionBank'
import { DRILL_DIFFICULTIES, DRILL_GENRES, type DrillDifficulty, type DrillGenre } from './drillTypes'

const GENERATED_DIFFICULTIES: DrillDifficulty[] = ['beginner', 'intermediate', 'advanced']

function deterministicPool(genre: DrillGenre, difficulty: DrillDifficulty) {
  return buildDrillPool(genre, difficulty, seededRandom(`${genre}:${difficulty}`))
}

describe('buildDrillPool', () => {
  it('全 genre × difficulty で1問以上返す', () => {
    for (const { value: genre } of DRILL_GENRES) {
      for (const { value: difficulty } of DRILL_DIFFICULTIES) {
        expect(deterministicPool(genre, difficulty).length, `${genre}/${difficulty}`).toBeGreaterThan(0)
      }
    }
  })

  it('要求される最小問題数を満たす', () => {
    for (const difficulty of GENERATED_DIFFICULTIES) {
      for (const genre of ['vocab', 'en-ja', 'ja-en', 'listening'] satisfies DrillGenre[]) {
        expect(deterministicPool(genre, difficulty).length, `${genre}/${difficulty}`).toBeGreaterThanOrEqual(50)
      }

      expect(deterministicPool('fill-blank', difficulty).length, `fill-blank/${difficulty}`).toBeGreaterThanOrEqual(10)
    }
  })

  it('全問題の構造が DrillQuestion として健全', () => {
    for (const { value: genre } of DRILL_GENRES) {
      for (const { value: difficulty } of DRILL_DIFFICULTIES) {
        const pool = deterministicPool(genre, difficulty)
        const ids = pool.map((question) => question.id)
        expect(new Set(ids).size, `${genre}/${difficulty} のID重複`).toBe(ids.length)

        for (const question of pool) {
          expect(question.genre, question.id).toBe(genre)
          expect(question.difficulty, question.id).toBe(difficulty)
          expect(question.prompt.trim().length, question.id).toBeGreaterThan(0)
          expect(question.explanation.trim().length, question.id).toBeGreaterThan(0)
          expect(question.options, question.id).toHaveLength(4)
          expect(new Set(question.options).size, `${question.id} の選択肢重複`).toBe(4)
          expect(Number.isInteger(question.correctIndex), question.id).toBe(true)
          expect(question.correctIndex, question.id).toBeGreaterThanOrEqual(0)
          expect(question.correctIndex, question.id).toBeLessThan(4)

          const correct = question.options[question.correctIndex]
          const distractors = question.options.filter((_, index) => index !== question.correctIndex)
          expect(distractors, `${question.id} の誤答に正解が混入`).not.toContain(correct)

          if (genre === 'listening') {
            expect((question.audioText ?? '').trim().length, question.id).toBeGreaterThan(0)
          }
        }
      }
    }
  })

  it('rand 注入で生成問題が決定的になる', () => {
    const first = buildDrillPool('en-ja', 'advanced', seededRandom('stable-seed'))
    const second = buildDrillPool('en-ja', 'advanced', seededRandom('stable-seed'))
    expect(second).toEqual(first)
  })

  it('expert は手書きバンクをジャンルで filter して返す', () => {
    for (const { value: genre } of DRILL_GENRES) {
      expect(buildDrillPool(genre, 'expert')).toEqual(
        drillExpertQuestions.filter((question) => question.genre === genre),
      )
    }
  })
})
