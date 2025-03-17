// src/app/api/v1/stories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/v1/stories received");

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
    console.log("User:", { uid: user.uid, displayName: user.displayName });

    const { content } = await req.json();
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const author = {
      id: user.uid,
      name: user.displayName || "Anonymous",
    };

    const docRef = await adminDb.collection("stories").add({
      author,
      content: content.trim(),
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

// Fetch all stories (existing endpoint)
export async function GET(req: NextRequest) {
  try {
    console.log("GET /api/v1/stories received");
    if (!adminDb) {
      console.error("adminDb is not initialized");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "all"; // Default to all stories

    if (mode === "mine") {
      return await getMyStories(req);
    } else if (mode === "following") {
      return await getFollowingStories(req);
    } else if (mode === "random") {
      return await getRandomStories(req);
    }

    // Default: Fetch all stories
    const storiesSnapshot = await adminDb.collection("stories")
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
    
    console.log("Fetched stories:", stories.length);
    return NextResponse.json(stories, { status: 200 });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

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

    const storiesSnapshot = await adminDb.collection("stories")
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
    const followingSnapshot = await adminDb.collection("users")
      .doc(userId)
      .collection("following")
      .get();

    const followingIds = followingSnapshot.docs.map((doc) => doc.id);
    if (followingIds.length === 0) {
      return NextResponse.json([], { status: 200 }); // No one followed
    }

    const storiesSnapshot = await adminDb.collection("stories")
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
async function getRandomStories(req: NextRequest) {
  try {
    const storiesSnapshot = await adminDb.collection("stories").get();
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