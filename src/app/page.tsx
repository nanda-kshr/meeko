"use client";
import React, { useState } from 'react';
import { Globe, Users, Plus, Mail, BookOpen, Settings } from 'lucide-react'; // Add Settings icon
import StoryFeed from '@/components/StoryFeed';
import PostPage from '@/components/PostPage';
import InboxPage from '@/components/InboxPage';
import Conversation from '@/components/Conversation';
import SavedPage from '@/components/SavedPage';
import CommentsPage from '@/components/CommentsPage';
import SettingsPage from '@/components/SettingsPage'; // Import SettingsPage
import { Message, Page } from '@/types/types';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { ThemeProvider } from '@/context/ThemeContext';

const MeekoApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('following');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [savedStories, setSavedStories] = useState<number[]>([2]);
  const [likedStories, setLikedStories] = useState<number[]>([1]);
  const [storyContent, setStoryContent] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

  const renderPageContent = () => {
    if (showComments) return <CommentsPage currentStoryIndex={currentStoryIndex} setShowComments={setShowComments} onClose={() => setShowComments(false)} />;
    if (currentMessage) return <Conversation message={currentMessage} setCurrentMessage={setCurrentMessage} onClose={() => setCurrentMessage(null)} />;
    
    switch (currentPage) {
      case 'fyp':
      case 'following':
        return (
          <StoryFeed 
            currentStoryIndex={currentStoryIndex}
            setCurrentStoryIndex={setCurrentStoryIndex}
            savedStories={savedStories}
            setSavedStories={setSavedStories}
            likedStories={likedStories}
            setLikedStories={setLikedStories}
            setShowComments={setShowComments}
          />
        );
      case 'signin': 
        return <SignInPage setCurrentPage={setCurrentPage} />;
      case 'signup': 
        return <SignUpPage setCurrentPage={setCurrentPage} />;
      case 'post':
        return (
          <PostPage 
            storyContent={storyContent} 
            setStoryContent={setStoryContent} 
            setCurrentPage={setCurrentPage} 
            onBack={() => setCurrentPage('fyp')} 
            onPost={() => setCurrentPage('fyp')}
          />
        );
      case 'inbox':
        return <InboxPage setCurrentMessage={setCurrentMessage} setCurrentPage={setCurrentPage}/>;
      case 'saved':
        return <SavedPage savedStories={savedStories} setSavedStories={setSavedStories} />;
      case 'settings': // Add settings case
        return <SettingsPage setCurrentPage={setCurrentPage} />;
      default:
        return (
          <StoryFeed 
            currentStoryIndex={currentStoryIndex}
            setCurrentStoryIndex={setCurrentStoryIndex}
            savedStories={savedStories}
            setSavedStories={setSavedStories}
            likedStories={likedStories}
            setLikedStories={setLikedStories}
            setShowComments={setShowComments}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      {/* Main content area with scrolling */}
      <ThemeProvider>
        <div className="flex-grow overflow-auto pb-20">
          {renderPageContent()}
        </div>
      </ThemeProvider>
      {!showComments && !currentMessage && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-3 px-2 z-50">
          <div className="flex items-center justify-around relative">
            <button 
              onClick={() => setCurrentPage('following')} 
              className={`flex flex-col items-center ${currentPage === 'following' ? 'text-white' : 'text-gray-500'}`}
            >
              <Users size={24} />
              <span className="text-xs mt-1">Following</span>
            </button>
            <button 
              onClick={() => setCurrentPage('fyp')} 
              className={`flex flex-col items-center ${currentPage === 'fyp' ? 'text-white' : 'text-gray-500'}`}
            >
              <Globe size={24} />
              <span className="text-xs mt-1">FYP</span>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 -top-8">
              <button 
                onClick={() => setCurrentPage('post')} 
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border-4 border-gray-900"
              >
                <Plus size={32} className="text-white" />
              </button>
            </div>
            <button 
              onClick={() => setCurrentPage('inbox')} 
              className={`flex flex-col items-center ${currentPage === 'inbox' ? 'text-white' : 'text-gray-500'}`}
            >
              <Mail size={24} />
              <span className="text-xs mt-1">Inbox</span>
            </button>
            <button 
              onClick={() => setCurrentPage('saved')} 
              className={`flex flex-col items-center ${currentPage === 'saved' ? 'text-white' : 'text-gray-500'}`}
            >
              <BookOpen size={24} />
              <span className="text-xs mt-1">Saved</span>
            </button>
            <button 
              
              className={`flex flex-col items-center ${currentPage === 'settings' ? 'text-white' : 'text-gray-500'}`}
            >
              <Settings size={24} /> {/* Add Settings icon */}
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeekoApp;