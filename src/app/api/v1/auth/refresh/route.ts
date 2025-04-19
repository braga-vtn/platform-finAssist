'use server';
import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) {
      return NextResponse.json(
        { status: 'error', message: 'Refresh token não informado.' },
        { status: 400 }
      );
    }

    console.log('pegando refresh', process.env.NEXT_PUBLIC_BACKEND_URL!);
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL!}/v1/auth/refresh-tokens`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(errorData, { status: backendResponse.status });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
