'use server';
import { generateToken } from '@/helper/generate-token';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface BearerEncryption {
  activationKey: string;
  userId: string;
  email?: string;
  code?: string;
}

interface HttpRequestParams {
  path: string;
  method: HttpMethod;
  body?: object;
  authorization?: string;
  bearerEncryption?: BearerEncryption;
}

export const httpRequest = async <T>({
  path,
  method,
  body,
  authorization,
  bearerEncryption,
}: HttpRequestParams): Promise<T> => {
  const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const token = bearerEncryption
    ? await generateToken(60000, bearerEncryption)
    : await generateToken();

  if (!endpoint || !token) {
    throw new Error('It was not possible to complete the request');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authorization || token}`,
  };

  try {
    const res = await fetch(`${endpoint}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error('It was not possible to complete the request');
    }

    const contentType = res.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      return data as T;
    } else if (contentType && contentType.includes('text')) {
      const text = await res.text();
      return text as unknown as T;
    } else {
      const blob = await res.blob();
      return blob as unknown as T;
    }

  } catch {
    throw new Error('It was not possible to complete the request');
  }
};
