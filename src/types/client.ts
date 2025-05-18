import { states } from "@/constants/infra";

export type Client = {
  identifier: string;
  name: string;
  register: string;
  city: string;
  uf: string;
  zipcode: string;
  neighborhood: string;
  address?: string | undefined;
  value: number;
  email?: string | undefined;
  phone?: string | undefined;
  sendByWhatsapp: boolean;
  sendByEmail: boolean;
  memberId: string;
  observation?: string | undefined | null;
  dueAt: string;
  sendBilling: boolean;
  dueLimitAt?: string | undefined;
};

export type UF = (typeof states)[number];

export type Client2 = {
  id: number;
  identifier: string;
  name: string;
  register: string;
  city: string;
  uf: UF;
  zipcode: string;
  neighborhood: string;
  address?: string | undefined;
  value: number;
  email?: string | undefined;
  phone?: string | undefined;
  sendByWhatsapp: boolean;
  sendByEmail: boolean;
  memberId: string;
  observation?: string | undefined | null;
  dueAt: string;
  createdAt: string;
  sendBilling: boolean;
  dueLimitAt?: string | undefined;
};
