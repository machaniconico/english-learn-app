export interface PhraseItem {
  id: string;
  english: string;
  japanese: string;
  pronunciation: string;
  example?: string;
  exampleJa?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  items: PhraseItem[];
}

export interface Category {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface Section {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  icon: string;
  color: string;
  categories: Category[];
}

export type QuizQuestion = {
  audio: string;
  options: string[];
  correctIndex: number;
};

export interface DictionaryEntry {
  id: string;
  english: string;
  japanese: string;
  pronunciation: string;
  partOfSpeech: string;
  category: string;
  example: string;
  exampleJa: string;
  level: 'beginner' | 'intermediate';
}

export interface FillInBlankQuestion {
  id: string;
  sentence: string; // sentence with _____ blank
  options: [string, string, string, string]; // 4 choices
  correctIndex: number; // 0-3
  explanation: string; // why the answer is correct (in Japanese)
  category: 'vocabulary' | 'grammar' | 'preposition' | 'conjunction';
}

export interface FillInBlankSet {
  id: string;
  title: string;
  titleJa: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  questions: FillInBlankQuestion[];
}

export interface ReadingQuestion {
  id: string;
  question: string;
  questionJa: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string; // Japanese explanation
}

export interface ReadingPassage {
  id: string;
  title: string;
  titleJa: string;
  type: string; // e.g., "Email", "Advertisement", "Notice", "Article", "Letter"
  typeJa: string;
  passage: string; // the full text passage
  questions: ReadingQuestion[];
  level: 'beginner' | 'intermediate' | 'advanced';
}
