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

    // Check if already saved
    const userSavesRef = userRef.collection("saves").doc(storyId);
    const userSaveDoc = await userSavesRef.get();
    
    if (userSaveDoc.exists) {
      // Unsave - remove save
      await userSavesRef.delete();
      return NextResponse.json({ message: "Story unsaved", saved: false }, { status: 200 });
    } else {
      // Save - add save
      await userSavesRef.set({
        timestamp: FieldValue.serverTimestamp()
      });
      return NextResponse.json({ message: "Story saved", saved: true }, { status: 200 });
    }
  } catch (error) {
    console.error("Error saving/unsaving story:", error);
    return NextResponse.json({ error: "Failed to save/unsave story" }, { status: 500 });
  }
}