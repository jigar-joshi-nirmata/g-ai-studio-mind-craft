
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, BeakerIcon, UserCircleIcon, FolderIcon, Cog6ToothIcon } from '../../assets/icons';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { path: '/learn', label: 'Learn', icon: BookOpenIcon },
  { path: '/test-builder', label: 'Test Builder', icon: BeakerIcon },
  { path: '/profile', label: 'Profile', icon: UserCircleIcon },
  { path: '/library', label: 'Library', icon: FolderIcon },
];

const NavItem: React.FC<{ path: string, label: string, icon: React.FC<{className?: string}> }> = ({ path, label, icon: Icon }) => {
  const baseClasses = 'flex items-center px-4 py-3 text-slate-600 dark:text-slate-300 rounded-lg transition-colors duration-200';
  const hoverClasses = 'hover:bg-slate-200 dark:hover:bg-slate-800';
  const activeClasses = 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 font-semibold';

  return (
    <NavLink
      to={path}
      className={({ isActive }) => `${baseClasses} ${hoverClasses} ${isActive ? activeClasses : ''}`}
    >
      <Icon className="w-5 h-5 mr-4" />
      <span>{label}</span>
    </NavLink>
  );
};


const LeftNav: React.FC = () => {
  return (
    <nav className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="bg-primary-500 rounded-lg p-2 mr-3">
            <BeakerIcon className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">IntelliGrade</h1>
      </div>
      <div className="flex-grow">
        {navItems.map(item => (
          <NavItem key={item.path} {...item} />
        ))}
      </div>
      <div className="mt-auto">
        <NavItem path="/settings" label="Settings" icon={Cog6ToothIcon} />
      </div>
    </nav>
  );
};

export default LeftNav;
