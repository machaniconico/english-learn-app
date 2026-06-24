// デイリー10問クイズ用の問題バンク。
// デイリーチャレンジ(5タスク)とは独立した、難易度別の4択クイズ。
//
// 各問題は「ちゃんとした解説」を持つことを必須とする:
//   - 正解の根拠(なぜそれが正しいか)
//   - 主要な誤答がなぜ誤りか
//   - 必要に応じた補足知識
// 解説は日本語で、初学者にも伝わる平易な言葉で書く。
//
// 出題ロジック(日付ベースで決定的に10問を選ぶ)は utils/dailyQuizSelect.ts 側にある。
// このファイルはデータ(問題本体)のみを持つ純粋なモジュール。

/** クイズの難易度。出題前にユーザーが選択する。 */
export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

/** 難易度1件のメタ情報(選択画面の表示に使う)。 */
export interface QuizDifficultyMeta {
  id: QuizDifficulty;
  /** 日本語ラベル(初級/中級/上級) */
  label: string;
  /** 英語ラベル */
  labelEn: string;
  /** 1行説明 */
  description: string;
  /** 目安(TOEIC帯など) */
  hint: string;
}

/** デイリークイズ1問。4択 + 丁寧な日本語解説を持つ。 */
export interface DailyQuizQuestion {
  /** 安定した一意ID */
  id: string;
  /** 難易度 */
  difficulty: QuizDifficulty;
  /** 問題文。空所は "_____"(アンダースコア5個)で表す。 */
  question: string;
  /** 問題文の日本語訳(意味の確認用) */
  questionJa: string;
  /** 4つの選択肢 */
  options: [string, string, string, string];
  /** 正解の選択肢インデックス(0-3) */
  correctIndex: number;
  /** 正解の根拠・誤答の理由・補足を含む丁寧な解説 */
  explanation: string;
  /** 出題分野(振り返り表示用) */
  category: '語彙' | '文法' | '前置詞' | 'コロケーション' | '熟語' | '時制';
}

/** 難易度選択画面に出すメタ情報の一覧。 */
export const QUIZ_DIFFICULTIES: QuizDifficultyMeta[] = [
  {
    id: 'beginner',
    label: '初級',
    labelEn: 'Beginner',
    description: '基本単語・前置詞・やさしい文法。英語学習を始めたばかりの人向け。',
    hint: 'TOEIC 〜450 目安',
  },
  {
    id: 'intermediate',
    label: '中級',
    labelEn: 'Intermediate',
    description: '句動詞・時制・コロケーション・ビジネス語彙。日常〜実務レベル。',
    hint: 'TOEIC 450〜700 目安',
  },
  {
    id: 'advanced',
    label: '上級',
    labelEn: 'Advanced',
    description: '紛らわしい語彙・仮定法・高度な文法・熟語。実力を試したい人向け。',
    hint: 'TOEIC 700〜 目安',
  },
];

