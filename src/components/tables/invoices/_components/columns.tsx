'use client';
import type { Row } from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { formatDateClassic } from '@/lib/utils';

import { DataTableColumnHeader } from './data-table-column-header';
import { status } from './const';
import { DataTableRowActions } from './data-table-row-actions';

export const taskSchema = z.object({
  id: z.string(),
  externalId: z.string(),
  identifier: z.string(),
  status: z.string(), // paid, pending or canceled
  value: z.number(),
  fileUrl: z.string().optional(),
  pixCode: z.string().optional(),
  dueAt: z.string(),
  createdAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

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

export const createColumns = (): ColumnDef<Task>[] => [
  {
    accessorKey: 'identifier',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número de Cliente" />
    ),
    cell: ({ row }: { row: Row<Task> }) => (
      <div className="w-auto font-semibold">{row.getValue('identifier')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <div className="flex items-center justify-center w-auto mx-20">
        <DataTableColumnHeader column={column} title="Status de Pagamento" />
      </div>
    ),

    cell: ({ row }: { row: Row<Task> }) => {
      const statusValue = status.find((item) => item.value === row.getValue('status'));
      if (!statusValue) {
        return null;
      }

      return (
        <div className='flex justify-center items-center'>
          <div className="flex w-auto items-center justify-center">
            {statusValue.icon && (
              <statusValue.icon className="mr-2 w-4 h-4 text-muted-foreground" />
            )}
            <span className='text-center'>{statusValue.label}</span>
          </div>
        </div>
      );
    },
    filterFn: (row: Row<Task>, id: string, value: unknown[]): boolean => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <div className="flex items-center justify-center w-auto mx-10">
        <DataTableColumnHeader column={column} title="Valor" />
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
    accessorKey: 'dueAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vencimento em" />
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
    enableHiding: true,
  },
  {
    accessorKey: 'id',
    header: () => (
      null
    ),
    cell: () => (
      null
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fileUrl',
    header: () => (
      null
    ),
    cell: () => (
      null
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'pixCode',
    header: () => (
      null
    ),
    cell: () => (
      null
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions id={row.getValue('id')} fileUrl={row.getValue('fileUrl')} pixCode={row.getValue('pixCode')} />,
  },
];
