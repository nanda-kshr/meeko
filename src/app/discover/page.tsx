"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { motion } from "framer-motion";
import { Search, TrendingUp, Clock, Star, Filter, Heart } from "lucide-react";

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

export default function DiscoverPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [showGenreFilter, setShowGenreFilter] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const router = useRouter();

  const fetchStories = async (append = false) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();
      const endpoint = `/api/v1/stories?mode=${activeFilter}${selectedGenre ? `&genre=${selectedGenre}` : ""}&limit=20${cursor ? `&cursor=${cursor}` : ""}`;

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
      setFilteredStories((prev) => (append ? [...prev, ...newStories] : newStories));
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
      setError(null);
    } catch (err) {
      console.error("Error fetching stories:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        router.push("/signin");
        return;
      }
      fetchStories();
    });
    return () => unsubscribe();
  }, [router, activeFilter, selectedGenre]);

  // Handle search filtering
  useEffect(() => {
    let filtered = stories;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStories(filtered);
  }, [stories, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled via useEffect
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Unknown";
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Unknown";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    } catch {
      return "Unknown";
    }
  };

  const getContentPreview = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  const genres = [
    "All",
    "Fiction",
    "Non-Fiction",
    "Fantasy",
    "Sci-Fi",
    "Mystery",
    "Romance",
    "Poetry",
    "adventure",
    "action",
    "horror",
  ];

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80 },
    },
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
  };

  const closeStoryModal = () => {
    setSelectedStory(null);
  };

  if (loading && !stories.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  const toggleGenreFilter = () => {
    setShowGenreFilter(!showGenreFilter);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {/* Header - Compact for mobile */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 pt-3 pb-2">
        <div className="mx-auto">
          <h1 className="text-xl font-bold mb-2.5">Discover Stories</h1>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search stories..."
              className="w-full py-2 pl-9 pr-3 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          </form>

          {/* Filter Options - Horizontally scrollable */}
          <div className="flex space-x-2 overflow-x-auto pb-1.5 -mx-1 px-1 no-scrollbar">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                activeFilter === "all" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              <TrendingUp size={14} />
              <span>All</span>
            </button>
            <button
              onClick={() => setActiveFilter("mine")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                activeFilter === "mine" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              <Clock size={14} />
              <span>My Stories</span>
            </button>
            <button
              onClick={() => setActiveFilter("following")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                activeFilter === "following" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              <Star size={14} />
              <span>Following</span>
            </button>
            <button
              onClick={() => setActiveFilter("random")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                activeFilter === "random" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              <Star size={14} />
              <span>Random</span>
            </button>
            <button
              onClick={toggleGenreFilter}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                showGenreFilter ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              <Filter size={14} />
              <span>Genre</span>
            </button>
          </div>

          {/* Genre Selector - Collapsible */}
          {showGenreFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 pb-2 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => {
                      setSelectedGenre(genre === "All" ? "" : genre);
                      setShowGenreFilter(false);
                    }}
                    className={`px-3 py-1 text-sm rounded-full ${
                      (genre === "All" && selectedGenre === "") || selectedGenre === genre
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {selectedGenre && (
            <div className="flex items-center mb-3 text-sm">
              <span className="text-gray-600">Filtered by: </span>
              <span className="ml-1 px-2 py-0.5 bg-black text-white rounded-full text-xs flex items-center">
                {selectedGenre}
                <button onClick={() => setSelectedGenre("")} className="ml-1 rounded-full">
                  <span className="text-xs">×</span>
                </button>
              </span>
            </div>
          )}

          {error ? (
            <div className="text-center py-8 px-4">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-gray-600 mb-2">No stories found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredStories.map((story) => (
                <motion.div
                  key={story.id}
                  variants={itemVariants}
                  className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-sm active:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleStoryClick(story)}
                >
                  <div className="mb-2">
                    <h2 className="text-base font-bold line-clamp-1">{story.title}</h2>
                    <div className="flex justify-between items-center text-xs text-gray-600 mt-0.5">
                      <span>{story.author.name}</span>
                      <span>{formatTimestamp(story.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-2.5 line-clamp-3">
                    {getContentPreview(story.content)}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                      {story.genre}
                    </span>
                    <div className="flex items-center text-xs text-gray-600">
                      <Heart size={12} className="mr-1" />
                      <span>{story.likeCount || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          {hasMore && !loading && (
            <div className="text-center py-4">
              <button
                onClick={() => fetchStories(true)}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm"
              >
                Load More
              </button>
            </div>
          )}
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto"></div>
            </div>
          )}
        </div>
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{selectedStory.title}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <span>{selectedStory.author.name}</span>
                  <span className="mx-2">•</span>
                  <span>{formatTimestamp(selectedStory.timestamp)}</span>
                </div>
              </div>
              <button
                onClick={closeStoryModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                  {selectedStory.genre}
                </span>
                <div className="flex items-center text-gray-600">
                  <Heart size={16} className="mr-1" />
                  <span>{selectedStory.likeCount || 0}</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{selectedStory.content}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Extra bottom padding for navbar */}
      <div className="h-14"></div>
    </div>
  );
}