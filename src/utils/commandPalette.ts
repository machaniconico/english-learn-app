// コマンドパレット(⌘K / Ctrl+K)用の純粋ロジック。
// 目地地リストと検索クエリに対するフィルタ+ランキングを提供する。
// React/DOM に依存しない純粋TSなので、UI層からもテストからも直接呼べる。

/** コマンドパレットで遷移可能な1件の目的地 */
export interface PaletteCommand {
  /** 安定した一意識別子(キーボード操作の選択状態保持に使用) */
  id: string;
  /** 日本語表示名 */
  label: string;
  /** react-router の to に渡すパス */
  path: string;
  /** グループ分け(メイン/練習/リスニング/学習管理/ツール) */
  group: 'メイン' | '練習' | 'リスニング' | '学習管理' | 'ツール';
  /** 検索用キーワード(日本語+英語+ローマ字読み) */
  keywords: string[];
}

/**
 * コマンドパレットで遷移可能な全目的地。
 * group ごとに日本語表示名・path・キーワードを定義する。
 * 順序はそのまま UI の表示順になるので、よく使うものを前に置く。
 */
export const PALETTE_COMMANDS: PaletteCommand[] = [
  // --- メイン ---
  { id: 'home', label: 'ホーム', path: '/', group: 'メイン', keywords: ['home', 'top', 'ホーム'] },
  { id: 'dictionary', label: '辞書', path: '/dictionary', group: 'メイン', keywords: ['dictionary', 'jisho', '辞書'] },
  { id: 'search', label: '検索', path: '/search', group: 'メイン', keywords: ['search', 'kensaku', '検索'] },

  // --- 練習 ---
  { id: 'toeic-practice', label: 'TOEIC練習', path: '/toeic-practice', group: '練習', keywords: ['toeic', 'renshu', 'fill in blank', '練習'] },
  { id: 'reading-practice', label: '読解', path: '/reading-practice', group: '練習', keywords: ['reading', 'dokkai', '読解'] },
  { id: 'error-correction', label: '誤文訂正', path: '/error-correction', group: '練習', keywords: ['error correction', 'gobun', '誤文訂正'] },
  { id: 'dictation', label: 'ディクテーション', path: '/dictation', group: '練習', keywords: ['dictation', 'ディクテーション'] },
  { id: 'reorder', label: '並べ替え', path: '/reorder', group: '練習', keywords: ['reorder', 'narabekae', '並べ替え'] },
  { id: 'matching', label: 'マッチング', path: '/matching', group: '練習', keywords: ['matching', 'マッチング'] },
  { id: 'typing', label: 'タイピング', path: '/typing', group: '練習', keywords: ['typing', 'taipingu', 'タイピング'] },
  { id: 'pronunciation', label: '発音', path: '/pronunciation', group: '練習', keywords: ['pronunciation', 'hatsuon', '発音'] },
  { id: 'drill', label: 'ドリルモード', path: '/drill', group: '練習', keywords: ['drill', 'continuous', 'rensoku', 'ドリル', '連続', '連続出題'] },

  // --- リスニング ---
  { id: 'part1-listening', label: 'Part1', path: '/part1-listening', group: 'リスニング', keywords: ['part1', 'part 1', 'listening', 'リスニング'] },
  { id: 'part2-listening', label: 'Part2', path: '/part2-listening', group: 'リスニング', keywords: ['part2', 'part 2', 'listening', 'リスニング'] },
  { id: 'part3-listening', label: 'Part3', path: '/part3-listening', group: 'リスニング', keywords: ['part3', 'part 3', 'listening', 'リスニング'] },
  { id: 'part4-listening', label: 'Part4', path: '/part4-listening', group: 'リスニング', keywords: ['part4', 'part 4', 'listening', 'リスニング'] },

  // --- 学習管理 ---
  { id: 'decks', label: '単語帳', path: '/decks', group: '学習管理', keywords: ['deck', 'tangocho', '単語帳'] },
  { id: 'bookmarks', label: 'ブックマーク', path: '/bookmarks', group: '学習管理', keywords: ['bookmark', 'ブックマーク'] },
  // 単語メモ一覧(US-002): useWordNotes のメモを横断で見返す。
  { id: 'my-notes', label: '単語メモ', path: '/my-notes', group: '学習管理', keywords: ['word notes', 'memo', 'note', 'tango memo', '単語メモ', 'メモ', 'ノート'] },
  { id: 'srs', label: 'SRS復習', path: '/srs', group: '学習管理', keywords: ['srs', 'spaced repetition', 'fukushu', '復習'] },
  { id: 'daily', label: 'デイリーチャレンジ', path: '/daily', group: '学習管理', keywords: ['daily', 'challenge', 'デイリー', 'チャレンジ'] },
  // デイリー10問クイズ: 難易度を選んで毎日入れ替わる10問に挑戦する(5タスクとは別カテゴリ)。
  { id: 'daily-quiz', label: 'デイリー10問クイズ', path: '/daily-quiz', group: '学習管理', keywords: ['daily quiz', 'quiz', '10', 'デイリークイズ', 'クイズ', '10問'] },
  { id: 'review', label: 'デイリー復習', path: '/review', group: '学習管理', keywords: ['daily review', 'review', '復習'] },
  { id: 'plan', label: '学習プラン', path: '/plan', group: '学習管理', keywords: ['plan', 'gakushu plan', '学習プラン'] },
  { id: 'study-guide', label: 'ロードマップ', path: '/study-guide', group: '学習管理', keywords: ['roadmap', 'guide', 'study guide', 'ロードマップ'] },
  { id: 'level-test', label: 'レベルテスト', path: '/level-test', group: '学習管理', keywords: ['level test', 'reberu', 'レベルテスト'] },

  // --- ツール ---
  { id: 'progress', label: '進捗', path: '/progress', group: 'ツール', keywords: ['progress', 'shinchoku', '進捗'] },
  { id: 'analytics', label: '分析', path: '/analytics', group: 'ツール', keywords: ['analytics', 'bunseki', '分析'] },
  { id: 'weekly-report', label: '週次レポート', path: '/weekly-report', group: 'ツール', keywords: ['weekly report', 'shukan', '週次レポート'] },
  { id: 'weak-points', label: '苦手ポイント', path: '/weak-points', group: 'ツール', keywords: ['weak points', 'nigate', '苦手'] },
  { id: 'score', label: 'スコア予測', path: '/score', group: 'ツール', keywords: ['score', 'sukoa', 'スコア予測'] },
  { id: 'achievements', label: '実績', path: '/achievements', group: 'ツール', keywords: ['achievement', 'jisseki', '実績'] },
  { id: 'backup', label: 'バックアップ', path: '/backup', group: 'ツール', keywords: ['backup', 'バックアップ'] },
  // 設定ページ(US-003): テーマ/文字サイズ/リマインダー等の集約先。
  { id: 'settings', label: '設定', path: '/settings', group: 'ツール', keywords: ['settings', 'setting', 'config', '設定', 'せってい'] },
];

