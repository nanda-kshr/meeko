// src/app/api/v1/stories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {

    if (!db) {
      console.error("db is not initialized");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No valid token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const user = await adminAuth.getUser(decodedToken.uid);
    console.log("User:", { uid: user.uid, displayName: user.displayName });

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

    const docRef = await db.collection("stories").add({
      author,
      title: title.trim(),
      content: content.trim(),
      genre: genre.trim(),
      timestamp: FieldValue.serverTimestamp(),
    });
    
    console.log("Story posted with ID:", docRef.id);
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

// The GET handler and helper functions (getMyStories, getFollowingStories, getRandomStories) remain unchanged
export async function GET(req: NextRequest) {
  try {
    console.log("GET /api/v1/stories received");
    if (!db) {
      console.error("db is not initialized");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "all";

    if (mode === "mine") {
      return await getMyStories(req);
    } else if (mode === "following") {
      return await getFollowingStories(req);
    } else if (mode === "random") {
      return await getRandomStories();
    }

    const storiesSnapshot = await db.collection("stories")
      .orderBy("timestamp", "desc")
      .get();
      
    const stories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : null,
      };
    });
    
    console.log("Fetched stories:", stories.length);
    return NextResponse.json(stories, { status: 200 });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

// Helper functions (getMyStories, getFollowingStories, getRandomStories) remain unchanged...

// Fetch only my stories
async function getMyStories(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No valid token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const storiesSnapshot = await db.collection("stories")
      .where("author.id", "==", userId)
      .orderBy("timestamp", "desc")
      .get();

    const stories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() ? 
          data.timestamp.toDate().toISOString() : null,
      };
    });

    return NextResponse.json(stories, { status: 200 });
  } catch (error) {
    console.error("Error fetching my stories:", error);
    return NextResponse.json({ error: "Failed to fetch my stories" }, { status: 500 });
  }
}

// Fetch stories from people I follow
async function getFollowingStories(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No valid token provided" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the list of users I follow (assumes a "following" subcollection)
    const followingSnapshot = await db.collection("users")
      .doc(userId)
      .collection("following")
      .get();

    const followingIds = followingSnapshot.docs.map((doc) => doc.id);
    if (followingIds.length === 0) {
      return NextResponse.json([], { status: 200 }); // No one followed
    }

    const storiesSnapshot = await db.collection("stories")
      .where("author.id", "in", followingIds)
      .orderBy("timestamp", "desc")
      .get();

    const stories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() ? 
          data.timestamp.toDate().toISOString() : null,
      };
    });

    console.log("Fetched following stories:", stories.length);
    return NextResponse.json(stories, { status: 200 });
  } catch (error) {
    console.error("Error fetching following stories:", error);
    return NextResponse.json({ error: "Failed to fetch following stories" }, { status: 500 });
  }
}

// Fetch random stories
async function getRandomStories() {
  try {
    const storiesSnapshot = await db.collection("stories").get();
    const allStories = storiesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate?.() ? 
          data.timestamp.toDate().toISOString() : null,
      };
    });

    // Shuffle array and take up to 10 random stories
    const shuffled = allStories.sort(() => 0.5 - Math.random());
    const randomStories = shuffled.slice(0, Math.min(10, allStories.length));

    console.log("Fetched random stories:", randomStories.length);
    return NextResponse.json(randomStories, { status: 200 });
  } catch (error) {
    console.error("Error fetching random stories:", error);
    return NextResponse.json({ error: "Failed to fetch random stories" }, { status: 500 });
  }
}