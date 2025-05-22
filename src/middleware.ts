import { NextRequest, NextResponse } from "next/server";

const userPaths = ["/api/"];


export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: res.headers, status: 204 });
  }
  const pathname = req.nextUrl.pathname;
  const isUserRoute = userPaths.some((path) => pathname.startsWith(path));
  if (isUserRoute) {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return res;
}


export const config = {
    matcher: [
        "/api/",
          // This will match all paths
    ],
};
