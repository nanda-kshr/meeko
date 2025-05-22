// /api/stories/[storyId]/unsave/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";

export async function DELETE(
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
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const savedPostRef = userRef.collection("savedPosts").doc(storyId);
    const savedPostDoc = await savedPostRef.get();

    if (!savedPostDoc.exists) {
      return NextResponse.json(
        { message: "Story is not saved" },
        { status: 200 }
      );
    }

    await savedPostRef.delete();

    return NextResponse.json(
      { message: "Story unsaved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error unsaving story:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}