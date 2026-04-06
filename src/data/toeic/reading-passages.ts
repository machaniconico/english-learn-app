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

  // 13. Beginner - Invitation
  {
    id: 'reading-b3-invitation',
    title: 'Annual Company Celebration',
    titleJa: '会社の年次祝賀パーティー',
    type: 'Invitation',
    typeJa: '招待状',
    level: 'beginner',
    passage: `You're Invited!

WESTBRIDGE TECHNOLOGIES — Annual Employee Appreciation Party

Date: Friday, June 20, 2025
Time: 6:00 PM – 9:30 PM
Location: The Lakeside Pavilion, 800 Waterfront Drive, Austin, TX

Dear Westbridge Team,

Please join us for our Annual Employee Appreciation Party to celebrate another successful year! This year's theme is "Under the Stars," and the event will take place at the beautiful Lakeside Pavilion overlooking Town Lake.

Event Highlights:
• Welcome drinks and appetizers from 6:00 PM
• Dinner buffet featuring local Texas cuisine (vegetarian and vegan options available)
• Live music by The Silver Notes from 7:30 PM
• Annual awards ceremony recognizing outstanding employees at 8:00 PM
• Door prizes throughout the evening — every attendee receives a raffle ticket at check-in

Dress Code: Smart casual (no jeans or sneakers, please)

RSVP: Please confirm your attendance by June 6 using the link on the company intranet or by emailing events@westbridge.com. Indicate any dietary requirements when you RSVP.

Guests: Each employee may bring one guest. Please include your guest's name in your RSVP.

Parking: Complimentary valet parking will be available at the venue entrance.

We look forward to seeing you there!

Best regards,
The Events Committee
Westbridge Technologies`,
    questions: [
      {
        id: 'rb3inv-q1',
        question: 'What is the deadline for confirming attendance?',
        questionJa: '出席の確認期限はいつですか？',
        options: [
          'June 10',
          'June 6',
          'June 15',
          'June 20',
        ],
        correctIndex: 1,
        explanation:
          '「Please confirm your attendance by June 6」と記載されており、6月6日までにRSVPする必要があります。',
      },
      {
        id: 'rb3inv-q2',
        question: 'What will happen at 8:00 PM?',
        questionJa: '午後8時に何が行われますか？',
        options: [
          'The dinner buffet will begin',
          'Live music will start',
          'The awards ceremony will take place',
          'Door prizes will be distributed',
        ],
        correctIndex: 2,
        explanation:
          '「Annual awards ceremony recognizing outstanding employees at 8:00 PM」とあり、午後8時に優秀社員を表彰する授賞式が行われます。',
      },
      {
        id: 'rb3inv-q3',
        question: 'What must employees include when they RSVP?',
        questionJa: 'RSVPの際に従業員は何を含める必要がありますか？',
        options: [
          'Their employee ID number',
          'Their preferred parking spot',
          'Any dietary requirements',
          'Their department name',
        ],
        correctIndex: 2,
        explanation:
          '「Indicate any dietary requirements when you RSVP」とあり、食事制限がある場合はRSVP時に申告する必要があります。',
      },
    ],
  },

  // 14. Beginner - Instructions
  {
    id: 'reading-b4-instructions',
    title: 'Office Printer Setup Guide',
    titleJa: 'オフィスプリンターのセットアップガイド',
    type: 'Instructions',
    typeJa: '操作説明書',
    level: 'beginner',
    passage: `QUICK START GUIDE — ProPrint X500 Multifunction Printer/Copier

Thank you for choosing the ProPrint X500. Follow these steps to begin using your new printer.

STEP 1: Unpack and Position
Remove all packing materials, including the orange tape inside the paper tray. Place the printer on a flat, stable surface near a power outlet. Allow at least 10 cm of space on all sides for ventilation.

STEP 2: Load Paper
Pull out the main paper tray (Tray 1) at the bottom of the printer. Fan a stack of A4 paper to prevent jams, then load it into the tray with the print side facing up. Adjust the paper guides to fit the paper size. Tray 1 holds up to 250 sheets.

STEP 3: Install Toner Cartridges
Open the front panel by pressing the green release button. Remove each toner cartridge from its packaging and shake it gently 5–6 times. Insert the cartridges in the correct order from left to right: Cyan (C), Magenta (M), Yellow (Y), Black (K). Close the front panel until it clicks.

STEP 4: Connect to Network
For wireless setup: On the touchscreen, go to Settings > Network > Wi-Fi Setup and select your office network. Enter the network password.
For wired setup: Connect an Ethernet cable from the printer to your office network port.

STEP 5: Install Drivers
Visit www.proprint.com/x500/drivers to download the latest drivers for Windows or Mac. Run the installer and follow the on-screen instructions. You will need the printer's IP address, which is displayed on the touchscreen under Settings > Network > IP Address.

TROUBLESHOOTING:
• Paper jam: Open the rear access door and gently pull out the jammed paper. Do NOT use sharp objects.
• No Wi-Fi connection: Restart the printer and your router. Ensure the printer is within 15 meters of the router.
• Print quality issues: Run a cleaning cycle from Settings > Maintenance > Head Cleaning.

For further assistance, call the ProPrint support line at 1-800-555-0199 (Mon–Fri, 8 AM – 6 PM EST) or visit www.proprint.com/support.`,
    questions: [
      {
        id: 'rb4ins-q1',
        question: 'What is the correct order for installing toner cartridges?',
        questionJa: 'トナーカートリッジの正しい取り付け順序は何ですか？',
        options: [
          'Black, Cyan, Magenta, Yellow',
          'Cyan, Magenta, Yellow, Black',
          'Yellow, Magenta, Cyan, Black',
          'Black, Yellow, Magenta, Cyan',
        ],
        correctIndex: 1,
        explanation:
          '「Insert the cartridges in the correct order from left to right: Cyan (C), Magenta (M), Yellow (Y), Black (K)」とあり、左からシアン、マゼンタ、イエロー、ブラックの順です。',
      },
      {
        id: 'rb4ins-q2',
        question: 'How many sheets of paper can Tray 1 hold?',
        questionJa: 'トレイ1には何枚の用紙が入りますか？',
        options: [
          '100 sheets',
          '150 sheets',
          '200 sheets',
          '250 sheets',
        ],
        correctIndex: 3,
        explanation:
          '「Tray 1 holds up to 250 sheets」と記載されており、最大250枚です。',
      },
      {
        id: 'rb4ins-q3',
        question: 'What should you do if the printer has a paper jam?',
        questionJa: '紙詰まりが起きた場合、何をすべきですか？',
        options: [
          'Use scissors to cut the jammed paper',
          'Open the front panel and remove the paper',
          'Open the rear access door and gently pull out the paper',
          'Turn off the printer and wait 30 minutes',
        ],
        correctIndex: 2,
        explanation:
          '「Paper jam: Open the rear access door and gently pull out the jammed paper. Do NOT use sharp objects.」とあり、背面アクセスドアを開けて優しく紙を取り出します。',
      },
    ],
  },

  // 15. Beginner - Menu
  {
    id: 'reading-b5-menu',
    title: 'Riverside Cafe Lunch Menu',
    titleJa: 'リバーサイドカフェのランチメニュー',
    type: 'Menu',
    typeJa: 'メニュー',
    level: 'beginner',
    passage: `RIVERSIDE CAFE — Lunch Menu
Serving 11:00 AM – 3:00 PM, Monday through Saturday

═══════════════════════════════════════
TODAY'S SPECIALS (Available until sold out)
═══════════════════════════════════════
★ Grilled Salmon Bowl — Wild salmon with brown rice, avocado, edamame, and miso dressing .... $16.95
★ French Onion Soup & Half Sandwich Combo — Classic French onion soup with your choice of half sandwich .... $12.50

═══════════════════════════════════════
SANDWICHES (Served with choice of fries, side salad, or fruit cup)
═══════════════════════════════════════
Turkey Club — Roasted turkey, bacon, lettuce, tomato, mayo on toasted sourdough .... $13.50
Caprese Panini — Fresh mozzarella, tomato, basil, balsamic glaze on ciabatta (V) .... $11.75
BBQ Pulled Pork — Slow-smoked pork with coleslaw on brioche bun .... $14.25
Veggie Wrap — Hummus, grilled vegetables, spinach, feta in whole wheat wrap (V) .... $10.95

═══════════════════════════════════════
SALADS
═══════════════════════════════════════
Caesar Salad — Romaine, parmesan, croutons, house-made Caesar dressing .... $10.50
  Add grilled chicken +$3.50 | Add shrimp +$5.00
Asian Sesame Salad — Mixed greens, mandarin oranges, crispy wontons, sesame ginger dressing .... $11.25
Cobb Salad — Mixed greens, chicken, bacon, egg, avocado, blue cheese, ranch .... $14.50

═══════════════════════════════════════
BEVERAGES
═══════════════════════════════════════
Soft Drinks / Iced Tea / Lemonade .... $3.25
Fresh-Squeezed Orange Juice .... $5.50
Coffee (Regular / Decaf) .... $2.75
Specialty Lattes (Vanilla, Caramel, Hazelnut) .... $5.25

(V) = Vegetarian
All prices exclude tax. 18% gratuity added for parties of 6 or more.
Please inform your server of any food allergies.`,
    questions: [
      {
        id: 'rb5menu-q1',
        question: 'How much would a Caesar Salad with grilled chicken cost?',
        questionJa: 'グリルチキン付きのシーザーサラダはいくらですか？',
        options: [
          '$10.50',
          '$13.50',
          '$14.00',
          '$15.50',
        ],
        correctIndex: 2,
        explanation:
          'Caesar Saladが$10.50で、グリルチキンの追加が+$3.50なので、合計$14.00です。',
      },
      {
        id: 'rb5menu-q2',
        question: 'Which of the following is a vegetarian option?',
        questionJa: 'ベジタリアンオプションはどれですか？',
        options: [
          'Turkey Club',
          'BBQ Pulled Pork',
          'Cobb Salad',
          'Caprese Panini',
        ],
        correctIndex: 3,
        explanation:
          'Caprese Paniniには「(V)」マークが付いており、ベジタリアンオプションです。Veggie Wrapにも(V)マークがあります。Turkey Club、BBQ Pulled Pork、Cobb Saladには肉が含まれています。',
      },
      {
        id: 'rb5menu-q3',
        question: 'When is an automatic gratuity applied?',
        questionJa: '自動チップが加算されるのはどのような場合ですか？',
        options: [
          'For all lunch orders',
          'For orders over $50',
          'For parties of 6 or more',
          'For takeout orders only',
        ],
        correctIndex: 2,
        explanation:
          '「18% gratuity added for parties of 6 or more」とあり、6人以上のグループには自動的に18%のチップが加算されます。',
      },
    ],
  },

  // 16. Beginner - Flyer
  {
    id: 'reading-b6-flyer',
    title: 'Community Clean-Up Day',
    titleJa: '地域清掃ボランティアの募集',
    type: 'Flyer',
    typeJa: 'チラシ',
    level: 'beginner',
    passage: `🌿 SPRING COMMUNITY CLEAN-UP DAY 🌿

Make a Difference in Your Neighborhood!

JOIN US on Saturday, April 19, 2025
Time: 9:00 AM – 1:00 PM
Meeting Point: Maplewood Community Center Parking Lot
                 450 Oak Street, Maplewood, NJ

WHO CAN PARTICIPATE?
Everyone is welcome! Families, students, local businesses, and community groups are all encouraged to join. Children under 12 must be accompanied by a parent or guardian.

WHAT WE'LL BE DOING:
• Picking up litter along Main Street and surrounding parks
• Planting flowers and shrubs in Riverside Park
• Painting benches and playground equipment at Lincoln Elementary School
• Cleaning the walking trail around Silver Lake

WHAT TO BRING:
✓ Comfortable clothes that can get dirty
✓ Closed-toe shoes (no sandals)
✓ A reusable water bottle
✓ Sunscreen and a hat

WHAT WE'LL PROVIDE:
✓ Gloves, trash bags, and all cleaning supplies
✓ Free T-shirts for the first 100 volunteers to register
✓ Lunch provided at 12:30 PM (pizza, sandwiches, and drinks)
✓ Community service hours certificates for students

HOW TO REGISTER:
Visit www.maplewoodcleanup.org or call (973) 555-0234
Registration closes April 15. Walk-ins are welcome on the day, but registered volunteers receive priority for T-shirts and supplies.

SPONSORED BY:
Maplewood Parks & Recreation Department
Green Future Environmental Club
Maplewood Small Business Association

Questions? Email volunteer@maplewoodcleanup.org

Together, we can make Maplewood shine! ✨`,
    questions: [
      {
        id: 'rb6fly-q1',
        question: 'What will registered volunteers receive that walk-ins might not?',
        questionJa: '事前登録したボランティアがもらえて、当日参加者はもらえない可能性があるものは何ですか？',
        options: [
          'Lunch',
          'Gloves and trash bags',
          'Priority for T-shirts and supplies',
          'Community service certificates',
        ],
        correctIndex: 2,
        explanation:
          '「registered volunteers receive priority for T-shirts and supplies」とあり、事前登録者はTシャツと備品の優先配布を受けられます。',
      },
      {
        id: 'rb6fly-q2',
        question: 'Which activity is NOT listed as part of the clean-up day?',
        questionJa: '清掃日の活動として記載されていないものはどれですか？',
        options: [
          'Picking up litter',
          'Planting flowers',
          'Washing windows at the community center',
          'Painting playground equipment',
        ],
        correctIndex: 2,
        explanation:
          '活動内容にはゴミ拾い、花植え、ベンチと遊具のペンキ塗り、散歩道の清掃が記載されていますが、コミュニティセンターの窓拭きは含まれていません。',
      },
      {
        id: 'rb6fly-q3',
        question: 'What rule applies to children under 12?',
        questionJa: '12歳未満の子どもに適用されるルールは何ですか？',
        options: [
          'They cannot participate',
          'They must register online',
          'They must be accompanied by a parent or guardian',
          'They must bring their own supplies',
        ],
        correctIndex: 2,
        explanation:
          '「Children under 12 must be accompanied by a parent or guardian」とあり、12歳未満は保護者の同伴が必要です。',
      },
    ],
  },

  // 17. Intermediate - Newsletter
  {
    id: 'reading-i3-newsletter',
    title: 'Apex Corp Monthly Newsletter',
    titleJa: 'エイペックス社 月刊ニュースレター',
    type: 'Newsletter',
    typeJa: '社内ニュースレター',
    level: 'intermediate',
    passage: `APEX CORP — EMPLOYEE NEWSLETTER
Volume 12, Issue 4 | April 2025

━━━━━━━━━━━━━━━━━━━━━━
📋 NEW POLICIES & UPDATES
━━━━━━━━━━━━━━━━━━━━━━

FLEXIBLE WORK HOURS POLICY (Effective May 1)
Starting May 1, Apex Corp will implement a new flexible work hours policy. Employees may choose to start their workday anytime between 7:00 AM and 10:00 AM, provided they complete a full 8-hour day. Core hours — the time when all employees must be available — will be 10:00 AM to 3:00 PM. This policy applies to all salaried employees. Hourly employees should consult with their supervisors regarding eligible schedules.

Please note that client-facing roles (Sales, Customer Support) will continue to follow fixed schedules to ensure coverage during business hours. If you are uncertain whether your role qualifies, check with your department head.

UPDATED PARENTAL LEAVE
The Board of Directors has approved an expansion of our parental leave policy. Effective immediately, primary caregivers will receive 16 weeks of fully paid leave (previously 12 weeks), and secondary caregivers will receive 6 weeks (previously 4 weeks). This benefit applies to both birth and adoption.

━━━━━━━━━━━━━━━━━━━━━━
🏆 EMPLOYEE SPOTLIGHT
━━━━━━━━━━━━━━━━━━━━━━

Congratulations to Maria Santos from the Engineering Department, who has been named Employee of the Quarter! Maria led the migration of our legacy billing system to the new cloud platform, completing the project two weeks ahead of schedule and 15% under budget. "Maria's leadership and technical expertise were critical to the success of this project," said CTO James Park.

━━━━━━━━━━━━━━━━━━━━━━
📅 UPCOMING EVENTS
━━━━━━━━━━━━━━━━━━━━━━

• April 18: Earth Day Office Challenge — Reduce, reuse, and recycle! Prizes for the department with the lowest waste output.
• April 25: Quarterly Town Hall (2:00 PM, Main Auditorium & livestream)
• May 2: Annual Health & Wellness Fair — Free screenings, fitness demos, and healthy cooking workshops.

━━━━━━━━━━━━━━━━━━━━━━
💡 DID YOU KNOW?
━━━━━━━━━━━━━━━━━━━━━━
Apex Corp's employee referral program pays a $3,000 bonus for each successful hire you refer. The new hire must complete 90 days of employment for the bonus to be paid. Visit the HR portal for details and to submit your referrals.`,
    questions: [
      {
        id: 'ri3news-q1',
        question: 'Who is excluded from the new flexible work hours policy?',
        questionJa: '新しいフレックスタイム制度から除外されるのは誰ですか？',
        options: [
          'Engineering Department employees',
          'Part-time employees only',
          'Client-facing roles such as Sales and Customer Support',
          'Employees who have been with the company less than one year',
        ],
        correctIndex: 2,
        explanation:
          '「client-facing roles (Sales, Customer Support) will continue to follow fixed schedules」とあり、営業やカスタマーサポートなどの顧客対応部門は引き続き固定スケジュールで勤務します。',
      },
      {
        id: 'ri3news-q2',
        question: 'By how many weeks did the parental leave increase for primary caregivers?',
        questionJa: '主介護者の育児休暇は何週間増えましたか？',
        options: [
          '2 weeks',
          '4 weeks',
          '6 weeks',
          '8 weeks',
        ],
        correctIndex: 1,
        explanation:
          '主介護者の育児休暇は12週間から16週間に増加し、4週間の増加です。',
      },
      {
        id: 'ri3news-q3',
        question: 'What achievement earned Maria Santos the Employee of the Quarter award?',
        questionJa: 'Maria Santosが四半期優秀社員賞を受賞した功績は何ですか？',
        options: [
          'She closed the largest sales deal in company history',
          'She completed a system migration ahead of schedule and under budget',
          'She designed a new product that increased revenue',
          'She organized the most successful company event',
        ],
        correctIndex: 1,
        explanation:
          '「Maria led the migration of our legacy billing system to the new cloud platform, completing the project two weeks ahead of schedule and 15% under budget」とあり、請求システムの移行を予定より早く予算以下で完了させました。',
      },
      {
        id: 'ri3news-q4',
        question: 'What condition must be met for the referral bonus to be paid?',
        questionJa: '紹介ボーナスが支払われる条件は何ですか？',
        options: [
          'The referral must be from the same department',
          'The new hire must complete 90 days of employment',
          'The referring employee must have worked at Apex for at least one year',
          'The new hire must be a senior-level employee',
        ],
        correctIndex: 1,
        explanation:
          '「The new hire must complete 90 days of employment for the bonus to be paid」とあり、紹介された人が90日間勤務を完了する必要があります。',
      },
    ],
  },

  // 18. Intermediate - Report excerpt (Customer satisfaction survey)
  {
    id: 'reading-i4-survey-report',
    title: 'Customer Satisfaction Survey Results',
    titleJa: '顧客満足度調査結果サマリー',
    type: 'Report',
    typeJa: '調査レポート',
    level: 'intermediate',
    passage: `PINNACLE SERVICES GROUP — Customer Satisfaction Survey Results
Period: January – March 2025 (Q1)
Responses: 1,247 customers (response rate: 34%, up from 28% in Q4 2024)

OVERALL SATISFACTION SCORE: 4.1 / 5.0
(Q4 2024: 3.8 / 5.0 | Q1 2024: 3.6 / 5.0)

SATISFACTION BY CATEGORY (Average Score out of 5.0):

Product Quality:        4.4  (↑ from 4.1 in Q4 2024)
Customer Support:       3.5  (↓ from 3.7 in Q4 2024)
Delivery Speed:         4.3  (↑ from 3.6 in Q4 2024)
Website Usability:      4.0  (↑ from 3.8 in Q4 2024)
Value for Money:        4.1  (unchanged from Q4 2024)

TOP POSITIVE FEEDBACK THEMES:
• 68% of respondents praised the improved delivery times since the new fulfillment center opened in November 2024
• Product packaging redesign received highly favorable comments, with 72% rating it "excellent"
• The new mobile app (launched February 2025) was rated 4.2/5.0 by users who have downloaded it

AREAS OF CONCERN:
• Customer Support response times averaged 48 minutes, exceeding our target of 30 minutes. Respondents cited long wait times as their primary frustration.
• 23% of respondents reported difficulty reaching a live agent, preferring phone support over the chatbot
• Three product categories (home appliances, outdoor equipment, and electronics) had return rates above 8%, compared to the company-wide average of 5%

RECOMMENDED ACTIONS:
1. Hire 12 additional customer support representatives by Q2 to reduce response times to the 30-minute target
2. Implement a callback feature so customers do not have to wait on hold
3. Conduct quality reviews for the three high-return product categories
4. Continue marketing the mobile app — only 40% of customers are currently using it

Prepared by: Research & Analytics Team
Approved by: VP of Customer Experience`,
    questions: [
      {
        id: 'ri4sur-q1',
        question: 'Which category showed a decrease in satisfaction from Q4 2024?',
        questionJa: '2024年第4四半期と比較して満足度が低下したカテゴリはどれですか？',
        options: [
          'Product Quality',
          'Customer Support',
          'Delivery Speed',
          'Website Usability',
        ],
        correctIndex: 1,
        explanation:
          'Customer Supportは3.7から3.5に低下しており、唯一スコアが下がったカテゴリです。他のカテゴリはすべて横ばいか向上しています。',
      },
      {
        id: 'ri4sur-q2',
        question: 'What likely caused the improvement in delivery speed ratings?',
        questionJa: '配送速度の評価が改善した原因として最も考えられるものは何ですか？',
        options: [
          'A new mobile app was launched',
          'Product packaging was redesigned',
          'A new fulfillment center opened in November 2024',
          'Additional delivery drivers were hired',
        ],
        correctIndex: 2,
        explanation:
          '「68% of respondents praised the improved delivery times since the new fulfillment center opened in November 2024」とあり、2024年11月に開設された新しいフルフィルメントセンターが配送速度改善の要因です。',
      },
      {
        id: 'ri4sur-q3',
        question: 'What is the main issue with customer support according to the survey?',
        questionJa: '調査によると、カスタマーサポートの主な問題は何ですか？',
        options: [
          'Support staff are not knowledgeable enough',
          'The chatbot provides incorrect information',
          'Response times are too long, exceeding the 30-minute target',
          'Support is only available during limited hours',
        ],
        correctIndex: 2,
        explanation:
          '「Customer Support response times averaged 48 minutes, exceeding our target of 30 minutes. Respondents cited long wait times as their primary frustration.」とあり、応答時間が目標の30分を超えて平均48分かかっていることが主な問題です。',
      },
      {
        id: 'ri4sur-q4',
        question: 'What percentage of customers are NOT yet using the mobile app?',
        questionJa: 'まだモバイルアプリを利用していない顧客の割合は何%ですか？',
        options: [
          '23%',
          '34%',
          '40%',
          '60%',
        ],
        correctIndex: 3,
        explanation:
          '「only 40% of customers are currently using it」とあるので、利用していない顧客は100% - 40% = 60%です。',
      },
    ],
  },

  // 19. Intermediate - Travel itinerary
  {
    id: 'reading-i5-itinerary',
    title: 'Business Trip Itinerary — Tokyo',
    titleJa: '東京出張スケジュール',
    type: 'Itinerary',
    typeJa: '旅程表',
    level: 'intermediate',
    passage: `BUSINESS TRAVEL ITINERARY
Traveler: Michael Chen, Director of Business Development
Trip: Client Meetings — Tokyo, Japan
Dates: May 5–9, 2025

Prepared by: Apex Corp Travel Desk | Booking Reference: AX-2025-0489

════════════════════════════════════
MONDAY, MAY 5 — TRAVEL DAY
════════════════════════════════════
08:15  Depart San Francisco (SFO) — United Airlines UA 837, Seat 3A (Business Class)
       → Arrives Tokyo Narita (NRT) at 12:30 local time, Tuesday May 6
       Note: 11-hour flight. Meal service included.

════════════════════════════════════
TUESDAY, MAY 6 — ARRIVAL & EVENING MEETING
════════════════════════════════════
12:30  Arrive Narita Airport (NRT)
13:30  Narita Express to Tokyo Station (reserved seat, Car 4, Seat 12D)
15:00  Check in — Hotel Metropolitan Tokyo Marunouchi (Confirmation #HM-88421)
       Address: 1-3-1 Marunouchi, Chiyoda-ku, Tokyo
       Room type: Executive Single, non-smoking
16:00  Free time — rest / adjust to time zone
18:30  Welcome dinner with Tanaka-san (Yamamoto Industries) at Sushi Saito
       Address: 1F ARK Hills South Tower, Minato-ku
       Note: Restaurant is reservation-only. Dress code: business casual.

════════════════════════════════════
WEDNESDAY, MAY 7 — CLIENT MEETINGS
════════════════════════════════════
08:00  Breakfast meeting with Kenji Ito (VP, Yamamoto Industries) — Hotel restaurant
09:30  Meeting at Yamamoto Industries headquarters
       Agenda: Q2 product roadmap review, pricing discussion
       Address: 2-4-1 Hamamatsucho, Minato-ku (15 min taxi from hotel)
12:00  Lunch hosted by Yamamoto Industries
14:00  Meeting with Suzuki Electronics — their Shinagawa office
       Agenda: Partnership proposal presentation
       Address: 3-8-2 Konan, Minato-ku
16:30  Return to hotel
19:00  Dinner with Apex Corp Japan team — Izakaya Gonpachi, Roppongi

════════════════════════════════════
THURSDAY, MAY 8 — MEETINGS & DEPARTURE PREP
════════════════════════════════════
09:00  Follow-up meeting at Yamamoto Industries (contract terms review)
11:30  Meeting with Fujita Logistics — Shinjuku office
       Agenda: Supply chain optimization discussion
       Address: 1-12-7 Nishi-Shinjuku
13:00  Working lunch at hotel — prepare trip report
15:00  Free time — optional sightseeing
19:00  Farewell dinner with Tanaka-san — TBD (Tanaka-san to confirm location)

════════════════════════════════════
FRIDAY, MAY 9 — DEPARTURE
════════════════════════════════════
07:00  Check out — Hotel Metropolitan Tokyo Marunouchi
07:30  Taxi to Tokyo Station
08:00  Narita Express to Narita Airport
10:30  Depart Tokyo Narita (NRT) — United Airlines UA 838, Seat 3C (Business Class)
       → Arrives San Francisco (SFO) at 06:45 same day (Friday, May 9)

EXPENSE NOTES:
• Hotel, flights, and airport transfers are pre-paid by Apex Corp
• Daily meal per diem: $100 USD (receipts required for expenses over $25)
• Local transportation: Use Suica card (provided at hotel check-in)
• Client entertainment expenses require pre-approval from VP Finance`,
    questions: [
      {
        id: 'ri5itn-q1',
        question: 'How many different companies is Michael scheduled to meet during the trip?',
        questionJa: 'Michaelが出張中に会う予定の異なる会社は何社ですか？',
        options: [
          '2',
          '3',
          '4',
          '5',
        ],
        correctIndex: 1,
        explanation:
          'Yamamoto Industries、Suzuki Electronics、Fujita Logisticsの3社との会議が予定されています。Apex Corp Japan teamは自社チームなので外部クライアントには含まれません。',
      },
      {
        id: 'ri5itn-q2',
        question: 'What is Michael expected to do on Thursday afternoon?',
        questionJa: '木曜日の午後にMichaelは何をする予定ですか？',
        options: [
          'Attend another client meeting',
          'Fly back to San Francisco',
          'Prepare a trip report and have optional free time',
          'Visit the Apex Corp Japan office',
        ],
        correctIndex: 2,
        explanation:
          '木曜午後は「13:00 Working lunch at hotel — prepare trip report」と「15:00 Free time — optional sightseeing」が予定されており、出張レポート作成と自由時間です。',
      },
      {
        id: 'ri5itn-q3',
        question: 'Which expense requires pre-approval according to the itinerary?',
        questionJa: '旅程によると、事前承認が必要な経費はどれですか？',
        options: [
          'Local taxi fares',
          'Meals under $25',
          'Hotel room charges',
          'Client entertainment expenses',
        ],
        correctIndex: 3,
        explanation:
          '「Client entertainment expenses require pre-approval from VP Finance」とあり、クライアント接待費にはVP Financeの事前承認が必要です。',
      },
      {
        id: 'ri5itn-q4',
        question: 'Why does Michael arrive in San Francisco on the same day he departs Tokyo?',
        questionJa: 'MichaelはなぜTokyo出発日と同じ日にSan Franciscoに到着するのですか？',
        options: [
          'The flight is only 3 hours long',
          'He takes a connecting flight through Hawaii',
          'He crosses the International Date Line, gaining time',
          'The departure time listed is incorrect',
        ],
        correctIndex: 2,
        explanation:
          '東京を金曜10:30に出発し、サンフランシスコに金曜06:45に到着するのは、国際日付変更線を超えることで日付が戻るためです。実際の飛行時間は約9-10時間です。',
      },
    ],
  },

  // 20. Intermediate - Contract excerpt
  {
    id: 'reading-i6-contract',
    title: 'IT Support Service Agreement',
    titleJa: 'ITサポートサービス契約書',
    type: 'Contract',
    typeJa: '契約書',
    level: 'intermediate',
    passage: `SERVICE LEVEL AGREEMENT (SLA)
Between: ClearPath IT Solutions ("Provider")
And: Meridian Retail Group ("Client")
Contract No.: CP-MRG-2025-0312
Effective Date: April 1, 2025
Term: 24 months (April 1, 2025 – March 31, 2027)

1. SCOPE OF SERVICES
The Provider shall deliver the following managed IT support services to the Client:
  a) 24/7 help desk support via phone, email, and online chat
  b) On-site technical support during business hours (Mon–Fri, 8 AM – 6 PM)
  c) Network monitoring and security management for all 12 retail locations
  d) Monthly system maintenance and software updates
  e) Quarterly IT security audits and vulnerability assessments
  f) Disaster recovery planning and annual testing

2. SERVICE LEVEL TARGETS
  • Critical Issues (system outage affecting operations): Response within 30 minutes; resolution within 4 hours
  • High Priority (major feature unavailable): Response within 1 hour; resolution within 8 hours
  • Medium Priority (partial service degradation): Response within 4 hours; resolution within 24 hours
  • Low Priority (non-urgent requests): Response within 8 hours; resolution within 72 hours

3. PENALTIES FOR NON-COMPLIANCE
If the Provider fails to meet the service level targets defined in Section 2 for more than 3 incidents in any calendar month, the Client shall be entitled to a service credit of 10% of that month's fee. If failures exceed 6 incidents in a calendar month, the credit shall increase to 20%. Consecutive months of non-compliance (3 or more) shall grant the Client the right to terminate without penalty.

4. FEES AND PAYMENT
  • Monthly service fee: $28,500
  • On-site emergency support outside business hours: $250/hour (minimum 2-hour charge)
  • Additional project work (e.g., new system installations): Quoted separately at $175/hour
  • Payment terms: Net 30 days from invoice date
  • Late payment penalty: 1.5% per month on outstanding balances

5. TERMINATION
Either party may terminate this agreement with 90 days' written notice. The Client may terminate immediately without penalty in the event of a material breach that remains uncured for 30 days after written notice. The Provider may terminate immediately if the Client's payment is more than 60 days overdue.

6. CONFIDENTIALITY
Both parties agree to maintain the confidentiality of all proprietary information, trade secrets, and customer data exchanged during the term of this agreement. This obligation shall survive termination for a period of 3 years.`,
    questions: [
      {
        id: 'ri6con-q1',
        question: 'What service credit does the Client receive if the Provider misses targets 5 times in one month?',
        questionJa: 'プロバイダーが1ヶ月に5回目標未達の場合、クライアントが受けるサービスクレジットは何%ですか？',
        options: [
          '5%',
          '10%',
          '15%',
          '20%',
        ],
        correctIndex: 1,
        explanation:
          '3回超過で10%、6回超過で20%です。5回は「more than 3 incidents」に該当しますが「exceed 6 incidents」には該当しないため、10%のクレジットが適用されます。',
      },
      {
        id: 'ri6con-q2',
        question: 'How quickly must a critical issue be resolved?',
        questionJa: 'クリティカルな問題はどのくらい早く解決される必要がありますか？',
        options: [
          'Within 30 minutes',
          'Within 1 hour',
          'Within 4 hours',
          'Within 8 hours',
        ],
        correctIndex: 2,
        explanation:
          'Critical Issues（業務に影響するシステム障害）は「Response within 30 minutes; resolution within 4 hours」とあり、30分以内に対応開始、4時間以内に解決が必要です。',
      },
      {
        id: 'ri6con-q3',
        question: 'Under what condition can the Client terminate the agreement immediately?',
        questionJa: 'クライアントが即時解約できる条件は何ですか？',
        options: [
          'If the monthly fee increases',
          'If a material breach is not corrected within 30 days of written notice',
          'If the Provider changes its staff',
          'If any single service target is missed',
        ],
        correctIndex: 1,
        explanation:
          '「The Client may terminate immediately without penalty in the event of a material breach that remains uncured for 30 days after written notice」とあり、書面通知後30日以内に重大な違反が是正されない場合に即時解約が可能です。',
      },
      {
        id: 'ri6con-q4',
        question: 'What is the minimum charge for an after-hours emergency on-site visit?',
        questionJa: '営業時間外の緊急オンサイト対応の最低料金はいくらですか？',
        options: [
          '$175',
          '$250',
          '$350',
          '$500',
        ],
        correctIndex: 3,
        explanation:
          '「$250/hour (minimum 2-hour charge)」とあり、時給$250で最低2時間分の請求なので、最低料金は$250 × 2 = $500です。',
      },
    ],
  },

  // 21. Advanced - Annual report excerpt
  {
    id: 'reading-a3-annual',
    title: 'Vertex Industries Annual Report',
    titleJa: 'バーテックス・インダストリーズ年次報告書',
    type: 'Annual Report',
    typeJa: '年次報告書',
    level: 'advanced',
    passage: `VERTEX INDUSTRIES, INC. — ANNUAL REPORT FY2024
LETTER TO SHAREHOLDERS

Dear Shareholders,

Fiscal Year 2024 was a transformative year for Vertex Industries, marked by strategic investments that position the company for sustainable long-term growth despite a challenging macroeconomic environment.

FINANCIAL PERFORMANCE

Total revenue for FY2024 reached $892 million, a 7.3% increase from $831 million in FY2023. However, net income declined to $67 million from $74 million in the prior year, representing a net margin of 7.5% compared to 8.9% in FY2023. This decline was anticipated and is primarily attributable to three factors:

1. R&D investment increased by 34% to $128 million as we accelerated development of our next-generation EcoTech product line, which is scheduled for commercial launch in Q2 FY2025.
2. Restructuring charges of $18 million related to the consolidation of our European manufacturing operations from three facilities to two. This restructuring is projected to yield annual cost savings of $12 million beginning in FY2025.
3. A one-time inventory write-down of $9 million for discontinued legacy product lines in the Industrial Solutions segment.

SEGMENT PERFORMANCE

Advanced Materials (52% of revenue, $464M): Revenue grew 11% year-over-year, driven by strong demand from the electric vehicle and renewable energy sectors. Operating margin improved to 18.2% from 16.5%, reflecting improved production efficiency at our expanded Phoenix facility.

Industrial Solutions (31% of revenue, $276M): Revenue declined 2% as certain legacy products approached end-of-life. However, the segment's new automation product suite, launched in March 2024, generated $38 million in its first year and is expected to offset legacy declines.

Specialty Chemicals (17% of revenue, $152M): Revenue grew 8%, bolstered by a multi-year supply contract with a major pharmaceutical manufacturer valued at $95 million over three years.

STRATEGIC OUTLOOK

Looking ahead, we project FY2025 revenue of $960–$990 million, with net margins recovering to the 9–10% range as restructuring benefits materialize and the EcoTech product line contributes to higher-margin sales. Capital expenditure for FY2025 is budgeted at $145 million, focused on expanding Advanced Materials capacity and completing the European facility consolidation.

We remain committed to returning value to shareholders. In FY2024, we paid $42 million in dividends ($1.40 per share) and repurchased $30 million of common stock. The Board has approved a 7% dividend increase to $1.50 per share for FY2025.

On behalf of the Board of Directors and the entire Vertex team, I thank you for your continued confidence in our company.

Sincerely,
Catherine Reeves
Chairman & Chief Executive Officer
Vertex Industries, Inc.`,
    questions: [
      {
        id: 'ra3ann-q1',
        question: 'What was the primary reason for the decline in net income despite revenue growth?',
        questionJa: '売上増加にもかかわらず純利益が減少した主な理由は何ですか？',
        options: [
          'A decrease in product prices',
          'Loss of major customers',
          'Increased R&D spending, restructuring charges, and an inventory write-down',
          'Higher tax rates imposed by the government',
        ],
        correctIndex: 2,
        explanation:
          '本文では純利益減少の3つの要因として、R&D投資の34%増加（$128M）、欧州工場統合の再構築費用（$18M）、在庫評価損（$9M）が挙げられています。',
      },
      {
        id: 'ra3ann-q2',
        question: 'Which business segment showed the strongest growth, and what drove it?',
        questionJa: '最も高い成長を示した事業セグメントとその要因は何ですか？',
        options: [
          'Industrial Solutions, driven by automation products',
          'Advanced Materials, driven by demand from EV and renewable energy sectors',
          'Specialty Chemicals, driven by a pharmaceutical contract',
          'All segments grew equally',
        ],
        correctIndex: 1,
        explanation:
          'Advanced Materialsが前年比11%成長で最も高く、「driven by strong demand from the electric vehicle and renewable energy sectors」が要因です。',
      },
      {
        id: 'ra3ann-q3',
        question: 'What is the expected net financial effect of the European restructuring?',
        questionJa: '欧州の再構築の正味の財務効果はどうなると予想されますか？',
        options: [
          'A net cost of $18 million per year',
          'A net cost of $6 million in the first year, then $12 million in annual savings',
          'Immediate annual savings of $12 million',
          'No significant financial impact',
        ],
        correctIndex: 1,
        explanation:
          '再構築費用は$18Mの一時コストで、FY2025から年間$12Mの削減が見込まれます。したがって初年度は$18M - $12M = $6Mの純コストとなり、2年目以降は年間$12Mの純節約となります。',
      },
      {
        id: 'ra3ann-q4',
        question: 'Based on the report, what can be inferred about Vertex\'s strategic priorities?',
        questionJa: 'レポートから推測できるVertex社の戦略的優先事項は何ですか？',
        options: [
          'The company is preparing for a merger or acquisition',
          'The company is shifting focus toward high-growth, high-margin segments like Advanced Materials and next-generation products',
          'The company plans to exit the Specialty Chemicals segment',
          'The company intends to reduce shareholder returns to fund operations',
        ],
        correctIndex: 1,
        explanation:
          'R&D投資の大幅増加、EcoTech新製品ラインの開発、Advanced Materials分野への設備投資拡大、レガシー製品の縮小など、高成長・高利益率セグメントへの戦略的シフトが明確に示されています。配当も増額されており、株主還元は縮小していません。',
      },
    ],
  },

  // 22. Advanced - Policy document (Remote work)
  {
    id: 'reading-a4-remote-policy',
    title: 'Telecommuting & Remote Work Policy',
    titleJa: 'テレワーク・リモートワークポリシー',
    type: 'Policy Document',
    typeJa: '社内規定',
    level: 'advanced',
    passage: `ORION DYNAMICS — CORPORATE POLICY
Policy No.: HR-2025-014
Title: Telecommuting and Remote Work Policy
Effective Date: May 1, 2025
Supersedes: Policy HR-2020-009 (dated March 2020)
Approved by: Chief Human Resources Officer, General Counsel

1. PURPOSE
This policy establishes the framework for telecommuting and remote work arrangements at Orion Dynamics. It aims to provide flexibility while maintaining productivity, collaboration, and data security standards.

2. ELIGIBILITY
2.1 Employees must have completed at least 6 months of continuous employment and received a performance rating of "Meets Expectations" or higher in their most recent review to be eligible for remote work.
2.2 Certain roles designated as "on-site essential" by department heads are excluded from remote work eligibility. A current list is maintained on the HR portal.
2.3 Remote work arrangements must be approved by both the employee's direct manager and the department head.

3. WORK ARRANGEMENT OPTIONS
3.1 Hybrid Schedule: Employees work remotely 2–3 days per week and in-office for the remaining days. In-office days must include at least one designated "team collaboration day" per week, as set by the department head.
3.2 Full Remote: Available only for roles explicitly approved for full remote by the VP of the relevant division. Employees in full remote roles must be available to travel to the office for quarterly in-person meetings at their own expense if located more than 100 miles from the nearest office.
3.3 Temporary Remote: Short-term remote work (up to 30 consecutive days) may be approved by the direct manager for personal circumstances such as family care or home repairs. Extensions beyond 30 days require HR approval.

4. WORKSPACE AND EQUIPMENT
4.1 Remote employees must maintain a dedicated workspace that is free from distractions and meets ergonomic standards outlined in Appendix A.
4.2 The company will provide a one-time home office stipend of $750 for employees approved for hybrid or full remote arrangements. This stipend is available once every 3 years.
4.3 Company-issued laptops and peripherals must be used for all work activities. Personal devices may not be used to access company systems unless enrolled in the Mobile Device Management (MDM) program.

5. DATA SECURITY
5.1 All remote work must be conducted over a secure VPN connection provided by the IT Department.
5.2 Employees may not work from public Wi-Fi networks (e.g., coffee shops, airports) unless using the company VPN with multi-factor authentication enabled.
5.3 Confidential documents must not be printed at home. If printing is essential, the employee must use an approved encrypted printer registered with IT.
5.4 Any suspected data breach must be reported to IT Security within 1 hour.

6. PERFORMANCE AND ACCOUNTABILITY
6.1 Remote employees are subject to the same performance metrics and review cycles as on-site employees.
6.2 Managers shall conduct bi-weekly check-ins with remote team members to discuss progress, challenges, and workload.
6.3 Failure to maintain expected performance levels may result in modification or revocation of the remote work arrangement with 14 days' notice.

7. INTERNATIONAL REMOTE WORK
Working from outside the United States requires advance approval from HR and Legal due to tax, visa, and employment law implications. Such requests must be submitted at least 45 days in advance and are limited to a maximum of 90 days per calendar year.`,
    questions: [
      {
        id: 'ra4pol-q1',
        question: 'What are the two requirements for an employee to be eligible for remote work?',
        questionJa: 'リモートワークの資格を得るための2つの要件は何ですか？',
        options: [
          'One year of employment and manager approval',
          'Six months of employment and a satisfactory performance rating',
          'Completion of a training program and IT security certification',
          'Manager approval and VP-level authorization',
        ],
        correctIndex: 1,
        explanation:
          '「completed at least 6 months of continuous employment and received a performance rating of "Meets Expectations" or higher」とあり、6ヶ月以上の継続勤務と「期待を満たす」以上の業績評価が条件です。',
      },
      {
        id: 'ra4pol-q2',
        question: 'Under what condition may employees work from a coffee shop?',
        questionJa: 'どのような条件下でカフェから仕事ができますか？',
        options: [
          'It is prohibited under all circumstances',
          'Only with the manager\'s written approval',
          'Only when using the company VPN with multi-factor authentication',
          'Only during non-business hours',
        ],
        correctIndex: 2,
        explanation:
          '「Employees may not work from public Wi-Fi networks (e.g., coffee shops, airports) unless using the company VPN with multi-factor authentication enabled」とあり、VPNと多要素認証を使用すれば公共Wi-Fiからの作業が許可されます。',
      },
      {
        id: 'ra4pol-q3',
        question: 'What happens if a full remote employee lives more than 100 miles from the office?',
        questionJa: 'フルリモート社員がオフィスから100マイル以上離れている場合はどうなりますか？',
        options: [
          'They are exempt from in-person meetings',
          'The company pays for their travel to quarterly meetings',
          'They must travel to quarterly meetings at their own expense',
          'They must relocate closer to the office within one year',
        ],
        correctIndex: 2,
        explanation:
          '「must be available to travel to the office for quarterly in-person meetings at their own expense if located more than 100 miles from the nearest office」とあり、100マイル以上離れている場合は自費で四半期ごとの対面会議に参加する必要があります。',
      },
      {
        id: 'ra4pol-q4',
        question: 'How far in advance must international remote work requests be submitted?',
        questionJa: '海外からのリモートワーク申請はどのくらい前に提出する必要がありますか？',
        options: [
          '14 days',
          '30 days',
          '45 days',
          '90 days',
        ],
        correctIndex: 2,
        explanation:
          '「Such requests must be submitted at least 45 days in advance and are limited to a maximum of 90 days per calendar year」とあり、最低45日前に申請が必要で、年間最大90日までの制限があります。',
      },
    ],
  },

  // 23. Advanced - Double passage (Press release + News article)
  {
    id: 'reading-a5-double-press',
    title: 'EcoVolt Battery Factory Announcement',
    titleJa: 'エコボルト社バッテリー工場の発表',
    type: 'Double Passage',
    typeJa: '二重文書',
    level: 'advanced',
    passage: `--- Document 1: Press Release ---

FOR IMMEDIATE RELEASE
March 18, 2025

EcoVolt Energy Announces $2.1 Billion Battery Manufacturing Plant in Tennessee

NASHVILLE, TN — EcoVolt Energy, Inc. (NASDAQ: EVLT), a leading manufacturer of lithium-ion batteries for electric vehicles and grid-scale energy storage, today announced plans to build a state-of-the-art battery manufacturing facility in Clarksville, Tennessee.

The 1.2 million-square-foot facility, scheduled to begin production in Q3 2027, will have an annual production capacity of 40 gigawatt-hours (GWh), making it one of the largest battery plants in North America. The investment of $2.1 billion will create approximately 3,200 permanent jobs over five years, with an average salary of $62,000 plus benefits.

"Tennessee offers an exceptional combination of a skilled workforce, competitive energy costs, and strategic location near our key automotive customers in the Southeast," said David Park, CEO of EcoVolt Energy. "This facility will triple our domestic manufacturing capacity and significantly reduce our dependence on imported battery cells."

The State of Tennessee has committed a $340 million incentive package, including $200 million in capital grants, a 15-year property tax abatement, and $40 million for workforce training through the Tennessee College of Applied Technology. Governor Sarah Mitchell stated, "This is the largest single investment in our state's history and solidifies Tennessee's role as a leader in the clean energy economy."

Construction is expected to begin in Q4 2025. EcoVolt has selected Turner-Bechtel Joint Venture as the general contractor. The company expects to begin hiring for the facility in early 2027.

Contact: Amanda Liu, VP of Communications, press@ecovolt.com

--- Document 2: News Analysis ---

EcoVolt's Tennessee Gamble: Bold Bet or Risky Overreach?
By James Thornton, Energy Sector Analyst | CleanTech Weekly | March 20, 2025

EcoVolt Energy's announcement of a $2.1 billion battery plant in Tennessee sent its stock up 8% on Tuesday, but analysts are divided on whether the aggressive expansion is well-timed.

On the bullish side, EcoVolt is positioning itself to capture surging demand from domestic automakers who are ramping up EV production. The company's existing 15 GWh facility in Nevada has been operating at 92% capacity since Q4 2024, and CEO David Park has previously stated that supply constraints have forced EcoVolt to turn away potential contracts worth an estimated $400 million.

The Tennessee incentive package of $340 million — approximately 16% of the total investment — is generous by industry standards. Comparable recent deals include Rivian's $1.5 billion incentive for a $5 billion plant in Georgia (30%) and Ford-SK Innovation's $884 million incentive for an $11.4 billion complex in Kentucky and Tennessee (7.7%). EcoVolt's deal falls in the middle.

However, several risk factors warrant attention. First, the global battery market is entering a period of potential oversupply. Chinese manufacturers BYD and CATL are rapidly expanding capacity and have begun exporting to the U.S. at competitive prices. Second, EcoVolt's net debt has risen to $1.8 billion as of Q4 2024, and the additional $2.1 billion investment — even with the incentive offset — could strain the balance sheet. Third, the 2027 production timeline introduces execution risk; the EV market may look very different two years from now.

EcoVolt management has partially addressed the financing concern, indicating that $800 million will come from a new term loan, $500 million from a planned equity offering, and the remainder from operating cash flow and government incentives.

"The question isn't whether America needs more battery capacity — it does," said Maria Chen, an analyst at GreenBridge Capital. "The question is whether EcoVolt can build it on time and on budget in an increasingly competitive landscape."`,
    questions: [
      {
        id: 'ra5dp-q1',
        question: 'According to the press release, what is EcoVolt\'s main strategic reason for choosing Tennessee?',
        questionJa: 'プレスリリースによると、EcoVoltがテネシー州を選んだ主な戦略的理由は何ですか？',
        options: [
          'Tennessee has the lowest corporate tax rate in the U.S.',
          'Skilled workforce, competitive energy costs, and proximity to automotive customers',
          'Tennessee offered the largest incentive package in history',
          'The company\'s CEO is originally from Tennessee',
        ],
        correctIndex: 1,
        explanation:
          'CEOの発言に「Tennessee offers an exceptional combination of a skilled workforce, competitive energy costs, and strategic location near our key automotive customers in the Southeast」とあります。',
      },
      {
        id: 'ra5dp-q2',
        question: 'How does the Tennessee incentive compare to similar deals mentioned in the analysis?',
        questionJa: '記事で言及されている類似の取引と比較して、テネシー州のインセンティブはどうですか？',
        options: [
          'It is the most generous as a percentage of total investment',
          'It is the least generous as a percentage of total investment',
          'It falls in the middle — more generous than Ford\'s deal but less than Rivian\'s',
          'It is identical to the Rivian deal',
        ],
        correctIndex: 2,
        explanation:
          'EcoVoltの16%は、Rivianの30%より低く、Ford-SK Innovationの7.7%より高いため、記事にも「EcoVolt\'s deal falls in the middle」と記載されています。',
      },
      {
        id: 'ra5dp-q3',
        question: 'What evidence from both documents supports the need for the new plant?',
        questionJa: '両文書から新工場の必要性を裏付ける証拠は何ですか？',
        options: [
          'EcoVolt\'s current facility is underperforming',
          'The Nevada plant is at 92% capacity and EcoVolt has turned away $400 million in contracts',
          'Tennessee state law requires a local manufacturing presence',
          'EcoVolt\'s competitors have all built plants in Tennessee',
        ],
        correctIndex: 1,
        explanation:
          '分析記事に「existing 15 GWh facility in Nevada has been operating at 92% capacity」「supply constraints have forced EcoVolt to turn away potential contracts worth an estimated $400 million」とあり、既存工場の容量限界と受注機会の逸失が新工場の必要性を裏付けています。',
      },
      {
        id: 'ra5dp-q4',
        question: 'What is the analyst\'s primary concern about EcoVolt\'s expansion plan?',
        questionJa: 'アナリストが拡張計画に対して持つ主な懸念は何ですか？',
        options: [
          'The Tennessee workforce lacks the necessary skills',
          'The company may face oversupply, financial strain, and execution timing risks',
          'The incentive package is too small to make the project viable',
          'EcoVolt lacks the technology to compete with Asian manufacturers',
        ],
        correctIndex: 1,
        explanation:
          '記事では3つのリスク要因として、中国メーカーとの供給過剰、$1.8Bの純負債と追加$2.1B投資によるバランスシートの圧迫、2027年の生産開始までの実行リスクが指摘されています。',
      },
    ],
  },

  // 24. Advanced - Triple passage (Email chain)
  {
    id: 'reading-a6-triple-email',
    title: 'Product Launch Coordination',
    titleJa: '新製品発売の調整メールチェーン',
    type: 'Triple Passage',
    typeJa: '三重文書',
    level: 'advanced',
    passage: `--- Email 1 ---

From: Priya Sharma <p.sharma@novalink.com>
To: Alex Turner <a.turner@novalink.com>; Jessica Huang <j.huang@novalink.com>
Date: Monday, March 10, 2025, 9:15 AM
Subject: SmartHub Pro Launch — Timeline Check

Hi Alex and Jessica,

I wanted to touch base on our SmartHub Pro launch, currently scheduled for April 21. After reviewing the status updates from Friday, I have some concerns about the timeline.

Engineering (Alex): The firmware update for Bluetooth 5.4 compatibility is listed as "in progress." Originally this was due March 7. Can you provide a realistic completion date? The QA team needs at least 3 weeks for full testing after firmware delivery.

Marketing (Jessica): The product landing page and press kit look great — thank you. However, I noticed the retail partner training materials haven't been started yet. Best Buy and Target need these at least 2 weeks before the launch date. Can you confirm when your team can deliver them?

I also want to flag that our CEO wants to include SmartHub Pro in his keynote at the TechForward conference on April 15. If the product is not in a demo-ready state by then, we'll need to notify his office immediately.

One more item: our supplier in Shenzhen has confirmed that the first production batch (10,000 units) will ship by March 28, with an estimated arrival at our distribution center by April 10. That gives us only 11 days before launch for warehousing and fulfillment setup.

Please reply with updated timelines by end of day Tuesday.

Thanks,
Priya Sharma
VP of Product Management

--- Email 2 ---

From: Alex Turner <a.turner@novalink.com>
To: Priya Sharma <p.sharma@novalink.com>; Jessica Huang <j.huang@novalink.com>
Date: Tuesday, March 11, 2025, 2:30 PM
Subject: Re: SmartHub Pro Launch — Timeline Check

Hi Priya,

Thanks for raising these points. Here's the engineering update:

The Bluetooth 5.4 firmware is approximately 80% complete. We encountered a compatibility issue with certain third-party IoT devices during internal testing, which required a protocol stack revision. My team's realistic estimate for delivery is March 21.

If we deliver firmware on March 21, QA would need until April 11 to complete the full 3-week testing cycle. That would leave only 10 days before the April 21 launch. If QA finds critical bugs, we'd have almost no buffer.

Here are the options as I see them:

Option A: Push the launch date to May 5. This gives us 2 full weeks of buffer after QA and aligns better with our production timeline as well.
Option B: Keep April 21 but reduce QA to a 2-week accelerated testing cycle. I can assign two additional QA engineers to compensate. Risk: potential edge-case bugs in the field.
Option C: Launch on April 21 with firmware v1.0 (without Bluetooth 5.4 support) and deliver the Bluetooth update via OTA patch within 30 days. Bluetooth 5.4 is a differentiator but not core functionality.

Regarding the CEO's keynote on April 15: I can have a functional demo unit ready by April 10, regardless of which option we choose. The demo would use a pre-release firmware build and wouldn't need to pass full QA.

Let me know your preference so I can plan resources accordingly.

Best,
Alex Turner
VP of Engineering

--- Email 3 ---

From: Jessica Huang <j.huang@novalink.com>
To: Priya Sharma <p.sharma@novalink.com>; Alex Turner <a.turner@novalink.com>
Date: Tuesday, March 11, 2025, 5:45 PM
Subject: Re: SmartHub Pro Launch — Timeline Check

Hi both,

Marketing update and my recommendation:

Retail training materials: My team can have them ready by March 28. If we launch April 21, that gives Best Buy and Target about 3.5 weeks — well within the 2-week minimum. If we delay to May 5, we'd have even more buffer, and I could add in-store demo video content that we've been discussing.

My strong recommendation is Option A (May 5 launch). Here's my reasoning from the marketing side:

1. Our biggest competitor, ConnectX, just announced their competing product for late April. If we launch April 21 with a reduced feature set (no Bluetooth 5.4) or known bugs, reviewers will directly compare us unfavorably. A polished May 5 launch with full features positions us as the premium alternative.

2. A May launch lets us capitalize on the buzz from the CEO's April 15 keynote — two weeks of pre-launch media coverage is actually ideal. An April 21 launch would only give us 6 days between keynote and launch, which isn't enough time for review units to reach media outlets.

3. The extra two weeks would let me finalize partnerships with three tech YouTubers (combined 8 million subscribers) who have tentatively agreed to review SmartHub Pro but need units by April 20.

One concern about Option A: our pre-order campaign is already live with an April 21 date. We'd need to update the landing page, notify 2,300 pre-order customers, and issue a brief press statement explaining the delay without signaling product issues. I can have all of this ready within 48 hours if we decide today.

Priya, I'd suggest we make a decision by Wednesday evening so we can communicate the timeline before the weekend.

Best,
Jessica Huang
VP of Marketing`,
    questions: [
      {
        id: 'ra6te-q1',
        question: 'Why was the firmware delivery delayed from the original March 7 deadline?',
        questionJa: 'ファームウェアの納品が当初の3月7日期限から遅れた理由は何ですか？',
        options: [
          'The engineering team was understaffed',
          'The supplier in Shenzhen caused production delays',
          'A compatibility issue with third-party IoT devices required a protocol revision',
          'The CEO requested additional features be added',
        ],
        correctIndex: 2,
        explanation:
          'Alexのメールに「We encountered a compatibility issue with certain third-party IoT devices during internal testing, which required a protocol stack revision」とあり、サードパーティIoTデバイスとの互換性問題がプロトコルスタックの修正を必要としたためです。',
      },
      {
        id: 'ra6te-q2',
        question: 'What advantage does Jessica identify in the timing gap between the keynote and a May 5 launch?',
        questionJa: 'ジェシカがキーノートとMay 5発売の間の時間的ギャップに見出す利点は何ですか？',
        options: [
          'It allows time to reduce the product price',
          'It provides two weeks of pre-launch media coverage, which is ideal',
          'It gives the engineering team time to add more features',
          'It allows customers to cancel pre-orders',
        ],
        correctIndex: 1,
        explanation:
          '「A May launch lets us capitalize on the buzz from the CEO\'s April 15 keynote — two weeks of pre-launch media coverage is actually ideal」とあり、キーノートから2週間のプリローンチ報道期間が理想的だとしています。',
      },
      {
        id: 'ra6te-q3',
        question: 'Based on all three emails, which option would most likely be chosen and why?',
        questionJa: '3つのメールに基づいて、最も選ばれそうなオプションとその理由は何ですか？',
        options: [
          'Option B, because keeping the original date is always preferred',
          'Option C, because Bluetooth 5.4 is not important',
          'Option A, because both Jessica and Alex\'s analysis point to reduced risk and competitive advantage with a May 5 launch',
          'None of the options, because the product should be cancelled',
        ],
        correctIndex: 2,
        explanation:
          'Alexは各オプションのリスクを提示しつつOption Aが最もバッファがあることを示し、Jessicaは競合対策、メディア戦略、YouTuber連携の観点からOption Aを「strong recommendation」として推しています。両者の分析がOption Aを支持しています。',
      },
      {
        id: 'ra6te-q4',
        question: 'What immediate action would be needed if Option A is selected?',
        questionJa: 'Option Aが選択された場合、すぐに必要なアクションは何ですか？',
        options: [
          'Cancel the TechForward keynote presentation',
          'Return all pre-ordered units to the supplier',
          'Update the landing page, notify 2,300 pre-order customers, and issue a press statement',
          'Hire additional engineering staff for the firmware team',
        ],
        correctIndex: 2,
        explanation:
          'Jessicaのメールに「we\'d need to update the landing page, notify 2,300 pre-order customers, and issue a brief press statement explaining the delay without signaling product issues」とあり、ウェブページ更新、予約顧客への通知、プレスステートメントの発行が即座に必要です。',
      },
    ],
  },
];
