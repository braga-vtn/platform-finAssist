export type Invoice = {
  id: string;
  externalId: string;
  identifier: string;
  status: string;
  value: number;
  fileUrl?: string;
  dueAt: string;
  createdAt: string;
};
