"use client";
import React, { useState } from 'react';
import { Loading } from '@/components/Loading'; 

interface StoryActionsProps {
  handleSaveStory: (e: React.MouseEvent) => void;
  handleUnsaveStory: (e: React.MouseEvent) => void;
  isSaving?: boolean; 
}

export const StoryActions: React.FC<StoryActionsProps> = ({
  handleSaveStory,
  handleUnsaveStory,
  isSaving = false,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isSaving) return; 
    if (isSaved) {
      handleUnsaveStory(e);
    } else {
      handleSaveStory(e);
    }
    setIsSaved(!isSaved);
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleClick}
        disabled={isSaving}
        className={`p-2 flex items-center space-x-1 ${
          isSaved ? 'text-blue-500' : 'text-gray-500'
        } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-700'}`}
      >
        {isSaving ? (
          <Loading />
        ) : (
          <span>{isSaved ? 'Unsave' : 'Save'}</span>
        )}
      </button>
    </div>
  );
};