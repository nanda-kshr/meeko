import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const response = NextResponse.next();

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 204 });
    }

    return response;
}

export const config = {
    matcher: '/:path*',
};