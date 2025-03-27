'use client';
import TableClients from "@/components/tables/clients";
import { Client } from "@/types/client";
import { useState } from "react";
import { toast } from "sonner";

const Items = [
  {
    id: 1,
    identifier: '01nf941',
    name: 'Matheus Braga',
    register: '70650085175',
    address: 'Av. Brasil, Qd. 123, N° 123, Lt. 1',
    value: '350000',
    email: 'matheusbr722@gmail.com',
    phone: '+5562985095500',
    SendByWhatsapp: false,
    SendByEmail: false,
    memberId: '26d16167-0867-4ef6-b519-62eb04c6d190',
    observation: 'Através de sua representação nos diálogos de seus estudantes, Sócrates tornou-se renomado por sua contribuição no campo da ética.',
    dueAt: '2025-04-11 20:56:02.957',
    createdAt: '2025-03-11 20:56:02.957',
  },
  {
    id: 2,
    identifier: '02kd842',
    name: 'Lucas Oliveira',
    register: '10234567890',
    address: 'Rua das Palmeiras, N° 45, Apt. 301',
    value: '280000',
    email: 'lucas.oli@gmail.com',
    phone: '+5562998765432',
    SendByWhatsapp: true,
    SendByEmail: false,
    memberId: '26d16167-0867-4ef6-b519-62eb04c6d190',
    observation: 'Lucas é um entusiasta da tecnologia e investidor do mercado imobiliário.',
    dueAt: '2025-05-12 18:30:15.432',
    createdAt: '2025-03-12 14:25:10.765',
  },
  {
    id: 3,
    identifier: '03pm753',
    name: 'Carla Mendes',
    register: '20987654321',
    address: 'Av. Central, Qd. 89, N° 78, Lt. 5',
    value: '450000',
    email: 'carla.mds@gmail.com',
    phone: '+5562987654321',
    SendByWhatsapp: false,
    SendByEmail: true,
    memberId: '26d16167-0867-4ef6-b519-62eb04c6d190',
    observation: 'Especialista em finanças, Carla tem experiência com grandes investimentos.',
    dueAt: '2025-06-20 12:00:00.000',
    createdAt: '2025-03-13 09:10:05.789',
  },
  {
    id: 4,
    identifier: '04bn684',
    name: 'Fernando Lima',
    register: '30876543210',
    address: 'Rua Bela Vista, N° 32, Casa 2',
    value: '390000',
    email: 'fernando.lima@gmail.com',
    phone: '+5562932145678',
    SendByWhatsapp: true,
    SendByEmail: true,
    memberId: '26d16167-0867-4ef6-b519-62eb04c6d190',
    observation: 'Investidor de startups e entusiasta da inovação.',
    dueAt: '2025-07-01 16:45:30.123',
    createdAt: '2025-03-14 11:20:15.908',
  },
  {
    id: 5,
    identifier: '05cv321',
    name: 'Amanda Souza',
    register: '40765432109',
    address: 'Av. Independência, N° 1500, Bl. A',
    value: '500000',
    email: 'amanda.souza@gmail.com',
    phone: '+5562912345678',
    SendByWhatsapp: false,
    SendByEmail: false,
    memberId: '26edce72-7bb6-4618-9fb4-5119d8fb4df5',
    observation: 'Empreendedora do setor de tecnologia.',
    dueAt: '2025-08-15 08:30:45.567',
    createdAt: '2025-03-15 17:05:30.111',
  },
  {
    id: 6,
    identifier: '06mn987',
    name: 'Roberto Silva',
    register: '50987654321',
    address: 'Rua da Paz, N° 200, Lt. 8',
    value: '275000',
    email: 'roberto.silva@gmail.com',
    phone: '+5562987650987',
    SendByWhatsapp: true,
    SendByEmail: true,
    memberId: '26edce72-7bb6-4618-9fb4-5119d8fb4df5',
    observation: 'Corretor de imóveis com vasta experiência.',
    dueAt: '2025-09-10 14:20:00.789',
    createdAt: '2025-03-16 10:40:25.654',
  },
  {
    id: 7,
    identifier: '07bg654',
    name: 'Juliana Castro',
    register: '60987654320',
    address: 'Rua das Acácias, N° 99, Casa 1',
    value: '310000',
    email: 'juliana.castro@gmail.com',
    phone: '+5562923456789',
    SendByWhatsapp: false,
    SendByEmail: true,
    memberId: '26edce72-7bb6-4618-9fb4-5119d8fb4df5',
    observation: 'Advogada especializada em direito empresarial.',
    dueAt: '2025-10-05 09:15:10.345',
    createdAt: '2025-03-17 08:50:40.432',
  },
  {
    id: 8,
    identifier: '08rk213',
    name: 'Paulo Henrique',
    register: '70987654319',
    address: 'Av. Paulista, N° 1000, Bl. B',
    value: '600000',
    email: 'paulo.henrique@gmail.com',
    phone: '+5562954321098',
    SendByWhatsapp: true,
    SendByEmail: false,
    memberId: '4d98b90b-1b71-4b2c-a888-b94d66e20fe8',
    observation: 'Engenheiro civil especialista em grandes construções.',
    dueAt: '2025-11-22 13:10:55.678',
    createdAt: '2025-03-18 15:35:20.987',
  },
  {
    id: 9,
    identifier: '09lm875',
    name: 'Vanessa Martins',
    register: '80987654318',
    address: 'Rua Central, N° 250, Apt. 502',
    value: '420000',
    email: 'vanessa.martins@gmail.com',
    phone: '+5562945678901',
    SendByWhatsapp: false,
    SendByEmail: true,
    memberId: '4d98b90b-1b71-4b2c-a888-b94d66e20fe8',
    observation: 'CEO de uma startup de tecnologia financeira.',
    dueAt: '2025-12-15 18:00:45.234',
    createdAt: '2025-03-19 19:10:10.543',
  },
  {
    id: 10,
    identifier: '10qp432',
    name: 'Ricardo Almeida',
    register: '90987654317',
    address: 'Rua Nova, N° 78, Bl. C',
    value: '350000',
    email: 'ricardo.almeida@gmail.com',
    phone: '+5562967890123',
    SendByWhatsapp: true,
    SendByEmail: false,
    memberId: '4d98b90b-1b71-4b2c-a888-b94d66e20fe8',
    observation: 'Especialista em investimentos imobiliários.',
    dueAt: '2026-01-20 10:30:15.876',
    createdAt: '2025-03-20 14:25:55.678',
  }
];

