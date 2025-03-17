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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Saved Stories</h1>
      </div>
      
      {savedStoriesList.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <Bookmark size={64} className="text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            No Saved Stories
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Stories you save will appear here. Start exploring and save the ones that inspire you.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {savedStoriesList.map(story => (
            <div 
              key={story.id} 
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 mr-2">@{story.author}</span>
                  <span className="text-xs text-gray-400">{story.timestamp}</span>
                </div>
                <button 
                  onClick={(e) => handleSaveStory(e, story.id)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Bookmark size={20} fill="currentColor" />
                </button>
              </div>
              
              <p className="text-gray-800 mb-4 line-clamp-3">
                {story.content}
              </p>
              
              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-500">
                    <Heart size={18} className="mr-2" />
                    <span className="text-sm">{story.likes}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MessageCircle size={18} className="mr-2" />
                    <span className="text-sm">{story.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;