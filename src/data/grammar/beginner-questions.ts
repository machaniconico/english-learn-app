import type { Category } from "../types";

export const beginnerQuestions: Category = {
  id: "bg-questions",
  title: "Asking Questions",
  titleJa: "質問の仕方",
  description: "Learn how to ask questions — the key to conversation",
  icon: "❓",
  color: "cyan",
  lessons: [
    {
      id: "bg-questions-1",
      title: "WH Questions",
      titleJa: "疑問詞",
      description: "What, Where, When, Who, Why, How — 質問の万能ツール",
      items: [
        {
          id: "bg-questions-1-1",
          english: "What : 「何」をたずねる疑問詞",
          japanese:
            "「何ですか？」「何をしますか？」など、ものや内容をたずねるときに使います。",
          pronunciation: "ワット（wh を「ウ」と発音）",
          example: "What is your name?",
          exampleJa: "あなたの名前は何ですか？",
        },
        {
          id: "bg-questions-1-2",
          english: "Where : 「どこ」をたずねる疑問詞",
          japanese:
            "場所をたずねるときに使います。「どこにありますか？」「どこに行きますか？」",
          pronunciation: "ウェア（where の wh は「ウ」の音）",
          example: "Where is the station?",
          exampleJa: "駅はどこですか？",
        },
        {
          id: "bg-questions-1-3",
          english: "When : 「いつ」をたずねる疑問詞",
          japanese:
            "時間・時期をたずねるときに使います。「いつですか？」「いつ始まりますか？」",
          pronunciation: "ウェン（when の e は短く）",
          example: "When is your birthday?",
          exampleJa: "あなたの誕生日はいつですか？",
        },
        {
          id: "bg-questions-1-4",
          english: "Who : 「誰」をたずねる疑問詞",
          japanese:
            "人についてたずねるときに使います。「誰ですか？」「誰が来ますか？」",
          pronunciation: "フー（who の w は発音しない）",
          example: "Who is that girl?",
          exampleJa: "あの女の子は誰ですか？",
        },
        {
          id: "bg-questions-1-5",
          english: "Why : 「なぜ」をたずねる疑問詞",
          japanese:
            "理由をたずねるときに使います。答えるときは Because で始めます。",
          pronunciation: "ワイ（why の y は「アイ」の音）",
          example: "Why are you happy? — Because it's Friday!",
          exampleJa: "なぜ嬉しいの？ — 金曜日だから！",
        },
        {
          id: "bg-questions-1-6",
          english: "How : 「どのように」をたずねる疑問詞",
          japanese:
            "方法・手段・状態をたずねるときに使います。「どうやって？」「調子はどう？」",
          pronunciation: "ハウ",
          example: "How are you? — I'm fine, thank you.",
          exampleJa: "元気ですか？ — 元気です、ありがとう。",
        },
        {
          id: "bg-questions-1-7",
          english: "How many : 「いくつ」と数をたずねる（数えられるもの）",
          japanese:
            "数えられるものの数量をたずねます。How many のあとは複数形の名詞を置きます。",
          pronunciation: "ハウ メニー",
          example: "How many brothers do you have?",
          exampleJa: "兄弟は何人いますか？",
        },
        {
          id: "bg-questions-1-8",
          english: "How much : 「いくら・どのくらい」と量や値段をたずねる",
          japanese:
            "数えられないものの量や、値段をたずねるときに使います。",
          pronunciation: "ハウ マッチ",
          example: "How much is this T-shirt?",
          exampleJa: "このTシャツはいくらですか？",
        },
        {
          id: "bg-questions-1-9",
          english: "How long : 「どのくらい」と時間の長さをたずねる",
          japanese:
            "時間の長さや期間をたずねるときに使います。距離の長さにも使えます。",
          pronunciation: "ハウ ロング",
          example: "How long does it take to the airport?",
          exampleJa: "空港までどのくらいかかりますか？",
        },
        {
          id: "bg-questions-1-10",
          english: "How often : 「どのくらいの頻度で」と回数をたずねる",
          japanese:
            "頻度をたずねるときに使います。答えは every day, twice a week などになります。",
          pronunciation: "ハウ オーフン",
          example: "How often do you exercise?",
          exampleJa: "どのくらいの頻度で運動しますか？",
        },
      ],
    },
    {
      id: "bg-questions-2",
      title: "Yes/No Questions",
      titleJa: "Yes/No疑問文",
      description: "「はい」か「いいえ」で答えられる質問の作り方",
      items: [
        {
          id: "bg-questions-2-1",
          english: "Do you ~? : 「あなたは～しますか？」",
          japanese:
            "相手の習慣や好みをたずねるときに使います。Do you + 動詞の原形？ の形です。",
          pronunciation: "ドゥー ユー？（語尾を上げて発音）",
          example: "Do you like music? — Yes, I do.",
          exampleJa: "音楽は好きですか？ — はい、好きです。",
        },
        {
          id: "bg-questions-2-2",
          english: "Is it ~? : 「それは～ですか？」",
          japanese:
            "ものや状況について確認するときに使います。Is it + 形容詞/名詞？ の形です。",
          pronunciation: "イズ イット？",
          example: "Is it cold outside? — Yes, it is.",
          exampleJa: "外は寒いですか？ — はい、寒いです。",
        },
        {
          id: "bg-questions-2-3",
          english: "Can you ~? : 「～できますか？」「～してくれますか？」",
          japanese:
            "能力をたずねたり、お願いしたりするときに使います。とても便利な表現！",
          pronunciation: "キャン ユー？",
          example: "Can you help me? — Sure!",
          exampleJa: "手伝ってもらえますか？ — もちろん！",
        },
        {
          id: "bg-questions-2-4",
          english: "Will you ~? : 「～してくれますか？」（未来・お願い）",
          japanese:
            "未来のことをたずねたり、丁寧にお願いするときに使います。",
          pronunciation: "ウィル ユー？",
          example: "Will you come to the party?",
          exampleJa: "パーティーに来てくれますか？",
        },
        {
          id: "bg-questions-2-5",
          english: "Are there ~? : 「～がありますか？」（複数）",
          japanese:
            "ある場所に複数のものがあるかたずねるときに使います。",
          pronunciation: "アー ゼア？",
          example: "Are there any restaurants near here?",
          exampleJa: "この近くにレストランはありますか？",
        },
        {
          id: "bg-questions-2-6",
          english: "Did you ~? : 「あなたは～しましたか？」（過去）",
          japanese:
            "過去にしたことをたずねるときに使います。Did you + 動詞の原形？ の形です。",
          pronunciation: "ディド ユー？（動詞は原形にするのがポイント）",
          example: "Did you eat breakfast? — No, I didn't.",
          exampleJa: "朝ごはんを食べましたか？ — いいえ、食べませんでした。",
        },
        {
          id: "bg-questions-2-7",
          english: "Have you ~? : 「～したことがありますか？」（経験）",
          japanese:
            "経験をたずねるときに使います。Have you + 過去分詞？ の形です。",
          pronunciation: "ハヴ ユー？",
          example: "Have you been to Tokyo? — Yes, I have.",
          exampleJa: "東京に行ったことがありますか？ — はい、あります。",
        },
        {
          id: "bg-questions-2-8",
          english: "Would you ~? : 「～していただけますか？」（丁寧なお願い）",
          japanese:
            "Can you よりも丁寧にお願いするとき使います。Would you like ~? は「～はいかがですか？」。",
          pronunciation: "ウッジュー？（would you は「ウッジュー」と発音）",
          example: "Would you like some tea?",
          exampleJa: "お茶はいかがですか？",
        },
      ],
    },
  ],
};
