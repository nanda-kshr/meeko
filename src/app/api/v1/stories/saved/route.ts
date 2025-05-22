import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

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

    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

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

    const storyIds = savedPostsSnapshot.docs.map(doc => doc.id);

    const storyPromises = storyIds.map(storyId =>
      adminDb.collection("stories").doc(storyId).get()
    );

    const storyDocs = await Promise.all(storyPromises);

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