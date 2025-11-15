import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Test, ExamPreset, GenerateTestPayload } from '../types';
import { getExamPresets, generateTest } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import {
    AcademicCapIcon, WrenchScrewdriverIcon, CheckCircleIcon, DocumentArrowUpIcon, TrashIcon,
    BoltIcon, FireIcon, BrainIcon, ListBulletIcon, PencilSquareIcon, ClockIcon, HourglassIcon, ArrowPathIcon
} from '../assets/icons';

const TestBuilderPage: React.FC = () => {
    const [examPresets, setExamPresets] = useState<ExamPreset[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string>('Custom Exam');

    // Config states
    const [difficulty, setDifficulty] = useState<'easy' | 'standard' | 'hard'>('standard');
    const [durationPreset, setDurationPreset] = useState<'quick' | 'standard' | 'endurance'>('standard');
    const [customTestName, setCustomTestName] = useState('');
    const [customNumQuestions, setCustomNumQuestions] = useState(10);
    const [questionFormat, setQuestionFormat] = useState<'objective' | 'subjective'>('objective');

    // Syllabus state
    const [syllabusFile, setSyllabusFile] = useState<File | null>(null);

    // API/Flow state
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [generatedTest, setGeneratedTest] = useState<Test | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPresets = async () => {
            try {
                const presets = await getExamPresets();
                setExamPresets(presets);
            } catch (err) {
                console.error("Failed to fetch exam presets");
            }
        };
        fetchPresets();
    }, []);

    const handleSyllabusUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSyllabusFile(file);
            setError(null);
            setGeneratedTest(null);
        }
    };

    const handleGenerateTest = async () => {
        setIsLoading(true);
        setLoadingMessage('Reading syllabus and preparing request...');
        setError(null);
        setGeneratedTest(null);

        const processAndGenerate = (syllabusContent?: string) => {
            setLoadingMessage('AI is generating your test...');
            
            let payload: GenerateTestPayload;
            if (selectedPreset === 'Custom Exam') {
                payload = {
                    examType: 'custom',
                    examName: customTestName,
                    difficulty,
                    numQuestions: customNumQuestions,
                    questionFormat,
                    syllabusContent: syllabusContent,
                };
            } else {
                payload = {
                    examType: selectedPreset,
                    difficulty,
                    presetDuration: durationPreset,
                    syllabusContent: syllabusContent,
                };
            }

            generateTest(payload)
                .then(test => {
                    setGeneratedTest(test);
                })
                .catch(err => {
                    setError(err.message || 'An unknown error occurred during test generation.');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        if (syllabusFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                processAndGenerate(content);
            };
            reader.onerror = () => {
                setError('Failed to read the syllabus file.');
                setIsLoading(false);
            };
            reader.readAsText(syllabusFile);
        } else {
            processAndGenerate(); // Generate without syllabus content
        }
    };
    
    const handleStartTest = () => {
        if (!generatedTest) return;
        navigate(`/test-runner/${generatedTest.id}`, { state: { test: generatedTest } });
    };

    const isGenerateReady = useMemo(() => {
        if (isLoading) return false;
        if (selectedPreset === 'Custom Exam') {
            return !!syllabusFile && !!customTestName && customNumQuestions > 0;
        }
        return true; // Presets can always be generated
    }, [isLoading, selectedPreset, syllabusFile, customTestName, customNumQuestions]);

    // UI Components
    const ExamTypeCard = ({ id, name, description, icon }: { id: string, name: string, description: string, icon: React.ReactNode }) => (
        <div
            onClick={() => { setSelectedPreset(name); setGeneratedTest(null); setError(null); }}
            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-center flex flex-col items-center justify-center h-full
                ${selectedPreset === name
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-lg'
                    : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`
            }
        >
            {icon}
            <h3 className="font-bold text-lg mt-2">{name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            {selectedPreset === name && (
                <CheckCircleIcon className="w-6 h-6 text-primary-500 absolute top-2 right-2" />
            )}
        </div>
    );

    const OptionBox = ({ label, description, icon, isSelected, onClick }: { label: string, description: string, icon: React.ReactNode, isSelected: boolean, onClick: () => void }) => (
        <div
            onClick={onClick}
            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-left flex items-center
                ${isSelected
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-md'
                    : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600'}`
            }
        >
            <div className="mr-4 text-primary-500 dark:text-primary-400">{icon}</div>
            <div>
                <h4 className="font-bold">{label}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
            {isSelected && <CheckCircleIcon className="w-6 h-6 text-primary-500 absolute top-3 right-3" />}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                {/* Step 1: Choose Exam Type */}
                <Card className="p-6 bg-slate-800/30 dark:bg-slate-900/30 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-4 text-slate-100">1. Choose Exam Type</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ExamTypeCard id="custom" name="Custom Exam" description="Build from your own syllabus" icon={<WrenchScrewdriverIcon className="w-8 h-8" />} />
                        {examPresets.map(preset => (
                            // Fix: Use spread operator for preset props to ensure correct type checking.
                            <ExamTypeCard key={preset.id} {...preset} icon={<AcademicCapIcon className="w-8 h-8" />} />
                        ))}
                    </div>
                </Card>

                {/* Step 2: Configure Test */}
                <Card className="p-6 bg-slate-800/30 dark:bg-slate-900/30 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-4 text-slate-100">2. Configure Your Test</h2>
                    {selectedPreset === 'Custom Exam' ? (
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="testName" className="block text-sm font-medium text-slate-300 mb-1">Exam Name</label>
                                <input
                                    type="text"
                                    id="testName"
                                    value={customTestName}
                                    onChange={e => setCustomTestName(e.target.value)}
                                    placeholder="e.g., Mid-term Chemistry Prep"
                                    className="w-full bg-slate-700/50 border-slate-600 rounded-lg p-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-300 mb-1">Number of Questions ({customNumQuestions})</label>
                                <input
                                    type="range"
                                    id="numQuestions"
                                    min="5"
                                    max="50"
                                    step="5"
                                    value={customNumQuestions}
                                    onChange={e => setCustomNumQuestions(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-300 mb-2">Question Format</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <OptionBox label="Objective" description="Multiple choice questions" icon={<ListBulletIcon className="w-6 h-6" />} isSelected={questionFormat === 'objective'} onClick={() => setQuestionFormat('objective')} />
                                    <OptionBox label="Subjective" description="Short answer questions" icon={<PencilSquareIcon className="w-6 h-6" />} isSelected={questionFormat === 'subjective'} onClick={() => setQuestionFormat('subjective')} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Exam Length</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <OptionBox label="Quick" description="Approx. 15 mins" icon={<ClockIcon className="w-6 h-6" />} isSelected={durationPreset === 'quick'} onClick={() => setDurationPreset('quick')} />
                                <OptionBox label="Standard" description="Approx. 30 mins" icon={<HourglassIcon className="w-6 h-6" />} isSelected={durationPreset === 'standard'} onClick={() => setDurationPreset('standard')} />
                                <OptionBox label="Endurance" description="Approx. 60 mins" icon={<HourglassIcon className="w-6 h-6" />} isSelected={durationPreset === 'endurance'} onClick={() => setDurationPreset('endurance')} />
                            </div>
                        </div>
                    )}
                    <div className="mt-6">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Difficulty</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <OptionBox label="Easy" description="Focus on core concepts" icon={<BoltIcon className="w-6 h-6" />} isSelected={difficulty === 'easy'} onClick={() => setDifficulty('easy')} />
                            <OptionBox label="Standard" description="A balanced challenge" icon={<BrainIcon className="w-6 h-6" />} isSelected={difficulty === 'standard'} onClick={() => setDifficulty('standard')} />
                            <OptionBox label="Hard" description="For advanced learners" icon={<FireIcon className="w-6 h-6" />} isSelected={difficulty === 'hard'} onClick={() => setDifficulty('hard')} />
                        </div>
                    </div>
                </Card>
                
                 {/* Step 3: Upload Syllabus */}
                <Card className="p-6 bg-slate-800/30 dark:bg-slate-900/30 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-4 text-slate-100">3. Upload Syllabus (Optional for presets)</h2>
                    <label
                        htmlFor="syllabus-upload"
                        className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                    >
                        {syllabusFile ? (
                            <div className="text-center">
                                <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto mb-2" />
                                <p className="font-semibold text-green-300">{syllabusFile.name}</p>
                                <p className="text-xs text-slate-400">({(syllabusFile.size / 1024).toFixed(2)} KB)</p>
                                <button
                                    onClick={(e) => { e.preventDefault(); setSyllabusFile(null); }}
                                    className="mt-2 text-xs text-red-400 hover:underline"
                                >
                                    Remove File
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <DocumentArrowUpIcon className="w-10 h-10 mb-3 text-slate-400" />
                                <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-slate-500">TXT, DOCX, PDF (MAX. 5MB)</p>
                            </div>
                        )}
                        <input id="syllabus-upload" type="file" className="hidden" onChange={handleSyllabusUpload} accept=".txt,.pdf,.docx" />
                    </label>
                     {selectedPreset === 'Custom Exam' && !syllabusFile && (
                        <p className="text-sm text-amber-400 mt-2">A syllabus file is required for custom exams.</p>
                     )}
                </Card>

            </div>

            {/* Sticky Summary & Action Panel */}
            <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                    <Card className="p-6 bg-slate-800/30 dark:bg-slate-900/30 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-slate-100 border-b border-slate-700 pb-3 mb-4">Your Test Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-slate-400">Exam Type:</span> <span className="font-semibold">{selectedPreset}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">Difficulty:</span> <span className="font-semibold capitalize">{difficulty}</span></div>
                            {selectedPreset !== 'Custom Exam' && <div className="flex justify-between"><span className="text-slate-400">Length:</span> <span className="font-semibold capitalize">{durationPreset}</span></div>}
                            {selectedPreset === 'Custom Exam' && <div className="flex justify-between"><span className="text-slate-400">Questions:</span> <span className="font-semibold">{customNumQuestions}</span></div>}
                            {selectedPreset === 'Custom Exam' && <div className="flex justify-between"><span className="text-slate-400">Format:</span> <span className="font-semibold capitalize">{questionFormat}</span></div>}
                            <div className="flex justify-between"><span className="text-slate-400">Syllabus:</span> <span className={`font-semibold ${syllabusFile ? 'text-green-400' : 'text-slate-500'}`}>{syllabusFile ? 'Attached' : 'None'}</span></div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-slate-800/30 dark:bg-slate-900/30 backdrop-blur-sm">
                        {error && <p className="text-sm text-red-400 mb-4 text-center">{error}</p>}
                        
                        {generatedTest ? (
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center text-green-400">
                                  <CheckCircleIcon className="w-7 h-7 mr-2" />
                                  <p className="font-semibold">Test is ready to start!</p>
                                </div>
                                <Button onClick={handleStartTest} className="w-full py-3 text-lg">
                                    Start Test Now
                                </Button>
                                <Button onClick={handleGenerateTest} variant="ghost" className="w-full text-sm">
                                  <ArrowPathIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                  Regenerate Test
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={handleGenerateTest} disabled={!isGenerateReady || isLoading} className="w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? (
                                    <>
                                        <Spinner className="w-5 h-5 mr-2" />
                                        <span>{loadingMessage || 'Generating...'}</span>
                                    </>
                                ) : (
                                    'Generate Test'
                                )}
                            </Button>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TestBuilderPage;