import { dictionary } from '../data/dictionary'
import { dailyQuizQuestions } from '../data/dailyQuiz'
import { drillExpertQuestions } from '../data/drillExpert'
import { sections } from '../data/sections'
import { fillInBlankSets } from '../data/toeic/fill-in-blank'
import type { DictionaryEntry, FillInBlankQuestion, PhraseItem } from '../data/types'
import { shuffleWith } from './dailyQuizSelect'
import type { DrillDifficulty, DrillGenre, DrillQuestion } from './drillTypes'

type BaseDifficulty = Exclude<DrillDifficulty, 'expert'>

interface SectionPhraseSource {
  sectionId: string
  categoryId: string
  lessonId: string
  item: PhraseItem
  difficulty: BaseDifficulty
}

interface GeneratedOptions {
  options: string[]
  correctIndex: number
}

const poolCache = new Map<string, DrillQuestion[]>()

function hasText(value: string | undefined): value is string {
  return (value ?? '').trim().length > 0
}

function joinExplanation(parts: (string | undefined)[]): string {
  const text = parts.filter(hasText).join('。')
  return text.endsWith('。') ? text : `${text}。`
}

function inferSectionDifficulty(
  sectionId: string,
  categoryId: string,
  lessonId: string,
): BaseDifficulty {
  if (sectionId === 'toeic') return 'advanced'

  const key = `${categoryId} ${lessonId}`.toLowerCase()
  if (/(^|[-_\s])(beginner|basic|bg|bv)([-_\s]|$)/.test(key)) return 'beginner'
  if (/(^|[-_\s])(advanced|adv)([-_\s]|$)/.test(key)) return 'advanced'
  if (/(^|[-_\s])(intermediate|iv)([-_\s]|$)/.test(key)) return 'intermediate'

  // 判別不能なセクション由来データは仕様どおり中級に倒す。
  return 'intermediate'
}

function getSectionPhraseSources(): SectionPhraseSource[] {
  return sections.flatMap((section) =>
    section.categories.flatMap((category) =>
      category.lessons.flatMap((lesson) =>
        lesson.items.map((item) => ({
          sectionId: section.id,
          categoryId: category.id,
          lessonId: lesson.id,
          item,
          difficulty: inferSectionDifficulty(section.id, category.id, lesson.id),
        })),
      ),
    ),
  )
}

function pickUniqueDistractors<T>(
  primaryCandidates: readonly T[],
  fallbackCandidates: readonly T[],
  correctAnswer: string,
  getAnswer: (candidate: T) => string,
  rand: () => number,
): string[] {
  const used = new Set([correctAnswer.trim()])
  const distractors: string[] = []

  const addFrom = (candidates: readonly T[]) => {
    for (const candidate of shuffleWith(candidates, rand)) {
      const answer = getAnswer(candidate).trim()
      if (!answer || used.has(answer)) continue
      used.add(answer)
      distractors.push(answer)
      if (distractors.length === 3) break
    }
  }

  addFrom(primaryCandidates)
  if (distractors.length < 3) addFrom(fallbackCandidates)

  return distractors
}

function buildOptions(
  correctAnswer: string,
  distractors: string[],
  rand: () => number,
): GeneratedOptions | null {
  if (distractors.length < 3) return null

  const trimmedAnswer = correctAnswer.trim()
  if (!trimmedAnswer) return null

  const options = shuffleWith([trimmedAnswer, ...distractors.slice(0, 3)], rand)
  const correctIndex = options.indexOf(trimmedAnswer)

  if (options.length !== 4 || correctIndex < 0 || new Set(options).size !== 4) return null
  return { options, correctIndex }
}

function buildDictionaryExplanation(entry: DictionaryEntry): string {
  return joinExplanation([
    `${entry.english} = ${entry.japanese}`,
    `品詞: ${entry.partOfSpeech}`,
    `発音: ${entry.pronunciation}`,
    `例文: ${entry.example} / ${entry.exampleJa}`,
  ])
}

function buildPhraseExplanation(item: PhraseItem, direction: 'en-ja' | 'ja-en' | 'listening'): string {
  const lead = direction === 'ja-en'
    ? `「${item.japanese}」は英語で「${item.english}」`
    : `「${item.english}」は日本語で「${item.japanese}」`

  return joinExplanation([
    lead,
    `発音: ${item.pronunciation}`,
    item.example && item.exampleJa ? `例文: ${item.example} / ${item.exampleJa}` : undefined,
  ])
}

function buildDictionaryVocabPool(
  difficulty: BaseDifficulty,
  rand: () => number,
): DrillQuestion[] {
  const entries = dictionary.filter((entry) => entry.level === difficulty)

  return entries.flatMap((entry): DrillQuestion[] => {
    const samePartOfSpeech = dictionary.filter(
      (candidate) =>
        candidate.id !== entry.id &&
        candidate.partOfSpeech === entry.partOfSpeech &&
        candidate.japanese !== entry.japanese,
    )
    const otherEntries = dictionary.filter(
      (candidate) => candidate.id !== entry.id && candidate.japanese !== entry.japanese,
    )
    const options = buildOptions(
      entry.japanese,
      pickUniqueDistractors(samePartOfSpeech, otherEntries, entry.japanese, (candidate) => candidate.japanese, rand),
      rand,
    )

    if (!options) return []

    return [{
      id: `vocab:dict:${entry.id}`,
      genre: 'vocab',
      difficulty,
      prompt: entry.english,
      options: options.options,
      correctIndex: options.correctIndex,
      explanation: buildDictionaryExplanation(entry),
    }]
  })
}

