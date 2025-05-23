"use client";
import React, { useState, useEffect } from 'react';
import StoryCard from './StoryCard';
import StoryModal from './StoryModal';
import { motion } from 'framer-motion';
import { getAuth } from 'firebase/auth';

// Define Story type
export interface Story {
  id: string;
  title: string;
  content: string;
  genre: string;
  author: {
    id: string;
    name: string;
  };
  timestamp: string;
  likeCount?: number;
}

export default function StoriesList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch my stories
  const fetchMyStories = async (append = false) => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();
      const endpoint = `/api/v1/stories?mode=mine&limit=20${cursor ? `&cursor=${cursor}` : ''}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stories: ${response.status}`);
      }

      const data = await response.json();
      const newStories = data.stories || [];
      setStories((prev) => (append ? [...prev, ...newStories] : newStories));
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
      setError(null);
    } catch (err) {
      console.error('Error fetching my stories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load your stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStories();
  }, []);

  // Open story modal
  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
  };

  // Close story modal
  const handleCloseModal = () => {
    setSelectedStory(null);
  };

  // Loading state
  if (loading && !stories.length) {
    return (
      <div className="flex justify-center items-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-10 h-10 border-4 border-t-transparent border-black rounded-full"
        />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-black mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black rounded-lg hover:bg-gray-800 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (stories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">You haven&apos;t posted any stories yet</p>
        <button
          onClick={() => window.location.href = '/post'}
          className="px-4 py-2 bg-black rounded-lg hover:bg-gray-800 text-white"
        >
          Create Your First Story
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold mb-6">My Stories</h2>

      {/* List of stories */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onClick={() => handleStoryClick(story)}
          />
        ))}
      </motion.div>

      {/* Load More button */}
      {hasMore && !loading && (
        <div className="text-center py-4">
          <button
            onClick={() => fetchMyStories(true)}
            className="px-4 py-2 bg-black rounded-lg hover:bg-gray-800 text-white"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && (
        <div className="text-center py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-8 h-8 border-4 border-t-transparent border-black rounded-full mx-auto"
          />
        </div>
      )}

      {/* Story modal */}
      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}