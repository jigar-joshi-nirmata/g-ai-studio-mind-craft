import React from 'react';
import Card from '../components/ui/Card';
import { MOCK_TOPICS } from '../constants';
import Button from '../components/ui/Button';

// Updated StatCard with no 'change' prop for simplicity
const StatCard: React.FC<{ title: string, value: string }> = ({ title, value }) => (
    <Card className="p-6">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
    </Card>
);

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Tests Taken" value="7" />
        <StatCard title="Overall Average Score" value="78%" />
        <StatCard title="Highest Score" value="95%" />
        <StatCard title="Questions Answered" value="154" />
      </div>

      <div>
          <h2 className="text-2xl font-bold mb-4">AI Recommended Topics</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4 max-w-3xl">
              Based on your recent test performance, our AI suggests focusing on these areas to improve your score.
          </p>
          <Card className="p-6">
              <div className="space-y-4">
                  {MOCK_TOPICS.slice(0, 4).map(topic => (
                      <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <div>
                              <h3 className="font-semibold">{topic.title}</h3>
                              <p className="text-sm text-slate-500">{topic.summary}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-semibold">{Math.round(topic.mastery * 100)}%</p>
                                <p className="text-xs text-slate-400">Current Mastery</p>
                            </div>
                            <Button variant="ghost">Study</Button>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>
      </div>
    </div>
  );
};

export default Dashboard;