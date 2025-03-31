// /components/Loading.tsx

import React from 'react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background dark:bg-dark-background">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-muted/30"></div>
          <div className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin"></div>
        </div>
        <p className="mt-4 text-foreground dark:text-dark-foreground font-heading">{message}</p>
      </div>
    </div>
  );
};