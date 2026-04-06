import type { ReadingPassage } from '../types';

export const readingPassages: ReadingPassage[] = [
  // 1. Beginner - Email
  {
    id: 'reading-beginner-email',
    title: 'Meeting Schedule Change',
    titleJa: '会議スケジュールの変更',
    type: 'Email',
    typeJa: 'メール',
    level: 'beginner',
    passage: `From: Sarah Johnson <s.johnson@globaltech.com>
To: All Marketing Team Members
Date: March 15, 2025
Subject: Change of Meeting Time

Dear Team,

I am writing to inform you that our weekly marketing meeting has been moved from Tuesday at 10:00 AM to Wednesday at 2:00 PM. This change will take effect starting next week, March 19.

The meeting room has also changed. We will now meet in Conference Room B on the 3rd floor instead of Conference Room A on the 2nd floor.

Please update your calendars accordingly. If you have any scheduling conflicts, please let me know by Friday so we can find a solution.

The agenda for next week's meeting will be sent out on Monday afternoon.

Best regards,
Sarah Johnson
Marketing Director`,
    questions: [
      {
        id: 'rbe-q1',
        question: 'What is the main purpose of this email?',
        questionJa: 'このメールの主な目的は何ですか？',
        options: [
          'To cancel a weekly meeting',
          'To announce a change in meeting schedule',
          'To introduce a new team member',
          'To share the meeting agenda',
        ],
        correctIndex: 1,
        explanation:
          '件名に「Change of Meeting Time」とあり、本文で会議の曜日・時間・場所の変更を伝えています。キャンセルではなく変更の通知です。',
      },
      {
        id: 'rbe-q2',
        question: 'When will the new meeting time begin?',
        questionJa: '新しい会議時間はいつから始まりますか？',
        options: [
          'This Tuesday',
          'This Wednesday',
          'Next week, March 19',
          'Next Monday',
        ],
        correctIndex: 2,
        explanation:
          '「This change will take effect starting next week, March 19」と記載されており、来週の3月19日から新しいスケジュールが適用されます。',
      },
      {
        id: 'rbe-q3',
        question: 'What should employees do if they have a scheduling conflict?',
        questionJa: 'スケジュールが合わない場合、従業員は何をすべきですか？',
        options: [
          'Send an email to the whole team',
          'Attend the meeting anyway',
          'Notify Sarah by Friday',
          'Contact the IT department',
        ],
        correctIndex: 2,
        explanation:
          '「please let me know by Friday so we can find a solution」とあり、金曜日までにSarahに知らせるよう求めています。',
      },
    ],
  },

  // 2. Beginner - Notice
  {
    id: 'reading-beginner-notice',
    title: 'Office Renovation Notice',
    titleJa: 'オフィス改装のお知らせ',
    type: 'Notice',
    typeJa: 'お知らせ',
    level: 'beginner',
    passage: `NOTICE TO ALL EMPLOYEES

Office Renovation — Temporary Relocation

Please be advised that the 4th floor office space will undergo renovation beginning Monday, April 7, through Friday, April 25. During this period, all 4th floor employees will be temporarily relocated.

Relocation Details:
- Sales Department → 2nd Floor, Room 201
- Customer Service → 2nd Floor, Room 205
- Human Resources → 3rd Floor, Room 310

Important Notes:
• All personal items should be packed and labeled by Friday, April 4.
• Moving boxes will be provided at the front desk starting April 2.
• The company will handle the transfer of computers and office equipment.
• Please take all valuables home before the move.

The renovated office will feature an open floor plan with new furniture, improved lighting, and additional meeting rooms.

For questions, please contact Facilities Management at ext. 4500 or facilities@greenfield.com.

Facilities Management Department
Greenfield Corporation`,
    questions: [
      {
        id: 'rbn-q1',
        question: 'How long will the renovation last?',
        questionJa: '改装工事はどのくらいの期間ですか？',
        options: [
          'One week',
          'Two weeks',
          'Three weeks',
          'One month',
        ],
        correctIndex: 2,
        explanation:
          '4月7日（月）から4月25日（金）までの期間で、約3週間（three weeks）です。',
      },
      {
        id: 'rbn-q2',
        question: 'Where will the Human Resources department be temporarily located?',
        questionJa: '人事部は一時的にどこに移動しますか？',
        options: [
          '2nd Floor, Room 201',
          '2nd Floor, Room 205',
          '3rd Floor, Room 310',
          '4th Floor, Room 401',
        ],
        correctIndex: 2,
        explanation:
          '「Human Resources → 3rd Floor, Room 310」と記載されています。SalesはRoom 201、Customer ServiceはRoom 205です。',
      },
      {
        id: 'rbn-q3',
        question: 'What are employees NOT required to do before the move?',
        questionJa: '引っ越し前に従業員がする必要がないことは何ですか？',
        options: [
          'Pack and label personal items',
          'Transfer their own computers',
          'Take valuables home',
          'Pick up moving boxes',
        ],
        correctIndex: 1,
        explanation:
          '「The company will handle the transfer of computers and office equipment」とあり、コンピューターの移動は会社が行うため、従業員が自分で行う必要はありません。',
      },
    ],
  },

  // 3. Intermediate - Advertisement
  {
    id: 'reading-intermediate-ad',
    title: 'Marketing Manager Position',
    titleJa: 'マーケティングマネージャー募集',
    type: 'Advertisement',
    typeJa: '求人広告',
    level: 'intermediate',
    passage: `CAREER OPPORTUNITY

Marketing Manager — Horizon Digital Solutions

Horizon Digital Solutions, a rapidly growing technology firm based in San Francisco, is seeking an experienced Marketing Manager to lead our expanding marketing team.

Position: Marketing Manager
Location: San Francisco, CA (Hybrid — 3 days in office)
Salary Range: $95,000 – $120,000 annually
Reports to: Vice President of Marketing

Key Responsibilities:
• Develop and execute comprehensive digital marketing strategies
• Manage a team of 6 marketing specialists and coordinate with external agencies
• Oversee the company's social media presence across all platforms
• Analyze campaign performance data and prepare monthly reports for senior management
• Manage an annual marketing budget of $2.5 million

Required Qualifications:
• Bachelor's degree in Marketing, Business Administration, or related field
• Minimum 5 years of experience in digital marketing, with at least 2 years in a management role
• Proven track record of successful campaign management
• Strong analytical skills and proficiency in Google Analytics, HubSpot, and CRM tools
• Excellent written and verbal communication skills

Preferred Qualifications:
• MBA or Master's degree in a related field
• Experience in the technology or SaaS industry
• Certification in Google Ads or Meta Blueprint

We offer competitive benefits including health insurance, 401(k) matching, 20 days PTO, and professional development opportunities.

To apply, submit your resume and cover letter to careers@horizonds.com by April 30, 2025.`,
    questions: [
      {
        id: 'ria-q1',
        question: 'What type of work arrangement does this position offer?',
        questionJa: 'このポジションはどのような勤務形態ですか？',
        options: [
          'Fully remote',
          'Fully in-office',
          'Hybrid with 3 days in office',
          'Flexible with no requirements',
        ],
        correctIndex: 2,
        explanation:
          '「Hybrid — 3 days in office」と明記されており、週3日オフィス出勤のハイブリッド勤務です。',
      },
      {
        id: 'ria-q2',
        question: 'What is a required qualification for this position?',
        questionJa: 'このポジションの必須条件は何ですか？',
        options: [
          'An MBA degree',
          'Experience in the SaaS industry',
          'At least 5 years of digital marketing experience',
          'Google Ads certification',
        ],
        correctIndex: 2,
        explanation:
          'Required Qualificationsに「Minimum 5 years of experience in digital marketing」とあります。MBA、SaaS経験、Google Ads認定はPreferred（優遇条件）です。',
      },
      {
        id: 'ria-q3',
        question: 'How large is the marketing budget the manager will oversee?',
        questionJa: 'マネージャーが管理するマーケティング予算はいくらですか？',
        options: [
          '$950,000',
          '$1.2 million',
          '$2.5 million',
          '$5 million',
        ],
        correctIndex: 2,
        explanation:
          '「Manage an annual marketing budget of $2.5 million」と記載されています。年間250万ドルの予算管理が責務です。',
      },
      {
        id: 'ria-q4',
        question: 'Which of the following is NOT mentioned as a company benefit?',
        questionJa: '会社の福利厚生として言及されていないものはどれですか？',
        options: [
          'Health insurance',
          'Stock options',
          '401(k) matching',
          'Professional development opportunities',
        ],
        correctIndex: 1,
        explanation:
          '福利厚生として「health insurance, 401(k) matching, 20 days PTO, and professional development opportunities」が挙げられていますが、stock options（ストックオプション）は含まれていません。',
      },
    ],
  },

  // 4. Intermediate - Article
  {
    id: 'reading-intermediate-article',
    title: 'NovaTech Acquires DataStream Analytics',
    titleJa: 'NovaTech社がDataStream Analytics社を買収',
    type: 'Article',
    typeJa: 'ニュース記事',
    level: 'intermediate',
    passage: `NovaTech Inc. Completes Acquisition of DataStream Analytics

SAN JOSE, March 10 — NovaTech Inc., one of the leading enterprise software companies in North America, announced today the completion of its acquisition of DataStream Analytics for $340 million. The deal, which was first announced in January, received regulatory approval last week.

DataStream Analytics, founded in 2018 in Austin, Texas, specializes in AI-powered business intelligence tools that help companies analyze large volumes of customer data. The company currently serves over 800 corporate clients, including several Fortune 500 companies.

"This acquisition strengthens our position in the rapidly growing data analytics market," said Jennifer Park, CEO of NovaTech. "DataStream's innovative AI technology, combined with our established enterprise platform, will allow us to offer our clients a more comprehensive suite of tools."

Under the terms of the agreement, DataStream will operate as a wholly owned subsidiary of NovaTech. All 250 DataStream employees will retain their positions, and the Austin office will remain open as a regional technology hub.

Michael Torres, founder and CEO of DataStream, will join NovaTech's executive team as Senior Vice President of Analytics. "Joining NovaTech gives us access to resources and global distribution channels that will accelerate our growth," Torres said.

Industry analysts predict that the combined company will be well-positioned to compete with larger rivals such as Salesforce and Oracle in the enterprise analytics space. NovaTech expects the acquisition to contribute an additional $50 million in annual revenue starting in the next fiscal year.`,
    questions: [
      {
        id: 'riar-q1',
        question: 'How much did NovaTech pay for DataStream Analytics?',
        questionJa: 'NovaTechはDataStream Analyticsにいくら支払いましたか？',
        options: [
          '$50 million',
          '$250 million',
          '$340 million',
          '$500 million',
        ],
        correctIndex: 2,
        explanation:
          '「its acquisition of DataStream Analytics for $340 million」と明記されています。$50 millionは追加年間収益の予測額です。',
      },
      {
        id: 'riar-q2',
        question: 'What will happen to DataStream\'s employees after the acquisition?',
        questionJa: '買収後、DataStreamの従業員はどうなりますか？',
        options: [
          'They will be relocated to San Jose',
          'Half of them will be laid off',
          'They will all keep their jobs',
          'They will need to reapply for positions',
        ],
        correctIndex: 2,
        explanation:
          '「All 250 DataStream employees will retain their positions」とあり、全250名の従業員がポジションを維持します。',
      },
      {
        id: 'riar-q3',
        question: 'What role will Michael Torres assume at NovaTech?',
        questionJa: 'Michael TorresはNovaTechでどのような役職に就きますか？',
        options: [
          'Chief Executive Officer',
          'Chief Technology Officer',
          'Senior Vice President of Analytics',
          'Vice President of Engineering',
        ],
        correctIndex: 2,
        explanation:
          '「will join NovaTech\'s executive team as Senior Vice President of Analytics」と記載されています。CEOではなくSVPとして参画します。',
      },
      {
        id: 'riar-q4',
        question: 'What does the word "comprehensive" in paragraph 3 most likely mean?',
        questionJa: '第3段落の「comprehensive」はどのような意味で使われていますか？',
        options: [
          'Expensive',
          'Complete and thorough',
          'Simple and basic',
          'Temporary',
        ],
        correctIndex: 1,
        explanation:
          '「a more comprehensive suite of tools」は「より包括的なツール群」という意味です。comprehensiveは「完全で徹底的な（complete and thorough）」という意味です。',
      },
    ],
  },

  // 5. Advanced - Double Passage
  {
    id: 'reading-advanced-double',
    title: 'Annual Conference Planning',
    titleJa: '年次カンファレンスの企画',
    type: 'Double Passage',
    typeJa: '二重文書',
    level: 'advanced',
    passage: `--- Email 1 ---

From: Lisa Chen <l.chen@meridiangroup.com>
To: Robert Kim <r.kim@meridiangroup.com>
Date: February 20, 2025
Subject: Annual Leadership Conference — Venue Options

Hi Robert,

I've been researching venues for our Annual Leadership Conference scheduled for June 12-14. Based on our requirements (capacity for 300 attendees, breakout rooms, AV equipment, and catering), I've narrowed it down to two options:

Option A: Grand Pacific Hotel
- Cost: $45,000 (includes all meeting rooms, AV, and basic catering)
- Location: Downtown, easily accessible by public transport
- Availability: June 12-14 confirmed
- Note: Catering is limited to continental breakfast and lunch buffet. Dinner would need to be arranged separately at an estimated additional cost of $8,000.

Option B: Riverside Convention Center
- Cost: $52,000 (all-inclusive package with full catering for all three days)
- Location: 20 minutes from downtown by shuttle
- Availability: June 12-14 confirmed
- Note: Includes a dedicated event coordinator and complimentary parking for all attendees.

Last year we spent $48,000 total at the Hilton, and several attendees complained about the limited parking. Our budget this year is $55,000.

Please let me know your preference by February 28 so I can secure the booking.

Best,
Lisa

--- Email 2 ---

From: Robert Kim <r.kim@meridiangroup.com>
To: Lisa Chen <l.chen@meridiangroup.com>
Date: February 24, 2025
Subject: Re: Annual Leadership Conference — Venue Options

Hi Lisa,

Thank you for the thorough research. After reviewing both options and consulting with the executive team, I'd like to go with Option B, the Riverside Convention Center. Here's my reasoning:

1. The all-inclusive package eliminates the need for separate dinner arrangements, saving us coordination time and keeping costs predictable.
2. The total cost of Option A with dinner ($53,000) is actually close to Option B ($52,000), making Riverside the better value.
3. The dedicated event coordinator will be extremely helpful, especially since our internal events team is currently short-staffed.
4. The complimentary parking directly addresses last year's attendee feedback.

However, I do have two requests:
- Could you negotiate a shuttle service from the downtown train station? Many attendees will be traveling from out of town.
- Please check if we can add a networking reception on the evening of June 12 within our remaining budget.

Let's finalize the contract by March 7. I'll also need you to send a save-the-date notice to all department heads by the end of this week.

Thanks,
Robert`,
    questions: [
      {
        id: 'rad-q1',
        question: 'Why did Robert choose the Riverside Convention Center over the Grand Pacific Hotel?',
        questionJa: 'RobertがGrand Pacific HotelよりRiverside Convention Centerを選んだ理由は何ですか？',
        options: [
          'It is closer to downtown',
          'It costs significantly less',
          'It offers better overall value with all-inclusive services',
          'It has a larger capacity',
        ],
        correctIndex: 2,
        explanation:
          'Robertは4つの理由を挙げていますが、オールインクルーシブで追加手配不要、実質コストが近い、イベントコーディネーター付き、駐車場無料など、総合的な価値（better overall value）が決め手です。',
      },
      {
        id: 'rad-q2',
        question: 'What was a problem mentioned about last year\'s conference?',
        questionJa: '昨年のカンファレンスで指摘された問題は何でしたか？',
        options: [
          'The venue was too expensive',
          'The food quality was poor',
          'Parking was limited',
          'The meeting rooms were too small',
        ],
        correctIndex: 2,
        explanation:
          'Lisaのメールに「several attendees complained about the limited parking」とあり、駐車場が限られていたことが問題でした。',
      },
      {
        id: 'rad-q3',
        question: 'What is the total cost of Option A if dinner is included?',
        questionJa: 'ディナーを含めたOption Aの総費用はいくらですか？',
        options: [
          '$45,000',
          '$48,000',
          '$52,000',
          '$53,000',
        ],
        correctIndex: 3,
        explanation:
          'Option Aの基本費用$45,000にディナーの追加費用$8,000を加えると$53,000です。Robertも「The total cost of Option A with dinner ($53,000)」と計算しています。',
      },
      {
        id: 'rad-q4',
        question: 'What does Robert ask Lisa to do by the end of the week?',
        questionJa: 'Robertは今週末までにLisaに何を依頼しましたか？',
        options: [
          'Finalize the contract with Riverside',
          'Send a save-the-date notice to department heads',
          'Negotiate a discount on the venue',
          'Book a shuttle service from the airport',
        ],
        correctIndex: 1,
        explanation:
          '「send a save-the-date notice to all department heads by the end of this week」とあり、今週末までに各部門長にセーブ・ザ・デート通知を送ることを依頼しています。契約締結は3月7日までです。',
      },
    ],
  },

  // 6. Advanced - Letter
  {
    id: 'reading-advanced-letter',
    title: 'Contract Renewal Terms',
    titleJa: '契約更新の条件',
    type: 'Letter',
    typeJa: 'ビジネスレター',
    level: 'advanced',
    passage: `STERLING & ASSOCIATES
Legal Consulting Services
1200 Corporate Plaza, Suite 800
Chicago, IL 60601

March 3, 2025

Mr. David Chen
Chief Operating Officer
Pacific Manufacturing Inc.
500 Industrial Boulevard
Portland, OR 97201

Dear Mr. Chen,

Re: Service Agreement Renewal — Contract No. PMI-2022-0847

I am writing regarding the upcoming renewal of our consulting service agreement, which is set to expire on April 30, 2025. We have greatly valued our partnership with Pacific Manufacturing over the past three years and look forward to continuing our collaboration.

After careful review of our current agreement and considering the expanded scope of services we have provided over the past year, we would like to propose the following terms for the renewal period (May 1, 2025 – April 30, 2027):

1. Contract Duration: Two-year term (previously one-year), providing greater stability for both parties and allowing for more strategic long-term planning.

2. Monthly Retainer: $18,500 (an increase from the current $15,000). This adjustment reflects the addition of regulatory compliance consulting, which was handled on an ad-hoc basis at $250/hour last year and averaged approximately $3,200 per month.

3. Scope of Services: The retainer will now include regulatory compliance consulting as a standard service, along with all existing services (legal advisory, contract review, and litigation support).

4. Performance Review: Quarterly performance reviews with your management team to ensure service quality and alignment with your business objectives.

5. Termination Clause: Either party may terminate with 90 days' written notice (previously 60 days), with a pro-rated refund of any prepaid fees.

Please note that the proposed monthly increase of $3,500 is actually lower than the average monthly ad-hoc compliance charges of $3,200 when factoring in the elimination of per-hour billing for these services, resulting in more predictable costs for your organization.

We would appreciate the opportunity to discuss these terms at your convenience. I am available for a meeting or call anytime during the week of March 10. Please feel free to contact me directly at (312) 555-0194 or via email at m.sterling@sterlingassoc.com.

Sincerely,

Margaret Sterling
Managing Partner
Sterling & Associates`,
    questions: [
      {
        id: 'ral-q1',
        question: 'What is the primary purpose of this letter?',
        questionJa: 'この手紙の主な目的は何ですか？',
        options: [
          'To terminate an existing contract',
          'To propose new contract renewal terms',
          'To complain about payment issues',
          'To introduce a new consulting firm',
        ],
        correctIndex: 1,
        explanation:
          '「I am writing regarding the upcoming renewal of our consulting service agreement」とあり、コンサルティングサービス契約の更新条件を提案することが目的です。',
      },
      {
        id: 'ral-q2',
        question: 'Why is the monthly retainer increasing from $15,000 to $18,500?',
        questionJa: '月額リテーナーが$15,000から$18,500に増加する理由は何ですか？',
        options: [
          'Due to general inflation',
          'Because of additional staff costs',
          'To include regulatory compliance consulting as a standard service',
          'To cover new office expenses',
        ],
        correctIndex: 2,
        explanation:
          '「This adjustment reflects the addition of regulatory compliance consulting」とあり、これまで時間単価で別途請求していた規制コンプライアンスのコンサルティングを標準サービスに含めるためです。',
      },
      {
        id: 'ral-q3',
        question: 'How does the proposed contract length differ from the current one?',
        questionJa: '提案された契約期間は現在のものとどう異なりますか？',
        options: [
          'It changes from two years to one year',
          'It changes from one year to two years',
          'It remains the same at one year',
          'It changes from three years to two years',
        ],
        correctIndex: 1,
        explanation:
          '「Two-year term (previously one-year)」と記載されており、1年契約から2年契約に変更されています。',
      },
      {
        id: 'ral-q4',
        question: 'According to the letter, how does the cost increase benefit Pacific Manufacturing?',
        questionJa: '手紙によると、費用増加はPacific Manufacturing社にどのような利点がありますか？',
        options: [
          'It reduces the total number of services provided',
          'It eliminates per-hour billing for compliance work, making costs more predictable',
          'It shortens the termination notice period',
          'It guarantees a fixed discount on all services',
        ],
        correctIndex: 1,
        explanation:
          '「the elimination of per-hour billing for these services, resulting in more predictable costs」とあり、時間単位の請求がなくなりコストが予測しやすくなる点が利点として述べられています。',
      },
    ],
  },

  // 7. Beginner - Schedule
  {
    id: 'reading-beginner-schedule',
    title: 'Weekly Training Schedule',
    titleJa: '週間研修スケジュール',
    type: 'Schedule',
    typeJa: 'スケジュール表',
    level: 'beginner',
    passage: `Brightway Solutions — Employee Training Schedule
Week of May 12–16, 2025

-------------------------------------------------------------
| Day       | Time          | Training Topic            | Instructor     | Room   |
-------------------------------------------------------------
| Monday    | 9:00–10:30 AM | New Employee Orientation  | Karen Walsh    | A-101  |
| Monday    | 2:00–3:30 PM  | Workplace Safety          | Tom Rivera     | B-205  |
| Tuesday   | 10:00–11:30 AM| Customer Service Skills   | Karen Walsh    | A-101  |
| Wednesday | 9:00–10:00 AM | IT Security Basics        | David Nguyen   | C-310  |
| Wednesday | 1:00–3:00 PM  | Leadership Workshop       | External Coach | A-101  |
| Thursday  | 9:00–11:00 AM | Project Management Tools  | David Nguyen   | C-310  |
| Friday    | 10:00–11:00 AM| Weekly Review & Q&A       | Karen Walsh    | A-101  |
-------------------------------------------------------------

Notes:
• All sessions are mandatory for new employees hired after April 1.
• The Leadership Workshop on Wednesday is open to team leaders and managers only.
• Please bring your company laptop to the IT Security Basics and Project Management Tools sessions.
• Contact HR at ext. 2200 or hr@brightway.com to register.`,
    questions: [
      {
        id: 'rbs-q1',
        question: 'Who is leading the most training sessions during the week?',
        questionJa: '週の中で最も多くの研修セッションを担当しているのは誰ですか？',
        options: [
          'Tom Rivera',
          'David Nguyen',
          'Karen Walsh',
          'External Coach',
        ],
        correctIndex: 2,
        explanation:
          'Karen Walshは月曜のNew Employee Orientation、火曜のCustomer Service Skills、金曜のWeekly Review & Q&Aの3セッションを担当しており、最も多くのセッションを持っています。',
      },
      {
        id: 'rbs-q2',
        question: 'Which session is restricted to certain employees?',
        questionJa: '特定の従業員に限定されているセッションはどれですか？',
        options: [
          'New Employee Orientation',
          'Workplace Safety',
          'Leadership Workshop',
          'IT Security Basics',
        ],
        correctIndex: 2,
        explanation:
          '注記に「The Leadership Workshop on Wednesday is open to team leaders and managers only」とあり、チームリーダーとマネージャーのみが参加可能です。',
      },
      {
        id: 'rbs-q3',
        question: 'What should employees bring to the Wednesday morning session?',
        questionJa: '水曜日の午前のセッションに従業員は何を持参すべきですか？',
        options: [
          'A printed schedule',
          'Their company laptop',
          'A safety manual',
          'Their employee ID badge',
        ],
        correctIndex: 1,
        explanation:
          '水曜午前はIT Security Basicsで、注記に「Please bring your company laptop to the IT Security Basics and Project Management Tools sessions」とあり、会社のノートパソコンを持参する必要があります。',
      },
    ],
  },

  // 8. Beginner - Form
  {
    id: 'reading-beginner-form',
    title: 'Customer Satisfaction Survey',
    titleJa: '顧客満足度アンケート',
    type: 'Form',
    typeJa: 'アンケート用紙',
    level: 'beginner',
    passage: `PINECREST HOTEL — Guest Satisfaction Survey

Thank you for choosing Pinecrest Hotel. We value your feedback and would appreciate a few minutes of your time to complete this survey.

Instructions:
1. Please rate each category below on a scale of 1 to 5 (1 = Very Poor, 5 = Excellent).
2. Write any additional comments in the space provided.
3. Drop the completed form in the feedback box at the front desk, or scan the QR code on the back of this form to submit online.
4. Surveys must be submitted before checkout. Late submissions will not be eligible for the prize draw.

Guest Name: _______________    Room Number: _______________
Check-in Date: _______________  Check-out Date: _______________

Categories:
□ Room Cleanliness        [1] [2] [3] [4] [5]
□ Staff Friendliness      [1] [2] [3] [4] [5]
□ Breakfast Quality       [1] [2] [3] [4] [5]
□ Wi-Fi Reliability       [1] [2] [3] [4] [5]
□ Overall Value for Money [1] [2] [3] [4] [5]

Additional Comments:
_____________________________________________
_____________________________________________

* All completed surveys will be entered into a monthly prize draw for a complimentary one-night stay.
* Your personal information will be used solely for service improvement and will not be shared with third parties.`,
    questions: [
      {
        id: 'rbf-q1',
        question: 'What personal information must guests provide on the form?',
        questionJa: 'ゲストがフォームに記入する個人情報は何ですか？',
        options: [
          'Name, email address, and phone number',
          'Name, room number, and stay dates',
          'Name, passport number, and nationality',
          'Name, home address, and credit card number',
        ],
        correctIndex: 1,
        explanation:
          'フォームには「Guest Name」「Room Number」「Check-in Date」「Check-out Date」の記入欄があり、名前・部屋番号・滞在日程の情報が求められています。',
      },
      {
        id: 'rbf-q2',
        question: 'When must the survey be submitted?',
        questionJa: 'アンケートはいつまでに提出しなければなりませんか？',
        options: [
          'Within 24 hours of arrival',
          'By the end of the month',
          'Before checkout',
          'Within one week of departure',
        ],
        correctIndex: 2,
        explanation:
          '「Surveys must be submitted before checkout. Late submissions will not be eligible for the prize draw.」とあり、チェックアウト前に提出する必要があります。',
      },
      {
        id: 'rbf-q3',
        question: 'How can guests submit the completed survey?',
        questionJa: '完成したアンケートはどのように提出できますか？',
        options: [
          'By email or fax',
          'By mail or phone',
          'At the front desk feedback box or online via QR code',
          'By handing it to their room attendant',
        ],
        correctIndex: 2,
        explanation:
          '「Drop the completed form in the feedback box at the front desk, or scan the QR code on the back of this form to submit online」とあり、フロントデスクのフィードバックボックスに投函するか、QRコードからオンラインで提出できます。',
      },
    ],
  },

  // 9. Intermediate - Memo
  {
    id: 'reading-intermediate-memo',
    title: 'Updated Expense Report Policy',
    titleJa: '経費精算ポリシーの変更',
    type: 'Memo',
    typeJa: '社内メモ',
    level: 'intermediate',
    passage: `INTERNAL MEMORANDUM

TO: All Employees
FROM: Patricia Gomez, Chief Financial Officer
DATE: April 14, 2025
RE: Updated Expense Report Policy — Effective May 1, 2025

This memo outlines important changes to our expense report policy. These updates are being implemented to improve processing efficiency and ensure compliance with our latest audit recommendations.

Key Changes:

1. Digital Receipts Required
   Effective May 1, paper receipts will no longer be accepted. All receipts must be uploaded through the ExpenseTrack mobile app or scanned and attached to the online submission form. Receipts must be uploaded within 5 business days of the transaction date.

2. Pre-Approval for Expenses Over $200
   Any single expense exceeding $200 now requires advance approval from your department manager before the purchase is made. Previously, the threshold was $500. This change was recommended by our external auditors to strengthen internal controls.

3. Travel Meal Per Diem
   The daily meal allowance for domestic business travel has been increased from $60 to $75 per day. International travel meal allowances will remain at $100 per day. Alcohol purchases remain excluded from reimbursement regardless of location.

4. Submission Deadline
   Expense reports must be submitted within 10 business days of the last expense date (previously 30 days). Reports submitted after this deadline will require VP-level approval and may be subject to delayed reimbursement.

Training sessions on the new ExpenseTrack app will be held during the week of April 21. Check the HR portal for session times and registration. Attendance is strongly recommended but not mandatory.

For questions, please contact the Finance Department at finance@company.com or ext. 3400.`,
    questions: [
      {
        id: 'rim-q1',
        question: 'What is the main reason for the policy changes?',
        questionJa: 'ポリシー変更の主な理由は何ですか？',
        options: [
          'To reduce the company\'s overall spending',
          'To comply with new government regulations',
          'To improve processing efficiency and follow audit recommendations',
          'To prepare for a company merger',
        ],
        correctIndex: 2,
        explanation:
          '「These updates are being implemented to improve processing efficiency and ensure compliance with our latest audit recommendations」とあり、処理効率の改善と監査勧告への準拠が目的です。',
      },
      {
        id: 'rim-q2',
        question: 'How has the pre-approval threshold changed?',
        questionJa: '事前承認の閾値はどのように変わりましたか？',
        options: [
          'From $200 to $500',
          'From $500 to $200',
          'From $100 to $200',
          'From $500 to $1,000',
        ],
        correctIndex: 1,
        explanation:
          '「Any single expense exceeding $200 now requires advance approval... Previously, the threshold was $500」とあり、$500から$200に引き下げられました。',
      },
      {
        id: 'rim-q3',
        question: 'What happens if an expense report is submitted after the deadline?',
        questionJa: '期限後に経費精算書を提出するとどうなりますか？',
        options: [
          'It will be automatically rejected',
          'The employee will receive a warning',
          'It will require VP-level approval and may be reimbursed late',
          'The employee must resubmit the following month',
        ],
        correctIndex: 2,
        explanation:
          '「Reports submitted after this deadline will require VP-level approval and may be subject to delayed reimbursement」とあり、VP承認が必要になり、払い戻しが遅れる可能性があります。',
      },
      {
        id: 'rim-q4',
        question: 'Which of the following is NOT a change mentioned in the memo?',
        questionJa: 'メモに記載されていない変更はどれですか？',
        options: [
          'Requiring digital receipts instead of paper',
          'Increasing the international meal allowance',
          'Lowering the pre-approval threshold',
          'Shortening the submission deadline',
        ],
        correctIndex: 1,
        explanation:
          '国際出張の食事手当は「International travel meal allowances will remain at $100 per day」とあり、変更されていません。増額されたのは国内出張の食事手当（$60→$75）です。',
      },
    ],
  },

  // 10. Intermediate - Review
  {
    id: 'reading-intermediate-review',
    title: 'Restaurant Review: The Golden Terrace',
    titleJa: 'レストランレビュー：ザ・ゴールデンテラス',
    type: 'Review',
    typeJa: 'レビュー',
    level: 'intermediate',
    passage: `The Golden Terrace — Mediterranean Bistro
★★★★☆ (4 out of 5)
Reviewed by: Amanda Foster | Visited: March 22, 2025

I visited The Golden Terrace on a Saturday evening with a group of four for a friend's birthday celebration. The restaurant is located on the second floor of the Harborview Building, offering a stunning view of the waterfront — definitely request a window table if you can.

The menu features a creative selection of Mediterranean dishes with a modern twist. We started with the grilled halloumi salad ($14) and the seafood bruschetta ($16), both of which were beautifully presented and delicious. For main courses, I had the lamb tagine ($28), which was perfectly seasoned and tender. My companions ordered the grilled sea bass ($32) and the mushroom risotto ($22), and everyone was impressed with the portion sizes and flavor.

Where the restaurant fell short, however, was the service. Despite having a reservation, we waited 25 minutes to be seated. Our server was friendly but seemed overwhelmed, and there was a noticeable delay between courses — we waited nearly 40 minutes for our main dishes after the appetizers were cleared. Additionally, one dish was brought to the wrong table and had to be sent back.

The dessert selection was limited — only three options — but the pistachio baklava ($12) was a perfect ending to the meal. The total bill for four came to approximately $280 before tip, which I consider reasonable for the quality and location.

Overall, The Golden Terrace is a wonderful spot for a special occasion if you're not in a rush. I would recommend making a reservation and arriving early. I'll certainly return, but I hope the service improves as the restaurant settles in — it only opened two months ago, which may explain some of the growing pains.`,
    questions: [
      {
        id: 'rir-q1',
        question: 'What was the reviewer\'s main complaint about the restaurant?',
        questionJa: 'レビュアーの主な不満は何でしたか？',
        options: [
          'The food quality was poor',
          'The prices were too high',
          'The service was slow and disorganized',
          'The restaurant was too noisy',
        ],
        correctIndex: 2,
        explanation:
          '「Where the restaurant fell short, however, was the service」とあり、着席までの待ち時間、料理提供の遅延、料理の配膳ミスなど、サービスの遅さと不手際が主な不満点でした。',
      },
      {
        id: 'rir-q2',
        question: 'What does the reviewer suggest might explain the service issues?',
        questionJa: 'レビュアーはサービスの問題の原因として何を示唆していますか？',
        options: [
          'The restaurant is understaffed',
          'The restaurant only opened recently',
          'The menu is too complicated',
          'The kitchen equipment is outdated',
        ],
        correctIndex: 1,
        explanation:
          '「it only opened two months ago, which may explain some of the growing pains」とあり、開店してまだ2ヶ月であることがサービスの問題の原因かもしれないと示唆しています。',
      },
      {
        id: 'rir-q3',
        question: 'How much did each person pay on average for the meal, before tip?',
        questionJa: 'チップを除いた一人当たりの平均支払額はいくらですか？',
        options: [
          'About $50',
          'About $70',
          'About $90',
          'About $120',
        ],
        correctIndex: 1,
        explanation:
          '「The total bill for four came to approximately $280 before tip」とあり、4人で$280なので、一人当たり約$70です。',
      },
      {
        id: 'rir-q4',
        question: 'Would the reviewer recommend this restaurant?',
        questionJa: 'レビュアーはこのレストランを勧めていますか？',
        options: [
          'No, the reviewer would not return',
          'Yes, but only for quick casual meals',
          'Yes, for special occasions if time is not a concern',
          'Only if the prices are reduced',
        ],
        correctIndex: 2,
        explanation:
          '「a wonderful spot for a special occasion if you\'re not in a rush」「I\'ll certainly return」とあり、急いでいなければ特別な機会に良い場所として推薦し、再訪するとも述べています。',
      },
    ],
  },

  // 11. Advanced - Report
  {
    id: 'reading-advanced-report',
    title: 'Q3 2025 Sales Performance Report',
    titleJa: '2025年第3四半期 営業実績レポート',
    type: 'Report',
    typeJa: 'レポート',
    level: 'advanced',
    passage: `CRESTFIELD TECHNOLOGIES — Q3 2025 Sales Performance Report
Prepared by: Finance & Strategy Division
Date: October 8, 2025

EXECUTIVE SUMMARY

Total revenue for Q3 2025 reached $14.2 million, representing a 12% increase over Q3 2024 ($12.7 million) and a 6% increase over Q2 2025 ($13.4 million). This marks the fifth consecutive quarter of year-over-year revenue growth.

REVENUE BREAKDOWN BY SEGMENT

Cloud Services: $6.8M (48% of total revenue)
- Up 22% from Q3 2024 ($5.6M), driven primarily by the launch of CloudSync Pro in July. New enterprise client acquisitions contributed $1.1M in this segment.

Hardware Solutions: $4.1M (29% of total revenue)
- Down 8% from Q3 2024 ($4.5M). The decline is attributed to delayed shipments from our primary supplier in Southeast Asia, resulting in approximately $600K in deferred orders that are expected to be fulfilled in Q4.

Professional Services: $3.3M (23% of total revenue)
- Up 10% from Q3 2024 ($3.0M). The growth reflects increased demand for system integration consulting, particularly among mid-market clients migrating to our cloud platform.

KEY METRICS
• Gross Margin: 62% (up from 58% in Q3 2024), driven by higher-margin cloud revenue
• Customer Retention Rate: 94% (unchanged from prior quarter)
• New Client Acquisitions: 47 (up from 31 in Q2 2025)
• Average Deal Size: $185,000 (up from $162,000 in Q3 2024)

REGIONAL HIGHLIGHTS
North America continues to account for 65% of revenue, while EMEA grew to 25% (from 21% in Q3 2024), reflecting the successful expansion of our London and Frankfurt offices. Asia-Pacific revenue remained flat at 10%.

OUTLOOK & RECOMMENDATIONS

1. Accelerate investment in Cloud Services, which now represents nearly half of total revenue and shows the strongest growth trajectory.
2. Address the hardware supply chain vulnerability by diversifying suppliers. Management is currently evaluating two additional manufacturers in Mexico and Eastern Europe.
3. Expand the Professional Services team by hiring 8–10 additional consultants in Q4 to meet growing integration demand.
4. Increase EMEA marketing budget by 15% to capitalize on the region's momentum.

The company is well-positioned to achieve its full-year revenue target of $55 million, provided Q4 hardware shipments are fulfilled on schedule.`,
    questions: [
      {
        id: 'rar-q1',
        question: 'Which business segment experienced a decline in Q3 2025?',
        questionJa: '2025年第3四半期に減少を経験した事業セグメントはどれですか？',
        options: [
          'Cloud Services',
          'Hardware Solutions',
          'Professional Services',
          'All segments grew',
        ],
        correctIndex: 1,
        explanation:
          'Hardware Solutionsは「Down 8% from Q3 2024 ($4.5M)」とあり、前年同期比で8%減少しました。Cloud ServicesとProfessional Servicesはどちらも成長しています。',
      },
      {
        id: 'rar-q2',
        question: 'What primarily caused the improvement in gross margin?',
        questionJa: '粗利益率の改善の主な原因は何ですか？',
        options: [
          'Cost reductions in manufacturing',
          'A shift toward higher-margin cloud revenue',
          'Increased hardware prices',
          'Fewer employee costs',
        ],
        correctIndex: 1,
        explanation:
          '「Gross Margin: 62% (up from 58% in Q3 2024), driven by higher-margin cloud revenue」とあり、利益率の高いクラウドサービスの収益増加が粗利益率改善の主因です。',
      },
      {
        id: 'rar-q3',
        question: 'What is the report\'s recommendation regarding the hardware supply issue?',
        questionJa: 'ハードウェア供給の問題に関してレポートはどのような提言をしていますか？',
        options: [
          'Increase prices to offset losses',
          'Exit the hardware business entirely',
          'Diversify suppliers by adding manufacturers in other regions',
          'Reduce hardware inventory levels',
        ],
        correctIndex: 2,
        explanation:
          '「Address the hardware supply chain vulnerability by diversifying suppliers. Management is currently evaluating two additional manufacturers in Mexico and Eastern Europe」とあり、メキシコと東欧の製造業者を加えてサプライヤーを多様化することを提言しています。',
      },
      {
        id: 'rar-q4',
        question: 'Based on the data, what can be inferred about Crestfield\'s strategic direction?',
        questionJa: 'データから推測できるCrestfield社の戦略的方向性は何ですか？',
        options: [
          'The company plans to reduce its international presence',
          'The company is shifting its focus from hardware to cloud-based services',
          'The company intends to acquire a competitor',
          'The company will stop offering professional services',
        ],
        correctIndex: 1,
        explanation:
          'Cloud Servicesが収益の48%を占め最も高い成長率を示し、提言でも「Accelerate investment in Cloud Services」と記載されていることから、ハードウェアからクラウドサービスへの戦略的シフトが推測できます。',
      },
    ],
  },

  // 12. Advanced - Double Passage (Job Posting + Cover Letter)
  {
    id: 'reading-advanced-double-job',
    title: 'Environmental Specialist Position & Application',
    titleJa: '環境スペシャリスト職の募集と応募',
    type: 'Double Passage',
    typeJa: '二重文書',
    level: 'advanced',
    passage: `--- Document 1: Job Posting ---

GREENLEAF ENVIRONMENTAL CONSULTING
Position: Senior Environmental Specialist
Location: Denver, CO
Department: Site Assessment & Remediation
Posted: March 1, 2025 | Application Deadline: March 31, 2025

About Greenleaf:
Greenleaf Environmental Consulting is a mid-sized environmental services firm with 15 years of experience serving clients in the mining, energy, and manufacturing sectors. We are headquartered in Denver with regional offices in Phoenix and Portland.

Position Summary:
We are seeking a Senior Environmental Specialist to lead site assessment projects, manage remediation plans, and ensure regulatory compliance for our clients. The ideal candidate will have strong fieldwork experience and the ability to manage multiple concurrent projects.

Requirements:
• Bachelor's degree in Environmental Science, Environmental Engineering, or a related field
• Minimum 5 years of experience in environmental site assessment or remediation
• Working knowledge of EPA regulations, including CERCLA and RCRA
• Experience with Phase I and Phase II Environmental Site Assessments (ESAs)
• Proficiency in GIS software (ArcGIS preferred)
• Valid driver's license and willingness to travel up to 30% of the time
• Strong report writing and client communication skills

Preferred Qualifications:
• Master's degree in a related field
• Professional certification (e.g., CHMM, PE, or PG)
• Experience managing teams of 3 or more
• Familiarity with state-level environmental regulations in Colorado, Arizona, or Oregon

Salary: $85,000–$105,000 depending on experience
Benefits: Health/dental/vision insurance, 401(k) with 5% match, annual professional development stipend of $2,500, 15 days PTO + 10 paid holidays

To apply, send your resume and cover letter to careers@greenleafenv.com.

--- Document 2: Cover Letter ---

Rachel Nguyen
4521 Maple Creek Drive
Boulder, CO 80301
rachel.nguyen@email.com

March 15, 2025

Hiring Manager
Greenleaf Environmental Consulting
700 17th Street, Suite 400
Denver, CO 80202

Dear Hiring Manager,

I am writing to apply for the Senior Environmental Specialist position posted on your website. With seven years of experience in environmental consulting and a strong background in site assessment, I am confident I would be a valuable addition to your Site Assessment & Remediation team.

I currently serve as an Environmental Specialist at Mountain West Environmental Services in Boulder, where I have managed over 40 Phase I and Phase II ESA projects for clients in the mining and energy sectors. In this role, I lead a team of four junior specialists and coordinate with regulatory agencies including the Colorado Department of Public Health and Environment (CDPHE). I am proficient in ArcGIS and have used it extensively for contamination mapping and spatial analysis.

I hold a Bachelor of Science in Environmental Engineering from Colorado State University and a Master of Science in Environmental Management from the University of Denver. I also maintain an active Certified Hazardous Materials Manager (CHMM) certification, which I obtained in 2021.

What particularly attracts me to Greenleaf is your work with clients in the manufacturing sector, which is an area I am eager to expand into. At Mountain West, my projects have focused primarily on mining and energy clients, and I believe the broader industry exposure at Greenleaf would enhance my professional growth while allowing me to contribute my existing expertise.

I am comfortable with the travel requirements described in the posting and am familiar with environmental regulations in both Colorado and Arizona, having supported several cross-border assessment projects in the Phoenix metropolitan area.

I would welcome the opportunity to discuss how my experience aligns with your team's needs. Thank you for your consideration.

Sincerely,
Rachel Nguyen`,
    questions: [
      {
        id: 'radj-q1',
        question: 'Which of the job\'s preferred qualifications does Rachel meet?',
        questionJa: 'Rachelは求人の優遇条件のうちどれを満たしていますか？',
        options: [
          'Only a Master\'s degree',
          'A Master\'s degree, a professional certification, team management experience, and familiarity with state regulations',
          'Only team management experience and a professional certification',
          'A Master\'s degree and GIS software proficiency only',
        ],
        correctIndex: 1,
        explanation:
          'Rachelは修士号（University of Denver）、CHMM認定資格、4名のチーム管理経験、コロラド州とアリゾナ州の規制知識を持っており、求人に記載された優遇条件をすべて満たしています。GISは必須条件に含まれ、優遇条件ではありません。',
      },
      {
        id: 'radj-q2',
        question: 'What is Rachel\'s primary motivation for applying to Greenleaf?',
        questionJa: 'RachelがGreenleafに応募する主な動機は何ですか？',
        options: [
          'A higher salary than her current position',
          'The opportunity to relocate to Denver',
          'The chance to expand into the manufacturing sector',
          'Greenleaf\'s international project portfolio',
        ],
        correctIndex: 2,
        explanation:
          '「What particularly attracts me to Greenleaf is your work with clients in the manufacturing sector, which is an area I am eager to expand into」とあり、製造業セクターへの拡大が主な動機です。',
      },
      {
        id: 'radj-q3',
        question: 'Based on both documents, how many years beyond the minimum requirement does Rachel\'s experience exceed?',
        questionJa: '両文書に基づくと、Rachelの経験は最低要件を何年上回っていますか？',
        options: [
          '1 year',
          '2 years',
          '3 years',
          '5 years',
        ],
        correctIndex: 1,
        explanation:
          '求人の必須条件は「Minimum 5 years」で、Rachelのカバーレターには「seven years of experience」とあるため、最低要件より2年多い経験を持っています。',
      },
      {
        id: 'radj-q4',
        question: 'Which client sector has Rachel NOT worked with, according to her cover letter?',
        questionJa: 'カバーレターによると、Rachelが経験していないクライアントセクターはどれですか？',
        options: [
          'Mining',
          'Energy',
          'Manufacturing',
          'Government',
        ],
        correctIndex: 2,
        explanation:
          'Rachelは「my projects have focused primarily on mining and energy clients」と述べており、製造業（manufacturing）はGreenleafで広げたい新分野として言及しています。政府機関（Government）は求人にもカバーレターにもクライアントセクターとして記載されていません。選択肢の中でカバーレターに明確に「未経験」と示されているのはmanufacturingです。',
      },
    ],
  },
];
