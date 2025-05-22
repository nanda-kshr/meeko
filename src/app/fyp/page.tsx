'use client';
import { useState, useEffect } from 'react';
import { StoryFeed } from '@/components/stories/StoryFeed';
import { Loading } from '@/components/Loading';
import { useAuthState } from 'react-firebase-hooks/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type Story = {
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
};

export default function FypPage() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      if (!user) router.push('/signin');
    });
  }, [router]);

  const fetchStories = async (append = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = await user.getIdToken();
      const endpoint = `/api/v1/stories?mode=personalized&limit=20${cursor ? `&cursor=${cursor}` : ''}`;
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stories');
      }

      const data = await response.json();
      const newStories: Story[] = (data.stories || []).filter(
        (story: Story) => story.author.name !== user.displayName
      );

      setStories((prev) => (append ? [...prev, ...newStories] : newStories));
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [user]);

  if (loading && !stories.length) {
    return <Loading message="Loading stories..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-r from-[#2c3e50] to-[#3498db] text-[#f5f5f5] dark:text-[#f5f5f5] font-body">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <h2 className="text-xl mb-4 font-heading">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-[#2c3e50] to-[#3498db] text-[#f5f5f5] dark:text-[#f5f5f5] dark:from-[#1a2533] dark:to-[#2980b9] font-body">
      {stories.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-4">
            <h2 className="text-xl mb-4 font-heading">No stories to show</h2>
            <p>Explore to find more stories.</p>
          </div>
        </div>
      ) : (
        <>
          <StoryFeed
            stories={stories}
            currentStoryIndex={currentStoryIndex}
            setCurrentStoryIndex={setCurrentStoryIndex}
          />
          {hasMore && !loading && (
            <div className="text-center py-4">
              <button
                onClick={() => fetchStories(true)}
                className="px-4 py-2 bg-white text-[#2c3e50] rounded-lg text-sm font-medium"
              >
                Load More
              </button>
            </div>
          )}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}