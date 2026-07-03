import { describe, expect, it } from 'vitest'
import { dictionary } from '../data/dictionary'
import { drillExpertQuestions } from '../data/drillExpert'
import { seededRandom } from './dailyQuizSelect'
import {
  buildDrillPool,
  buildOptions,
  inferSectionDifficulty,
  isValidFixedOptions,
} from './drillQuestionBank'
import { DRILL_DIFFICULTIES, DRILL_GENRES, type DrillDifficulty, type DrillGenre } from './drillTypes'

const GENERATED_DIFFICULTIES: DrillDifficulty[] = ['beginner', 'intermediate', 'advanced']

function deterministicPool(genre: DrillGenre, difficulty: DrillDifficulty) {
  return buildDrillPool(genre, difficulty, seededRandom(`${genre}:${difficulty}`))
}

function expectVocabOptionsToStayInDictionaryLevel(difficulty: 'beginner' | 'intermediate') {
  const levelAnswers = new Set(
    dictionary
      .filter((entry) => entry.level === difficulty)
      .map((entry) => entry.japanese.trim()),
  )
  const pool = buildDrillPool('vocab', difficulty, () => 0)

  expect(pool.length).toBeGreaterThan(0)
  for (const question of pool) {
    expect(question.id.startsWith('vocab:dict:'), question.id).toBe(true)
    for (const option of question.options) {
      expect(levelAnswers.has(option.trim()), `${question.id}: ${option}`).toBe(true)
    }
  }
}

describe('inferSectionDifficulty', () => {
  it('section/category/lesson ID から難易度を推定する', () => {
    const cases: Array<[
      sectionId: string,
      categoryId: string,
      lessonId: string,
      expected: 'beginner' | 'intermediate' | 'advanced',
    ]> = [
      ['toeic', 'unknown', 'unknown', 'advanced'],
      ['grammar', 'beginner-course', 'lesson-1', 'beginner'],
      ['grammar', 'bg-vocab', 'lesson-1', 'beginner'],
      ['grammar', 'foundation', 'bv-01', 'beginner'],
      ['grammar', 'advanced-course', 'lesson-1', 'advanced'],
      ['grammar', 'adv-vocab', 'lesson-1', 'advanced'],
      ['grammar', 'intermediate-course', 'lesson-1', 'intermediate'],
      ['grammar', 'iv-vocab', 'lesson-1', 'intermediate'],
      ['grammar', 'foundation', 'lesson-1', 'intermediate'],
    ]

    for (const [sectionId, categoryId, lessonId, expected] of cases) {
      expect(inferSectionDifficulty(sectionId, categoryId, lessonId), `${sectionId}/${categoryId}/${lessonId}`)
        .toBe(expected)
    }
  })
})

describe('buildOptions', () => {
  it('誤答が3件未満または正解が空文字なら null を返す', () => {
    expect(buildOptions('正解', ['誤答1', '誤答2'], () => 0)).toBeNull()
    expect(buildOptions('  ', ['誤答1', '誤答2', '誤答3'], () => 0)).toBeNull()
  })

  it('正常な4択と correctIndex を生成する', () => {
    const result = buildOptions('正解', ['誤答1', '誤答2', '誤答3'], () => 0)

    expect(result).not.toBeNull()
    if (!result) throw new Error('buildOptions should return generated options')

    expect(result.options).toHaveLength(4)
    expect(new Set(result.options).size).toBe(4)
    expect(result.options[result.correctIndex]).toBe('正解')
  })

  it('正解と同じ誤答や誤答同士の重複で4択が一意にならない場合は null を返す', () => {
    expect(buildOptions('正解', ['正解', '誤答1', '誤答1'], () => 0)).toBeNull()
  })
})

describe('isValidFixedOptions', () => {
  it('固定4択の件数・correctIndex・重複・空文字を検証する', () => {
    expect(isValidFixedOptions(['A', 'B', 'C', 'D'], 2)).toBe(true)

    const invalidCases: Array<[options: string[], correctIndex: number]> = [
      [['A', 'B', 'C'], 0],
      [['A', 'B', 'C', 'D'], -1],
      [['A', 'B', 'C', 'D'], 4],
      [['A', 'B', 'C', 'D'], 1.5],
      [['A', 'B', 'B', 'D'], 0],
      [['A', 'B', ' ', 'D'], 0],
    ]

    for (const [options, correctIndex] of invalidCases) {
      expect(isValidFixedOptions(options, correctIndex), `${options.join('/')}:${correctIndex}`).toBe(false)
    }
  })
})

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

  it('beginner vocab の選択肢は beginner 辞書語に絞られる', () => {
    expectVocabOptionsToStayInDictionaryLevel('beginner')
  })

  it('intermediate vocab の選択肢は intermediate 辞書語に絞られる', () => {
    expectVocabOptionsToStayInDictionaryLevel('intermediate')
  })

  it('expert は手書きバンクをジャンルで filter して返す', () => {
    for (const { value: genre } of DRILL_GENRES) {
      expect(buildDrillPool(genre, 'expert')).toEqual(
        drillExpertQuestions.filter((question) => question.genre === genre),
      )
    }
  })
})
