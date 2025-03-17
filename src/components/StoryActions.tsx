"use client";
import React from 'react';

interface StoryActionsProps {
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean; // Add isFollowing prop
  handleLikeStory: (e: React.MouseEvent) => void;
  handleSaveStory: (e: React.MouseEvent) => void;
  handleFollowUser: (e: React.MouseEvent) => void; // Add follow handler
  handleOpenComments: (e: React.MouseEvent) => void;
}

export const StoryActions: React.FC<StoryActionsProps> = ({
  isLiked,
  isSaved,
  isFollowing,
  handleLikeStory,
  handleSaveStory,
  handleFollowUser,
  handleOpenComments,
}) => {
  return (
    <div className="flex space-x-4">
      <button onClick={handleLikeStory} className={`p-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
        {isLiked ? 'Unlike' : 'Like'}
      </button>
      <button onClick={handleSaveStory} className={`p-2 ${isSaved ? 'text-blue-500' : 'text-gray-500'}`}>
        {isSaved ? 'Unsave' : 'Save'}
      </button>
      <button onClick={handleFollowUser} className={`p-2 ${isFollowing ? 'text-green-500' : 'text-gray-500'}`}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      <button onClick={handleOpenComments} className="p-2 text-gray-500">
        Comments
      </button>
    </div>
  );
};