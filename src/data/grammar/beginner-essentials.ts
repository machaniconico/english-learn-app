import type { Category } from "../types";

export const beginnerEssentials: Category = {
  id: "bg-essentials",
  title: "Essential Patterns",
  titleJa: "基本パターン",
  description: "Daily life English patterns you will use every day",
  icon: "⭐",
  color: "yellow",
  lessons: [
    {
      id: "bg-essentials-1",
      title: "Can / Can't",
      titleJa: "できる・できない",
      description: "「～できる」「～できない」の表現をマスターしよう",
      items: [
        {
          id: "bg-essentials-1-1",
          english: "I can swim. : 「私は泳げます」— can + 動詞の原形",
          japanese:
            "「～できる」と言うとき can を使います。can のあとの動詞は原形のまま！",
          pronunciation: "アイ キャン スウィム（can は軽く「クン」と発音することも）",
          example: "I can swim very fast.",
          exampleJa: "私はとても速く泳げます。",
        },
        {
          id: "bg-essentials-1-2",
          english: "She can speak English. : 能力を表す can",
          japanese:
            "「彼女は英語を話せます」。He/She/It が主語でも can は変わりません（cans にならない！）。",
          pronunciation: "シー キャン スピーク イングリッシュ",
          example: "She can speak three languages.",
          exampleJa: "彼女は3つの言語を話せます。",
        },
        {
          id: "bg-essentials-1-3",
          english: "Can you ~? : 「～できますか？」と能力をたずねる",
          japanese:
            "相手ができるかどうか聞くとき。「～してくれますか？」とお願いにも使えます。",
          pronunciation: "キャン ユー？",
          example: "Can you play the guitar?",
          exampleJa: "ギターを弾けますか？",
        },
        {
          id: "bg-essentials-1-4",
          english: "I can't ~ : 「私は～できません」— can not の短縮形",
          japanese:
            "「～できない」は can't（cannot）。can't の発音に注意しよう！",
          pronunciation: "アイ キャント（can't の t をしっかり発音）",
          example: "I can't drive a car yet.",
          exampleJa: "私はまだ車を運転できません。",
        },
        {
          id: "bg-essentials-1-5",
          english: "Can I ~? : 許可を求める「～してもいいですか？」",
          japanese:
            "「～してもいいですか？」と許可を求めるときにも can を使います。",
          pronunciation: "キャン アイ？",
          example: "Can I sit here?",
          exampleJa: "ここに座ってもいいですか？",
        },
        {
          id: "bg-essentials-1-6",
          english: "You can ~ : 許可を与える「～していいですよ」",
          japanese:
            "「～していいですよ」と許可するときに使います。能力だけでなく許可にも使える！",
          pronunciation: "ユー キャン",
          example: "You can use my pen.",
          exampleJa: "私のペンを使っていいですよ。",
        },
        {
          id: "bg-essentials-1-7",
          english: "Can you ~ please? : 丁寧にお願いする",
          japanese:
            "please を付けるとより丁寧なお願いになります。日常会話でよく使います。",
          pronunciation: "キャン ユー ～ プリーズ？",
          example: "Can you open the window, please?",
          exampleJa: "窓を開けてもらえますか？",
        },
        {
          id: "bg-essentials-1-8",
          english: "I can see / hear / smell ~ : 感覚を表す can",
          japanese:
            "「見える」「聞こえる」「匂いがする」など、感覚を表すときにも can を使います。",
          pronunciation: "アイ キャン シー / ヒア / スメル",
          example: "I can see the mountain from my window.",
          exampleJa: "窓から山が見えます。",
        },
      ],
    },
    {
      id: "bg-essentials-2",
      title: "There is / There are",
      titleJa: "〜がある",
      description: "「～がある」「～がいる」の表現",
      items: [
        {
          id: "bg-essentials-2-1",
          english: "There is a ~ : 「～が1つあります」（単数）",
          japanese:
            "「～がある」「～がいる」と存在を表すとき、There is + 単数名詞 を使います。",
          pronunciation: "ゼア イズ ア（There's と短くできるよ）",
          example: "There is a cat on the sofa.",
          exampleJa: "ソファの上に猫が1匹います。",
        },
        {
          id: "bg-essentials-2-2",
          english: "There are many ~ : 「たくさんの～があります」（複数）",
          japanese:
            "複数のものがあることを伝えるとき、There are + 複数名詞 を使います。",
          pronunciation: "ゼア アー メニー",
          example: "There are many books in the library.",
          exampleJa: "図書館にはたくさんの本があります。",
        },
        {
          id: "bg-essentials-2-3",
          english: "Is there ~? : 「～はありますか？」とたずねる",
          japanese:
            "何かが存在するかたずねるとき、Is there ~? を使います。There と is を入れ替えるだけ！",
          pronunciation: "イズ ゼア？",
          example: "Is there a bathroom near here?",
          exampleJa: "この近くにトイレはありますか？",
        },
        {
          id: "bg-essentials-2-4",
          english: "There isn't ~ : 「～はありません」（単数の否定）",
          japanese:
            "「～がない」と言うとき、There isn't（is not）を使います。",
          pronunciation: "ゼア イズント",
          example: "There isn't a park in this town.",
          exampleJa: "この町には公園がありません。",
        },
        {
          id: "bg-essentials-2-5",
          english: "There are no ~ : 「～は全くありません」（複数の否定）",
          japanese:
            "複数のものが全くないとき、There are no + 複数名詞 を使います。",
          pronunciation: "ゼア アー ノー",
          example: "There are no eggs in the fridge.",
          exampleJa: "冷蔵庫に卵が全くありません。",
        },
        {
          id: "bg-essentials-2-6",
          english: "How many ~ are there? : 「いくつありますか？」",
          japanese:
            "数をたずねるとき、How many + 複数名詞 + are there? を使います。",
          pronunciation: "ハウ メニー ～ アー ゼア？",
          example: "How many students are there in your class?",
          exampleJa: "あなたのクラスには何人の生徒がいますか？",
        },
        {
          id: "bg-essentials-2-7",
          english: "There is some ~ : 「いくらかの～があります」（数えられない名詞）",
          japanese:
            "水・お金・時間など数えられないものにも There is を使います。some は「いくらかの」。",
          pronunciation: "ゼア イズ サム",
          example: "There is some water in the bottle.",
          exampleJa: "ボトルに水がいくらか入っています。",
        },
        {
          id: "bg-essentials-2-8",
          english: "There are ~ and ~ : 複数のものを並べて言う",
          japanese:
            "「～と～があります」と複数のものを列挙するときにも使えます。",
          pronunciation: "ゼア アー ～ アンド ～",
          example: "There are a table and four chairs in the room.",
          exampleJa: "部屋にはテーブルが1つと椅子が4つあります。",
        },
      ],
    },
    {
      id: "bg-essentials-3",
      title: "Want to / Need to / Have to",
      titleJa: "したい・必要・しなければ",
      description: "気持ちや義務を伝える大切な表現",
      items: [
        {
          id: "bg-essentials-3-1",
          english: "I want to ~ : 「私は～したいです」",
          japanese:
            "「～したい」と自分の希望を伝えるとき、want to + 動詞の原形 を使います。",
          pronunciation: "アイ ウォント トゥー（want to は「ワナ」と発音することも）",
          example: "I want to eat pizza tonight.",
          exampleJa: "今夜ピザを食べたいです。",
        },
        {
          id: "bg-essentials-3-2",
          english: "Do you want to ~? : 「～したいですか？」と誘う",
          japanese:
            "相手に「～したい？」と聞いたり、誘ったりするときに使います。",
          pronunciation: "ドゥー ユー ウォント トゥー？（Wanna と言うことも）",
          example: "Do you want to go to the movies?",
          exampleJa: "映画に行きたいですか？",
        },
        {
          id: "bg-essentials-3-3",
          english: "I need to ~ : 「私は～する必要があります」",
          japanese:
            "「～しなきゃ」と必要なことを伝えるとき、need to + 動詞の原形 を使います。",
          pronunciation: "アイ ニード トゥー",
          example: "I need to study for the test.",
          exampleJa: "テストのために勉強する必要があります。",
        },
        {
          id: "bg-essentials-3-4",
          english: "You have to ~ : 「あなたは～しなければなりません」",
          japanese:
            "義務やルールで「～しなければならない」とき、have to + 動詞の原形 を使います。",
          pronunciation: "ユー ハフ トゥー（have to は「ハフトゥー」と発音）",
          example: "You have to wear a seatbelt.",
          exampleJa: "シートベルトを着用しなければなりません。",
        },
        {
          id: "bg-essentials-3-5",
          english: "You don't have to ~ : 「～しなくてもいいです」",
          japanese:
            "「～する必要はないですよ」と義務がないことを伝えます。must not（禁止）とは違うので注意！",
          pronunciation: "ユー ドント ハフ トゥー",
          example: "You don't have to come early.",
          exampleJa: "早く来なくてもいいですよ。",
        },
        {
          id: "bg-essentials-3-6",
          english: "I'd like to ~ : 「～したいのですが」（丁寧な want to）",
          japanese:
            "want to のより丁寧な言い方。レストランの注文やビジネスでよく使います。",
          pronunciation: "アイド ライク トゥー（I would like to の短縮形）",
          example: "I'd like to order a coffee, please.",
          exampleJa: "コーヒーを注文したいのですが。",
        },
        {
          id: "bg-essentials-3-7",
          english: "I don't want to ~ : 「～したくありません」",
          japanese:
            "「～したくない」と否定するとき。don't want to + 動詞の原形の形です。",
          pronunciation: "アイ ドント ウォント トゥー",
          example: "I don't want to be late.",
          exampleJa: "遅刻したくありません。",
        },
        {
          id: "bg-essentials-3-8",
          english: "Do I need to ~? : 「～する必要がありますか？」",
          japanese:
            "何かをする必要があるか確認するときに使います。旅行や手続きで便利！",
          pronunciation: "ドゥー アイ ニード トゥー？",
          example: "Do I need to bring my passport?",
          exampleJa: "パスポートを持っていく必要がありますか？",
        },
      ],
    },
  ],
};