// =====================================================================
// 初級 (beginner)
// =====================================================================
const beginnerQuestions: DailyQuizQuestion[] = [
  {
    id: 'dq-b-001',
    difficulty: 'beginner',
    question: 'The meeting will start _____ 10 a.m.',
    questionJa: '会議は午前10時に始まります。',
    options: ['in', 'on', 'at', 'to'],
    correctIndex: 2,
    explanation:
      '正解は「at」。具体的な「時刻」の前には at を使います(at 10 a.m. = 午前10時に)。in は月・年・季節など長めの期間(in May)、on は曜日や日付(on Monday)に使うため、ここでは不適切です。【覚え方】at=点(時刻)、on=面(日付・曜日)、in=広がり(月・年)。',
    category: '前置詞',
  },
  {
    id: 'dq-b-002',
    difficulty: 'beginner',
    question: 'She _____ to work by train every day.',
    questionJa: '彼女は毎日電車で通勤しています。',
    options: ['go', 'goes', 'going', 'gone'],
    correctIndex: 1,
    explanation:
      '正解は「goes」。主語が三人称単数(she)で現在の習慣を表すため、動詞には -s を付けて goes にします。go は I/you/we/they 用の原形、going は ing形(be動詞が必要)、gone は過去分詞(have などが必要)なので、ここでは合いません。【ポイント】every day(毎日)が「現在形・習慣」の合図です。',
    category: '文法',
  },
  {
    id: 'dq-b-003',
    difficulty: 'beginner',
    question: 'There _____ many people at the party last night.',
    questionJa: '昨夜のパーティーには大勢の人がいました。',
    options: ['was', 'were', 'is', 'are'],
    correctIndex: 1,
    explanation:
      '正解は「were」。last night(昨夜)なので過去形が必要で、続く many people が複数なので be動詞は were になります。was は過去でも単数用、is/are は現在形なので不適切です。【ポイント】There is/are は後ろの名詞に数を合わせます(複数→are/were)。',
    category: '文法',
  },
  {
    id: 'dq-b-004',
    difficulty: 'beginner',
    question: 'I would like _____ a cup of coffee.',
    questionJa: 'コーヒーを一杯いただきたいのですが。',
    options: ['have', 'to have', 'having', 'had'],
    correctIndex: 1,
    explanation:
      '正解は「to have」。would like の後ろは「to + 動詞の原形」を取り、「~したい」という丁寧な希望を表します(would like to have = いただきたい)。have(原形のみ)、having(ing形)、had(過去形)はこの型に合いません。【関連】want to do とほぼ同じ意味で、would like to do の方が丁寧です。',
    category: '文法',
  },
  {
    id: 'dq-b-005',
    difficulty: 'beginner',
    question: 'This box is too heavy. I can\'t _____ it.',
    questionJa: 'この箱は重すぎる。持ち上げられない。',
    options: ['lift', 'lifts', 'lifted', 'lifting'],
    correctIndex: 0,
    explanation:
      '正解は「lift」。助動詞 can / can\'t の後ろは必ず「動詞の原形」が来ます(can\'t lift = 持ち上げられない)。lifts(三単現)、lifted(過去)、lifting(ing形)はいずれも助動詞の後ろには置けません。【ルール】can / will / must など助動詞の直後は常に原形。',
    category: '文法',
  },
  {
    id: 'dq-b-006',
    difficulty: 'beginner',
    question: 'Please _____ the door when you leave.',
    questionJa: '出るときはドアを閉めてください。',
    options: ['close', 'closes', 'closed', 'to close'],
    correctIndex: 0,
    explanation:
      '正解は「close」。Please で始まる命令文(依頼)は動詞の原形で始めます(Please close = 閉めてください)。closes(三単現)、closed(過去/過去分詞)、to close(to不定詞)は命令文には合いません。【ポイント】命令・依頼の文はいつも原形スタート。',
    category: '文法',
  },
  {
    id: 'dq-b-007',
    difficulty: 'beginner',
    question: 'My birthday is _____ July.',
    questionJa: '私の誕生日は7月です。',
    options: ['at', 'on', 'in', 'by'],
    correctIndex: 2,
    explanation:
      '正解は「in」。「月」の前には in を使います(in July = 7月に)。at は時刻(at 3:00)、on は日付・曜日(on July 5)、by は「~までに」の期限を表すため、月単体には合いません。【整理】in + 月/年/季節、on + 日付/曜日、at + 時刻。',
    category: '前置詞',
  },
  {
    id: 'dq-b-008',
    difficulty: 'beginner',
    question: 'He is good _____ playing the guitar.',
    questionJa: '彼はギターを弾くのが得意です。',
    options: ['at', 'in', 'on', 'for'],
    correctIndex: 0,
    explanation:
      '正解は「at」。「be good at + 名詞/動名詞」で「~が得意だ」という決まった言い方(コロケーション)です。be good in / on / for とは言いません。【セットで覚える】be good at ~(得意)⇔ be bad/poor at ~(苦手)。後ろが動詞なら ing形(playing)にします。',
    category: 'コロケーション',
  },
  {
    id: 'dq-b-009',
    difficulty: 'beginner',
    question: 'We _____ dinner when the phone rang.',
    questionJa: '電話が鳴ったとき、私たちは夕食を食べていました。',
    options: ['have', 'had', 'were having', 'are having'],
    correctIndex: 2,
    explanation:
      '正解は「were having」。「電話が鳴った(過去の一点)とき、~している最中だった」という進行中の動作は過去進行形(was/were + ing)で表します。have/had は「食べていた最中」のニュアンスが出ず、are having は現在形なので過去の話に合いません。【型】過去進行形 + when + 過去形=「~していたとき…した」。',
    category: '時制',
  },
  {
    id: 'dq-b-010',
    difficulty: 'beginner',
    question: 'There is _____ milk in the fridge.',
    questionJa: '冷蔵庫に牛乳が少しあります。',
    options: ['a few', 'many', 'some', 'a number of'],
    correctIndex: 2,
    explanation:
      '正解は「some」。milk は数えられない名詞(不可算)なので、量を表す some(いくらか)が使えます。a few / many / a number of はすべて「数えられる名詞(複数)」に使う表現なので、milk には合いません。【整理】不可算には some / much / a little、可算複数には some / many / a few。',
    category: '文法',
  },
  {
    id: 'dq-b-011',
    difficulty: 'beginner',
    question: 'I have lived here _____ 2015.',
    questionJa: '私は2015年からここに住んでいます。',
    options: ['for', 'since', 'from', 'during'],
    correctIndex: 1,
    explanation:
      '正解は「since」。「since + 過去の起点(2015)」で「~以来ずっと」を表し、現在完了(have lived)と相性が良い語です。for は期間の長さ(for 10 years)、during は「~の間に」(during the meeting)、from は単独で完了形の起点には通常使いません。【対比】since + 時点、for + 期間。',
    category: '時制',
  },
  {
    id: 'dq-b-012',
    difficulty: 'beginner',
    question: 'Could you _____ me the salt, please?',
    questionJa: '塩を取ってもらえますか?',
    options: ['pass', 'passes', 'passing', 'passed'],
    correctIndex: 0,
    explanation:
      '正解は「pass」。Could you の後ろは動詞の原形が来ます(Could you pass ~? = ~してもらえますか?)。これは丁寧な依頼の定番表現です。passes(三単現)、passing(ing形)、passed(過去)は助動詞 could の後ろには置けません。【依頼表現】Could you + 原形 ~? は Can you より丁寧。',
    category: '文法',
  },
  {
    id: 'dq-b-013',
    difficulty: 'beginner',
    question: 'This is _____ interesting book I have ever read.',
    questionJa: 'これは私が今まで読んだ中で一番面白い本です。',
    options: ['more', 'most', 'the most', 'much'],
    correctIndex: 2,
    explanation:
      '正解は「the most」。最上級「最も~」は long な形容詞(interesting)では「the most + 形容詞」で作ります(the most interesting = 最も面白い)。more は比較級(2つの比較)、most だけでは the が抜け、much は程度を強める語なので不適切です。【目印】I have ever read(今まで~した中で)は最上級の合図。',
    category: '文法',
  },
  {
    id: 'dq-b-014',
    difficulty: 'beginner',
    question: 'She wants to _____ a doctor in the future.',
    questionJa: '彼女は将来、医者になりたいと思っています。',
    options: ['become', 'becomes', 'became', 'becoming'],
    correctIndex: 0,
    explanation:
      '正解は「become」。「to + 動詞の原形(to不定詞)」の形なので、to の後ろは原形 become です(want to become = ~になりたい)。becomes(三単現)、became(過去)、becoming(ing形)は to の後ろには来ません。【ルール】to不定詞の to の後ろは常に原形。',
    category: '文法',
  },
  {
    id: 'dq-b-015',
    difficulty: 'beginner',
    question: 'I usually get _____ at seven o\'clock.',
    questionJa: '私はたいてい7時に起きます。',
    options: ['on', 'up', 'in', 'off'],
    correctIndex: 1,
    explanation:
      '正解は「up」。「get up」で「起きる・起床する」という意味の句動詞です。get on(乗る)、get in(中に入る)、get off(降りる)はそれぞれ別の意味になるため、「起きる」には get up が正解です。【セット】wake up(目が覚める)と get up(起き上がる)はよく一緒に使われます。',
    category: '熟語',
  },
  {
    id: 'dq-b-016',
    difficulty: 'beginner',
    question: 'These shoes are _____ than those ones.',
    questionJa: 'これらの靴はあれよりも安いです。',
    options: ['cheap', 'cheaper', 'cheapest', 'more cheap'],
    correctIndex: 1,
    explanation:
      '正解は「cheaper」。than(~よりも)があるので比較級が必要です。短い形容詞 cheap は語尾に -er を付けて cheaper にします。cheap(原級)は比較にならず、cheapest は最上級、more cheap は短い形容詞には使わない誤った形です。【ルール】短い形容詞は -er/-est、長い形容詞は more/most。',
    category: '文法',
  },
  {
    id: 'dq-b-017',
    difficulty: 'beginner',
    question: 'Don\'t forget _____ the lights before you go out.',
    questionJa: '出かける前に電気を消すのを忘れないで。',
    options: ['turn off', 'to turn off', 'turning off', 'turned off'],
    correctIndex: 1,
    explanation:
      '正解は「to turn off」。「forget to do」で「これから~するのを忘れる」を表します(忘れずにする、の意味)。turn off(原形のみ)はそのままでは続かず、turning off だと「~したことを忘れる(過去の行為)」と意味が変わり文脈に合いません。【対比】forget to do(これからすることを忘れる)⇔ forget doing(した事を忘れる)。',
    category: '文法',
  },
  {
    id: 'dq-b-018',
    difficulty: 'beginner',
    question: 'My house is _____ the station and the park.',
    questionJa: '私の家は駅と公園の間にあります。',
    options: ['among', 'between', 'in', 'into'],
    correctIndex: 1,
    explanation:
      '正解は「between」。「between A and B」で「AとBの2つの間に」を表します。among は3つ以上に囲まれた「~の中で」、in は「~の中に」、into は「~の中へ(移動)」を表すため、2地点の間には between が正解です。【対比】between=2つの間、among=3つ以上の中。',
    category: '前置詞',
  },
  {
    id: 'dq-b-019',
    difficulty: 'beginner',
    question: 'How _____ water do you drink every day?',
    questionJa: '毎日どれくらいの水を飲みますか?',
    options: ['many', 'much', 'long', 'old'],
    correctIndex: 1,
    explanation:
      '正解は「much」。water は数えられない名詞(不可算)なので、量を尋ねるときは How much を使います。How many は数えられる名詞(複数)用、How long は長さ・期間、How old は年齢・古さを尋ねる表現です。【対比】How much + 不可算(量)、How many + 可算複数(数)。',
    category: '文法',
  },
  {
    id: 'dq-b-020',
    difficulty: 'beginner',
    question: 'He has been studying English _____ three years.',
    questionJa: '彼は3年間ずっと英語を勉強しています。',
    options: ['since', 'for', 'in', 'at'],
    correctIndex: 1,
    explanation:
      '正解は「for」。「for + 期間の長さ(three years)」で「~の間ずっと」を表し、現在完了進行形(has been studying)と合います。since は「過去の一時点から」(since 2020)に使うため、期間の長さには合いません。【対比】for + 期間(three years)、since + 起点(2020)。',
    category: '時制',
  },
];

