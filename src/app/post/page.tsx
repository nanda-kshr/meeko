"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";

export default function PostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Check auth state efficiently
  useEffect(() => {
    const user = auth.currentUser; // Immediate check
    if (user) {
      user.getIdToken(true).then((idToken) => {
        setToken(idToken);
      }).catch((error) => {
        console.error("Token Error:", error);
        setToken(null);
        router.push("/signin");
      });
    } else {
      // Fallback to listener if no user is cached
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken(true).then((idToken) => setToken(idToken));
        } else {
          router.push("/signin");
        }
      });
      return () => unsubscribe();
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }
    if (!content.trim()) {
      alert("Please enter content");
      return;
    }
    if (!genre.trim()) {
      alert("Please select a genre");
      return;
    }
    if (!token) {
      alert("Please wait for authentication or log in");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, genre }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to post story");
      setTitle("");
      setContent("");
      setGenre("");
      router.push("/fyp");
    } catch (error) {
      console.error("Client Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form with title, content, and genre fields
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans p-4">
      <h1 className="text-2xl font-bold mb-4">Post a New Story</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Story Title"
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting || token === null}
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting || token === null}
        >
          <option value="">Select Genre</option>
          <option value="Fiction">Fiction</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Mystery">Mystery</option>
          <option value="Romance">Romance</option>
          {/* Add more genres as needed */}
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full h-40 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting || token === null}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
          disabled={isSubmitting || token === null}
        >
          {isSubmitting ? "Posting..." : token === null ? "Loading..." : "Post Story"}
        </button>
      </form>
      <button
        onClick={() => router.push("/fyp")}
        className="mt-4 text-gray-400 hover:text-white"
        disabled={isSubmitting}
      >
        Back to Feed
      </button>
    </div>
  );
}