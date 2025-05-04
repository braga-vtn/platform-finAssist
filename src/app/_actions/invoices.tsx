'use server';
import { httpRequest } from '@/lib/httpRequest';
import { client } from '@/lib/prisma';
import { UF } from '@/types/client';
import { Invoice, Invoice2 } from '@/types/invoice';
 
export const getInvoices = async (userId: string) => { 
  try {
    const invoices = await client.invoices.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        externalId: true,
        identifier: true,
        status: true,
        value: true,
        pixCode: true,
        fileUrl: true,
        dueAt: true, 
        createdAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const formattedInvoices = invoices.map(item => ({
      ...item,
      pixCode: item.pixCode || '',
      fileUrl: item.fileUrl || '',
      dueAt: item.dueAt.toDateString(),
      createdAt: item.createdAt.toDateString(),
    }));

    return formattedInvoices;
  } catch {
    return null;
  }
};

export const getClients = async (userId: string) => { 
  try {
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
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const formattedClients = clients.map(item => ({
      ...item,
      uf: item.uf as UF,
      dueAt: item.dueAt.toDateString(),
      createdAt: item.createdAt.toDateString(),
    }));

    return formattedClients;
  } catch {
    return null;
  }
};

export const createInvoice = async (item: Invoice2, userId: string) => {
  try {
    const invoice = await httpRequest<Invoice>({
      path: '/v1/invoices',
      method: 'POST',
      bearerEncryption: {
        activationKey: '',
        userId,
      },
      body: item,
    });

    return invoice;
  } catch {
    return null;
  }
};

export const sendNotification = async (id: string, userId: string) => {
  try {
    await httpRequest({
      path: `/v1/notification/${id}`,
      method: 'POST',
      bearerEncryption: {
        activationKey: '',
        userId,
      },
    });

    return true;
  } catch {
    throw new Error();
  }
};