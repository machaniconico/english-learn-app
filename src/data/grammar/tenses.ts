import type { Category } from "../types";

export const tenses: Category = {
  id: "grammar-tenses",
  title: "Tenses",
  titleJa: "時制",
  description: "Master English tenses for TOEIC success",
  icon: "⏰",
  color: "blue",
  lessons: [
    {
      id: "grammar-tenses-1",
      title: "Present Tenses",
      titleJa: "現在形",
      description:
        "Simple present, present continuous, present perfect, and present perfect continuous",
      items: [
        {
          id: "grammar-tenses-1-1",
          english: "Present Simple: Subject + Verb(s/es)",
          japanese: "現在の習慣・事実・反復動作を表す。三人称単数にはs/esを付ける。",
          pronunciation: "主語が三単現のときは動詞にsを忘れずに",
          example:
            "The marketing team submits the monthly report on the first Monday.",
          exampleJa:
            "マーケティングチームは毎月第一月曜日に月次レポートを提出します。",
        },
        {
          id: "grammar-tenses-1-2",
          english: "Present Simple: Negative — Subject + do/does not + Verb",
          japanese: "現在形の否定文。do not / does notを動詞の前に置く。",
          pronunciation: "does notの短縮形はdoesn't",
          example:
            "The branch office does not handle international shipments.",
          exampleJa: "その支店は国際配送を取り扱っていません。",
        },
        {
          id: "grammar-tenses-1-3",
          english: "Present Simple: Question — Do/Does + Subject + Verb?",
          japanese: "現在形の疑問文。Do/Doesを文頭に置く。",
          pronunciation: "三人称単数の疑問文はDoesで始める",
          example: "Does the company offer health insurance to part-time employees?",
          exampleJa: "その会社はパートタイム従業員に健康保険を提供していますか？",
        },
        {
          id: "grammar-tenses-1-4",
          english: "Present Continuous: Subject + am/is/are + Verb-ing",
          japanese: "今まさに進行中の動作を表す。be動詞+現在分詞。",
          pronunciation: "「今～している」を表すbe + -ing",
          example:
            "We are currently reviewing the budget proposal for next quarter.",
          exampleJa:
            "私たちは現在、来四半期の予算案を検討しているところです。",
        },
        {
          id: "grammar-tenses-1-5",
          english:
            "Present Continuous for Temporary Situations: Subject + am/is/are + Verb-ing",
          japanese: "一時的な状況・期間限定の動作にも現在進行形を使う。",
          pronunciation: "一時的な状況にはbe + -ingを使う",
          example:
            "Mr. Tanaka is working at the London office this month.",
          exampleJa:
            "田中さんは今月ロンドンオフィスで勤務しています。",
        },
        {
          id: "grammar-tenses-1-6",
          english: "Present Perfect: Subject + have/has + Past Participle",
          japanese:
            "過去に始まり現在に関連する動作・経験・完了を表す。have/has+過去分詞。",
          pronunciation: "「もう～した」「～したことがある」のhave + 過去分詞",
          example:
            "The sales department has already exceeded its quarterly target.",
          exampleJa:
            "営業部はすでに四半期の目標を超えています。",
        },
        {
          id: "grammar-tenses-1-7",
          english: "Present Perfect with since/for",
          japanese:
            "since（～以来）は起点、for（～の間）は期間を表す。現在完了形と共に使う。",
          pronunciation: "sinceは時点、forは期間と覚える",
          example:
            "She has worked in the accounting department since 2019.",
          exampleJa:
            "彼女は2019年から経理部で働いています。",
        },
        {
          id: "grammar-tenses-1-8",
          english: "Present Perfect: already, yet, just",
          japanese:
            "already（もう）、yet（まだ）、just（ちょうど）は現在完了形でよく使う副詞。",
          pronunciation: "alreadyは肯定文、yetは否定・疑問文で使う",
          example:
            "I have just finished drafting the contract for the new client.",
          exampleJa:
            "新しいクライアント向けの契約書を書き終えたところです。",
        },
        {
          id: "grammar-tenses-1-9",
          english:
            "Present Perfect Continuous: Subject + have/has been + Verb-ing",
          japanese:
            "過去から現在まで継続している動作を強調する。動作の継続に焦点を置く。",
          pronunciation: "「ずっと～し続けている」のhave been + -ing",
          example:
            "The IT team has been upgrading the server system all morning.",
          exampleJa:
            "ITチームは午前中ずっとサーバーシステムのアップグレードをしています。",
        },
        {
          id: "grammar-tenses-1-10",
          english: "Stative Verbs: Not used in continuous form",
          japanese:
            "know, believe, belong, ownなどの状態動詞は進行形にしない。",
          pronunciation: "状態動詞は-ing形にしないのがルール",
          example:
            "The manager knows the details of every ongoing project.",
          exampleJa:
            "マネージャーは進行中のすべてのプロジェクトの詳細を把握しています。",
        },
      ],
    },
    {
      id: "grammar-tenses-2",
      title: "Past Tenses",
      titleJa: "過去形",
      description:
        "Simple past, past continuous, past perfect, and used to",
      items: [
        {
          id: "grammar-tenses-2-1",
          english: "Past Simple: Subject + Verb-ed (or irregular form)",
          japanese:
            "過去の完了した動作・出来事を表す。規則動詞は-edを付ける。",
          pronunciation: "過去の一回きりの動作には過去形を使う",
          example:
            "The board approved the merger proposal at last week's meeting.",
          exampleJa:
            "取締役会は先週の会議で合併案を承認しました。",
        },
        {
          id: "grammar-tenses-2-2",
          english: "Past Simple: Negative — Subject + did not + Verb",
          japanese: "過去形の否定文。did not（didn't）+動詞の原形を使う。",
          pronunciation: "did notの後は動詞の原形にする",
          example:
            "The supplier did not deliver the materials on time.",
          exampleJa: "その納入業者は資材を期限通りに届けませんでした。",
        },
        {
          id: "grammar-tenses-2-3",
          english: "Past Simple: Question — Did + Subject + Verb?",
          japanese: "過去形の疑問文。Didを文頭に置き、動詞は原形にする。",
          pronunciation: "Didの後の動詞は必ず原形",
          example: "Did the client confirm the appointment for Thursday?",
          exampleJa:
            "クライアントは木曜日のアポイントメントを確認しましたか？",
        },
        {
          id: "grammar-tenses-2-4",
          english: "Past Continuous: Subject + was/were + Verb-ing",
          japanese:
            "過去のある時点で進行中だった動作を表す。was/were+現在分詞。",
          pronunciation: "「～していたところだった」のwas/were + -ing",
          example:
            "The team was preparing the presentation when the client arrived.",
          exampleJa:
            "クライアントが到着したとき、チームはプレゼンの準備をしていました。",
        },
        {
          id: "grammar-tenses-2-5",
          english:
            "Past Continuous + Past Simple: While/When clauses",
          japanese:
            "進行中の動作に別の動作が割り込む場面。whileは進行形、whenは過去形と使う。",
          pronunciation: "whileは長い動作、whenは短い動作と組み合わせる",
          example:
            "While I was reviewing the contract, my manager called an urgent meeting.",
          exampleJa:
            "私が契約書を確認していたとき、上司が緊急会議を招集しました。",
        },
        {
          id: "grammar-tenses-2-6",
          english:
            "Past Perfect: Subject + had + Past Participle",
          japanese:
            "過去のある時点よりさらに前に起きた動作を表す。had+過去分詞。",
          pronunciation: "「～していた（大過去）」のhad + 過去分詞",
          example:
            "By the time the CEO arrived, the staff had already set up the conference room.",
          exampleJa:
            "CEOが到着するまでに、スタッフはすでに会議室を準備していました。",
        },
        {
          id: "grammar-tenses-2-7",
          english:
            "Past Perfect with before/after/by the time",
          japanese:
            "before, after, by the timeと共に使い、出来事の時系列を明確にする。",
          pronunciation: "時系列を明確にするbefore/after/by the time",
          example:
            "After the company had completed the audit, it released the financial report.",
          exampleJa:
            "会社が監査を完了した後、財務報告書を発表しました。",
        },
        {
          id: "grammar-tenses-2-8",
          english:
            "Past Perfect Continuous: Subject + had been + Verb-ing",
          japanese:
            "過去のある時点まで継続していた動作を表す。had been+現在分詞。",
          pronunciation: "「ずっと～し続けていた」のhad been + -ing",
          example:
            "The engineers had been testing the software for three months before the launch.",
          exampleJa:
            "エンジニアたちはリリース前に3ヶ月間ソフトウェアをテストし続けていました。",
        },
        {
          id: "grammar-tenses-2-9",
          english: "Used to + Verb: Past habits or states",
          japanese:
            "過去の習慣や状態を表す。「以前は～していた（今はしない）」の意味。",
          pronunciation: "「以前は～していた」のused to",
          example:
            "The company used to hold weekly staff meetings every Friday.",
          exampleJa:
            "その会社は以前、毎週金曜日にスタッフ会議を開いていました。",
        },
        {
          id: "grammar-tenses-2-10",
          english: "Would + Verb: Repeated past actions",
          japanese:
            "過去に繰り返し行っていた動作を表す。used toと似ているが状態には使わない。",
          pronunciation: "繰り返しの過去の動作にはwouldも使える",
          example:
            "When I worked in sales, I would visit clients every other week.",
          exampleJa:
            "営業で働いていた頃、私は隔週でクライアントを訪問していました。",
        },
      ],
    },
    {
      id: "grammar-tenses-3",
      title: "Future Tenses",
      titleJa: "未来形",
      description:
        "Will, be going to, present continuous for future, and future perfect",
      items: [
        {
          id: "grammar-tenses-3-1",
          english: "Will + Verb: Decisions, predictions, promises",
          japanese:
            "その場の決定・予測・約束を表す。will+動詞の原形。",
          pronunciation: "その場で決めたことにはwillを使う",
          example:
            "I will send the revised proposal to you by end of day.",
          exampleJa:
            "本日中に修正した提案書をお送りします。",
        },
        {
          id: "grammar-tenses-3-2",
          english: "Will not (won't) + Verb: Negative future",
          japanese: "未来の否定を表す。will not（won't）+動詞の原形。",
          pronunciation: "will notの短縮形won'tは頻出",
          example:
            "The shipment won't arrive until next Wednesday.",
          exampleJa: "出荷品は来週の水曜日まで届きません。",
        },
        {
          id: "grammar-tenses-3-3",
          english:
            "Be going to + Verb: Plans and intentions",
          japanese:
            "すでに決まっている計画・意図を表す。be going to+動詞の原形。",
          pronunciation: "事前に決めた予定にはbe going toを使う",
          example:
            "We are going to launch the new product line in September.",
          exampleJa:
            "私たちは9月に新しい製品ラインを立ち上げる予定です。",
        },
        {
          id: "grammar-tenses-3-4",
          english:
            "Present Continuous for Future: Subject + am/is/are + Verb-ing",
          japanese:
            "確定した近い未来の予定を表す。スケジュール帳に書かれた予定に使う。",
          pronunciation: "確定済みの予定には現在進行形が使える",
          example:
            "The director is meeting with investors tomorrow afternoon.",
          exampleJa:
            "部長は明日の午後、投資家と面会する予定です。",
        },
        {
          id: "grammar-tenses-3-5",
          english:
            "Present Simple for Future: Timetables and schedules",
          japanese:
            "時刻表・スケジュールなど固定された未来の予定には現在形を使う。",
          pronunciation: "公共の時刻表・固定予定には現在形を使う",
          example:
            "The conference starts at 9:00 a.m. and ends at 5:00 p.m.",
          exampleJa:
            "会議は午前9時に始まり、午後5時に終わります。",
        },
        {
          id: "grammar-tenses-3-6",
          english:
            "Future Continuous: Subject + will be + Verb-ing",
          japanese:
            "未来のある時点で進行中の動作を表す。will be+現在分詞。",
          pronunciation: "「～しているところだろう」のwill be + -ing",
          example:
            "At this time next week, I will be attending the trade fair in Tokyo.",
          exampleJa:
            "来週の今頃、私は東京の見本市に参加しているでしょう。",
        },
        {
          id: "grammar-tenses-3-7",
          english:
            "Future Perfect: Subject + will have + Past Participle",
          japanese:
            "未来のある時点までに完了する動作を表す。will have+過去分詞。",
          pronunciation: "「～までに完了しているだろう」のwill have + 過去分詞",
          example:
            "By the end of this fiscal year, the company will have opened three new branches.",
          exampleJa:
            "今年度末までに、会社は3つの新しい支店を開設しているでしょう。",
        },
        {
          id: "grammar-tenses-3-8",
          english:
            "Future Perfect Continuous: Subject + will have been + Verb-ing",
          japanese:
            "未来のある時点まで動作が継続していることを表す。will have been+現在分詞。",
          pronunciation:
            "「～し続けていることになる」のwill have been + -ing",
          example:
            "By next April, she will have been managing this department for ten years.",
          exampleJa:
            "来年の4月で、彼女はこの部門を10年間管理し続けていることになります。",
        },
      ],
    },
  ],
};
