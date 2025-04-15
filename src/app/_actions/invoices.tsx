'use server';
import { client } from '@/lib/prisma';

export const getClientPageData = async (userId: string) => { 
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        name: true,
      },
    });

    if (!user || !user.name) {
      throw new Error();
    }

    const clients = await client.clients.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        identifier: true,
        name: true,
        register: true,
        city: true,
        uf: true,
        zipcode: true,
        neighborhood: true,
        address: true,
        value: true,
        email: true,
        phone: true,
        SendByWhatsapp: true,
        SendByEmail: true,
        memberId: true,
        observation: true,
        dueAt: true,
        createdAt: true,
      }
    });

    return clients;
  } catch {
    return null;
  }
};
