'use client';
import { useState, useEffect } from 'react';
import { StoryFeed } from '@/components/StoryFeed';
import { Loading } from '@/components/Loading'; // Import the new component
import { auth } from '@/config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { Story } from '@/lib/types';

export default function FypPage() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchAllStoriesExceptMine = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const token = await user.getIdToken();
        const response = await fetch('/api/v1/stories?mode=all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch stories');
        }
        const allStories: Story[] = (await response.json()).map((story: Story) => ({
          id: story.id,
          author: story.author.name,
          content: story.content,
          timestamp: story.savedAt,
        }));

        const filteredStories = allStories.filter(story => story.author.name !== user.displayName);
        setStories(filteredStories);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchAllStoriesExceptMine();
  }, [user]);

  if (loading) {
    return <Loading message="Loading stories..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <h2 className="text-xl mb-4">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      {stories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <h2 className="text-xl mb-4">No stories to show</h2>
            <p>Explore to find more stories.</p>
          </div>
        </div>
      ) : (
        <StoryFeed
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          setCurrentStoryIndex={setCurrentStoryIndex}
        />
      )}
    </div>
  );
}