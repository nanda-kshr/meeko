// /api/v1/stories/[storyId]/dislike/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

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
    const userRef = adminDb.collection("users").doc(userId);
    const storyRef = adminDb.collection("stories").doc(storyId);

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
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
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
    
    if (!genreDoc.exists) {
      return NextResponse.json(
        { 
          message: "Story not liked yet", 
          genreLikeCount: 0 
        },
        { status: 200 }
      );
    }

    const currentCount = genreDoc.data()?.count || 0;
    if (currentCount <= 0) {
      await genreRef.delete();
      return NextResponse.json(
        { 
          message: "Like count already at 0", 
          genreLikeCount: 0 
        },
        { status: 200 }
      );
    }

    const newCount = currentCount - 1;
    
    if (newCount === 0) {
      await genreRef.delete();
    } else {
      await genreRef.update({
        count: newCount,
        lastUpdated: new Date()
      });
    }

    return NextResponse.json(
      { 
        message: "Story disliked successfully", 
        genreLikeCount: newCount 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error disliking story:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}