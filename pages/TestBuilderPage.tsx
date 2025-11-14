import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, QuestionType, ExamPreset } from '../types';
import { generateTest, parseSyllabus } from '../services/geminiService';
import { getExamPresets } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import {
    AcademicCapIcon, WrenchScrewdriverIcon, CheckCircleIcon, DocumentArrowUpIcon, TrashIcon,
    BoltIcon, FireIcon, BrainIcon, ListBulletIcon, PencilSquareIcon, ClockIcon, HourglassIcon, ArrowPathIcon
} from '../assets/icons';

const TestBuilderPage: React.FC = () => {
    const [examPresets, setExamPresets] = useState<ExamPreset[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string>('custom');

    // Config states
    const [difficulty, setDifficulty] = useState<'easy' | 'standard' | 'hard'>('standard');
    const [durationPreset, setDurationPreset] = useState<'quick' | 'standard' | 'endurance'>('standard');
    const [customTestName, setCustomTestName] = useState('');
    const [questionFormat, setQuestionFormat] = useState<'objective' | 'subjective'>('objective');

    // Syllabus state
    const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
    const [parsedTopics, setParsedTopics] = useState<string[] | null>(null);

    // API/Flow state
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPresets = async () => {
            try {
                const presets = await getExamPresets();
                setExamPresets(presets);
            } catch (err) {
                console.error("Failed to fetch exam presets");
                // Handle error, maybe show a toast
            }
        };
        fetchPresets();
    }, []);

    const handleSyllabusUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSyllabusFile(file);
            setParsedTopics(null);
            setError(null);
            setGeneratedQuestions(null);

            setIsLoading(true);
            setLoadingMessage('AI is parsing your syllabus...');

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

        let topicsForGeneration: string[] = parsedTopics || [];
        let numQuestions: number;
        let finalQuestionTypes: QuestionType[];

        if (selectedPreset === 'custom') {
            numQuestions = 10; // Default for custom
            finalQuestionTypes = questionFormat === 'objective' ? [QuestionType.MultipleChoice] : [QuestionType.ShortAnswer];
        } else {
            const presetDefaultTopics: Record<string, string[]> = {
                'GRE': ['Verbal Reasoning', 'Quantitative Reasoning', 'Analytical Writing'],
                'SAT': ['Reading Comprehension', 'Writing and Language', 'Math'],
                'ACT': ['English', 'Math', 'Reading', 'Science Reasoning'],
            };
            if (!topicsForGeneration.length) {
                const preset = examPresets.find(p => p.name === selectedPreset);
                topicsForGeneration = preset ? preset.description.split(', ') : [];
            }
            const durationMap: Record<string, number> = { 'quick': 5, 'standard': 10, 'endurance': 25 };
            numQuestions = durationMap[durationPreset];
            finalQuestionTypes = [QuestionType.MultipleChoice, QuestionType.ShortAnswer];
        }

        try {
            const questions = await generateTest({
                topics: topicsForGeneration,
                numQuestions,
                questionTypes: finalQuestionTypes,
                difficulty: difficulty,
            });
            setGeneratedQuestions(questions);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred during test generation.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleStartTest = () => {
        const testName = selectedPreset === 'custom' ? (customTestName || "Custom Test") : selectedPreset;
        navigate('/test-runner/generated-test', { state: { questions: generatedQuestions, name: testName } });
    };

    const isGenerateReady = useMemo(() => {
        if (isLoading) return false;
        if (selectedPreset === 'custom') {
            return !!syllabusFile && !!parsedTopics && parsedTopics.length > 0 && !!customTestName;
        }
        return true; // Presets can be generated without syllabus
    }, [isLoading, selectedPreset, syllabusFile, parsedTopics, customTestName]);

    // UI Components
    const ExamTypeCard = ({ id, name, description, icon }: { id: string, name: string, description: string, icon: React.ReactNode }) => (
        <div
            onClick={() => { setSelectedPreset(name); setGeneratedQuestions(null); setError(null); }}
            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-center flex flex-col items-center justify-center h-full
                ${selectedPreset === name
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-lg'
                    : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`
            }
        >
            {icon}
            <h3 className="font-bold text-lg mt-2">{name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            {selectedPreset === name && <CheckCircleIcon className="absolute top-2 right-2 w-6 h-6 text-primary-500" />}
        </div>
    );

    const OptionBox = ({ label, description, icon, isSelected, onClick }: { label: string, description: string, icon: React.ReactNode, isSelected: boolean, onClick: () => void }) => (
        <div
            onClick={onClick}
            className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                ${isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-primary-400'}`
            }
        >
            <div className="mr-4 text-primary-600 dark:text-primary-400">{icon}</div>
            <div>
                <h4 className="font-semibold">{label}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
            {isSelected && <CheckCircleIcon className="absolute top-2 right-2 w-5 h-5 text-primary-500" />}
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Test Builder Command Center</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Craft your perfect AI-powered practice exam.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left side: Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Step 1: Choose Exam Type */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">1. Choose Exam Type</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ExamTypeCard id="custom" name="Custom Exam" description="Build your own" icon={<WrenchScrewdriverIcon className="w-8 h-8" />} />
                            {examPresets.map(p => <ExamTypeCard key={p.id} {...p} icon={<AcademicCapIcon className="w-8 h-8" />} />)}
                        </div>
                    </Card>

                    {/* Step 2: Configure */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">2. Configure Your Test</h2>
                        {selectedPreset === 'custom' && (
                            <div className="mb-6">
                                <label htmlFor="customTestName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Exam Name</label>
                                <input
                                    type="text"
                                    id="customTestName"
                                    value={customTestName}
                                    onChange={e => setCustomTestName(e.target.value)}
                                    placeholder="e.g., Mid-term Chemistry Prep"
                                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-md font-semibold mb-3">Difficulty</h3>
                                <div className="space-y-3">
                                    <OptionBox label="Easy" description="Fundamental concepts" icon={<BoltIcon className="w-6 h-6" />} isSelected={difficulty === 'easy'} onClick={() => setDifficulty('easy')} />
                                    <OptionBox label="Standard" description="Comprehensive coverage" icon={<BrainIcon className="w-6 h-6" />} isSelected={difficulty === 'standard'} onClick={() => setDifficulty('standard')} />
                                    <OptionBox label="Hard" description="Challenging problems" icon={<FireIcon className="w-6 h-6" />} isSelected={difficulty === 'hard'} onClick={() => setDifficulty('hard')} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-md font-semibold mb-3">{selectedPreset === 'custom' ? 'Question Format' : 'Exam Length'}</h3>
                                {selectedPreset === 'custom' ? (
                                    <div className="space-y-3">
                                        <OptionBox label="Objective" description="Multiple choice" icon={<ListBulletIcon className="w-6 h-6" />} isSelected={questionFormat === 'objective'} onClick={() => setQuestionFormat('objective')} />
                                        <OptionBox label="Subjective" description="Short answer" icon={<PencilSquareIcon className="w-6 h-6" />} isSelected={questionFormat === 'subjective'} onClick={() => setQuestionFormat('subjective')} />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <OptionBox label="Quick" description="~5 Questions" icon={<ClockIcon className="w-6 h-6" />} isSelected={durationPreset === 'quick'} onClick={() => setDurationPreset('quick')} />
                                        <OptionBox label="Standard" description="~10 Questions" icon={<HourglassIcon className="w-6 h-6" />} isSelected={durationPreset === 'standard'} onClick={() => setDurationPreset('standard')} />
                                        <OptionBox label="Endurance" description="~25 Questions" icon={<HourglassIcon className="w-6 h-6 opacity-70" />} isSelected={durationPreset === 'endurance'} onClick={() => setDurationPreset('endurance')} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Step 3: Provide Content */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">3. Provide Syllabus</h2>
                        <p className={`text-sm mb-4 font-semibold ${selectedPreset === 'custom' ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {selectedPreset === 'custom' ? 'Syllabus upload is REQUIRED' : 'Syllabus upload is OPTIONAL'}
                        </p>
                         {syllabusFile ? (
                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{syllabusFile.name}</span>
                                <button onClick={() => { setSyllabusFile(null); setParsedTopics(null); }} className="text-slate-500 hover:text-red-500">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="syllabusUpload" className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors">
                                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-slate-400" />
                                <span className="mt-2 block text-sm font-semibold text-slate-600 dark:text-slate-300">Upload a file</span>
                                <span className="block text-xs text-slate-500">.txt, .pdf, .docx</span>
                                <input id="syllabusUpload" type="file" className="sr-only" accept=".txt,.pdf,.doc,.docx" onChange={handleSyllabusUpload} />
                            </label>
                        )}
                         {parsedTopics && (
                            <div className="mt-4">
                                <h3 className="text-md font-semibold text-slate-700 dark:text-slate-300">AI-Extracted Topics:</h3>
                                <div className="flex flex-wrap gap-2 mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    {parsedTopics.map(topic => <span key={topic} className="bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 text-sm font-medium px-2.5 py-1 rounded-full">{topic}</span>)}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right side: Summary & Actions */}
                <div className="lg:col-span-1 sticky top-8">
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4">Test Summary</h3>
                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-6">
                            <div className="flex justify-between"><span className="font-semibold text-slate-500">Type:</span> <span className="font-bold">{selectedPreset === 'custom' ? (customTestName || "Custom") : selectedPreset}</span></div>
                            <div className="flex justify-between"><span className="font-semibold text-slate-500">Difficulty:</span> <span className="font-bold capitalize">{difficulty}</span></div>
                            {selectedPreset !== 'custom' && <div className="flex justify-between"><span className="font-semibold text-slate-500">Length:</span> <span className="font-bold capitalize">{durationPreset}</span></div>}
                             {selectedPreset === 'custom' && <div className="flex justify-between"><span className="font-semibold text-slate-500">Format:</span> <span className="font-bold capitalize">{questionFormat}</span></div>}
                            <div className="flex justify-between"><span className="font-semibold text-slate-500">Syllabus:</span> <span className={`font-bold ${syllabusFile ? 'text-green-500' : 'text-slate-500'}`}>{syllabusFile ? 'Provided' : 'Not Provided'}</span></div>
                        </div>

                        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm" role="alert">{error}</div>}
                        
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center min-h-[120px]">
                                <Spinner className="w-10 h-10 mb-3" />
                                <p className="text-slate-600 dark:text-slate-300 text-sm text-center">{loadingMessage}</p>
                            </div>
                        ) : generatedQuestions ? (
                             <div className="space-y-4 text-center">
                                <p className="text-green-600 dark:text-green-400 font-semibold text-lg">Your test is ready!</p>
                                <div className="text-sm text-slate-500 dark:text-slate-400 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <p className='font-bold'>{generatedQuestions.length} questions have been generated.</p>
                                    <p className='mt-2 italic'>e.g., "{generatedQuestions[0].text}"</p>
                                </div>
                                <Button onClick={handleStartTest} className="w-full text-lg py-3">Start Test</Button>
                                <Button onClick={handleGenerateTest} variant="ghost" className="w-full"><ArrowPathIcon className="w-4 h-4 mr-2 inline" />Regenerate</Button>
                            </div>
                        ) : (
                            <Button onClick={handleGenerateTest} disabled={!isGenerateReady} className={`w-full text-lg py-3 ${isGenerateReady ? 'animate-pulse' : ''}`}>
                                Generate Test
                            </Button>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TestBuilderPage;
