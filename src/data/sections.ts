import type { Category, Section } from "./types";
import { sectionsMeta } from "./sectionsMeta";
import { phraseCategories } from "./phrases";
import { grammarCategories } from "./grammar";
import { vocabularyCategories } from "./vocabulary";
import { idiomCategories } from "./idioms";
import { toeicCategories } from "./toeic";

const categoriesById: Record<string, Category[]> = {
  phrases: phraseCategories,
  vocabulary: vocabularyCategories,
  idioms: idiomCategories,
  grammar: grammarCategories,
  toeic: toeicCategories,
};

export const sections: Section[] = sectionsMeta.map((meta) => ({
  ...meta,
  categories: categoriesById[meta.id] ?? [],
}));
