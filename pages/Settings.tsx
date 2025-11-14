
import React from 'react';
import Card from '../components/ui/Card';

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your account preferences, theme, and notifications.</p>
      </Card>
    </div>
  );
};

export default Settings;
