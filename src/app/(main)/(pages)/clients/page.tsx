'use client';
import TableClients from "@/components/tables/clients";
import { Clients, team } from "@/constants/faker";
import { states } from "@/constants/infra";
import { Client } from "@/types/client";
import { useState } from "react";
import { toast } from "sonner";

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

export default function Page() {
  const [values, setValues] = useState<Item[]>(Clients as Item[]);

  const handleUpdateClient = (item: Client) => {
    const clientIndex = values.findIndex(client => client.identifier === item.identifier);

    if (clientIndex !== -1) {
      const updatedValues = [...values];
      updatedValues[clientIndex] = {
        ...updatedValues[clientIndex],
        ...item,
        id: updatedValues[clientIndex].id,
        uf: item.uf as UF,
      };

      setValues(updatedValues);
      toast('Cliente Atualizado', { description: 'O cliente foi atualizado com sucesso!' });
    }
  };

  const handleDeleteClient = (id: number) => {
    const updatedValues = values.filter(client => client.id !== id);

    setValues(updatedValues);
    toast('Cliente Deletado', { description: 'O cliente foi deletado com sucesso. A configuração de cobrança dele foi deletada!' });
  };

  const handleDeleteGroupClient = (ids: number[]) => {
    const updatedValues = values.filter(client => !ids.includes(client.id));

    setValues(updatedValues);
    toast('Clientes Deletados', { description: 'Os clientes foram deletados com sucesso. A configuração de cobrança deles foram deletadas!' });
  };

  const handleCreateClient = (item: Client) => {
    const newId = values.length > 0 ? Math.max(...values.map(client => client.id)) + 1 : 1;
    const numericValue = item.value.replace(/[^\d]/g, '');
    const newItem = {
      ...item,
      id: newId,
      value: numericValue,
      createdAt: new Date().toISOString(),
      uf: item.uf as UF,
    };

    setValues([newItem, ...values]);
    toast('Cliente Criado', { description: 'Um cliente foi adicionado com sucesso e suas configurações de cobranças salvas!' });
  };

  return (
    <div className='space-y-4'>
      <TableClients
        items={values}
        team={team}
        onCreateClient={handleCreateClient}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
        onDeleteGroupClient={handleDeleteGroupClient}
      />
    </div>
  );
}