'use client';
import { useState, useEffect } from 'react';
import { StoryFeed } from '@/components/StoryFeed';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Story {
  id: number;
  author: string; // Changed to string to match StoryHeader
  content: string;
  timestamp: string;
}

export default function FypPage() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [savedStories, setSavedStories] = useState<number[]>([]);
  const [likedStories, setLikedStories] = useState<number[]>([]);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useAuthState(auth);
  const router = useRouter();

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

        // Fetch all stories
        const response = await fetch('/api/v1/stories?mode=all', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch stories');
        }

        // Transform the data to match StoryFeed and StoryHeader expectations
        const allStories: Story[] = (await response.json()).map((story: any) => ({
          id: Number(story.id), // Convert string ID to number
          author: story.author.name, // Use author.name as a string
          content: story.content,
          timestamp: story.timestamp,
        }));
        // Filter out stories where the author.id matches the current user's uid
        const filteredStories = allStories.filter(story => story.author !== user.displayName); // Assuming author is now a name
        setStories(filteredStories);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchFollowedUsers = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/v1/users/following', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFollowedUsers(data.map((user: any) => user.id));
        }
      } catch (error) {
        console.error('Error fetching followed users:', error);
      }
    };

    fetchFollowedUsers();
    fetchAllStoriesExceptMine();
  }, [user]);

  const handleShowComments = (show: boolean) => {
    setShowComments(show);
    if (show) {
      router.push('/comments');
    }
  };

  const handleFollowUser = async (userId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const token = await user.getIdToken();
      const isFollowing = followedUsers.includes(userId);
      const method = isFollowing ? 'DELETE' : 'POST';

      const response = await fetch(`/api/v1/users/follow/${userId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFollowedUsers(prev =>
          isFollowing ? prev.filter(id => id !== userId) : [...prev, userId]
        );
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading stories...</div>
        </div>
        <Navbar />
      </div>
    );
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
        <Navbar />
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
          savedStories={savedStories}
          setSavedStories={setSavedStories}
          likedStories={likedStories}
          setLikedStories={setLikedStories}
          followedUsers={followedUsers}
          setFollowedUsers={handleFollowUser}
          setShowComments={handleShowComments}
        />
      )}
      <Navbar />
    </div>
  );
}