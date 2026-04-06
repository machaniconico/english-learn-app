import type { Category } from "../types";

export const advancedStructures: Category = {
  id: "grammar-adv-struct",
  title: "Advanced Structures",
  titleJa: "上級文型",
  description:
    "Complex sentence structures for TOEIC 800+ and academic/business contexts",
  icon: "🔬",
  color: "rose",
  lessons: [
    {
      id: "grammar-adv-struct-1",
      title: "Inversion",
      titleJa: "倒置",
      description:
        "Inverted sentence structures used for emphasis in formal writing and speech",
      items: [
        {
          id: "adv-struct-1-1",
          english: "Never have I + past participle",
          japanese:
            "「一度も〜したことがない」否定副詞を文頭に置くと主語と助動詞が倒置される。",
          pronunciation: "Never have I ...",
          example:
            "Never have I encountered such a comprehensive compliance framework in my career.",
          exampleJa:
            "私のキャリアにおいて、これほど包括的なコンプライアンス体制に出会ったことはありません。",
        },
        {
          id: "adv-struct-1-2",
          english: "Rarely does + subject + verb",
          japanese:
            "「めったに〜しない」否定の頻度副詞で倒置が起こる。フォーマルな文体で使用。",
          pronunciation: "Rarely does ...",
          example:
            "Rarely does the board of directors overturn a decision made by the executive committee.",
          exampleJa:
            "取締役会が経営委員会の決定を覆すことはめったにありません。",
        },
        {
          id: "adv-struct-1-3",
          english: "Not only...but also (with inversion)",
          japanese:
            "「〜だけでなく…も」Not onlyが文頭に来ると倒置が起こる。",
          pronunciation: "Not only does ... but also ...",
          example:
            "Not only did the merger increase market share, but it also reduced operational costs by 15%.",
          exampleJa:
            "その合併は市場シェアを拡大しただけでなく、運営コストも15%削減しました。",
        },
        {
          id: "adv-struct-1-4",
          english: "Had I known... (inverted conditional)",
          japanese:
            "「もし知っていたら」ifを省略して倒置にする仮定法過去完了。フォーマル。",
          pronunciation: "Had I known ...",
          example:
            "Had I known about the regulatory changes, I would have restructured the proposal accordingly.",
          exampleJa:
            "規制の変更を知っていたら、それに応じて提案を再構成していたでしょう。",
        },
        {
          id: "adv-struct-1-5",
          english: "So + adjective/adverb + that (with inversion)",
          japanese:
            "「非常に〜なので…」soが文頭に来ると倒置が起こり、結果を強調する。",
          pronunciation: "So ... that ...",
          example:
            "So rapidly did the market conditions deteriorate that the firm had to liquidate its positions overnight.",
          exampleJa:
            "市場状況があまりにも急速に悪化したため、同社は一夜にしてポジションを清算しなければなりませんでした。",
        },
        {
          id: "adv-struct-1-6",
          english: "Under no circumstances + inverted clause",
          japanese:
            "「いかなる状況においても〜ない」強い否定を示す副詞句で倒置が起こる。",
          pronunciation: "Under no circumstances should ...",
          example:
            "Under no circumstances should confidential client data be shared with unauthorized personnel.",
          exampleJa:
            "いかなる状況においても、機密の顧客データを権限のない人員と共有してはなりません。",
        },
        {
          id: "adv-struct-1-7",
          english: "Only after + clause + inverted main clause",
          japanese:
            "「〜して初めて…」only afterが文頭に来ると主節が倒置される。",
          pronunciation: "Only after ... did/does ...",
          example:
            "Only after conducting a thorough due diligence review did the investors approve the acquisition.",
          exampleJa:
            "徹底的なデューデリジェンスを実施して初めて、投資家たちは買収を承認しました。",
        },
        {
          id: "adv-struct-1-8",
          english: "Were it not for + noun (inverted conditional)",
          japanese:
            "「〜がなければ」ifを省略した仮定法。But forと同義のフォーマル表現。",
          pronunciation: "Were it not for ...",
          example:
            "Were it not for the government's fiscal stimulus package, the economy would have entered a prolonged recession.",
          exampleJa:
            "政府の財政刺激策がなければ、経済は長期的な景気後退に陥っていたでしょう。",
        },
      ],
    },
    {
      id: "grammar-adv-struct-2",
      title: "Cleft Sentences",
      titleJa: "分裂文",
      description:
        "Sentence structures that split information to highlight a specific element",
      items: [
        {
          id: "adv-struct-2-1",
          english: "It is/was...that (cleft for emphasis)",
          japanese:
            "「〜なのは…だ」特定の要素を強調するために文を分裂させる構文。",
          pronunciation: "It is ... that ...",
          example:
            "It was the strategic partnership with the Asian distributor that ultimately drove the company's global expansion.",
          exampleJa:
            "最終的に会社のグローバル展開を推進したのは、アジアの販売代理店との戦略的パートナーシップでした。",
        },
        {
          id: "adv-struct-2-2",
          english: "What I/we need is... (pseudo-cleft)",
          japanese:
            "「私が必要としているのは…だ」what節を主語にして述語を強調する擬似分裂文。",
          pronunciation: "What I need is ...",
          example:
            "What we need is a comprehensive data migration strategy before transitioning to the new ERP system.",
          exampleJa:
            "私たちに必要なのは、新しいERPシステムに移行する前の包括的なデータ移行戦略です。",
        },
        {
          id: "adv-struct-2-3",
          english: "All you have to do is + base form",
          japanese:
            "「あなたがすべきことは…するだけだ」行動を簡潔に示す分裂文の一種。",
          pronunciation: "All you have to do is ...",
          example:
            "All you have to do is submit the revised compliance report to the regulatory affairs department by Friday.",
          exampleJa:
            "あなたがすべきことは、金曜日までに修正したコンプライアンスレポートを規制対応部門に提出するだけです。",
        },
        {
          id: "adv-struct-2-4",
          english: "The reason why...is that",
          japanese:
            "「…の理由は〜だ」原因と結果を明確に分離して説明する構文。",
          pronunciation: "The reason why ... is that ...",
          example:
            "The reason why the quarterly earnings exceeded projections is that the new product line captured an untapped market segment.",
          exampleJa:
            "四半期決算が予測を上回った理由は、新しい製品ラインが未開拓の市場セグメントを獲得したからです。",
        },
        {
          id: "adv-struct-2-5",
          english: "It was not until...that (negative cleft)",
          japanese:
            "「〜して初めて…した」時間的な遅延を強調する否定分裂文。",
          pronunciation: "It was not until ... that ...",
          example:
            "It was not until the third round of negotiations that both parties reached a mutually acceptable agreement.",
          exampleJa:
            "第3回目の交渉に至って初めて、双方が相互に受け入れ可能な合意に達しました。",
        },
        {
          id: "adv-struct-2-6",
          english: "What matters is... (pseudo-cleft for importance)",
          japanese:
            "「重要なのは…だ」what節で「大切なこと」を主語にし、核心を強調する。",
          pronunciation: "What matters is ...",
          example:
            "What matters is not the volume of transactions processed but the accuracy and security of each one.",
          exampleJa:
            "重要なのは処理される取引の量ではなく、一つ一つの正確さとセキュリティです。",
        },
        {
          id: "adv-struct-2-7",
          english: "Where...is (pseudo-cleft for location/context)",
          japanese:
            "「〜するところは…だ」場所や文脈を強調する擬似分裂文。",
          pronunciation: "Where ... is ...",
          example:
            "Where the company truly differentiates itself is in its after-sales support and customer retention programs.",
          exampleJa:
            "その会社が真に差別化を図っているのは、アフターサービスと顧客維持プログラムにおいてです。",
        },
        {
          id: "adv-struct-2-8",
          english: "The thing that...is (informal cleft)",
          japanese:
            "「〜なことは…だ」口語的な分裂文で、要点を明確にする。",
          pronunciation: "The thing that ... is ...",
          example:
            "The thing that distinguishes successful executives is their ability to make decisive calls under pressure.",
          exampleJa:
            "成功するエグゼクティブを際立たせるのは、プレッシャーの下で断固たる判断を下す能力です。",
        },
      ],
    },
    {
      id: "grammar-adv-struct-3",
      title: "Emphasis & Reduction",
      titleJa: "強調と省略",
      description:
        "Techniques for emphasizing key information and reducing redundancy in advanced English",
      items: [
        {
          id: "adv-struct-3-1",
          english: "do/does/did + base verb (emphatic do)",
          japanese:
            "「本当に〜する」助動詞do/does/didを肯定文で使い動詞を強調する。",
          pronunciation: "I do believe / She does understand",
          example:
            "We do appreciate your continued investment in our sustainability initiatives despite market volatility.",
          exampleJa:
            "市場の変動にもかかわらず、サステナビリティへの継続的な投資を心より感謝いたします。",
        },
        {
          id: "adv-struct-3-2",
          english: "It is/was...who/that (cleft for emphasis on person)",
          japanese:
            "「〜したのは…だ」人物を強調する分裂文。whoは人、thatは人以外に使う。",
          pronunciation: "It was ... who ...",
          example:
            "It was the CFO who identified the discrepancy in the financial statements before the external audit.",
          exampleJa:
            "外部監査の前に財務諸表の不一致を発見したのはCFOでした。",
        },
        {
          id: "adv-struct-3-3",
          english: "What on earth / What in the world...?",
          japanese:
            "「一体何が…？」疑問詞を強調する表現。驚きや困惑を示す。",
          pronunciation: "What on earth ...?",
          example:
            "What on earth prompted the board to approve such a high-risk acquisition without consulting the advisory committee?",
          exampleJa:
            "一体何が取締役会に、諮問委員会に相談もせずにそのような高リスクの買収を承認させたのでしょうか？",
        },
        {
          id: "adv-struct-3-4",
          english: "the very + noun (emphatic adjective)",
          japanese:
            "「まさにその〜」名詞を強調する限定詞的用法。強い特定性を示す。",
          pronunciation: "the very thing / the very moment",
          example:
            "The very premise of the restructuring plan contradicts the company's long-term growth strategy.",
          exampleJa:
            "その再構築計画のまさに前提が、会社の長期成長戦略と矛盾しています。",
        },
        {
          id: "adv-struct-3-5",
          english: "Not a single + noun (emphatic negation)",
          japanese:
            "「ただの一つも〜ない」強い否定を示す表現。文頭では倒置も可能。",
          pronunciation: "Not a single ...",
          example:
            "Not a single objection was raised during the shareholders' meeting regarding the proposed dividend policy.",
          exampleJa:
            "提案された配当政策に関して、株主総会では異議が一つも上がりませんでした。",
        },
        {
          id: "adv-struct-3-6",
          english: "without so much as + -ing (emphatic omission)",
          japanese:
            "「〜すらせずに」最低限の行為さえしなかったことを強調する表現。",
          pronunciation: "without so much as ...-ing",
          example:
            "The contractor terminated the agreement without so much as notifying the project stakeholders.",
          exampleJa:
            "その請負業者は、プロジェクトの利害関係者に通知すらせずに契約を打ち切りました。",
        },
        {
          id: "adv-struct-3-7",
          english: "if any (reduction for minimal expectation)",
          japanese:
            "「もしあるとしても」期待値が非常に低いことを示す省略表現。",
          pronunciation: "if any",
          example:
            "There are few, if any, precedents for this type of cross-border intellectual property dispute.",
          exampleJa:
            "この種の国境を越えた知的財産紛争の前例は、あるとしてもごくわずかです。",
        },
        {
          id: "adv-struct-3-8",
          english: "if anything (reduction for contrary expectation)",
          japanese:
            "「むしろ」予想に反する、あるいは程度がより強いことを示す省略表現。",
          pronunciation: "if anything",
          example:
            "The new regulations have not hindered innovation; if anything, they have accelerated the adoption of cleaner technologies.",
          exampleJa:
            "新しい規制はイノベーションを妨げていません。むしろ、よりクリーンな技術の導入を加速させています。",
        },
      ],
    },
  ],
};