// =====================================================================
// 中級 (intermediate)
// =====================================================================
const intermediateQuestions: DailyQuizQuestion[] = [
  {
    id: 'dq-i-001',
    difficulty: 'intermediate',
    question: 'The new policy will _____ effect from next Monday.',
    questionJa: '新方針は来週月曜から発効します。',
    options: ['take', 'make', 'do', 'get'],
    correctIndex: 0,
    explanation:
      '正解は「take」。「take effect」で「(法律・方針などが)効力を持つ・発効する」という定型表現(コロケーション)です。make/do/get effect とは言いません。【関連表現】come into effect も同じ意味。put ~ into effect は「~を実施する」。',
    category: 'コロケーション',
  },
  {
    id: 'dq-i-002',
    difficulty: 'intermediate',
    question: 'We need to _____ the meeting because the manager is sick.',
    questionJa: '部長が病気なので、会議を延期する必要があります。',
    options: ['put off', 'put on', 'put up', 'put out'],
    correctIndex: 0,
    explanation:
      '正解は「put off」。「put off」は「延期する(= postpone)」という意味の句動詞です。put on は「(服を)着る」、put up は「掲げる/泊める」、put out は「(火を)消す」と、それぞれ全く違う意味になります。【言い換え】put off = postpone = delay。',
    category: '熟語',
  },
  {
    id: 'dq-i-003',
    difficulty: 'intermediate',
    question: 'If I _____ more time, I would learn another language.',
    questionJa: 'もっと時間があれば、もう一つ言語を学ぶのに。',
    options: ['have', 'had', 'will have', 'have had'],
    correctIndex: 1,
    explanation:
      '正解は「had」。現実とは違う「今もし~なら」を表す仮定法過去では、if節の動詞を過去形にします(If I had ~, I would …)。主節が would learn(would + 原形)であることもヒントです。have(現在)では仮定法になりません。【型】If + 主語 + 過去形, 主語 + would + 原形。',
    category: '文法',
  },
  {
    id: 'dq-i-004',
    difficulty: 'intermediate',
    question: 'The report must be _____ by the end of the day.',
    questionJa: 'その報告書は今日中に提出されなければなりません。',
    options: ['submit', 'submitted', 'submitting', 'submission'],
    correctIndex: 1,
    explanation:
      '正解は「submitted」。「must be + 過去分詞」で受動態「~されなければならない」を作ります(must be submitted = 提出されなければならない)。報告書は「される」側なので受動態が必要です。submit(原形)・submitting(ing)では受動の意味にならず、submission は名詞です。【型】助動詞 + be + 過去分詞=受動態。',
    category: '文法',
  },
  {
    id: 'dq-i-005',
    difficulty: 'intermediate',
    question: 'She is responsible _____ managing the entire department.',
    questionJa: '彼女は部門全体の管理を担当しています。',
    options: ['of', 'for', 'to', 'with'],
    correctIndex: 1,
    explanation:
      '正解は「for」。「be responsible for ~」で「~に責任がある・~を担当している」という決まった言い方です。responsible of / to / with とは言いません。後ろが動詞のときは ing形(managing)にします。【関連】be in charge of ~ も「~を担当する」で同義。',
    category: 'コロケーション',
  },
  {
    id: 'dq-i-006',
    difficulty: 'intermediate',
    question: 'By the time we arrived, the movie had already _____.',
    questionJa: '私たちが着いたときには、映画はすでに始まっていた。',
    options: ['begin', 'began', 'begun', 'beginning'],
    correctIndex: 2,
    explanation:
      '正解は「begun」。「had already + 過去分詞」で過去完了「(過去のある時点より前に)すでに~していた」を表します。begin の過去分詞は begun です。began は過去形(過去完了には使えない)、begin は原形、beginning は ing形なので不適切です。【活用】begin - began - begun。',
    category: '時制',
  },
  {
    id: 'dq-i-007',
    difficulty: 'intermediate',
    question: 'I\'m looking forward to _____ you next week.',
    questionJa: '来週あなたにお会いするのを楽しみにしています。',
    options: ['see', 'seeing', 'seen', 'be seeing'],
    correctIndex: 1,
    explanation:
      '正解は「seeing」。「look forward to」の to は前置詞なので、後ろは動名詞(ing形)になります(look forward to seeing = 会うのを楽しみにする)。to不定詞と勘違いして see を入れるのが典型的な誤りです。【注意】この to は「~へ」の前置詞。be used to / object to なども同じく後ろは ing。',
    category: '文法',
  },
  {
    id: 'dq-i-008',
    difficulty: 'intermediate',
    question: 'The company has decided to _____ down the old factory.',
    questionJa: 'その会社は古い工場を閉鎖することを決定した。',
    options: ['write', 'shut', 'turn', 'break'],
    correctIndex: 1,
    explanation:
      '正解は「shut」。「shut down」で「(工場・機械・事業を)閉鎖する・停止する」という句動詞になります。write down は「書き留める」、turn down は「断る/音量を下げる」、break down は「故障する」と意味が異なります。【関連】shut down = 操業停止。turn down ≠ 閉鎖。',
    category: '熟語',
  },
  {
    id: 'dq-i-009',
    difficulty: 'intermediate',
    question: 'Neither the manager nor the employees _____ aware of the issue.',
    questionJa: '部長も従業員もその問題に気づいていなかった。',
    options: ['was', 'were', 'is', 'has'],
    correctIndex: 1,
    explanation:
      '正解は「were」。「neither A nor B」が主語のとき、動詞は B(近い方=the employees, 複数)に合わせます(近接の原則)。employees は複数なので were が正しい形です。was/is は単数用、has は完了の助動詞なので合いません。【ルール】neither A nor B の動詞は B に一致させる。',
    category: '文法',
  },
  {
    id: 'dq-i-010',
    difficulty: 'intermediate',
    question: 'Despite _____ hard, he failed the exam.',
    questionJa: '一生懸命勉強したにもかかわらず、彼は試験に落ちた。',
    options: ['study', 'studied', 'studying', 'to study'],
    correctIndex: 2,
    explanation:
      '正解は「studying」。despite は前置詞なので、後ろには名詞か動名詞(ing形)が来ます(despite studying = 勉強したにもかかわらず)。study(原形)・to study(to不定詞)は前置詞の後ろに置けません。【対比】despite + 名詞/ing(前置詞)⇔ although + 文(接続詞)。',
    category: '文法',
  },
  {
    id: 'dq-i-011',
    difficulty: 'intermediate',
    question: 'Our sales have increased _____ 20 percent this year.',
    questionJa: '今年、当社の売上は20パーセント増加した。',
    options: ['by', 'in', 'to', 'at'],
    correctIndex: 0,
    explanation:
      '正解は「by」。「increase by + 差・幅」で「~の分だけ増える」を表します(increased by 20% = 20%分増加)。increase to は「~(の水準)まで増える」と最終到達点を表すので意味が変わります。in/at はこの用法に合いません。【対比】by + 増減の幅、to + 到達した値。',
    category: '前置詞',
  },
  {
    id: 'dq-i-012',
    difficulty: 'intermediate',
    question: 'The instructions were so confusing that no one could _____ what they meant.',
    questionJa: 'その指示はとても分かりにくく、誰も理解できなかった。',
    options: ['take after', 'make out', 'put up with', 'come across'],
    correctIndex: 1,
    explanation:
      '正解は「make out」。「make out」は「(苦労して)理解する・判読する」という意味の句動詞で、make out what they meant は「それが何を意味するのか理解する」という意味です。take after は「(親に)似ている」、put up with は「~を我慢する」、come across は「偶然出会う」なので文意に合いません。【言い換え】make out ≒ understand / figure out。',
    category: '熟語',
  },
  {
    id: 'dq-i-013',
    difficulty: 'intermediate',
    question: 'You had better _____ a doctor about that cough.',
    questionJa: 'その咳については医者に診てもらった方がいい。',
    options: ['see', 'to see', 'seeing', 'seen'],
    correctIndex: 0,
    explanation:
      '正解は「see」。「had better」の後ろは to を付けない動詞の原形が来ます(had better see = 診てもらった方がよい)。to see / seeing / seen はこの型に合いません。【注意】had better は「~した方がよい(さもないと…)」という強めの忠告。否定は had better not + 原形。',
    category: '文法',
  },
  {
    id: 'dq-i-014',
    difficulty: 'intermediate',
    question: 'The proposal was rejected _____ a lack of funding.',
    questionJa: '資金不足のため、その提案は却下された。',
    options: ['because', 'due to', 'so that', 'in order to'],
    correctIndex: 1,
    explanation:
      '正解は「due to」。「due to + 名詞(句)」で「~が原因で」を表し、後ろの a lack of funding(名詞句)とつながります。because は後ろに文(主語+動詞)が必要、so that は「~するために」、in order to は「~するために」と目的を表すため不適切です。【対比】due to/because of + 名詞、because + 文。',
    category: '文法',
  },
  {
    id: 'dq-i-015',
    difficulty: 'intermediate',
    question: 'I\'d rather stay home tonight _____ go out.',
    questionJa: '今夜は出かけるよりむしろ家にいたい。',
    options: ['than', 'then', 'that', 'to'],
    correctIndex: 0,
    explanation:
      '正解は「than」。「would rather A than B」で「BよりむしろAしたい」を表します(stay home than go out = 出かけるより家にいたい)。then(それから)は時を表す副詞でつづりが紛らわしいだけ、that/to はこの構文に合いません。【型】would rather + 原形 + than + 原形。',
    category: '文法',
  },
  {
    id: 'dq-i-016',
    difficulty: 'intermediate',
    question: 'The candidate has extensive experience _____ project management.',
    questionJa: 'その候補者はプロジェクト管理の豊富な経験がある。',
    options: ['in', 'on', 'at', 'for'],
    correctIndex: 0,
    explanation:
      '正解は「in」。「experience in + 分野」で「~の分野での経験」を表します(experience in project management)。on/at/for はこの組み合わせでは不自然です。【対比】experience in 分野、have experience with ツール/人。',
    category: 'コロケーション',
  },
  {
    id: 'dq-i-017',
    difficulty: 'intermediate',
    question: 'It\'s high time we _____ a decision on this matter.',
    questionJa: 'そろそろこの件について決断すべき時だ。',
    options: ['make', 'made', 'will make', 'making'],
    correctIndex: 1,
    explanation:
      '正解は「made」。「It\'s (high) time + 主語 + 過去形」で「もう~してもよい頃だ(まだしていない)」という仮定法表現になります。形は過去でも意味は現在~未来です。make(現在)・will make・making はこの定型に合いません。【型】It\'s time + 主語 + 過去形=「そろそろ~すべき時だ」。',
    category: '文法',
  },
  {
    id: 'dq-i-018',
    difficulty: 'intermediate',
    question: 'The two companies agreed to _____ forces to develop the product.',
    questionJa: '2社は製品開発のために提携することで合意した。',
    options: ['join', 'connect', 'link', 'attach'],
    correctIndex: 0,
    explanation:
      '正解は「join」。「join forces (with ~)」で「(~と)力を合わせる・提携する」という定型表現です。connect/link/attach はどれも「つなぐ」系ですが、forces とは結びつかず、この慣用句では使えません。【意味】join forces = 協力する、団結する。',
    category: 'コロケーション',
  },
  {
    id: 'dq-i-019',
    difficulty: 'intermediate',
    question: 'She speaks English fluently, _____ she has never lived abroad.',
    questionJa: '彼女は海外に住んだことがないのに、流暢に英語を話す。',
    options: ['despite', 'even though', 'because of', 'due to'],
    correctIndex: 1,
    explanation:
      '正解は「even though」。後ろに she has never lived abroad という「文(主語+動詞)」が続くので、接続詞 even though(~だけれども)が必要です。despite / because of / due to はいずれも前置詞で、後ろは名詞でなければならないため不適切です。【対比】even though + 文、despite + 名詞。',
    category: '文法',
  },
  {
    id: 'dq-i-020',
    difficulty: 'intermediate',
    question: 'Please make sure to _____ off your phone during the presentation.',
    questionJa: 'プレゼン中は必ず携帯の電源を切ってください。',
    options: ['take', 'turn', 'put', 'get'],
    correctIndex: 1,
    explanation:
      '正解は「turn」。「turn off」で「(電源・スイッチを)切る」という句動詞です。take off は「離陸する/脱ぐ」、put off は「延期する」、get off は「降りる」と意味が異なります。【対義】turn off(切る)⇔ turn on(つける)。',
    category: '熟語',
  },
];

