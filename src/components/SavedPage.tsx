import React from 'react';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { MOCK_STORIES } from '@/utils/mockData';

interface SavedPageProps {
  savedStories: number[];
  setSavedStories: (stories: number[]) => void;
}

const SavedPage: React.FC<SavedPageProps> = ({ savedStories, setSavedStories }) => {
  const savedStoriesList = MOCK_STORIES.filter(story => savedStories.includes(story.id));
  
  const handleSaveStory = (e: React.MouseEvent, storyId: number) => {
    e.stopPropagation();
    setSavedStories(prev => prev.filter(s => s !== storyId));
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Saved Stories</h1>
      </div>
      {savedStoriesList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Bookmark size={48} className="text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved stories yet</h3>
          <p className="text-gray-500 max-w-xs">
            When you save stories, they'll appear here for you to read later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedStoriesList.map(story => (
            <div key={story.id} className="bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400">@{story.author}</div>
                <div className="text-xs text-gray-500">{story.timestamp}</div>
              </div>
              <p className="text-sm mb-3 line-clamp-3">{story.content}</p>
              <div className="flex justify-between">
                <div className="flex items-center text-gray-400 text-sm">
                  <Heart size={16} className="mr-1" />
                  <span className="mr-3">{story.likes}</span>
                  <MessageCircle size={16} className="mr-1" />
                  <span>{story.comments}</span>
                </div>
                <button 
                  onClick={(e) => handleSaveStory(e, story.id)}
                  className="text-blue-400"
                >
                  <Bookmark size={18} fill="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;