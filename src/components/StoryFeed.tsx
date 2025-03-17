"use client";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StoryHeader } from './StoryHeader';
import { StoryContent } from './StoryContent';
import { StoryActions } from './StoryActions';
import { SwipeButtons } from './SwipeButtons';

interface Story {
  id: number;
  author: {
    id: string;
    name: string;
  };
  content: string;
  timestamp: string;
}

interface StoryFeedProps {
  stories: Story[];
  currentStoryIndex: number;
  setCurrentStoryIndex: (index: number) => void;
  savedStories: number[];
  setSavedStories: (stories: number[]) => void;
  likedStories: number[];
  setLikedStories: (stories: number[]) => void;
  followedUsers: string[];
  setFollowedUsers: (userId: string) => void;  // Changed to handle a single user ID
  setShowComments: (show: boolean) => void;
}

export const StoryFeed: React.FC<StoryFeedProps> = ({
  stories,
  currentStoryIndex,
  setCurrentStoryIndex,
  savedStories,
  setSavedStories,
  likedStories,
  setLikedStories,
  followedUsers = [],
  setFollowedUsers,
  setShowComments,
}) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [deltaX, setDeltaX] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isClient) return;
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setDeltaX(0);
    setIsSwiping(false);
  }, [isClient]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isClient || !startX || !startY || !cardRef.current) return;

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
  }, [startX, startY, isClient]);

  const handleTouchEnd = useCallback(() => {
    if (!isClient || !cardRef.current || !startX) {
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
  }, [deltaX, startX, isSwiping, isClient]);

  const swipeCardAway = (direction: 'left' | 'right') => {
    if (!cardRef.current) return;

    const screenWidth = window.innerWidth;
    const targetX = direction === 'left' ? -screenWidth * 1.5 : screenWidth * 1.5;

    cardRef.current.style.transition = 'transform 0.3s ease-out';
    cardRef.current.style.transform = `translateX(${targetX}px) rotate(${targetX / 20}deg)`;

    setTimeout(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
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
    if (!isClient) return;
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
  }, [isSwiping, isClient]);

  const handleLikeStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = stories[currentStoryIndex].id;
    setLikedStories((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleSaveStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = stories[currentStoryIndex].id;
    setSavedStories((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleFollowUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    const authorId = stories[currentStoryIndex].author.id;
    setFollowedUsers(authorId); // Call with the single user ID
  };

  const handleOpenComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(true);
  };

  if (!isClient || stories.length === 0) {
    return null;
  }

  const currentStory = stories[currentStoryIndex];
  const isLiked = likedStories.includes(currentStory.id);
  const isSaved = savedStories.includes(currentStory.id);
  const isFollowing = followedUsers.includes(currentStory.author.id);

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
          <div className="w-full p-6 flex flex-col">
            <StoryHeader author={currentStory.author} timestamp={currentStory.timestamp} />
            <StoryContent content={currentStory.content} />
            <div className="flex justify-center space-x-4 mt-6 flex-shrink-0">
              <SwipeButtons swipeCardAway={swipeCardAway} />
              <StoryActions
                isLiked={isLiked}
                isSaved={isSaved}
                isFollowing={isFollowing}
                handleLikeStory={handleLikeStory}
                handleSaveStory={handleSaveStory}
                handleFollowUser={handleFollowUser}
                handleOpenComments={handleOpenComments}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};