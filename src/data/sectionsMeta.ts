export interface SectionMeta {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  icon: string;
  color: string;
  /**
   * Precomputed counts so navigation pages (e.g. Home) can show section sizes
   * without importing the heavy content. Kept in sync with the real data by
   * src/data/sectionsMeta.test.ts (a drift guard that fails if they diverge).
   */
  categoryCount: number;
  lessonCount: number;
  itemCount: number;
}

export const sectionsMeta: SectionMeta[] = [
  {
    id: "phrases",
    title: "Common Phrases",
    titleJa: "よく使うフレーズ",
    description: "Essential phrases for everyday situations",
    icon: "💬",
    color: "indigo",
    categoryCount: 12,
    lessonCount: 24,
    itemCount: 240,
  },
  {
    id: "vocabulary",
    title: "Vocabulary",
    titleJa: "単語",
    description: "Build your English vocabulary by topic",
    icon: "📝",
    color: "emerald",
    categoryCount: 11,
    lessonCount: 24,
    itemCount: 254,
  },
  {
    id: "idioms",
    title: "Idioms & Collocations",
    titleJa: "慣用句・コロケーション",
    description: "Master natural English expressions and word combinations",
    icon: "💡",
    color: "amber",
    categoryCount: 3,
    lessonCount: 6,
    itemCount: 62,
  },
  {
    id: "grammar",
    title: "Grammar",
    titleJa: "文法",
    description: "Learn English grammar rules and patterns",
    icon: "📖",
    color: "amber",
    categoryCount: 10,
    lessonCount: 28,
    itemCount: 246,
  },
  {
    id: "toeic",
    title: "TOEIC Preparation",
    titleJa: "TOEIC対策",
    description: "Practice for the TOEIC test with targeted exercises",
    icon: "🎯",
    color: "rose",
    categoryCount: 5,
    lessonCount: 12,
    itemCount: 122,
  },
];
