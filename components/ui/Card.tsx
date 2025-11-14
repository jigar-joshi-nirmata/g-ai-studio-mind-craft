
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseClasses = "bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all duration-300";
  const hoverClasses = onClick ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer" : "";
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