/** label と keywords を小文字化して1本の文字列に連結した検索用ベース */
function searchableText(cmd: PaletteCommand): string {
  return `${cmd.label} ${cmd.keywords.join(' ')}`.toLowerCase();
}

/**
 * クエリを空白で複数語に分割し、各トークンが(label+keywords連結のどこかに)
 * 部分一致するかを判定する。AND検索。空トークンは無視。
 */
function matchesAllTokens(query: string, base: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.every((tok) => base.includes(tok));
}

/**
 * ランキングスコアを計算する。数値が小さいほど上位。
 *  0: label の前方一致
 *  1: label の部分一致(後方含む)
 *  2: keywords のみ一致
 *  9: 一致なし(呼び出し側でフィルタ済みなので基本使わない)
 */
function rankScore(cmd: PaletteCommand, query: string): number {
  const q = query.toLowerCase().trim();
  const label = cmd.label.toLowerCase();
  if (label.startsWith(q)) return 0;
  if (label.includes(q)) return 1;
  // 単語単位の前方一致も keyword 一致として扱う(例 'part' が 'part3' に前方一致)
  if (cmd.keywords.some((k) => k.toLowerCase().startsWith(q) || k.toLowerCase().includes(q))) {
    return 2;
  }
  return 9;
}

/**
 * クエリでコマンドを絞り込み、ランキング順に返す純粋関数。
 *
 * - query が空/空白のみなら全コマンドを元の順序で返す(メニュー初期表示)。
 * - 大文字小文字を無視し、前後空白を trim する。
 * - label と keywords のいずれかに部分一致するものを残す。
 * - ランキング: label前方一致 > label部分一致 > keyword一致。同ランクは定義順を維持(安定ソート)。
 * - query を空白で分割し、全トークンがマッチする AND 検索とする(例 'part 3' が Part3 にヒット)。
 *
 * @param query ユーザー入力文字列
 * @param commands 既定は PALETTE_COMMANDS(テスト注入可能)
 */
export function filterCommands(
  query: string,
  commands: PaletteCommand[] = PALETTE_COMMANDS,
): PaletteCommand[] {
  const trimmed = query.trim();
  if (trimmed === '') {
    return [...commands];
  }

  // AND検索でフィルタ
  const filtered = commands.filter((cmd) => matchesAllTokens(trimmed, searchableText(cmd)));

  // 安定ソート: 同ランクなら元の定義順を維持するため index をタイブレーカに使う
  return filtered
    .map((cmd, idx) => ({ cmd, idx, rank: rankScore(cmd, trimmed) }))
    .sort((a, b) => a.rank - b.rank || a.idx - b.idx)
    .map((e) => e.cmd);
}
