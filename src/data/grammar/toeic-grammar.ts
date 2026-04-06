import type { Category } from "../types";

export const toeicGrammar: Category = {
  id: "grammar-toeic",
  title: "TOEIC Grammar",
  titleJa: "TOEIC頻出文法",
  description:
    "Grammar patterns frequently tested in TOEIC Part 5 and Part 6",
  icon: "🎯",
  color: "red",
  lessons: [
    {
      id: "grammar-toeic-1",
      title: "Subject-Verb Agreement",
      titleJa: "主語と動詞の一致",
      description:
        "Ensuring the verb matches the subject in number and person",
      items: [
        {
          id: "grammar-toeic-1-1",
          english:
            "Singular Subject + Singular Verb: The manager approves",
          japanese:
            "単数の主語には単数の動詞を使う。三人称単数現在ではs/esが付く。",
          pronunciation: "単数主語には動詞にsを付ける",
          example:
            "The manager approves all travel expense requests personally.",
          exampleJa:
            "マネージャーはすべての出張経費の申請を自ら承認します。",
        },
        {
          id: "grammar-toeic-1-2",
          english: "Plural Subject + Plural Verb: The employees work",
          japanese:
            "複数の主語には複数の動詞（原形）を使う。sは付けない。",
          pronunciation: "複数主語では動詞にsを付けない",
          example:
            "The employees work collaboratively to meet project deadlines.",
          exampleJa:
            "従業員たちはプロジェクトの締め切りを守るために協力して働きます。",
        },
        {
          id: "grammar-toeic-1-3",
          english:
            "Prepositional Phrase Between Subject and Verb: Ignore for agreement",
          japanese:
            "主語と動詞の間の前置詞句は一致に影響しない。主語の数に合わせる。",
          pronunciation: "間に挟まる前置詞句に惑わされない",
          example:
            "The list of qualified candidates has been narrowed down to five.",
          exampleJa:
            "有資格候補者のリストは5名に絞られました。",
        },
        {
          id: "grammar-toeic-1-4",
          english: "Each / Every + Singular Verb",
          japanese:
            "each, everyの後は単数名詞+単数動詞。「それぞれの」なので単数扱い。",
          pronunciation: "each/everyは必ず単数扱い",
          example:
            "Each department is required to submit a quarterly performance review.",
          exampleJa:
            "各部門は四半期ごとの業績レビューを提出する必要があります。",
        },
        {
          id: "grammar-toeic-1-5",
          english:
            "Neither...nor / Either...or: Verb agrees with nearest subject",
          japanese:
            "neither...norやeither...orでは動詞は近い方の主語に一致させる。",
          pronunciation: "動詞は近い方の主語に合わせる",
          example:
            "Neither the director nor the managers have received the updated schedule.",
          exampleJa:
            "部長もマネージャーたちも更新されたスケジュールを受け取っていません。",
        },
        {
          id: "grammar-toeic-1-6",
          english:
            "The number of + Plural Noun + Singular Verb",
          japanese:
            "the number of（～の数）は単数扱い。a number of（多くの）は複数扱い。",
          pronunciation: "the number of→単数、a number of→複数",
          example:
            "The number of applicants has increased significantly this year.",
          exampleJa:
            "応募者の数は今年大幅に増加しました。",
        },
        {
          id: "grammar-toeic-1-7",
          english: "Uncountable Nouns + Singular Verb",
          japanese:
            "不可算名詞は常に単数扱い。equipment, information, furnitureなど。",
          pronunciation: "不可算名詞は単数動詞を使う",
          example:
            "The equipment in the laboratory needs to be calibrated regularly.",
          exampleJa:
            "研究室の機器は定期的に校正する必要があります。",
        },
        {
          id: "grammar-toeic-1-8",
          english:
            "Gerund/Infinitive as Subject + Singular Verb",
          japanese:
            "動名詞や不定詞が主語のときは単数扱いにする。",
          pronunciation: "動名詞・不定詞の主語は単数扱い",
          example:
            "Attending industry conferences is an effective way to expand your network.",
          exampleJa:
            "業界のカンファレンスに参加することは人脈を広げる効果的な方法です。",
        },
      ],
    },
    {
      id: "grammar-toeic-2",
      title: "Conjunctions & Connectors",
      titleJa: "接続詞",
      description:
        "Linking words and phrases commonly tested in TOEIC",
      items: [
        {
          id: "grammar-toeic-2-1",
          english: "Although / Even though + clause: Contrast",
          japanese:
            "although / even thoughは「～だけれども」。接続詞なので後ろに節（主語+動詞）が続く。",
          pronunciation: "「～だけれども」の接続詞although",
          example:
            "Although the initial costs were high, the investment paid off within two years.",
          exampleJa:
            "初期費用は高かったものの、投資は2年以内に回収できました。",
        },
        {
          id: "grammar-toeic-2-2",
          english: "Despite / In spite of + noun/gerund: Contrast",
          japanese:
            "despite / in spite ofは「～にもかかわらず」。前置詞なので後ろに名詞・動名詞が続く。",
          pronunciation: "despiteの後は名詞か動名詞（節は不可）",
          example:
            "Despite the economic downturn, the company managed to increase its market share.",
          exampleJa:
            "景気後退にもかかわらず、会社は市場シェアを拡大することができました。",
        },
        {
          id: "grammar-toeic-2-3",
          english: "Whereas / While: Showing contrast between two facts",
          japanese:
            "whereas / whileは2つの事実を対比する接続詞。「一方で」の意味。",
          pronunciation: "2つの対比にはwhereas / whileを使う",
          example:
            "The Tokyo office focuses on domestic clients, whereas the Singapore office handles international accounts.",
          exampleJa:
            "東京オフィスは国内クライアントに注力し、一方シンガポールオフィスは海外アカウントを担当しています。",
        },
        {
          id: "grammar-toeic-2-4",
          english:
            "Not only...but also: Adding emphasis to two related ideas",
          japanese:
            "not only...but also（～だけでなく…も）。2つの事柄を強調して並べる。",
          pronunciation: "「～だけでなく…も」のnot only...but also",
          example:
            "The training program not only improves technical skills but also enhances leadership abilities.",
          exampleJa:
            "その研修プログラムは技術スキルだけでなくリーダーシップ能力も向上させます。",
        },
        {
          id: "grammar-toeic-2-5",
          english: "Either...or: Presenting two alternatives",
          japanese:
            "either...or（～か…のどちらか）。2つの選択肢を提示する。",
          pronunciation: "「どちらか一方」のeither...or",
          example:
            "Employees can submit their timesheets either online or in person at the HR office.",
          exampleJa:
            "従業員はタイムシートをオンラインまたは人事部で直接提出できます。",
        },
        {
          id: "grammar-toeic-2-6",
          english: "Neither...nor: Negating two alternatives",
          japanese:
            "neither...nor（～も…もない）。2つの選択肢を両方否定する。",
          pronunciation: "「どちらも～ない」のneither...nor",
          example:
            "Neither the sales team nor the marketing department has finalized the campaign plan.",
          exampleJa:
            "営業チームもマーケティング部もキャンペーン計画を最終決定していません。",
        },
        {
          id: "grammar-toeic-2-7",
          english: "Therefore / Consequently / As a result: Cause and effect",
          japanese:
            "therefore, consequently, as a resultは結果を導く接続副詞。セミコロンまたはピリオドの後で使う。",
          pronunciation: "結果を示すtherefore / consequentlyは文頭か接続に使う",
          example:
            "The factory experienced a power outage; therefore, production was halted for six hours.",
          exampleJa:
            "工場で停電が発生し、そのため生産が6時間停止しました。",
        },
        {
          id: "grammar-toeic-2-8",
          english:
            "Furthermore / Moreover / In addition: Adding information",
          japanese:
            "furthermore, moreover, in additionは情報を追加する接続副詞。「さらに」の意味。",
          pronunciation: "情報の追加にはfurthermore / moreoverを使う",
          example:
            "The hotel offers free Wi-Fi. Furthermore, guests have access to the business center.",
          exampleJa:
            "そのホテルは無料Wi-Fiを提供しています。さらに、宿泊客はビジネスセンターを利用できます。",
        },
        {
          id: "grammar-toeic-2-9",
          english: "However / Nevertheless / Nonetheless: Unexpected contrast",
          japanese:
            "however, nevertheless, nonethelessは予想に反する結果を示す。「しかしながら」の意味。",
          pronunciation: "予想外の結果にはhowever / neverthelessを使う",
          example:
            "The weather conditions were unfavorable. Nevertheless, the outdoor event proceeded as planned.",
          exampleJa:
            "天候条件は不利でした。それにもかかわらず、屋外イベントは予定通り行われました。",
        },
        {
          id: "grammar-toeic-2-10",
          english:
            "So that / In order to: Expressing purpose",
          japanese:
            "so that+節（～するために）、in order to+動詞（～する目的で）。目的を表す。",
          pronunciation: "目的を表すso that / in order to",
          example:
            "The company redesigned its website in order to attract more international customers.",
          exampleJa:
            "会社はより多くの海外顧客を引きつけるためにウェブサイトをリニューアルしました。",
        },
      ],
    },
    {
      id: "grammar-toeic-3",
      title: "Infinitives & Gerunds",
      titleJa: "不定詞と動名詞",
      description:
        "Verbs followed by to-infinitive, gerund, or both",
      items: [
        {
          id: "grammar-toeic-3-1",
          english:
            "Verb + to-infinitive: decide, plan, agree, expect, hope, offer, promise, refuse",
          japanese:
            "to不定詞を目的語に取る動詞。decide to do, plan to doなど。未来志向の動詞が多い。",
          pronunciation: "未来志向の動詞はto不定詞を取ることが多い",
          example:
            "The board decided to invest in renewable energy projects.",
          exampleJa:
            "取締役会は再生可能エネルギー事業に投資することを決定しました。",
        },
        {
          id: "grammar-toeic-3-2",
          english:
            "Verb + gerund: enjoy, avoid, consider, suggest, finish, mind, postpone, deny",
          japanese:
            "動名詞を目的語に取る動詞。enjoy doing, avoid doingなど。",
          pronunciation: "enjoy, avoidなどの後は動名詞（-ing形）",
          example:
            "The committee suggested postponing the product launch until next quarter.",
          exampleJa:
            "委員会は製品の発売を来四半期まで延期することを提案しました。",
        },
        {
          id: "grammar-toeic-3-3",
          english:
            "Verb + both (same meaning): begin, start, continue, like, love, hate, prefer",
          japanese:
            "to不定詞と動名詞のどちらでも意味が変わらない動詞。begin to do = begin doingなど。",
          pronunciation: "begin, start, continueはどちらでもOK",
          example:
            "The company started offering remote work options last year.",
          exampleJa:
            "会社は昨年からリモートワークのオプションを提供し始めました。",
        },
        {
          id: "grammar-toeic-3-4",
          english:
            "Verb + both (different meaning): remember, forget, stop, try, regret",
          japanese:
            "to不定詞と動名詞で意味が変わる動詞。remember to do（忘れずに～する）vs. remember doing（～したことを覚えている）。",
          pronunciation: "to doは未来、doingは過去のニュアンス",
          example:
            "Please remember to lock the office before you leave tonight.",
          exampleJa:
            "今夜帰る前にオフィスの施錠を忘れないでください。",
        },
        {
          id: "grammar-toeic-3-5",
          english: "Preposition + gerund: interested in, good at, responsible for",
          japanese:
            "前置詞の後は動名詞（-ing形）を使う。to不定詞は使えない。TOEIC頻出パターン。",
          pronunciation: "前置詞の後は必ず-ing形",
          example:
            "She is responsible for managing the entire supply chain.",
          exampleJa:
            "彼女はサプライチェーン全体の管理を担当しています。",
        },
        {
          id: "grammar-toeic-3-6",
          english:
            "Adjective + to-infinitive: happy to, ready to, willing to, able to",
          japanese:
            "形容詞+to不定詞。感情や意志を表す形容詞の後にto不定詞が続く。",
          pronunciation: "形容詞の後はto不定詞が続くパターンが多い",
          example:
            "Our technical support team is ready to assist you with any issues.",
          exampleJa:
            "当社の技術サポートチームがあらゆる問題をお手伝いいたします。",
        },
        {
          id: "grammar-toeic-3-7",
          english:
            "Verb + Object + to-infinitive: ask, tell, advise, allow, encourage, require",
          japanese:
            "動詞+目的語+to不定詞の形。ask someone to do, tell someone to doなど。",
          pronunciation: "「人に～するよう頼む」はask + 人 + to do",
          example:
            "The supervisor asked the team to complete the safety training by Friday.",
          exampleJa:
            "監督者はチームに金曜日までに安全研修を完了するよう求めました。",
        },
        {
          id: "grammar-toeic-3-8",
          english:
            "Gerund as Subject: Doing something is...",
          japanese:
            "動名詞は文の主語になれる。単数扱いで動詞は三人称単数形を使う。",
          pronunciation: "動名詞の主語は単数扱いにする",
          example:
            "Networking with industry professionals is essential for career development.",
          exampleJa:
            "業界の専門家とのネットワーキングはキャリア開発に不可欠です。",
        },
      ],
    },
  ],
};
