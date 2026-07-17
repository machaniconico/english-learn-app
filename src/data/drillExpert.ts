import type { DrillQuestion } from '../utils/drillTypes'

// TOEIC 900 後半〜満点レベルの手書き問題バンク(各ジャンル 50 問・計 250 問)。
// 注意: expert は選択肢を並び順のまま出題する(非シャッフル)ため、
// 問題を追加するときは正解位置(correctIndex)をジャンル内で均等に分散させること。
// id 規約: exp-<ジャンル略称>-NNN
//   fill-blank → exp-fb / vocab → exp-vc / ja-en → exp-je / en-ja → exp-ej / listening → exp-ls
// すべて difficulty: 'expert'。listening は audioText 必須。
// 誤答肢の方針: 形が似る / 意味が近い / 文法的に惜しい ものを意図的に配置する。
export const drillExpertQuestions: DrillQuestion[] = [
  // ---------------------------------------------------------------------------
  // fill-blank(Part5 最難関相当: 品詞識別・接続詞 vs 前置詞・仮定法・倒置・語法)
  // ---------------------------------------------------------------------------
  {
    id: 'exp-fb-001',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      '______ the unexpected downturn in quarterly revenue, the company proceeded with its planned expansion into emerging markets.',
    options: ['Notwithstanding', 'Nevertheless', 'Whereas', 'Provided'],
    correctIndex: 0,
    explanation:
      'Notwithstanding は前置詞として「〜にもかかわらず」の意味で名詞句を導ける。Nevertheless は副詞なので名詞句を直接導けず、Whereas / Provided は接続詞で後ろに節が必要。空所の後ろが名詞句である点に着目する品詞識別問題。',
  },
  {
    id: 'exp-fb-002',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The new procurement policy, ______ controversial among long-serving staff, has substantially reduced overhead costs.',
    options: ['despite', 'albeit', 'nonetheless', 'whereas'],
    correctIndex: 1,
    explanation:
      'albeit は「〜ではあるが」と形容詞句を直接導ける譲歩の接続詞(albeit controversial)。despite は前置詞で名詞が必要、nonetheless は副詞で句を導けず、whereas は完全な節を従える。挿入句の中身が形容詞句である点が決め手。',
  },
  {
    id: 'exp-fb-003',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      '______ the shipment fail to arrive by Friday, please contact our logistics coordinator immediately.',
    options: ['Would', 'Unless', 'Should', 'Provided'],
    correctIndex: 2,
    explanation:
      'Should + S + 動詞の原形 = If S should 〜(万一〜なら)の倒置形。動詞が原形 fail である点が決め手。Unless / Provided は接続詞で直説法の節(the shipment fails)が必要になり動詞の形が合わず、Would では疑問文になってしまう。',
  },
  {
    id: 'exp-fb-004',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      '______ that the prototype passed every stress test, the engineering committee saw no reason to delay mass production.',
    options: ['According', 'Owing', 'Regarding', 'Given'],
    correctIndex: 3,
    explanation:
      'Given that 〜 = 「〜であることを考えると」で that 節を導ける。According / Owing はそれぞれ according to / owing to の形でしか使えず、Regarding は前置詞なので that 節を直接従えられない。',
  },
  {
    id: 'exp-fb-005',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'No sooner had the CEO announced her resignation ______ speculation about her successor began to circulate.',
    options: ['when', 'than', 'that', 'as'],
    correctIndex: 1,
    explanation:
      'no sooner A than B = 「AするやいなやB」。no sooner は比較級由来なので than で受ける。hardly / scarcely ... when(または before)と混同させるのが定番のひっかけで、when を選ばせようとする問題が満点レベルで頻出する。',
  },
  {
    id: 'exp-fb-006',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The compliance team reviewed every clause of the agreement ______ any ambiguity expose the firm to litigation.',
    options: ['unless', 'so that', 'lest', 'in case of'],
    correctIndex: 2,
    explanation:
      'lest + S (+ should) + 動詞の原形 = 「〜しないように」。空所後の expose が三単現の s を持たない原形(仮定法現在)である点が決め手。unless は直説法の節が必要で意味も通らず、so that なら not が必要、in case of は名詞しか導けない。',
  },
  {
    id: 'exp-fb-007',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'All subcontractors must ______ by the safety regulations stipulated in Appendix C.',
    options: ['comply', 'abide', 'adhere', 'conform'],
    correctIndex: 1,
    explanation:
      'abide by 〜 = 「〜を順守する」。comply は with、adhere と conform は to と結びつくため、by と共起できるのは abide のみ。4語とも「従う」の意味で共通するので、前置詞とのコロケーションだけが決め手になる満点レベルの定番。',
  },
  {
    id: 'exp-fb-008',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The board will award the contract to ______ submits the most cost-effective proposal by the stated deadline.',
    options: ['whomever', 'whom', 'those', 'whoever'],
    correctIndex: 3,
    explanation:
      '前置詞 to の目的語は節全体であり、節の中では動詞 submits の主語が欠けているため主格の whoever が正解。直前の to につられて目的格 whomever を選ばせるのが典型的なひっかけ。those なら those who submits と関係代名詞が必要。',
  },
  {
    id: 'exp-fb-009',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      "______ the consultant's warnings been heeded, the data breach that crippled the payment system could have been averted.",
    options: ['Had', 'Should', 'Were', 'If'],
    correctIndex: 0,
    explanation:
      'Had + S + 過去分詞 = If S had 過去分詞(仮定法過去完了)の倒置形。空所直後に been heeded が続く形に合うのは Had のみ。If なら had が欠けて文が成立せず、Were は仮定法過去、Should は実現可能性の低い未来の仮定に使う。',
  },
  {
    id: 'exp-fb-010',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      '______ of a discrepancy between the English and Japanese versions of this agreement, the English version shall prevail.',
    options: ['Provided', 'Assuming', 'In the event', 'Granted'],
    correctIndex: 2,
    explanation:
      'in the event of + 名詞 = 「〜の場合には」という契約書の定型表現。Provided / Assuming / Granted はいずれも that 節を導く語で、直後の of とは結びつかない。in the event that + 節 との書き換えも併せて覚えたい。',
  },
  {
    id: 'exp-fb-011',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The restructuring plan, the details of ______ have yet to be finalized, is expected to affect roughly three hundred positions.',
    options: ['whose', 'which', 'whom', 'that'],
    correctIndex: 1,
    explanation:
      'the details of which = and its details(前置詞+関係代名詞の非制限用法)。that は前置詞の直後に置けず、whose なら whose details という語順になるはず。先行詞 the restructuring plan は人ではないので whom も不可。',
  },
  {
    id: 'exp-fb-012',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The interim report offers no concrete timeline, ______ a detailed budget for the second phase of the project.',
    options: ['still more', 'as much as', 'nothing but', 'much less'],
    correctIndex: 3,
    explanation:
      '否定文を受けて「まして〜ない」は much less(= still less / let alone)。still more は肯定文で「まして〜だ」となるため方向が逆。nothing but(〜にすぎない)、as much as(〜ほども)は文意に合わない。',
  },
  {
    id: 'exp-fb-013',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'Weather ______, the awards ceremony will be held on the rooftop terrace of the headquarters building.',
    options: ['permitted', 'permitting', 'permits', 'to permit'],
    correctIndex: 1,
    explanation:
      'weather permitting = 「天候が許せば」の独立分詞構文。主節の主語(the awards ceremony)と分詞の意味上の主語(weather)が異なるため、weather を残したまま現在分詞 permitting を続ける。permitted では「天候が許可される」という受動の関係になり不成立。',
  },
  {
    id: 'exp-fb-014',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The auditor recommended that the ledger ______ reconciled with the bank statements before the fiscal year closes.',
    options: ['is', 'was', 'be', 'has been'],
    correctIndex: 2,
    explanation:
      'recommend / suggest / insist など提案・要求の動詞に続く that 節では、動詞を原形(仮定法現在)にする(should be の should 省略)。主語が三人称単数でも is や has been にしない点が満点レベルの定番。be reconciled で「照合される」。',
  },
  {
    id: 'exp-fb-015',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      '______ is often the case with rush orders, the expedited shipping fee amounted to nearly half the value of the goods.',
    options: ['As', 'What', 'It', 'Which'],
    correctIndex: 0,
    explanation:
      'as is often the case with 〜 = 「〜にはよくあることだが」。この as は直後の節全体を先行詞とする擬似関係代名詞。It では後続の主節とつながらず、Which は文頭に置けない。What は主節に係る挿入の副詞節を作れないためここでは不可。',
  },
  {
    id: 'exp-fb-016',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The orientation lasted three hours, during ______ new hires toured every department on the premises.',
    options: ['when', 'that', 'which', 'whom'],
    correctIndex: 2,
    explanation:
      '前置詞 during の目的語になれる関係代名詞は which のみ(先行詞は three hours)。that は前置詞の直後に置けず、when は関係副詞なので前置詞と重複する。whom は人を受けるため不可。during which = その間に。',
  },
  {
    id: 'exp-fb-017',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'Several unforeseen complications ______ during the transition to the new inventory management system.',
    options: ['raised', 'rose', 'aroused', 'arose'],
    correctIndex: 3,
    explanation:
      'arise(生じる)の過去形 arose。「問題・困難が生じる」は自動詞 arise が定番。raise は他動詞(〜を上げる)で目的語が必要、arouse も他動詞(〜を呼び起こす)。rise(上がる)は数値・物価などの上昇に使い、complications とは共起しない。',
  },
  {
    id: 'exp-fb-018',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'According to the employee handbook, client confidentiality takes ______ over all other operational considerations.',
    options: ['precedence', 'precedent', 'preceding', 'precession'],
    correctIndex: 0,
    explanation:
      'take precedence over 〜 = 「〜に優先する」の定型表現。precedence(優先)と precedent(前例・判例)の名詞の使い分けが狙われる。preceding は形容詞(先行する)、precession(歳差運動)は音が似るだけの無関係語。',
  },
  {
    id: 'exp-fb-019',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The shipping delay was attributable not so much to staffing shortages ______ to an outdated booking system.',
    options: ['but', 'than', 'as', 'so'],
    correctIndex: 2,
    explanation:
      'not so much A as B = 「AというよりむしろB」。原級比較 so 〜 as の構文なので as で受ける。not A but B(AでなくB)と混同して but を、比較級の連想で than を選ばせるのが定番のひっかけ。',
  },
  {
    id: 'exp-fb-020',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The grant enabled the clinic to acquire diagnostic equipment that would ______ have been unaffordable.',
    options: ['moreover', 'thereby', 'otherwise', 'nonetheless'],
    correctIndex: 2,
    explanation:
      'would otherwise have been 〜 = 「そう(=補助金)でなければ〜だったはずだ」。otherwise が if 節の代わりに仮定の条件を担う用法で、仮定法過去完了と組み合わさる満点レベルの定番。moreover(さらに)、thereby(それによって)、nonetheless(それでもなお)は文意に合わない。',
  },
  {
    id: 'exp-fb-021',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'All promotional activities for the product line have been suspended ______ the outcome of the trademark dispute.',
    options: ['pending', 'while', 'since', 'whether'],
    correctIndex: 0,
    explanation:
      'pending = 「〜を待つ間・〜まで」の前置詞で、直後に名詞句 the outcome を取れる。while と since は接続詞としては節が必要で、whether は名詞節を導く語なのでここには置けない。pending approval(承認待ち)などフォーマルな文書で頻出。',
  },
  {
    id: 'exp-fb-022',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The revised agreement differs from the original ______ it obligates both parties to submit disputes to arbitration first.',
    options: ['so that', 'in that', 'now that', 'such that'],
    correctIndex: 1,
    explanation:
      'in that 〜 = 「〜という点で」。differ from A in that 〜(Aと〜の点で異なる)は満点レベル頻出の組み合わせ。so that(〜するように)、now that(今や〜なので)、such that(〜であるほど)はいずれも「相違点の内容」を導けない。',
  },
  {
    id: 'exp-fb-023',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'Before leaving for the conference, the director had the revised minutes ______ to all regional offices.',
    options: ['circulate', 'to circulate', 'circulating', 'circulated'],
    correctIndex: 3,
    explanation:
      'have + 目的語 + 過去分詞 = 「〜を…してもらう/させる」。the minutes は「回覧される」側なので受動関係の過去分詞 circulated が正解。circulate(原形)は目的語が自ら動作する能動関係のときに使う。to 不定詞は have の補語には置けない。',
  },
  {
    id: 'exp-fb-024',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'Applicants may submit the required documents online or by registered mail, ______ proves more convenient.',
    options: ['whatever', 'whoever', 'whichever', 'however'],
    correctIndex: 2,
    explanation:
      '提示された二つの選択肢(online / by registered mail)から選ぶので、限定された範囲を受ける whichever(どちらでも)が正解。whatever は範囲が無限定の場合に使う。whoever は人、however は「どんな方法でも」の意味では直後に形容詞・副詞が必要。',
  },
  {
    id: 'exp-fb-025',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'Expense reports must be submitted no ______ than the fifth business day of the following month.',
    options: ['sooner', 'earlier', 'longer', 'later'],
    correctIndex: 3,
    explanation:
      'no later than 〜 = 「遅くとも〜までに」の定型表現。no sooner は no sooner A than B(〜するやいなや)の構文でしか使わず、no longer は「もはや〜ない」。no earlier than(早くとも〜以降)では提出期限の文意と逆になる。',
  },
  {
    id: 'exp-fb-026',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The appeal was dismissed on the ______ that it had been filed well after the statutory deadline.',
    options: ['grounds', 'reason', 'cause', 'account'],
    correctIndex: 0,
    explanation:
      'on the grounds that 〜 = 「〜という理由で」の定型表現(grounds は複数形)。reason なら for the reason that、account なら on account of + 名詞の形を取る。on the cause that という言い方は存在しない。法務・ビジネス文書で頻出。',
  },
  {
    id: 'exp-fb-027',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'Only after the prototype had cleared every safety inspection ______ approved for mass production.',
    options: ['it was', 'was it', 'it had been', 'had it'],
    correctIndex: 1,
    explanation:
      'Only + 副詞句が文頭に立つと主節は疑問文と同じ語順に倒置するため was it が正解。倒置しない it was は誤り。had it では直後の approved と組み合わさって過去完了受動態が成立しない(been が必要)。時制も「検査通過(過去完了)→承認(過去)」の順。',
  },
  {
    id: 'exp-fb-028',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'Employees may work remotely up to three days a week, ______ that their duties can be performed off-site.',
    options: ['unless', 'despite', 'whereas', 'provided'],
    correctIndex: 3,
    explanation:
      'provided that 〜 = 「〜という条件で・〜であれば」。リモート勤務を許可する条件を導くので provided が正解。unless(〜でない限り)では条件の向きが逆になる。whereas(一方で)は対比、despite は前置詞で that 節を従えられない。',
  },
  {
    id: 'exp-fb-029',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      'The two manufacturers entered ______ a strategic alliance to co-develop next-generation battery technology.',
    options: ['on', 'into', 'in', 'for'],
    correctIndex: 1,
    explanation:
      'enter into an agreement / alliance / contract = 「(契約・提携)を締結する」。物理的に「入る」ときは enter が他動詞(enter the room)だが、契約・交渉を「取り結ぶ」抽象的な意味では enter into と前置詞が必要になる点が狙われる。',
  },
  {
    id: 'exp-fb-030',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      "______ reviewed the applicant's portfolio in detail, the selection panel invited her for a final interview.",
    options: ['Having', 'Had', 'Being', 'To have'],
    correctIndex: 0,
    explanation:
      'Having + 過去分詞は完了形の分詞構文で「〜し終えた後で」。主節より前に完了した動作を表す。Had では倒置疑問文の形になり文が成立せず、Being reviewed は受動で意味上の主語が合わない。To have reviewed(不定詞)は目的・結果の意味になり不自然。',
  },
  {
    id: 'exp-fb-031',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      '______ was the demand for the limited-edition model that the entire stock sold out within an hour of release.',
    options: ['So', 'Very', 'Such', 'Too'],
    correctIndex: 2,
    explanation:
      'Such was the demand that 〜 = 「需要があまりに大きかったので〜」の倒置構文(Such + be動詞 + S + that)。So を使うなら So great was the demand と形容詞が必要になる。Such は名詞(the demand)を直接受けられる点が決め手。',
  },
  {
    id: 'exp-fb-032',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: '______ April 1, the revised fee schedule will apply to all existing accounts.',
    options: ['Effective', 'Effectively', 'Effect', 'Affecting'],
    correctIndex: 0,
    explanation:
      'Effective + 日付 = 「〜付けで・〜をもって発効し」の定型表現(Effective April 1 = 4月1日付けで)。副詞 Effectively(事実上)や名詞 Effect では日付を直接導けない。as of + 日付 との言い換えも頻出。',
  },
  {
    id: 'exp-fb-033',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'The firm introduced a scheme ______ employees may purchase company shares at a discount.',
    options: ['which', 'whose', 'what', 'whereby'],
    correctIndex: 3,
    explanation:
      'whereby = 「それによって〜する(仕組み・制度)」(= by which)。scheme / system / arrangement などの仕組み系の名詞を先行詞に取る満点レベルの関係副詞。which では後続の完全な節とつながらず、前置詞 by が必要になる。',
  },
  {
    id: 'exp-fb-034',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'Year-end bonuses are awarded at the ______ of the compensation committee.',
    options: ['discrepancy', 'discretion', 'description', 'discrimination'],
    correctIndex: 1,
    explanation:
      'at the discretion of 〜 = 「〜の裁量で」の定型表現。discretion(裁量・思慮)と discrepancy(不一致)、discrimination(差別・識別)の綴り識別が狙われる。形容詞 discretionary(裁量による)も併せて頻出。',
  },
  {
    id: 'exp-fb-035',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'The CEO issued a statement to the ______ that no further layoffs were planned this fiscal year.',
    options: ['effect', 'affect', 'extent', 'account'],
    correctIndex: 0,
    explanation:
      'to the effect that 〜 = 「〜という趣旨の」。a statement to the effect that ... で「〜という趣旨の声明」。to the extent that(〜する程度まで)と混同しやすいが、ここは声明の「内容」を述べているので effect が正解。',
  },
  {
    id: 'exp-fb-036',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt:
      '______ for the swift response of the on-site engineers, the assembly line would have remained idle all day.',
    options: ['Were', 'Had', 'But', 'Save'],
    correctIndex: 2,
    explanation:
      'But for 〜 = 「〜がなかったら」(= if it had not been for)。仮定法過去完了の帰結節(would have remained)と呼応する。Were / Had は倒置でも後続の語順が合わず、Save for(〜を除いて)は例外を示すだけで反実仮想を導けない。',
  },
  {
    id: 'exp-fb-037',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: '______ carefully the terms are drafted, some degree of ambiguity will inevitably remain.',
    options: ['Whatever', 'However', 'Whenever', 'Whichever'],
    correctIndex: 1,
    explanation:
      'However + 副詞/形容詞 + S + V = 「どれほど〜でも」の譲歩。直後に副詞 carefully が続けられるのは However のみ。Whatever / Whichever は名詞を、Whenever は節をそのまま従える。however 譲歩構文の Part5 版。',
  },
  {
    id: 'exp-fb-038',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'The panel interviewed three candidates, none of ______ fully met the eligibility criteria.',
    options: ['them', 'which', 'whose', 'whom'],
    correctIndex: 3,
    explanation:
      'カンマ以降が節として続くため関係代名詞が必要で、先行詞が人(candidates)・前置詞 of の目的語なので whom が正解。none of them を選ぶと接続詞のない run-on sentence になる(独立した2文になってしまう)のが最大の罠。',
  },
  {
    id: 'exp-fb-039',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'The vendor failed to meet the deadline, ______ did it offer any explanation for the delay.',
    options: ['nor', 'so', 'either', 'yet'],
    correctIndex: 0,
    explanation:
      '否定文を受けて「〜もまた…ない」は nor + 倒置(nor did it offer)。直後が疑問文語順になっている点が決め手。so は肯定の同意(so did it)、either は文末に置く形、yet では倒置が説明できない。',
  },
  {
    id: 'exp-fb-040',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: '______ growing concerns over data privacy, the release of the new app was postponed indefinitely.',
    options: ['Despite', 'Among', 'Amid', 'While'],
    correctIndex: 2,
    explanation:
      'amid 〜 = 「〜のさなかで・〜が高まる中で」。懸念の高まりが延期の背景・理由になっている文意なので Amid が適切。Despite(〜にもかかわらず)では「懸念があるのに延期した」という不自然な逆接になる。While は接続詞で名詞句を導けない。',
  },
  {
    id: 'exp-fb-041',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'Facility managers must ______ that all emergency exits remain unobstructed at all times.',
    options: ['assure', 'insure', 'reassure', 'ensure'],
    correctIndex: 3,
    explanation:
      'ensure that 〜 = 「〜であることを確実にする」。that 節を直接取れるのは ensure。assure / reassure は assure + 人 + that の形で人が必要、insure は「保険をかける」。en-/as-/in- の識別は満点レベルの定番語法。',
  },
  {
    id: 'exp-fb-042',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: '______ the wake of the product recall, the manufacturer overhauled its quality-control procedures.',
    options: ['On', 'In', 'At', 'By'],
    correctIndex: 1,
    explanation:
      'in the wake of 〜 = 「〜を受けて・〜の余波で」の定型表現。wake は本来「船の航跡」で、出来事の直後に続いて起きることを表す。前置詞は in で固定されており、on / at / by との組み合わせは存在しない。',
  },
  {
    id: 'exp-fb-043',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'All feedback, ______ it positive or negative, should be logged in the customer-relations database.',
    options: ['is', 'were', 'been', 'be'],
    correctIndex: 3,
    explanation:
      'be it A or B = 「それがAであれBであれ」の譲歩表現(whether it be A or B の倒置・仮定法現在)。動詞の原形 be が文頭に立つ点が特徴で、直説法の is や過去形 were では譲歩の挿入句が成立しない。',
  },
  {
    id: 'exp-fb-044',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'We would like to ______ you that your personal data will never be shared with third parties.',
    options: ['assure', 'ensure', 'insure', 'secure'],
    correctIndex: 0,
    explanation:
      'assure + 人 + that 〜 = 「人に〜だと保証する・請け合う」。人を直接目的語に取れるのは assure。ensure はthat節を直接取り(人は挟めない)、insure は保険、secure は「確保する」で that 節を取らない。exp-fb-041 と対をなす語法問題。',
  },
  {
    id: 'exp-fb-045',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'New hires should ______ themselves with the safety manual before reporting for their first shift.',
    options: ['familiar', 'acquaint', 'accustom', 'notify'],
    correctIndex: 1,
    explanation:
      'acquaint oneself with 〜 = 「〜を熟知する・〜に精通する」。familiar は形容詞なので familiarize が必要、accustom は accustom oneself to と前置詞が to になる。notify(通知する)は notify A of B の形を取り文意も合わない。',
  },
  {
    id: 'exp-fb-046',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'Our offices will be closed on Monday ______ observance of the national holiday.',
    options: ['in', 'for', 'at', 'on'],
    correctIndex: 0,
    explanation:
      'in observance of 〜 = 「〜を祝して・〜の遵守として」の定型表現。祝日での休業案内の決まり文句で、前置詞は in で固定。同型の in celebration of / in honor of / in recognition of とまとめて覚えたい。',
  },
  {
    id: 'exp-fb-047',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: "Please find ______ the finalized itinerary for next week's site visit.",
    options: ['attaching', 'attach', 'attached', 'attachment'],
    correctIndex: 2,
    explanation:
      'Please find attached + 名詞 = 「〜を添付いたしますのでご査収ください」のビジネスメール定型句。find + O + C の補語が前に出た形で、itinerary は「添付される」側なので過去分詞 attached が正解。attaching では能動の関係になり不成立。',
  },
  {
    id: 'exp-fb-048',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'Tenants whose accounts are more than two months in ______ will receive a formal payment reminder.',
    options: ['arrear', 'rear', 'arrival', 'arrears'],
    correctIndex: 3,
    explanation:
      'in arrears = 「(支払いが)滞納で」。必ず複数形 arrears で使う点が狙われる(単数 arrear の形では慣用句にならない)。two months in arrears = 2か月分滞納。経理・不動産の文書で頻出する満点レベルの定型表現。',
  },
  {
    id: 'exp-fb-049',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: '______ per our conversation this morning, I am sending the revised estimate for your approval.',
    options: ['So', 'Such', 'As', 'Just'],
    correctIndex: 2,
    explanation:
      'as per 〜 = 「〜のとおり・〜に従って」。As per our conversation(今朝お話ししたとおり)はビジネスメールの定型句。as discussed / as agreed とほぼ同義。So / Such / Just は per と結びつく慣用表現を作らない。',
  },
  {
    id: 'exp-fb-050',
    genre: 'fill-blank',
    difficulty: 'expert',
    prompt: 'Seats for the workshop will be allocated on a first-come, first-______ basis.',
    options: ['serve', 'served', 'serving', 'service'],
    correctIndex: 1,
    explanation:
      'on a first-come, first-served basis = 「先着順で」。「先に来た人が先にサービスを受ける(served)」という受動の関係なので過去分詞 served が正しい。first-serve と誤って覚えられがちな点を突く定番のひっかけ。',
  },
  // ---------------------------------------------------------------------------
  // vocab(上級語彙。誤答肢は形・意味が紛らわしい日本語訳)
  // ---------------------------------------------------------------------------
  {
    id: 'exp-vc-001',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'pecuniary',
    options: ['金銭上の', '軽率な', '予備的な', '示唆に富む'],
    correctIndex: 0,
    explanation:
      'pecuniary = 金銭(上)の。pecuniary penalty(罰金)、pecuniary interest(金銭的利害)などフォーマルな文書で頻出。派生の impecunious(金欠の)も併せて覚えたい。',
  },
  {
    id: 'exp-vc-002',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'exacerbate',
    options: ['苛立たせる', '誇張する', '悪化させる', '和らげる'],
    correctIndex: 2,
    explanation:
      'exacerbate = (問題・状況を)悪化させる。形が似る exasperate(苛立たせる)、exaggerate(誇張する)との混同が最頻出のひっかけ。反意語は alleviate / mitigate(和らげる)。',
  },
  {
    id: 'exp-vc-003',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'remuneration',
    options: ['熟考', '報酬', '改修', '返済'],
    correctIndex: 1,
    explanation:
      'remuneration = (労働に対する)報酬。rumination(熟考・反芻)、renovation(改修)と形が紛らわしい。remuneration package(報酬パッケージ)など人事・契約のフォーマルな文書で頻出する。',
  },
  {
    id: 'exp-vc-004',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'incumbent',
    options: ['無能な', '横たわった', '差し迫った', '現職の'],
    correctIndex: 3,
    explanation:
      'incumbent = 現職の(名詞では「現職者」)。It is incumbent on A to do(Aには〜する義務がある)の用法も満点レベルで頻出。incompetent(無能な)、recumbent(横たわった)、imminent(差し迫った)と混同しないこと。',
  },
  {
    id: 'exp-vc-005',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'meticulous',
    options: ['細心の', '勤勉な', '懐疑的な', '大雑把な'],
    correctIndex: 0,
    explanation:
      'meticulous = 細部まで注意が行き届いた・几帳面な。diligent(勤勉な)は努力量に、meticulous は注意の細かさに焦点がある点で区別する。反意はおおざっぱな(sloppy / careless)。',
  },
  {
    id: 'exp-vc-006',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'plausible',
    options: ['称賛に値する', '柔軟な', 'もっともらしい', '疑わしい'],
    correctIndex: 2,
    explanation:
      'plausible = (説明・言い分が)もっともらしい・一応筋が通る。applaud からの連想で laudable(称賛に値する)、綴りが似る pliable(柔軟な)と混同しやすい。否定形 implausible(信じがたい)も重要。',
  },
  {
    id: 'exp-vc-007',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'expedite',
    options: ['遠征する', '迅速化する', '追放する', '支出する'],
    correctIndex: 1,
    explanation:
      'expedite = (手続き・進行を)早める・迅速に処理する。expedite the customs clearance(通関を早める)などビジネスで頻出。expedition(遠征)、expel(追放する)、expend(費やす)と語頭が同じで紛らわしい。',
  },
  {
    id: 'exp-vc-008',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'stringent',
    options: ['けちな', '緊急の', '粘り強い', '厳格な'],
    correctIndex: 3,
    explanation:
      'stringent = (規則・基準が)厳格な。stringent regulations / stringent requirements が定番コロケーション。stingy(けちな)、urgent(緊急の)との混同に注意。同語源の astringent(収れん性の)もある。',
  },
  {
    id: 'exp-vc-009',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'conducive',
    options: ['助けとなる', '伝導性の', '決定的な', '簡潔な'],
    correctIndex: 0,
    explanation:
      'conducive (to 〜) = 「〜の助けとなる・〜に資する」。an environment conducive to learning(学習に資する環境)。一字違いの conductive(伝導性の)、conclusive(決定的な)、concise(簡潔な)との識別が満点レベルの定番。',
  },
  {
    id: 'exp-vc-010',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'precarious',
    options: ['貴重な', '不安定な', '用心深い', '先行する'],
    correctIndex: 1,
    explanation:
      'precarious = (状況・立場が)不安定な・危うい。precarious employment(不安定雇用)が典型例。precious(貴重な)、preceding(先行する)、precautionary 系の「用心深い」との混同を狙った出題が多い。',
  },
  {
    id: 'exp-vc-011',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'proprietary',
    options: ['礼儀正しい', '予備的な', '専有の', '繁栄した'],
    correctIndex: 2,
    explanation:
      'proprietary = 専有の・独自開発の。proprietary technology(独自技術)、proprietary information(機密情報)が定番。propriety(礼儀・妥当性)と形がほぼ同じで意味が全く違う点が狙われる。',
  },
  {
    id: 'exp-vc-012',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'circumvent',
    options: ['制限する', '取り囲む', '熟考する', '回避する'],
    correctIndex: 3,
    explanation:
      'circumvent = (規則・障害を)巧みに回避する。circumvent the regulations(規制をかいくぐる)。同じ circum-(周り)を含む circumscribe(制限する)、circumspect(用心深い)との識別がポイント。',
  },
  {
    id: 'exp-vc-013',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'ubiquitous',
    options: ['曖昧な', '至る所にある', '一方的な', '時代遅れの'],
    correctIndex: 1,
    explanation:
      'ubiquitous = 至る所にある・遍在する。ubiquitous computing(ユビキタスコンピューティング)でおなじみ。ambiguous(曖昧な)、unilateral(一方的な)、obsolete(時代遅れの)と語感で混同しないこと。',
  },
  {
    id: 'exp-vc-014',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'alleviate',
    options: ['緩和する', '割り当てる', '主張する', '悪化させる'],
    correctIndex: 0,
    explanation:
      'alleviate = (苦痛・問題を)緩和する・軽減する。同義は mitigate / ease。allocate(割り当てる)、allege(主張する)と語頭が同じで紛らわしい。反意語の exacerbate / aggravate(悪化させる)とセットで覚える。',
  },
  {
    id: 'exp-vc-015',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'adjacent',
    options: ['補助的な', '柔軟な', '隣接した', '暫定的な'],
    correctIndex: 2,
    explanation:
      'adjacent (to 〜) = 「(〜に)隣接した」。the building adjacent to the station(駅に隣接するビル)。adjunct(補助的な・付属物)と語頭が同じで混同しやすい。不動産・オフィス移転の文脈で頻出。',
  },
  {
    id: 'exp-vc-016',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'reconcile',
    options: ['偵察する', '和解させる・照合する', '再確認する', '復元する'],
    correctIndex: 1,
    explanation:
      'reconcile = (対立を)和解させる、(帳簿・数値を)照合して一致させる。reconcile the accounts(勘定を照合する)は経理の定番表現。reconnaissance(偵察)、reconfirm(再確認する)、restore(復元する)との混同に注意。',
  },
  {
    id: 'exp-vc-017',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'deteriorate',
    options: ['決意する', '抑止する', '迂回する', '悪化する'],
    correctIndex: 3,
    explanation:
      'deteriorate = (状態・関係が)悪化する・劣化する(自動詞)。deteriorating infrastructure(劣化するインフラ)。determine(決定する)、deter(抑止する)、detour(迂回する)と語頭が似ており、綴りの識別が満点レベルで狙われる。',
  },
  {
    id: 'exp-vc-018',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'prerogative',
    options: ['特権・専権事項', '前兆', '慣例', '義務'],
    correctIndex: 0,
    explanation:
      "prerogative = 特権・専権事項。management's prerogative(経営側の専権事項)のように「決める権利は誰にあるか」の文脈で使う。義務(obligation)とは方向が逆である点、prediction 系の「前兆・予測」と混同しない点がポイント。",
  },
  {
    id: 'exp-vc-019',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'feasible',
    options: ['祝祭の', '実現可能な', '柔軟な', '形式的な'],
    correctIndex: 1,
    explanation:
      'feasible = 実現可能な・実行可能な。feasibility study(実現可能性調査)は事業計画の定番語。festive(祝祭の)と綴りの印象が重なりやすい。同義は viable / practicable、反意は impractical。',
  },
  {
    id: 'exp-vc-020',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'solicit',
    options: ['慰める', '孤立させる', '(意見・支援を)求める', '滞在する'],
    correctIndex: 2,
    explanation:
      'solicit = (意見・寄付・支援を)正式に求める・懇請する。solicit feedback from customers(顧客に意見を求める)。console(慰める)、isolate(孤立させる)との意味の混同、solicitor(事務弁護士)との関連も併せて覚えたい。',
  },
  {
    id: 'exp-vc-021',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'attrition',
    options: ['帰属', '自然減・摩耗', '貢献', '栄養'],
    correctIndex: 1,
    explanation:
      'attrition = (退職などによる)人員の自然減、摩耗。reduce headcount through attrition(自然減で人員を削減する)は人事の定番表現。attribution(帰属)、contribution(貢献)、nutrition(栄養)と語尾が同じで紛らわしい。',
  },
  {
    id: 'exp-vc-022',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'impeccable',
    options: ['金欠の', '差し迫った', '頑固な', '非の打ちどころのない'],
    correctIndex: 3,
    explanation:
      'impeccable = 非の打ちどころのない・完璧な。an impeccable service record(申し分のない勤務記録)。impecunious(金欠の)と語頭が同じで混同しやすい。imminent(差し迫った)、obstinate(頑固な)は無関係。',
  },
  {
    id: 'exp-vc-023',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'liaise',
    options: ['連携を取る', '賃貸借する', '免除する', '延期する'],
    correctIndex: 0,
    explanation:
      'liaise (with 〜) = 「(〜と)連携を取る・連絡調整する」。liaise with the marketing team(マーケティングチームと連携する)。名詞形 liaison(連絡係)も頻出。lease(賃貸借する)と音が似ている点に注意。',
  },
  {
    id: 'exp-vc-024',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'contingency',
    options: ['派遣団', '継続性', '不測の事態', '満足度'],
    correctIndex: 2,
    explanation:
      'contingency = 不測の事態・偶発事象。contingency plan(緊急時対応計画)が最頻出コロケーション。contingent(派遣団・分遣隊)、continuity(継続性)、contentment(満足)と形が紛らわしい。',
  },
  {
    id: 'exp-vc-025',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'waive',
    options: ['(権利・料金を)放棄する', '手を振る', 'ためらう', '編み込む'],
    correctIndex: 0,
    explanation:
      'waive = (権利・料金・要件を)放棄する・適用しない。The fee will be waived.(手数料は免除されます)。同音の wave(手を振る)、綴りが似る waver(ためらう)、weave(編む)との識別が定番のひっかけ。名詞形は waiver。',
  },
  {
    id: 'exp-vc-026',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'adjourn',
    options: ['調整する', '(会議を)休会にする', '併合する', '裁定する'],
    correctIndex: 1,
    explanation:
      'adjourn = (会議・裁判を)休会・閉会にする。The meeting was adjourned until Friday.(会議は金曜まで休会となった)。adjust(調整する)、adjoin(隣接する)、adjudicate(裁定する)と語頭が同じで紛らわしい議事録の定番語。',
  },
  {
    id: 'exp-vc-027',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'candid',
    options: ['甘やかされた', '慎重な', '率直な', '暫定的な'],
    correctIndex: 2,
    explanation:
      'candid = 率直な・偽りのない。a candid assessment(率直な評価)、candid feedback(忌憚のない意見)。candidate(候補者)や candied(砂糖漬けの)と形が似る。同義は frank / forthright。',
  },
  {
    id: 'exp-vc-028',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'negligible',
    options: ['怠慢な', '交渉可能な', '無視できるほど僅かな', '柔軟な'],
    correctIndex: 2,
    explanation:
      'negligible = 無視できるほど僅かな。The impact on earnings was negligible.(収益への影響はごく僅かだった)。negligent(怠慢な・過失のある)、negotiable(交渉可能な)との識別が満点レベルの定番。',
  },
  {
    id: 'exp-vc-029',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'procurement',
    options: ['行列', '手順', '昇進', '調達'],
    correctIndex: 3,
    explanation:
      'procurement = (物品・サービスの)調達。procurement department(調達部門)、public procurement(公共調達)。procedure(手順)、procession(行列)、promotion(昇進)と混同しやすい。動詞は procure(調達する)。',
  },
  {
    id: 'exp-vc-030',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'unprecedented',
    options: ['前例のない', '予測不能な', '無条件の', '偏見のない'],
    correctIndex: 0,
    explanation:
      'unprecedented = 前例のない・空前の。unprecedented demand(空前の需要)。precedent(前例)の派生語である点を押さえれば、unpredictable(予測不能な)、unconditional(無条件の)、unprejudiced(偏見のない)と区別できる。',
  },
  {
    id: 'exp-vc-031',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'lucrative',
    options: ['滑稽な', '非常に儲かる', '贅沢な', '明晰な'],
    correctIndex: 1,
    explanation:
      'lucrative = 非常に儲かる・利益の大きい。a lucrative contract(実入りのよい契約)。ludicrous(滑稽な)、luxurious(贅沢な)、lucid(明晰な)と語頭の印象が重なるが意味は全く異なる。同義は profitable。',
  },
  {
    id: 'exp-vc-032',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'collateral',
    options: ['協調', '衝突', '同僚', '担保'],
    correctIndex: 3,
    explanation:
      'collateral = 担保(名詞)。use the property as collateral(不動産を担保に入れる)。形容詞では「付随的な」の意味もあり collateral damage(付随的被害)が有名。collision(衝突)、colleague(同僚)、collaboration(協調)との混同に注意。',
  },
  {
    id: 'exp-vc-033',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'amenable',
    options: ['(提案を)受け入れやすい', '修正可能な', '説明責任のある', '愉快な'],
    correctIndex: 0,
    explanation:
      'amenable (to 〜) = 「(提案・説得を)受け入れやすい・従いやすい」。amenable to compromise(妥協に応じやすい)。一字違いの amendable(修正可能な)との識別が最頻出のひっかけ。accountable(説明責任のある)、amusing(愉快な)は無関係。',
  },
  {
    id: 'exp-vc-034',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'exorbitant',
    options: ['軌道上の', '精力的な', '法外な', '華美な'],
    correctIndex: 2,
    explanation:
      'exorbitant = (価格・要求が)法外な。exorbitant fees(法外な料金)。語源は「軌道(orbit)を外れた」で、orbital(軌道上の)との連想を突く出題が多い。同義は excessive / prohibitive(値段が手の届かないほど高い)。',
  },
  {
    id: 'exp-vc-035',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'impending',
    options: ['差し迫った', '未決の', '独立した', '公平な'],
    correctIndex: 0,
    explanation:
      'impending = (悪いことが)差し迫った・目前の。impending deadline(目前に迫った締め切り)。pending(未決の・係属中の)と綴りが重なるのが最大の罠。imminent とほぼ同義だが、impending はやや否定的な事柄に使うことが多い。',
  },
  {
    id: 'exp-vc-036',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'lucid',
    options: ['幸運な', '緩い', '光沢のある', '明晰な'],
    correctIndex: 3,
    explanation:
      'lucid = (説明・文章が)明晰な・分かりやすい。a lucid explanation(明快な説明)。lucky(幸運な)、loose(緩い)、lustrous(光沢のある)との音の連想を断ち切れるかがポイント。同義は clear / coherent。',
  },
  {
    id: 'exp-vc-037',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'tentative',
    options: ['魅力的な', '暫定的な', '緊張した', '執拗な'],
    correctIndex: 1,
    explanation:
      'tentative = 暫定的な・仮の。a tentative schedule(仮の日程)、tentative agreement(仮合意)。tempting(魅力的な)、tense(緊張した)、tenacious(執拗な・粘り強い)と語頭が似る。確定前の予定を伝えるビジネスメールで頻出。',
  },
  {
    id: 'exp-vc-038',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'backlog',
    options: ['背景', '日誌', '未処理の積み残し', '裏口'],
    correctIndex: 2,
    explanation:
      'backlog = 未処理の仕事・注文の積み残し。a backlog of orders(受注残)、clear the backlog(滞留分を処理する)。background(背景)、logbook(日誌)からの連想で誤りやすい。納期遅延の説明文書で頻出する実務語。',
  },
  {
    id: 'exp-vc-039',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'defer',
    options: ['延期する', '異なる', '軽蔑する', '派遣する'],
    correctIndex: 0,
    explanation:
      'defer = 延期する(= postpone)。defer payment(支払いを繰り延べる)。differ(異なる)と発音・綴りが紛らわしいのが定番の罠。defer to 〜(〜の判断に従う)という別語義も満点レベルで問われる。名詞形は deferral / deference。',
  },
  {
    id: 'exp-vc-040',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'underwrite',
    options: ['過小評価する', '下書きする', '署名する', '(費用・リスクを)引き受ける'],
    correctIndex: 3,
    explanation:
      'underwrite = (費用を)負担する、(保険・証券発行の)リスクを引き受ける。underwrite the cost of the event(イベント費用を引き受ける)。underestimate(過小評価する)、draft(下書きする)との混同を狙う。名詞 underwriter = 保険引受人・証券引受会社。',
  },
  {
    id: 'exp-vc-041',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'rescind',
    options: ['再送する', '(契約・決定を)撤回する', '救助する', '居住する'],
    correctIndex: 1,
    explanation:
      'rescind = (契約・法律・決定を)撤回する・無効にする。rescind the offer(内定・申し出を取り消す)。resend(再送する)と音が似ているのが最大の罠。revoke / repeal / retract と同系の「取り消し」語彙としてまとめて覚える。',
  },
  {
    id: 'exp-vc-042',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'quorum',
    options: ['引用', '割当', '定足数', '騒動'],
    correctIndex: 2,
    explanation:
      'quorum = 定足数(会議の成立に必要な最少出席者数)。lack a quorum(定足数に達しない)。quota(割当・ノルマ)、quotation(引用・見積もり)と語頭が同じで紛らわしい。取締役会・株主総会の議事文書で頻出。',
  },
  {
    id: 'exp-vc-043',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'embezzle',
    options: ['横領する', '装飾する', '困惑させる', '組み込む'],
    correctIndex: 0,
    explanation:
      'embezzle = (公金・会社の金を)横領する・着服する。embezzle company funds(会社の資金を横領する)。embellish(装飾する・話を盛る)、embarrass(困惑させる)、embed(組み込む)と語頭 em- が共通で紛らわしい。名詞形は embezzlement。',
  },
  {
    id: 'exp-vc-044',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'austerity',
    options: ['権威', '誠実', '豊富', '緊縮'],
    correctIndex: 3,
    explanation:
      'austerity = (財政の)緊縮・耐乏。austerity measures(緊縮財政策)。authority(権威)、sincerity(誠実)と語尾の響きが重なる。形容詞 austere は「(人・様式が)厳格な・簡素な」で、こちらも満点レベルで頻出。',
  },
  {
    id: 'exp-vc-045',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'curtail',
    options: ['延長する', '(支出・活動を)切り詰める', '追跡する', '湾曲させる'],
    correctIndex: 1,
    explanation:
      'curtail = (支出・権限・活動を)切り詰める・削減する。curtail spending(支出を削減する)。curtain(カーテン)や tail(尾)からの連想では意味を推測できない典型例。反意語は extend / expand。同義は cut back on / reduce。',
  },
  {
    id: 'exp-vc-046',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'plummet',
    options: ['急上昇する', '配管する', '急落する', '測量する'],
    correctIndex: 2,
    explanation:
      'plummet = (価格・数値が)急落する。Shares plummeted 20 percent.(株価が20%急落した)。plumber(配管工)と語頭が同じで紛らわしい。反意語は soar / surge(急騰する)。おもりを付けた測鉛(plumb)が真っ逆さまに落ちるイメージ。',
  },
  {
    id: 'exp-vc-047',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'stagnant',
    options: ['停滞した', 'よどみない', '上演された', '断固とした'],
    correctIndex: 0,
    explanation:
      'stagnant = (経済・売上が)停滞した、(水が)よどんだ。stagnant sales(伸び悩む売上)。「よどみない(流暢な)」は正反対の意味で、fluent との混同を誘う選択肢。staged(演出された)、staunch(断固とした)は音の連想。動詞は stagnate。',
  },
  {
    id: 'exp-vc-048',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'vet',
    options: ['拒否する', '賭ける', '派遣する', '綿密に審査する'],
    correctIndex: 3,
    explanation:
      'vet(動詞) = (経歴・書類を)綿密に審査する。vet the candidates(候補者を身元審査する)、carefully vetted suppliers(厳選された納入業者)。veto(拒否する)、bet(賭ける)との混同が狙われる。名詞の vet(獣医)とは別用法。',
  },
  {
    id: 'exp-vc-049',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'windfall',
    options: ['強風被害', '没落', '思わぬ臨時収入', '散財'],
    correctIndex: 2,
    explanation:
      'windfall = 思いがけない臨時収入・棚ぼた。a windfall profit(超過利潤・思わぬ利益)。語源は「風で落ちた果実」で、「強風被害」という文字どおりの読みが典型的なひっかけ。windfall tax(超過利得税)も報道で頻出。',
  },
  {
    id: 'exp-vc-050',
    genre: 'vocab',
    difficulty: 'expert',
    prompt: 'reiterate',
    options: ['やり直す', '繰り返し述べる', '軽視する', '仲介する'],
    correctIndex: 1,
    explanation:
      'reiterate = (すでに述べたことを)繰り返し述べる・重ねて強調する。reiterate our commitment(改めて約束を強調する)。iterate(反復処理する)との混同、redo(やり直す)との取り違えに注意。プレスリリース・議事録で頻出。',
  },
  // ---------------------------------------------------------------------------
  // ja-en(ビジネス文書調の和文英訳。誤答肢は文法的に惜しい/語彙選択が不自然な英文)
  // ---------------------------------------------------------------------------
  {
    id: 'exp-je-001',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'その提案は取締役会で満場一致で承認された。',
    options: [
      'The proposal was unanimously approved by the board.',
      'The proposal was simultaneously approved by the board.',
      'The proposal was anonymously approved by the board.',
      'The proposal was mutually approved by the board.',
    ],
    correctIndex: 0,
    explanation:
      'unanimously = 満場一致で。音が似る anonymously(匿名で)、意味を混同しやすい simultaneously(同時に)・mutually(相互に)との識別がポイント。',
  },
  {
    id: 'exp-je-002',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本契約は、いずれかの当事者が30日前に書面で通知することにより解除できる。',
    options: [
      "This agreement may be terminated by either party until thirty days' written notice.",
      "This agreement may be terminated by either party upon thirty days' written notice.",
      "This agreement may terminate either party upon thirty days' written notice.",
      "This agreement may be terminated by both parties upon thirty days' written notice.",
    ],
    correctIndex: 1,
    explanation:
      "upon thirty days' written notice = 「30日前の書面通知をもって」。until は期限までの継続を表し通知の条件には使えない。「いずれか一方の当事者」は either party で、both parties(両当事者)では意味がずれる。契約が当事者を解除する能動形も誤り。",
  },
  {
    id: 'exp-je-003',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'ご不便をおかけしましたことを深くお詫び申し上げます。',
    options: [
      'We sincerely apologize any inconvenience this may have caused.',
      'We sincerely apologize you for any inconvenience this may have caused.',
      'We sincerely apologize for any inconvenience this may have caused.',
      'We sincerely apologize for any convenience this may have caused.',
    ],
    correctIndex: 2,
    explanation:
      'apologize は自動詞なので apologize for 〜 の形を取る。for の脱落や、apologize you のように人を直接目的語に取る形は誤り。inconvenience(不便)と convenience(便利)の取り違えにも注意。',
  },
  {
    id: 'exp-je-004',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '当社は、市場の変動にかかわらず、安定した収益の確保に尽力しております。',
    options: [
      'We are committed to secure stable revenues regardless of market fluctuations.',
      'We are committed to securing stable revenues regardless to market fluctuations.',
      'We are committed to securing stable revenues irrespective with market fluctuations.',
      'We are committed to securing stable revenues regardless of market fluctuations.',
    ],
    correctIndex: 3,
    explanation:
      'be committed to の to は前置詞なので動名詞 securing が続く(to secure は誤り)。「〜にかかわらず」は regardless of / irrespective of で、regardless to や irrespective with という形は存在しない。',
  },
  {
    id: 'exp-je-005',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '新しい規定は、来月1日をもって発効します。',
    options: [
      'The new regulations will take effect as of the first of next month.',
      'The new regulations will take affect as of the first of next month.',
      'The new regulations will be taken effect as of the first of next month.',
      'The new regulations will make effect as of the first of next month.',
    ],
    correctIndex: 0,
    explanation:
      'take effect = 「(法律・規定が)発効する」。自動詞的な熟語なので受動態 be taken effect にはしない。名詞 effect と動詞 affect の綴り違い、make effect という存在しないコロケーションにも注意。as of 〜 = 「〜付けで」。',
  },
  {
    id: 'exp-je-006',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '万一納期に遅れが生じる場合は、事前にご一報いただければ幸いです。',
    options: [
      'Should there be any delay in delivery, we would appreciate you to notify us in advance.',
      'Should there be any delay in delivery, we would appreciate your notifying us in advance.',
      'If there would be any delay in delivery, we would appreciate your notifying us in advance.',
      'Should it be any delay in delivery, we would appreciate your notifying us in advance.',
    ],
    correctIndex: 1,
    explanation:
      'Should there be 〜 = If there should be 〜(万一〜があれば)の倒置。appreciate は動名詞を目的語に取り(appreciate your -ing)、appreciate you to do の形は取れない。条件節の中で would は使わず、存在文の主語は it でなく there。',
  },
  {
    id: 'exp-je-007',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '弊社の監査の結果、帳簿上の複数の不一致が明らかになりました。',
    options: [
      'Our audit appeared several discrepancies in the accounting records.',
      'Our audit was revealed several discrepancies in the accounting records.',
      'Our audit revealed several discrepancies in the accounting records.',
      'Our audit revealed several discretions in the accounting records.',
    ],
    correctIndex: 2,
    explanation:
      'reveal(明らかにする)は他動詞で目的語を直接取る。appear は自動詞なので目的語を取れず、受動態 was revealed では目的語が続かない。discrepancy(不一致)と discretion(裁量)の混同も定番のひっかけ。',
  },
  {
    id: 'exp-je-008',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '価格には、別段の定めがない限り、消費税は含まれておりません。',
    options: [
      'Prices do not include consumption tax unless otherwise specifying.',
      'Prices do not include consumption tax if not otherwise specify.',
      'Prices do not include consumption tax in case otherwise specified.',
      'Prices do not include consumption tax unless otherwise specified.',
    ],
    correctIndex: 3,
    explanation:
      'unless otherwise specified = 「別段の定めがない限り」の契約定型句。unless (it is) otherwise specified の省略形なので過去分詞 specified が正しい。specifying や原形 specify では省略構文が成立せず、in case は「〜に備えて」で意味がずれる。',
  },
  {
    id: 'exp-je-009',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'この件については、追って担当者よりご連絡差し上げます。',
    options: [
      'The person in charge will contact you shortly regarding this matter.',
      'The person in charge will contact to you shortly regarding this matter.',
      'The person in charge will contact you shortly regarding to this matter.',
      'The person in charge will be contacted you shortly regarding this matter.',
    ],
    correctIndex: 0,
    explanation:
      'contact は他動詞なので contact you と直接目的語を取る(contact to you は誤り)。regarding 自体が前置詞なので regarding to とは言わない。受動態 be contacted では you を続けられない。TOEIC 最頻出の自動詞・他動詞識別。',
  },
  {
    id: 'exp-je-010',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本報告書の数値は、四捨五入のため合計が一致しない場合があります。',
    options: [
      'Figures in this report may not be added up to the totals due to rounding.',
      'Figures in this report may not add up to the totals due to rounding.',
      'Figures in this report may not add up the totals due to rounding.',
      'Figures in this report may not add up to the totals because of rounded.',
    ],
    correctIndex: 1,
    explanation:
      'add up to 〜 = 「合計が〜になる」(自動詞句)。主語 Figures 自身が合計になる関係なので受動態にしない。to が抜けると「合計を計算する」で意味がずれる。due to / because of の後ろは名詞(rounding)が必要で、分詞 rounded は置けない。',
  },
  {
    id: 'exp-je-011',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '弊社が個人情報を第三者に開示することは、いかなる状況でも一切ございません。',
    options: [
      'Under no circumstances we will disclose personal information to third parties.',
      'Under any circumstances will we disclose personal information to third parties.',
      'Under no circumstances will we disclose personal information to third parties.',
      'Under no circumstances will we disclose personal information for third parties.',
    ],
    correctIndex: 2,
    explanation:
      '否定の副詞句 Under no circumstances が文頭に立つと、主語と助動詞が倒置して will we の語順になる。倒置しない語順は誤り。no を any にすると否定の意味が消えて原文と逆になる。「第三者に開示する」は disclose ... to third parties。',
  },
  {
    id: 'exp-je-012',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '当該製品の欠陥に起因する損害について、当社は責任を負いかねます。',
    options: [
      'We cannot be held liable for damages arising to defects in the product.',
      'We cannot hold liable for damages arising from defects in the product.',
      'We cannot be held liable for damages arisen from defects in the product.',
      'We cannot be held liable for damages arising from defects in the product.',
    ],
    correctIndex: 3,
    explanation:
      'be held liable for 〜 = 「〜の責任を問われる」。hold を能動のままにすると目的語が欠けて文が成立しない。「〜に起因する」は arise from で、現在分詞 arising が damages を後置修飾する。arisen は完了形でのみ使う過去分詞。',
  },
  {
    id: 'exp-je-013',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本注文は、当社与信部門の承認を条件として確定するものとします。',
    options: [
      'This order shall be confirmed subject to approval by our credit department.',
      'This order shall be confirmed subjected to approval by our credit department.',
      'This order shall be confirmed subject for approval by our credit department.',
      'This order shall be confirmed subjecting to approval by our credit department.',
    ],
    correctIndex: 0,
    explanation:
      'subject to 〜 = 「〜を条件として」(形容詞句)。be subjected to 〜 は「〜(苦痛・試練)にさらされる」で意味がずれる。subject for / subjecting to という形は存在しない。契約書・注文書の最頻出定型句。',
  },
  {
    id: 'exp-je-014',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '詳細につきましては、同封の資料をご参照ください。',
    options: [
      'For further details, please refer the enclosed documents.',
      'For further details, please refer to the enclosed documents.',
      'For further details, please be referred to the enclosing documents.',
      'For further details, please refer to the documents enclosing.',
    ],
    correctIndex: 1,
    explanation:
      'refer to 〜 = 「〜を参照する」。refer は自動詞用法なので to が必須(refer the documents は誤り)。「同封の」は受動の意味なので過去分詞 enclosed が正しく、enclosing では「同封している資料」となり不成立。',
  },
  {
    id: 'exp-je-015',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '申込書はすべての欄にご記入のうえ、人事部までご提出ください。',
    options: [
      'Please complete the application form in fully and submit it to the Personnel Department.',
      'Please complete the application form in full and submit it for the Personnel Department.',
      'Please complete the application form in full and submit them to the Personnel Department.',
      'Please complete the application form in full and submit it to the Personnel Department.',
    ],
    correctIndex: 3,
    explanation:
      'in full = 「漏れなく・全部」(前置詞+名詞の副詞句)なので副詞 fully を続けた in fully は誤り。form(単数)を受ける代名詞は it で、them では数が合わない。提出先を表す前置詞は to(submit A to B)。',
  },
  {
    id: 'exp-je-016',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '弊社は創業以来、一貫して品質第一を貫いてまいりました。',
    options: [
      'We are consistently putting quality first since our founding.',
      'We have consistently put quality first since our founding.',
      'We had consistently put quality first since our founding.',
      'We consistently put quality first since our founding.',
    ],
    correctIndex: 1,
    explanation:
      'since 〜(〜以来)が現在までの継続を表すため、現在完了 have put と組み合わせる。現在進行形や単純現在・過去では since と時制が整合しない。過去完了 had put は過去のある時点までの継続に使うためここでは不可。',
  },
  {
    id: 'exp-je-017',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本メールに心当たりのない場合は、お手数ですが破棄してください。',
    options: [
      'If you have received this email in error, please discard it.',
      'If you have received this email by error, please discard it.',
      'If you had received this email in error, please discard it.',
      'If you have received this email in error, please be discarded it.',
    ],
    correctIndex: 0,
    explanation:
      'in error = 「誤って・手違いで」の定型句(by error とは言わない)。誤送信は現在に影響する完了した出来事なので現在完了 have received が適切で、過去完了 had received では主節と整合しない。please be discarded では受動態に目的語が続き非文。',
  },
  {
    id: 'exp-je-018',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '予算の制約を考慮すると、その提案は現実的とは言い難い。',
    options: [
      'Giving the budget constraints, the proposal is hardly realistic.',
      'Given to the budget constraints, the proposal is hardly realistic.',
      'Given the budget constraints, the proposal is hardly realistic.',
      'Given the budget constraints, the proposal is hard realistic.',
    ],
    correctIndex: 2,
    explanation:
      'given + 名詞 = 「〜を考慮すると」の慣用的な前置詞用法。giving では「与えている」という通常の分詞構文になり意味が通らず、given to という形も取らない。hardly(ほとんど〜ない)と hard(難しい・熱心に)の副詞の識別も併せて問うている。',
  },
  {
    id: 'exp-je-019',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本セミナーへの参加をご希望の方は、事前のご登録が必要です。',
    options: [
      'Those who wishing to attend the seminar are required to register in advance.',
      'Those wishing to attending the seminar are required to register in advance.',
      'Those wishing to attend the seminar is required to register in advance.',
      'Those wishing to attend the seminar are required to register in advance.',
    ],
    correctIndex: 3,
    explanation:
      'Those + 現在分詞 = 「〜する人々」(Those who wish の分詞による縮約)。who と -ing を両方残した who wishing は非文。Those は複数扱いなので is は誤り。wish to do の to は不定詞なので attending は続けられない。',
  },
  {
    id: 'exp-je-020',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '調査結果次第では、当社の方針を見直す可能性もございます。',
    options: [
      'Depending of the findings of the survey, we may revise our policy.',
      'Depended on the findings of the survey, we may revise our policy.',
      'Depending on the findings of the survey, we may revise our policy.',
      'Depending on the findings of the survey, we may revised our policy.',
    ],
    correctIndex: 2,
    explanation:
      'depending on 〜 = 「〜次第で」の定型句。depend は on と結びつく(depending of は誤り)。過去分詞 depended では受動の分詞構文になり意味が通らない。助動詞 may の後ろは動詞の原形なので may revised は非文。',
  },
  {
    id: 'exp-je-021',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '不良品は、お買い上げ後30日以内であれば無償でお取り替えいたします。',
    options: [
      'Defective items will be replaced free of charge within thirty days of purchase.',
      'Defective items will be replaced freely of charge within thirty days of purchase.',
      'Defective items will replace free of charge within thirty days of purchase.',
      'Defective items will be replaced free of charge within thirty days after purchased.',
    ],
    correctIndex: 0,
    explanation:
      'free of charge = 「無償で」の定型句(freely of charge とは言わない)。items は「交換される」側なので受動態 will be replaced が必要。「購入後30日以内」は within thirty days of purchase で、after purchased は前置詞の後に過去分詞が裸で続く非文。',
  },
  {
    id: 'exp-je-022',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '新システムへの移行は、段階的に実施される予定です。',
    options: [
      'The migration to the new system is scheduled to implement in phases.',
      'The migration to the new system is scheduled to be implemented in phases.',
      'The migration to the new system is scheduling to be implemented in phases.',
      'The migration to the new system is scheduled being implemented in phases.',
    ],
    correctIndex: 1,
    explanation:
      '主語 the migration は「実施される」側なので、to 不定詞も受動形 to be implemented にする。to implement のままでは移行自体が何かを実施する能動の意味になってしまう。schedule は「予定される」側なので is scheduling も誤り。in phases = 段階的に。',
  },
  {
    id: 'exp-je-023',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '上記の価格は、予告なく変更されることがあります。',
    options: [
      'The above prices are subjected to change without notice.',
      'The above prices are subject to be changed without notice.',
      'The above prices are subject to change without notice.',
      'The above prices are subject to change without noticing.',
    ],
    correctIndex: 2,
    explanation:
      'be subject to change = 「変更されることがある」の定型句。この to は前置詞で、change は名詞。そのため to be changed という不定詞は続かない。be subjected to は「(試練などに)さらされる」で別表現。without notice = 予告なく(noticing としない)。',
  },
  {
    id: 'exp-je-024',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '日頃より弊社製品をご愛顧いただき、誠にありがとうございます。',
    options: [
      'Thank you for your continued patronizing of our products.',
      'Thank you for your continued patronage of our products.',
      'Thank you to your continued patronage of our products.',
      'Thank you for your continuing patron of our products.',
    ],
    correctIndex: 1,
    explanation:
      'patronage = 「愛顧・引き立て」(不可算名詞)。動詞 patronize には「ひいきにする」の語義もあるが「見下す」の含みが強く、your continued patronizing of 〜 という動名詞の言い回し自体が不自然。patron は「顧客・後援者」という人を表す語で文意に合わない。',
  },
  {
    id: 'exp-je-025',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'この割引は、他のキャンペーンとの併用はできません。',
    options: [
      'This discount cannot be combined to any other promotional offers.',
      'This discount cannot combine with any other promotional offers.',
      'This discount cannot be combined with any another promotional offer.',
      'This discount cannot be combined with any other promotional offers.',
    ],
    correctIndex: 3,
    explanation:
      'combine A with B の受動形 be combined with 〜 = 「〜と併用される」。前置詞は with であり to は誤り。discount は「併用される」側なので能動 cannot combine も不可。any another という並びは存在しない(any other + 複数名詞)。',
  },
  {
    id: 'exp-je-026',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本日は、社長に代わりまして私がご挨拶を申し上げます。',
    options: [
      'Today, I would like to say a few words on behalf of the president.',
      'Today, I would like to say a few words on behalf for the president.',
      'Today, I would like to say a few words for behalf of the president.',
      'Today, I would like to say a few words on the behalf to the president.',
    ],
    correctIndex: 0,
    explanation:
      'on behalf of 〜 = 「〜に代わって・〜を代表して」の定型句。前置詞の組み合わせは on と of で固定されており、for behalf や behalf to のような形は存在しない。式辞・ビジネススピーチの最頻出表現。',
  },
  {
    id: 'exp-je-027',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'アンケートにご回答いただいた方全員に、粗品を進呈いたします。',
    options: [
      'Anyone completed the survey will receive a small gift.',
      'Anyone completing the survey will receive a small gift.',
      'Anyone completing the survey will be received a small gift.',
      'Anyone to completing the survey will receive a small gift.',
    ],
    correctIndex: 1,
    explanation:
      'Anyone + 現在分詞 = 「〜する人は誰でも」(Anyone who completes の縮約)。complete は他動詞で the survey を目的語に取る能動関係なので、過去分詞 completed による縮約は不可。受け取るのは Anyone 自身なので受動態 will be received も誤り。',
  },
  {
    id: 'exp-je-028',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本書類は社外秘につき、お取り扱いには十分ご注意ください。',
    options: [
      'As this document is strictly confidence, please handle it with care.',
      'As this document is strictly confidential, please handle with care it.',
      'As this document is strictly confidential, please handle it with care.',
      'As this document is strictly confidential, please handle it with careful.',
    ],
    correctIndex: 2,
    explanation:
      '補語には形容詞 confidential(社外秘の)を置く(confidence は名詞)。handle は他動詞なので目的語 it は動詞の直後に置き、handle with care it という語順は不可。with care = 注意して(care は名詞。careful は形容詞なので with の後に置けない)。',
  },
  {
    id: 'exp-je-029',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '売上高は、前年同期比で12%上昇しました。',
    options: [
      'Sales raised by twelve percent compared with the same period last year.',
      'Sales were risen by twelve percent compared with the same period last year.',
      'Sales arose by twelve percent compared with the same period last year.',
      'Sales rose by twelve percent compared with the same period last year.',
    ],
    correctIndex: 3,
    explanation:
      'rise(上がる)は自動詞で、過去形は rose。raise は他動詞(〜を上げる)なので目的語のない Sales raised は誤り。arise は「(問題などが)生じる」で数値の上昇には使わない。rise は自動詞なので受動態 were risen にはできない。',
  },
  {
    id: 'exp-je-030',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '来週までに、法務部に契約書を確認してもらう必要があります。',
    options: [
      'We need to have the contract review by the Legal Department by next week.',
      'We need to have the contract to be reviewed by the Legal Department by next week.',
      'We need to have reviewed the contract by the Legal Department by next week.',
      'We need to have the contract reviewed by the Legal Department by next week.',
    ],
    correctIndex: 3,
    explanation:
      'have + 目的語 + 過去分詞 = 「〜を…してもらう」。the contract は「確認される」側なので過去分詞 reviewed を置く。原形 review では能動関係になり不成立、to be reviewed という不定詞は have の構文では使えない。have reviewed では完了形になり「してもらう」の意味が消える。',
  },
  {
    id: 'exp-je-031',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'ご入金の確認が取れ次第、領収書を発行いたします。',
    options: [
      'We will issue a receipt upon confirm of your payment.',
      'We will issue a receipt upon to confirm your payment.',
      'We will issue a receipt upon confirmation of your payment.',
      'We will issue a receipt upon confirmed your payment.',
    ],
    correctIndex: 2,
    explanation:
      'upon + 名詞/動名詞 = 「〜し次第・〜と同時に」。upon は前置詞なので名詞 confirmation(または confirming)が続く。動詞の原形 confirm や過去分詞 confirmed、to 不定詞は前置詞の後に置けない。upon receipt of 〜(〜を受領次第)も同型の頻出表現。',
  },
  {
    id: 'exp-je-032',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '停電に備えて、全データは毎晩バックアップされています。',
    options: [
      'All data is backed up every night in case of a power outage.',
      'All data is backed up every night in case a power outage.',
      'All data is backed up every night in the case power outage.',
      'All data backs up every night in case of a power outage.',
    ],
    correctIndex: 0,
    explanation:
      'in case of + 名詞 = 「〜に備えて・〜の場合には」。名詞句を導くときは of が必須で、in case を節以外に直接つなげることはできない(in case + S + V なら節が続く)。data は「バックアップされる」側なので受動態 is backed up が正しい。',
  },
  {
    id: 'exp-je-033',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '上司は私にその報告書を書き直させた。',
    options: [
      'My supervisor made me to rewrite the report.',
      'My supervisor made me rewriting the report.',
      'My supervisor made me rewritten the report.',
      'My supervisor made me rewrite the report.',
    ],
    correctIndex: 3,
    explanation:
      '使役動詞 make + 目的語 + 動詞の原形 = 「〜に…させる」。make の後の不定詞は to を付けない原形不定詞になる(made me to do は誤り)。-ing や過去分詞も置けない。同じ使役でも get は get me to rewrite と to が必要になる点との対比が満点レベル。',
  },
  {
    id: 'exp-je-034',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '当社が海外展開を始めてから、今年で10年になります。',
    options: [
      'It has passed ten years since we began expanding overseas.',
      'It has been ten years since we began expanding overseas.',
      'Ten years have passed when we began expanding overseas.',
      'It has been ten years since we have begun expanding overseas.',
    ],
    correctIndex: 1,
    explanation:
      'It has been X years since + 過去形 = 「〜してからX年になる」。since 節の中は過去の起点を表す過去形(began)で、現在完了 have begun にはしない。It has passed という形は取れず(Ten years have passed since 〜 なら可)、when では「〜以来」の意味が出ない。',
  },
  {
    id: 'exp-je-035',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '遅くとも金曜日の正午までにご返信ください。',
    options: [
      'Please reply by noon on Friday at the latest.',
      'Please reply until noon on Friday at the latest.',
      'Please reply by noon on Friday at latest.',
      'Please reply by noon on Friday in the latest.',
    ],
    correctIndex: 0,
    explanation:
      '期限は by(〜までに)で表し、at the latest(遅くとも)を文末に添える。until は継続(〜までずっと)なので reply のような一回きりの動作には使えない。at the latest は定冠詞 the が必須で、at latest / in the latest という形は存在しない。',
  },
  {
    id: 'exp-je-036',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'システム更新に伴い、下記の時間帯はサービスをご利用いただけません。',
    options: [
      'In connection to the system upgrade, the service will be unavailable during the hours below.',
      'On connection with the system upgrade, the service will be unavailable during the hours below.',
      'In connection with the system upgrade, the service will be unavailable during the hours below.',
      'In connecting with the system upgrade, the service will be unavailable during the hours below.',
    ],
    correctIndex: 2,
    explanation:
      'in connection with 〜 = 「〜に関連して・〜に伴い」の定型表現。前置詞の組み合わせは in と with で固定(in connection to / on connection with は誤り)。in connecting のような動名詞では慣用句にならない。',
  },
  {
    id: 'exp-je-037',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'あいにくですが、ご希望の日程は満席となっております。',
    options: [
      'We regret informing you that no seats are available on your preferred dates.',
      'We regret to inform you that no seats are available on your preferred dates.',
      'We are regretted to inform you that no seats are available on your preferred dates.',
      'We regret to informing you that no seats are available on your preferred dates.',
    ],
    correctIndex: 1,
    explanation:
      'regret to do = 「残念ながら〜する」(これから伝える悪い知らせの前置き)。regret -ing は「〜したことを後悔する」で意味が変わるのが最大の罠。regret は他動詞なので受動態 be regretted は不可。to の後は原形なので to informing も誤り。',
  },
  {
    id: 'exp-je-038',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本キャンペーンは、お一人様一回限りとさせていただきます。',
    options: [
      'This offer is limited by one per customer.',
      'This offer is limiting to one per customer.',
      'This offer limits to one per customer.',
      'This offer is limited to one per customer.',
    ],
    correctIndex: 3,
    explanation:
      'be limited to 〜 = 「〜に限定される」。limit A to B(AをBに制限する)の受動形なので前置詞は to(by ではない)。offer は「制限される」側なので現在分詞 limiting や能動の limits では意味関係が成立しない。one per customer = 1人につき1回。',
  },
  {
    id: 'exp-je-039',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'またのご利用を心よりお待ちしております。',
    options: [
      'We look forward to serving you again.',
      'We look forward to serve you again.',
      'We are looking forward serving you again.',
      'We look forward for serving you again.',
    ],
    correctIndex: 0,
    explanation:
      'look forward to -ing = 「〜を楽しみに待つ」。この to は前置詞なので動名詞 serving が続く(to serve は最頻出の誤り)。to を落とした looking forward serving、for に変えた look forward for も非文。ビジネスメール締めの定番表現。',
  },
  {
    id: 'exp-je-040',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '掲載情報の正確性には万全を期しておりますが、内容を保証するものではありません。',
    options: [
      'Every efforts is made to ensure the accuracy of the information, but its content is not guaranteed.',
      'Every effort is done to ensure the accuracy of the information, but its content is not guaranteed.',
      'Every effort is made to ensure the accuracy of the information, but its content is not guaranteed.',
      'All effort are made to ensure the accuracy of the information, but its content is not guaranteed.',
    ],
    correctIndex: 2,
    explanation:
      'make an effort(努力する)のコロケーションを受動にした Every effort is made to do = 「〜するよう万全を期す」。effort と組む動詞は make であり do ではない。every の後は単数名詞(every efforts は非文)、all effort are は数の不一致。',
  },
  {
    id: 'exp-je-041',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '悪天候にもかかわらず、式典は予定どおり執り行われました。',
    options: [
      'Despite of the inclement weather, the ceremony proceeded as scheduled.',
      'Despite the inclement weather, the ceremony proceeded as scheduled.',
      'Although the inclement weather, the ceremony proceeded as scheduled.',
      'In spite the inclement weather, the ceremony proceeded as scheduled.',
    ],
    correctIndex: 1,
    explanation:
      'despite + 名詞 = 「〜にもかかわらず」。despite 自体が前置詞なので of は不要(despite of は最頻出の誤り)。although は接続詞なので節が必要で名詞句を導けない。in spite は of を伴って in spite of の形でのみ使う。inclement weather = 悪天候。',
  },
  {
    id: 'exp-je-042',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '重要なのは、締め切りを確実に守ることです。',
    options: [
      'That matters is meeting the deadline without fail.',
      'What is matters is meeting the deadline without fail.',
      'What matters are meeting the deadline without fail.',
      'What matters is meeting the deadline without fail.',
    ],
    correctIndex: 3,
    explanation:
      'What matters is 〜 = 「重要なのは〜だ」。関係代名詞 what が導く名詞節(What matters = 重要なこと)が主語で、節内では what 自身が matters の主語を兼ねる。That では名詞節の主語が欠け、What is matters は動詞が重複。what 節は単数扱いなので are も誤り。',
  },
  {
    id: 'exp-je-043',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'お早めにご登録いただくほど、良いお席をご用意できます。',
    options: [
      'The earlier you register, the better seats we can offer.',
      'The early you register, the better seats we can offer.',
      'The earlier you register, the better seats can we offer.',
      'The earlier you will register, the better seats we can offer.',
    ],
    correctIndex: 0,
    explanation:
      'the + 比較級, the + 比較級 = 「〜すればするほど…」。両方の節とも比較級(earlier / better)が必要で、原級 early は不可。この構文では疑問文型の倒置(can we)はせず、条件を表す前半の節では未来でも will を使わない。',
  },
  {
    id: 'exp-je-044',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '新工場は、来年春に稼働開始の予定です。',
    options: [
      'The new plant is due to beginning operations next spring.',
      'The new plant is due for begin operations next spring.',
      'The new plant is due to begin operations next spring.',
      'The new plant dues to begin operations next spring.',
    ],
    correctIndex: 2,
    explanation:
      'be due to do = 「〜する予定である」。due の後は to + 動詞の原形(to beginning は誤り)。due for の後には名詞が来る(due for renewal など)。due は形容詞なので dues to のように動詞としては使えない。begin operations = 稼働を開始する。',
  },
  {
    id: 'exp-je-045',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '館内での写真撮影はご遠慮ください。',
    options: [
      'Please refrain to take photographs inside the building.',
      'Please refrain from taking photographs inside the building.',
      'Please be refrained from taking photographs inside the building.',
      'Please refrain taking photographs inside the building.',
    ],
    correctIndex: 1,
    explanation:
      'refrain from -ing = 「〜を控える」。refrain は自動詞で前置詞 from と結びつき、to 不定詞や動名詞を直接目的語に取れない。自動詞なので受動態 be refrained も不可。案内表示・アナウンスの最頻出表現。',
  },
  {
    id: 'exp-je-046',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '価格が高いからといって、品質が良いとは限りません。',
    options: [
      'A high price never means high quality.',
      'A high price does not mean high quality at all.',
      'A high price necessarily does not mean high quality.',
      'A high price does not necessarily mean high quality.',
    ],
    correctIndex: 3,
    explanation:
      'not necessarily = 「必ずしも〜とは限らない」の部分否定。necessarily は not の後に置く(necessarily does not の語順では全否定に近い不自然な文になる)。never や not ... at all は全否定で「決して良くない」となり原文の意味とずれる。',
  },
  {
    id: 'exp-je-047',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '本施設のご利用には、事前のご予約が必要です。',
    options: [
      'Advance reservations are required to use this facility.',
      'Advance reservations require to use this facility.',
      'Advance reservations are required using this facility.',
      'Advance reservations are requiring to use this facility.',
    ],
    correctIndex: 0,
    explanation:
      'be required to do = 「〜するために必要とされる」。reservations は「必要とされる」側なので受動態が正しく、能動の require / are requiring では予約自身が何かを要求する意味になってしまう。目的を表す to 不定詞の位置にも注意。',
  },
  {
    id: 'exp-je-048',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '署名済みの契約書を、同封の返信用封筒にてご返送ください。',
    options: [
      'Please return the signing contract in the enclosed reply envelope.',
      'Please return the signed contract in the enclosing reply envelope.',
      'Please return the contract signing in the enclosed reply envelope.',
      'Please return the signed contract in the enclosed reply envelope.',
    ],
    correctIndex: 3,
    explanation:
      '「署名済みの」は受動の過去分詞 signed、「同封の」も受動の enclosed。契約書は「署名される」側、封筒は「同封される」側なので、能動の現在分詞 signing / enclosing では修飾関係が成立しない。分詞の能動・受動の識別を二重に問う問題。',
  },
  {
    id: 'exp-je-049',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: 'ご要望のとおり、会議の議事録を全参加者に送付いたしました。',
    options: [
      'As requesting, the minutes of the meeting have been sent to all participants.',
      'As requested, the minutes of the meeting have been sent to all participants.',
      'As it requested, the minutes of the meeting have been sent to all participants.',
      'As requested, the minutes of the meeting have sent to all participants.',
    ],
    correctIndex: 1,
    explanation:
      'as requested = 「ご要望のとおり」(as it was requested の省略で過去分詞)。要望は「される」側なので requesting は誤り。as it requested では it が要望した側になり不成立。minutes(議事録)は「送られる」側なので受動態 have been sent が必要。',
  },
  {
    id: 'exp-je-050',
    genre: 'ja-en',
    difficulty: 'expert',
    prompt: '申し訳ございませんが、お電話でのご注文は承っておりません。',
    options: [
      'Unfortunately, we are unable to accepting orders over the phone.',
      'Unfortunately, we are unable of accepting orders over the phone.',
      'Unfortunately, we are unable to accept orders over the phone.',
      'Unfortunately, we unable to accept orders over the phone.',
    ],
    correctIndex: 2,
    explanation:
      'be unable to do = 「〜できない」。unable は形容詞なので be 動詞が必須で、to の後は動詞の原形(to accepting は誤り)。unable of という形は存在しない(incapable of -ing との混同を狙った選択肢)。over the phone = 電話で。',
  },
  // ---------------------------------------------------------------------------
  // en-ja(複雑な構文の英文和訳。誤答肢は構文の読み違えを再現した和訳)
  // ---------------------------------------------------------------------------
  {
    id: 'exp-ej-001',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The merger is contingent upon regulatory approval.',
    options: [
      '合併は規制当局の承認次第である。',
      '合併は規制当局の承認に反対している。',
      '合併は規制当局の承認を偶然得た。',
      '合併は規制当局の承認を延期した。',
    ],
    correctIndex: 0,
    explanation:
      'be contingent upon 〜 = 「〜次第である、〜を条件とする」。contingent 単体の「偶発的な」という意味と混同しないこと。契約書・報道で頻出の表現。',
  },
  {
    id: 'exp-ej-002',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'Not until the final audit had been completed did the extent of the misappropriation become apparent.',
    options: [
      '最終監査が完了するまでは、横領の全容は明らかであった。',
      '最終監査が完了して初めて、横領の全容が明らかになった。',
      '最終監査が完了しなかったため、横領の全容は明らかにならなかった。',
      '最終監査が完了する前に、横領の全容は明らかになっていた。',
    ],
    correctIndex: 1,
    explanation:
      'Not until A did B(倒置)= 「Aして初めてBした」。監査完了より前には全容が分からなかったという時間関係を表す。「完了するまでは明らかだった」「完了する前に明らかになっていた」はいずれも否定と倒置の読み違え。',
  },
  {
    id: 'exp-ej-003',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'The committee, whose recommendations the board had repeatedly ignored, ultimately resigned en masse.',
    options: [
      '委員会の提言を再三無視してきた取締役会は、最終的に総辞職した。',
      '委員会は、取締役会の提言を再三無視した末、最終的に全員辞任した。',
      '取締役会がその提言を再三無視してきた委員会は、最終的に全員辞任した。',
      '取締役会は委員会の提言を再三無視したが、委員会は辞任を思いとどまった。',
    ],
    correctIndex: 2,
    explanation:
      '主語は The committee で、whose recommendations the board had repeatedly ignored は挿入された関係詞節。「無視したのは取締役会・辞任したのは委員会」という主述関係の把握が鍵。en masse = 一斉に・全員で。',
  },
  {
    id: 'exp-ej-004',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'Were it not for the tax incentives offered by the prefecture, few manufacturers would consider relocating here.',
    options: [
      '県が税制優遇を提供しなかったので、ここへの移転を検討した製造業者はほとんどなかった。',
      '県が提供する税制優遇のおかげで、多くの製造業者がここへの移転を検討している。',
      '県が税制優遇を提供するかどうかにかかわらず、移転を検討する製造業者はほとんどない。',
      '県が提供する税制優遇がなければ、ここへの移転を検討する製造業者はほとんどないだろう。',
    ],
    correctIndex: 3,
    explanation:
      'Were it not for 〜 = If it were not for 〜(〜がなければ)の倒置で仮定法過去。現在の事実の裏返しを述べており、過去の出来事(提供しなかったので…)と読むのは誤り。few は「ほとんどない」。',
  },
  {
    id: 'exp-ej-005',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'Far from resolving the dispute, the arbitration only served to entrench both parties in their positions.',
    options: [
      '仲裁は紛争を解決するどころか、双方の立場をいっそう硬化させる結果にしかならなかった。',
      '仲裁は紛争解決には程遠かったが、双方が歩み寄るきっかけにはなった。',
      '紛争解決から遠く離れた場所で行われた仲裁は、双方の立場を強固にしただけだった。',
      '仲裁が紛争をようやく解決したので、双方は自らの立場を撤回した。',
    ],
    correctIndex: 0,
    explanation:
      'far from -ing = 「〜するどころか」。場所的な「遠く離れて」と読むのは典型的な誤読。only serve to do = 「〜する結果にしかならない」、entrench = 「(立場・慣行を)固定化させる」。',
  },
  {
    id: 'exp-ej-006',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'The figures, however impressive they may appear at first glance, warrant closer scrutiny.',
    options: [
      'しかしながら、その数値は一見して見事であり、精査を必要としない。',
      'その数値は、一見どれほど見事に見えようとも、より綿密な精査に値する。',
      'その数値は一見して印象的なので、さらに詳しく調べる価値がある。',
      'その数値がどれほど正確かは、一見しただけでは精査できない。',
    ],
    correctIndex: 1,
    explanation:
      'however + 形容詞 + S + may V = 「どれほど〜であろうとも」の譲歩節。文頭の However(しかしながら)とは別物で、譲歩を理由(〜なので)と読み替えるのも誤り。warrant = 「〜に値する」。',
  },
  {
    id: 'exp-ej-007',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'Having exhausted every avenue of negotiation, the union had little choice but to call a strike.',
    options: [
      'あらゆる交渉の手立てを尽くしたにもかかわらず、組合はストライキを中止せざるを得なかった。',
      '交渉の手立てを使い果たして疲れ切った組合には、ストライキを実施する余力はほとんどなかった。',
      'あらゆる交渉の手立てを尽くした末、組合はストライキを実施するよりほかにほとんど選択肢がなかった。',
      'あらゆる交渉を避けてきた組合には、ストライキ以外の選択肢が数多く残されていた。',
    ],
    correctIndex: 2,
    explanation:
      'Having exhausted 〜 は完了の分詞構文で「〜し尽くした後で」。exhaust every avenue = 「あらゆる手段を尽くす」であり「疲れ果てる」の意味ではない。have little choice but to do = 「〜するほかほとんど選択肢がない」。',
  },
  {
    id: 'exp-ej-008',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'What the report fails to mention is that the pilot program was discontinued for reasons unrelated to its performance.',
    options: [
      'その報告書は、試験プログラムが成果不振で打ち切られたことに触れそこねている。',
      'その報告書が言及に失敗したため、試験プログラムは成果と無関係に打ち切られた。',
      '試験プログラムの成果に触れていない報告書は、無関係な理由で作成が中止された。',
      'その報告書が触れていないのは、試験プログラムが成果とは無関係の理由で打ち切られたという点である。',
    ],
    correctIndex: 3,
    explanation:
      'What S fails to mention is that 〜 = 「Sが触れていないのは〜という点だ」の擬似分裂文。fail to do = 「〜していない」。unrelated to its performance = 「成果とは無関係の」であり、「成果不振で」は正反対の誤読。',
  },
  {
    id: 'exp-ej-009',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      "The vendor shall indemnify the client against any losses incurred as a consequence of the vendor's negligence.",
    options: [
      'ベンダーは、ベンダーの過失の結果として生じたいかなる損失についても、クライアントに補償するものとする。',
      'クライアントは、ベンダーの過失の結果として生じた損失をベンダーに補償するものとする。',
      'ベンダーは、クライアントの過失の結果として生じた損失を免責されるものとする。',
      'ベンダーは、過失の有無にかかわらず、クライアントの損失を負担しないものとする。',
    ],
    correctIndex: 0,
    explanation:
      'indemnify A against B = 「AにBについて補償する」。補償するのはベンダー、補償されるのはクライアントで、主語と目的語の取り違えが最大の罠。契約書の shall は「〜するものとする」という義務を表す。incur = (損失を)被る。',
  },
  {
    id: 'exp-ej-010',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'So convoluted was the approval process that several applicants abandoned their submissions midway.',
    options: [
      '承認プロセスはとても複雑だったが、複数の申請者は途中で申請をやり直した。',
      '承認プロセスがあまりに複雑だったため、複数の申請者が途中で申請を断念した。',
      '承認プロセスが複雑になるにつれて、申請を断念する申請者は減っていった。',
      '複数の申請者が途中で申請を断念したため、承認プロセスはいっそう複雑になった。',
    ],
    correctIndex: 1,
    explanation:
      'So + 形容詞 + be動詞 + S の倒置で so ... that 構文(あまりに〜なので…)。convoluted = 「入り組んだ・複雑な」。因果は「プロセスが複雑→申請者が断念」であり、逆に読まないことが鍵。',
  },
  {
    id: 'exp-ej-011',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'The initiative, ambitious though it undoubtedly is, hinges on funding that has yet to be secured.',
    options: [
      'その構想は野心的とは言い難いが、すでに確保された資金に支えられている。',
      'その構想は疑いなく野心的なので、資金はまだ確保される必要がない。',
      'その構想は、間違いなく野心的ではあるものの、いまだ確保されていない資金に懸かっている。',
      'その構想が野心的かどうかは疑わしく、資金確保のめども立っていない。',
    ],
    correctIndex: 2,
    explanation:
      '形容詞 + though + S + V = 「〜ではあるものの」の譲歩倒置(補語が though の前に出る)。hinge on = 「〜次第である」。have yet to be secured = 「まだ確保されていない」で、already(すでに)の意味ではない。',
  },
  {
    id: 'exp-ej-012',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'Hardly had the spokesperson finished her statement when reporters began pressing her on the undisclosed settlement.',
    options: [
      '広報担当者が声明をほとんど読み終えられなかったので、記者たちは和解内容の公開を求め始めた。',
      '広報担当者が声明を終えたとき、記者たちはすでに和解内容について問い詰め終えていた。',
      '広報担当者は声明を終えた後、記者たちに非公開の和解内容を自ら説明し始めた。',
      '広報担当者が声明を読み終えるか終えないかのうちに、記者たちは非公開の和解内容について彼女を問い詰め始めた。',
    ],
    correctIndex: 3,
    explanation:
      'Hardly had S 過去分詞 when 〜 = 「〜するかしないかのうちに…」。hardly を「ほとんど〜できなかった」と単純な否定で読むのは誤り。press A on B = 「AにBについて問い詰める」。undisclosed = 非公開の。',
  },
  {
    id: 'exp-ej-013',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'But for the backup generator, the entire cold-storage facility would have been compromised during the outage.',
    options: [
      '非常用発電機がなければ、停電の間に冷蔵施設全体が駄目になっていただろう。',
      '非常用発電機があったにもかかわらず、停電の間に冷蔵施設全体が駄目になった。',
      '非常用発電機のせいで、停電の間に冷蔵施設全体が損なわれた。',
      '非常用発電機はあったが、停電とは無関係に冷蔵施設全体が駄目になった。',
    ],
    correctIndex: 0,
    explanation:
      'But for 〜 = 「〜がなかったら」(= if it had not been for 〜)。逆接の but と読み違えると意味が反転する。would have been compromised は仮定法過去完了で、実際には発電機のおかげで無事だったことを含意する。compromise = (機能・安全を)損なう。',
  },
  {
    id: 'exp-ej-014',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The revised guidelines are no more practical than the ones they were meant to replace.',
    options: [
      '改定版ガイドラインは、置き換え対象だった旧版よりもはるかに実用的である。',
      '改定版ガイドラインは、置き換え対象だった旧版と同様に実用的ではない。',
      '改定版ガイドラインは、もはや旧版を置き換えるほど実用的ではない。',
      '改定版ガイドラインが実用的でない以上、旧版を置き換えることはできない。',
    ],
    correctIndex: 1,
    explanation:
      'A is no more X than B = 「AはBと同様にXでない」(クジラ構文)。比較しているのは実用性の欠如で、旧版も新版も等しく実用的でないと述べている。no longer(もはや〜ない)との混同、単純な比較級としての誤読が典型的なひっかけ。',
  },
  {
    id: 'exp-ej-015',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'Managers cannot be too vigilant when granting access to customer records.',
    options: [
      '管理職は、顧客記録へのアクセスを許可する際、過度に警戒すべきではない。',
      '管理職は、顧客記録へのアクセスを許可する際、警戒しすぎて判断を誤ることがある。',
      '管理職は、顧客記録へのアクセスを許可する際、どれほど警戒してもしすぎることはない。',
      '管理職は、顧客記録へのアクセスを許可しないよう、細心の注意を払っている。',
    ],
    correctIndex: 2,
    explanation:
      'cannot 〜 too ... = 「どれほど…してもしすぎることはない」。「過度に〜できない・すべきでない」という文字どおりの読みが最頻出の誤読で、意味が正反対になる。vigilant = 警戒を怠らない。grant access to 〜 = 〜へのアクセスを許可する。',
  },
  {
    id: 'exp-ej-016',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'The subsidiary lacks the resources to sustain its current operations, let alone fund an expansion into new markets.',
    options: [
      'その子会社は現在の事業を維持できないため、新市場進出だけに資源を集中させている。',
      'その子会社は現在の事業を維持する資源を欠いているが、新市場進出への資金だけは確保している。',
      'その子会社は、新市場進出に単独で資金を出せるだけの資源を欠いている。',
      'その子会社には現在の事業を維持する資源すらなく、まして新市場進出に資金を出す余裕などない。',
    ],
    correctIndex: 3,
    explanation:
      'let alone 〜 = 「まして〜は言うまでもない」。否定的な内容を受けて、より実現困難な事柄を追加する。alone を「単独で」と読んだり、let を「させる」と読んだりすると全体の論理が崩れる。sustain = 維持する、fund = 〜に資金を出す。',
  },
  {
    id: 'exp-ej-017',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'It remains to be seen whether the cost savings achieved this quarter can be sustained over the longer term.',
    options: [
      '今四半期に達成されたコスト削減は、長期的に維持されることがすでに確認されている。',
      '今四半期に達成されたコスト削減を長期的に維持できるかどうかは、まだ分からない。',
      '今四半期に達成されたコスト削減は、長期的には維持できないと見られている。',
      '今四半期のコスト削減が達成されたかどうかは、今後の調査で明らかになる。',
    ],
    correctIndex: 1,
    explanation:
      'It remains to be seen whether 〜 = 「〜かどうかはまだ分からない・今後を見守る必要がある」。remain を「維持される」と直訳したり、確定した見通しとして読むのが典型的な誤り。sustain = 維持する、over the longer term = 長期にわたって。',
  },
  {
    id: 'exp-ej-018',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'Few of the proposed amendments, if any, are expected to survive the legal review.',
    options: [
      '提案された修正条項は、あるとしてもごくわずかしか法務審査を通過しないと見られる。',
      '提案された修正条項のうちいくつかは、法務審査を通過すると期待されている。',
      '提案された修正条項は、もしあれば、そのほとんどが法務審査を通過する見込みだ。',
      '提案された修正条項が少ないため、法務審査は実施されない見通しだ。',
    ],
    correctIndex: 0,
    explanation:
      'few = 「ほとんどない」(否定的)、if any = 「あるとしても」の挿入句で否定を強める。a few(いくつかある)との混同が最大の罠。survive the review = 審査を通過して生き残る。',
  },
  {
    id: 'exp-ej-019',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      "The rollout stalled for several reasons, not least the abrupt resignation of the project's lead engineer.",
    options: [
      '展開が滞った理由はいくつかあるが、主任エンジニアの突然の辞任は最も小さな要因だった。',
      '展開はいくつかの理由で滞ったが、とりわけ大きかったのは主任エンジニアの突然の辞任である。',
      '主任エンジニアの突然の辞任を除けば、展開が滞る理由はほとんどなかった。',
      '展開が滞ったため、主任エンジニアはやむなく突然辞任した。',
    ],
    correctIndex: 1,
    explanation:
      'not least = 「とりわけ・特に」(litotes=緩叙法で、「最も小さくない」→「特に重要」)。文字どおり「最も小さい」と読むと重要度が反転する。stall = 停滞する、abrupt = 突然の。因果関係の向き(辞任→停滞)にも注意。',
  },
  {
    id: 'exp-ej-020',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'A single misquoted figure marred an otherwise impeccable annual report.',
    options: [
      '誤引用された数値は一つだけだったので、年次報告書は完璧なままだった。',
      'たった一つの誤引用された数値が、例年どおり完璧な年次報告書を台無しにした。',
      '一つの数値の誤引用に加えて別の問題もあり、年次報告書は完璧とは言えなかった。',
      'たった一つの誤引用された数値が、それ以外は非の打ちどころのない年次報告書に傷をつけた。',
    ],
    correctIndex: 3,
    explanation:
      'otherwise + 形容詞 = 「その点を除けば〜な」。an otherwise impeccable report = その一点がなければ完璧だった報告書。otherwise を「例年どおり」「その他にも」と読むのは誤り。mar = 〜を損なう・傷をつける。misquote = 誤って引用する。',
  },
  {
    id: 'exp-ej-021',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'Demand outstripped supply, so much so that the retailer imposed a limit of two units per customer.',
    options: [
      '需要は供給を上回ったものの、小売店が1人2点までの購入制限を課すほどではなかった。',
      '供給が需要を上回ったため、小売店は1人2点までの購入制限を撤廃した。',
      '需要が供給を上回り、その程度が甚だしかったため、小売店は1人2点までの購入制限を課した。',
      '小売店が1人2点までの購入制限を課したことで、需要はさらに供給を上回った。',
    ],
    correctIndex: 2,
    explanation:
      'so much so that 〜 = 「その程度が甚だしく、〜するほどだった」。直前の内容(需要超過)の程度を強調して結果を導く。outstrip = 〜を上回る。因果の向きは「需要超過→購入制限」で、制限が需要を生んだと読むのは誤り。impose = (制限を)課す。',
  },
  {
    id: 'exp-ej-022',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'The holding company is consolidating its regional subsidiaries with a view to streamlining decision-making.',
    options: [
      '持株会社は、意思決定を効率化するという子会社側の要望を受けて、統合を見送った。',
      '持株会社は、地域子会社を統合した結果として、意思決定を効率化した。',
      '持株会社は、意思決定の効率化を視野に入れて、地域子会社を統合しつつある。',
      '持株会社は、地域子会社の眺めの良い場所に意思決定機能を集約しつつある。',
    ],
    correctIndex: 2,
    explanation:
      'with a view to -ing = 「〜する目的で・〜を見据えて」(to は前置詞なので動名詞が続く)。view を文字どおり「眺め」と読むのは論外として、目的(これから)と結果(すでに)の時間関係の取り違えが実質的な罠。consolidate = 統合する、streamline = 効率化する。',
  },
  {
    id: 'exp-ej-023',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'The tenant must remedy the breach within fourteen days, failing which the lease will be terminated without further notice.',
    options: [
      '賃貸人が14日以内に是正を怠った場合、賃借人は契約の解除を通知できる。',
      '賃借人が14日以内に違反を是正できなかったため、賃貸借契約は通知なしに解除された。',
      '賃借人は14日以内に違反を是正すれば、その後の通知により賃貸借契約を解除できる。',
      '賃借人は14日以内に違反を是正しなければならず、それを怠った場合、賃貸借契約は催告なしに解除される。',
    ],
    correctIndex: 3,
    explanation:
      'failing which = 「それを怠った場合・さもなければ」(= if the tenant fails to do so)。契約書特有の堅い接続表現。すでに起きた事実(解除された)と読むのは誤りで、あくまで条件を述べている。remedy the breach = 違反を是正する。without further notice = 催告なしに。',
  },
  {
    id: 'exp-ej-024',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The board ultimately endorsed the acquisition, though not without serious reservations.',
    options: [
      '取締役会は深刻な留保もなく、最終的に買収を承認した。',
      '取締役会は最終的に買収を承認したものの、深刻な留保がなかったわけではない。',
      '取締役会は深刻な懸念を理由に、最終的に買収の承認を見送った。',
      '取締役会は、予約が取れなかったため、買収の承認を延期した。',
    ],
    correctIndex: 1,
    explanation:
      'not without 〜 = 「〜がないわけではない」(二重否定で控えめな肯定)。承認はしたが強い懸念も残った、というニュアンス。reservation はここでは「留保・懸念」で、「予約」の意味と混同しない。endorse = 承認・支持する。',
  },
  {
    id: 'exp-ej-025',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The draft proposal, as it stands, falls short of the requirements set out in the tender documents.',
    options: [
      '提案書の草案は、現状のままでは、入札文書に定められた要件を満たしていない。',
      '提案書の草案は、立場上、入札文書に定められた要件を下回ることが許されている。',
      '提案書の草案は、入札文書の要件を満たすものとして、そのまま承認された。',
      '提案書の草案は、わずかながら入札文書の要件を上回っている。',
    ],
    correctIndex: 0,
    explanation:
      'as it stands = 「現状のままでは」の挿入句。stand を「立場」と読むのは誤り。fall short of 〜 = 「〜に達しない・〜を満たさない」で、short を「わずかに」と読んで上回る方向に取り違えないこと。set out = (文書に)定める。tender = 入札。',
  },
  {
    id: 'exp-ej-026',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'It was only when the invoices were cross-checked against the delivery records that the duplicate payments came to light.',
    options: [
      '請求書が納品記録と照合された時点では、二重払いはまだ明らかになっていなかった。',
      '請求書を納品記録と照合して初めて、二重払いが明るみに出た。',
      '二重払いが明るみに出たのは、請求書と納品記録の照合が行われなかったからだ。',
      '請求書と納品記録の照合が行われたにもかかわらず、二重払いは見逃された。',
    ],
    correctIndex: 1,
    explanation:
      'It was only when A that B = 「Aして初めてBした」の強調構文。only を「〜の時点ではまだ」と読み替えると意味が逆転する。cross-check A against B = AをBと突き合わせて照合する。come to light = 明るみに出る。',
  },
  {
    id: 'exp-ej-027',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'Much as we appreciate the thoroughness of your analysis, we are unable to extend the submission deadline.',
    options: [
      '貴殿の分析の綿密さを高く評価しているだけに、提出期限は大幅に延長いたします。',
      '貴殿の分析は評価に値しないため、提出期限を延長することはできません。',
      '貴殿の分析の綿密さは重々承知しておりますが、それでも提出期限を延長することはできません。',
      '貴殿の分析が綿密であればあるほど、提出期限の延長は難しくなります。',
    ],
    correctIndex: 2,
    explanation:
      'Much as S V = 「〜ではあるが・〜はやまやまだが」の譲歩構文。as much as の変形で、「大いに評価しているが、それでも」という流れ。程度の比例(〜であればあるほど)と読むのは誤り。extend a deadline = 期限を延長する。',
  },
  {
    id: 'exp-ej-028',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'Short of relocating the entire distribution center, the company has few viable options for cutting freight costs.',
    options: [
      '配送センターの移転が間に合わなかったため、同社は輸送費を削減できなかった。',
      '配送センター全体を移転すれば、同社の輸送費削減の選択肢は尽きてしまう。',
      '配送センター全体の移転には至らない範囲では、同社が輸送費を削減できる現実的な選択肢はほとんどない。',
      '同社は配送センターを移転した直後で、輸送費削減の選択肢を数多く持っている。',
    ],
    correctIndex: 2,
    explanation:
      'short of -ing = 「〜するまではしない範囲で・〜でもしない限り」。時間的な「不足・間に合わない」と読むのは誤り。few = ほとんどない。viable = 実行可能な。freight = 貨物輸送。「移転という極端な手段を除けば手がない」という論理を掴む。',
  },
  {
    id: 'exp-ej-029',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'For all its sophisticated forecasting models, the platform failed to anticipate the semiconductor shortage.',
    options: [
      'そのプラットフォームは、高度な予測モデルをすべて駆使して、半導体不足を予測してみせた。',
      '高度な予測モデルを備えていたにもかかわらず、そのプラットフォームは半導体不足を予測できなかった。',
      'そのプラットフォームの予測モデルはすべて高度だったので、半導体不足の予測に成功した。',
      '半導体不足のせいで、そのプラットフォームの高度な予測モデルはすべて停止した。',
    ],
    correctIndex: 1,
    explanation:
      'for all 〜 = 「〜にもかかわらず」(= despite)。「すべての〜のために」と読むと意味が反転する満点レベルの定番。fail to do = 〜できない・〜しない。anticipate = 予測する。sophisticated = 高度な・洗練された。',
  },
  {
    id: 'exp-ej-030',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt:
      'The new screening process is effective insofar as it deters casual applicants, but it does little to identify genuinely qualified candidates.',
    options: [
      '新しい選考プロセスは、適格な候補者を思いとどまらせてしまう点で逆効果である。',
      '新しい選考プロセスは、冷やかしの応募者を排除できないため、まったく機能していない。',
      '新しい選考プロセスは効果的なので、冷やかしの応募も適格な候補者の発見も両立できている。',
      '新しい選考プロセスは、冷やかしの応募者を思いとどまらせる限りにおいては有効だが、真に適格な候補者の発見にはほとんど役立っていない。',
    ],
    correctIndex: 3,
    explanation:
      'insofar as 〜 = 「〜する限りにおいて」で、有効性の範囲を限定する。全面的な肯定でも否定でもない「部分的評価」の構文。deter = 思いとどまらせる。do little to do = 〜にはほとんど役立たない(little の否定的な含みを見逃さない)。',
  },
  {
    id: 'exp-ej-031',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The redesigned interface is, if anything, harder to navigate than its predecessor.',
    options: [
      '再設計されたインターフェースは、何かあれば前のものより操作しにくくなる恐れがある。',
      '再設計されたインターフェースは、どちらかと言えばむしろ、前のものより操作しにくい。',
      '再設計されたインターフェースは、何があっても前のものより操作しやすい。',
      '再設計されたインターフェースは、前のものと比べて操作性がわずかに改善した。',
    ],
    correctIndex: 1,
    explanation:
      'if anything = 「どちらかと言えば・むしろ」の挿入句。改善が期待される文脈で「むしろ悪化している」と控えめに逆方向を示す。「何かあれば」という条件節としての読みが典型的な誤り。predecessor = 前身・先代のもの。',
  },
  {
    id: 'exp-ej-032',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'No fewer than forty suppliers submitted bids for the construction project.',
    options: [
      'その建設プロジェクトには、40社に満たない数の納入業者しか入札しなかった。',
      'その建設プロジェクトには、40社を超える納入業者の入札は認められなかった。',
      'その建設プロジェクトの入札には、ちょうど40社未満の納入業者が参加した。',
      'その建設プロジェクトには、40社もの納入業者が入札した。',
    ],
    correctIndex: 3,
    explanation:
      'no fewer than + 数 = 「〜もの(多くの)」で数の多さを強調する(= as many as)。fewer という語につられて「〜未満・〜に満たない」と読むのが最頻出の誤り。bid = 入札。submit a bid = 入札する。',
  },
  {
    id: 'exp-ej-033',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The committee has, as yet, reached no decision on the proposed rezoning.',
    options: [
      '委員会は、提案された区画変更について今のところまだ何の決定にも達していない。',
      '委員会は、提案された区画変更についてすでに決定を下した。',
      '委員会は、提案された区画変更を決定しないことをすでに決めた。',
      '委員会は、区画変更の提案そのものをまだ受け取っていない。',
    ],
    correctIndex: 0,
    explanation:
      'as yet = 「今のところまだ(〜ない)」で、否定的な文脈で使う挿入句。reached no decision = 何の決定にも達していない(no が目的語に付く否定)。「決定しないことを決めた」という積極的な決定と読み違えないこと。rezoning = 区画変更。',
  },
  {
    id: 'exp-ej-034',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The negotiations had all but collapsed by the time the mediator arrived.',
    options: [
      '調停者が到着するまでに、交渉は決裂を除いてあらゆる事態を経験していた。',
      '調停者が到着したとき、交渉はすべて決裂していた。',
      '調停者が到着するまでに、交渉は事実上決裂していた。',
      '調停者が到着したおかげで、交渉は決裂を免れた。',
    ],
    correctIndex: 2,
    explanation:
      'all but = 「ほとんど・事実上」(= almost)。「〜以外すべて」という文字どおりの読みが最大の罠。had collapsed の過去完了は調停者到着より前の完了を表す。mediator = 調停者。by the time 〜 = 〜するまでに。',
  },
  {
    id: 'exp-ej-035',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The transition to the new payroll system was anything but smooth.',
    options: [
      '新しい給与システムへの移行は、円滑さ以外のあらゆる長所を備えていた。',
      '新しい給与システムへの移行は、決して円滑とは言えないものだった。',
      '新しい給与システムへの移行は、何はともあれ円滑に完了した。',
      '新しい給与システムへの移行は、多少の混乱はあったもののおおむね円滑だった。',
    ],
    correctIndex: 1,
    explanation:
      'anything but 〜 = 「決して〜ではない」(強い否定)。all but(ほとんど)との対比が満点レベルの定番で、exp-ej-034 とセットで識別したい。「〜以外の何でも」という直訳から「円滑以外の長所」と読むのは誤り。payroll = 給与(支払い)。',
  },
  {
    id: 'exp-ej-036',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: "The plant's recovery from the flood damage was nothing short of remarkable.",
    options: [
      '工場の水害からの復旧ぶりは、まさに驚嘆に値するものだった。',
      '工場の水害からの復旧は、注目されるほどのものではなかった。',
      '工場の水害からの復旧には、驚くほど資材が不足していた。',
      '工場は水害からの復旧が遅れ、稼働には程遠い状態だった。',
    ],
    correctIndex: 0,
    explanation:
      'nothing short of 〜 = 「まさに〜そのもの・〜以外の何物でもない」(強い肯定の強調)。short(不足)につられて「足りない・及ばない」と否定方向に読むのが典型的な誤り。remarkable = 驚くべき・注目に値する。',
  },
  {
    id: 'exp-ej-037',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'Given the legal fees involved, the firm might as well handle the trademark filing in-house.',
    options: [
      '弁護士費用を考えると、その会社は商標出願を社内で処理することもできたはずだ。',
      '弁護士費用がかかるにもかかわらず、その会社は商標出願を社内で処理するだろう。',
      '弁護士費用を考えても、その会社が商標出願を社内で処理するのは不可能に近い。',
      '弁護士費用を考えると、その会社は商標出願を社内で処理した方がよいくらいだ。',
    ],
    correctIndex: 3,
    explanation:
      'might as well do = 「(どうせなら)〜した方がよい・〜するのも同然だ」。外注しても費用がかさむなら社内でやるのが合理的、という消極的な推奨を表す。可能性(could)や過去の可能(できたはずだ)と読み違えない。in-house = 社内で。filing = 出願・提出。',
  },
  {
    id: 'exp-ej-038',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'In the absence of any objection, the minutes of the previous meeting will be deemed approved.',
    options: [
      '欠席者から異議が出たため、前回の議事録は承認されなかった。',
      '異議の有無にかかわらず、前回の議事録は承認されたものとみなされる。',
      '異議がなければ、前回の会議の議事録は承認されたものとみなされる。',
      '異議が出ない限り、前回の議事録の承認は見送られる。',
    ],
    correctIndex: 2,
    explanation:
      'in the absence of 〜 = 「〜がない場合には」。absence を「欠席」と読んで欠席者の話にすり替えるのが典型的な誤り。be deemed + 過去分詞 = 「〜されたものとみなされる」(deem = みなす)。議事運営の定型文。minutes = 議事録。',
  },
  {
    id: 'exp-ej-039',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The publisher is under no obligation to accept manuscripts submitted after the deadline.',
    options: [
      '出版社は、締め切り後に提出された原稿を受理する義務を一切負わない。',
      '出版社は、締め切り後に提出された原稿を受理してはならない。',
      '出版社は、義務ではないものの、締め切り後の原稿もすべて受理している。',
      '出版社は、締め切り後の原稿を受理しないという義務を負っている。',
    ],
    correctIndex: 0,
    explanation:
      'be under no obligation to do = 「〜する義務を一切負わない」。義務がないだけで「受理してはならない(禁止)」でも「受理しない義務がある」でもない、という否定の射程の読み取りが鍵。manuscript = 原稿。',
  },
  {
    id: 'exp-ej-040',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'Clearing the regulatory hurdles will take weeks, if not months.',
    options: [
      '規制上のハードルの通過には、数か月とは言わないまでも数週間はかかる見込みだ。',
      '規制上のハードルの通過には数週間、下手をすれば数か月かかる見込みだ。',
      '規制上のハードルは、数週間ないし数か月以内に撤廃される見込みだ。',
      '規制上のハードルの通過が数週間で済むなら、数か月かかることはない。',
    ],
    correctIndex: 1,
    explanation:
      'A, if not B = 「Aは確実で、もしかするとBかもしれない」と上方修正の含みを持つ挿入句(weeks, if not months = 数週間、場合によっては数か月)。「Bとは言わないまでもA」という控えめ方向の訳は、この文脈では程度が逆になる点に注意。',
  },
  {
    id: 'exp-ej-041',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: "The campaign's success was due in no small part to the volunteers who staffed the phone lines.",
    options: [
      'キャンペーンの成功は、電話対応を担ったボランティアとはほとんど無関係だった。',
      'キャンペーンの成功にもかかわらず、電話対応のボランティアはわずかしか評価されなかった。',
      'キャンペーンの成功は、電話対応を担ったボランティアに負うところが少なくなかった。',
      'キャンペーンが小規模ながら成功したのは、電話対応のボランティアのおかげだった。',
    ],
    correctIndex: 2,
    explanation:
      'in no small part = 「少なからず・大いに」(緩叙法で、not least と同系)。no small = 「小さくない」→「大きい」という二重否定的な強調を読み取る。「小規模ながら」と part を規模の話に読み替えるのは誤り。staff(動詞) = 〜に人員として詰める。',
  },
  {
    id: 'exp-ej-042',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The delivery records are at odds with the quantities listed on the invoices.',
    options: [
      '納品記録は、請求書に記載された数量と奇数個ずれている。',
      '納品記録は、請求書に記載された数量ときっちり一致している。',
      '納品記録は、請求書に記載された数量に対して優位にある。',
      '納品記録は、請求書に記載された数量と食い違っている。',
    ],
    correctIndex: 3,
    explanation:
      'be at odds with 〜 = 「〜と食い違っている・矛盾している」。odds を「奇数(odd numbers)」や賭けの「オッズ(勝算)」と結びつけた読みが典型的なひっかけ。invoice = 請求書。quantity = 数量。監査・検品の文脈で頻出。',
  },
  {
    id: 'exp-ej-043',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'By virtue of its long-standing presence in the region, the distributor enjoys considerable brand loyalty.',
    options: [
      'その販売代理店は、地域に長年根を下ろしてきたことにより、相当なブランド愛顧を得ている。',
      'その販売代理店は、美徳を重んじる経営により、地域で高い評価を得ている。',
      'その販売代理店は、地域に長くいたにもかかわらず、ブランドへの愛着をほとんど得られていない。',
      'その販売代理店は、地域での存在感を高めるために、ブランド愛顧を活用している。',
    ],
    correctIndex: 0,
    explanation:
      'by virtue of 〜 = 「〜のおかげで・〜により」。virtue を「美徳」と文字どおり読むのが定番の誤り。enjoy はここでは「(利益・地位を)享受する」で「楽しむ」ではない。long-standing = 長年にわたる。considerable = 相当な。',
  },
  {
    id: 'exp-ej-044',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The objections of several board members notwithstanding, the restructuring plan was ratified.',
    options: [
      '数名の取締役の異議が認められたため、再建計画は否決された。',
      '数名の取締役の異議にもかかわらず、再建計画は承認された。',
      '数名の取締役は異議を唱えなかったので、再建計画は承認された。',
      '再建計画が承認されなかったのは、数名の取締役の異議のせいである。',
    ],
    correctIndex: 1,
    explanation:
      'notwithstanding は前置詞でありながら名詞句の後ろに置ける(後置用法)のが特徴で、The objections ... notwithstanding = 「異議にもかかわらず」。文頭に来る通常用法(exp-fb-001)との対比で満点レベル。ratify = 批准・承認する。',
  },
  {
    id: 'exp-ej-045',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The consultant went so far as to recommend suspending all payments to the vendor pending a full audit.',
    options: [
      'コンサルタントは遠方まで出向いて、そのベンダーへの支払い状況を監査した。',
      'コンサルタントは、全面監査の間もそのベンダーへの支払いを続けるよう勧めた。',
      'コンサルタントの勧告は、そのベンダーへの支払い停止にはさすがに踏み込まなかった。',
      'コンサルタントは、全面監査が終わるまでそのベンダーへの支払いをすべて停止するようにとまで勧告した。',
    ],
    correctIndex: 3,
    explanation:
      'go so far as to do = 「〜しさえする・〜するところまで踏み込む」。far を物理的な距離と読むのは誤り。pending + 名詞 = 「〜を待つ間」(exp-fb-021 の前置詞用法)。suspend = 一時停止する。踏み込んだ勧告の程度を読み取る。',
  },
  {
    id: 'exp-ej-046',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The headquarters was deserted save for a handful of security personnel on the night shift.',
    options: [
      '本社は、夜勤の警備員数名を守るために封鎖されていた。',
      '本社は、夜勤の警備員数名の尽力のおかげで無人化を免れた。',
      '本社は、夜勤の警備員数名を除いて無人だった。',
      '本社では、警備員数名が夜勤を怠ったため無人になっていた。',
    ],
    correctIndex: 2,
    explanation:
      'save for 〜 = 「〜を除いて」(= except for)。save を「救う・守る」という動詞で読むのが最大の罠。deserted = 人けのない・無人の。a handful of = 一握りの。personnel = 職員・人員(単複同形で人の集合を表す)。',
  },
  {
    id: 'exp-ej-047',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The subcontractor altered the specifications without so much as consulting the project manager.',
    options: [
      'その下請け業者は、プロジェクトマネージャーに相談すらせずに仕様を変更した。',
      'その下請け業者は、プロジェクトマネージャーに相談した上で仕様を大きく変更した。',
      'その下請け業者は、仕様変更についてプロジェクトマネージャーと同程度の権限を持っていた。',
      'その下請け業者は、プロジェクトマネージャーに相談したものの、仕様はほとんど変更しなかった。',
    ],
    correctIndex: 0,
    explanation:
      'without so much as -ing = 「〜すらせずに」(最低限期待される行為さえ省いたことへの非難を含む)。not so much A as B(exp-fb-019)と形が似るが別の構文である点が満点レベル。subcontractor = 下請け業者。alter = 変更する。',
  },
  {
    id: 'exp-ej-048',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The moment the import restrictions were lifted, orders from overseas began pouring in.',
    options: [
      '輸入制限が解除される直前に、海外からの注文は途絶えた。',
      '輸入制限が解除されるやいなや、海外からの注文が殺到し始めた。',
      '輸入制限が解除されてからしばらくして、海外からの注文が徐々に増え始めた。',
      '海外からの注文が殺到したため、輸入制限はただちに解除された。',
    ],
    correctIndex: 1,
    explanation:
      'the moment + S + V = 「〜するやいなや」(接続詞的用法。= as soon as)。lift = (制限・禁止を)解除する。pour in = 殺到する。因果の向きは「解除→殺到」で、逆に読まない。時間差(しばらくして・徐々に)を入れた選択肢もひっかけ。',
  },
  {
    id: 'exp-ej-049',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'On the strength of the pilot program\'s results, the ministry approved a nationwide rollout.',
    options: [
      'パイロット事業は困難の連続だったが、省は全国展開を強行した。',
      'パイロット事業の結果が力強かったにもかかわらず、省は全国展開を見送った。',
      'パイロット事業の結果を根拠として、省は全国展開を承認した。',
      'パイロット事業の強度試験の結果を受けて、省は全国展開を延期した。',
    ],
    correctIndex: 2,
    explanation:
      'on the strength of 〜 = 「〜を根拠に・〜を頼みにして」。strength を物理的な「強度」や「力強さ」と読むのが典型的な誤り。rollout = (サービス・製品の)展開・投入。ministry = 省庁。approve = 承認する。',
  },
  {
    id: 'exp-ej-050',
    genre: 'en-ja',
    difficulty: 'expert',
    prompt: 'The efficiency gains from automation came at the expense of employee morale.',
    options: [
      '自動化による効率向上は、従業員の士気を犠牲にして得られたものだった。',
      '自動化による効率向上は、従業員の経費精算の負担を軽減した。',
      '自動化の費用は、従業員の士気向上によって埋め合わされた。',
      '自動化は高くついたものの、効率と従業員の士気の両方を向上させた。',
    ],
    correctIndex: 0,
    explanation:
      'at the expense of 〜 = 「〜を犠牲にして」。expense を文字どおり「経費・費用」と読むのが最大の罠。gain = 向上・利得。morale = 士気(moral「道徳」との識別も定番)。トレードオフの関係を正しく読み取る。',
  },
  // ---------------------------------------------------------------------------
  // listening(仮定法倒置・分詞構文・長い挿入句を含むやや長めの音声英文。
  //           誤答肢は聞き間違いで生じる解釈)
  // ---------------------------------------------------------------------------
  {
    id: 'exp-ls-001',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Had it not been for the prompt intervention of the support team, the outage would have lasted considerably longer.',
    audioText:
      'Had it not been for the prompt intervention of the support team, the outage would have lasted considerably longer.',
    options: [
      'サポートチームの迅速な対応がなければ、障害はかなり長引いていただろう。',
      'サポートチームの対応が遅れたため、障害はかなり長引いた。',
      'サポートチームが介入したにもかかわらず、障害は長引いた。',
      'サポートチームの対応により、障害は直ちに解消された。',
    ],
    correctIndex: 0,
    explanation:
      'Had it not been for 〜 は If it had not been for 〜(〜がなかったら)の倒置形。仮定法過去完了の聞き取りは満点レベルの定番で、冒頭の Had を聞き逃すと意味が反転する。',
  },
  {
    id: 'exp-ls-002',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Barring any unforeseen complications, the renovation of the west wing should be completed by the end of March.',
    audioText:
      'Barring any unforeseen complications, the renovation of the west wing should be completed by the end of March.',
    options: [
      '不測の事態が起きたため、西棟の改修は3月末以降にずれ込む見込みだ。',
      '不測の事態がなければ、西棟の改修は3月末までに完了するはずだ。',
      '西棟の改修では不測の問題が見つかり、3月末の完了は取りやめになった。',
      '西棟の改修は、3月末までに完了するよう禁止事項を設けて進められている。',
    ],
    correctIndex: 1,
    explanation:
      'barring 〜 = 「〜がなければ・〜を除けば」(前置詞)。動詞 bar(禁じる)と聞き違えると「禁止」の解釈に流れる。should はここでは「〜するはずだ」の見込み。unforeseen = 予期しない。',
  },
  {
    id: 'exp-ls-003',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The keynote speaker, having been delayed by a connecting flight, will now address the audience after the luncheon instead of before it.',
    audioText:
      'The keynote speaker, having been delayed by a connecting flight, will now address the audience after the luncheon instead of before it.',
    options: [
      '基調講演者は乗継便に遅れたため、昼食会での講演は中止になった。',
      '基調講演者は予定より早く到着したので、昼食会の前に講演を行うことになった。',
      '基調講演者は乗継便の遅れの影響で、昼食会の前ではなく後に聴衆に講演することになった。',
      '基調講演者の講演が長引いたため、昼食会は講演の後に延期された。',
    ],
    correctIndex: 2,
    explanation:
      'having been delayed は完了受動の分詞構文で「(乗継便の遅れで)到着が遅れたので」。after the luncheon instead of before it から「前ではなく後」という変更内容を正確に聞き取る。address = 〜に向けて話す。',
  },
  {
    id: 'exp-ls-004',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Were the board to reject the revised proposal, the negotiations would, in all likelihood, have to start over from scratch.',
    audioText:
      'Were the board to reject the revised proposal, the negotiations would, in all likelihood, have to start over from scratch.',
    options: [
      '取締役会が修正案を否決したため、交渉は一からやり直しになった。',
      '取締役会は修正案を承認したので、交渉をやり直す必要はなくなった。',
      '取締役会が修正案を検討している間、交渉は中断される可能性が高い。',
      '仮に取締役会が修正案を否決するようなことがあれば、交渉は十中八九、一からやり直しになるだろう。',
    ],
    correctIndex: 3,
    explanation:
      'Were S to do = If S were to do(仮に〜するとしたら)の倒置で、実現可能性の低い未来の仮定。過去の事実と混同しない。in all likelihood(十中八九)は挿入句。start over from scratch = 一からやり直す。',
  },
  {
    id: 'exp-ls-005',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'All visitors, regardless of whether they hold a permanent badge, are required to sign in at the security desk upon arrival.',
    audioText:
      'All visitors, regardless of whether they hold a permanent badge, are required to sign in at the security desk upon arrival.',
    options: [
      'すべての来訪者は、常時入館証の有無にかかわらず、到着時に警備デスクで記帳しなければならない。',
      '常時入館証を持つ来訪者は、警備デスクでの記帳を免除される。',
      '来訪者は、常時入館証を持っている場合に限り、警備デスクで記帳できる。',
      'すべての来訪者は、到着前に警備デスクに入館証を返却するよう求められる。',
    ],
    correctIndex: 0,
    explanation:
      'regardless of whether 〜 = 「〜かどうかにかかわらず」の長い挿入句。ここを聞き逃すと入館証保持者が免除されると誤解する。be required to do = 〜しなければならない。upon arrival = 到着時に。',
  },
  {
    id: 'exp-ls-006',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Not only did the new filtration system cut operating costs, but it also brought the plant into compliance with the revised emissions standards.',
    audioText:
      'Not only did the new filtration system cut operating costs, but it also brought the plant into compliance with the revised emissions standards.',
    options: [
      '新しいろ過システムは運転コストを削減したものの、改定後の排出基準には適合しなかった。',
      '新しいろ過システムは運転コストを削減しただけでなく、工場を改定後の排出基準にも適合させた。',
      '新しいろ過システムは運転コストを増加させたが、排出基準への適合には役立った。',
      '新しいろ過システムの導入だけでは、コスト削減も排出基準への適合も実現しなかった。',
    ],
    correctIndex: 1,
    explanation:
      'Not only did S V, but S also 〜 = 「〜しただけでなく…も」の倒置構文。冒頭の Not を単純な否定と聞き違えると意味が反転する。bring A into compliance with B = AをBに適合させる。',
  },
  {
    id: 'exp-ls-007',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The quarterly report, which had initially projected a modest surplus, was quietly revised downward after the auditors flagged several irregularities.',
    audioText:
      'The quarterly report, which had initially projected a modest surplus, was quietly revised downward after the auditors flagged several irregularities.',
    options: [
      '四半期報告書は当初の予想どおり小幅な黒字となり、監査人の指摘後に上方修正された。',
      '監査人が不備を指摘したにもかかわらず、四半期報告書の黒字予想は据え置かれた。',
      '当初は小幅な黒字を見込んでいた四半期報告書は、監査人が複数の不備を指摘した後、ひっそりと下方修正された。',
      '四半期報告書は大幅な赤字を見込んでいたが、監査の結果、黒字に修正された。',
    ],
    correctIndex: 2,
    explanation:
      'which had initially projected a modest surplus は挿入された非制限関係詞節。「黒字を見込んでいた→不備の指摘→下方修正」という時系列を聞き取る。revise downward = 下方修正する、flag = (問題を)指摘する。',
  },
  {
    id: 'exp-ls-008',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Had the contractor adhered to the original specifications, the costly rework that delayed the opening by two months could have been avoided.',
    audioText:
      'Had the contractor adhered to the original specifications, the costly rework that delayed the opening by two months could have been avoided.',
    options: [
      '請負業者が当初の仕様を順守したため、手直しは避けられ、開業は2か月早まった。',
      '請負業者は当初の仕様を順守していたが、それでも手直しにより開業は2か月遅れた。',
      '請負業者が仕様の変更に同意しなかったため、開業は2か月延期された。',
      '請負業者が当初の仕様を順守していれば、開業を2か月遅らせた高くつく手直しは避けられたはずだ。',
    ],
    correctIndex: 3,
    explanation:
      'Had S 過去分詞 = If S had 過去分詞(仮定法過去完了)の倒置。実際には順守せず、手直しが発生して開業が2か月遅れた、という事実の裏返しを聞き取る。adhere to = 〜を順守する。rework = 手直し。',
  },
  {
    id: 'exp-ls-009',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Given how saturated the domestic market has become, the firm has little alternative but to seek growth overseas, however daunting that prospect may seem.',
    audioText:
      'Given how saturated the domestic market has become, the firm has little alternative but to seek growth overseas, however daunting that prospect may seem.',
    options: [
      '国内市場がこれほど飽和した以上、その見通しがどれほど困難に思えようとも、同社には海外に成長を求めるほかほとんど選択肢がない。',
      '国内市場にはまだ余地があるため、同社は困難な海外進出を見送ることにした。',
      '同社は国内市場の飽和を理由に、海外での成長をあきらめた。',
      '国内市場が飽和しているにもかかわらず、同社には国内で成長する選択肢が数多くある。',
    ],
    correctIndex: 0,
    explanation:
      'given how 〜 = 「どれほど〜かを考えると」。have little alternative but to do = 「〜するほかない」。文末の however daunting that prospect may seem は「その見通しがどれほど困難に見えても」という譲歩の挿入節。',
  },
  {
    id: 'exp-ls-010',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      "The memo stipulates that expense reports submitted after the fifteenth will not be reimbursed until the following month's payroll cycle.",
    audioText:
      "The memo stipulates that expense reports submitted after the fifteenth will not be reimbursed until the following month's payroll cycle.",
    options: [
      'そのメモには、15日までに提出された経費報告書は精算されないと書かれている。',
      'そのメモには、15日より後に提出された経費報告書は翌月の給与サイクルまで精算されないと明記されている。',
      'そのメモには、経費報告書は毎月15日に必ず精算されると明記されている。',
      'そのメモには、翌月の給与から経費が差し引かれると示唆されている。',
    ],
    correctIndex: 1,
    explanation:
      'submitted after the fifteenth は expense reports を後置修飾する分詞句で「15日より後に提出された」。not ... until 〜 = 「〜まで…されない」。stipulate = (規則などに)明記する。reimburse = 精算・払い戻す。',
  },
  {
    id: 'exp-ls-011',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Scarcely had the maintenance crew restored power to the assembly line when a second, unrelated fault brought production to a standstill once again.',
    audioText:
      'Scarcely had the maintenance crew restored power to the assembly line when a second, unrelated fault brought production to a standstill once again.',
    options: [
      '保守班が電力をほとんど復旧できなかったため、生産は停止したままだった。',
      '保守班が電力を復旧させた後、しばらくしてから関連する不具合が再発した。',
      '保守班が組立ラインの電力を復旧させるかさせないかのうちに、無関係の2件目の不具合で生産は再び停止した。',
      '2件目の不具合が起きる前に、保守班は生産を完全に再開させていた。',
    ],
    correctIndex: 2,
    explanation:
      'Scarcely had S 過去分詞 when 〜 = 「〜するかしないかのうちに…」の倒置。scarcely を「ほとんど復旧できなかった」と聞き違えない。second, unrelated fault = 無関係な2件目の不具合。bring A to a standstill = Aを停止させる。',
  },
  {
    id: 'exp-ls-012',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The board, mindful of the reputational damage a prolonged dispute could inflict, opted to settle the matter out of court, albeit on undisclosed terms.',
    audioText:
      'The board, mindful of the reputational damage a prolonged dispute could inflict, opted to settle the matter out of court, albeit on undisclosed terms.',
    options: [
      '取締役会は評判への打撃を恐れず、裁判で争うことを選び、その条件を公開した。',
      '取締役会は紛争の長期化を選び、和解条件の開示を裁判所に求めた。',
      '取締役会は裁判外での和解を提案されたが、条件が非公開であることを理由に拒否した。',
      '取締役会は、紛争の長期化がもたらしかねない評判への打撃を考慮し、条件は非公開ながらも裁判外で和解することを選んだ。',
    ],
    correctIndex: 3,
    explanation:
      'mindful of 〜(〜を考慮して)と albeit on undisclosed terms(条件は非公開ながら)という二つの挿入句を正しく処理するのが鍵。settle out of court = 裁判外で和解する。opt to do = 〜することを選ぶ。',
  },
  {
    id: 'exp-ls-013',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Should you require any further assistance, please do not hesitate to contact our support desk, which is staffed around the clock.',
    audioText:
      'Should you require any further assistance, please do not hesitate to contact our support desk, which is staffed around the clock.',
    options: [
      'さらにサポートが必要な場合は、24時間体制のサポートデスクへ遠慮なくご連絡ください。',
      'サポートデスクは時計の周りに設置されているため、いつでもご連絡いただけます。',
      'サポートが必要になることはまずないため、サポートデスクへの連絡はお控えください。',
      'サポートデスクの営業時間内に限り、追加のサポートを依頼できます。',
    ],
    correctIndex: 0,
    explanation:
      'Should you require 〜 = If you should require 〜(万一必要なら)の倒置。around the clock = 「24時間休みなく」の慣用句で、文字どおり「時計の周り」ではない。be staffed = 人員が配置されている。do not hesitate to do = 遠慮なく〜する。',
  },
  {
    id: 'exp-ls-014',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Rarely has the steering committee reached a unanimous decision as swiftly as it did this morning.',
    audioText: 'Rarely has the steering committee reached a unanimous decision as swiftly as it did this morning.',
    options: [
      '運営委員会は今朝、いつものように速やかに全会一致の決定に達した。',
      '運営委員会が今朝ほど速やかに全会一致の決定に達したことは、めったにない。',
      '運営委員会は今朝、めったにないことだが、決定に達することができなかった。',
      '運営委員会の今朝の決定は、賛否が割れたため時間がかかった。',
    ],
    correctIndex: 1,
    explanation:
      '否定の副詞 Rarely が文頭に立ち has the committee reached と倒置した形。「今朝の速さは異例だった」という趣旨で、決定できなかったわけではない。unanimous = 全会一致の。swiftly = 速やかに。as ... as it did this morning = 今朝と同じくらい。',
  },
  {
    id: 'exp-ls-015',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The training session originally scheduled for Thursday has been moved up to Tuesday, not postponed as some staff had assumed.',
    audioText:
      'The training session originally scheduled for Thursday has been moved up to Tuesday, not postponed as some staff had assumed.',
    options: [
      '木曜予定だった研修は延期になったと一部の職員が正しく推測していた。',
      '研修は木曜から火曜に前倒しされたが、その後さらに延期された。',
      '木曜に予定されていた研修は火曜に前倒しされたのであり、一部の職員の思い込みとは違って延期されたのではない。',
      '火曜に予定されていた研修は、職員の要望により木曜に延期された。',
    ],
    correctIndex: 2,
    explanation:
      'move up = 「(日程を)前倒しする」で、postpone(延期する)の対義。not postponed as some staff had assumed = 「一部職員の思い込みと違って延期ではない」。日付の方向(木→火)と、assumed が「誤った思い込み」である点の両方を聞き取る。',
  },
  {
    id: 'exp-ls-016',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Unless instructed otherwise, all contractors should report to the north gate, where temporary badges will be issued.',
    audioText:
      'Unless instructed otherwise, all contractors should report to the north gate, where temporary badges will be issued.',
    options: [
      '別段の指示がない限り、請負業者は全員北門に出頭し、そこで臨時バッジの発行を受ける。',
      '請負業者は指示の有無にかかわらず、臨時バッジを持って北門から退出しなければならない。',
      '別段の指示があったため、請負業者は北門ではなく別の場所に出頭することになった。',
      '北門では臨時バッジが発行されないため、請負業者は事前に指示を受ける必要がある。',
    ],
    correctIndex: 0,
    explanation:
      'unless instructed otherwise = 「別段の指示がない限り」(unless you are instructed otherwise の省略)。report to 〜 = 「〜に出頭する・出向く」で「報告する」だけではない。関係副詞 where 以下が北門で起きること(バッジ発行)を補足する。',
  },
  {
    id: 'exp-ls-017',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The facilities manager asked that the projector be left connected, as the afternoon workshop would begin immediately after lunch.',
    audioText:
      'The facilities manager asked that the projector be left connected, as the afternoon workshop would begin immediately after lunch.',
    options: [
      '施設管理者は、昼食の間はプロジェクターの接続を外しておくよう求めた。',
      '施設管理者は、午後のワークショップが昼食後すぐに始まるため、プロジェクターを接続したままにしておくよう求めた。',
      '施設管理者がプロジェクターを置き忘れたため、午後のワークショップの開始が遅れた。',
      '施設管理者は、午後のワークショップが終わり次第、プロジェクターを撤去するよう求めた。',
    ],
    correctIndex: 1,
    explanation:
      'ask that + S + 動詞の原形(仮定法現在)= 「〜するよう求める」。be left connected = 「接続されたままにされる」(leave + O + 過去分詞の受動形)。理由を表す as 節(昼食後すぐ始まるから)との組み合わせを聞き取る。',
  },
  {
    id: 'exp-ls-018',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Despite earlier reports to the contrary, the downtown branch will remain open through the end of the fiscal year.',
    audioText:
      'Despite earlier reports to the contrary, the downtown branch will remain open through the end of the fiscal year.',
    options: [
      '以前の報道どおり、中心街の支店は会計年度末をもって閉鎖される。',
      '以前は閉鎖と報じられていたが、それとは逆に、中心街の支店は会計年度末まで営業を続ける。',
      '中心街の支店は、相次ぐ報道を受けて、会計年度の途中で閉鎖されることになった。',
      '中心街の支店が営業を続けるかどうかは、会計年度末の報告で明らかになる。',
    ],
    correctIndex: 1,
    explanation:
      'reports to the contrary = 「それとは逆の(=閉鎖するという)報道」。to the contrary を聞き逃すと「報道どおり」と正反対に解釈してしまう。remain open = 営業を続ける。through the end of 〜 = 〜の末まで(期間の終点を含む)。',
  },
  {
    id: 'exp-ls-019',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'No refunds will be issued unless the merchandise is returned unopened within seven days of delivery.',
    audioText:
      'No refunds will be issued unless the merchandise is returned unopened within seven days of delivery.',
    options: [
      '商品は開封済みでも、配達から7日以内であれば返金される。',
      '配達から7日を過ぎても、商品が未開封であれば返金される。',
      '商品が配達から7日以内に未開封のまま返品されない限り、返金は行われない。',
      '返金はいかなる場合も行われず、商品の返品も受け付けられない。',
    ],
    correctIndex: 2,
    explanation:
      'No refunds ... unless 〜 = 「〜しない限り返金しない」。返金の条件は「未開封(unopened)」と「7日以内(within seven days)」の両方で、どちらか一方でも欠けると返金されない。unopened は returned を補う主格補語として機能している。',
  },
  {
    id: 'exp-ls-020',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The elevator nearest the main lobby will be out of service until further notice; visitors are advised to use the service elevator at the rear of the building.',
    audioText:
      'The elevator nearest the main lobby will be out of service until further notice; visitors are advised to use the service elevator at the rear of the building.',
    options: [
      'メインロビーに最も近いエレベーターは追って通知があるまで運転を休止するため、来訪者は建物後方の業務用エレベーターの利用を勧められている。',
      'メインロビーに最も近いエレベーターは、次の通知が届き次第、運転を再開する予定だ。',
      '建物後方の業務用エレベーターが故障したため、来訪者はメインロビーのエレベーターを利用するよう案内されている。',
      'すべてのエレベーターが停止しているため、来訪者は階段を利用しなければならない。',
    ],
    correctIndex: 0,
    explanation:
      'out of service = 運転休止中。until further notice = 「追って通知があるまで」で、再開時期が未定であることを表す(通知が来たら再開が決まっているわけではない)。どのエレベーターが止まり、どれを使うべきかの対応関係を聞き分ける。',
  },
  {
    id: 'exp-ls-021',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      "Attendance at tomorrow's safety briefing is optional for part-time staff but mandatory for anyone supervising new hires.",
    audioText:
      "Attendance at tomorrow's safety briefing is optional for part-time staff but mandatory for anyone supervising new hires.",
    options: [
      '明日の安全説明会は、パート職員には任意だが、新入社員を監督する者には出席が義務づけられている。',
      '明日の安全説明会は、パート職員には義務だが、新入社員を監督する者には任意である。',
      '明日の安全説明会は、新入社員を含む全職員に出席が義務づけられている。',
      '明日の安全説明会は任意参加のため、監督者を含め誰も出席する必要はない。',
    ],
    correctIndex: 0,
    explanation:
      'optional(任意)と mandatory(義務)がどちらのグループに掛かるかを聞き分ける対比問題。anyone supervising new hires = 「新入社員を監督する者は誰でも」(現在分詞の後置修飾)。optional / mandatory の割り当てを入れ替えた選択肢が定番のひっかけ。',
  },
  {
    id: 'exp-ls-022',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'What appears to be a minor clerical error has, in fact, delayed the entire customs clearance process by nearly a week.',
    audioText:
      'What appears to be a minor clerical error has, in fact, delayed the entire customs clearance process by nearly a week.',
    options: [
      '重大な事務ミスが起きたが、通関手続きへの影響は1週間もかからず解消した。',
      '軽微な事務ミスに見えるものが、実際には通関手続き全体を1週間近く遅らせている。',
      '通関手続きの遅れによって、軽微な事務ミスが1週間近く見過ごされていた。',
      '事務ミスは見つからなかったため、通関手続きは予定どおり完了した。',
    ],
    correctIndex: 1,
    explanation:
      'What appears to be 〜 = 「〜に見えるもの」(関係代名詞 what の名詞節が主語)。in fact は「見かけと違って実際は」の対比を示す挿入句。因果は「ミス→遅延」で、逆に読まない。delay A by B = AをBだけ遅らせる。customs clearance = 通関。',
  },
  {
    id: 'exp-ls-023',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The keynote address has been shortened to forty minutes so as to allow more time for the panel discussion that follows.',
    audioText:
      'The keynote address has been shortened to forty minutes so as to allow more time for the panel discussion that follows.',
    options: [
      '基調講演は40分遅れて始まり、パネルディスカッションの時間が削られた。',
      '基調講演は40分延長され、パネルディスカッションは中止された。',
      'パネルディスカッションが40分に短縮されたため、基調講演の時間が増えた。',
      '基調講演は、直後のパネルディスカッションの時間を増やすため、40分に短縮された。',
    ],
    correctIndex: 3,
    explanation:
      'so as to do = 「〜するために」(目的)。shorten A to B = 「AをBまで短縮する」で、to forty minutes は短縮後の長さ(40分延ばすのではない)。that follows = 「その後に続く」。何が短縮され、何の時間が増えるのかの対応を聞き取る。',
  },
  {
    id: 'exp-ls-024',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Employees wishing to carry over unused vacation days must notify Human Resources no later than the last business day of December.',
    audioText:
      'Employees wishing to carry over unused vacation days must notify Human Resources no later than the last business day of December.',
    options: [
      '未消化の休暇はすべて12月の最終営業日に自動的に繰り越されるため、届け出は不要である。',
      '未消化の休暇を翌年に繰り越したい従業員は、遅くとも12月の最終営業日までに人事部に届け出なければならない。',
      '従業員は12月の最終営業日以降に、未消化の休暇の繰り越しを人事部に申請できる。',
      '人事部は、未消化の休暇を持つ従業員に対し、12月中にすべて消化するよう通知した。',
    ],
    correctIndex: 1,
    explanation:
      'carry over = 「(休暇・予算を)繰り越す」。no later than 〜 = 「遅くとも〜までに」で、期限の後ではなく前に手続きが必要。Employees wishing to do = 「〜したい従業員」(分詞の後置修飾)。届け出が必要という点(自動ではない)も聞き取りのポイント。',
  },
  {
    id: 'exp-ls-025',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Far from declining, applications for the internship program have nearly doubled since the eligibility requirements were relaxed.',
    audioText:
      'Far from declining, applications for the internship program have nearly doubled since the eligibility requirements were relaxed.',
    options: [
      'インターンシップへの応募は遠方からのものが多く、応募資格の緩和後も横ばいだった。',
      'インターンシップへの応募は、応募資格の厳格化以降、半分近くまで減少した。',
      'インターンシップへの応募は減少するどころか、応募資格の緩和以降、2倍近くに増えた。',
      '応募資格が緩和されたにもかかわらず、インターンシップへの応募は減少し続けている。',
    ],
    correctIndex: 2,
    explanation:
      'far from -ing = 「〜するどころか」で、後続の内容(倍増)がその正反対であることを予告する。far を「遠方から」と聞き違えない。double = 2倍になる。relax the requirements = 要件を緩和する(厳格化 tighten の逆)。',
  },
  {
    id: 'exp-ls-026',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The auditors requested access not only to the financial statements but also to all correspondence relating to the disputed transactions.',
    audioText:
      'The auditors requested access not only to the financial statements but also to all correspondence relating to the disputed transactions.',
    options: [
      '監査人は、通信記録の内容が財務諸表と一致していることを確認して監査を終えた。',
      '監査人は、財務諸表の代わりに、係争中の取引に関する通信記録の閲覧を求めた。',
      '監査人は財務諸表の閲覧のみを求め、通信記録には関心を示さなかった。',
      '監査人は、財務諸表だけでなく、係争中の取引に関するすべての通信記録の閲覧も求めた。',
    ],
    correctIndex: 3,
    explanation:
      'not only A but also B = 「AだけでなくBも」で、両方を要求している(代替や限定ではない)。correspondence = 通信・往復文書。relating to 〜 = 〜に関する(現在分詞の後置修飾)。disputed = 係争中の。要求範囲の広がりを聞き取る。',
  },
  {
    id: 'exp-ls-027',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Whoever locks up tonight should make sure the server room door is fully latched, as it has been found ajar twice this week.',
    audioText:
      'Whoever locks up tonight should make sure the server room door is fully latched, as it has been found ajar twice this week.',
    options: [
      'サーバー室の扉は今週2回施錠されていたため、今夜は確認の必要がない。',
      '今夜は誰もサーバー室に施錠できないため、扉は開けたままにしておくべきだ。',
      '今夜戸締まりをする人は誰であれ、サーバー室の扉が完全に閉まっているか確認すべきだ。今週すでに2回、半開きの状態で見つかっているからだ。',
      '今夜戸締まりをする担当者は、サーバー室の扉を2回開けて点検しなければならない。',
    ],
    correctIndex: 2,
    explanation:
      'whoever locks up tonight = 「今夜戸締まりをする人は誰でも」(複合関係代名詞 whoever が主語の名詞節)。ajar = 「(扉が)半開きで」という満点レベルの語彙。理由の as 節「今週2回半開きで発見された」が指示の根拠になっている。latch = 掛け金を掛ける。',
  },
  {
    id: 'exp-ls-028',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The shipment cleared customs earlier than anticipated, which means the installation crew can now begin work ahead of schedule.',
    audioText:
      'The shipment cleared customs earlier than anticipated, which means the installation crew can now begin work ahead of schedule.',
    options: [
      '設置作業班が早く作業を終えたため、貨物の通関手続きが前倒しされた。',
      '貨物の通関が予想より遅れたため、設置作業の開始も遅れる見込みだ。',
      '貨物は通関で止められており、設置作業班は予定どおり作業を開始できない。',
      '貨物が予想より早く通関したため、設置作業班は予定より前倒しで作業を開始できる。',
    ],
    correctIndex: 3,
    explanation:
      'clear customs = 「通関する」。earlier than anticipated = 予想より早く。非制限用法の which は直前の節全体(早く通関したこと)を受け、その帰結を導く。因果は「通関が早い→作業が前倒し」で、逆方向に読まない。ahead of schedule = 予定より早く。',
  },
  {
    id: 'exp-ls-029',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      "In light of the volume of complaints received last quarter, it is hardly surprising that the vendor's contract was not renewed.",
    audioText:
      "In light of the volume of complaints received last quarter, it is hardly surprising that the vendor's contract was not renewed.",
    options: [
      '苦情が多かったにもかかわらず、そのベンダーの契約は無事に更新された。',
      '前四半期の苦情は少なかったため、そのベンダーの契約が更新されなかったのは驚きである。',
      '前四半期に寄せられた苦情の多さを考えれば、そのベンダーの契約が更新されなかったのは少しも驚くことではない。',
      '前四半期の苦情の件数はまだ集計されておらず、契約更新の判断は先送りされた。',
    ],
    correctIndex: 2,
    explanation:
      'in light of 〜 = 「〜を踏まえると・〜に照らして」。hardly surprising = 「少しも驚きではない」(hardly の否定を聞き逃すと「驚きだ」と逆になる)。was not renewed = 更新されなかった。volume of complaints = 苦情の多さ。否定語が2か所ある点に注意。',
  },
  {
    id: 'exp-ls-030',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'In the event that the fire alarm sounds during the drill, staff are to assemble in the west parking area rather than the interior courtyard.',
    audioText:
      'In the event that the fire alarm sounds during the drill, staff are to assemble in the west parking area rather than the interior courtyard.',
    options: [
      '職員は訓練の前に、西側駐車場と中庭の両方に集合するよう指示されている。',
      '訓練中に火災警報が鳴った場合、職員は西側駐車場ではなく中庭に集合しなければならない。',
      '火災警報が鳴らなかったため、職員は訓練を中止して中庭に集合した。',
      '訓練中に火災警報が鳴った場合、職員は中庭ではなく西側駐車場に集合することになっている。',
    ],
    correctIndex: 3,
    explanation:
      'in the event that 〜 = 「〜の場合には」(if よりフォーマルな条件表現。この sounds は「鳴る」という動詞)。be to do = 「〜することになっている」(予定・指示)。A rather than B = 「BではなくA」で、集合場所の対応関係を入れ替えた選択肢がひっかけ。',
  },
  {
    id: 'exp-ls-031',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'Please note that the cafeteria will close at two this afternoon so that the ventilation ducts can be cleaned.',
    audioText:
      'Please note that the cafeteria will close at two this afternoon so that the ventilation ducts can be cleaned.',
    options: [
      '換気ダクトの清掃が終わったため、食堂は本日午後2時に営業を再開する。',
      '食堂は午後2時から、清掃済みの換気ダクトのそばで営業を続ける。',
      '換気ダクトを清掃できるようにするため、食堂は本日午後2時に閉まる。',
      '食堂の閉店が午後2時に早まったため、換気ダクトの清掃は延期された。',
    ],
    correctIndex: 2,
    explanation:
      'so that + S + can 〜 = 「〜できるように」(目的)。閉店(結果ではなく手段)と清掃(目的)の関係を聞き取る。please note that 〜 = 「〜にご留意ください」。ventilation duct = 換気ダクト。因果を逆にした選択肢がひっかけ。',
  },
  {
    id: 'exp-ls-032',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'All but two of the conference rooms have already been booked for Friday afternoon.',
    audioText: 'All but two of the conference rooms have already been booked for Friday afternoon.',
    options: [
      '会議室は、金曜午後の分として2室を除いてすべて予約済みである。',
      '金曜午後の会議室の予約は、2室だけがすでに埋まっている。',
      '会議室は金曜午後に全室が予約されており、空きは一切ない。',
      '金曜午後には、予約されていた会議室のうち2室がキャンセルされた。',
    ],
    correctIndex: 0,
    explanation:
      'all but + 数詞 = 「〜を除いてすべて」(この but は except の意味)。exp-ej-034 の all but(ほとんど)とは働きが異なり、直後に数がある場合は「〜以外全部」。つまり空きは2室だけ。「2室だけ埋まっている」は正反対の誤読。',
  },
  {
    id: 'exp-ls-033',
    genre: 'listening',
    difficulty: 'expert',
    prompt: "If you have not yet confirmed your attendance at the year-end banquet, kindly do so by the end of the day.",
    audioText: "If you have not yet confirmed your attendance at the year-end banquet, kindly do so by the end of the day.",
    options: [
      '年末晩餐会への出席をまだ確認していない人は、今日は退社してよい。',
      '年末晩餐会への出席をまだ確認していない人は、本日中に確認の連絡をすること。',
      '年末晩餐会への出席確認は、締め切りが本日から延長された。',
      '年末晩餐会は、出席確認が集まらなかったため本日中に中止が決まる。',
    ],
    correctIndex: 1,
    explanation:
      'do so = 直前の動詞句(confirm your attendance)を受ける代動詞表現で、「そう(=出席確認)してください」の意味。kindly = please のフォーマルな言い換え。by the end of the day = 本日中に。do so が何を指すかを聞き取るのが核心。',
  },
  {
    id: 'exp-ls-034',
    genre: 'listening',
    difficulty: 'expert',
    prompt:
      'The airport shuttle departs from the north exit every twenty minutes, except on public holidays, when it runs hourly.',
    audioText:
      'The airport shuttle departs from the north exit every twenty minutes, except on public holidays, when it runs hourly.',
    options: [
      '空港シャトルは祝日を除き毎時1本、祝日には20分おきに運行される。',
      '空港シャトルは毎日20分おきに運行され、祝日は運休となる。',
      '空港シャトルは北口を毎時20分に出発し、祝日もダイヤは変わらない。',
      '空港シャトルは北口から20分おきに出発するが、祝日は毎時1本の運行になる。',
    ],
    correctIndex: 3,
    explanation:
      'except on public holidays = 「祝日を除いて」、直後の when は public holidays を先行詞とする関係副詞で「その祝日には毎時1本」と補足する。平日20分おき/祝日毎時1本という対応関係の入れ替えが定番のひっかけ。hourly = 1時間ごとに。',
  },
  {
    id: 'exp-ls-035',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Rather than replace the entire cooling unit, the technician recommended swapping out the faulty valve.',
    audioText: 'Rather than replace the entire cooling unit, the technician recommended swapping out the faulty valve.',
    options: [
      '技術者は、冷却装置全体の交換ではなく、不良バルブの交換を勧めた。',
      '技術者は、不良バルブの交換よりも、冷却装置全体の交換を勧めた。',
      '技術者は、冷却装置全体を交換したうえで、不良バルブも交換するよう勧めた。',
      '技術者は、冷却装置の交換をためらったため、修理は行われなかった。',
    ],
    correctIndex: 0,
    explanation:
      'rather than + 動詞の原形 = 「〜するのではなく」。rather than の直後に置かれた方(全体交換)が「選ばれない」側で、主節の内容(バルブ交換)が推奨される側。優先関係を逆に取るのが最頻出の誤り。swap out = 交換する。faulty = 不良の。',
  },
  {
    id: 'exp-ls-036',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Visitors must be accompanied by a badged employee at all times while on the production floor.',
    audioText: 'Visitors must be accompanied by a badged employee at all times while on the production floor.',
    options: [
      '来訪者は、製造フロアでは従業員のバッジを常に着用しなければならない。',
      '従業員は、製造フロアで来訪者を見かけたら常に同行を申し出なければならない。',
      '来訪者は、製造フロアにいる間は常にバッジ着用の従業員の同伴が必要である。',
      '来訪者は、製造フロアへの入場を常時禁止されている。',
    ],
    correctIndex: 2,
    explanation:
      'be accompanied by 〜 = 「〜に同伴される」。同伴するのは従業員、されるのは来訪者という受動の関係を聞き取る。badged employee = バッジを着けた従業員(バッジを着けるのは来訪者ではない)。while on 〜 = while they are on 〜 の省略。',
  },
  {
    id: 'exp-ls-037',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'The submission deadline has been extended, though only by forty-eight hours, so plan your revisions accordingly.',
    audioText: 'The submission deadline has been extended, though only by forty-eight hours, so plan your revisions accordingly.',
    options: [
      '提出期限は48時間前倒しされたので、それに合わせて修正作業を進める必要がある。',
      '提出期限は延長されたが、その幅は48時間だけなので、それを踏まえて修正の計画を立てるべきだ。',
      '提出期限の延長は48時間の審議の末に見送られた。',
      '提出期限は48時間ごとに繰り返し延長されるので、修正を急ぐ必要はない。',
    ],
    correctIndex: 1,
    explanation:
      'though only by forty-eight hours = 「ただし48時間だけだが」という譲歩の挿入句。by は差分(延長幅)を表す。延長ではあるが余裕は小さい、というニュアンスを聞き取る。accordingly = それに応じて。revision = 修正。',
  },
  {
    id: 'exp-ls-038',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Whichever shipping option you select at checkout, be sure to retain the tracking number until the parcel arrives.',
    audioText: 'Whichever shipping option you select at checkout, be sure to retain the tracking number until the parcel arrives.',
    options: [
      '追跡番号を保管していれば、購入後でも配送方法を自由に変更できる。',
      '最も早い配送方法を選んだ場合に限り、追跡番号が発行される。',
      '配送方法を選ばなかった場合、追跡番号は荷物の到着後に通知される。',
      'どの配送方法を選んだとしても、荷物が届くまで追跡番号を保管しておくべきだ。',
    ],
    correctIndex: 3,
    explanation:
      'whichever + 名詞 + S + V = 「どの〜を…しようとも」の譲歩節。条件(〜した場合に限り)ではなく「すべての場合に当てはまる」ことを表す。retain = 保管する。parcel = 小包。until 〜 = 〜まで(継続)。',
  },
  {
    id: 'exp-ls-039',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'It is each department head, not the human resources team, that is responsible for filing the quarterly safety report.',
    audioText: 'It is each department head, not the human resources team, that is responsible for filing the quarterly safety report.',
    options: [
      '四半期安全報告書の提出責任は、人事チームが各部門長に代わって負っている。',
      '四半期安全報告書は、各部門長と人事チームが共同で提出する決まりである。',
      '四半期安全報告書の提出責任を負うのは人事チームではなく、各部門長である。',
      '人事チームは、各部門長に四半期安全報告書の提出を免除した。',
    ],
    correctIndex: 2,
    explanation:
      'It is A, not B, that 〜 = 「〜なのはBではなくAだ」の強調構文。not the human resources team という挿入を聞き逃すと責任の所在を取り違える。be responsible for -ing = 〜する責任がある。file a report = 報告書を提出する。',
  },
  {
    id: 'exp-ls-040',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Owing to a scheduling conflict, the product demonstration has been pushed back to the final day of the expo.',
    audioText: 'Owing to a scheduling conflict, the product demonstration has been pushed back to the final day of the expo.',
    options: [
      '日程の重複により、製品実演は展示会の最終日に延期された。',
      '日程の重複により、製品実演は展示会の初日に前倒しされた。',
      '展示会の最終日に日程の重複が発覚し、製品実演は中止された。',
      '製品実演が延期されたため、展示会の会期そのものが延長された。',
    ],
    correctIndex: 0,
    explanation:
      'owing to 〜 = 「〜が原因で」(= due to)。push back = 「(日程を)後ろ倒しにする・延期する」で、move up(前倒し。exp-ls-015)の対義。scheduling conflict = 日程の重複・かち合い。expo = 展示会。',
  },
  {
    id: 'exp-ls-041',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'The invoice you received this morning supersedes the one issued in error at the beginning of the month.',
    audioText: 'The invoice you received this morning supersedes the one issued in error at the beginning of the month.',
    options: [
      '今朝届いた請求書は、月初に発行されたものと併せて保管する必要がある。',
      '月初に発行された請求書が正しく、今朝届いたものは誤って送られたものである。',
      '今朝届いた請求書は誤発行なので、月初の請求書に基づいて支払うべきである。',
      '今朝届いた請求書が、月初に誤って発行されたものに取って代わる。',
    ],
    correctIndex: 3,
    explanation:
      'supersede = 「〜に取って代わる・〜を無効にして置き換わる」。新しい方(今朝の請求書)が有効で、古い方(月初の分)が誤発行という関係を聞き取る。issued in error = 誤って発行された(過去分詞の後置修飾)。どちらが有効かの取り違えが定番のひっかけ。',
  },
  {
    id: 'exp-ls-042',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Only those who have completed the certification course are eligible to operate the new forklift.',
    audioText: 'Only those who have completed the certification course are eligible to operate the new forklift.',
    options: [
      '新しいフォークリフトを操作すれば、認定講習を修了したものとみなされる。',
      '認定講習を修了した者だけが、新しいフォークリフトを操作する資格を持つ。',
      '認定講習の修了者は、新しいフォークリフトの操作を免除される。',
      '新しいフォークリフトの操作には、認定講習の受講予約だけで十分である。',
    ],
    correctIndex: 1,
    explanation:
      'only those who 〜 = 「〜した者だけ」。be eligible to do = 「〜する資格がある」。修了(完了形 have completed)が資格の前提条件である関係を聞き取る。eligible を exempt(免除される)と取り違えた選択肢がひっかけ。certification = 認定。',
  },
  {
    id: 'exp-ls-043',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Network passwords must be updated every ninety days; otherwise, the account will be locked automatically.',
    audioText: 'Network passwords must be updated every ninety days; otherwise, the account will be locked automatically.',
    options: [
      'ネットワークのパスワードは90日ごとに更新しなければならず、怠るとアカウントは自動的にロックされる。',
      'ネットワークのパスワードを90日ごとに更新すると、アカウントは自動的にロックされる。',
      'ネットワークのパスワードは自動的に90日ごとに更新されるため、アカウントがロックされることはない。',
      'アカウントがロックされた場合は、90日以内にパスワードを更新すれば解除される。',
    ],
    correctIndex: 0,
    explanation:
      'otherwise = 「さもなければ」で、直前の指示(90日ごとの更新)に従わなかった場合の帰結を導く。更新した場合にロックされると読むのは因果の取り違え。must be updated = 更新されなければならない(受動)。automatically = 自動的に。',
  },
  {
    id: 'exp-ls-044',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Hardly anyone at the regional office was aware that the internal transfer window had already closed.',
    audioText: 'Hardly anyone at the regional office was aware that the internal transfer window had already closed.',
    options: [
      '地域オフィスの誰もが、社内異動の受付期間がすでに終了したことを知っていた。',
      '地域オフィスの一部の社員は、社内異動の受付期間の延長を知らされていた。',
      '地域オフィスでは、社内異動の受付期間がすでに終了していたことをほとんど誰も知らなかった。',
      '地域オフィスの社員は、社内異動の受付が始まったことを知らされたばかりだった。',
    ],
    correctIndex: 2,
    explanation:
      'hardly anyone = 「ほとんど誰も〜ない」。hardly の否定を聞き逃すと「誰もが知っていた」と正反対になる。transfer window = 異動の受付期間。had already closed(過去完了)は「気づいた時点よりも前に終わっていた」ことを表す。',
  },
  {
    id: 'exp-ls-045',
    genre: 'listening',
    difficulty: 'expert',
    prompt: "The catering order must be finalized by Wednesday at the latest, as the vendor requires three days' notice.",
    audioText: "The catering order must be finalized by Wednesday at the latest, as the vendor requires three days' notice.",
    options: [
      'ケータリングの注文は水曜日以降に確定すればよく、業者への連絡は不要である。',
      '業者の都合により、ケータリングの注文は水曜日まで確定できない。',
      'ケータリングの注文は3日ごとに内容を見直し、毎週水曜日に更新しなければならない。',
      '業者が3日前の通知を必要とするため、ケータリングの注文は遅くとも水曜日までに確定しなければならない。',
    ],
    correctIndex: 3,
    explanation:
      "by Wednesday at the latest = 「遅くとも水曜日までに」(by は期限)。理由の as 節「業者が3日前の通知(three days' notice)を要する」が期限の根拠。notice = 事前通知。期限の方向(までに/以降)を取り違えないことが核心。",
  },
  {
    id: 'exp-ls-046',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'Assuming the samples clear the final inspection, full-scale production will commence early next month.',
    audioText: 'Assuming the samples clear the final inspection, full-scale production will commence early next month.',
    options: [
      'サンプルは最終検査で不合格となったため、量産開始は来月以降に延期された。',
      'サンプルが最終検査を通過すれば、来月初めに本格量産が始まる。',
      'サンプルの最終検査は、本格量産が始まる来月初めに実施される。',
      '最終検査を省略して、本格量産が来月初めに開始されることが決まった。',
    ],
    correctIndex: 1,
    explanation:
      'assuming (that) 〜 = 「〜だと仮定すれば・〜であれば」(条件)。まだ確定していない前提であって、不合格の事実や検査の省略を述べているのではない。clear the inspection = 検査を通過する。commence = 開始する。full-scale = 本格的な。',
  },
  {
    id: 'exp-ls-047',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'The awards banquet has been relocated to the annex across the street, the main hall being unavailable due to renovations.',
    audioText: 'The awards banquet has been relocated to the annex across the street, the main hall being unavailable due to renovations.',
    options: [
      '表彰晩餐会は、本館ホールが改装で使えないため、通りの向かいの別館に会場変更となった。',
      '表彰晩餐会は、別館の改装が終わり次第、本館ホールから移される予定だ。',
      '表彰晩餐会の会場である本館ホールは、通りの向かいに移築されることになった。',
      '表彰晩餐会は、本館ホールの改装を祝って別館で開催される。',
    ],
    correctIndex: 0,
    explanation:
      'the main hall being unavailable 〜 = 独立分詞構文(意味上の主語 the main hall + being)で「本館ホールが使えないので」と理由を表す。relocate = 会場を移す。annex = 別館。分詞構文が理由である点と、どこからどこへ移るのかを聞き取る。',
  },
  {
    id: 'exp-ls-048',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'On no account should the emergency exits be propped open, even for brief deliveries.',
    audioText: 'On no account should the emergency exits be propped open, even for brief deliveries.',
    options: [
      '短時間の搬入時に限り、非常口を開けたままにしてよい。',
      '非常口は、搬入作業の記録を残せば開放したままでもよい。',
      '非常口は防犯上の理由から、常時開放しておかなければならない。',
      'たとえ短時間の搬入のためであっても、非常口を決して開けたままにしてはならない。',
    ],
    correctIndex: 3,
    explanation:
      'on no account + 倒置(should the exits be) = 「決して〜してはならない」の強い禁止。account を「記録・理由」と文字どおり読むのは誤り。prop open = (物をかませて)開けたままにする。even for 〜 = たとえ〜のためであっても(例外なし)。',
  },
  {
    id: 'exp-ls-049',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'The figures cited in the handout are provisional and may be revised once the external audit concludes.',
    audioText: 'The figures cited in the handout are provisional and may be revised once the external audit concludes.',
    options: [
      '配布資料に引用された数値は外部監査で確定済みのため、今後変更されることはない。',
      '配布資料に引用された数値は暫定値であり、外部監査の終了後に修正される可能性がある。',
      '配布資料の数値は、外部監査の開始と同時に無効となる。',
      '外部監査の結論は暫定的なもので、配布資料の数値の方が正確である。',
    ],
    correctIndex: 1,
    explanation:
      'provisional = 暫定的な(= tentative)。cited in the handout = 配布資料に引用された(過去分詞の後置修飾)。once + S + V = 「いったん〜したら・〜し次第」。may be revised = 修正される可能性がある(確定ではない)。conclude = 終了する。',
  },
  {
    id: 'exp-ls-050',
    genre: 'listening',
    difficulty: 'expert',
    prompt: 'By the time the replacement parts arrive from the supplier, the maintenance crew will have completed the preliminary inspection.',
    audioText: 'By the time the replacement parts arrive from the supplier, the maintenance crew will have completed the preliminary inspection.',
    options: [
      '交換部品が届かなかったため、保守班は予備点検を打ち切った。',
      '保守班は、交換部品が届いてから予備点検に着手する予定だ。',
      '交換部品が納入業者から届くまでには、保守班は予備点検を終えているだろう。',
      '交換部品の到着と予備点検の完了は、同時に行われなければならない。',
    ],
    correctIndex: 2,
    explanation:
      'by the time + S + V(現在形), S + will have + 過去分詞 = 「〜するまでには…し終えているだろう」の未来完了。部品到着より点検完了が先という時間関係を聞き取る(到着後に着手、は逆)。preliminary = 予備の。replacement parts = 交換部品。',
  },
]
