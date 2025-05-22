import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

interface Story {
  id: string;
  author: {
    id: string;
    name: string;
  };
  title: string;
  content: string;
  genre: string;
  timestamp: string | null;
  randomIndex: number;
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      console.error("adminDb is not initialized");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No valid token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const user = await adminAuth.getUser(decodedToken.uid);

    const { title, content, genre } = await req.json();

    // Validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (!genre || typeof genre !== "string" || genre.trim() === "") {
      return NextResponse.json({ error: "Genre is required" }, { status: 400 });
    }

    const author = {
      id: user.uid,
      name: user.displayName || "Anonymous",
    };

    // Add randomIndex for efficient random queries
    const randomIndex = Math.random();

    const docRef = await adminDb.collection("stories").add({
      author,
      title: title.trim(),
      content: content.trim(),
      genre: genre.trim(),
      timestamp: FieldValue.serverTimestamp(),
      randomIndex, // New field for random mode
    });

    return NextResponse.json({ id: docRef.id, message: "Story posted successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error posting story:", error);
    if (error instanceof Error) {
      if (error.message.includes("auth/")) {
        return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
      }
      return NextResponse.json({ error: "Failed to post story", details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      console.error("adminDb is not initialized");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "all";
    const genre = url.searchParams.get("genre");
    const limit = parseInt(url.searchParams.get("limit") || "20", 10); // Default to 20 stories
    const cursor = url.searchParams.get("cursor"); // For pagination

    if (mode === "mine") {
      return await getMyStories(req, genre, limit, cursor);
    } else if (mode === "following") {
      return await getFollowingStories(req, genre, limit, cursor);
    } else if (mode === "random") {
      return await getRandomStories(genre, limit);
    } else if (mode === "personalized") {
      return await getPersonalizedStories(req, limit, cursor);
    }

    // Base query for mode=all
    let query = adminDb.collection("stories").orderBy("timestamp", "desc");

    // Apply genre filter if provided
    if (genre && genre.trim() !== "") {
      query = query.where("genre", "==", genre.trim());
    }

    // Apply cursor-based pagination
    if (cursor) {
      const cursorDoc = await adminDb.collection("stories").doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    // Apply limit
    query = query.limit(limit);

    const storiesSnapshot = await query.get();
    const stories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : null,
      };
    });

    // Include next cursor for pagination
    const nextCursor = storiesSnapshot.docs.length === limit ? storiesSnapshot.docs[storiesSnapshot.docs.length - 1].id : null;

    return NextResponse.json({ stories, nextCursor }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching stories:", error);
    if (error.code === 9 && error.details?.includes("requires an index")) {
      return NextResponse.json(
        {
          error: "Query requires an index",
          details: "Please create the required index in Firestore: " + error.details,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

// Helper functions

async function getMyStories(req: NextRequest, genre: string | null, limit: number, cursor: string | null) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No valid token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    let query = adminDb.collection("stories")
      .where("author.id", "==", userId)
      .orderBy("timestamp", "desc");

    // Apply genre filter
    if (genre && genre.trim() !== "") {
      query = query.where("genre", "==", genre.trim());
    }

    // Apply cursor-based pagination
    if (cursor) {
      const cursorDoc = await adminDb.collection("stories").doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    // Apply limit
    query = query.limit(limit);

    const storiesSnapshot = await query.get();
    const stories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : null,
      };
    });

    const nextCursor = storiesSnapshot.docs.length === limit ? storiesSnapshot.docs[storiesSnapshot.docs.length - 1].id : null;

    return NextResponse.json({ stories, nextCursor }, { status: 200 });
  } catch (error) {
    console.error("Error fetching my stories:", error);
    return NextResponse.json({ error: "Failed to fetch my stories" }, { status: 500 });
  }
}

async function getFollowingStories(req: NextRequest, genre: string | null, limit: number, cursor: string | null) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No valid token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the list of users I follow
    const followingSnapshot = await adminDb.collection("users")
      .doc(userId)
      .collection("following")
      .get();

    const followingIds = followingSnapshot.docs.map((doc) => doc.id);
    if (followingIds.length === 0) {
      return NextResponse.json({ stories: [], nextCursor: null }, { status: 200 });
    }

    let query = adminDb.collection("stories")
      .where("author.id", "in", followingIds)
      .orderBy("timestamp", "desc");

    // Apply genre filter
    if (genre && genre.trim() !== "") {
      query = query.where("genre", "==", genre.trim());
    }

    // Apply cursor-based pagination
    if (cursor) {
      const cursorDoc = await adminDb.collection("stories").doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    // Apply limit
    query = query.limit(limit);

    const storiesSnapshot = await query.get();
    const stories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : null,
      };
    });

    const nextCursor = storiesSnapshot.docs.length === limit ? storiesSnapshot.docs[storiesSnapshot.docs.length - 1].id : null;

    return NextResponse.json({ stories, nextCursor }, { status: 200 });
  } catch (error) {
    console.error("Error fetching following stories:", error);
    return NextResponse.json({ error: "Failed to fetch following stories" }, { status: 500 });
  }
}

