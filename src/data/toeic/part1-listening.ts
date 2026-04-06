import type { Part1Set } from '../types';

export const part1Sets: Part1Set[] = [
  {
    id: 'part1-beginner',
    title: 'Part 1 Listening - Beginner',
    titleJa: 'Part 1 写真描写 - 初級',
    description:
      'シンプルな場面を聞いて、正しい描写を選びましょう。オフィス・街・公園などの基本的な場面です。',
    level: 'beginner',
    questions: [
      {
        id: 'p1b-1',
        scenario: '男性がデスクでコンピュータを使っている',
        scenarioEn: 'A man is using a computer at his desk.',
        options: [
          'A man is typing on a computer.',
          'A man is talking on the phone.',
          'A man is reading a newspaper.',
          'A man is drinking coffee.',
        ],
        correctIndex: 0,
        explanation:
          '場面は「男性がデスクでコンピュータを使っている」です。(A) の "typing on a computer" が最も正確に場面を描写しています。',
      },
      {
        id: 'p1b-2',
        scenario: '女性が公園のベンチに座って本を読んでいる',
        scenarioEn: 'A woman is sitting on a park bench reading a book.',
        options: [
          'A woman is jogging in the park.',
          'A woman is feeding the birds.',
          'A woman is reading a book on a bench.',
          'A woman is talking to a friend.',
        ],
        correctIndex: 2,
        explanation:
          '場面は「女性がベンチで本を読んでいる」です。(C) の "reading a book on a bench" が正しい描写です。',
      },
      {
        id: 'p1b-3',
        scenario: '店員がレジで客に商品を渡している',
        scenarioEn: 'A clerk is handing merchandise to a customer at the register.',
        options: [
          'A customer is trying on clothes.',
          'A clerk is stocking shelves.',
          'A clerk is sweeping the floor.',
          'A clerk is handing a bag to a customer.',
        ],
        correctIndex: 3,
        explanation:
          '場面は「店員がレジで客に商品を渡している」です。(D) の "handing a bag to a customer" が正確です。',
      },
      {
        id: 'p1b-4',
        scenario: '子供たちが校庭でサッカーをしている',
        scenarioEn: 'Children are playing soccer in the schoolyard.',
        options: [
          'Children are playing soccer outside.',
          'Children are sitting in a classroom.',
          'Children are eating lunch.',
          'Children are swimming in a pool.',
        ],
        correctIndex: 0,
        explanation:
          '場面は「子供たちが校庭でサッカーをしている」です。(A) の "playing soccer outside" が正しい描写です。',
      },
      {
        id: 'p1b-5',
        scenario: '男性がキッチンで料理をしている',
        scenarioEn: 'A man is cooking in the kitchen.',
        options: [
          'A man is washing dishes.',
          'A man is setting the table.',
          'A man is preparing food in the kitchen.',
          'A man is ordering food at a restaurant.',
        ],
        correctIndex: 2,
        explanation:
          '場面は「男性がキッチンで料理をしている」です。(C) の "preparing food in the kitchen" が正しい描写です。',
      },
      {
        id: 'p1b-6',
        scenario: '女性がバス停でバスを待っている',
        scenarioEn: 'A woman is waiting for a bus at the bus stop.',
        options: [
          'A woman is driving a car.',
          'A woman is riding a bicycle.',
          'A woman is getting off a train.',
          'A woman is standing at a bus stop.',
        ],
        correctIndex: 3,
        explanation:
          '場面は「女性がバス停で待っている」です。(D) の "standing at a bus stop" が正しい描写です。',
      },
      {
        id: 'p1b-7',
        scenario: '男性がスーパーで野菜を選んでいる',
        scenarioEn: 'A man is choosing vegetables at a supermarket.',
        options: [
          'A man is pushing a shopping cart.',
          'A man is selecting vegetables at a store.',
          'A man is paying at the checkout.',
          'A man is carrying grocery bags.',
        ],
        correctIndex: 1,
        explanation:
          '場面は「男性が野菜を選んでいる」です。(B) の "selecting vegetables at a store" が正しい描写です。',
      },
      {
        id: 'p1b-8',
        scenario: '女性がオフィスでコピー機を使っている',
        scenarioEn: 'A woman is using the copy machine in the office.',
        options: [
          'A woman is making copies.',
          'A woman is answering the phone.',
          'A woman is writing an email.',
          'A woman is attending a meeting.',
        ],
        correctIndex: 0,
        explanation:
          '場面は「女性がコピー機を使っている」です。(A) の "making copies" が正しい描写です。',
      },
    ],
  },
  {
    id: 'part1-intermediate',
    title: 'Part 1 Listening - Intermediate',
    titleJa: 'Part 1 写真描写 - 中級',
    description:
      '複数の人物や動作が含まれる場面を聞き取りましょう。紛らわしい選択肢に注意が必要です。',
    level: 'intermediate',
    questions: [
      {
        id: 'p1i-1',
        scenario:
          '会議室で数人がテーブルを囲んでプレゼンテーションを見ている。一人の女性がスクリーンの前に立って説明している。',
        scenarioEn:
          'Several people are sitting around a table in a conference room watching a presentation. A woman is standing in front of the screen explaining.',
        options: [
          'People are leaving the conference room.',
          'A woman is giving a presentation to a group.',
          'Everyone is looking at their phones.',
          'A man is writing on a whiteboard.',
        ],
        correctIndex: 1,
        explanation:
          '女性がスクリーンの前でグループに説明している場面です。(B) の "giving a presentation to a group" が正しい描写です。(D) は "man" と "whiteboard" が場面と異なります。',
      },
      {
        id: 'p1i-2',
        scenario:
          'カフェのテラス席で、二人の男性がコーヒーを飲みながら書類を見ている。テーブルにはノートパソコンも置いてある。',
        scenarioEn:
          'Two men are drinking coffee and looking at documents at a cafe terrace. A laptop is also on the table.',
        options: [
          'Two men are reviewing documents over coffee.',
          'Two men are eating lunch at a restaurant.',
          'A man is working alone at a cafe.',
          'Two men are waiting in line to order.',
        ],
        correctIndex: 0,
        explanation:
          '二人の男性がコーヒーを飲みながら書類を見ている場面です。(A) の "reviewing documents over coffee" が正確です。(C) は "alone" が、(B) は "eating lunch" が間違いです。',
      },
      {
        id: 'p1i-3',
        scenario:
          '空港のロビーで、旅行者たちがスーツケースを引きながら歩いている。出発案内の電光掲示板が背景に見える。',
        scenarioEn:
          'In an airport lobby, travelers are walking while pulling their suitcases. A departure information board is visible in the background.',
        options: [
          'Passengers are boarding an airplane.',
          'People are waiting at a train station.',
          'Travelers are walking through an airport terminal.',
          'People are picking up their luggage at baggage claim.',
        ],
        correctIndex: 2,
        explanation:
          '旅行者がスーツケースを引いて空港のロビーを歩いている場面です。(C) の "walking through an airport terminal" が正しいです。(D) の "baggage claim" は到着側なので不正確です。',
      },
      {
        id: 'p1i-4',
        scenario:
          '図書館の閲覧室で、学生たちが静かに勉強している。本棚が壁沿いに並んでおり、一人の学生がヘッドフォンをしている。',
        scenarioEn:
          'Students are studying quietly in a library reading room. Bookshelves line the walls, and one student is wearing headphones.',
        options: [
          'Students are taking an exam in a classroom.',
          'Students are studying in a library.',
          'A teacher is giving a lecture.',
          'Students are chatting in a cafeteria.',
        ],
        correctIndex: 1,
        explanation:
          '図書館で学生が勉強している場面です。(B) の "studying in a library" が正しいです。(A) の "taking an exam" や(D) の "chatting" は場面と異なります。',
      },
      {
        id: 'p1i-5',
        scenario:
          'レストランで、ウェイターがトレイに料理を載せて客のテーブルに運んでいる。客は4人テーブルに座っている。',
        scenarioEn:
          'In a restaurant, a waiter is carrying a tray of food to a table of customers. Four customers are seated at the table.',
        options: [
          'A waiter is taking orders from customers.',
          'Customers are looking at the menu.',
          'A waiter is serving food to a table.',
          'A chef is cooking in the kitchen.',
        ],
        correctIndex: 2,
        explanation:
          'ウェイターが料理を運んでいる場面です。(C) の "serving food to a table" が正しい描写です。(A) の "taking orders" は注文を取ることなので異なります。',
      },
      {
        id: 'p1i-6',
        scenario:
          '工事現場で、作業員がヘルメットをかぶって図面を見ながら話し合っている。クレーンが背景に見える。',
        scenarioEn:
          'At a construction site, workers wearing helmets are discussing while looking at blueprints. A crane is visible in the background.',
        options: [
          'Workers are operating heavy machinery.',
          'Workers are reviewing plans at a construction site.',
          'Workers are taking a break.',
          'A worker is climbing a ladder.',
        ],
        correctIndex: 1,
        explanation:
          '作業員が図面を見ながら話し合っている場面です。(B) の "reviewing plans at a construction site" が正しい描写です。',
      },
      {
        id: 'p1i-7',
        scenario:
          '病院の受付で、看護師が患者に書類を渡している。待合室には数人の人が座って待っている。',
        scenarioEn:
          'At a hospital reception desk, a nurse is handing paperwork to a patient. Several people are sitting in the waiting area.',
        options: [
          'A doctor is examining a patient.',
          'A nurse is handing forms to a patient at the front desk.',
          'Patients are leaving the hospital.',
          'A nurse is giving an injection.',
        ],
        correctIndex: 1,
        explanation:
          '看護師が受付で患者に書類を渡している場面です。(B) の "handing forms to a patient at the front desk" が正しい描写です。',
      },
      {
        id: 'p1i-8',
        scenario:
          '駐車場で、男性が車のトランクにスーツケースを積んでいる。隣にはもう一人の男性がドアを開けている。',
        scenarioEn:
          'In a parking lot, a man is loading a suitcase into the trunk of a car. Another man is opening the car door next to him.',
        options: [
          'A man is repairing a car engine.',
          'Two men are washing a car.',
          'A man is loading luggage into a car.',
          'Two men are standing beside a bus.',
        ],
        correctIndex: 2,
        explanation:
          '男性が車のトランクに荷物を積んでいる場面です。(C) の "loading luggage into a car" が正しい描写です。',
      },
    ],
  },
  {
    id: 'part1-advanced',
    title: 'Part 1 Listening - Advanced',
    titleJa: 'Part 1 写真描写 - 上級',
    description:
      '微妙な違いを聞き分ける上級問題です。受動態や進行形の使い分け、紛らわしい描写に挑戦しましょう。',
    level: 'advanced',
    questions: [
      {
        id: 'p1a-1',
        scenario:
          'オフィスビルのロビーで、スーツを着たビジネスパーソンたちが談笑している。一人はコーヒーカップを持ち、別の人はブリーフケースを地面に置いている。',
        scenarioEn:
          'In the lobby of an office building, businesspeople in suits are chatting. One is holding a coffee cup, and another has set a briefcase on the floor.',
        options: [
          'Businesspeople are entering an elevator.',
          'A briefcase has been placed on the floor.',
          'Everyone is seated in the lobby.',
          'A receptionist is greeting visitors.',
        ],
        correctIndex: 1,
        explanation:
          '場面の中で、ブリーフケースが地面に置かれていることは明確に描写されています。(B) の受動態 "has been placed on the floor" はこの状態を正確に表しています。(A) のエレベーターや(C) の「全員が座っている」は場面と異なります。',
      },
      {
        id: 'p1a-2',
        scenario:
          '美術館で、壁に掛けられた大きな絵画の前に、数人の来館者が立って鑑賞している。一人の女性がオーディオガイドを耳に当てている。',
        scenarioEn:
          'In an art museum, several visitors are standing in front of a large painting hung on the wall. One woman is holding an audio guide to her ear.',
        options: [
          'Paintings are being hung on the wall.',
          'Visitors are admiring artwork in a gallery.',
          'An artist is painting a picture.',
          'The museum is closed for renovations.',
        ],
        correctIndex: 1,
        explanation:
          '来館者が絵画を鑑賞している場面です。(B) の "admiring artwork in a gallery" が正しいです。(A) の "being hung" は絵を掛けている最中の意味で、すでに掛かっている状態とは異なります。',
      },
      {
        id: 'p1a-3',
        scenario:
          '港で、大型貨物船が停泊しており、コンテナがクレーンで船に積み込まれている。作業員たちは安全ベストを着て作業を監視している。',
        scenarioEn:
          'At a harbor, a large cargo ship is docked and containers are being loaded onto the ship by cranes. Workers in safety vests are monitoring the operation.',
        options: [
          'A ship is sailing out of the harbor.',
          'Containers are being unloaded from a ship.',
          'Cargo is being loaded onto a vessel.',
          'Workers are repairing a crane.',
        ],
        correctIndex: 2,
        explanation:
          'コンテナが船に積み込まれている場面です。(C) の "being loaded onto a vessel" が正しいです。(B) は "unloaded"（荷降ろし）なので逆の動作です。この違いは上級で頻出のひっかけです。',
      },
      {
        id: 'p1a-4',
        scenario:
          '研究室で、白衣を着た科学者が顕微鏡を覗いている。隣のテーブルには試験管が整然と並べられている。',
        scenarioEn:
          'In a laboratory, a scientist in a white coat is looking through a microscope. Test tubes are neatly arranged on the adjacent table.',
        options: [
          'Test tubes have been arranged on a table.',
          'A scientist is cleaning laboratory equipment.',
          'Chemicals are being poured into test tubes.',
          'The laboratory is empty.',
        ],
        correctIndex: 0,
        explanation:
          '試験管がテーブルに整然と並べられている状態です。(A) の "have been arranged" は完了形の受動態で、この状態を正確に描写しています。(C) は薬品を注いでいる動作で場面にありません。',
      },
      {
        id: 'p1a-5',
        scenario:
          '高級ホテルのフロントで、コンシェルジュが地図を広げてゲストに道順を説明している。ゲストはメモを取っている。',
        scenarioEn:
          'At the front desk of a luxury hotel, a concierge is spreading out a map and explaining directions to a guest. The guest is taking notes.',
        options: [
          'A guest is checking into the hotel.',
          'A map has been spread out on the counter.',
          'A guest is complaining about the room.',
          'The hotel lobby is crowded with tourists.',
        ],
        correctIndex: 1,
        explanation:
          '地図がカウンターに広げられている状態が描写されています。(B) の "has been spread out on the counter" はこの状態を正確に表しています。(A) のチェックインは場面の主な動作ではありません。',
      },
      {
        id: 'p1a-6',
        scenario:
          '街角の交差点で、信号が赤になり、歩行者たちが横断歩道を渡り始めている。傘をさしている人もおり、路面が濡れている。',
        scenarioEn:
          'At a street intersection, the traffic light has turned red and pedestrians are starting to cross the crosswalk. Some people are carrying umbrellas and the road surface is wet.',
        options: [
          'Vehicles are moving through the intersection.',
          'Pedestrians are crossing the street in the rain.',
          'A traffic officer is directing traffic.',
          'People are waiting for the light to change.',
        ],
        correctIndex: 1,
        explanation:
          '歩行者が横断歩道を渡っていて、傘を持っている人がいることから雨が降っていることがわかります。(B) の "crossing the street in the rain" が正しいです。(D) は信号待ちなので逆の状態です。',
      },
      {
        id: 'p1a-7',
        scenario:
          '庭園で、園芸作業員が花壇の手入れをしている。いくつかの鉢植えが通路沿いに置かれており、ホースが地面に伸びている。',
        scenarioEn:
          'In a garden, a gardener is tending to a flower bed. Several potted plants have been placed along the pathway, and a hose is stretched across the ground.',
        options: [
          'Potted plants have been placed along a walkway.',
          'Flowers are being planted in a greenhouse.',
          'The garden has been completely cleared.',
          'Sprinklers are watering the lawn.',
        ],
        correctIndex: 0,
        explanation:
          '鉢植えが通路沿いに置かれている状態です。(A) の "have been placed along a walkway" はこの状態を正確に描写しています。(B) は温室の話で場面と異なります。',
      },
      {
        id: 'p1a-8',
        scenario:
          '会議室で、プロジェクターのスクリーンにグラフが映し出されている。テーブルには資料が配られており、参加者の席にはまだ誰も座っていない。',
        scenarioEn:
          'In a conference room, a graph is displayed on the projector screen. Documents have been distributed on the table, but no one is seated yet.',
        options: [
          'A meeting is in progress with all attendees.',
          'Documents have been distributed on the table.',
          'Someone is setting up the projector.',
          'The conference room is being cleaned.',
        ],
        correctIndex: 1,
        explanation:
          '資料がテーブルに配られているが、まだ誰も座っていない場面です。(B) の "Documents have been distributed on the table" が正しいです。(A) は会議が進行中とあるが、誰も座っていないので不正確です。',
      },
    ],
  },
];
