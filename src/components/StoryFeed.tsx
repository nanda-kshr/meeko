import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import { MOCK_STORIES } from '@/utils/mockData';

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
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [deltaX, setDeltaX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setDeltaX(0);
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startX || !startY || !cardRef.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const newDeltaX = currentX - startX;
    const deltaY = currentY - startY;

    const isHorizontal = Math.abs(newDeltaX) > Math.abs(deltaY) && Math.abs(newDeltaX) > 10;

    if (isHorizontal) {
      e.preventDefault();
      setIsSwiping(true);
      setDeltaX(newDeltaX);
      cardRef.current.style.transition = 'none';
      cardRef.current.style.transform = `translateX(${newDeltaX}px) rotate(${newDeltaX / 20}deg)`;
    }
  }, [startX, startY]);

  const handleTouchEnd = useCallback(() => {
    if (!cardRef.current || !startX) {
      resetCard();
      return;
    }

    const screenWidth = window.innerWidth;
    const swipeThreshold = screenWidth * 0.25;

    if (isSwiping && Math.abs(deltaX) > swipeThreshold) {
      const direction = deltaX > 0 ? 'right' : 'left';
      swipeCardAway(direction);
    } else {
      resetCard();
    }

    setStartX(null);
    setStartY(null);
    setIsSwiping(false);
    setDeltaX(0);
  }, [deltaX, startX, isSwiping]);

  const swipeCardAway = (direction: 'left' | 'right') => {
    if (!cardRef.current) return;

    const screenWidth = window.innerWidth;
    const targetX = direction === 'left' ? -screenWidth * 1.5 : screenWidth * 1.5;

    cardRef.current.style.transition = 'transform 0.3s ease-out';
    cardRef.current.style.transform = `translateX(${targetX}px) rotate(${targetX / 20}deg)`;

    setTimeout(() => {
      setCurrentStoryIndex(prev => (prev + 1) % MOCK_STORIES.length);
      resetCard();
    }, 300);
  };

  const resetCard = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.3s ease-out';
      cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
    }
  };

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isSwiping) {
        e.preventDefault();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('touchmove', preventScroll);
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

  const handleOpenComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(true);
  };

  const currentStory = MOCK_STORIES[currentStoryIndex];
  const isLiked = likedStories.includes(currentStory.id);
  const isSaved = savedStories.includes(currentStory.id);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden bg-white h-screen w-screen select-none"
    >
      <div 
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full max-w-md md:max-w-4xl mx-4 will-change-transform"
        style={{ transform: 'translateX(0) rotate(0deg)' }}
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col md:flex-row">
          {/* Changed md:w-3/4 to w-full */}
          <div className="w-full p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
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

            <div 
              ref={contentRef}
              className="flex-grow overflow-y-auto max-h-[50vh] pr-2 -mr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
            >
              <div className="text-lg text-gray-800 font-normal">
                {currentStory.content}
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-6 flex-shrink-0">
              <button 
                onClick={() => swipeCardAway('left')}
                className="bg-red-100 text-red-500 p-3 rounded-full shadow-md"
              >
                <ThumbsDown size={24} />
              </button>
              
              <div className="hidden md:flex items-center space-x-4">
                <button 
                  onClick={handleLikeStory}
                  className={`p-3 rounded-full shadow-md ${
                    isLiked 
                      ? 'bg-red-100 text-red-500' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                
                <button 
                  onClick={handleOpenComments}
                  className="bg-gray-100 text-gray-500 p-3 rounded-full shadow-md hover:bg-gray-200"
                >
                  <MessageCircle size={24} />
                </button>
                
                <button 
                  onClick={handleSaveStory}
                  className={`p-3 rounded-full shadow-md ${
                    isSaved 
                      ? 'bg-blue-100 text-blue-500' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark size={24} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <button 
                onClick={() => swipeCardAway('right')}
                className="bg-green-100 text-green-500 p-3 rounded-full shadow-md"
              >
                <ThumbsUp size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryFeed;