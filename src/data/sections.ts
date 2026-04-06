import type { Section } from "./types";
import { phraseCategories } from "./phrases";
import { grammarCategories } from "./grammar";
import { vocabularyCategories } from "./vocabulary";
import { idiomCategories } from "./idioms";
import { toeicCategories } from "./toeic";

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
    categories: vocabularyCategories,
  },
  {
    id: "idioms",
    title: "Idioms & Collocations",
    titleJa: "慣用句・コロケーション",
    description: "Master natural English expressions and word combinations",
    icon: "💡",
    color: "amber",
    categories: idiomCategories,
  },
  {
    id: "grammar",
    title: "Grammar",
    titleJa: "文法",
    description: "Learn English grammar rules and patterns",
    icon: "📖",
    color: "amber",
    categories: grammarCategories,
  },
  {
    id: "toeic",
    title: "TOEIC Preparation",
    titleJa: "TOEIC対策",
    description: "Practice for the TOEIC test with targeted exercises",
    icon: "🎯",
    color: "rose",
    categories: toeicCategories,
  },
];
