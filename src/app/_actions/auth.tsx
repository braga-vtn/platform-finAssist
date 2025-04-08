'use server';
import { apiRequest } from '@/helper/apiRequest';
import { httpRequest } from '@/lib/httpRequest';

type TokenProps = {
  token: string;
  expires: string;
}

type DataLoginAcc = {
  email: string;
  password: string;
}

export const loginAcc = async (data: DataLoginAcc) => {
  try {
    const response = await httpRequest<{ code: number, access: TokenProps, refresh: TokenProps }>({
      path: '/v1/auth/login',
      method: 'POST',
      bearerEncryption: {
        activationKey: '',
        userId: ''
      },
      body: data,
    });

    if (!response || !response.code) {
      throw new Error();
    }

    return response;
  } catch {
    return false;
  }
};

type DataRegisterAcc = {
  name: string;
  email: string;
  password: string;
} 

export const registerAcc = async (data: DataRegisterAcc, activationCode: string) => {
  try {
    const response = await httpRequest<{ code: number, message: string }>({
      path: '/v1/auth/register',
      method: 'POST',
      bearerEncryption: {
        activationKey: activationCode,
        userId: ''
      },
      body: data,
    });

    if (!response || !response.code) {
      throw new Error();
    }

    return response;
  } catch {
    return false;
  }
};

export const resetPasswordAcc = async (email: string, code: string, password: string) => {
  try {
    const response = await httpRequest<{ code: number, message: string }>({
      path: '/v1/auth/reset-password',
      method: 'POST',
      bearerEncryption: {
        activationKey: '',
        userId: '',
        email, 
        code,
      },
      body: { password },
    });

    if (!response || !response.code) {
      throw new Error();
    }

    return response;
  } catch {
    return false;
  }
}; 

export const verifyCodeAcc = async (email: string, code: string) => {
  try {
    const response = await httpRequest<{ code: number, message: string }>({
      path: '/v1/auth/verify-code',
      method: 'POST',
      bearerEncryption: {
        activationKey: '',
        userId: '',
        email,
      },
      body: { code },
    });

    if (!response || !response.code) {
      throw new Error();
    }

    return response;
  } catch {
    return false;
  }
};

export const forgotPasswordAcc = async (email: string) => {
  try {
    const response = await httpRequest<{ code: number, message: string }>({
      path: '/v1/auth/forgot-password',
      method: 'POST',
      bearerEncryption: {
        activationKey: '',
        userId: ''
      },
      body: { email },
    });

    if (!response || !response.code) {
      throw new Error();
    }

    return response;
  } catch {
    return false;
  }
};

export const logoutAcc = async (domain: string) => {
  try {
    await apiRequest(domain, '/api/v1/clear-cookies', {
      method: 'POST'
    });

  } catch {
    throw new Error();
  }
};