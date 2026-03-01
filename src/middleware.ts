import { NextRequest, NextResponse } from 'next/server';

// Basic Auth credentials - change these!
const VALID_USERNAME = 'spinthebloc';
const VALID_PASSWORD = 'factory2026';

export function middleware(request: NextRequest) {
  // Skip auth for API routes if needed (or remove this to protect everything)
  // if (request.nextUrl.pathname.startsWith('/api/')) {
  //   return NextResponse.next();
  // }

  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="The Bloc"',
      },
    });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="The Bloc"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
