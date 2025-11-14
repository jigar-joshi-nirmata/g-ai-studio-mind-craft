import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTestResult } from '../services/api';
import Spinner from '../components/ui/Spinner';

const GradingPage: React.FC = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            if (!testId) return;
            // In a real app, you'd get a jobId from submission and poll using that
            const result = await getTestResult(`job-for-${testId}`);
            // Navigate to the results page, passing the result data
            navigate(`/results/${testId}`, { state: { result } });
        };

        fetchResults();
    }, [testId, navigate]);

    return (
        <div className="fixed inset-0 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center text-center p-8">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl shadow-2xl max-w-lg w-full">
                <Spinner className="w-16 h-16 mx-auto mb-8 border-4" />
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 animate-pulse">Grading in Progress...</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                    Our AI is analyzing your answers. This might take a moment. Please don't close this page.
                </p>
            </div>
        </div>
    );
};

export default GradingPage;
