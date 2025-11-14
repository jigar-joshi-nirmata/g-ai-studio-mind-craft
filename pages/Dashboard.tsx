import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { getDashboardStats, getRecommendedTopics, getTopicDetails } from '../services/api';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Topic, TopicDetail, DashboardStats } from '../types';
import Spinner from '../components/ui/Spinner';
import { BeakerIcon, TrophyIcon, UserCircleIcon, BookOpenIcon, SparklesIcon, LightBulbIcon, StarIcon, BrainIcon, FireIcon } from '../assets/icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: 'blue' | 'purple' | 'green' | 'orange' }> = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: {
            bg: 'from-blue-500 to-indigo-600',
            iconBg: 'bg-blue-100 dark:bg-blue-900/40',
            iconText: 'text-blue-600 dark:text-blue-300',
        },
        purple: {
            bg: 'from-purple-500 to-violet-600',
            iconBg: 'bg-purple-100 dark:bg-purple-900/40',
            iconText: 'text-purple-600 dark:text-purple-300',
        },
        green: {
            bg: 'from-green-500 to-emerald-600',
            iconBg: 'bg-green-100 dark:bg-green-900/40',
            iconText: 'text-green-600 dark:text-green-300',
        },
        orange: {
            bg: 'from-orange-500 to-amber-600',
            iconBg: 'bg-orange-100 dark:bg-orange-900/40',
            iconText: 'text-orange-600 dark:text-orange-300',
        },
    };

    const selectedColor = colorClasses[color];

    return (
        <div className="relative group p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className={`absolute -inset-2 bg-gradient-to-br ${selectedColor.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}></div>
            <div className={`absolute inset-0 bg-gradient-to-br ${selectedColor.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-white/80 transition-colors">{title}</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1 group-hover:text-white transition-colors">{value}</p>
                    </div>
                    <div className={`${selectedColor.iconBg} p-3 rounded-lg transition-colors`}>
                        <div className={`${selectedColor.iconText} transition-colors`}>
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TopicCard: React.FC<{ topic: Topic, onStudy: (topic: Topic) => void }> = ({ topic, onStudy }) => {
    const topicIcons = [LightBulbIcon, BrainIcon, StarIcon, FireIcon];
    const Icon = topicIcons[parseInt(topic.id, 10) % topicIcons.length];
    const gradients = [
      'from-purple-500 to-indigo-600',
      'from-sky-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-amber-500 to-orange-600',
      'from-pink-500 to-rose-500',
      'from-lime-400 to-green-600',
    ];
    const gradient = gradients[parseInt(topic.id, 10) % gradients.length];

    return (
        <div className={`relative group p-5 rounded-xl shadow-lg text-white overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg">{topic.title}</h3>
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                <p className="text-sm opacity-80 mt-1 flex-grow">{topic.summary}</p>
                 <button onClick={() => onStudy(topic)} className="bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg w-full transition-all hover:bg-white/30 mt-4 text-center group-hover:scale-105">
                    Study Now
                </button>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [topicDetails, setTopicDetails] = useState<TopicDetail | null>(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const [statsData, topicsData] = await Promise.all([
                    getDashboardStats(),
                    getRecommendedTopics()
                ]);
                setStats(statsData);
                setTopics(topicsData);
            } catch (err) {
                setError('Failed to load dashboard data. Is the backend server running and accessible? Check the developer console (F12) for more details.');
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const handleStudyClick = async (topic: Topic) => {
        setSelectedTopic(topic);
        setIsModalOpen(true);
        setIsModalLoading(true);
        try {
            const details = await getTopicDetails(topic.id);
            setTopicDetails(details);
        } catch (err) {
            setTopicDetails(null); // Or set an error state within the modal
        } finally {
            setIsModalLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedTopic(null);
            setTopicDetails(null);
        }, 300);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="w-12 h-12" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-8 text-center bg-red-500/10 border border-red-500/30">
                <h3 className="text-xl font-bold text-red-300">Connection Error</h3>
                <p className="text-red-300/80 mt-2">{error}</p>
            </Card>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-100">Welcome back, Jane!</h1>
            <p className="text-slate-400 mb-6">Let's craft your mind and conquer your goals.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Tests Taken" value={stats?.testsTaken ?? '...'} icon={<BeakerIcon className="w-6 h-6" />} color="blue" />
                <StatCard title="Average Score" value={stats?.averageScore !== 'N/A' ? `${stats?.averageScore}%` : 'N/A'} icon={<UserCircleIcon className="w-6 h-6" />} color="purple" />
                <StatCard title="Highest Score" value={stats?.highestScore !== 'N/A' ? `${stats?.highestScore}%` : 'N/A'} icon={<TrophyIcon className="w-6 h-6" />} color="green" />
                <StatCard title="Questions Answered" value={stats?.questionsAnswered ?? '...'} icon={<BookOpenIcon className="w-6 h-6" />} color="orange" />
            </div>

            <div>
                <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-7 h-7 text-yellow-400" />
                    <h2 className="text-2xl font-bold text-slate-100">AI Recommended Topics</h2>
                </div>
                <p className="text-slate-400 mb-6 max-w-3xl">
                    Based on your recent test performance, our AI suggests focusing on these areas to improve your score.
                </p>
                {topics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topics.map((topic) => (
                            <TopicCard key={topic.id} topic={topic} onStudy={handleStudyClick} />
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center bg-slate-800/50">
                        <p className="text-slate-400">No recommendations available yet. Complete a test to get started!</p>
                    </Card>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedTopic?.title || 'Topic Details'}>
                {isModalLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Spinner />
                    </div>
                ) : topicDetails ? (
                    <div className="space-y-6 text-slate-600 dark:text-slate-300">
                        <p className="text-lg">{topicDetails.summary}</p>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Key Concepts</h3>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                {topicDetails.keyConcepts.map(concept => <li key={concept}>{concept}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Common Pitfalls</h3>
                            <ul className="list-disc list-inside space-y-1 pl-2">
                                {topicDetails.commonPitfalls.map(pitfall => <li key={pitfall} >{pitfall}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{topicDetails.example.title}</h3>
                            <pre className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-lg overflow-x-auto">
                                <code className="text-sm font-mono text-slate-800 dark:text-slate-200">{topicDetails.example.code}</code>
                            </pre>
                            <p className="mt-2 text-sm italic">{topicDetails.example.explanation}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-48">
                        <p>No details available for this topic yet.</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Dashboard;