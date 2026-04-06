import type { Part3Question } from '../types';

export const part3Conversations: Part3Question[] = [
  // 1. Beginner: Ordering food at a cafe
  {
    id: 'part3-cafe-order',
    level: 'beginner',
    conversation: [
      { speaker: 'Woman', text: 'Hi, welcome to The Corner Cafe. What can I get for you today?' },
      { speaker: 'Man', text: "I'd like a medium latte and a blueberry muffin, please." },
      { speaker: 'Woman', text: "Sure. Would you like the latte hot or iced?" },
      { speaker: 'Man', text: "Hot, please. And could I also get a glass of water?" },
      { speaker: 'Woman', text: "Of course. That'll be seven fifty. Would you like to pay by cash or card?" },
      { speaker: 'Man', text: "Card, please." },
    ],
    questions: [
      {
        question: 'What does the man order to drink?',
        questionJa: '男性は飲み物に何を注文しましたか？',
        options: [
          'A hot latte and water',
          'An iced coffee',
          'A cup of tea',
          'An orange juice',
        ],
        correctIndex: 0,
        explanation: '男性は「hot latte」と「a glass of water」を注文しています。',
      },
      {
        question: 'How will the man pay?',
        questionJa: '男性はどのように支払いますか？',
        options: [
          'With cash',
          'With a gift card',
          'With a credit card',
          'With a mobile app',
        ],
        correctIndex: 2,
        explanation: '男性は "Card, please." と答えているので、カード払いです。',
      },
    ],
  },

  // 2. Beginner: Asking for directions in an office building
  {
    id: 'part3-office-directions',
    level: 'beginner',
    conversation: [
      { speaker: 'Man', text: "Excuse me, I'm looking for the Human Resources office. Could you help me?" },
      { speaker: 'Woman', text: "Sure. Take the elevator to the third floor. When you get off, turn left and it's the second door on your right." },
      { speaker: 'Man', text: "Third floor, turn left, second door on the right. Got it. Is there someone I should ask for?" },
      { speaker: 'Woman', text: "Yes, ask for Ms. Tanaka. She handles all new employee paperwork." },
    ],
    questions: [
      {
        question: 'Where is the Human Resources office?',
        questionJa: '人事部はどこにありますか？',
        options: [
          'On the first floor',
          'On the second floor',
          'On the third floor',
          'On the fourth floor',
        ],
        correctIndex: 2,
        explanation: '女性が "Take the elevator to the third floor." と案内しています。',
      },
      {
        question: 'Who should the man ask for?',
        questionJa: '男性は誰に尋ねるべきですか？',
        options: [
          'Mr. Smith',
          'Ms. Tanaka',
          'The receptionist',
          'The manager',
        ],
        correctIndex: 1,
        explanation: '女性が "ask for Ms. Tanaka" と言っています。',
      },
    ],
  },

  // 3. Intermediate: Discussing a project deadline change
  {
    id: 'part3-project-deadline',
    level: 'intermediate',
    conversation: [
      { speaker: 'Woman', text: "Tom, have you heard? The client moved the deadline for the marketing report up by two weeks." },
      { speaker: 'Man', text: "Two weeks earlier? That means we only have until March fifteenth instead of the twenty-ninth. That's going to be tight." },
      { speaker: 'Woman', text: "I know. I think we should reassign some tasks. Can you handle the data analysis section if I take over the competitor research?" },
      { speaker: 'Man', text: "That works for me. But we'll also need to get the design team started on the visuals right away. Should I email them today?" },
      { speaker: 'Woman', text: "Yes, please do. And let's set up a daily check-in starting tomorrow morning." },
    ],
    questions: [
      {
        question: 'What is the problem being discussed?',
        questionJa: '話し合われている問題は何ですか？',
        options: [
          'A report contains errors.',
          'A deadline has been moved up.',
          'A client cancelled a project.',
          'A team member is leaving.',
        ],
        correctIndex: 1,
        explanation: '女性が "The client moved the deadline...up by two weeks." と言っており、締め切りが前倒しになったことが話題です。',
      },
      {
        question: 'What will the man do?',
        questionJa: '男性は何をしますか？',
        options: [
          'Write the competitor research',
          'Contact the design team',
          'Meet with the client',
          'Cancel the daily meetings',
        ],
        correctIndex: 1,
        explanation: '男性がデザインチームにメールすると提案し、女性が "Yes, please do." と承認しています。また、男性はデータ分析セクションを担当します。',
      },
      {
        question: 'What does the woman suggest they start doing?',
        questionJa: '女性は何を始めることを提案していますか？',
        options: [
          'Working overtime every day',
          'Hiring additional staff',
          'Having daily check-in meetings',
          'Asking for a deadline extension',
        ],
        correctIndex: 2,
        explanation: '女性が "let\'s set up a daily check-in starting tomorrow morning." と提案しています。',
      },
    ],
  },

  // 4. Intermediate: Planning a business trip
  {
    id: 'part3-business-trip',
    level: 'intermediate',
    conversation: [
      { speaker: 'Man', text: "Sarah, I need to book travel for the conference in Singapore next month. Do we still have budget for business class?" },
      { speaker: 'Woman', text: "Unfortunately, the travel budget has been reduced this quarter. You'll need to fly economy, but I can get you a hotel upgrade to compensate." },
      { speaker: 'Man', text: "That's fine. How about the hotel? I'd prefer somewhere close to the convention center." },
      { speaker: 'Woman', text: "The Marina Bay Hotel is just a five-minute walk from the venue, and they have a corporate rate of one hundred eighty dollars per night." },
      { speaker: 'Man', text: "That sounds perfect. Can you book three nights? I'll fly out on Tuesday and return on Friday." },
      { speaker: 'Woman', text: "Sure. I'll also arrange airport transfers for you." },
    ],
    questions: [
      {
        question: 'Why can\'t the man fly business class?',
        questionJa: 'なぜ男性はビジネスクラスで飛べないのですか？',
        options: [
          'Business class is fully booked.',
          'The travel budget has been reduced.',
          'The company policy changed.',
          'The flight is too short.',
        ],
        correctIndex: 1,
        explanation: '女性が "the travel budget has been reduced this quarter" と説明しています。',
      },
      {
        question: 'What is special about the Marina Bay Hotel?',
        questionJa: 'マリーナベイホテルの特徴は何ですか？',
        options: [
          'It is the cheapest option.',
          'It has a swimming pool.',
          'It is near the convention center.',
          'It is brand new.',
        ],
        correctIndex: 2,
        explanation: '女性が "just a five-minute walk from the venue" と言っています。',
      },
      {
        question: 'How many nights will the man stay?',
        questionJa: '男性は何泊しますか？',
        options: [
          'Two nights',
          'Three nights',
          'Four nights',
          'Five nights',
        ],
        correctIndex: 1,
        explanation: '男性が "Can you book three nights?" と言っています。火曜出発、金曜帰国です。',
      },
    ],
  },

  // 5. Advanced: Negotiating a contract renewal
  {
    id: 'part3-contract-negotiation',
    level: 'advanced',
    conversation: [
      { speaker: 'Woman', text: "Mr. Henderson, thank you for meeting with us today. As you know, our current supply contract expires at the end of this quarter. We'd like to discuss the terms for renewal." },
      { speaker: 'Man', text: "Of course. We've valued our partnership with Greenfield Industries over the past three years. However, I should mention upfront that our raw material costs have increased by twelve percent since the original agreement." },
      { speaker: 'Woman', text: "We understand the market pressures, but a twelve percent increase across the board would significantly impact our margins. Would you consider a phased approach — perhaps a five percent increase now and another adjustment in six months based on market conditions?" },
      { speaker: 'Man', text: "That's a reasonable proposal. I'd also like to discuss extending the contract from one year to two years in exchange for more favorable pricing." },
      { speaker: 'Woman', text: "A two-year commitment is something we could consider, especially if the total increase stays under eight percent. Let me take this back to our CFO and get back to you by Friday." },
    ],
    questions: [
      {
        question: 'What is the relationship between the speakers?',
        questionJa: '話者の関係は何ですか？',
        options: [
          'Manager and employee',
          'Business partners discussing a contract',
          'Interviewer and job candidate',
          'Landlord and tenant',
        ],
        correctIndex: 1,
        explanation: '供給契約の更新について話し合っているビジネスパートナーです。',
      },
      {
        question: 'What does the woman propose regarding the price increase?',
        questionJa: '女性は値上げについて何を提案していますか？',
        options: [
          'Rejecting any increase',
          'Accepting twelve percent immediately',
          'A phased approach with a five percent increase first',
          'Switching to a different supplier',
        ],
        correctIndex: 2,
        explanation: '女性は "a five percent increase now and another adjustment in six months" という段階的アプローチを提案しています。',
      },
      {
        question: 'What will the woman do next?',
        questionJa: '女性は次に何をしますか？',
        options: [
          'Sign the contract immediately',
          'Consult with the CFO and respond by Friday',
          'Cancel the partnership',
          'Request a meeting with the board',
        ],
        correctIndex: 1,
        explanation: '女性が "Let me take this back to our CFO and get back to you by Friday." と言っています。',
      },
    ],
  },

  // 6. Advanced: Discussing quarterly results
  {
    id: 'part3-quarterly-results',
    level: 'advanced',
    conversation: [
      { speaker: 'Man', text: "Looking at the third quarter numbers, our revenue grew by eight percent year over year, which exceeded our forecast of six percent. The growth was primarily driven by the Asia-Pacific region." },
      { speaker: 'Woman', text: "That's encouraging. However, I'm concerned about the operating expenses. They increased by fifteen percent, mainly due to the new warehouse facility in Vietnam and the expanded sales team." },
      { speaker: 'Man', text: "You're right. The Vietnam facility won't reach full operational efficiency until the second quarter of next year. In the meantime, I recommend we hold off on any additional hiring and focus on optimizing our existing resources." },
      { speaker: 'Woman', text: "Agreed. I'd also suggest we accelerate the automation project in our logistics division. The initial investment is significant, but it could reduce operating costs by up to twenty percent within eighteen months." },
      { speaker: 'Man', text: "Good point. Let's include that in the proposal for the next board meeting." },
    ],
    questions: [
      {
        question: 'How did the third quarter revenue compare to the forecast?',
        questionJa: '第3四半期の売上は予測と比べてどうでしたか？',
        options: [
          'It fell below expectations.',
          'It matched the forecast exactly.',
          'It exceeded the forecast.',
          'The forecast was not mentioned.',
        ],
        correctIndex: 2,
        explanation: '男性が "revenue grew by eight percent...which exceeded our forecast of six percent" と言っており、予測を上回りました。',
      },
      {
        question: 'What is causing concern?',
        questionJa: '何が懸念されていますか？',
        options: [
          'Declining revenue in Asia-Pacific',
          'Rising operating expenses',
          'Employee turnover',
          'Customer complaints',
        ],
        correctIndex: 1,
        explanation: '女性が "I\'m concerned about the operating expenses. They increased by fifteen percent" と言っています。',
      },
      {
        question: 'What does the woman suggest to reduce costs?',
        questionJa: '女性はコスト削減のために何を提案していますか？',
        options: [
          'Closing the Vietnam warehouse',
          'Reducing the sales team',
          'Accelerating the automation project',
          'Postponing the board meeting',
        ],
        correctIndex: 2,
        explanation: '女性が "accelerate the automation project in our logistics division" を提案しています。',
      },
    ],
  },
];
