'use server';
import { NextResponse, NextRequest } from 'next/server';

import { verifyToken } from './helper/generate-token';

type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
};

const SECURE_COOKIE_OPTIONS: Partial<CookieOptions> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};

export async function middleware(req: NextRequest): Promise<NextResponse<unknown>> {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get('_xa')?.value;
  const refreshToken = req.cookies.get('_xr')?.value;
  
  if (pathname === '/api/v1/clear-cookies') {
    return clearTokensAndRedirect(req);
  }

  if (pathname.startsWith('/auth')) {
    if (accessToken || refreshToken) {
      return clearTokensAndRedirect(req);
    }
    return NextResponse.next();
  }

  // Login automático:
  // if (pathname.startsWith('/auth')) {
  //   if (accessToken || refreshToken) {
  //     if (accessToken && await validateAccessToken(accessToken)) {
  //       return NextResponse.redirect(new URL('/dashboard', req.url));
  //     } else {
  //       return clearTokensAndRedirect(req);
  //     }
  //   }
  //   return NextResponse.next();
  // }

  const PUBLIC_ROUTES = [
    /^\/api\/v1\/auth(.*)$/,
    /^\/api\/v1\/callback(.*)$/,
  ];

  if (PUBLIC_ROUTES.some(regex => regex.test(pathname))) {
    return NextResponse.next();
  }

  if (!refreshToken || !(await validateAccessToken(refreshToken))) {
    return clearTokensAndRedirect(req);
  }
  
  if (!accessToken || !(await validateAccessToken(accessToken))) {
    return await handleTokenRefresh(req, refreshToken);
  }

  const response = NextResponse.next();
  return response;
}

async function validateAccessToken(token: string): Promise<boolean> {
  try {
    if (!token) return false;

    const verify = await verifyToken(token);
    return verify;
  } catch {
    return false;
  }
}

async function handleTokenRefresh(req: NextRequest, refreshToken?: string): Promise<NextResponse> {
  if (!refreshToken) return redirectToLogin(req);

  try {
    const refreshResponse = await fetch(`${getBaseUrl()}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const { access, refresh } = await refreshResponse.json();
      const response = NextResponse.next();

      response.cookies.set('_xr', refresh.token, {
        ...SECURE_COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 7,
        expires: new Date(refresh.expires),
      });

      response.cookies.set('_xa', access.token, {
        ...SECURE_COOKIE_OPTIONS,
        maxAge: 60 * 15,
        expires: new Date(access.expires),
      });

      return response;
    }
  } catch {
    return redirectToLogin(req);
  }

  return clearTokensAndRedirect(req);
}

function redirectToLogin(req: NextRequest): NextResponse {
  const loginUrl = new URL('/auth/sign-in', req.url);
  return NextResponse.redirect(loginUrl);
}

function clearTokensAndRedirect(req: NextRequest): NextResponse {
  const response = redirectToLogin(req);
  response.cookies.delete('_xr');
  response.cookies.delete('_xa');
  return response;
}

function getBaseUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_APP_URL!
    : `http://localhost:${process.env.NEXT_PUBLIC_PORT}`;
}

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
