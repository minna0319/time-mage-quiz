export interface Option {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  description?: string;
  score?: number; // Some questions affect score, some don't
}

export interface Question {
  id: number;
  title: string;
  subtitle?: string;
  options: Option[];
}

export interface QuizResult {
  minScore: number;
  maxScore: number;
  title: string;
  magicName: string; // e.g., Time Freeze
  description: string;
  imageKeyword: string; // For placeholder image
}

export type Answers = Record<number, string>; // QuestionID -> OptionID