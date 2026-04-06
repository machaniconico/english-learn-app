import type { Category } from "../types";

export const sentencePatterns: Category = {
  id: "grammar-patterns",
  title: "Sentence Patterns",
  titleJa: "文型パターン",
  description: "Essential sentence structures for advanced English grammar",
  icon: "📐",
  color: "purple",
  lessons: [
    {
      id: "grammar-patterns-1",
      title: "Passive Voice",
      titleJa: "受動態",
      description: "How to form and use passive voice in business contexts",
      items: [
        {
          id: "grammar-patterns-1-1",
          english: "Present Passive: Subject + am/is/are + Past Participle",
          japanese:
            "現在の受動態。主語が動作を受ける側になる。be動詞+過去分詞。",
          pronunciation: "「～される」のbe + 過去分詞",
          example:
            "All invoices are reviewed by the accounting department before payment.",
          exampleJa:
            "すべての請求書は支払い前に経理部によって確認されます。",
        },
        {
          id: "grammar-patterns-1-2",
          english: "Past Passive: Subject + was/were + Past Participle",
          japanese:
            "過去の受動態。過去に動作を受けたことを表す。was/were+過去分詞。",
          pronunciation: "「～された」のwas/were + 過去分詞",
          example:
            "The annual budget was approved by the board of directors last Friday.",
          exampleJa:
            "年間予算は先週の金曜日に取締役会によって承認されました。",
        },
        {
          id: "grammar-patterns-1-3",
          english:
            "Future Passive: Subject + will be + Past Participle",
          japanese:
            "未来の受動態。将来動作を受けることを表す。will be+過去分詞。",
          pronunciation: "「～されるだろう」のwill be + 過去分詞",
          example:
            "The new employees will be trained during their first two weeks.",
          exampleJa:
            "新入社員は最初の2週間に研修を受けます。",
        },
        {
          id: "grammar-patterns-1-4",
          english:
            "Modal Passive: Subject + modal + be + Past Participle",
          japanese:
            "助動詞を含む受動態。can be done, should be sent, must be completedなど。",
          pronunciation: "助動詞+be+過去分詞の形",
          example:
            "The report must be submitted to the head office by the end of the month.",
          exampleJa:
            "レポートは月末までに本社に提出されなければなりません。",
        },
        {
          id: "grammar-patterns-1-5",
          english:
            "Present Perfect Passive: Subject + have/has been + Past Participle",
          japanese:
            "現在完了の受動態。「すでに～された」を表す。have/has been+過去分詞。",
          pronunciation: "「すでに～された」のhave been + 過去分詞",
          example:
            "The office layout has been redesigned to improve workflow efficiency.",
          exampleJa:
            "業務効率を向上させるためにオフィスのレイアウトが再設計されました。",
        },
        {
          id: "grammar-patterns-1-6",
          english: "Passive with by: Identifying the agent",
          japanese:
            "動作の実行者を示すときはby+行為者を使う。行為者が不明・不要なら省略する。",
          pronunciation: "行為者を示すときだけbyを使う",
          example:
            "The keynote speech was delivered by the company's CEO.",
          exampleJa:
            "基調講演は会社のCEOによって行われました。",
        },
        {
          id: "grammar-patterns-1-7",
          english: "Get + Past Participle: Informal passive",
          japanese:
            "get+過去分詞はカジュアルな受動態。get promoted, get hiredなど。",
          pronunciation: "口語的な受動態にはgetを使うことも",
          example:
            "She got promoted to regional director after only three years.",
          exampleJa:
            "彼女はわずか3年で地域ディレクターに昇進しました。",
        },
        {
          id: "grammar-patterns-1-8",
          english:
            "It is said/believed/expected that: Impersonal passive",
          japanese:
            "非人称の受動態。一般的な意見・報告を客観的に述べる表現。TOEIC頻出。",
          pronunciation: "客観的な表現としてIt is said thatが使われる",
          example:
            "It is expected that the merger will be finalized by the end of this quarter.",
          exampleJa:
            "合併は今四半期末までに完了する見込みです。",
        },
      ],
    },
    {
      id: "grammar-patterns-2",
      title: "Relative Clauses",
      titleJa: "関係代名詞",
      description:
        "Who, which, that, whose, where, and when in defining and non-defining clauses",
      items: [
        {
          id: "grammar-patterns-2-1",
          english: "Who: Refers to people (subject)",
          japanese:
            "先行詞が人で、関係節内で主語になるときにwhoを使う。",
          pronunciation: "人を説明するときはwhoを使う",
          example:
            "The consultant who led the workshop has over 20 years of experience.",
          exampleJa:
            "ワークショップを担当したコンサルタントは20年以上の経験があります。",
        },
        {
          id: "grammar-patterns-2-2",
          english: "Which: Refers to things (subject/object)",
          japanese:
            "先行詞が物・事のときにwhichを使う。非制限用法ではコンマを付ける。",
          pronunciation: "物や事を説明するときはwhichを使う",
          example:
            "The software update, which was released last week, fixed several critical bugs.",
          exampleJa:
            "先週リリースされたソフトウェアのアップデートは、いくつかの重大なバグを修正しました。",
        },
        {
          id: "grammar-patterns-2-3",
          english: "That: Refers to people or things (defining clauses only)",
          japanese:
            "人にも物にも使える。制限用法（限定する関係節）でのみ使用し、コンマは付けない。",
          pronunciation: "制限用法ではwho/whichの代わりにthatが使える",
          example:
            "The proposal that the marketing team submitted was selected.",
          exampleJa:
            "マーケティングチームが提出した提案書が選ばれました。",
        },
        {
          id: "grammar-patterns-2-4",
          english: "Whose: Shows possession",
          japanese:
            "先行詞の所有を表す関係代名詞。「～の」を表す。人にも物にも使える。",
          pronunciation: "「～の」を表す所有の関係代名詞whose",
          example:
            "The employee whose performance exceeded targets received a bonus.",
          exampleJa:
            "目標を上回る成果を上げた従業員はボーナスを受け取りました。",
        },
        {
          id: "grammar-patterns-2-5",
          english: "Where: Refers to places",
          japanese:
            "先行詞が場所のときにwhereを使う。in which / at whichと同義。",
          pronunciation: "場所を説明するときはwhereを使う",
          example:
            "The conference center where the annual meeting is held can seat 500 people.",
          exampleJa:
            "年次総会が開催される会議場は500人収容できます。",
        },
        {
          id: "grammar-patterns-2-6",
          english: "When: Refers to time",
          japanese:
            "先行詞が時を表すときにwhenを使う。in which / at whichと同義。",
          pronunciation: "時を説明するときはwhenを使う",
          example:
            "Friday is the day when all team leaders submit their weekly reports.",
          exampleJa:
            "金曜日はすべてのチームリーダーが週報を提出する日です。",
        },
        {
          id: "grammar-patterns-2-7",
          english: "Defining vs. Non-defining: With or without commas",
          japanese:
            "制限用法（コンマなし）は先行詞を特定し、非制限用法（コンマあり）は補足情報を加える。",
          pronunciation: "コンマの有無で意味が変わるので注意",
          example:
            "Our Tokyo branch, which opened in 2018, has become the most profitable office.",
          exampleJa:
            "2018年に開設された東京支店は、最も収益性の高いオフィスになりました。",
        },
        {
          id: "grammar-patterns-2-8",
          english: "Omitting the relative pronoun: Object position",
          japanese:
            "関係代名詞が関係節内で目的語の場合は省略できる（制限用法のみ）。",
          pronunciation: "目的語の関係代名詞は省略できる",
          example:
            "The vendor (that) we contacted last week has sent us a quotation.",
          exampleJa:
            "先週連絡したベンダーが見積書を送ってきました。",
        },
      ],
    },
    {
      id: "grammar-patterns-3",
      title: "Conditionals",
      titleJa: "仮定法",
      description:
        "Zero, first, second, and third conditional patterns",
      items: [
        {
          id: "grammar-patterns-3-1",
          english: "Zero Conditional: If + present simple, present simple",
          japanese:
            "一般的な事実・法則を表す。「もし～なら、いつも～だ」。両方とも現在形。",
          pronunciation: "一般的な事実にはゼロ条件文を使う",
          example:
            "If a customer requests a refund within 30 days, we process it immediately.",
          exampleJa:
            "顧客が30日以内に返金を要求した場合、すぐに処理します。",
        },
        {
          id: "grammar-patterns-3-2",
          english: "First Conditional: If + present simple, will + verb",
          japanese:
            "現実に起こりうる未来の条件を表す。if節は現在形、主節はwill+動詞。",
          pronunciation: "ありそうな未来の条件には第一条件文を使う",
          example:
            "If we meet the sales target this quarter, the team will receive a bonus.",
          exampleJa:
            "今四半期の売上目標を達成したら、チームはボーナスを受け取ります。",
        },
        {
          id: "grammar-patterns-3-3",
          english: "First Conditional: Unless = If not",
          japanese:
            "unlessは「～でない限り」の意味。if...notと同義。",
          pronunciation: "unlessはif...notと同じ意味",
          example:
            "Unless the report is ready by Friday, the presentation will be postponed.",
          exampleJa:
            "金曜日までにレポートが準備できなければ、プレゼンテーションは延期されます。",
        },
        {
          id: "grammar-patterns-3-4",
          english:
            "Second Conditional: If + past simple, would + verb",
          japanese:
            "現在の事実に反する仮定を表す。if節は過去形、主節はwould+動詞。",
          pronunciation: "現実と違う仮定には第二条件文を使う",
          example:
            "If we had a larger budget, we would hire more developers.",
          exampleJa:
            "もっと大きな予算があれば、もっと多くの開発者を雇うのですが。",
        },
        {
          id: "grammar-patterns-3-5",
          english:
            "Second Conditional: If I were... (subjunctive)",
          japanese:
            "仮定法では主語に関わらずwereを使う（特にフォーマルな場面）。",
          pronunciation: "仮定法ではI wasではなくI wereを使う",
          example:
            "If I were the project manager, I would extend the deadline by two weeks.",
          exampleJa:
            "もし私がプロジェクトマネージャーなら、締め切りを2週間延長するでしょう。",
        },
        {
          id: "grammar-patterns-3-6",
          english:
            "Third Conditional: If + past perfect, would have + past participle",
          japanese:
            "過去の事実に反する仮定を表す。if節はhad+過去分詞、主節はwould have+過去分詞。",
          pronunciation: "過去の後悔・反省には第三条件文を使う",
          example:
            "If we had started the campaign earlier, we would have reached more customers.",
          exampleJa:
            "もっと早くキャンペーンを始めていたら、より多くの顧客にリーチできたでしょう。",
        },
        {
          id: "grammar-patterns-3-7",
          english:
            "Mixed Conditional: If + past perfect, would + verb (past condition, present result)",
          japanese:
            "過去の仮定と現在の結果を組み合わせた混合仮定法。",
          pronunciation: "過去の仮定が今に影響するときは混合仮定法",
          example:
            "If she had accepted the offer, she would be working in New York now.",
          exampleJa:
            "もし彼女がそのオファーを受けていたら、今頃ニューヨークで働いているでしょう。",
        },
        {
          id: "grammar-patterns-3-8",
          english:
            "Wish + Past Simple / Past Perfect: Expressing regret",
          japanese:
            "wish+過去形で現在の願望、wish+過去完了で過去への後悔を表す。",
          pronunciation: "wishの後は時制を一つ過去にずらす",
          example:
            "I wish I had reviewed the contract more carefully before signing it.",
          exampleJa:
            "署名する前にもっと注意深く契約書を確認すればよかったのに。",
        },
      ],
    },
  ],
};
