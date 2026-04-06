import type { Category } from "../types";

export const partsOfSpeech: Category = {
  id: "grammar-pos",
  title: "Parts of Speech",
  titleJa: "品詞",
  description: "Understand how different parts of speech work in English",
  icon: "🏷️",
  color: "green",
  lessons: [
    {
      id: "grammar-pos-1",
      title: "Nouns & Articles",
      titleJa: "名詞と冠詞",
      description:
        "Countable/uncountable nouns, a/an/the rules, and zero article",
      items: [
        {
          id: "grammar-pos-1-1",
          english: "Countable Nouns: Can be singular or plural",
          japanese:
            "数えられる名詞。単数形と複数形がある。a/anを付けたり、複数形のsを付ける。",
          pronunciation: "数えられる名詞にはa/anか複数形のsが必要",
          example:
            "We need to order new desks and chairs for the office.",
          exampleJa:
            "オフィス用に新しい机と椅子を注文する必要があります。",
        },
        {
          id: "grammar-pos-1-2",
          english: "Uncountable Nouns: No plural form, no a/an",
          japanese:
            "数えられない名詞。複数形にできず、a/anを付けない。information, advice, equipmentなど。",
          pronunciation: "information, adviceは複数形にしない",
          example:
            "The information in the report was very useful for the project.",
          exampleJa:
            "レポートの情報はプロジェクトにとても役立ちました。",
        },
        {
          id: "grammar-pos-1-3",
          english: "A/An: Used with singular countable nouns (first mention)",
          japanese:
            "初めて言及する単数の数えられる名詞にa/anを使う。母音の音で始まる語にはanを使う。",
          pronunciation: "母音の「音」で始まればan（an hour, an MBA）",
          example:
            "We are looking for a candidate with an MBA degree.",
          exampleJa:
            "私たちはMBAの学位を持つ候補者を探しています。",
        },
        {
          id: "grammar-pos-1-4",
          english: "The: Used for specific or previously mentioned nouns",
          japanese:
            "特定のもの、すでに言及されたもの、唯一のものにtheを使う。",
          pronunciation: "「その」と特定できるものにtheを付ける",
          example:
            "The contract we discussed yesterday has been signed by the client.",
          exampleJa:
            "昨日話し合った契約書はクライアントによって署名されました。",
        },
        {
          id: "grammar-pos-1-5",
          english: "No Article: General statements and abstractions",
          japanese:
            "一般的な概念や総称を表すときは冠詞を付けない。",
          pronunciation: "一般論では冠詞なしが基本",
          example:
            "Teamwork is essential for success in any organization.",
          exampleJa:
            "チームワークはどの組織でも成功に不可欠です。",
        },
        {
          id: "grammar-pos-1-6",
          english: "The + superlative: the best, the most important",
          japanese:
            "最上級の形容詞にはtheを付ける。the best, the largestなど。",
          pronunciation: "最上級には必ずtheを付ける",
          example:
            "This is the most efficient process we have implemented so far.",
          exampleJa:
            "これは今まで導入した中で最も効率的なプロセスです。",
        },
        {
          id: "grammar-pos-1-7",
          english: "Collective Nouns: staff, team, committee (singular or plural)",
          japanese:
            "集合名詞はグループ全体を指すときは単数扱い、個々を指すときは複数扱い。",
          pronunciation: "アメリカ英語では集合名詞は単数扱いが一般的",
          example:
            "The committee has decided to postpone the product launch.",
          exampleJa:
            "委員会は製品の発売を延期することを決定しました。",
        },
        {
          id: "grammar-pos-1-8",
          english: "Compound Nouns: Two words functioning as one noun",
          japanese:
            "2語以上が結合して1つの名詞になる。business trip, meeting roomなど。",
          pronunciation: "ビジネス英語では複合名詞が頻出",
          example:
            "Please book a meeting room for the business trip planning session.",
          exampleJa:
            "出張計画のセッション用に会議室を予約してください。",
        },
        {
          id: "grammar-pos-1-9",
          english: "Possessive Nouns: Noun's / Nouns'",
          japanese:
            "所有を表す。単数名詞にはアポストロフィ+s、複数名詞にはアポストロフィのみ。",
          pronunciation: "単数は's、複数形のsで終わる語は'のみ",
          example:
            "The company's annual revenue exceeded analysts' expectations.",
          exampleJa:
            "会社の年間収益はアナリストたちの予想を上回りました。",
        },
        {
          id: "grammar-pos-1-10",
          english: "Noun + of + Noun: Describing parts or quantities",
          japanese:
            "「AのB」を表す。a piece of advice, a number of employeesなど。",
          pronunciation: "数えられない名詞の量はa piece ofなどで表す",
          example:
            "A number of employees have requested additional training sessions.",
          exampleJa:
            "多くの従業員が追加の研修セッションを要望しています。",
        },
      ],
    },
    {
      id: "grammar-pos-2",
      title: "Adjectives & Adverbs",
      titleJa: "形容詞と副詞",
      description:
        "Position, order, -ly formation, and comparison forms",
      items: [
        {
          id: "grammar-pos-2-1",
          english: "Adjective Position: Before noun or after linking verb",
          japanese:
            "形容詞は名詞の前に置くか、be動詞・感覚動詞の後に置く。",
          pronunciation: "名詞の前またはbe動詞の後に形容詞を置く",
          example:
            "The new policy is effective starting next month.",
          exampleJa:
            "新しい方針は来月から有効です。",
        },
        {
          id: "grammar-pos-2-2",
          english: "Adjective Order: Opinion-Size-Age-Shape-Color-Origin-Material-Purpose",
          japanese:
            "複数の形容詞を並べるときは決まった順序がある（意見→大きさ→年齢→形→色→産地→素材→目的）。",
          pronunciation: "形容詞の語順はOSASCOMPで覚える",
          example:
            "We purchased a large round wooden conference table.",
          exampleJa:
            "私たちは大きな丸い木製の会議テーブルを購入しました。",
        },
        {
          id: "grammar-pos-2-3",
          english: "Adverbs of Frequency: always, usually, often, sometimes, rarely, never",
          japanese:
            "頻度の副詞は一般動詞の前、be動詞の後に置く。",
          pronunciation: "一般動詞の前、be動詞の後に置く",
          example:
            "The manager usually reviews all expense reports before approval.",
          exampleJa:
            "マネージャーは通常、承認前にすべての経費報告書を確認します。",
        },
        {
          id: "grammar-pos-2-4",
          english: "Adverb Formation: Adjective + -ly",
          japanese:
            "多くの副詞は形容詞に-lyを付けて作る。careful→carefully, quick→quicklyなど。",
          pronunciation: "形容詞に-lyで副詞になる（例外もあるので注意）",
          example:
            "Please handle the confidential documents carefully.",
          exampleJa:
            "機密文書は慎重に取り扱ってください。",
        },
        {
          id: "grammar-pos-2-5",
          english: "Adjective vs. Adverb: Modifying nouns vs. verbs",
          japanese:
            "形容詞は名詞を修飾、副詞は動詞・形容詞・他の副詞を修飾する。TOEICで頻出。",
          pronunciation: "名詞を修飾→形容詞、動詞を修飾→副詞",
          example:
            "The project progressed smoothly thanks to the efficient team.",
          exampleJa:
            "効率的なチームのおかげで、プロジェクトは順調に進みました。",
        },
        {
          id: "grammar-pos-2-6",
          english: "Comparative: -er / more + adjective + than",
          japanese:
            "2つを比較するとき。短い語は-er、長い語はmore+形容詞を使う。",
          pronunciation: "短い語は-er、長い語はmoreを使う",
          example:
            "This quarter's sales figures are higher than last quarter's.",
          exampleJa:
            "今四半期の売上高は前四半期より高いです。",
        },
        {
          id: "grammar-pos-2-7",
          english: "Superlative: the -est / the most + adjective",
          japanese:
            "3つ以上の中で最も～であることを表す。the+最上級。",
          pronunciation: "3つ以上の比較にはthe+最上級を使う",
          example:
            "She is the most experienced manager in the entire division.",
          exampleJa:
            "彼女は部門全体で最も経験豊富なマネージャーです。",
        },
        {
          id: "grammar-pos-2-8",
          english: "As + adjective/adverb + as: Equal comparison",
          japanese:
            "同等比較。「～と同じくらい…」を表す。否定形はnot as...as。",
          pronunciation: "「同じくらい」のas...as構文",
          example:
            "The new software is as reliable as the previous version.",
          exampleJa:
            "新しいソフトウェアは以前のバージョンと同じくらい信頼性があります。",
        },
        {
          id: "grammar-pos-2-9",
          english: "Enough + noun / adjective + enough",
          japanese:
            "enoughは名詞の前に置くが、形容詞・副詞の後に置く。",
          pronunciation: "名詞の前、形容詞・副詞の後に置く",
          example:
            "We don't have enough budget to hire additional staff this year.",
          exampleJa:
            "今年は追加スタッフを雇用するのに十分な予算がありません。",
        },
        {
          id: "grammar-pos-2-10",
          english: "Too + adjective/adverb: Excessive degree",
          japanese:
            "tooは「～すぎる」と過剰な程度を表す。否定的なニュアンスを持つ。",
          pronunciation: "tooは否定的、veryは中立的なニュアンス",
          example:
            "The deadline is too tight to complete the project without overtime.",
          exampleJa:
            "締め切りがタイトすぎて、残業なしではプロジェクトを完了できません。",
        },
      ],
    },
    {
      id: "grammar-pos-3",
      title: "Verbs & Prepositions",
      titleJa: "動詞と前置詞",
      description:
        "Transitive/intransitive verbs and common verb + preposition combinations for TOEIC",
      items: [
        {
          id: "grammar-pos-3-1",
          english: "Transitive Verb: Requires a direct object",
          japanese:
            "他動詞は直接目的語が必要。discuss, mention, attendなどは前置詞なしで目的語を取る。",
          pronunciation: "discuss the plan（discuss aboutは誤り）",
          example:
            "The team discussed the new marketing strategy at the meeting.",
          exampleJa:
            "チームは会議で新しいマーケティング戦略を話し合いました。",
        },
        {
          id: "grammar-pos-3-2",
          english: "Intransitive Verb: Does not take a direct object",
          japanese:
            "自動詞は直接目的語を取らない。go, arrive, happenなど。前置詞を挟んで情報を追加する。",
          pronunciation: "自動詞の後は前置詞が必要になることが多い",
          example:
            "The shipment arrived at the warehouse earlier than expected.",
          exampleJa:
            "出荷品は予想より早く倉庫に到着しました。",
        },
        {
          id: "grammar-pos-3-3",
          english: "Agree with / Agree to / Agree on",
          japanese:
            "agree with（人に同意）、agree to（提案に同意）、agree on（事柄に合意）。",
          pronunciation: "人にwith、提案にto、事柄にonを使い分ける",
          example:
            "All departments agreed on the new budget allocation plan.",
          exampleJa:
            "全部門が新しい予算配分計画に合意しました。",
        },
        {
          id: "grammar-pos-3-4",
          english: "Apply for / Apply to",
          japanese:
            "apply for（職・許可に応募する）、apply to（規則が適用される）。",
          pronunciation: "応募はfor、適用はtoと覚える",
          example:
            "She applied for the senior manager position last week.",
          exampleJa:
            "彼女は先週、シニアマネージャーの職に応募しました。",
        },
        {
          id: "grammar-pos-3-5",
          english: "Comply with: Follow rules or regulations",
          japanese:
            "comply with（規則・法律に従う）。ビジネス・TOEIC頻出の表現。",
          pronunciation: "「～に従う」はcomply with",
          example:
            "All employees must comply with the company's data security policy.",
          exampleJa:
            "全従業員は会社のデータセキュリティ方針に従わなければなりません。",
        },
        {
          id: "grammar-pos-3-6",
          english: "Depend on / Rely on",
          japanese:
            "depend on / rely on（～に依存する、～に頼る）。前置詞onが必須。",
          pronunciation: "「～に頼る」はdepend on / rely on",
          example:
            "The success of the project depends on effective collaboration between teams.",
          exampleJa:
            "プロジェクトの成功はチーム間の効果的な連携にかかっています。",
        },
        {
          id: "grammar-pos-3-7",
          english: "Participate in / Engage in",
          japanese:
            "participate in / engage in（～に参加する、～に従事する）。前置詞inを使う。",
          pronunciation: "「参加する」はparticipate in",
          example:
            "Over fifty employees participated in the annual training workshop.",
          exampleJa:
            "50人以上の従業員が年次研修ワークショップに参加しました。",
        },
        {
          id: "grammar-pos-3-8",
          english: "Respond to / Reply to",
          japanese:
            "respond to / reply to（～に返答する）。前置詞toが必須。",
          pronunciation: "「返答する」はrespond to / reply to",
          example:
            "Please respond to the client's inquiry within 24 hours.",
          exampleJa:
            "クライアントの問い合わせには24時間以内にご返答ください。",
        },
        {
          id: "grammar-pos-3-9",
          english: "Result in / Result from",
          japanese:
            "result in（～という結果になる）、result from（～から生じる）。因果関係で使い分ける。",
          pronunciation: "結果にin、原因にfromを使い分ける",
          example:
            "The delay resulted in a significant increase in production costs.",
          exampleJa:
            "その遅延により生産コストが大幅に増加しました。",
        },
        {
          id: "grammar-pos-3-10",
          english: "Account for / Look forward to",
          japanese:
            "account for（～を占める、～を説明する）、look forward to（～を楽しみにする）。toの後は名詞・動名詞。",
          pronunciation: "look forward toのtoの後は動名詞（-ing）",
          example:
            "We look forward to receiving your feedback on the proposal.",
          exampleJa:
            "提案書に対するご意見をいただけることを楽しみにしています。",
        },
      ],
    },
  ],
};
