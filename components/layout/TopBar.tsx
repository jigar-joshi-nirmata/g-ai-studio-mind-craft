import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { SunIcon, MoonIcon, PlusCircleIcon, UserCircleIcon } from '../../assets/icons';
import Button from '../ui/Button';

const TopBar: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { theme, toggleTheme } = context;

  return (
    <header className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg border-b border-slate-200/10 flex items-center justify-between px-6 lg:px-8 shrink-0">
      <div>
        {/* Global search could go here */}
      </div>
      <div className="flex items-center gap-4">
        <Link to="/test-builder">
            <Button variant="primary" className="shadow-lg shadow-primary-500/30">
                <PlusCircleIcon className="w-5 h-5 mr-2 inline-block"/>
                Create Test
            </Button>
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
        <Link to="/profile" className="cursor-pointer">
            <UserCircleIcon className="w-8 h-8 text-slate-500 dark:text-slate-400 hover:text-primary-500 transition-colors" />
        </Link>
      </div>
    </header>
  );
};

export default TopBar;