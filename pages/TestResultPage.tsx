import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { TestResult } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckBadgeIcon, ExclamationTriangleIcon } from '../assets/icons';

const TestResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as TestResult | undefined;
    const [score, setScore] = useState(0);

    useEffect(() => {
        if(result) {
            const animation = setTimeout(() => setScore(result.score), 100);
            return () => clearTimeout(animation);
        }
    }, [result]);


    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold">No result data found.</h1>
                    <Button onClick={() => navigate('/dashboard')} className="mt-4">Go to Dashboard</Button>
                </div>
            </div>
        );
    }

    const getScoreColor = (s: number) => {
        if (s >= 80) return { text: 'text-green-400', bg: 'bg-green-500/20', from: 'from-green-500', to: 'to-emerald-500' };
        if (s >= 60) return { text: 'text-yellow-400', bg: 'bg-yellow-500/20', from: 'from-yellow-500', to: 'to-amber-500' };
        return { text: 'text-red-400', bg: 'bg-red-500/20', from: 'from-red-500', to: 'to-rose-500' };
    };
    
    const scoreColor = getScoreColor(score);

    return (
        <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-4xl mx-auto w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-100">Test Results</h1>
                    <p className="text-slate-400 mt-2">Here's your performance breakdown.</p>
                </div>

                <Card className="p-8 mb-8 text-center flex flex-col items-center bg-slate-900/50 backdrop-blur-lg relative overflow-hidden">
                    <div className={`absolute inset-0 z-0 opacity-20 animate-pulse ${scoreColor.bg}`}
                        style={{
                            background: `radial-gradient(circle, ${getScoreColor(score).from} 0%, rgba(0,0,0,0) 70%)`,
                            animationDuration: '4s'
                         }}
                    ></div>
                    <div className={`relative z-10 text-8xl font-bold transition-colors duration-500 ${scoreColor.text}`}>
                        {score}<span className="text-4xl">%</span>
                    </div>
                    <p className="relative z-10 text-xl font-semibold mt-2 text-slate-300">
                        You answered {result.correctAnswers} out of {result.totalQuestions} questions correctly.
                    </p>
                </Card>

                <Card className="p-8 mb-8 bg-slate-900/50 backdrop-blur-lg">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4">AI Performance Summary</h2>
                    <p className="text-lg text-slate-300 leading-relaxed italic border-l-4 border-primary-500 pl-4">
                        "{result.aiSummary}"
                    </p>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6 bg-slate-900/50 backdrop-blur-lg">
                        <div className="flex items-center mb-4">
                            <CheckBadgeIcon className="w-8 h-8 text-green-400 mr-3" />
                            <h3 className="text-xl font-bold text-green-400">Strengths</h3>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-slate-300">
                            {result.strengths.map(item => <li key={item}>{item}</li>)}
                        </ul>
                    </Card>
                    <Card className="p-6 bg-slate-900/50 backdrop-blur-lg">
                        <div className="flex items-center mb-4">
                            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400 mr-3" />
                            <h3 className="text-xl font-bold text-yellow-400">Areas for Improvement</h3>
                         <ul className="list-disc list-inside space-y-2 text-slate-300">
                            {result.weaknesses.map(item => <li key={item}>{item}</li>)}
                        </ul>
                    </Card>
                </div>

                <div className="text-center">
                    <Link to="/dashboard">
                        <Button variant="primary" className="px-8 py-3 text-lg shadow-lg shadow-primary-500/30">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TestResultPage;