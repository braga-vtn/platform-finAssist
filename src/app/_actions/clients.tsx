'use server';
import { client } from '@/lib/prisma';
import { Client, UF } from '@/types/client';

import { getTeam } from './settings';

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

    const team = await getTeam(userId);
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
        sendBilling: true,
        sendByWhatsapp: true,
        sendByEmail: true,
        memberId: true,
        observation: true,
        dueLimitAt: true,
        dueAt: true,
        createdAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const formattedTeam = [
      { value: userId, label: user.name },
      ...(team?.length
        ? team.map(t => ({
          value: t.memberId,
          label: t.name
        }))
        : [])
    ];

    const formattedClients = clients.map(client => ({
      ...client,
      uf: client.uf as UF,
      dueLimitAt: client.dueLimitAt?.toDateString() || '',
      dueAt: client.dueAt.toDateString(),
      createdAt: client.createdAt.toDateString(),
    }));

    return { team: formattedTeam, clients: formattedClients };
  } catch {
    return null;
  }
};

export const createClient = async (item: Client, userId: string) => {
  try {
    const isUsed = await client.clients.findFirst({
      where: { identifier: item.identifier, userId },
      select: { id: true }
    });

    if (isUsed && isUsed.id) {
      throw new Error();
    }

    const newClient = await client.clients.create({
      data: {
        ...item,
        userId,
        dueLimitAt: item.dueLimitAt ? item.dueLimitAt : null,
        address: item.address ?? '',
        email: item.email ?? '',
        phone: item.phone ?? ''
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
        sendBilling: true,
        sendByWhatsapp: true,
        sendByEmail: true,
        memberId: true,
        observation: true,
        dueLimitAt: true,
        dueAt: true,
        createdAt: true,
      }
    });

    return { ...newClient, uf: newClient.uf as UF, dueLimitAt: newClient.dueAt.toDateString(), dueAt: newClient.dueAt.toDateString(), createdAt: newClient.createdAt.toDateString() };
  } catch {
    return null;
  }
};

export const updateClient = async (item: Client, userId: string) => {
  try {
    const dueAtISO =
      item.dueAt && !isNaN(new Date(item.dueAt).getTime())
        ? new Date(item.dueAt).toISOString()
        : new Date().toISOString();

    const dueLimitAtISO =
      item.dueLimitAt && !isNaN(new Date(item.dueLimitAt).getTime())
        ? new Date(item.dueLimitAt).toISOString()
        : null;

    await client.clients.updateMany({
      where: { identifier: item.identifier, userId },
      data: {
        ...item,
        email: item.email ?? '',
        phone: item.phone ?? '',
        dueAt: dueAtISO,
        dueLimitAt: dueLimitAtISO,
      },
    });

    return true;
  } catch {
    return false;
  }
};

export const deleteClient = async (ids: number[], userId: string) => {
  try {
    await client.clients.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });

    return true;
  } catch {
    return false;
  }
};
