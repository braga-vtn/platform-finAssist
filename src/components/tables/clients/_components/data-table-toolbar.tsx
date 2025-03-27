'use client';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Client } from '@/types/client';

import { DataTableCreateClient } from './data-table-create-client';
import { DataTableExport } from './data-table-export';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableDelete } from './data-table-delete';

type Team = {
  value: string;
  label: string;
}

interface DataTableToolbarProps<TData> {
  disabled: boolean;
  team: Team[];
  table: Table<TData>;
  onCreateClient: (_item: Client) => void;
  onDeleteGroupClient: (_ids: number[]) => void;
}

export function DataTableToolbar<TData>({
  disabled,
  team,
  table,
  onCreateClient,
  onDeleteGroupClient,
}: DataTableToolbarProps<TData>): React.JSX.Element {

  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Input
            placeholder='Procurar...'
            disabled={disabled}
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[100px] lg:w-[200px] peer ps-9 bg-neutral-50 dark:bg-neutral-800"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>
        {table.getColumn('memberId') && (
          <DataTableFacetedFilter
            column={table.getColumn('memberId')}
            disabled={disabled}
            title="Equipe"
            options={team}
          />
        )}
      </div>
      <div className="flex flex-row items-center gap-2">
        <DataTableDelete table={table} onDeleteGroupClient={onDeleteGroupClient} />
        <DataTableExport disabled={disabled} table={table} filename="clientes" />
        <DataTableCreateClient disabled={disabled} team={team} onCreateClient={onCreateClient} />
      </div>
    </div>
  );
}
