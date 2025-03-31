import { useState } from 'react';
import { Client } from '@/types/client';
import { states } from '@/constants/infra';

import { DataTable } from './_components/data-table';
import DialogClients from './_components/dialog-clients';
import { createColumns } from './_components/columns';

type UF = (typeof states)[number];

type Item = {
  id: number;
  identifier: string;
  name: string;
  register: string;
  city: string;
  uf: UF;
  zipcode: string;
  neighborhood: string;
  address?: string | undefined;
  value: string;
  email?: string | undefined;
  phone?: string | undefined;
  SendByWhatsapp: boolean;
  SendByEmail: boolean;
  memberId: string;
  observation?: string | undefined;
  dueAt: string;
  createdAt: string;
};

type Team = {
  value: string;
  label: string;
}

type Props = {
  items: Item[];
  team: Team[];
  onUpdateClient: (_item: Client) => void;
  onDeleteClient: (_id: number) => void;
  onCreateClient: (_item: Client) => void;
  onDeleteGroupClient: (_ids: number[]) => void;
};

export default function TableClients({ items, team, onUpdateClient, onDeleteClient, onCreateClient, onDeleteGroupClient }: Props) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns = createColumns(team);

  const handleRowSelect = (id: number) => {
    const item = items.find((item) => item.id === id);

    setSelectedItem(item || null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <DataTable
        data={items}
        team={team}
        columns={columns}
        onSelect={handleRowSelect}
        onCreateClient={onCreateClient}
        onDeleteGroupClient={onDeleteGroupClient}
      />
      <DialogClients
        title={''}
        description={''}
        item={selectedItem}
        open={isDialogOpen}
        team={team}
        onOpenChange={setIsDialogOpen}
        onUpdateClient={onUpdateClient}
        onDeleteClient={onDeleteClient}
      />
    </div>
  );
}