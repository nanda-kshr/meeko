// /api/v1/stories/[storyId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db, adminAuth } from "@/lib/firebase";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const { storyId } = await params;
    if (!storyId) {
      return NextResponse.json(
        { error: "Story ID is required" },
        { status: 400 }
      );
    }

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

    // Reference to user and story documents
    const userRef = db.collection("users").doc(userId);
    const storyRef = db.collection("stories").doc(storyId);

    // Get user and story data
    const [userDoc, storyDoc] = await Promise.all([
      userRef.get(),
      storyRef.get(),
    ]);

    if (!storyDoc.exists) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    if (!userDoc.exists) {
      await userRef.set({ createdAt: new Date() });
    }

    const storyData = storyDoc.data();
    const genre = storyData?.genre;
    if (!genre || typeof genre !== "string") {
      return NextResponse.json(
        { error: "Story has no valid genre" },
        { status: 400 }
      );
    }

    const genreRef = userRef.collection("likedGenres").doc(genre);
    const genreDoc = await genreRef.get();
    
    const currentCount = genreDoc.exists ? (genreDoc.data()?.count || 0) : 0;
    const newCount = currentCount + 1;

    await genreRef.set({ 
      count: newCount,
      lastUpdated: new Date()
    });

    return NextResponse.json(
      { 
        message: "Story liked successfully", 
        genreLikeCount: newCount 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error liking story:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}