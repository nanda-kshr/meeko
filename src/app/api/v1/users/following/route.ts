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
    const followingSnapshot = await userRef.collection("following").get();
    
    const followingUserIds = followingSnapshot.docs.map(doc => doc.id);
    
    return NextResponse.json({ followingUserIds }, { status: 200 });
  } catch (error) {
    console.error("Error fetching following users:", error);
    return NextResponse.json({ error: "Failed to fetch following users" }, { status: 500 });
  }
}