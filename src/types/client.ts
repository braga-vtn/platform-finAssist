export type Client = {
  identifier: string;
  name: string;
  register: string;
  address?: string | undefined;
  value: string;
  email?: string | undefined;
  phone?: string | undefined;
  SendByWhatsapp: boolean;
  SendByEmail: boolean;
  memberId: string;
  observation?: string | undefined;
  dueAt: string;
};