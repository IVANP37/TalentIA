
import React from 'react';

const LoadingSpinner = ({ size = 'md', text }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-16 h-16 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-indigo-600 border-t-transparent`}></div>
            {text && <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;