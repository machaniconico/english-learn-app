import type { Part4Question } from '../types';

export const part4Talks: Part4Question[] = [
  // 1. Beginner: Store announcement about sale
  {
    id: 'part4-store-sale',
    type: 'announcement',
    typeJa: '店内アナウンス',
    level: 'beginner',
    talk: "Attention, shoppers. Thank you for visiting Franklin's Department Store today. We're excited to announce a special weekend sale starting this Saturday. All winter clothing, including coats, sweaters, and scarves, will be thirty percent off. Additionally, buy any two items from our shoe section and get the third pair free. The sale runs from Saturday through Monday. Don't miss out on these great deals. Happy shopping!",
    questions: [
      {
        question: 'What is on sale this weekend?',
        questionJa: '今週末何がセールですか？',
        options: [
          'Summer clothing',
          'Winter clothing',
          'Electronics',
          'Furniture',
        ],
        correctIndex: 1,
        explanation: '"All winter clothing, including coats, sweaters, and scarves, will be thirty percent off." と言っています。',
      },
      {
        question: 'What is the shoe section offer?',
        questionJa: '靴売り場のオファーは何ですか？',
        options: [
          'Fifty percent off all shoes',
          'Free delivery on shoe orders',
          'Buy two pairs, get the third free',
          'A free pair with any purchase',
        ],
        correctIndex: 2,
        explanation: '"buy any two items from our shoe section and get the third pair free" と案内しています。',
      },
    ],
  },

  // 2. Beginner: Voicemail about appointment change
  {
    id: 'part4-voicemail-appointment',
    type: 'voicemail',
    typeJa: '留守番電話',
    level: 'beginner',
    talk: "Hi, this is Dr. Wilson's office calling for Mr. Yamada. I'm calling about your appointment scheduled for this Thursday at two P.M. Unfortunately, Dr. Wilson has a scheduling conflict and won't be available at that time. We'd like to reschedule your appointment to Friday at ten A.M. if that works for you. Please call us back at five-five-five, zero-one-two-three to confirm or to choose a different time. We apologize for any inconvenience. Thank you.",
    questions: [
      {
        question: 'Why is the office calling?',
        questionJa: 'なぜ病院から電話がありましたか？',
        options: [
          'To confirm test results',
          'To reschedule an appointment',
          'To remind about a payment',
          'To introduce a new doctor',
        ],
        correctIndex: 1,
        explanation: '予約の変更（リスケジュール）について電話しています。木曜日の予約を金曜日に変更したいとのことです。',
      },
      {
        question: 'What is the new proposed time?',
        questionJa: '新しく提案された時間はいつですか？',
        options: [
          'Thursday at 2 P.M.',
          'Thursday at 10 A.M.',
          'Friday at 10 A.M.',
          'Friday at 2 P.M.',
        ],
        correctIndex: 2,
        explanation: '"We\'d like to reschedule your appointment to Friday at ten A.M." と言っています。',
      },
    ],
  },

  // 3. Intermediate: Company meeting introduction of new employee
  {
    id: 'part4-new-employee-intro',
    type: 'introduction',
    typeJa: '社内紹介',
    level: 'intermediate',
    talk: "Good morning, everyone. Before we begin today's meeting, I'd like to introduce our newest team member, Lisa Chen. Lisa joins us from our Singapore office, where she spent four years leading the product development team. She has a master's degree in computer science from Stanford University and has published several papers on artificial intelligence. Lisa will be heading our new innovation lab, which will focus on integrating AI solutions into our existing product line. She'll be sitting on the fifth floor near the engineering team. Please make her feel welcome, and don't hesitate to stop by and introduce yourselves. Lisa, would you like to say a few words?",
    questions: [
      {
        question: 'Where did Lisa Chen previously work?',
        questionJa: 'リサ・チェンは以前どこで働いていましたか？',
        options: [
          'At Stanford University',
          'At a competitor company',
          'At the Singapore office',
          'At the innovation lab',
        ],
        correctIndex: 2,
        explanation: '"Lisa joins us from our Singapore office" と言っています。',
      },
      {
        question: 'What will Lisa be responsible for?',
        questionJa: 'リサは何を担当しますか？',
        options: [
          'Managing the Singapore office',
          'Teaching at the university',
          'Heading the new innovation lab',
          'Reorganizing the engineering team',
        ],
        correctIndex: 2,
        explanation: '"Lisa will be heading our new innovation lab" と言っています。',
      },
      {
        question: 'Where will Lisa\'s office be located?',
        questionJa: 'リサのオフィスはどこにありますか？',
        options: [
          'On the first floor',
          'On the third floor',
          'On the fifth floor',
          'In the Singapore office',
        ],
        correctIndex: 2,
        explanation: '"She\'ll be sitting on the fifth floor near the engineering team." と言っています。',
      },
    ],
  },

  // 4. Intermediate: News report about company expansion
  {
    id: 'part4-news-expansion',
    type: 'news',
    typeJa: 'ニュースレポート',
    level: 'intermediate',
    talk: "In business news today, Pacific Tech Solutions announced plans to open three new regional offices in the Midwest United States. The offices, located in Chicago, Detroit, and Minneapolis, are expected to create approximately four hundred new jobs over the next two years. The company, which currently operates from its headquarters in San Francisco and offices in New York and Austin, said the expansion is part of its strategy to be closer to its growing client base in the manufacturing sector. Construction on the Chicago office is set to begin next month, with the facility expected to be operational by September. The Detroit and Minneapolis offices are scheduled to open early next year.",
    questions: [
      {
        question: 'How many new offices will Pacific Tech Solutions open?',
        questionJa: 'パシフィックテックソリューションズはいくつの新しいオフィスを開設しますか？',
        options: [
          'One',
          'Two',
          'Three',
          'Four',
        ],
        correctIndex: 2,
        explanation: '"plans to open three new regional offices" と報道されています。',
      },
      {
        question: 'Why is the company expanding to the Midwest?',
        questionJa: 'なぜ会社は中西部に拡大するのですか？',
        options: [
          'To reduce operating costs',
          'To be closer to manufacturing clients',
          'To move the headquarters',
          'To compete with local companies',
        ],
        correctIndex: 1,
        explanation: '"the expansion is part of its strategy to be closer to its growing client base in the manufacturing sector" と説明されています。',
      },
      {
        question: 'Which office will open first?',
        questionJa: 'どのオフィスが最初に開設されますか？',
        options: [
          'Detroit',
          'Minneapolis',
          'Chicago',
          'All three at the same time',
        ],
        correctIndex: 2,
        explanation: 'シカゴのオフィスの建設が来月始まり、9月に稼働予定です。デトロイトとミネアポリスは来年初めに予定されています。',
      },
    ],
  },

  // 5. Advanced: Conference keynote excerpt about industry trends
  {
    id: 'part4-keynote-trends',
    type: 'announcement',
    typeJa: '基調講演',
    level: 'advanced',
    talk: "Thank you for that kind introduction. Today I want to talk about the three forces that are reshaping our industry. First, artificial intelligence is no longer a future possibility — it's a present reality. Companies that fail to integrate AI into their workflows within the next eighteen months will find themselves at a severe competitive disadvantage. Second, sustainability has moved from a nice-to-have to a regulatory requirement. The new European directives taking effect in January will impose substantial penalties on companies that don't meet carbon reduction targets. And third, the shift to remote and hybrid work has fundamentally changed how we recruit, retain, and manage talent. Our research shows that companies offering flexible work arrangements see thirty-five percent lower turnover rates. The organizations that will thrive in this environment are those that can adapt to all three forces simultaneously, not sequentially.",
    questions: [
      {
        question: 'According to the speaker, what will happen to companies that don\'t adopt AI?',
        questionJa: 'スピーカーによると、AIを導入しない企業はどうなりますか？',
        options: [
          'They will face legal penalties.',
          'They will be at a competitive disadvantage.',
          'They will lose their best employees.',
          'They will need to merge with other companies.',
        ],
        correctIndex: 1,
        explanation: '"Companies that fail to integrate AI...will find themselves at a severe competitive disadvantage." と述べています。',
      },
      {
        question: 'What does the speaker say about sustainability?',
        questionJa: 'スピーカーはサステナビリティについて何と言っていますか？',
        options: [
          'It is optional for most companies.',
          'It only applies to European companies.',
          'It has become a regulatory requirement.',
          'It will be important in five years.',
        ],
        correctIndex: 2,
        explanation: '"sustainability has moved from a nice-to-have to a regulatory requirement" と言っています。',
      },
      {
        question: 'What does the research show about flexible work?',
        questionJa: 'フレキシブルワークについて調査は何を示していますか？',
        options: [
          'It reduces productivity by ten percent.',
          'It increases customer satisfaction.',
          'It lowers employee turnover by thirty-five percent.',
          'It saves companies fifty percent on office costs.',
        ],
        correctIndex: 2,
        explanation: '"companies offering flexible work arrangements see thirty-five percent lower turnover rates" と述べています。',
      },
    ],
  },

  // 6. Advanced: Investor briefing about quarterly earnings
  {
    id: 'part4-investor-briefing',
    type: 'announcement',
    typeJa: '投資家向けブリーフィング',
    level: 'advanced',
    talk: "Good afternoon, and thank you for joining us for Meridian Group's fourth quarter earnings call. I'm pleased to report that we've delivered strong results to close out the fiscal year. Total revenue for the quarter reached two point four billion dollars, representing a fourteen percent increase compared to the same period last year. Our operating margin improved to eighteen point five percent, up from fifteen point two percent a year ago, driven by our cost optimization initiatives and higher-margin product mix. Looking ahead, we're providing guidance for the first quarter of next year with expected revenue between two point five and two point seven billion dollars. We're also announcing a ten percent increase in our quarterly dividend, reflecting our confidence in the company's financial position. I'll now turn it over to our CFO, Karen Mitchell, who will walk you through the detailed financial statements.",
    questions: [
      {
        question: 'What was the total revenue for the fourth quarter?',
        questionJa: '第4四半期の総売上はいくらでしたか？',
        options: [
          'One point four billion dollars',
          'Two point four billion dollars',
          'Two point seven billion dollars',
          'Three point four billion dollars',
        ],
        correctIndex: 1,
        explanation: '"Total revenue for the quarter reached two point four billion dollars" と報告しています。',
      },
      {
        question: 'What contributed to the improved operating margin?',
        questionJa: '営業利益率の改善に貢献したのは何ですか？',
        options: [
          'Increased advertising spending',
          'Acquisition of a competitor',
          'Cost optimization and higher-margin products',
          'Reduced workforce',
        ],
        correctIndex: 2,
        explanation: '"driven by our cost optimization initiatives and higher-margin product mix" と説明しています。',
      },
      {
        question: 'What will Karen Mitchell discuss?',
        questionJa: 'カレン・ミッチェルは何について話しますか？',
        options: [
          'The company\'s marketing strategy',
          'New product launches',
          'Detailed financial statements',
          'Employee benefits changes',
        ],
        correctIndex: 2,
        explanation: '"our CFO, Karen Mitchell, who will walk you through the detailed financial statements" と言っています。',
      },
    ],
  },
];
