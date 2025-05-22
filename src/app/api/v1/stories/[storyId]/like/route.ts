import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

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

    // Reference to user, story, and genre documents
    const userRef = adminDb.collection("users").doc(userId);
    const storyRef = adminDb.collection("stories").doc(storyId);
    const globalGenreRef = adminDb.collection("genres").doc();

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

    // Create user document if it doesn't exist
    if (!userDoc.exists) {
      await userRef.set({
        createdAt: new Date(),
        totalLikedPosts: 0,
      });
    }

    const storyData = storyDoc.data();
    const genre = storyData?.genre;
    const authorId = storyData?.author?.id;
    if (!genre || typeof genre !== "string") {
      return NextResponse.json(
        { error: "Story has no valid genre" },
        { status: 400 }
      );
    }
    if (!authorId || typeof authorId !== "string") {
      return NextResponse.json(
        { error: "Story has no valid author" },
        { status: 400 }
      );
    }

    // Prevent users from friending themselves
    if (authorId === userId) {
      return NextResponse.json(
        { error: "Cannot add yourself as a friend" },
        { status: 400 }
      );
    }

    // Batch operations for atomic updates
    const batch = adminDb.batch();

    // Increment likedGenres count
    const genreRef = userRef.collection("likedGenres").doc(genre);
    const genreDoc = await genreRef.get();
    const currentGenreCount = genreDoc.exists ? (genreDoc.data()?.count || 0) : 0;
    const newGenreCount = currentGenreCount + 1;
    batch.set(genreRef, {
      count: newGenreCount,
      lastUpdated: new Date(),
    });

    // Increment totalLikedPosts in user document
    batch.update(userRef, {
      totalLikedPosts: FieldValue.increment(1),
    });

    // Add author as a friend if not already added
    const friendRef = userRef.collection("friends").doc(authorId);
    const friendDoc = await friendRef.get();
    if (!friendDoc.exists) {
      batch.set(friendRef, {
        friendId: authorId,
        addedAt: new Date(),
        friendName: storyData.author.name || "Anonymous",
      });
    }

    // Increment global genre like count
    batch.set(globalGenreRef, {
      count: FieldValue.increment(1),
      lastUpdated: new Date(),
    }, { merge: true });

    // Commit all operations
    await batch.commit();

    return NextResponse.json(
      {
        message: "Story liked successfully",
        genreLikeCount: newGenreCount,
        totalLikedPosts: (userDoc.exists ? (userDoc.data()?.totalLikedPosts || 0) : 0) + 1,
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