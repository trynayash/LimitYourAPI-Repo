import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LimitYourAPIClient } from 'limityourapi';

const limiter = new LimitYourAPIClient({
  baseUrl: 'https://api.v2.limityourapi.tech',
  apiKey: process.env.LIMIT_YOUR_API_KEY || 'your_api_key_here'
});

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const result = await limiter.check({ endpoint: path });
  
  if (!result.allowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests', retryAfter: result.retryAfter }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfter),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining)
        }
      }
    );
  }
  
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  return response;
}

export const config = {
  matcher: '/api/:path*'
};
