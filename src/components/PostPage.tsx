// src/components/PostPage.tsx
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Page } from '@/types/types';
import { useTheme } from '../context/ThemeContext';

interface PostPageProps {
  storyContent: string;
  setStoryContent: (content: string) => void;
  setCurrentPage: Dispatch<SetStateAction<Page>>;
  onPost: () => void;
}

const PostPage: React.FC<PostPageProps> = ({
  storyContent,
  setStoryContent,
  setCurrentPage,
  onPost
}) => {
  const { theme } = useTheme();
  const [characterCount, setCharacterCount] = useState(0);
  const MAX_CHARACTERS = 500;

  const handlePostStory = () => {
    if (storyContent.trim()) {
      onPost();
      setStoryContent('');
      setCurrentPage('fyp');
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setStoryContent(content);
    setCharacterCount(content.length);
  };

  // Theme-specific styles
  const themeStyles = {
    light: {
      container: 'bg-gray-100 text-gray-900',
      header: 'text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500',
      textarea: 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-300 placeholder-gray-500',
      glow: 'from-blue-400 to-teal-400',
      button: 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600',
      counter: 'text-gray-600',
      counterWarning: 'text-red-500'
    },
    dark: {
      container: 'bg-gray-900 text-white',
      header: 'text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600',
      textarea: 'bg-gray-800 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-400 placeholder-gray-400',
      glow: 'from-purple-500 to-blue-500',
      button: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
      counter: 'text-gray-300',
      counterWarning: 'text-pink-500'
    },
    creative: {
      container: 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white',
      header: 'text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600',
      textarea: 'bg-gray-800 bg-opacity-80 text-white border-purple-500 focus:border-pink-500 focus:ring-pink-400 placeholder-gray-400',
      glow: 'from-purple-500 to-pink-500',
      button: 'bg-gradient-to-r from-pink-600 to-red-600 text-white hover:from-pink-700 hover:to-red-700',
      counter: 'text-gray-300',
      counterWarning: 'text-pink-500'
    }
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`container mx-auto px-6 py-10 max-w-3xl rounded-xl shadow-2xl ${currentTheme.container}`}>
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentPage('fyp')}
          className={`mr-6 ${theme === 'light' ? 'text-gray-700 hover:text-blue-500' : 'text-white hover:text-purple-300'} transition-all duration-300 transform hover:scale-125 hover:rotate-12`}
        >
          <ArrowLeft size={30} strokeWidth={2} />
        </button>
        <h1 className={`text-4xl font-bold drop-shadow-lg ${currentTheme.header}`}>
          Unleash Your Story
        </h1>
      </div>

      {/* Story Content Textarea */}
      <div className="mb-8 relative group">
        <textarea
          className={`
            w-full h-96 p-6 rounded-xl ${currentTheme.textarea} 
            focus:ring-4 focus:ring-opacity-50 outline-none transition-all duration-500 
            resize-none text-lg placeholder-opacity-70 shadow-lg hover:shadow-xl
            ${theme === 'creative' ? 'hover:bg-opacity-90' : ''}
          `}
          placeholder="Drop your epic tale here..."
          value={storyContent}
          maxLength={MAX_CHARACTERS}
          onChange={handleContentChange}
        ></textarea>
        {/* Glowing Effect (Creative theme only) */}
        {theme === 'creative' && (
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${currentTheme.glow} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl -z-10`}></div>
        )}
        {/* Character Counter */}
        <div className={`flex justify-end mt-3 text-sm font-mono ${currentTheme.counter}`}>
          <span
            className={`transition-all duration-300 ${characterCount > MAX_CHARACTERS * 0.9 ? `${currentTheme.counterWarning} font-bold scale-105` : ''}`}
          >
            {characterCount} / {MAX_CHARACTERS}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handlePostStory}
          disabled={!storyContent.trim()}
          className={`
            flex items-center ${currentTheme.button} 
            px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform
            ${!storyContent.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl'}
          `}
        >
          <Send size={22} className="mr-3" strokeWidth={2} />
          Launch Story
        </button>
      </div>
    </div>
  );
};

export default PostPage;