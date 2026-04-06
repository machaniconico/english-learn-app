import type { Section } from "./types";
import { phraseCategories } from "./phrases";

export const sections: Section[] = [
  {
    id: "phrases",
    title: "Common Phrases",
    titleJa: "よく使うフレーズ",
    description: "Essential phrases for everyday situations",
    icon: "💬",
    color: "indigo",
    categories: phraseCategories,
  },
  {
    id: "vocabulary",
    title: "Vocabulary",
    titleJa: "単語",
    description: "Build your English vocabulary by topic",
    icon: "📝",
    color: "emerald",
    categories: [],
  },
  {
    id: "grammar",
    title: "Grammar",
    titleJa: "文法",
    description: "Learn English grammar rules and patterns",
    icon: "📖",
    color: "amber",
    categories: [],
  },
  {
    id: "toeic",
    title: "TOEIC Preparation",
    titleJa: "TOEIC対策",
    description: "Practice for the TOEIC test with targeted exercises",
    icon: "🎯",
    color: "rose",
    categories: [],
  },
];
