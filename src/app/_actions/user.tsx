'use server';
import { client } from '@/lib/prisma';

export const getUserByXr = async (xr: string) => {
  try {
    const tokenUser = await client.token.findUnique({
      where: {
        token: xr,
        type: 'refresh'
      },
      select: {
        userId: true
      },
    });

    if (!tokenUser || !tokenUser?.userId) {
      return null;
    }

    const user = await client.user.findUnique({
      where: {
        clerkId: tokenUser.userId,
      },
      select: {
        clerkId: true,
        name: true,
        email: true,
        avatar: true,
        parent: true,
      },
    });

    const accounts = [];

    if (user) {
      accounts.push({
        id: user.clerkId,
        type: 'me',
        selected: false,
        name: user.name,
        avatar: user.avatar,
      });

      const team = await client.team.findMany({
        where: {
          memberId: user.clerkId,
        },
        select: { 
          ownerId: true,
          avatarCompany: true,
          nameCompany: true,
          email: true,
        },
      });

      if (team && team.length > 0) {
        team.forEach(member => {
          accounts.push({
            id: member.ownerId,
            type: 'member',
            selected: false,
            name: member.nameCompany,
            avatar: member.avatarCompany,
          });
        });
      }

      return {
        userId: user.clerkId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        parent: user.parent,
        accounts
      };
    }

    return null;
  } catch {
    return null;
  }
};

export const getUserByParentId = async (userId: string, parentId: string) => {
  try {
    const parent = await client.user.findUnique({
      where: {
        parentId,
      },
      select: {
        clerkId: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    if (!parent || !parent.clerkId) {
      return null;
    }

    const isMember = await client.team.findFirst({
      where: {
        ownerId: parent.clerkId,
        memberId: userId,
      },
      select: {
        id: true
      },
    });

    if (isMember) {
      return {
        userId: parent.clerkId,
        name: parent.name,
        email: parent.email,
        avatar: parent.avatar,
      };
    }

    return null;
  } catch {
    return null;
  }
};