import { Achievement, Test, QuestionType } from './types';
import { TrophyIcon, FireIcon, ShieldCheckIcon, StarIcon, LightBulbIcon, AcademicCapIcon, PuzzlePieceIcon, RocketLaunchIcon, ClockIcon } from './assets/icons';

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'Test Ace', description: 'Score 90% or higher on any test.', icon: TrophyIcon, achieved: true },
  { id: 'a2', name: 'Perfecto', description: 'Get a perfect score of 100% on a test.', icon: StarIcon, achieved: false },
  { id: 'a3', name: 'Study Streak', description: 'Complete a study session 5 days in a row.', icon: FireIcon, achieved: true },
  { id: 'a4', name: 'Topic Master', description: 'Achieve 90% mastery on a single topic.', icon: ShieldCheckIcon, achieved: true },
  { id: 'a5', name: 'Quick Learner', description: 'Complete your first study session.', icon: LightBulbIcon, achieved: true },
  { id: 'a6', name: 'Syllabus Pro', description: 'Generate a test from an uploaded syllabus.', icon: AcademicCapIcon, achieved: false },
  { id: 'a7', name: 'Weekend Warrior', description: 'Study on a Saturday or Sunday.', icon: PuzzlePieceIcon, achieved: true },
  { id: 'a8', name: 'Night Owl', description: 'Complete a session after 10 PM.', icon: ClockIcon, achieved: false},
  { id: 'a9', name: 'Marathon Learner', description: 'Study for over 2 hours in a single day.', icon: RocketLaunchIcon, achieved: true},
];

// This is a fallback to ensure the TestRunnerPage can function if it's accessed directly
// without generated questions from the TestBuilderPage. In a full app, this might
// redirect or show an error.
export const MOCK_TEST: Test = {
    id: 'mock-test-1',
    name: 'React Fundamentals Mock Test',
    subject: 'React',
    duration: 15,
    questions: [
      {
        id: 'q1',
        type: QuestionType.MultipleChoice,
        text: 'What is JSX?',
        options: [
          { id: 'q1-o1', text: 'A JavaScript syntax extension' },
          { id: 'q1-o2', text: 'A templating language for JavaScript' },
        ],
        correctAnswer: 'q1-o1',
        explanation: 'JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file.',
      },
      {
        id: 'q2',
        type: QuestionType.ShortAnswer,
        text: 'What hook is used to add state to a functional component?',
        correctAnswer: 'useState',
        explanation: 'The `useState` hook is used to declare state variables in functional components.',
      },
    ],
  };
