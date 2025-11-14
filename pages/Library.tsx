
import React from 'react';
import Card from '../components/ui/Card';

const Library: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Library</h1>
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your topics, syllabi, and study materials here.</p>
      </Card>
    </div>
  );
};

export default Library;
