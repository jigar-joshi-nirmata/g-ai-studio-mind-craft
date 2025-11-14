import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, BeakerIcon, UserCircleIcon, MindCraftrLogo } from '../../assets/icons';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/learn', label: 'Learn', icon: BookOpenIcon },
  { path: '/test-builder', label: 'Test Builder', icon: BeakerIcon },
  { path: '/profile', label: 'Profile', icon: UserCircleIcon },
];

const NavItem: React.FC<{ path: string, label: string, icon: React.FC<{className?: string}> }> = ({ path, label, icon: Icon }) => {
  const baseClasses = 'flex items-center px-4 py-3 text-slate-400 rounded-lg transition-all duration-200 group relative';
  const hoverClasses = 'hover:bg-slate-800/60 hover:text-white';
  const activeClasses = 'bg-slate-800/80 text-white font-semibold';

  return (
    <NavLink
      to={path}
      className={({ isActive }) => `${baseClasses} ${hoverClasses} ${isActive ? activeClasses : ''}`}
    >
      {({ isActive }) => (
        <>
            <div className={`absolute left-0 top-0 h-full w-1 rounded-r-full bg-primary-400 transition-transform duration-300 scale-y-0 group-hover:scale-y-75 ${isActive ? 'scale-y-100' : ''}`}></div>
            <Icon className="w-5 h-5 mr-4 transition-colors group-hover:text-primary-400" />
            <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};


const LeftNav: React.FC = () => {
  return (
    <nav className="w-64 bg-slate-900/70 dark:bg-slate-900/50 backdrop-blur-lg border-r border-slate-200/10 p-4 flex flex-col">
      <div className="flex items-center mb-10 pl-2">
        <MindCraftrLogo className="w-10 h-10 text-white" />
        <h1 className="text-xl font-bold text-slate-100 ml-2">MindCraftr</h1>
      </div>
      <div className="flex-grow space-y-2">
        {navItems.map(item => (
          <NavItem key={item.path} {...item} />
        ))}
      </div>
      <div className="mt-auto">
        {/* Future items can go here */}
      </div>
    </nav>
  );
};

export default LeftNav;