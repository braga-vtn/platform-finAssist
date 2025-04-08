'use server';
import { v4 as uuidv4 } from 'uuid';
import { SignJWT, jwtVerify } from 'jose';

const encryptionKey = process.env.ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error('The Encryption_Key encryption key was not found');
}

if (!encryptionKey) {
  throw new Error('The Encryption_Key encryption key was not found');
}

export async function generateToken(
  expiresInSeconds?: number,
  bearerEncryption?: { domain: string; userId: string; companyId: string }
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: Record<string, any> = {
    type: 'system',
    jti: uuidv4(),
    iat: now,
    exp: now + (expiresInSeconds || 60),
    ...bearerEncryption,
  };

  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('Encryption key not found');
  }
  const secret = new TextEncoder().encode(encryptionKey);

  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);
    return token;
  } catch {
    throw new Error('Token generation failed');
  }
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    if (!token) return false;
    
    const secret = new TextEncoder().encode(process.env.ENCRYPTION_KEY);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}