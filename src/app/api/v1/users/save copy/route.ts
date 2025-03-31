import { NextRequest, NextResponse } from "next/server";
import { adminAuth, db } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userRef = db.collection("users").doc(userId);
    const savesSnapshot = await userRef.collection("saves").get();
    
    const savedStoryIds = savesSnapshot.docs.map(doc => doc.id);
    
    return NextResponse.json({ savedStoryIds }, { status: 200 });
  } catch (error) {
    console.error("Error fetching saved stories:", error);
    return NextResponse.json({ error: "Failed to fetch saved stories" }, { status: 500 });
  }
}

