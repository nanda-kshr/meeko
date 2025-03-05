// components/MeekoApp.tsx
"use client";
import { useState } from 'react';
import StoryFeed from './StoryFeed';
import PostPage from './PostPage';
import InboxPage from './InboxPage';
import SavedPage from './SavedPage';
import CommentsPage from './CommentsPage';
import Conversation from './Conversation';
import { Navigation } from './Navigation';
import { Message, Page } from '@/types/types';

export function MeekoApp() {
  const [currentPage, setCurrentPage] = useState<Page>('fyp');
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [savedStories, setSavedStories] = useState<number[]>([2]);
  const [likedStories, setLikedStories] = useState<number[]>([1]);
  const [showComments, setShowComments] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [storyContent, setStoryContent] = useState('');

  // Page router
  const renderPageContent = () => {
    if (showComments) return (
      <CommentsPage 
        currentStoryIndex={currentStoryIndex} 
        setShowComments={setShowComments}
        onClose={() => setShowComments(false)} 
      />
    );
    
    if (currentMessage) return (
      <Conversation 
        message={currentMessage} 
        setCurrentMessage={setCurrentMessage}
        onClose={() => setCurrentMessage(null)} 
      />
    );
    
    switch (currentPage) {
      case 'fyp':
      case 'following':
        return (
          <StoryFeed 
            currentStoryIndex={currentStoryIndex}
            setCurrentStoryIndex={setCurrentStoryIndex}
            likedStories={likedStories}
            setLikedStories={setLikedStories}
            savedStories={savedStories}
            setSavedStories={setSavedStories}
            setShowComments={setShowComments}
          />
        );
      case 'post':
        return (
          <PostPage 
            storyContent={storyContent}
            setStoryContent={setStoryContent}
            setCurrentPage={setCurrentPage}
            onBack={() => setCurrentPage('fyp')}
            onPost={() => {
              if (storyContent.trim()) {
                alert("Story posted successfully!");
                setStoryContent('');
                setCurrentPage('fyp');
              }
            }}
          />
        );
      case 'inbox':
        return <InboxPage setCurrentMessage={setCurrentMessage} />;
      case 'saved':
        return (
          <SavedPage 
            savedStories={savedStories}
            setSavedStories={setSavedStories}
          />
        );
      default:
        return <StoryFeed 
          currentStoryIndex={currentStoryIndex}
          setCurrentStoryIndex={setCurrentStoryIndex}
          likedStories={likedStories}
          setLikedStories={setLikedStories}
          savedStories={savedStories}
          setSavedStories={setSavedStories}
          setShowComments={setShowComments}
        />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      {renderPageContent()}
      
      {!showComments && !currentMessage && (
        <Navigation 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}