// =====================================================================
// 上級 (advanced)
// =====================================================================
const advancedQuestions: DailyQuizQuestion[] = [
  {
    id: 'dq-a-001',
    difficulty: 'advanced',
    question: 'The board remained _____ about the merger despite repeated questions.',
    questionJa: '度重なる質問にもかかわらず、取締役会は合併について口を閉ざしたままだった。',
    options: ['tight-lipped', 'open-handed', 'light-headed', 'thick-skinned'],
    correctIndex: 0,
    explanation:
      '正解は「tight-lipped」。「口が固い・何も語らない」という意味の形容詞で、despite repeated questions(質問されても)という文脈に合います。open-handed は「気前のよい」、light-headed は「めまいがする」、thick-skinned は「打たれ強い」と意味が異なります。【語源】唇(lip)を固く結んでいる=黙っている。',
    category: '語彙',
  },
  {
    id: 'dq-a-002',
    difficulty: 'advanced',
    question: 'Had I known about the traffic, I _____ earlier.',
    questionJa: '渋滞を知っていたら、もっと早く出発していたのに。',
    options: ['would leave', 'would have left', 'will leave', 'had left'],
    correctIndex: 1,
    explanation:
      '正解は「would have left」。Had I known は If I had known の if が省略され倒置された形で、仮定法過去完了(過去の事実に反する仮定)です。主節は「would have + 過去分詞」になります。would leave は仮定法過去(現在の話)で時制が合いません。【型】If + 過去完了, 主語 + would have + 過去分詞。',
    category: '文法',
  },
  {
    id: 'dq-a-003',
    difficulty: 'advanced',
    question: 'The new evidence _____ serious doubt on the original theory.',
    questionJa: '新たな証拠は元の理論に重大な疑念を投げかけた。',
    options: ['cast', 'drew', 'put', 'gave'],
    correctIndex: 0,
    explanation:
      '正解は「cast」。「cast doubt on ~」で「~に疑念を投げかける」という定型表現です(cast は cast-cast-cast と無変化なので過去形も cast)。draw/put/give は doubt とこの形では結びつきません。【コロケーション】cast doubt on ≒ raise doubts about。',
    category: 'コロケーション',
  },
  {
    id: 'dq-a-004',
    difficulty: 'advanced',
    question: 'The CEO\'s remarks were so _____ that no one knew his real intention.',
    questionJa: 'CEOの発言はあまりに曖昧で、誰も彼の真意が分からなかった。',
    options: ['ambiguous', 'ambitious', 'amicable', 'amiable'],
    correctIndex: 0,
    explanation:
      '正解は「ambiguous」。「曖昧な・どちらにも取れる」の意味で、「真意が分からなかった」という文脈に合います。ambitious は「野心的な」、amicable は「友好的な(関係)」、amiable は「愛想のよい(人)」と、つづりは似ていても意味が全く異なります。【混同注意】ambiguous(曖昧)≠ ambitious(野心的)。',
    category: '語彙',
  },
  {
    id: 'dq-a-005',
    difficulty: 'advanced',
    question: 'Not only _____ the deadline, but he also exceeded all expectations.',
    questionJa: '彼は締め切りを守っただけでなく、あらゆる期待を上回った。',
    options: ['he met', 'did he meet', 'he did meet', 'met he'],
    correctIndex: 1,
    explanation:
      '正解は「did he meet」。否定の副詞句 Not only が文頭に出ると、後ろは疑問文と同じ語順(倒置)になります(did + 主語 + 原形)。he met は倒置されておらず、met he は語順が誤り、he did meet は強調形で倒置になっていません。【ルール】否定語(Not only / Never / Rarely…)が文頭→倒置。',
    category: '文法',
  },
  {
    id: 'dq-a-006',
    difficulty: 'advanced',
    question: 'The proposal is contingent _____ approval from the head office.',
    questionJa: 'その提案は本社の承認次第である。',
    options: ['on', 'of', 'in', 'with'],
    correctIndex: 0,
    explanation:
      '正解は「on」。「be contingent on/upon ~」で「~次第である・~を条件とする」という決まった言い方です。contingent of / in / with とは言いません。【類義】depend on ~ / be conditional on ~ も近い意味。フォーマルな文書で頻出。',
    category: 'コロケーション',
  },
  {
    id: 'dq-a-007',
    difficulty: 'advanced',
    question: 'She has a _____ for languages and speaks five fluently.',
    questionJa: '彼女は語学の才能があり、5か国語を流暢に話す。',
    options: ['knack', 'knock', 'knee', 'knot'],
    correctIndex: 0,
    explanation:
      '正解は「knack」。「a knack for ~」で「~の(器用な)才能・こつ」を表します。knock は「ノック・打撃」、knee は「ひざ」、knot は「結び目」で、いずれも意味が異なります(k は無音で発音は /næk/)。【表現】have a knack for ~ing も頻出(~するこつがある)。',
    category: '語彙',
  },
  {
    id: 'dq-a-008',
    difficulty: 'advanced',
    question: 'The manager insisted that every report _____ proofread before submission.',
    questionJa: '部長は、すべての報告書を提出前に校正するよう求めた。',
    options: ['is', 'be', 'was', 'will be'],
    correctIndex: 1,
    explanation:
      '正解は「be」。insist / demand / suggest など「要求・提案」を表す動詞の that節では、動詞が原形(仮定法現在)になります(every report be proofread)。三人称単数でも -s を付けず、ここは受動なので be + 過去分詞です。is/was/will be はこのルールに反します。【型】insist that + 主語 + (should) + 原形。',
    category: '文法',
  },
  {
    id: 'dq-a-009',
    difficulty: 'advanced',
    question: 'The two accounts of the incident are completely at _____ with each other.',
    questionJa: 'その事件に関する2つの説明は互いに完全に食い違っている。',
    options: ['odds', 'ends', 'stake', 'large'],
    correctIndex: 0,
    explanation:
      '正解は「odds」。「be at odds with ~」で「~と食い違う・対立する」という熟語です。at ends とは言わず、at stake は「危機に瀕して」、at large は「逃走中で/全体として」と意味が違います。【関連】odd は「奇妙な」ですが、at odds は「不一致」を表す固定表現。',
    category: '熟語',
  },
  {
    id: 'dq-a-010',
    difficulty: 'advanced',
    question: 'Rarely _____ such a well-organized conference.',
    questionJa: 'これほどよく運営された会議に出席したことはめったにない。',
    options: ['I have attended', 'have I attended', 'I attended', 'did I attended'],
    correctIndex: 1,
    explanation:
      '正解は「have I attended」。否定的な副詞 Rarely(めったに~ない)が文頭に来ると倒置が起き、「助動詞 + 主語 + 過去分詞」の語順になります(have I attended)。I have attended は倒置なし、I attended も倒置なし、did I attended は did の後ろが過去形で二重に誤りです。【ルール】Rarely / Seldom / Hardly 文頭→倒置。',
    category: '文法',
  },
  {
    id: 'dq-a-011',
    difficulty: 'advanced',
    question: 'The company decided to _____ its operations into Asian markets.',
    questionJa: 'その会社は事業をアジア市場へ拡大することを決めた。',
    options: ['expand', 'expend', 'expound', 'expel'],
    correctIndex: 0,
    explanation:
      '正解は「expand」。「拡大する・広げる」の意味で、operations into ~ markets(事業を市場へ)と合います。expend は「(お金・労力を)費やす」、expound は「詳しく説明する」、expel は「追放する・退学させる」と、似たつづりでも意味が全く異なります。【混同注意】expand(拡大)≠ expend(費やす)。',
    category: '語彙',
  },
  {
    id: 'dq-a-012',
    difficulty: 'advanced',
    question: 'His argument, _____ persuasive, ultimately lacked solid evidence.',
    questionJa: '彼の主張は説得力こそあったが、結局しっかりした証拠を欠いていた。',
    options: ['however', 'whatever', 'whichever', 'wherever'],
    correctIndex: 0,
    explanation:
      '正解は「however」。「however + 形容詞/副詞」で「どんなに~でも(= no matter how)」という譲歩を表します(however persuasive = どれほど説得力があっても)。whatever(何を~しても)、whichever(どちらを~しても)、wherever(どこで~しても)は後ろに形容詞を直接取るこの用法には合いません。【型】however + 形容詞 + 主語 + 動詞。',
    category: '文法',
  },
  {
    id: 'dq-a-013',
    difficulty: 'advanced',
    question: 'The dispute finally came to a _____ after months of escalating tension.',
    questionJa: '数か月にわたり緊張が高まった末、その争いはついに決定的な局面を迎えた。',
    options: ['head', 'edge', 'brink', 'verge'],
    correctIndex: 0,
    explanation:
      '正解は「head」。「come to a head」は「(問題・対立などが)決定的な局面・山場を迎える」という熟語です。edge / brink / verge は「端・瀬戸際」を表す語ですが、come to a _____ の形でこの意味を作る固定表現ではありません。【意味】緊張や問題が頂点に達し、対応や決着が避けられない段階になる、というニュアンス。',
    category: '熟語',
  },
  {
    id: 'dq-a-014',
    difficulty: 'advanced',
    question: 'The auditor scrutinized the figures _____ to detect any irregularities.',
    questionJa: '監査人は不正を見つけるため、数字を綿密に調べた。',
    options: ['meticulously', 'mercifully', 'mysteriously', 'momentarily'],
    correctIndex: 0,
    explanation:
      '正解は「meticulously」。「細部まで非常に注意深く・綿密に」の意味で、「不正を見つけるために数字を調べる」文脈に合います。mercifully は「慈悲深く/幸いにも」、mysteriously は「不可解にも」、momentarily は「すぐに/一瞬」と意味が異なります。【関連】meticulous(几帳面な)の副詞形。',
    category: '語彙',
  },
  {
    id: 'dq-a-015',
    difficulty: 'advanced',
    question: 'Had it not been for your support, the project _____ failed.',
    questionJa: 'あなたの支援がなければ、そのプロジェクトは失敗していただろう。',
    options: ['would have', 'will have', 'would have had', 'had'],
    correctIndex: 0,
    explanation:
      '正解は「would have」(would have failed)。Had it not been for ~ は If it had not been for ~(~がなかったなら)の倒置形で、過去の事実に反する仮定を表します。主節は would have + 過去分詞になります。文末に failed があるので空所は would have が入ります。【表現】If it had not been for ~ / But for ~ も同義。',
    category: '文法',
  },
  {
    id: 'dq-a-016',
    difficulty: 'advanced',
    question: 'The spokesperson was careful not to _____ any confidential details.',
    questionJa: '広報担当者は機密情報を漏らさないよう慎重だった。',
    options: ['divulge', 'diverge', 'devise', 'deviate'],
    correctIndex: 0,
    explanation:
      '正解は「divulge」。「(秘密を)漏らす・暴露する」の意味で、confidential details(機密情報)と合います。diverge は「分岐する/相違する」、devise は「考案する」、deviate は「逸脱する」と、似た音でも意味が異なります。【言い換え】divulge ≒ disclose / reveal。',
    category: '語彙',
  },
  {
    id: 'dq-a-017',
    difficulty: 'advanced',
    question: 'The terms of the contract are subject _____ change without notice.',
    questionJa: '契約条件は予告なく変更される場合があります。',
    options: ['to', 'for', 'on', 'with'],
    correctIndex: 0,
    explanation:
      '正解は「to」。「be subject to ~」で「~を受けやすい・~の対象となる/~次第である」という定型表現です(subject to change = 変更されることがある)。subject for / on / with とは言いません。【頻出】契約・規約で subject to change without notice(予告なく変更あり)は決まり文句。',
    category: 'コロケーション',
  },
  {
    id: 'dq-a-018',
    difficulty: 'advanced',
    question: 'She took the criticism _____ her stride and kept working calmly.',
    questionJa: '彼女は批判を難なく受け流し、冷静に仕事を続けた。',
    options: ['in', 'on', 'at', 'by'],
    correctIndex: 0,
    explanation:
      '正解は「in」。「take ~ in one\'s stride」で「(困難などを)難なく受け止める・冷静に対処する」という熟語です。on / at / by ではこの慣用句になりません。【意味】歩調(stride)を乱さずに対処する=動じない、というイメージ。',
    category: '熟語',
  },
  {
    id: 'dq-a-019',
    difficulty: 'advanced',
    question: 'The findings of the study are largely _____ with previous research.',
    questionJa: 'その研究結果は先行研究とおおむね一致している。',
    options: ['consistent', 'persistent', 'resistant', 'insistent'],
    correctIndex: 0,
    explanation:
      '正解は「consistent」。「be consistent with ~」で「~と一致する・矛盾しない」を表します。persistent は「しつこい・粘り強い」、resistant は「抵抗力がある」、insistent は「強く主張する」と意味が異なります。【コロケーション】consistent with(~と整合)はデータ・証拠の話で頻出。',
    category: '語彙',
  },
  {
    id: 'dq-a-020',
    difficulty: 'advanced',
    question: 'Only after the deadline _____ that a critical error existed.',
    questionJa: '締め切りが過ぎて初めて、重大な誤りがあることに気づいた。',
    options: ['we realized', 'did we realize', 'we did realize', 'realized we'],
    correctIndex: 1,
    explanation:
      '正解は「did we realize」。「Only after ~」のように Only で始まる副詞句が文頭に来ると倒置が起き、「助動詞 + 主語 + 原形」の語順になります(did we realize)。we realized は倒置なし、realized we は語順が誤り、we did realize は倒置になっていません。【ルール】Only + 副詞句が文頭→倒置。',
    category: '文法',
  },
];

