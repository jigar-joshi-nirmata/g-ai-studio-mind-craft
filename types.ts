export enum QuestionType {
  MultipleChoice = 'mcq',
  ShortAnswer = 'sa',
  MultiSelect = 'msq',
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface Test {
  id: string;
  name: string;
  subject: string;
  duration: number; // in minutes
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
  mastery: number; // 0-1
  lastReviewed: string; // ISO date string
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}
