import type { Category } from "../types";
import { beginnerBasics } from "./beginner-basics";
import { beginnerBasicTenses } from "./beginner-basic-tenses";
import { beginnerQuestions } from "./beginner-questions";
import { beginnerEssentials } from "./beginner-essentials";
import { tenses } from "./tenses";
import { partsOfSpeech } from "./parts-of-speech";
import { sentencePatterns } from "./sentence-patterns";
import { toeicGrammar } from "./toeic-grammar";

export const grammarCategories: Category[] = [
  beginnerBasics,
  beginnerBasicTenses,
  beginnerQuestions,
  beginnerEssentials,
  tenses,
  partsOfSpeech,
  sentencePatterns,
  toeicGrammar,
];