type Item = {
  id: number;
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
  createdAt: string;
};

const team = [
  {
    value: '26d16167-0867-4ef6-b519-62eb04c6d190',
    label: 'matheus Braga',
  },
  {
    value: '26edce72-7bb6-4618-9fb4-5119d8fb4df5',
    label: 'Bruna Martins',
  },
  {
    value: '4d98b90b-1b71-4b2c-a888-b94d66e20fe8',
    label: 'Giovanna Silva',
  }
];

export default function Page() {
  const [values, setValues] = useState<Item[]>(Items);

  const handleUpdateClient = (item: Client) => {
    const clientIndex = values.findIndex(client => client.identifier === item.identifier);

    if (clientIndex !== -1) {
      const updatedValues = [...values];
      updatedValues[clientIndex] = {
        ...updatedValues[clientIndex],
        ...item,
        id: updatedValues[clientIndex].id
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
    const newItem = { ...item, id: newId, value: numericValue, createdAt: new Date().toISOString() };

    setValues([newItem, ...values]);
    toast('Cliente Criado', { description: 'Um cliente foi adicionado com sucesso e suas configurações de cobranças salvas!' });
  };

  return (
    <div className='space-y-4'>
      <TableClients
        items={values}
        companyOwner="1"
        team={team}
        onCreateClient={handleCreateClient}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
        onDeleteGroupClient={handleDeleteGroupClient}
      />
    </div>
  );
}