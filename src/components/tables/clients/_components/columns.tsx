'use client';
import type { Row } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';
import { Check, X } from 'lucide-react';
import { formatDateClassic, formatRegister } from '@/lib/utils';
import { Team } from '@/types/team';

import { DataTableColumnHeader } from './data-table-column-header';

export const taskSchema = z.object({
  id: z.number(),
  identifier: z.string(),
  name: z.string(),
  register: z.string(),
  address: z.string().optional(),
  value: z.number(),
  email: z.string().optional(),
  phone: z.string().optional(),
  sendByWhatsapp: z.boolean(),
  sendByEmail: z.boolean(),
  memberId: z.string(),
  observation: z.string().optional(),
  createdAt: z.string(),
  dueAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

function handlerMemberLabel(memberId: string, team: Team[]) {
  if (!memberId) return '';

  return team.findLast((item) => item.value === memberId)?.label || '';
}

function formatMoney(value: string) {
  const numericValue = Number(value);
  if (isNaN(numericValue)) return 'R$ 0,00';

  const valueInReais = numericValue / 100;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valueInReais);
}

function formatPhone(phone: string) {
  if (!phone) return phone;

  const phoneDigits = phone.replace(/\D/g, '');

  if (phoneDigits.length === 13 && phoneDigits.startsWith('55')) {
    const countryCode = phoneDigits.slice(0, 2);
    const areaCode = phoneDigits.slice(2, 4);
    const firstDigit = phoneDigits.slice(4, 5);
    const firstPart = phoneDigits.slice(5, 9);
    const secondPart = phoneDigits.slice(9, 13);

    return `+${countryCode} (${areaCode})${firstDigit} ${firstPart}-${secondPart}`;
  }
  else if (phoneDigits.length === 11) {
    const areaCode = phoneDigits.slice(0, 2);
    const firstDigit = phoneDigits.slice(2, 3);
    const firstPart = phoneDigits.slice(3, 7);
    const secondPart = phoneDigits.slice(7, 11);

    return `(${areaCode})${firstDigit} ${firstPart}-${secondPart}`;
  }
  else if (phoneDigits.length === 10) {
    const areaCode = phoneDigits.slice(0, 2);
    const firstPart = phoneDigits.slice(2, 6);
    const secondPart = phoneDigits.slice(6, 10);

    return `(${areaCode}) ${firstPart}-${secondPart}`;
  }

  return phone;
}

// Modificar a função columns para receber o team como parâmetro
export const createColumns = (team: Team[]): ColumnDef<Task>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="h-4 w-4"
        />
      </div>
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onClick={(event) => event.stopPropagation()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="h-4 w-4"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'identifier',
    header: ({ column }) => (
      <div className="flex items-center justify-center mr-10">
        <DataTableColumnHeader column={column} title="Número de Cliente" />
      </div>
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-auto font-semibold">{row.getValue('identifier')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Cliente" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-60">{row.getValue('name')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'memberId',
    header: ({ column }) => (
      <div className="flex items-center justify-center w-auto mx-20">
        <DataTableColumnHeader column={column} title="Membro Responsável" />
      </div>
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className='flex justify-center items-center'>
        <Badge variant="style">{handlerMemberLabel(row.getValue('memberId'), team)}</Badge>
      </div>
    ),
    filterFn: (row: Row<Task>, id: string, value: unknown[]): boolean => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'register',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cnpj/Cpf" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-48">{formatRegister(row.getValue('register'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Endereço" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-auto">{row.getValue('address')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <div className="flex items-center justify-center w-auto mx-10">
        <DataTableColumnHeader column={column} title="Valor Mensal" />
      </div>
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className='flex justify-center items-center'>
        <Badge variant="style">{formatMoney(row.getValue('value'))}</Badge>
      </div>
    ),
    filterFn: (row: Row<Task>, id: string, value: unknown[]): boolean => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-auto mr-10">{row.getValue('email')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Whatsapp" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-48 font-semibold">{formatPhone(row.getValue('phone'))}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'sendBilling',
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <DataTableColumnHeader column={column} title="Enviar Cobrança" />
      </div>
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-auto flex items-center justify-center">{row.getValue('sendBilling') ? <Check className='size-4' /> : <X className='size-4' />}</div>
    ),
    filterFn: (row: Row<Task>, id: string, value: unknown[]): boolean => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'sendByWhatsapp',
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <DataTableColumnHeader column={column} title="Enviar no Whatsapp" />
      </div>
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-auto flex items-center justify-center">{row.getValue('sendByWhatsapp') ? <Check className='size-4' /> : <X className='size-4' />}</div>
    ),
    filterFn: (row: Row<Task>, id: string, value: unknown[]): boolean => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'sendByEmail',
    header: ({ column }) => (
      <div className="flex items-center justify-center">
        <DataTableColumnHeader column={column} title="Enviar no Email" />
      </div>
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-auto flex items-center justify-center">{row.getValue('sendByEmail') ? <Check className='size-4' /> : <X className='size-4' />}</div>
    ),
    filterFn: (row: Row<Task>, id: string, value: unknown[]): boolean => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'dueAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pagamento em" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-60 text-neutral-500">{formatDateClassic(row.getValue('dueAt'))}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-60 text-neutral-500">{formatDateClassic(row.getValue('createdAt'))}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
];
