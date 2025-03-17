// src/app/api/v1/stories/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id;
    if (!storyId) {
      return NextResponse.json({ error: "Story ID is required" }, { status: 400 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userRef = adminDb.collection("users").doc(userId);
    const storyRef = adminDb.collection("stories").doc(storyId);

    // Check if story exists
    const storyDoc = await storyRef.get();
    if (!storyDoc.exists) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Check if already liked
    const userLikesRef = userRef.collection("likes").doc(storyId);
    const userLikeDoc = await userLikesRef.get();
    
    if (userLikeDoc.exists) {
      // Unlike - remove like
      await userLikesRef.delete();
      await storyRef.update({
        likeCount: FieldValue.increment(-1)
      });
      return NextResponse.json({ message: "Story unliked", liked: false }, { status: 200 });
    } else {
      // Like - add like
      await userLikesRef.set({
        timestamp: FieldValue.serverTimestamp()
      });
      await storyRef.update({
        likeCount: FieldValue.increment(1)
      });
      return NextResponse.json({ message: "Story liked", liked: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Error liking/unliking story:", error);
    return NextResponse.json({ error: "Failed to like/unlike story" }, { status: 500 });
  }
}
