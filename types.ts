
// Fix: Import 'FC' type from 'react' to resolve 'React' namespace error.
import type { FC } from 'react';

export enum QuestionType {
  MultipleChoice = 'mcq',
  ShortAnswer = 'sa',
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
  id:string;
  name: string;
  subject: string;
  duration: number; // in minutes
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
  mastery?: number;
  lastReviewed?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface TopicDetail {
  id: string; // Corresponds to Topic id
  title: string;
  summary: string;
  keyConcepts: string[];
  commonPitfalls: string[];
  example: {
    title: string;
    code: string;
    explanation: string;
  };
}

export interface TestResult {
  score: number; // Percentage
  aiSummary: string;
  strengths: string[];
  weaknesses: string[];
  correctAnswers: number;
  totalQuestions: number;
}

export interface ExamPreset {
    id: string;
    name: string;
    description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  // Fix: Use 'FC' type which was imported.
  icon: FC<{className?: string}>;
  achieved: boolean;
}

export interface TopicMastery {
    topic: string;
    mastery: number; // 0-1
}

// API Payload Types
export interface GenerateTestPayload {
  examType: 'custom' | string;
  difficulty: 'easy' | 'standard' | 'hard';
  examName?: string;
  numQuestions?: number;
  questionFormat?: 'objective' | 'subjective';
  presetDuration?: 'quick' | 'standard' | 'endurance';
  syllabusContent?: string;
}

export interface SubmitTestPayload {
  answers: Record<string, string | string[]>;
  durationSeconds: number;
  fullTestContext: Test;
}


// API Response Types
export interface DashboardStats {
    testsTaken: number | 'N/A';
    averageScore: number | 'N/A';
    highestScore: number | 'N/A';
    questionsAnswered: number | 'N/A';
}

export interface ProfileStats {
    totalStudyTime: string;
    testsCompleted: number;
    highestScore: number | 'N/A';
    achievementsUnlocked: number;
    totalAchievements: number;
}
