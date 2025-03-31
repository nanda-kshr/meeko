"use client";
import React from 'react';

interface StoryActionsProps {
  handleSaveStory: (e: React.MouseEvent) => void;
}

export const StoryActions: React.FC<StoryActionsProps> = ({
  handleSaveStory,
}) => {
  let isSaved = false;

  return (
    <div className="flex space-x-4">
      <button onClick={(e)=>{handleSaveStory(e); isSaved = !isSaved;}} className={`p-2 ${isSaved ? 'text-blue-500' : 'text-gray-500'}`}>
        {isSaved ? 'Unsave' : 'Save'}
      </button>
    </div>
  );
};