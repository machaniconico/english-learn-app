import type { Category } from "../types";

export const advancedNuance: Category = {
  id: "grammar-adv-nuance",
  title: "Nuance & Precision",
  titleJa: "ニュアンスと正確さ",
  description:
    "Subtle distinctions and register awareness for TOEIC 800+ and professional communication",
  icon: "🎯",
  color: "fuchsia",
  lessons: [
    {
      id: "grammar-adv-nuance-1",
      title: "Subtle Differences",
      titleJa: "微妙な違い",
      description:
        "Commonly confused pairs with nuanced differences in meaning and usage",
      items: [
        {
          id: "adv-nuance-1-1",
          english: "shall vs will",
          japanese:
            "shallは契約・法律文書で義務を示す。willは単純な未来や意思を示す。",
          pronunciation: "shall（義務）/ will（未来・意思）",
          example:
            "The lessee shall maintain the premises in good condition throughout the term of the lease.",
          exampleJa:
            "賃借人はリース期間を通じて、施設を良好な状態に維持しなければならない。",
        },
        {
          id: "adv-nuance-1-2",
          english: "may vs might",
          japanese:
            "mayは可能性がやや高い（50%程度）。mightはより低い可能性や仮定的な状況を示す。",
          pronunciation: "may（ありうる）/ might（かもしれない）",
          example:
            "The proposed regulation may affect quarterly revenue, but the actual impact might be less severe than projected.",
          exampleJa:
            "提案された規制は四半期の収益に影響する可能性がありますが、実際の影響は予測よりも軽微かもしれません。",
        },
        {
          id: "adv-nuance-1-3",
          english: "could vs was able to",
          japanese:
            "couldは過去の一般的な能力。was able toは特定の場面で実際に成功した行動を示す。",
          pronunciation: "could（能力があった）/ was able to（実際にできた）",
          example:
            "Although the team could analyze large datasets, they were able to identify the anomaly only after deploying the new algorithm.",
          exampleJa:
            "チームは大規模なデータセットを分析する能力はありましたが、新しいアルゴリズムを導入して初めて異常を特定することができました。",
        },
        {
          id: "adv-nuance-1-4",
          english: "needn't vs don't need to",
          japanese:
            "needn'tは特定の状況で不要。don't need toはより一般的で日常的な不要さを示す。",
          pronunciation: "needn't（〜する必要はない）/ don't need to（〜しなくてよい）",
          example:
            "You needn't submit the supplementary documents until the primary review is complete; you don't need to worry about the deadline yet.",
          exampleJa:
            "一次審査が完了するまで補足書類を提出する必要はありません。締め切りについてはまだ心配しなくて大丈夫です。",
        },
        {
          id: "adv-nuance-1-5",
          english: "used to vs would (past habits)",
          japanese:
            "used toは過去の習慣と状態の両方。wouldは過去の繰り返しの行動のみで状態には使えない。",
          pronunciation: "used to（以前は〜だった）/ would（よく〜したものだ）",
          example:
            "The firm used to operate from a single office; the partners would meet every Monday to review case progress.",
          exampleJa:
            "その事務所は以前は一つのオフィスで運営されていました。パートナーたちは毎週月曜日に集まって案件の進捗を確認したものです。",
        },
        {
          id: "adv-nuance-1-6",
          english: "even if vs even though",
          japanese:
            "even ifは仮定（実際に起こるかわからない）。even thoughは事実（実際に起こっている）。",
          pronunciation: "even if（たとえ〜でも）/ even though（〜にもかかわらず）",
          example:
            "Even if the market recovers next quarter, we should hedge our positions. Even though profits rose last year, we must remain cautious.",
          exampleJa:
            "たとえ来四半期に市場が回復しても、ポジションをヘッジすべきです。昨年利益が増加したにもかかわらず、慎重であり続けなければなりません。",
        },
        {
          id: "adv-nuance-1-7",
          english: "while vs whereas",
          japanese:
            "whileは対比と同時性の両方。whereasは純粋な対比のみで、よりフォーマル。",
          pronunciation: "while（〜する一方で）/ whereas（〜であるのに対し）",
          example:
            "While the domestic division exceeded targets, the international unit underperformed; whereas revenue grew by 8%, net profit declined by 3%.",
          exampleJa:
            "国内部門は目標を上回りましたが、国際部門は低迷しました。収益は8%増加した一方で、純利益は3%減少しました。",
        },
        {
          id: "adv-nuance-1-8",
          english: "unless vs if not",
          japanese:
            "unlessは「〜でない限り」で例外条件を示す。if notはより広い否定条件で仮定法にも使える。",
          pronunciation: "unless（〜でない限り）/ if not（もし〜でなければ）",
          example:
            "The contract will auto-renew unless either party provides written notice 60 days prior to expiration.",
          exampleJa:
            "いずれかの当事者が満了の60日前に書面で通知しない限り、契約は自動更新されます。",
        },
        {
          id: "adv-nuance-1-9",
          english: "in case vs if",
          japanese:
            "in caseは「〜に備えて」予防的な行動。ifは「もし〜なら」条件に応じた行動。",
          pronunciation: "in case（〜に備えて）/ if（もし〜なら）",
          example:
            "We should prepare a contingency plan in case the supply chain is disrupted; if disruption occurs, we will activate Protocol B.",
          exampleJa:
            "サプライチェーンが途絶した場合に備えて緊急対策計画を準備すべきです。もし途絶が発生したら、プロトコルBを発動します。",
        },
        {
          id: "adv-nuance-1-10",
          english: "so as to vs in order to",
          japanese:
            "so as toは否定形(so as not to)で多用。in order toはより一般的な目的表現でフォーマル。",
          pronunciation: "so as to（〜するように）/ in order to（〜するために）",
          example:
            "The committee revised the guidelines so as not to conflict with existing regulations; they consulted legal counsel in order to ensure full compliance.",
          exampleJa:
            "委員会は既存の規制と矛盾しないようにガイドラインを改訂しました。完全なコンプライアンスを確保するために法律顧問に相談しました。",
        },
      ],
    },
    {
      id: "grammar-adv-nuance-2",
      title: "Formal vs Informal",
      titleJa: "フォーマル vs カジュアル",
      description:
        "Register differences between formal and informal equivalents for professional communication",
      items: [
        {
          id: "adv-nuance-2-1",
          english: "moreover / besides",
          japanese:
            "moreover（さらに）はフォーマルで論文・報告書向き。besides（それに）はカジュアルな会話向き。",
          pronunciation: "moreover（フォーマル）/ besides（カジュアル）",
          example:
            "The proposal addresses cost efficiency; moreover, it introduces a scalable framework for future expansion.",
          exampleJa:
            "その提案はコスト効率に対処しています。さらに、将来の拡張に向けたスケーラブルなフレームワークを導入しています。",
        },
        {
          id: "adv-nuance-2-2",
          english: "however / but",
          japanese:
            "however（しかしながら）はフォーマルで文書に適切。but（でも）はカジュアルな接続詞。",
          pronunciation: "however（フォーマル）/ but（カジュアル）",
          example:
            "The initial findings were promising; however, subsequent trials revealed significant limitations in the methodology.",
          exampleJa:
            "初期の調査結果は有望でした。しかしながら、その後の試験で手法に重大な限界があることが判明しました。",
        },
        {
          id: "adv-nuance-2-3",
          english: "therefore / so",
          japanese:
            "therefore（従って）はフォーマルで論理的結論を示す。so（だから）はカジュアルな日常表現。",
          pronunciation: "therefore（フォーマル）/ so（カジュアル）",
          example:
            "The audit revealed several material discrepancies; therefore, the board has requested an independent forensic review.",
          exampleJa:
            "監査でいくつかの重大な不一致が発覚しました。従って、取締役会は独立したフォレンジック調査を要請しました。",
        },
        {
          id: "adv-nuance-2-4",
          english: "regarding / about",
          japanese:
            "regarding（〜に関して）はフォーマルなビジネス文書向き。about（〜について）は汎用的。",
          pronunciation: "regarding（フォーマル）/ about（カジュアル）",
          example:
            "I am writing regarding the terms outlined in the memorandum of understanding dated March 15.",
          exampleJa:
            "3月15日付の覚書に記載されている条件に関してご連絡いたします。",
        },
        {
          id: "adv-nuance-2-5",
          english: "prior to / before",
          japanese:
            "prior to（〜に先立って）はフォーマルな法律・ビジネス文書向き。before（〜の前に）は一般的。",
          pronunciation: "prior to（フォーマル）/ before（カジュアル）",
          example:
            "All participants must complete the mandatory training module prior to gaining access to the laboratory facilities.",
          exampleJa:
            "すべての参加者は、実験施設へのアクセスを得る前に必須の研修モジュールを修了しなければなりません。",
        },
        {
          id: "adv-nuance-2-6",
          english: "subsequent to / after",
          japanese:
            "subsequent to（〜の後に）はフォーマルな報告書・契約書向き。after（〜の後で）は一般的。",
          pronunciation: "subsequent to（フォーマル）/ after（カジュアル）",
          example:
            "Subsequent to the restructuring, the organization achieved a 20% improvement in operational efficiency.",
          exampleJa:
            "組織再編の後、その組織は運営効率の20%改善を達成しました。",
        },
        {
          id: "adv-nuance-2-7",
          english: "commence / begin",
          japanese:
            "commence（開始する）はフォーマルな法律・式典の文脈。begin（始める）は一般的な表現。",
          pronunciation: "commence（フォーマル）/ begin（カジュアル）",
          example:
            "Construction of the new corporate headquarters will commence once the environmental impact assessment has been finalized.",
          exampleJa:
            "環境影響評価が確定次第、新しい本社ビルの建設が開始されます。",
        },
        {
          id: "adv-nuance-2-8",
          english: "terminate / end",
          japanese:
            "terminate（終了させる）はフォーマルで契約・雇用の打ち切りに使用。end（終わる）は一般的。",
          pronunciation: "terminate（フォーマル）/ end（カジュアル）",
          example:
            "The company reserves the right to terminate the service agreement if the vendor fails to meet the stipulated performance benchmarks.",
          exampleJa:
            "ベンダーが規定の業績基準を満たさない場合、会社はサービス契約を終了する権利を有します。",
        },
      ],
    },
  ],
};
