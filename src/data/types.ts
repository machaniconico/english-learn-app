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
