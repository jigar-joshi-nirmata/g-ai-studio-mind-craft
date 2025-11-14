
import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftNav from './LeftNav';
import TopBar from './TopBar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      <LeftNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-950 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
