// /api/stories/saved/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    // Check if the user document exists, if not, create it
    if (!userDoc.exists) {
      await userRef.set({
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      });
    }

    // Get all saved posts from the user's savedPosts subcollection
    const savedPostsSnapshot = await userRef.collection("savedPosts").get();
    
    if (savedPostsSnapshot.empty) {
      return NextResponse.json(
        { 
          message: "No saved stories found",
          savedStories: []
        },
        { status: 200 }
      );
    }

    // Get the story IDs from saved posts
    const storyIds = savedPostsSnapshot.docs.map(doc => doc.id);

    // Fetch all stories in parallel
    const storyPromises = storyIds.map(storyId =>
      db.collection("stories").doc(storyId).get()
    );
    
    const storyDocs = await Promise.all(storyPromises);
    
    // Filter out any stories that might have been deleted and format the response
    const savedStories = storyDocs
      .filter(doc => doc.exists)
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        savedAt: savedPostsSnapshot.docs
          .find(savedDoc => savedDoc.id === doc.id)
          ?.data().createdAt
      }));

    return NextResponse.json(
      { 
        message: "Saved stories retrieved successfully",
        savedStories 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving saved stories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}