
import React from 'react';

const Spinner: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
    <div className={`animate-spin rounded-full border-4 border-t-primary-500 border-slate-200 dark:border-slate-700 ${className}`} role="status">
        <span className="sr-only">Loading...</span>
    </div>
);

export default Spinner;
