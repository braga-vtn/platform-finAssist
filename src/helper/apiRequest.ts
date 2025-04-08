'use server';

import { cookies } from 'next/headers';
 
export const apiRequest = async (domain: string, path: string, options: RequestInit = {}) => {
  try {
    const cookieStore = await cookies();
    const userCookies = cookieStore.getAll();
    const cookieHeader = userCookies.map(c => `${c.name}=${c.value}`).join('; ');
    const url = `${domain}${path}`;

    const headers = {
      ...(options.headers || {}),
      'Cookie': cookieHeader,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error();
    }

    return await response.json();
  } catch {
    return null;
  }
};
