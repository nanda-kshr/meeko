"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/config/firebase";

export default function PostPage() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Check auth state efficiently
  useEffect(() => {
    const user = auth.currentUser; // Immediate check
    if (user) {
      user.getIdToken(true).then((idToken) => {
        console.log("Client Token:", idToken);
        setToken(idToken);
      }).catch((error) => {
        console.error("Token Error:", error);
        setToken(null);
        router.push("/login");
      });
    } else {
      // Fallback to listener if no user is cached
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken(true).then((idToken) => setToken(idToken));
        } else {
          router.push("/login");
        }
      });
      return () => unsubscribe();
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Please enter content");
      return;
    }
    if (!token) {
      alert("Please wait for authentication or log in");
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("Sending POST to /api/v1/stories with token:", token);
      const response = await fetch("/api/v1/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      console.log("Response:", data);
      if (!response.ok) throw new Error(data.error || "Failed to post story");
      setContent("");
      alert("Story posted successfully!");
      router.push("/following");
    } catch (error) {
      console.error("Client Error:", error);
      alert(`Failed to post story: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form immediately, disable if not authenticated
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans p-4">
      <h1 className="text-2xl font-bold mb-4">Post a New Story</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        onClick={() => router.push("/following")}
        className="mt-4 text-gray-400 hover:text-white"
        disabled={isSubmitting}
      >
        Back to Feed
      </button>
    </div>
  );
}