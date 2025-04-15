import { useEffect, useState } from 'react';
import { Client, Client2 } from '@/types/client';
import { Team } from '@/types/team';

import { DataTable } from './_components/data-table';
import DialogClients from './_components/dialog-clients';
import { createColumns } from './_components/columns';

type ItemProps = {
  id: number;
  identifier: string;
  name: string;
  register: string;
  address: string | undefined;
  value: number;
  email: string | undefined;
  phone: string | undefined;
  SendByWhatsapp: boolean;
  SendByEmail: boolean;
  memberId: string;
  observation: string | undefined;
  createdAt: string;
  dueAt: string;
}

type Props = {
  items: Client2[];
  team: Team[];
  onUpdateClient: (_item: Client) => void;
  onDeleteClient: (_id: number[]) => void;
  onCreateClient: (_item: Client) => void;
};

export default function TableClients({ items, team, onUpdateClient, onDeleteClient, onCreateClient }: Props) {
  const [selectedItem, setSelectedItem] = useState<Client2 | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tableItems, setTableItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    const formattedItems = items.map((item) => ({
      id: item.id,
      identifier: item.identifier,
      name: item.name,
      register: item.register,
      address: item.address,
      value: item.value,
      email: item.email,
      phone: item.phone,
      SendByWhatsapp: item.SendByWhatsapp,
      SendByEmail: item.SendByEmail,
      memberId: item.memberId,
      observation: item.observation || undefined,
      createdAt: item.createdAt,
      dueAt: item.dueAt,
    }));

    setTableItems(formattedItems);
  }, [items]);

  const columns = createColumns(team);

  const handleRowSelect = (id: number) => {
    const item = items.find((item) => item.id === id);

    setSelectedItem(item || null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <DataTable
        data={tableItems}
        team={team}
        columns={columns}
        onSelect={handleRowSelect}
        onCreateClient={onCreateClient}
        onDeleteGroupClient={onDeleteClient}
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