'use client';

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'; // Small, medium, large spinner sizes
  variant?: 'page' | 'inline'; // Full-page loader or inline (e.g., for buttons)
  message?: string; // Optional loading message
  className?: string; // Additional custom classes
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'page',
  message,
  className = '',
}) => {
  // Spinner size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  // Base spinner classes
  const spinnerClasses = `animate-spin rounded-full border-t-transparent border-solid border-gray-600 ${sizeClasses[size]} ${className}`;

  // Container classes based on variant
  const containerClasses = variant === 'page'
    ? 'flex flex-col items-center justify-center min-h-screen text-gray-800'
    : 'flex items-center space-x-2';

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}></div>
      {message && (
        <p className={`mt-2 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {message}
        </p>
      )}
    </div>
  );
};