/** 全難易度の問題をまとめた配列。 */
export const dailyQuizQuestions: DailyQuizQuestion[] = [
  ...beginnerQuestions,
  ...intermediateQuestions,
  ...advancedQuestions,
];

/** 指定難易度の問題だけを返す。 */
export function getQuestionsByDifficulty(difficulty: QuizDifficulty): DailyQuizQuestion[] {
  return dailyQuizQuestions.filter((q) => q.difficulty === difficulty);
}

// =====================================================================
// 出題数・出題モード(Round 37: 出題数可変＋おまかせ難易度)
// =====================================================================

/** 選べる出題数の選択肢。「10問程度」を中心に前後を用意する。 */
export const DAILY_QUIZ_COUNT_OPTIONS = [5, 10, 15, 20] as const;

/**
 * 出題モード。3段階の難易度に加えて、全レベルをまぜた 'mixed'(おまかせ)を選べる。
 */
export type QuizSelectionMode = QuizDifficulty | 'mixed';

/** 全難易度をまぜた問題プール(おまかせ用)。全60問を返す。 */
export function getMixedQuestions(): DailyQuizQuestion[] {
  return dailyQuizQuestions;
}

/** 「おまかせ(Mixed)」カードの表示用メタ情報。 */
export const MIXED_SELECTION_META = {
  id: 'mixed',
  label: 'おまかせ',
  labelEn: 'Mixed',
  description: '初級〜上級をまぜた全レベルから出題。',
  hint: '腕試し',
} as const;
