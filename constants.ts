import { Topic, Test, QuestionType, Flashcard } from './types';

export const MOCK_TOPICS: Topic[] = [
  { id: '1', title: 'React Hooks', summary: 'useState, useEffect, useContext, etc.', mastery: 0.8, lastReviewed: '2023-10-26T10:00:00Z' },
  { id: '2', title: 'CSS Grid Layout', summary: 'A two-dimensional layout system for the web.', mastery: 0.6, lastReviewed: '2023-10-25T14:30:00Z' },
  { id: '3', title: 'TypeScript Basics', summary: 'Types, interfaces, enums, and generics.', mastery: 0.9, lastReviewed: '2023-10-27T09:00:00Z' },
  { id: '4', title: 'Asynchronous JavaScript', summary: 'Promises, async/await.', mastery: 0.75, lastReviewed: '2023-10-24T11:00:00Z' },
  { id: '5', title: 'Redux State Management', summary: 'Core concepts of Redux for global state.', mastery: 0.4, lastReviewed: '2023-10-20T16:00:00Z' },
  { id: '6', title: 'Node.js Fundamentals', summary: 'Event loop, modules, and file system.', mastery: 0.5, lastReviewed: '2023-10-22T13:00:00Z' },
];

export const MOCK_TEST: Test = {
    id: 'sample-test-123',
    name: 'React Fundamentals Quiz',
    subject: 'Web Development',
    duration: 15,
    questions: [
        {
            id: 'q1',
            type: QuestionType.MultipleChoice,
            text: 'Which hook is used to perform side effects in a function component?',
            options: [
                { id: 'q1-o1', text: 'useState' },
                { id: 'q1-o2', text: 'useEffect' },
                { id: 'q1-o3', text: 'useContext' },
                { id: 'q1-o4', text: 'useReducer' },
            ],
            correctAnswer: 'q1-o2',
            explanation: '`useEffect` is used for side effects like data fetching, subscriptions, or manually changing the DOM.'
        },
        {
            id: 'q2',
            type: QuestionType.ShortAnswer,
            text: 'What is the purpose of the second argument in the `useEffect` hook?',
            correctAnswer: 'dependency array',
            explanation: 'The second argument is the dependency array. The effect will only re-run if one of the dependencies has changed.'
        }
    ]
};

export const MOCK_FLASHCARDS: Flashcard[] = [
  { id: 'fc1', front: 'What is `useState`?', back: 'A React Hook that lets you add state to function components. It returns a stateful value and a function to update it.' },
  { id: 'fc2', front: 'What is `useEffect` used for?', back: 'It lets you perform side effects in function components. Examples: fetching data, setting up a subscription, and manually changing the DOM.' },
  { id: 'fc3', front: 'What is the second argument of `useEffect`?', back: 'The dependency array. The effect will only re-run if one of the values in the array has changed since the last render.' },
  { id: 'fc4', front: 'How do you pass data down the component tree without prop drilling?', back: 'Using the `useContext` Hook in combination with `React.createContext`. It allows you to subscribe to a context from any component below the provider.' },
  { id: 'fc5', front: 'What is the purpose of `useReducer`?', back: 'An alternative to `useState`. It is usually preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.' }
];
