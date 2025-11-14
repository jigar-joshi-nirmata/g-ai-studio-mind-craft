import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { MOCK_TEST } from '../constants';
import { Question, QuestionType, Test } from '../types';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const TestRunnerPage: React.FC = () => {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // In a real app, fetch test by ID if location.state is null
  // For the hackathon, we pass generated questions via state or use mock
  const [test, setTest] = useState<Test>(location.state ? {
      id: testId || 'generated-test',
      name: location.state.name,
      questions: location.state.questions,
      duration: 15, // placeholder
      subject: 'Custom' // placeholder
  } : MOCK_TEST);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const currentQuestion = test.questions[currentQuestionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: string, answer: string) => {
    if (currentQuestion.type === QuestionType.MultiSelect) {
      const currentAnswers = (answers[questionId] as string[] || []);
      const newAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter(a => a !== answer)
        : [...currentAnswers, answer];
      setAnswers({ ...answers, [questionId]: newAnswers });
    } else {
      setAnswers({ ...answers, [questionId]: answer });
    }
  };
  
  const renderQuestion = (question: Question) => {
    if (!question) return <p>Loading question...</p>;
    switch (question.type) {
      case QuestionType.MultipleChoice:
        return (
          <div className="space-y-4">
            {question.options?.map(option => (
              <label key={option.id} className="flex items-center p-4 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/30 has-[:checked]:border-primary-500">
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={answers[question.id] === option.id}
                  onChange={() => handleAnswerChange(question.id, option.id)}
                  className="h-4 w-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                />
                <span className="ml-4 text-lg">{option.text}</span>
              </label>
            ))}
          </div>
        );
      case QuestionType.ShortAnswer:
          return (
              <div>
                  <textarea
                      rows={5}
                      value={(answers[question.id] as string) || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-lg p-4"
                      placeholder="Type your answer here..."
                  />
              </div>
          );
      default:
        return <p>Unsupported question type.</p>;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = timeLeft / (test.duration * 60);
    if (percentage < 0.1) return 'bg-red-500/80 text-white';
    if (percentage < 0.3) return 'bg-yellow-500/80 text-yellow-900';
    return 'bg-slate-200 dark:bg-slate-800';
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    navigate(`/grading/${test.id}`);
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-100 dark:bg-slate-950 flex p-4 z-50">
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <h1 className="text-xl font-bold">{test.name}</h1>
                <div className="flex items-center gap-4">
                    <div className={`text-2xl font-mono px-4 py-1 rounded-lg transition-colors duration-500 ${getTimeColor()}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <Button variant="primary" onClick={() => setIsConfirmModalOpen(true)}>Submit Test</Button>
                </div>
            </header>
            <div className="flex-1 flex overflow-hidden">
              <main className="flex-1 p-8 overflow-y-auto">
                <p className="text-slate-500 mb-2">Question {currentQuestionIndex + 1} of {test.questions.length}</p>
                <h2 className="text-3xl font-semibold mb-8">{currentQuestion?.text}</h2>
                {renderQuestion(currentQuestion)}

                <div className="mt-12 flex justify-between">
                    <Button variant="secondary" onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0}>
                        Previous
                    </Button>
                    <Button variant="primary" onClick={() => setCurrentQuestionIndex(p => Math.min(test.questions.length - 1, p + 1))} disabled={currentQuestionIndex === test.questions.length - 1}>
                        Next
                    </Button>
                </div>
              </main>
              <aside className="w-72 border-l border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
                <h3 className="font-bold mb-4">Questions</h3>
                <div className="grid grid-cols-5 gap-2">
                    {test.questions.map((q, index) => (
                        <button 
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`flex items-center justify-center w-10 h-10 rounded-md font-semibold transition-colors
                                ${index === currentQuestionIndex ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900' : ''}
                                ${answers[q.id] ? 'bg-slate-300 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}
                                hover:bg-slate-300 dark:hover:bg-slate-600
                            `}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
              </aside>
            </div>
        </div>
      </div>
      
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Submit Your Test?">
        <div className="text-center">
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to finish and submit your test for grading?</p>
            <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleConfirmSubmit}>Yes, Submit Now</Button>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default TestRunnerPage;