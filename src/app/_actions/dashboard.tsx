'use server';
import { client } from '@/lib/prisma';
import { httpRequest } from '@/lib/httpRequest';
import { InsightsProps } from '@/types/dashboard';

import { getTeam } from './settings';

export const getMembers = async (userId: string) => {
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

    const formattedTeam = [
      { value: userId, label: user.name },
      ...(team?.length
        ? team.map(t => ({
          value: t.memberId,
          label: t.name,
        }))
        : [])
    ];

    return formattedTeam;
  } catch {
    return null;
  }
};

export const insightsData = async (start: string, end: string, members: string[], userId: string) => {
  try {
    const membersParam = members.length > 0 ? `${members.join(',')}` : '';
    const insights = await httpRequest<InsightsProps>({
      path: `/v1/insights?start=${start}&end=${end}&members=${membersParam}`,
      method: 'GET',
      bearerEncryption: {
        activationKey: '',
        userId,
      },
    });

    return insights;
  } catch {
    return null;
  }
};
