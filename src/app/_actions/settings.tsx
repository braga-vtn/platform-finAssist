'use server';
import { httpRequest } from '@/lib/httpRequest';
import { client } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export const getProfile = async (userId: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        avatar: true,
        name: true,
        email: true,
        createdAt: true,
        register: true,
        city: true,
        uf: true,
        zipcode: true,
        address: true,
        neighborhood: true,
      },
    });

    if (user) {
      return {
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        register: user.register,
        city: user.city,
        uf: user.uf,
        zipcode: user.zipcode,
        address: user.address,
        neighborhood: user.neighborhood,
      };
    }

    return null;
  } catch {
    return null;
  }
};

export const getUrlUpload = async (fileType: string, userId: string) => {
  try {
    const response = await httpRequest<{ url: string }>({
      path: '/v1/upload',
      method: 'POST',
      bearerEncryption: {
        activationKey: '',
        userId,
      },
      body: {
        fileName: `cdn/assets/${userId}/${uuidv4()}`,
        fileType,
      },
    });

    return response;
  } catch {
    return false;
  }
};

export const updateProfile = async (profileImageID: string, name: string, register: string, city: string, uf: string, zipcode: string, address: string, neighborhood: string, userId: string) => {
  try {
    await client.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        avatar: profileImageID,
        name,
        register,
        city,
        uf,
        zipcode,
        address,
        neighborhood,
      },
    });

    await client.team.updateMany({
      where: {
        ownerId: userId,
      },
      data: {
        avatarCompany: profileImageID,
        nameCompany: name,
      },
    });

    return true;
  } catch {
    return false;
  }
};

export const getTeam = async (userId: string) => {
  try {
    const team = await client.team.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        email: true,
        memberId: true,
      },
    });

    return team;
  } catch {
    return null;
  }
};

export const postTeam = async (email: string, userId: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        avatar: true,
        name: true,
        email: true,
        parentId: true,
      },
    });

    if (!user) {
      throw new Error();
    }

    if (email === user.email) {
      throw new Error();
    }

    const member = await client.user.findUnique({
      where: {
        email,
      },
      select: {
        avatar: true,
        name: true,
        clerkId: true,
        parentId: true,
      },
    });

    if (!member) {
      throw new Error();
    }

    const isMember = await client.team.findFirst({
      where: {
        parentId: user.parentId,
        memberId: member.clerkId,
      },
      select: {
        id: true,
      },
    });

    if (isMember) {
      throw new Error();
    }

    return await client.team.create({
      data: {
        parentId: user.parentId,
        avatar: member.avatar,
        name: member.name,
        email,
        avatarCompany: user.avatar,
        nameCompany: user.name,
        ownerId: userId,
        memberId: member.clerkId,
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        email: true,
      }
    });
  } catch {
    return null;
  }
};

export const deleteTeam = async (email: string, userId: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        parentId: true,
      },
    });

    if (!user) {
      throw new Error();
    }

    const member = await client.user.findUnique({
      where: {
        email,
      },
      select: {
        clerkId: true,
      },
    });

    if (!member) {
      throw new Error();
    }

    await client.team.deleteMany({
      where: {
        parentId: user.parentId,
        memberId: member.clerkId,
      },
    });

    await client.clients.updateMany({
      where: {
        memberId: member.clerkId,
      },
      data: {
        memberId: userId,
      }
    });

    return true;
  } catch {
    return false;
  }
};

interface InterConfig {
  clientId: string;
  secretId: string;
  cert: string;
  key: string;
  accessToken?: string;
}

interface WhatsappConfig {
  whatsappBusinessId: string;
  systemAccessToken: string;
  phoneNumberId: string;
  templateName: string;
}

interface EmailConfig {
  from: string;
  host: string;
  port: string;
  user: string;
  password: string;
}

interface IntegrationConfigs {
  inter: InterConfig;
  whatsapp: WhatsappConfig;
  email: EmailConfig;
}

export const getIntegrations = async (userId: string): Promise<IntegrationConfigs | null> => {
  try {
    const integrations = await client.integrations.findMany({
      where: { userId },
      select: {
        type: true,
        config: true,
      },
    });

    const defaultValues: IntegrationConfigs = {
      inter: {
        clientId: "",
        secretId: "",
        cert: "",
        key: "",
        accessToken: ""
      },
      whatsapp: {
        whatsappBusinessId: "",
        systemAccessToken: "",
        phoneNumberId: "",
        templateName: "",
      },
      email: {
        from: "",
        host: "",
        port: "",
        user: "",
        password: "",
      },
    };

    const result: IntegrationConfigs = {
      inter: { ...defaultValues.inter },
      whatsapp: { ...defaultValues.whatsapp },
      email: { ...defaultValues.email },
    };

    for (const integration of integrations) {
      const { type, config } = integration;

      if (
        typeof config === "object" &&
        config !== null &&
        !Array.isArray(config)
      ) {
        switch (type) {
        case "inter":
          result.inter = {
            ...defaultValues.inter,
            ...(config as Partial<InterConfig>),
          };
          break;
        case "whatsapp":
          result.whatsapp = {
            ...defaultValues.whatsapp,
            ...(config as Partial<WhatsappConfig>),
          };
          break;
        case "email":
          result.email = {
            ...defaultValues.email,
            ...(config as Partial<EmailConfig>),
          };
          break;
        }
      }
    }

    return result;
  } catch {
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postIntegrations = async (type: string, upt: any, userId: string) => {
  try {
    await httpRequest<{ url: string }>({
      path: `/v1/integrations/${type}`,
      method: 'POST',
      bearerEncryption: {
        activationKey: '',
        userId,
      },
      body: upt,
    });

    return true;
  } catch {
    return false;
  }
};