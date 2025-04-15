import { NextResponse, NextRequest } from 'next/server';
 
export async function GET(request: NextRequest) {
  try {
    const cookieName = request.nextUrl.searchParams.get('ck');
    if (!cookieName) {
      return NextResponse.json({ error: 'Cookie not found' }, { status: 400 });
    }

    const cookieHeader = request.headers.get('cookie');
    const cookies = parse(cookieHeader || '');
    const cookieValue = cookies[cookieName];

    return NextResponse.json({ value: cookieValue });
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar a companhia' }, { status: 500 });
  }
}

function parse(cookie: string): { [key: string]: string } {
  return cookie.split(';').reduce((acc, pair) => {
    const [key, value] = pair.trim().split('=');
    return { ...acc, [key]: value };
  }, {});
}