async function getRandomStories(genre: string | null, limit: number = 10) {
  try {
    // Generate a random value for randomIndex
    const randomValue = Math.random();

    let query = adminDb.collection("stories")
      .where("randomIndex", ">=", randomValue)
      .orderBy("randomIndex")
      .limit(limit);

    // Apply genre filter
    if (genre && genre.trim() !== "") {
      query = query.where("genre", "==", genre.trim());
    }

    let storiesSnapshot = await query.get();

    // If not enough stories, try the other side of the randomIndex
    if (storiesSnapshot.docs.length < limit) {
      query = adminDb.collection("stories")
        .where("randomIndex", "<", randomValue)
        .orderBy("randomIndex", "desc")
        .limit(limit - storiesSnapshot.docs.length);

      if (genre && genre.trim() !== "") {
        query = query.where("genre", "==", genre.trim());
      }

      const additionalSnapshot = await query.get();
      storiesSnapshot = {
        docs: [...storiesSnapshot.docs, ...additionalSnapshot.docs],
      } as any;
    }

    const stories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : null,
      };
    });

    return NextResponse.json({ stories, nextCursor: null }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching random stories:", error);
    if (error.code === 9 && error.details?.includes("requires an index")) {
      return NextResponse.json(
        {
          error: "Query requires an index",
          details: "Please create the required index in Firestore: " + error.details,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch random stories" }, { status: 500 });
  }
}

async function getPersonalizedStories(req: NextRequest, limit: number, cursor: string | null) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No valid token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Fetch user's liked genres
    const likedGenresSnapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("likedGenres")
      .orderBy("count", "desc")
      .get();

    const likedGenres = likedGenresSnapshot.docs.map(doc => doc.id);
    
    // If no liked genres, fall back to random stories
    if (likedGenres.length === 0) {
      return await getRandomStories(null, limit);
    }

    let allStories: Story[] = [];
    let currentCursor = cursor;

    // Try to get stories from each liked genre until we have enough
    for (const genre of likedGenres) {
      if (allStories.length >= limit) break;

      let query = adminDb.collection("stories")
        .where("genre", "==", genre)
        .orderBy("timestamp", "desc");

      // Apply cursor-based pagination
      if (currentCursor) {
        const cursorDoc = await adminDb.collection("stories").doc(currentCursor).get();
        if (cursorDoc.exists) {
          query = query.startAfter(cursorDoc);
        }
      }

      // Calculate how many more stories we need
      const remainingLimit = limit - allStories.length;
      query = query.limit(remainingLimit);

      const storiesSnapshot = await query.get();
      const stories = storiesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : null,
        } as Story;
      });

      allStories = [...allStories, ...stories];
      
      // Update cursor for next iteration
      if (storiesSnapshot.docs.length > 0) {
        currentCursor = storiesSnapshot.docs[storiesSnapshot.docs.length - 1].id;
      }
    }

    // If we still don't have enough stories, get random stories to fill the gap
    if (allStories.length < limit) {
      // First try to get stories from all genres
      const allGenresQuery = adminDb.collection("stories")
        .orderBy("timestamp", "desc")
        .limit(limit - allStories.length);

      const allGenresSnapshot = await allGenresQuery.get();
      const additionalStories = allGenresSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : null,
        } as Story;
      });

      // Filter out stories we already have and stories from the user's own genres
      const newStories = additionalStories.filter(
        (story) => !allStories.some(s => s.id === story.id) && !likedGenres.includes(story.genre)
      );

      allStories = [...allStories, ...newStories.slice(0, limit - allStories.length)];

      // If we still don't have enough, get random stories
      if (allStories.length < limit) {
        const randomStories = await getRandomStories(null, limit - allStories.length);
        const randomStoriesData = await randomStories.json();
        
        // Filter out stories we already have
        const newRandomStories = randomStoriesData.stories.filter(
          (randomStory: Story) => !allStories.some(story => story.id === randomStory.id)
        );
        
        // Add only as many as we need
        allStories = [...allStories, ...newRandomStories.slice(0, limit - allStories.length)];
      }
    }

    // Include next cursor for pagination
    const nextCursor = allStories.length === limit ? currentCursor : null;

    return NextResponse.json({ stories: allStories, nextCursor }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching personalized stories:", error);
    if (error.code === 9 && error.details?.includes("requires an index")) {
      return NextResponse.json(
        {
          error: "Query requires an index",
          details: "Please create the required index in Firestore: " + error.details,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Failed to fetch personalized stories" }, { status: 500 });
  }
}