import type { Category } from "../types";

export const beginnerBasics: Category = {
  id: "bg-basics",
  title: "Grammar Basics",
  titleJa: "文法の基本",
  description: "Start your English journey with the most fundamental grammar rules",
  icon: "🌱",
  color: "lime",
  lessons: [
    {
      id: "bg-basics-1",
      title: "Be Verbs",
      titleJa: "be動詞",
      description: "I am, You are, He is — the most important verb in English",
      items: [
        {
          id: "bg-basics-1-1",
          english: "I am ~ : 自分のことを言うときは am を使う",
          japanese:
            "「私は～です」と言うとき、I のあとに am を使います。自己紹介の基本！",
          pronunciation: "アイ アム（I'm と短くできるよ）",
          example: "I am a student.",
          exampleJa: "私は学生です。",
        },
        {
          id: "bg-basics-1-2",
          english: "You are ~ : 相手のことを言うときは are を使う",
          japanese:
            "「あなたは～です」と言うとき、You のあとに are を使います。",
          pronunciation: "ユー アー（You're と短くできるよ）",
          example: "You are kind.",
          exampleJa: "あなたは優しいです。",
        },
        {
          id: "bg-basics-1-3",
          english: "He is ~ / She is ~ : 他の人のことを言うときは is を使う",
          japanese:
            "「彼は～です」「彼女は～です」と言うとき、He/She のあとに is を使います。",
          pronunciation: "ヒー イズ / シー イズ（He's / She's と短くできるよ）",
          example: "She is my friend.",
          exampleJa: "彼女は私の友達です。",
        },
        {
          id: "bg-basics-1-4",
          english: "We are ~ : 私たちのことを言うときは are を使う",
          japanese:
            "「私たちは～です」と言うとき、We のあとに are を使います。",
          pronunciation: "ウィー アー（We're と短くできるよ）",
          example: "We are happy.",
          exampleJa: "私たちは幸せです。",
        },
        {
          id: "bg-basics-1-5",
          english: "They are ~ : 彼ら・彼女らのことを言うときは are を使う",
          japanese:
            "「彼らは～です」と言うとき、They のあとに are を使います。",
          pronunciation: "ゼイ アー（They're と短くできるよ）",
          example: "They are from Japan.",
          exampleJa: "彼らは日本出身です。",
        },
        {
          id: "bg-basics-1-6",
          english: "I am not ~ : am のあとに not を付けると否定文になる",
          japanese:
            "「私は～ではありません」と否定するとき、am のあとに not を付けます。",
          pronunciation: "アイ アム ノット（I'm not と短くできるよ）",
          example: "I am not tired.",
          exampleJa: "私は疲れていません。",
        },
        {
          id: "bg-basics-1-7",
          english: "You are not ~ : are のあとに not を付けると否定文になる",
          japanese:
            "「あなたは～ではありません」と否定するとき、are のあとに not を付けます。",
          pronunciation: "ユー アー ノット（You're not / You aren't）",
          example: "You are not late.",
          exampleJa: "あなたは遅刻していません。",
        },
        {
          id: "bg-basics-1-8",
          english: "He is not ~ / She is not ~ : is のあとに not を付けると否定文",
          japanese:
            "「彼は～ではない」と否定するとき、is のあとに not を付けます。",
          pronunciation: "ヒー イズ ノット（He's not / He isn't）",
          example: "He is not a teacher.",
          exampleJa: "彼は先生ではありません。",
        },
        {
          id: "bg-basics-1-9",
          english: "Am I ~? : 主語と am を入れ替えると疑問文になる",
          japanese:
            "「私は～ですか？」とたずねるとき、Am を I の前に出します。",
          pronunciation: "アム アイ？（語尾を上げて発音しよう）",
          example: "Am I right?",
          exampleJa: "私は正しいですか？",
        },
        {
          id: "bg-basics-1-10",
          english: "Are you ~? : 主語と are を入れ替えると疑問文になる",
          japanese:
            "「あなたは～ですか？」とたずねるとき、Are を You の前に出します。",
          pronunciation: "アー ユー？（語尾を上げて発音しよう）",
          example: "Are you hungry?",
          exampleJa: "あなたはお腹が空いていますか？",
        },
      ],
    },
    {
      id: "bg-basics-2",
      title: "General Verbs",
      titleJa: "一般動詞",
      description: "like, play, work — everyday action words",
      items: [
        {
          id: "bg-basics-2-1",
          english: "I like ~ : 「好き」を伝える基本の動詞",
          japanese:
            "「私は～が好きです」。like は一般動詞の代表格。be動詞は使いません。",
          pronunciation: "アイ ライク（I like の like は「ライク」）",
          example: "I like coffee.",
          exampleJa: "私はコーヒーが好きです。",
        },
        {
          id: "bg-basics-2-2",
          english: "You play ~ : 「する・遊ぶ」を伝える動詞",
          japanese:
            "「あなたは～をします」。play はスポーツや楽器を「する」ときに使います。",
          pronunciation: "ユー プレイ",
          example: "You play soccer every weekend.",
          exampleJa: "あなたは毎週末サッカーをします。",
        },
        {
          id: "bg-basics-2-3",
          english: "He works ~ : 三人称単数のとき、動詞に s を付ける",
          japanese:
            "He / She / It が主語のとき、動詞の最後に s を付けます。これが三単現のルール！",
          pronunciation: "ヒー ワークス（works の s を忘れずに！）",
          example: "He works at a restaurant.",
          exampleJa: "彼はレストランで働いています。",
        },
        {
          id: "bg-basics-2-4",
          english: "She goes ~ : go は goes に変わる（三単現の es）",
          japanese:
            "go, do, watch など、o/ch/sh で終わる動詞は es を付けます。",
          pronunciation: "シー ゴーズ（go → goes）",
          example: "She goes to school by bus.",
          exampleJa: "彼女はバスで学校に行きます。",
        },
        {
          id: "bg-basics-2-5",
          english: "do / does : 疑問文・否定文で使うヘルパー",
          japanese:
            "一般動詞の疑問文・否定文には do / does を使います。does は三単現のとき。",
          pronunciation: "ドゥー / ダズ",
          example: "Do you like sushi? — Yes, I do.",
          exampleJa: "お寿司は好きですか？ — はい、好きです。",
        },
        {
          id: "bg-basics-2-6",
          english: "don't / doesn't : 一般動詞の否定は don't / doesn't",
          japanese:
            "「～しません」と言うとき、動詞の前に don't（I/You/We/They）か doesn't（He/She/It）を置きます。",
          pronunciation: "ドント / ダズント",
          example: "I don't eat meat.",
          exampleJa: "私は肉を食べません。",
        },
        {
          id: "bg-basics-2-7",
          english: "Do you ~? : 一般動詞の疑問文は Do で始める",
          japanese:
            "「あなたは～しますか？」とたずねるとき、Do you + 動詞の原形？ の形にします。",
          pronunciation: "ドゥー ユー？（語尾を上げて発音しよう）",
          example: "Do you speak English?",
          exampleJa: "あなたは英語を話しますか？",
        },
        {
          id: "bg-basics-2-8",
          english: "Does he ~? : 三単現の疑問文は Does で始める",
          japanese:
            "He/She/It について質問するとき、Does + 主語 + 動詞の原形？ にします。does を使ったら動詞は原形！",
          pronunciation: "ダズ ヒー？（動詞に s を付けないのがポイント）",
          example: "Does he play the piano?",
          exampleJa: "彼はピアノを弾きますか？",
        },
        {
          id: "bg-basics-2-9",
          english: "I have ~ : 「持っている」を伝える基本動詞",
          japanese:
            "「私は～を持っています」。have は所有を表すとても大切な動詞です。",
          pronunciation: "アイ ハヴ（He/She のときは has になるよ）",
          example: "I have two cats.",
          exampleJa: "私は猫を2匹飼っています。",
        },
        {
          id: "bg-basics-2-10",
          english: "They want ~ : 「欲しい・したい」を伝える動詞",
          japanese:
            "「彼らは～が欲しい」。want のあとに名詞を置くと「～が欲しい」、to + 動詞で「～したい」。",
          pronunciation: "ゼイ ウォント（want to は「ワナ」と発音することも）",
          example: "They want a new car.",
          exampleJa: "彼らは新しい車が欲しいです。",
        },
      ],
    },
    {
      id: "bg-basics-3",
      title: "This / That / These / Those",
      titleJa: "指示代名詞",
      description: "「これ」「あれ」「これら」「あれら」の使い分け",
      items: [
        {
          id: "bg-basics-3-1",
          english: "This is ~ : 近くの1つのものを指す「これは～です」",
          japanese:
            "自分の近くにある1つのものを指すとき「This is ~」を使います。",
          pronunciation: "ディス イズ（this の th は舌を軽くかんで）",
          example: "This is my book.",
          exampleJa: "これは私の本です。",
        },
        {
          id: "bg-basics-3-2",
          english: "That is ~ : 遠くの1つのものを指す「あれは～です」",
          japanese:
            "自分から離れた1つのものを指すとき「That is ~」を使います。",
          pronunciation: "ザット イズ（That's と短くできるよ）",
          example: "That is a beautiful flower.",
          exampleJa: "あれはきれいな花です。",
        },
        {
          id: "bg-basics-3-3",
          english: "These are ~ : 近くの複数のものを指す「これらは～です」",
          japanese:
            "自分の近くにある複数のものを指すとき「These are ~」を使います。",
          pronunciation: "ディーズ アー（these は this の複数形）",
          example: "These are my friends.",
          exampleJa: "この人たちは私の友達です。",
        },
        {
          id: "bg-basics-3-4",
          english: "Those are ~ : 遠くの複数のものを指す「あれらは～です」",
          japanese:
            "自分から離れた複数のものを指すとき「Those are ~」を使います。",
          pronunciation: "ゾーズ アー（those は that の複数形）",
          example: "Those are her shoes.",
          exampleJa: "あれらは彼女の靴です。",
        },
        {
          id: "bg-basics-3-5",
          english: "What is this? : 「これは何ですか？」とたずねる",
          japanese:
            "目の前のものが何かわからないとき「What is this?」と聞きます。",
          pronunciation: "ワット イズ ディス？（What's this? と短くもOK）",
          example: "What is this? — It is a key.",
          exampleJa: "これは何ですか？ — それは鍵です。",
        },
        {
          id: "bg-basics-3-6",
          english: "Is that ~? : 「あれは～ですか？」とたずねる",
          japanese:
            "離れたものについて確認するとき「Is that ~?」と聞きます。",
          pronunciation: "イズ ザット？（語尾を上げて発音しよう）",
          example: "Is that your bag? — Yes, it is.",
          exampleJa: "あれはあなたのカバンですか？ — はい、そうです。",
        },
        {
          id: "bg-basics-3-7",
          english: "this vs that : 近い＝this、遠い＝that の使い分け",
          japanese:
            "手が届くくらい近いものは this、遠くにあるものは that。時間でも使えます（this week / that day）。",
          pronunciation: "近い→ディス、遠い→ザット と覚えよう",
          example: "This cake is delicious. That one looks good too.",
          exampleJa:
            "このケーキはおいしい。あのケーキもおいしそう。",
        },
        {
          id: "bg-basics-3-8",
          english: "these vs those : 近い複数＝these、遠い複数＝those",
          japanese:
            "近くの複数のものは these、遠くの複数のものは those。this/that の複数形です。",
          pronunciation: "近い複数→ディーズ、遠い複数→ゾーズ",
          example: "These apples are red. Those apples are green.",
          exampleJa:
            "これらのりんごは赤い。あれらのりんごは緑です。",
        },
      ],
    },
  ],
};
