import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from "../types";

// IMPORTANT: The API key is sourced from an environment variable `process.env.API_KEY`.
// This setup assumes the key is provided in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface TestGenerationParams {
  topics: string[];
  numQuestions: number;
  questionTypes: QuestionType[];
  difficulty: 'easy' | 'standard' | 'hard';
}

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'A unique identifier for the question (e.g., "q1").' },
    type: { type: Type.STRING, enum: [QuestionType.MultipleChoice, QuestionType.ShortAnswer, QuestionType.MultiSelect], description: 'The type of question.' },
    text: { type: Type.STRING, description: 'The main text of the question.' },
    options: {
      type: Type.ARRAY,
      description: 'An array of options for multiple choice questions. Should be null for short answer.',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: 'A unique ID for the option (e.g., "q1-o1").' },
          text: { type: Type.STRING, description: 'The text of the option.' },
        },
        required: ['id', 'text']
      }
    },
    correctAnswer: {
      type: Type.STRING,
      description: 'The ID of the correct option for MCQ, or the correct text for Short Answer.'
    },
    explanation: { type: Type.STRING, description: 'A brief explanation for the correct answer.' }
  },
  required: ['id', 'type', 'text', 'correctAnswer', 'explanation']
};


export const generateTest = async (params: TestGenerationParams): Promise<Question[]> => {
  const { topics, numQuestions, questionTypes, difficulty } = params;

  const prompt = `
    Generate a practice test with exactly ${numQuestions} questions.
    The test should be of '${difficulty}' difficulty.
    The test should cover the following topics: ${topics.join(', ')}.
    Include a mix of the following question types: ${questionTypes.join(', ')}.
    For each question, provide the question text, options (for multiple choice), the correct answer, and a brief explanation.
    Ensure the output is a valid JSON array of question objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: questionSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const generatedQuestions = JSON.parse(jsonText);
    
    // The Gemini API response with responseSchema returns the JSON directly
    return generatedQuestions as Question[];
  } catch (error) {
    console.error("Error generating test with Gemini:", error);
    throw new Error("Failed to generate the test. Please check your API key and try again.");
  }
};


export const parseSyllabus = async (fileContent: string): Promise<string[]> => {
    const prompt = `
      Extract the key topics or concepts from the following syllabus text.
      Return the topics as a simple JSON array of strings.
      Example output: ["React Hooks", "State Management", "Component Lifecycle"]

      Syllabus content:
      ---
      ${fileContent}
      ---
    `;

    try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        });

        const jsonText = response.text.trim();
        const topics = JSON.parse(jsonText);
        return topics as string[];
    } catch (error) {
        console.error("Error parsing syllabus with Gemini:", error);
        throw new Error("Failed to parse the syllabus.");
    }
};