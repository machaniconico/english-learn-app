// ドリルモードの共有型定義(設計成果物)。
// 問題バンク(drillQuestionBank)・エンジン(drillEngine)・UI(DrillMode)が共通で参照する。

/** 出題ジャンル */
export type DrillGenre = 'fill-blank' | 'vocab' | 'ja-en' | 'en-ja' | 'listening'

/** ジャンル選択 UI 用('random' は毎問ランダム、'weak' は苦手優先でジャンルを選ぶ) */
export type DrillGenreSelection = DrillGenre | 'random' | 'weak'

/** 難易度。初級 → TOEIC 満点レベルまで段階的 */
export type DrillDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

/** ドリル1問の正規化された形。全ジャンル・全データソースをこの形に変換して扱う */
export interface DrillQuestion {
  /** プール全体で一意。生成元が分かる形式(例: 'vocab:dict-123', 'exp-ls-001') */
  id: string
  genre: DrillGenre
  difficulty: DrillDifficulty
  /** 問題文。listening では読み上げテキストの本文(回答前は非表示、回答後に答え合わせ用に表示) */
  prompt: string
  /** listening 用: speechSynthesis で読み上げるテキスト。listening 以外は省略 */
  audioText?: string
  /** 4択の選択肢 */
  options: string[]
  correctIndex: number
  /** 回答直後に表示する日本語解説 */
  explanation: string
}

/** ジャンルの表示順とラベル */
export const DRILL_GENRES: { value: DrillGenre; label: string }[] = [
  { value: 'fill-blank', label: '穴埋め' },
  { value: 'vocab', label: '単語' },
  { value: 'ja-en', label: '日→英' },
  { value: 'en-ja', label: '英→日' },
  { value: 'listening', label: 'リスニング' },
]

/** 難易度の表示順とラベル(段階的に上がる) */
export const DRILL_DIFFICULTIES: { value: DrillDifficulty; label: string }[] = [
  { value: 'beginner', label: '初級' },
  { value: 'intermediate', label: '中級' },
  { value: 'advanced', label: '上級' },
  { value: 'expert', label: '満点レベル' },
]
