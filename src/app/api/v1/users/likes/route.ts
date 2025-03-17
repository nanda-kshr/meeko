import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userRef = adminDb.collection("users").doc(userId);
    const likesSnapshot = await userRef.collection("likes").get();
    
    const likedStoryIds = likesSnapshot.docs.map(doc => doc.id);
    
    return NextResponse.json({ likedStoryIds }, { status: 200 });
  } catch (error) {
    console.error("Error fetching liked stories:", error);
    return NextResponse.json({ error: "Failed to fetch liked stories" }, { status: 500 });
  }
}