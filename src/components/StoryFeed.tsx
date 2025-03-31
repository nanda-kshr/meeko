"use client";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StoryHeader } from './StoryHeader';
import { StoryContent } from './StoryContent';
import { StoryActions } from './StoryActions';
import { SwipeButtons } from './SwipeButtons';
import { getAuth } from 'firebase/auth';
import type { Story } from '@/lib/types';

interface StoryFeedProps {
  stories: Story[];
  currentStoryIndex: number;
  setCurrentStoryIndex: (index: number) => void;
}

export const StoryFeed: React.FC<StoryFeedProps> = ({
  stories,
  currentStoryIndex,
  setCurrentStoryIndex,
}) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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
    if (direction === 'right') { handleLikeStory(); }
    cardRef.current.style.transition = 'transform 0.3s ease-out';
    cardRef.current.style.transform = `translateX(${targetX}px) rotate(${targetX / 20}deg)`;

    setTimeout(() => {
      setCurrentStoryIndex((currentStoryIndex + 1) % stories.length);
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

  const handleSaveStory = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsSaving(true);
    const id = stories[currentStoryIndex].id;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const idToken = await user.getIdToken();

      const response = await fetch(`/api/v1/stories/${id}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to save story:", data.error);
        return;
      }
    } catch (error) {
      console.error("Error saving story:", error);
    }
    finally{
      setIsSaving(false);
    }
  };


  const handleUnsaveStory = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = stories[currentStoryIndex].id;

    setIsSaving(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const idToken = await user.getIdToken();

      const response = await fetch(`/api/v1/stories/${id}/unsave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to save story:", data.error);
        return;
      }
    } catch (error) {
      console.error("Error saving story:", error);
    }
    finally{
      setIsSaving(false);
    }
  };

  const handleUnlikeStory = async () => {
    const id = stories[currentStoryIndex].id;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const idToken = await user.getIdToken();

      const response = await fetch(`/api/v1/stories/${id}/dislike`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to toggle like:", data.error);
        return;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleLikeStory = async () => {
    const id = stories[currentStoryIndex].id;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }
      const idToken = await user.getIdToken();

      const response = await fetch(`/api/v1/stories/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to toggle like:", data.error);
        return;
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (!isClient || stories.length === 0) {
    return null;
  }

  const currentStory = stories[currentStoryIndex];

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
            <StoryHeader
              author={currentStory.author.name || 'Anonymous'}
              title={currentStory.title}
              genre={currentStory.genre}
            />
            <StoryContent content={currentStory.content} />
            <div className="flex justify-center space-x-4 mt-6 flex-shrink-0">
              <SwipeButtons 
                swipeCardAway={swipeCardAway}
                handleLikeStory={handleLikeStory} 
                handleUnlikeStory={handleUnlikeStory}
              />
              <StoryActions 
                handleSaveStory={handleSaveStory} 
                handleUnsaveStory={handleUnsaveStory}
                isSaving={isSaving}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};