import React, { useState, useMemo, useEffect } from 'react';
import Card from '../components/ui/Card';
import { MOCK_ACHIEVEMENTS } from '../constants';
import { UserCircleIcon, BeakerIcon, ClockIcon, TrophyIcon, StarIcon, AdjustmentsHorizontalIcon } from '../assets/icons';
import { Achievement, TopicMastery, ProfileStats } from '../types';
import { getProfileStats, getTopicMastery } from '../services/api';
import Spinner from '../components/ui/Spinner';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode, gradient: string }> = ({ title, value, icon, gradient }) => (
    <div className={`relative p-5 rounded-xl text-white shadow-lg overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-300`}></div>
        <div className="relative z-10 flex items-center">
            <div className="p-3 bg-white/20 rounded-lg mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm opacity-80">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    </div>
);

const AchievementBadge: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className={`relative flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 group ${achievement.achieved ? 'bg-amber-50 dark:bg-slate-800/50' : 'bg-slate-100 dark:bg-slate-800/50'}`}>
        <div className={`p-4 rounded-full mb-2 transition-all duration-300 ${achievement.achieved ? 'bg-amber-100 dark:bg-amber-900/50 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.7)]' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <achievement.icon className={`w-8 h-8 transition-colors duration-300 ${achievement.achieved ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`} />
        </div>
        <h4 className={`font-bold transition-colors duration-300 ${achievement.achieved ? 'text-amber-800 dark:text-amber-200' : 'text-slate-700 dark:text-slate-300'}`}>{achievement.name}</h4>
        
        <div className="absolute bottom-full mb-2 w-48 p-2 text-sm bg-slate-800 dark:bg-slate-700 text-white rounded-md scale-0 group-hover:scale-100 transition-transform origin-bottom z-10">
            {achievement.description}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800 dark:border-t-slate-700"></div>
        </div>
    </div>
);

type HeatmapFilter = 'All' | 'Strengths' | 'Weaknesses';

const Profile: React.FC = () => {
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [masteryData, setMasteryData] = useState<TopicMastery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [activeFilter, setActiveFilter] = useState<HeatmapFilter>('All');
    
    // Static for now, can be dynamic later
    const masteryLevel = 7;
    const masteryProgress = 65; // percentage

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                setIsLoading(true);
                const [profileStats, topicMastery] = await Promise.all([
                    getProfileStats(),
                    getTopicMastery()
                ]);
                setStats(profileStats);
                setMasteryData(topicMastery);
            } catch (err) {
                setError("Failed to load profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        loadProfileData();
    }, []);

    const filteredMastery = useMemo(() => {
        const sortedTopics = [...masteryData];
        switch (activeFilter) {
            case 'Strengths':
                return sortedTopics
                    .filter(t => t.mastery >= 0.8)
                    .sort((a, b) => b.mastery - a.mastery);
            case 'Weaknesses':
                return sortedTopics
                    .filter(t => t.mastery < 0.6)
                    .sort((a, b) => a.mastery - b.mastery);
            case 'All':
            default:
                return sortedTopics.sort((a, b) => a.topic.localeCompare(b.topic));
        }
    }, [activeFilter, masteryData]);
    
    const filters: HeatmapFilter[] = ['All', 'Strengths', 'Weaknesses'];
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner className="w-12 h-12" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-400">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-100">Your Progress Hub</h1>

            {/* Profile Header */}
            <Card className="p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 bg-slate-800/50 dark:bg-slate-900/30 backdrop-blur-sm">
                <UserCircleIcon className="w-24 h-24 text-primary-400" />
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-white">Jane Doe</h2>
                    <p className="text-primary-400 font-semibold">Mastery Level: {masteryLevel}</p>
                    <div className="w-full bg-slate-700/50 rounded-full h-4 mt-2">
                        <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full"
                            style={{ width: `${masteryProgress}%` }}
                        ></div>
                    </div>
                     <p className="text-sm text-slate-400 mt-1">{masteryProgress}% to next level</p>
                </div>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Study Time" value={stats?.totalStudyTime ?? '...'} icon={<ClockIcon className="w-7 h-7" />} gradient="from-sky-500 to-cyan-400" />
                <StatCard title="Tests Completed" value={stats?.testsCompleted ?? '...'} icon={<BeakerIcon className="w-7 h-7" />} gradient="from-purple-500 to-violet-500" />
                <StatCard title="Highest Score" value={stats?.highestScore !== 'N/A' ? `${stats?.highestScore}%` : 'N/A'} icon={<TrophyIcon className="w-7 h-7" />} gradient="from-green-500 to-emerald-500" />
                <StatCard title="Achievements" value={`${stats?.achievementsUnlocked}/${stats?.totalAchievements}` ?? '...'} icon={<StarIcon className="w-7 h-7" />} gradient="from-amber-500 to-orange-500" />
            </div>

            {/* Topic Mastery Heatmap */}
            <Card className="p-6 mb-8 bg-slate-800/50 dark:bg-slate-900/30 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-slate-100">Topic Mastery</h3>
                    <div className="flex items-center gap-2 p-1 bg-slate-100/10 dark:bg-slate-800/50 rounded-lg">
                        <AdjustmentsHorizontalIcon className="w-5 h-5 text-slate-400 ml-2" />
                        {filters.map(filter => (
                            <button 
                                key={filter} 
                                onClick={() => setActiveFilter(filter)}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeFilter === filter ? 'bg-white/90 dark:bg-slate-700 shadow text-primary-600 dark:text-primary-300' : 'text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMastery.map((item) => (
                        <div key={item.topic} className="p-4 bg-slate-50/10 dark:bg-slate-800/50 rounded-lg flex items-center justify-center text-center">
                            <p className="font-semibold text-slate-300 truncate">{item.topic}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Achievements */}
            <Card className="p-6 bg-slate-800/50 dark:bg-slate-900/30 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-slate-100 mb-4">Achievements</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {MOCK_ACHIEVEMENTS.map(ach => <AchievementBadge key={ach.id} achievement={ach} />)}
                </div>
            </Card>
        </div>
    );
};

export default Profile;
