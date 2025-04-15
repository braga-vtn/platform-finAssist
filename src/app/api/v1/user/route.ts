import { NextRequest, NextResponse } from 'next/server';
import { getUserByXr } from '@/app/_actions/user';

export async function GET(req: NextRequest) {
  const refreshToken = req.nextUrl.searchParams.get('xr');
  const loginUrl = new URL('/auth/sign-in', req.url);

  if (!refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  const result = await getUserByXr(refreshToken);
  if (!result) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.json(result);
}
