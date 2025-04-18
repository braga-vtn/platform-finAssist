export type Invoice = {
  id: string;
  externalId: string;
  identifier: string;
  status: string;
  value: number;
  pixCode?: string;
  fileUrl?: string;
  dueAt: string;
  createdAt: string;
};

export type Invoice2 = {
  identifier: string;
  value: number;
  discount: number;
  fees: number;
  fine: number;
  observation: string;
  dueAt: string;
};
