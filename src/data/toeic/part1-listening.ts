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
  {
    id: 'part1-beginner-2',
    title: 'Part 1 Listening - Workplace Scenes',
    titleJa: 'Part 1 写真描写 - 職場の風景',
    description:
      'オフィスや職場でよく見られる場面の描写問題です。日常的なビジネスシーンを正確に聞き取りましょう。',
    level: 'beginner',
    questions: [
      {
        id: 'p1b2-1',
        scenario: '女性がホワイトボードにマーカーで書いている',
        scenarioEn: 'A woman is writing on a whiteboard with a marker.',
        options: [
          'A woman is erasing the whiteboard.',
          'A woman is writing on a whiteboard.',
          'A woman is hanging a poster on the wall.',
          'A woman is opening a window.',
        ],
        correctIndex: 1,
        explanation:
          '場面は「女性がホワイトボードにマーカーで書いている」です。(B) の "writing on a whiteboard" が正しい描写です。(A) の "erasing" は消す動作なので逆です。',
      },
      {
        id: 'p1b2-2',
        scenario: '男性がファイルキャビネットから書類を取り出している',
        scenarioEn: 'A man is pulling documents out of a filing cabinet.',
        options: [
          'A man is shredding papers.',
          'A man is locking the cabinet.',
          'A man is retrieving files from a cabinet.',
          'A man is stacking boxes.',
        ],
        correctIndex: 2,
        explanation:
          '場面は「男性がファイルキャビネットから書類を取り出している」です。(C) の "retrieving files from a cabinet" が正しい描写です。',
      },
      {
        id: 'p1b2-3',
        scenario: '同僚たちがデスクの周りに集まってモニターを見ている',
        scenarioEn: 'Colleagues are gathered around a desk looking at a monitor.',
        options: [
          'People are looking at a computer screen together.',
          'People are leaving the office.',
          'A man is fixing a computer.',
          'People are eating at their desks.',
        ],
        correctIndex: 0,
        explanation:
          '場面は「同僚たちがモニターを見ている」です。(A) の "looking at a computer screen together" が正しい描写です。',
      },
      {
        id: 'p1b2-4',
        scenario: '受付の女性が電話に出ている',
        scenarioEn: 'A receptionist is answering the phone.',
        options: [
          'A woman is typing an email.',
          'A woman is greeting a visitor.',
          'A woman is answering a phone call.',
          'A woman is filing paperwork.',
        ],
        correctIndex: 2,
        explanation:
          '場面は「受付の女性が電話に出ている」です。(C) の "answering a phone call" が正しい描写です。',
      },
      {
        id: 'p1b2-5',
        scenario: '男性がオフィスチェアに座ってヘッドセットを着けている',
        scenarioEn: 'A man is sitting in an office chair wearing a headset.',
        options: [
          'A man is standing by the printer.',
          'A man is wearing a headset at his desk.',
          'A man is carrying a laptop.',
          'A man is writing in a notebook.',
        ],
        correctIndex: 1,
        explanation:
          '場面は「男性がオフィスチェアに座ってヘッドセットを着けている」です。(B) の "wearing a headset at his desk" が正しい描写です。',
      },
      {
        id: 'p1b2-6',
        scenario: '女性がコーヒーメーカーの前でカップにコーヒーを注いでいる',
        scenarioEn: 'A woman is pouring coffee into a cup in front of a coffee maker.',
        options: [
          'A woman is washing dishes.',
          'A woman is pouring coffee.',
          'A woman is ordering coffee at a cafe.',
          'A woman is carrying a tray.',
        ],
        correctIndex: 1,
        explanation:
          '場面は「女性がコーヒーを注いでいる」です。(B) の "pouring coffee" が正しい描写です。(C) はカフェで注文する場面で異なります。',
      },
      {
        id: 'p1b2-7',
        scenario: '男性がプリンターから印刷物を取り出している',
        scenarioEn: 'A man is picking up printouts from the printer.',
        options: [
          'A man is collecting documents from a printer.',
          'A man is repairing the printer.',
          'A man is scanning a document.',
          'A man is putting paper into the printer.',
        ],
        correctIndex: 0,
        explanation:
          '場面は「男性がプリンターから印刷物を取り出している」です。(A) の "collecting documents from a printer" が正しい描写です。(D) は用紙を入れる動作で逆です。',
      },
      {
        id: 'p1b2-8',
        scenario: '会議室のテーブルにノートパソコンと資料が並んでいる',
        scenarioEn: 'Laptops and documents are arranged on a conference table.',
        options: [
          'The conference room is being cleaned.',
          'People are having a meeting.',
          'Laptops and papers are set up on a table.',
          'Chairs have been stacked against the wall.',
        ],
        correctIndex: 2,
        explanation:
          '場面は「テーブルにノートパソコンと資料が並んでいる」です。(C) の "Laptops and papers are set up on a table" が正しい描写です。人がいるかどうかは場面に明示されていません。',
      },
    ],
  },
  {
    id: 'part1-intermediate-2',
    title: 'Part 1 Listening - Public Places',
    titleJa: 'Part 1 写真描写 - 公共の場所',
    description:
      '空港・駅・病院・レストランなど公共の場所の場面です。複数の動作や人物を正確に聞き取りましょう。',
    level: 'intermediate',
    questions: [
      {
        id: 'p1i2-1',
        scenario:
          '空港のチェックインカウンターで、スタッフがパスポートを確認しながら搭乗券を発行している。乗客はスーツケースをベルトコンベアに載せている。',
        scenarioEn:
          'At an airport check-in counter, a staff member is checking a passport and issuing a boarding pass. The passenger is placing a suitcase on the conveyor belt.',
        options: [
          'A passenger is picking up luggage at baggage claim.',
          'A staff member is processing a passenger at the check-in counter.',
          'A passenger is going through security screening.',
          'People are boarding an airplane.',
        ],
        correctIndex: 1,
        explanation:
          'チェックインカウンターでスタッフが乗客の手続きをしている場面です。(B) の "processing a passenger at the check-in counter" が正しい描写です。(A) は荷物受取、(C) は保安検査で異なります。',
      },
      {
        id: 'p1i2-2',
        scenario:
          '駅のホームで、通勤客たちが電車を待っている。電光掲示板に次の電車の到着時間が表示されている。一人の男性がスマートフォンを見ている。',
        scenarioEn:
          'On a train platform, commuters are waiting for a train. The electronic display shows the next train arrival time. One man is looking at his smartphone.',
        options: [
          'Passengers are getting off a train.',
          'Commuters are waiting on a platform.',
          'A train conductor is making an announcement.',
          'People are buying tickets at a machine.',
        ],
        correctIndex: 1,
        explanation:
          '通勤客がホームで電車を待っている場面です。(B) の "waiting on a platform" が正しい描写です。(A) は降車中なので異なります。',
      },
      {
        id: 'p1i2-3',
        scenario:
          '病院の廊下で、医師が白衣を着てクリップボードを持ちながら看護師と話している。背景に車椅子が壁際に置かれている。',
        scenarioEn:
          'In a hospital hallway, a doctor in a white coat is talking to a nurse while holding a clipboard. A wheelchair is placed against the wall in the background.',
        options: [
          'A doctor is examining a patient in a room.',
          'A doctor and nurse are talking in a hallway.',
          'A nurse is pushing a patient in a wheelchair.',
          'Medical staff are performing surgery.',
        ],
        correctIndex: 1,
        explanation:
          '医師と看護師が廊下で会話している場面です。(B) の "talking in a hallway" が正しいです。(C) は車椅子を押しているとありますが、車椅子は壁際に置かれているだけです。',
      },
      {
        id: 'p1i2-4',
        scenario:
          'レストランの厨房で、シェフが鍋をかき混ぜながら別の料理人に指示を出している。カウンターには完成した皿が並んでいる。',
        scenarioEn:
          'In a restaurant kitchen, a chef is stirring a pot while giving instructions to another cook. Finished dishes are lined up on the counter.',
        options: [
          'A chef is tasting food at a table.',
          'Dishes have been placed on a counter in the kitchen.',
          'A cook is washing pots and pans.',
          'Waiters are serving food to customers.',
        ],
        correctIndex: 1,
        explanation:
          '厨房でシェフが調理中で、カウンターに完成した皿が並んでいる場面です。(B) の "Dishes have been placed on a counter" が正確です。全体の場面を描写するのではなく、確実に描写できる部分を選ぶのがポイントです。',
      },
      {
        id: 'p1i2-5',
        scenario:
          '郵便局のカウンターで、客が大きな段ボール箱をカウンターに置いている。局員が秤で重さを量ろうとしている。',
        scenarioEn:
          'At a post office counter, a customer is placing a large cardboard box on the counter. A clerk is about to weigh it on a scale.',
        options: [
          'A customer is mailing a package at the post office.',
          'A clerk is sorting letters into mailboxes.',
          'A customer is buying stamps.',
          'A delivery driver is loading boxes onto a truck.',
        ],
        correctIndex: 0,
        explanation:
          '客が郵便局で荷物を送ろうとしている場面です。(A) の "mailing a package at the post office" が正しい描写です。',
      },
      {
        id: 'p1i2-6',
        scenario:
          'ホテルのロビーで、スーツケースを持った宿泊客がフロントデスクでチェックインしている。ベルボーイが隣で待っている。',
        scenarioEn:
          'In a hotel lobby, a guest with a suitcase is checking in at the front desk. A bellboy is waiting nearby.',
        options: [
          'A guest is checking in at a hotel.',
          'A guest is leaving the hotel.',
          'A bellboy is carrying luggage to a room.',
          'The hotel lobby is empty.',
        ],
        correctIndex: 0,
        explanation:
          '宿泊客がフロントデスクでチェックインしている場面です。(A) の "checking in at a hotel" が正しい描写です。(B) のチェックアウトは逆の動作です。',
      },
      {
        id: 'p1i2-7',
        scenario:
          '薬局で、薬剤師が棚から薬の瓶を取り出して客に説明している。カウンターには処方箋が置かれている。',
        scenarioEn:
          'At a pharmacy, a pharmacist is taking a medicine bottle from a shelf and explaining it to a customer. A prescription is on the counter.',
        options: [
          'A pharmacist is explaining medication to a customer.',
          'A customer is browsing products in a store.',
          'A doctor is writing a prescription.',
          'Medicine bottles are being stocked on shelves.',
        ],
        correctIndex: 0,
        explanation:
          '薬剤師が客に薬の説明をしている場面です。(A) の "explaining medication to a customer" が正しい描写です。(C) は医師が処方箋を書いている場面で異なります。',
      },
      {
        id: 'p1i2-8',
        scenario:
          '図書館の返却カウンターで、利用者が本の山をカウンターに置いている。司書がバーコードスキャナーを手に持っている。',
        scenarioEn:
          'At a library return counter, a patron is placing a stack of books on the counter. A librarian is holding a barcode scanner.',
        options: [
          'A patron is checking out books from the library.',
          'A librarian is scanning returned books.',
          'Books are being shelved in the library.',
          'A student is reading at a study table.',
        ],
        correctIndex: 1,
        explanation:
          '返却カウンターで司書がバーコードスキャナーを持っている場面です。(B) の "scanning returned books" が正しい描写です。(A) は貸し出しなので逆の動作です。',
      },
    ],
  },
  {
    id: 'part1-advanced-2',
    title: 'Part 1 Listening - Events & Activities',
    titleJa: 'Part 1 写真描写 - イベント・活動',
    description:
      '会議・式典・工事現場・倉庫など、ビジネスイベントや作業活動の上級描写問題です。受動態や進行形の微妙な違いに注意しましょう。',
    level: 'advanced',
    questions: [
      {
        id: 'p1a2-1',
        scenario:
          '国際会議の登録デスクで、スタッフがネームバッジと資料の入ったフォルダーを参加者に手渡している。参加者のリストがテーブルに広げられている。',
        scenarioEn:
          'At the registration desk of an international conference, staff are handing out name badges and folders of materials to participants. A list of attendees is spread out on the table.',
        options: [
          'Conference attendees are seated in the auditorium.',
          'Registration materials are being distributed to participants.',
          'A speaker is setting up equipment on stage.',
          'Participants are leaving the conference venue.',
        ],
        correctIndex: 1,
        explanation:
          '登録デスクで資料が配布されている場面です。(B) の "being distributed to participants" は進行形の受動態で、この動作を正確に表しています。(A) は講堂に座っている場面で異なります。',
      },
      {
        id: 'p1a2-2',
        scenario:
          '表彰式のステージで、スーツを着た男性がトロフィーを受け取っている。背景には企業のロゴが掲げられており、観客が拍手をしている。',
        scenarioEn:
          'On a ceremony stage, a man in a suit is receiving a trophy. A company logo is displayed in the background, and the audience is applauding.',
        options: [
          'A trophy is being presented to a man on stage.',
          'A man is placing a trophy in a display case.',
          'An audience is waiting for the ceremony to begin.',
          'A speaker is addressing the crowd from a podium.',
        ],
        correctIndex: 0,
        explanation:
          'ステージ上で男性にトロフィーが授与されている場面です。(A) の "being presented to a man on stage" が正しいです。(C) は「始まるのを待っている」とありますが、すでに式は進行中です。',
      },
      {
        id: 'p1a2-3',
        scenario:
          '建設現場で、足場が建物の外壁に組まれており、作業員たちが上層階で外壁の塗装をしている。地上には資材が積まれている。',
        scenarioEn:
          'At a construction site, scaffolding has been erected along the exterior wall of a building. Workers are painting the upper floors. Materials are piled on the ground.',
        options: [
          'Scaffolding has been set up around a building.',
          'Workers are demolishing a structure.',
          'A building is being inspected by officials.',
          'Construction equipment is being transported to the site.',
        ],
        correctIndex: 0,
        explanation:
          '足場が建物に組まれている状態です。(A) の "has been set up around a building" は完了形の受動態で、すでに設置されている状態を正確に描写しています。(B) の "demolishing"（解体）は塗装とは全く異なる動作です。',
      },
      {
        id: 'p1a2-4',
        scenario:
          '大型倉庫の中で、フォークリフトがパレットに積まれた段ボール箱を棚に運んでいる。作業員が安全ベストを着てクリップボードにチェックを入れている。',
        scenarioEn:
          'Inside a large warehouse, a forklift is carrying pallets of cardboard boxes to shelves. A worker in a safety vest is checking items off on a clipboard.',
        options: [
          'Boxes are being unloaded from a delivery truck.',
          'Merchandise is being moved to storage shelves.',
          'The warehouse has been emptied for cleaning.',
          'Workers are packing boxes for shipment.',
        ],
        correctIndex: 1,
        explanation:
          'フォークリフトが箱を棚に運んでいる場面です。(B) の "being moved to storage shelves" が正しいです。(A) はトラックからの荷降ろし、(D) は出荷のための梱包で異なります。',
      },
      {
        id: 'p1a2-5',
        scenario:
          '展示会場で、ブースごとに企業の製品が陳列されている。来場者がパンフレットを手に取りながらブースのスタッフと話している。背景にはバナーが吊り下げられている。',
        scenarioEn:
          'At a trade show, products are displayed at individual company booths. Visitors are picking up brochures and talking with booth staff. Banners are hanging in the background.',
        options: [
          'Banners have been hung above the exhibition booths.',
          'Exhibitors are packing up their displays.',
          'The exhibition hall is being prepared for an event.',
          'Visitors are purchasing products at a retail store.',
        ],
        correctIndex: 0,
        explanation:
          'バナーがブースの上に吊り下げられている状態です。(A) の "have been hung above the exhibition booths" は完了形の受動態で、この状態を正確に表しています。(B) は片付け、(C) は準備中で、いずれも開催中の場面と異なります。',
      },
      {
        id: 'p1a2-6',
        scenario:
          '卒業式の会場で、学生たちがガウンと帽子を着用して整列している。壇上には花と旗が飾られており、保護者席はほぼ満席である。',
        scenarioEn:
          'At a graduation ceremony venue, students in gowns and caps are lined up. The stage is decorated with flowers and flags, and the parent seating area is nearly full.',
        options: [
          'Students are throwing their caps in the air.',
          'Graduates have been arranged in rows at the ceremony.',
          'A diploma is being handed to a student.',
          'The auditorium is being set up for an event.',
        ],
        correctIndex: 1,
        explanation:
          '学生たちが整列している状態です。(B) の "have been arranged in rows" は完了形の受動態で、整列した状態を正確に描写しています。(A) は帽子を投げる場面、(C) は卒業証書を渡す場面で、いずれもこの場面の動作とは異なります。',
      },
      {
        id: 'p1a2-7',
        scenario:
          '道路工事の現場で、重機が路面を掘削している。交通誘導員がオレンジの旗を持って車を迂回させている。コーンが道路に並べられている。',
        scenarioEn:
          'At a road construction site, heavy machinery is digging up the road surface. A traffic controller is holding an orange flag and diverting vehicles. Cones have been placed along the road.',
        options: [
          'Traffic cones have been lined up along the road.',
          'Vehicles are moving freely through the construction zone.',
          'Workers are planting trees along the roadside.',
          'A road has been repaved and reopened to traffic.',
        ],
        correctIndex: 0,
        explanation:
          'コーンが道路に並べられている状態です。(A) の "have been lined up along the road" が正しい描写です。(B) は車が自由に通行しているとありますが、実際には迂回させています。(D) は舗装し直されて開通したとあり、工事中の場面と矛盾します。',
      },
      {
        id: 'p1a2-8',
        scenario:
          '会社の研修室で、新入社員たちがスクリーンに映されたスライドを見ながらメモを取っている。講師はレーザーポインターを使ってグラフを指している。',
        scenarioEn:
          'In a corporate training room, new employees are taking notes while watching slides on a screen. The instructor is pointing at a graph with a laser pointer.',
        options: [
          'A presentation is being delivered to a group of trainees.',
          'Employees are leaving a training session.',
          'A trainer is distributing handouts to participants.',
          'The training room is empty and the lights are off.',
        ],
        correctIndex: 0,
        explanation:
          '講師が新入社員にプレゼンテーションをしている場面です。(A) の "being delivered to a group of trainees" は進行形の受動態で、研修中であることを正確に描写しています。(C) は資料を配っている動作で、スライドを使った説明とは異なります。',
      },
    ],
  },
];
