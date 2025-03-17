import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const targetUserId = params.id;
    if (!targetUserId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const currentUserId = decodedToken.uid;

    // Cannot follow yourself
    if (currentUserId === targetUserId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    // Check if target user exists
    const targetUserDoc = await adminAuth.getUser(targetUserId).catch(() => null);
    if (!targetUserDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentUserRef = adminDb.collection("users").doc(currentUserId);
    const targetUserRef = adminDb.collection("users").doc(targetUserId);

    // Check if already following
    const followingRef = currentUserRef.collection("following").doc(targetUserId);
    const followingDoc = await followingRef.get();
    
    if (followingDoc.exists) {
      // Unfollow
      await followingRef.delete();
      
      // Remove from target user's followers
      await targetUserRef.collection("followers").doc(currentUserId).delete();
      
      // Update follower count
      await targetUserRef.update({
        followerCount: FieldValue.increment(-1)
      });
      
      return NextResponse.json({ message: "User unfollowed", following: false }, { status: 200 });
    } else {
      // Follow
      await followingRef.set({
        timestamp: FieldValue.serverTimestamp()
      });
      
      // Add to target user's followers
      await targetUserRef.collection("followers").doc(currentUserId).set({
        timestamp: FieldValue.serverTimestamp()
      });
      
      // Update follower count
      await targetUserRef.update({
        followerCount: FieldValue.increment(1)
      });
      
      return NextResponse.json({ message: "User followed", following: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
    return NextResponse.json({ error: "Failed to follow/unfollow user" }, { status: 500 });
  }
}
