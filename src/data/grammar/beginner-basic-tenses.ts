import type { Category } from "../types";

export const beginnerBasicTenses: Category = {
  id: "bg-basic-tenses",
  title: "Basic Tenses",
  titleJa: "基本の時制",
  description: "Present, present continuous, and past — the three tenses you need first",
  icon: "🕐",
  color: "teal",
  lessons: [
    {
      id: "bg-basic-tenses-1",
      title: "Present Simple",
      titleJa: "現在形",
      description: "毎日すること・習慣・事実を伝える時制",
      items: [
        {
          id: "bg-basic-tenses-1-1",
          english: "I eat breakfast every morning. : 毎日の習慣を表す現在形",
          japanese:
            "毎日すること・習慣を伝えるとき、現在形を使います。every day, always などの言葉と一緒に使うことが多いです。",
          pronunciation: "アイ イート ブレックファスト",
          example: "I eat breakfast every morning.",
          exampleJa: "私は毎朝朝食を食べます。",
        },
        {
          id: "bg-basic-tenses-1-2",
          english: "She likes music. : 三人称単数は動詞に -s を付ける",
          japanese:
            "He / She / It が主語のとき、動詞の後ろに s を付けます。like → likes, play → plays。これが三単現のルールです。",
          pronunciation: "シー ライクス（s を忘れずに！）",
          example: "She likes Japanese food.",
          exampleJa: "彼女は日本料理が好きです。",
        },
        {
          id: "bg-basic-tenses-1-3",
          english: "Frequency adverbs: always, usually, sometimes, never",
          japanese:
            "「いつも」「たいてい」「ときどき」「決して～ない」。頻度を表す副詞は動詞の前に置きます。",
          pronunciation: "オールウェイズ、ユージュアリー、サムタイムズ、ネヴァー",
          example: "I usually walk to school.",
          exampleJa: "私はたいてい歩いて学校に行きます。",
        },
        {
          id: "bg-basic-tenses-1-4",
          english: "I don't like ~ : 現在形の否定文",
          japanese:
            "「～しません」「～が好きではない」と言うとき、don't + 動詞の原形 を使います。",
          pronunciation: "アイ ドント ライク",
          example: "I don't like rainy days.",
          exampleJa: "私は雨の日が好きではありません。",
        },
        {
          id: "bg-basic-tenses-1-5",
          english: "Do you ~? : 現在形の疑問文",
          japanese:
            "「～しますか？」と質問するとき、Do you + 動詞の原形？ にします。",
          pronunciation: "ドゥー ユー？",
          example: "Do you like animals?",
          exampleJa: "動物は好きですか？",
        },
        {
          id: "bg-basic-tenses-1-6",
          english: "The sun rises in the east. : 事実・真理も現在形",
          japanese:
            "変わらない事実や科学的な真理を言うときも現在形を使います。",
          pronunciation: "ザ サン ライジズ イン ジ イースト",
          example: "Water boils at 100 degrees.",
          exampleJa: "水は100度で沸騰します。",
        },
        {
          id: "bg-basic-tenses-1-7",
          english: "He doesn't ~ : 三人称単数の否定文は doesn't を使う",
          japanese:
            "He/She/It の否定文は doesn't + 動詞の原形。doesn't を使ったら動詞に s は付けません！",
          pronunciation: "ヒー ダズント（動詞は原形のまま）",
          example: "He doesn't drink coffee.",
          exampleJa: "彼はコーヒーを飲みません。",
        },
        {
          id: "bg-basic-tenses-1-8",
          english: "I go to school. / I study English. : 日課を表す",
          japanese:
            "自分の日常生活を英語で言ってみよう！日課や毎日のルーティンは現在形で表します。",
          pronunciation: "アイ ゴー トゥー スクール / アイ スタディ イングリッシュ",
          example: "I study English every day.",
          exampleJa: "私は毎日英語を勉強します。",
        },
      ],
    },
    {
      id: "bg-basic-tenses-2",
      title: "Present Continuous",
      titleJa: "現在進行形",
      description: "「今まさに～している」を伝える時制",
      items: [
        {
          id: "bg-basic-tenses-2-1",
          english: "I am eating. : am/is/are + 動詞-ing で進行形",
          japanese:
            "「今～している」と今まさにしている動作を表します。be動詞 + 動詞の-ing形で作ります。",
          pronunciation: "アイ アム イーティング",
          example: "I am eating lunch now.",
          exampleJa: "私は今昼ごはんを食べています。",
        },
        {
          id: "bg-basic-tenses-2-2",
          english: "She is reading a book. : 三人称も同じ作り方",
          japanese:
            "主語に合わせて be動詞を変えます。He/She/It → is、We/They → are。",
          pronunciation: "シー イズ リーディング",
          example: "She is reading a book in the park.",
          exampleJa: "彼女は公園で本を読んでいます。",
        },
        {
          id: "bg-basic-tenses-2-3",
          english: "right now / at the moment : 「今まさに」を表すキーワード",
          japanese:
            "now, right now, at the moment などの言葉と一緒に使うことが多いです。",
          pronunciation: "ライト ナウ / アット ザ モーメント",
          example: "They are playing soccer right now.",
          exampleJa: "彼らは今まさにサッカーをしています。",
        },
        {
          id: "bg-basic-tenses-2-4",
          english: "I'm not ~ing. : 進行形の否定文",
          japanese:
            "「今～していません」。be動詞のあとに not を付けます。I'm not / He isn't / They aren't。",
          pronunciation: "アイム ノット",
          example: "I'm not sleeping. I'm studying!",
          exampleJa: "寝てないよ。勉強してるんだ！",
        },
        {
          id: "bg-basic-tenses-2-5",
          english: "Are you ~ing? : 進行形の疑問文",
          japanese:
            "「今～していますか？」。be動詞を主語の前に出して質問します。",
          pronunciation: "アー ユー ～イング？",
          example: "Are you watching TV?",
          exampleJa: "テレビを見ていますか？",
        },
        {
          id: "bg-basic-tenses-2-6",
          english: "一時的な状況 : 「今だけ～している」",
          japanese:
            "いつもではなく今だけのことを言うときも進行形を使います。",
          pronunciation: "一時的な状況にも使えるよ",
          example: "I'm living with my parents this month.",
          exampleJa: "今月は実家に住んでいます。",
        },
        {
          id: "bg-basic-tenses-2-7",
          english: "-ing の作り方 : 動詞によってルールが違う",
          japanese:
            "基本はそのまま -ing。e で終わる語は e を取って -ing（make → making）。短母音+子音は子音を重ねる（run → running）。",
          pronunciation: "メイキング、ランニング、スイミング",
          example: "She is making dinner. He is running in the park.",
          exampleJa: "彼女は夕食を作っています。彼は公園を走っています。",
        },
        {
          id: "bg-basic-tenses-2-8",
          english: "状態動詞は進行形にしない : know, like, want など",
          japanese:
            "know（知っている）、like（好き）、want（欲しい）などの「状態」を表す動詞は普通、進行形にしません。",
          pronunciation: "I'm knowing は間違い！ → I know が正しい",
          example: "I know the answer. (I am knowing は使わない)",
          exampleJa: "私は答えを知っています。",
        },
      ],
    },
    {
      id: "bg-basic-tenses-3",
      title: "Simple Past",
      titleJa: "過去形",
      description: "「～した」と過去のことを伝える時制",
      items: [
        {
          id: "bg-basic-tenses-3-1",
          english: "I walked to school. : 規則動詞は -ed を付ける",
          japanese:
            "「～した」と過去の動作を表すとき、動詞に -ed を付けます。walk → walked, play → played。",
          pronunciation: "アイ ウォークト（-ed の発音は t, d, id の3パターン）",
          example: "I walked to school yesterday.",
          exampleJa: "昨日、学校まで歩きました。",
        },
        {
          id: "bg-basic-tenses-3-2",
          english: "went (go の過去形) : 不規則動詞は形が変わる",
          japanese:
            "go → went のように、-ed ではなく形そのものが変わる動詞があります。覚えるしかない！",
          pronunciation: "ウェント（go → went）",
          example: "I went to the park after school.",
          exampleJa: "放課後、公園に行きました。",
        },
        {
          id: "bg-basic-tenses-3-3",
          english: "had (have の過去形) : 「持っていた」",
          japanese:
            "have → had。「～を持っていた」「～を食べた」など過去のことに使います。",
          pronunciation: "ハド（have → had）",
          example: "I had a great time at the party.",
          exampleJa: "パーティーでとても楽しい時間を過ごしました。",
        },
        {
          id: "bg-basic-tenses-3-4",
          english: "made (make の過去形) : 「作った」",
          japanese: "make → made。「～を作った」「～をした」を表します。",
          pronunciation: "メイド（make → made）",
          example: "My mom made a cake for my birthday.",
          exampleJa: "お母さんが誕生日にケーキを作ってくれました。",
        },
        {
          id: "bg-basic-tenses-3-5",
          english: "saw (see の過去形) : 「見た」",
          japanese:
            "see → saw。「～を見た」「～に会った」を表します。",
          pronunciation: "ソー（see → saw）",
          example: "I saw a rainbow this morning.",
          exampleJa: "今朝、虹を見ました。",
        },
        {
          id: "bg-basic-tenses-3-6",
          english: "got (get の過去形) : 「もらった・手に入れた」",
          japanese:
            "get → got。「～をもらった」「～になった」など、とても多くの意味があります。",
          pronunciation: "ゴット（get → got）",
          example: "I got a present from my friend.",
          exampleJa: "友達からプレゼントをもらいました。",
        },
        {
          id: "bg-basic-tenses-3-7",
          english: "took (take の過去形) : 「取った・撮った」",
          japanese:
            "take → took。「～を取った」「写真を撮った」「時間がかかった」などに使います。",
          pronunciation: "トゥック（take → took）",
          example: "I took many photos on my trip.",
          exampleJa: "旅行でたくさん写真を撮りました。",
        },
        {
          id: "bg-basic-tenses-3-8",
          english: "came (come の過去形) / said (say の過去形)",
          japanese:
            "come → came（来た）、say → said（言った）。日常会話でとてもよく使います。",
          pronunciation: "ケイム / セド（said は「セド」と発音）",
          example: "She came to my house and said hello.",
          exampleJa: "彼女が家に来て、こんにちはと言いました。",
        },
        {
          id: "bg-basic-tenses-3-9",
          english: "I didn't ~ : 過去形の否定文は didn't + 動詞の原形",
          japanese:
            "「～しなかった」。didn't のあとは動詞の原形に戻します（went ではなく go）。",
          pronunciation: "アイ ディドゥント（動詞は原形に戻す！）",
          example: "I didn't go to school yesterday.",
          exampleJa: "昨日、学校に行きませんでした。",
        },
        {
          id: "bg-basic-tenses-3-10",
          english: "Did you ~? : 過去形の疑問文は Did + 主語 + 動詞の原形",
          japanese:
            "「～しましたか？」と過去のことを聞くとき。Did のあとは動詞の原形にします。",
          pronunciation: "ディド ユー？（動詞は原形にするのがポイント）",
          example: "Did you enjoy the movie? — Yes, I did!",
          exampleJa: "映画は楽しかったですか？ — はい、楽しかったです！",
        },
      ],
    },
  ],
};
