import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import { MOCK_STORIES } from '@/utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryFeedProps {
  currentStoryIndex: number;
  setCurrentStoryIndex: (index: number) => void;
  savedStories: number[];
  setSavedStories: (stories: number[]) => void;
  likedStories: number[];
  setLikedStories: (stories: number[]) => void;
  setShowComments: (show: boolean) => void;
}

const StoryFeed: React.FC<StoryFeedProps> = ({
  currentStoryIndex,
  setCurrentStoryIndex,
  savedStories,
  setSavedStories,
  likedStories,
  setLikedStories,
  setShowComments
}) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchMove, setTouchMove] = useState<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchMove(null);
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const touchMove = { x: touch.clientX, y: touch.clientY };
    const deltaX = touchMove.x - touchStart.x;
    const deltaY = touchMove.y - touchStart.y;

    // Determine if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      setIsSwiping(true);
      setTouchMove(touchMove);
      
      if (cardRef.current) {
        cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 20}deg)`;
        cardRef.current.style.transition = 'none';
      }
    }
  }, [touchStart]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchMove) {
      resetPosition();
      return;
    }

    const deltaX = touchMove.x - touchStart.x;
    const screenWidth = window.innerWidth;
    const swipeThreshold = screenWidth * 0.3;

    if (Math.abs(deltaX) > swipeThreshold) {
      // Swipe completed
      if (deltaX > 0) {
        swipeRight();
      } else {
        swipeLeft();
      }
    } else {
      // Snap back
      resetPosition();
    }

    setTouchStart(null);
    setTouchMove(null);
    setIsSwiping(false);
  }, [touchStart, touchMove]);

  const resetPosition = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0) rotate(0)';
      cardRef.current.style.transition = 'transform 0.3s ease';
    }
  };

  const swipeLeft = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(-100%) rotate(-10deg)';
      cardRef.current.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        setCurrentStoryIndex((prev) => (prev + 1) % MOCK_STORIES.length);
        resetPosition();
      }, 300);
    }
  };

  const swipeRight = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(100%) rotate(10deg)';
      cardRef.current.style.transition = 'transform 0.3s ease';
      
      setTimeout(() => {
        setCurrentStoryIndex((prev) => (prev + 1) % MOCK_STORIES.length);
        resetPosition();
      }, 300);
    }
  };

  // Prevent default touch behavior to stop scrolling
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isSwiping) {
        e.preventDefault();
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('touchmove', preventScroll);
      }
    };
  }, [isSwiping]);

  const handleLikeStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = MOCK_STORIES[currentStoryIndex].id;
    setLikedStories(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSaveStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = MOCK_STORIES[currentStoryIndex].id;
    setSavedStories(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const currentStory = MOCK_STORIES[currentStoryIndex];
  const isLiked = likedStories.includes(currentStory.id);
  const isSaved = savedStories.includes(currentStory.id);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden bg-white h-screen w-screen touch-none select-none"
    >
      <div 
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="absolute inset-0 m-4 flex items-center justify-center"
      >
        <div className="w-full 
          max-w-md 
          md:max-w-4xl 
          mx-auto 
          bg-white 
          rounded-xl 
          shadow-lg 
          border 
          border-gray-200 
          overflow-hidden
          flex 
          flex-col 
          md:flex-row"
        >
          {/* Story Content Container */}
          <div className="w-full md:w-3/4 p-6">
            {/* Story Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">@{currentStory.author}</div>
                  <div className="text-xs text-gray-500">{currentStory.timestamp}</div>
                </div>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Story Content */}
            <div className="text-lg text-gray-800 font-normal">
              {currentStory.content}
            </div>

            {/* Mobile Action Buttons - Visible only on mobile */}
            <div className="md:hidden flex justify-center space-x-4 mt-6">
              <button 
                onClick={swipeLeft}
                className="bg-red-100 text-red-500 p-3 rounded-full shadow-md"
              >
                <ThumbsDown size={24} />
              </button>
              
              <button 
                onClick={swipeRight}
                className="bg-green-100 text-green-500 p-3 rounded-full shadow-md"
              >
                <ThumbsUp size={24} />
              </button>
            </div>
          </div>

          {/* Side Action Buttons - Desktop Layout */}
          <div className="hidden md:flex md:w-1/4 flex-col justify-center space-y-4 border-l border-gray-100 p-4">
            <button 
              onClick={handleLikeStory} 
              className={`flex flex-col items-center ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
                <Heart fill={isLiked ? "currentColor" : "none"} size={24} strokeWidth={2} />
              </div>
              <span className="text-xs mt-2 text-gray-700">{currentStory.likes}</span>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); setShowComments(true); }} 
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
                <MessageCircle size={24} strokeWidth={2} className="text-gray-500" />
              </div>
              <span className="text-xs mt-2 text-gray-700">{currentStory.comments}</span>
            </button>

            <button 
              onClick={handleSaveStory} 
              className={`flex flex-col items-center ${isSaved ? 'text-blue-500' : 'text-gray-500'}`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
                <Bookmark fill={isSaved ? "currentColor" : "none"} size={24} strokeWidth={2} />
              </div>
              <span className="text-xs mt-2 text-gray-700">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Side Action Buttons */}
      <div className="md:hidden absolute right-4 top-1/3 flex flex-col space-y-4">
        <button 
          onClick={handleLikeStory} 
          className={`flex flex-col items-center ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
            <Heart fill={isLiked ? "currentColor" : "none"} size={24} strokeWidth={2} />
          </div>
          <span className="text-xs mt-2 text-gray-700">{currentStory.likes}</span>
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); setShowComments(true); }} 
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
            <MessageCircle size={24} strokeWidth={2} className="text-gray-500" />
          </div>
          <span className="text-xs mt-2 text-gray-700">{currentStory.comments}</span>
        </button>

        <button 
          onClick={handleSaveStory} 
          className={`flex flex-col items-center ${isSaved ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
            <Bookmark fill={isSaved ? "currentColor" : "none"} size={24} strokeWidth={2} />
          </div>
          <span className="text-xs mt-2 text-gray-700">Save</span>
        </button>
      </div>
    </div>
  );
};

export default StoryFeed;