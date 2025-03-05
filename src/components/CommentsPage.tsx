import React from 'react';
import { X, Send } from 'lucide-react';
import { MOCK_COMMENTS, MOCK_STORIES } from '@/utils/mockData';

interface CommentsPageProps {
  currentStoryIndex: number;
  onClose: () => void;
  setShowComments: (show: boolean) => void;
}

const CommentsPage: React.FC<CommentsPageProps> = ({ currentStoryIndex, setShowComments }) => {
  const currentStory = MOCK_STORIES[currentStoryIndex];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <button onClick={() => setShowComments(false)} className="mr-3">
          <X size={20} />
        </button>
        <h2 className="font-semibold">Comments ({currentStory.comments})</h2>
      </div>
      <div className="p-4 bg-gray-800 rounded-lg mx-4 my-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-400">@{currentStory.author}</div>
          <div className="text-xs text-gray-500">{currentStory.timestamp}</div>
        </div>
        <p className="text-sm line-clamp-2">{currentStory.content}</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {MOCK_COMMENTS.map(comment => (
          <div key={comment.id} className="flex mb-4">
            <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full mr-3" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">{comment.user}</h3>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <button className="mr-4">Like</button>
                <button>Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white focus:outline-none"
            placeholder="Add a comment..."
          />
          <button className="ml-2 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;