function buildSectionVocabPool(rand: () => number): DrillQuestion[] {
  const sources = getSectionPhraseSources().filter(
    (source) => source.sectionId === 'toeic' || source.sectionId === 'idioms',
  )
  const allSources = getSectionPhraseSources()

  return sources.flatMap((source): DrillQuestion[] => {
    const correctAnswer = source.item.japanese
    const options = buildOptions(
      correctAnswer,
      pickUniqueDistractors(
        sources.filter((candidate) => candidate.item.id !== source.item.id),
        allSources.filter((candidate) => candidate.item.id !== source.item.id),
        correctAnswer,
        (candidate) => candidate.item.japanese,
        rand,
      ),
      rand,
    )

    if (!options) return []

    return [{
      id: `vocab:section:${source.sectionId}:${source.categoryId}:${source.lessonId}:${source.item.id}`,
      genre: 'vocab',
      difficulty: 'advanced',
      prompt: source.item.english,
      options: options.options,
      correctIndex: options.correctIndex,
      explanation: buildPhraseExplanation(source.item, 'en-ja'),
    }]
  })
}

function buildVocabPool(difficulty: BaseDifficulty, rand: () => number): DrillQuestion[] {
  if (difficulty === 'advanced') return buildSectionVocabPool(rand)
  return buildDictionaryVocabPool(difficulty, rand)
}

function buildPhrasePool(
  genre: Extract<DrillGenre, 'en-ja' | 'ja-en' | 'listening'>,
  difficulty: BaseDifficulty,
  rand: () => number,
): DrillQuestion[] {
  const sources = getSectionPhraseSources()
  const sameDifficultySources = sources.filter((source) => source.difficulty === difficulty)

  return sameDifficultySources.flatMap((source): DrillQuestion[] => {
    const correctAnswer = genre === 'ja-en' ? source.item.english : source.item.japanese
    const getAnswer = (candidate: SectionPhraseSource) =>
      genre === 'ja-en' ? candidate.item.english : candidate.item.japanese
    const options = buildOptions(
      correctAnswer,
      pickUniqueDistractors(
        sameDifficultySources.filter((candidate) => candidate.item.id !== source.item.id),
        sources.filter((candidate) => candidate.item.id !== source.item.id),
        correctAnswer,
        getAnswer,
        rand,
      ),
      rand,
    )

    if (!options) return []

    return [{
      id: `${genre}:section:${source.sectionId}:${source.categoryId}:${source.lessonId}:${source.item.id}`,
      genre,
      difficulty,
      prompt: genre === 'ja-en' ? source.item.japanese : source.item.english,
      audioText: genre === 'listening' ? source.item.english : undefined,
      options: options.options,
      correctIndex: options.correctIndex,
      explanation: buildPhraseExplanation(source.item, genre),
    }]
  })
}

function isValidFixedOptions(options: readonly string[], correctIndex: number): boolean {
  return (
    options.length === 4 &&
    Number.isInteger(correctIndex) &&
    correctIndex >= 0 &&
    correctIndex < options.length &&
    new Set(options).size === 4 &&
    options.every((option) => option.trim().length > 0)
  )
}

function fromFillInBlankQuestion(
  source: 'toeic' | 'daily',
  sourceId: string,
  difficulty: BaseDifficulty,
  prompt: string,
  question: FillInBlankQuestion | { id: string; options: readonly string[]; correctIndex: number; explanation: string },
): DrillQuestion[] {
  const options = [...question.options]
  if (!isValidFixedOptions(options, question.correctIndex)) return []

  const answer = options[question.correctIndex]
  return [{
    id: `fill-blank:${source}:${sourceId}:${question.id}`,
    genre: 'fill-blank',
    difficulty,
    prompt,
    options,
    correctIndex: question.correctIndex,
    explanation: joinExplanation([
      question.explanation,
      `正解: ${answer}`,
    ]),
  }]
}

function buildFillBlankPool(difficulty: BaseDifficulty): DrillQuestion[] {
  const toeicQuestions = fillInBlankSets
    .filter((set) => set.level === difficulty)
    .flatMap((set) =>
      set.questions.flatMap((question) =>
        fromFillInBlankQuestion('toeic', set.id, set.level, question.sentence, question),
      ),
    )

  const dailyQuestions = dailyQuizQuestions
    .filter((question) => question.difficulty === difficulty)
    .flatMap((question) =>
      fromFillInBlankQuestion('daily', question.difficulty, question.difficulty, question.question, question),
    )

  return [...toeicQuestions, ...dailyQuestions]
}

function buildGeneratedPool(
  genre: DrillGenre,
  difficulty: BaseDifficulty,
  rand: () => number,
): DrillQuestion[] {
  switch (genre) {
    case 'fill-blank':
      return buildFillBlankPool(difficulty)
    case 'vocab':
      return buildVocabPool(difficulty, rand)
    case 'en-ja':
    case 'ja-en':
    case 'listening':
      return buildPhrasePool(genre, difficulty, rand)
  }
}

/**
 * 既存データを DrillQuestion に正規化し、ジャンル×難易度のプールを返す。
 * rand 指定時はテスト決定性のためキャッシュを迂回する。
 */
export function buildDrillPool(
  genre: DrillGenre,
  difficulty: DrillDifficulty,
  rand?: () => number,
): DrillQuestion[] {
  if (difficulty === 'expert') {
    return drillExpertQuestions.filter((question) => question.genre === genre)
  }

  if (rand) return buildGeneratedPool(genre, difficulty, rand)

  const cacheKey = `${genre}:${difficulty}`
  const cached = poolCache.get(cacheKey)
  if (cached) return cached

  const pool = buildGeneratedPool(genre, difficulty, Math.random)
  poolCache.set(cacheKey, pool)
  return pool
}
