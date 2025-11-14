import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, QuestionType } from '../types';
import { generateTest, parseSyllabus } from '../services/geminiService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { ArrowPathIcon } from '../assets/icons';

// A styled select component wrapper
const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className={`mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${props.className}`} />
);

// A styled text input component wrapper
const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${props.className}`} />
);

const TestBuilderPage: React.FC = () => {
  const [examPreset, setExamPreset] = useState('custom'); // 'custom', 'GRE', 'SAT'
  
  // State for Pre-defined exams
  const [difficulty, setDifficulty] = useState('standard'); // 'easy', 'standard', 'hard'
  const [durationPreset, setDurationPreset] = useState('standard'); // 'quick', 'standard', 'endurance'

  // State for Custom exams
  const [customTestName, setCustomTestName] = useState('');
  const [customDuration, setCustomDuration] = useState(60);
  const [customExamFormat, setCustomExamFormat] = useState('mixed'); // 'objective', 'subjective', 'mixed'
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [parsedTopics, setParsedTopics] = useState<string[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(null);
  
  const navigate = useNavigate();

  const handleSyllabusUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSyllabusFile(file);
      setParsedTopics(null); // Reset topics if a new file is uploaded
      
      setIsLoading(true);
      setLoadingMessage('AI is parsing your syllabus...');
      setError(null);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        try {
          const topics = await parseSyllabus(content);
          setParsedTopics(topics);
        } catch (err: any) {
          setError(err.message || 'Failed to parse syllabus.');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateTest = async () => {
    setIsLoading(true);
    setLoadingMessage('AI is generating your test...');
    setError(null);
    setGeneratedQuestions(null);
    
    let topicsForGeneration: string[] = [];
    let numQuestions = 10; // Default
    let finalQuestionTypes: QuestionType[];

    if (examPreset === 'custom') {
      if (!parsedTopics || parsedTopics.length === 0) {
        setError('Please upload a syllabus and wait for it to be parsed.');
        setIsLoading(false);
        return;
      }
      topicsForGeneration = parsedTopics;
      numQuestions = Math.ceil(customDuration / 5); // Simple logic: 5 mins per question

      switch (customExamFormat) {
        case 'objective':
            finalQuestionTypes = [QuestionType.MultipleChoice];
            break;
        case 'subjective':
            finalQuestionTypes = [QuestionType.ShortAnswer];
            break;
        default: // 'mixed'
            finalQuestionTypes = [QuestionType.MultipleChoice, QuestionType.ShortAnswer];
            break;
      }
    } else {
      // Logic for pre-defined exams
      const presetTopics: Record<string, string[]> = {
        'GRE': ['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing Prompts'],
        'SAT': ['Reading Comprehension', 'Writing and Language', 'Math (Calculator)', 'Math (No Calculator)'],
      };
      topicsForGeneration = presetTopics[examPreset] || [];
      const durationMap: Record<string, number> = { 'quick': 5, 'standard': 10, 'endurance': 25 };
      numQuestions = durationMap[durationPreset];
      finalQuestionTypes = [QuestionType.MultipleChoice, QuestionType.ShortAnswer];
    }

    try {
      const questions = await generateTest({
        topics: topicsForGeneration,
        numQuestions: numQuestions,
        questionTypes: finalQuestionTypes,
        difficulty: difficulty as 'easy' | 'standard' | 'hard',
      });
      setGeneratedQuestions(questions);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during test generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = () => {
    // In a real app, this would save the test and navigate to the runner
    // For now, we'll just navigate with a dummy ID.
    // We could pass the questions via state, but this is a demo.
    navigate('/test-runner/generated-test');
    alert('Starting your generated test!');
  };

  const isGenerateDisabled = () => {
    if (isLoading) return true;
    if (examPreset === 'custom' && (!syllabusFile || !parsedTopics)) return true;
    return false;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Test Builder</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Create a new practice test powered by AI.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2 p-8">
            <div className="space-y-6">
                <div>
                    <label htmlFor="examPreset" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Exam Type</label>
                    <SelectInput id="examPreset" value={examPreset} onChange={e => setExamPreset(e.target.value)}>
                        <option value="custom">Custom Exam</option>
                        <option value="GRE">GRE</option>
                        <option value="SAT">SAT</option>
                    </SelectInput>
                </div>

                {examPreset !== 'custom' ? (
                    <>
                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty</label>
                            <SelectInput id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                                <option value="easy">Easy</option>
                                <option value="standard">Standard</option>
                                <option value="hard">Hard</option>
                            </SelectInput>
                        </div>
                        <div>
                            <label htmlFor="durationPreset" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Exam Duration</label>
                            <SelectInput id="durationPreset" value={durationPreset} onChange={e => setDurationPreset(e.target.value)}>
                                <option value="quick">Quick (~5 Questions)</option>
                                <option value="standard">Standard (~10 Questions)</option>
                                <option value="endurance">Endurance (~25 Questions)</option>
                            </SelectInput>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label htmlFor="customTestName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Exam Name</label>
                            <TextInput type="text" id="customTestName" value={customTestName} onChange={e => setCustomTestName(e.target.value)} placeholder="e.g., Mid-term Chemistry Prep" />
                        </div>
                        <div>
                            <label htmlFor="customExamFormat" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Question Format</label>
                            <SelectInput id="customExamFormat" value={customExamFormat} onChange={e => setCustomExamFormat(e.target.value)}>
                                <option value="mixed">Mixed (Objective & Subjective)</option>
                                <option value="objective">Objective (Multiple Choice)</option>
                                <option value="subjective">Subjective (Short Answer)</option>
                            </SelectInput>
                        </div>
                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty</label>
                            <SelectInput id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                                <option value="easy">Easy</option>
                                <option value="standard">Standard</option>
                                <option value="hard">Hard</option>
                            </SelectInput>
                        </div>
                         <div>
                            <label htmlFor="customDuration" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Duration (minutes)</label>
                            <TextInput type="number" id="customDuration" value={customDuration} onChange={e => setCustomDuration(Number(e.target.value))} />
                        </div>
                        <div>
                            <label htmlFor="syllabusUpload" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Upload Syllabus & Content</label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Upload a single file (.txt, .pdf) containing your syllabus and study material. The AI will generate questions based on this content.</p>
                            <input type="file" id="syllabusUpload" accept=".txt,.pdf,.doc,.docx" onChange={handleSyllabusUpload} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                        </div>
                        {parsedTopics && (
                            <div>
                                <h3 className="text-lg font-semibold">AI-Extracted Topics:</h3>
                                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    {parsedTopics.map(topic => (
                                        <span key={topic} className="bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 text-sm font-medium px-2.5 py-1 rounded-full">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Card>

        <Card className="lg:col-span-1 p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-4">Ready to Generate?</h3>
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm" role="alert">{error}</div>}
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[100px]">
                    <Spinner className="w-10 h-10 mb-3" />
                    <p className="text-slate-600 dark:text-slate-300 text-sm text-center">{loadingMessage}</p>
                </div>
            ) : generatedQuestions ? (
                <div className="space-y-4">
                    <p className="text-green-600 dark:text-green-400 font-semibold">Your test is ready!</p>
                    <p className="text-sm text-slate-500">{generatedQuestions.length} questions have been generated.</p>
                    <Button onClick={handleStartTest} className="w-full">
                        Start Test
                    </Button>
                    <Button onClick={handleGenerateTest} variant="secondary" className="w-full">
                        <ArrowPathIcon className="w-4 h-4 mr-2 inline" />
                        Regenerate
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Once your settings are configured, the AI will generate a unique test for you.
                    </p>
                    <Button onClick={handleGenerateTest} disabled={isGenerateDisabled()} className="w-full">
                        Generate Test
                    </Button>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default TestBuilderPage;