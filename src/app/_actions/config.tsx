'use server';
import { apiRequest } from '@/helper/apiRequest';
import { client } from '@/lib/prisma';

export const startUse = async (domain: string) => {
  try {
    const xrValue = await apiRequest(domain, '/api/v1/cookie?ck=_xr');
    if (!xrValue || !xrValue.value) {
      throw new Error();
    }

    return await apiRequest(domain, `/api/v1/user?xr=${xrValue.value}`);
  } catch {
    return false;
  }
};
 
export const startParent = async (userId: string, parentId: string, domain: string) => {
  try {
    if (!parentId) return null;

    return await apiRequest(domain, `/api/v1/parent?id=${parentId}&userId=${userId}`);
  } catch {
    return false;
  }
};

export const updateParent = async (parent: string | null, userId: string) => {
  try {
    await client.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        parent
      },
    });
    return true;
  } catch {
    return false;
  }
};