import { NextRequest, NextResponse } from 'next/server';

import { getUserByParentId } from '@/app/_actions/user';

export async function GET(req: NextRequest) {
  const parentId = req.nextUrl.searchParams.get('id');
  const userId = req.nextUrl.searchParams.get('userId');
  const loginUrl = new URL('/auth/sign-in', req.url);

  if (!parentId || !userId) {
    return NextResponse.redirect(loginUrl);
  }

  const result = await getUserByParentId(userId, parentId);
  if (!result) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.json(result);
}
