import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(request: NextRequest) {
  try {
    const { cookieName, cookieValue, expires } = await request.json();
    
    if (!cookieName || !cookieValue) {
      return NextResponse.json(
        { message: 'Cookie name and value are required' },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    response.cookies.set({
      name: cookieName,
      value: cookieValue,
      expires: new Date(expires),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}