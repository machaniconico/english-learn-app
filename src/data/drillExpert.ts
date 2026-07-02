import type { DrillQuestion } from '../utils/drillTypes'

// TOEIC 900 後半〜満点レベルの手書き問題バンク(各ジャンル 12 問・計 60 問)。
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
]
