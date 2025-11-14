
import React from 'react';

type IconProps = {
  className?: string;
};

export const HomeIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const BeakerIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.537-1.197 1.197-1.197h.006c.66 0 1.197.537 1.197 1.197v7.506c0 .66-.537 1.197-1.197 1.197h-.006c-.66 0-1.197-.537-1.197-1.197V6.087zM6.75 6.087c0-.66.537-1.197 1.197-1.197h.006c.66 0 1.197.537 1.197 1.197v7.506c0 .66-.537 1.197-1.197 1.197h-.006c-.66 0-1.197-.537-1.197-1.197V6.087z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12.259v5.005c0 .621.504 1.125 1.125 1.125h14.25c.621 0 1.125-.504 1.125-1.125v-5.005c0-.621-.504-1.125-1.125-1.125H4.875c-.621 0-1.125.504-1.125 1.125z" />
  </svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const FolderIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);

export const Cog6ToothIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.219 1.02.684 1.11 1.226l.082.499a11.95 11.95 0 011.696.883c.441.29.9.524 1.38.678.481.153.99.153 1.47 0 .48-.153.94-.388 1.38-.678.583-.39 1.18-.636 1.696-.883l.082-.499c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.219 1.02.684 1.11 1.226l.082.499c.583.39 1.18.636 1.696.883.441.29.9.524 1.38.678.481.153.99.153 1.47 0 .48-.153.94-.388 1.38-.678a11.95 11.95 0 001.696-.883l.082-.499c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.219 1.02.684 1.11 1.226l.082.499c.583.39 1.18.636 1.696.883.441.29.9.524 1.38.678.481.153.99.153 1.47 0 .48-.153.94-.388 1.38-.678a11.95 11.95 0 001.696-.883l.082-.499A1.875 1.875 0 0019.5 2.25c-.552 0-1.076.224-1.465.585l-.082.499a11.95 11.95 0 01-1.696.883 1.875 1.875 0 01-1.38.678c-.481.153-.99.153-1.47 0a1.875 1.875 0 01-1.38-.678 11.95 11.95 0 01-1.696-.883l-.082-.499A1.875 1.875 0 009.594 3.94zM4.5 13.5a8.955 8.955 0 011.586-5.043 1.875 1.875 0 011.38-.678c.481-.153.99-.153 1.47 0 .441.29.9.524 1.38.678.583.39 1.18.636 1.696.883l.082.499c.09.542.56 1.007 1.11 1.226.55.22 1.156.22 1.706 0 .55-.219 1.02-.684 1.11-1.226l.082-.499a11.95 11.95 0 011.696-.883c.441.29.9.524 1.38.678.481.153.99.153 1.47 0 .48-.153.94-.388 1.38-.678a11.95 11.95 0 001.696-.883l.082-.499c.09-.542.56-1.007 1.11-1.226.55-.22 1.156-.22 1.706 0 .55.219 1.02.684 1.11 1.226l.082.499c.583.39 1.18.636 1.696.883.441.29.9.524 1.38.678.481.153.99.153 1.47 0 .48-.153.94-.388 1.38-.678a11.95 11.95 0 001.696-.883l.082-.499A1.875 1.875 0 0019.5 6.75c-.552 0-1.076.224-1.465.585l-.082.499a11.95 11.95 0 01-1.696.883 1.875 1.875 0 01-1.38.678c-.481.153-.99.153-1.47 0a1.875 1.875 0 01-1.38-.678 11.95 11.95 0 01-1.696-.883l-.082-.499a1.875 1.875 0 00-1.465-.585c-.552 0-1.076.224-1.465.585l-.082.499a11.95 11.95 0 01-1.696.883 1.875 1.875 0 01-1.38.678c-.481.153-.99.153-1.47 0a1.875 1.875 0 01-1.38-.678 11.95 11.95 0 01-1.696-.883l-.082-.499A1.875 1.875 0 004.5 6.75c-.552 0-1.076.224-1.465.585l-.082.499a11.95 11.95 0 00-1.696.883 1.875 1.875 0 00-1.38.678c-.481.153-.99.153-1.47 0a1.875 1.875 0 00-1.38-.678 11.95 11.95 0 00-1.696-.883l-.082-.499A1.875 1.875 0 000 6.75c0 .799.478 1.496 1.185 1.775l.082.499a11.95 11.95 0 011.696.883c.441.29.9.524 1.38.678.481.153.99.153 1.47 0 .48-.153.94-.388 1.38-.678a11.95 11.95 0 001.696-.883l.082-.499A1.875 1.875 0 004.5 13.5z" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.696L7.985 5.644m0 0l-3.182 3.182m3.182-3.182v4.992" />
    </svg>
);
