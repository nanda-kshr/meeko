import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    // Check for admin password
    const adminPass = process.env.ADMIN_PASS;
    if (!adminPass) {
      return NextResponse.json({ error: "Admin password not configured" }, { status: 500 });
    }

    const { password } = await req.json();
    if (password !== adminPass) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Initialize Gemini AI
    const aiKey = process.env.AI_KEY;
    if (!aiKey) {
      return NextResponse.json({ error: "AI key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(aiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate story and author name
    const prompt = `Generate a random realistic experience writing of an incident for depressed people to read and get relief from their depression. The writing should be engaging for depressed people and well-written. Also generate a realistic or cartoonish author name for this story. Format the response as JSON with the following structure:
    {
      "title": "experince title",
      "content": "Full experince content between 100-500 words on random topic, (robbery, wierd experience, etc.)",
      "genre": "One of: Fiction, Non-Fiction, Fantasy, Sci-Fi, Mystery, Romance, Poetry, Adventure, Action, Horror",
      "authorName": "Generated author name"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
    const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    
    // Parse the JSON response
    let storyData;
    try {
      storyData = JSON.parse(jsonText.trim());
    } catch (error) {
      console.error("Failed to parse AI response:", text);
      console.error(error);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    // Add random index for random queries
    const randomIndex = Math.random();

    // Create story document
    const storyDoc = {
      title: storyData.title,
      content: storyData.content,
      genre: storyData.genre,
      author: {
        id: "ai-generated",
        name: storyData.authorName
      },
      timestamp: new Date(),
      randomIndex,
      likeCount: 0
    };

    // Add to Firestore
    const docRef = await adminDb.collection("stories").add(storyDoc);

    return NextResponse.json({
      message: "Story generated successfully",
      story: {
        id: docRef.id,
        ...storyDoc
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
} 