"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type {Story} from '@/lib/types';
import { formatTimestamp } from '@/components/stories/StoryHeader';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function SavedStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null); 
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setLoading(true);
    async function fetchSavedStories() {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        const token = await user.getIdToken();

        const response = await fetch('/api/v1/stories/saved', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch saved stories');
        }

        const data = await response.json();
        const formattedStories = (data.savedStories || []).map((story: Story) => ({
            ...story,
            savedAt: story.savedAt instanceof Object && 'toDate' in story.savedAt
              ? story.savedAt.toDate().toISOString()
              : typeof story.savedAt === 'string'
              ? story.savedAt
              : null
        }));
        setStories(formattedStories);
        setError(null);
      } catch (err) {
        console.error('Error fetching saved stories:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchSavedStories();
  }, [user]);

  // Get preview of content
  const getContentPreview = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  // Open and close modal
  const openModal = (story: Story) => setSelectedStory(story);
  const closeModal = () => setSelectedStory(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Saved Stories</h1>
          <p className="text-gray-600 mt-1">Stories you&apos;ve saved for later</p>
        </header>

        {error ? (
          <div className="bg-white border-l-4 border-gray-300 p-4 rounded-md shadow">
            <p>{error}</p>
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow">
            <p className="text-gray-600 mb-4">You haven&apos;t saved any stories yet.</p>
            <Link
              href="/discover"
              className="inline-block bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Discover Stories
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {stories.map((story) => (
              <div key={story.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow transition">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1">{story.title}</h2>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {story.author.name || 'Anonymous'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Genre: <span className="font-medium">{story.genre}</span>
                  </div>
                  <div className="prose max-w-none line-clamp-3 text-gray-700">
                    {getContentPreview(story.content)}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    Saved {story.savedAt ? new Date(String(story.savedAt)).toLocaleDateString() : 'recently'}
                  </span>
                  <button
                    onClick={() => openModal(story)}
                    className="text-black font-medium hover:underline focus:outline-none"
                  >
                    Read full story
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for full story */}
        {selectedStory && (
          <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedStory.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-black focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span>By {selectedStory.author.name || 'Anonymous'}</span> •{' '}
                <span>{formatTimestamp(selectedStory.savedAt)}</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Genre: <span className="font-medium">{selectedStory.genre}</span>
              </div>
              <div className="prose max-w-none text-gray-800">
                {selectedStory.content}
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Saved {selectedStory.savedAt ? formatTimestamp(selectedStory.savedAt) : 'recently'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}