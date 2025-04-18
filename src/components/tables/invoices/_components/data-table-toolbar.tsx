'use client';
import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Invoice2 } from '@/types/invoice';

import { DataTableExport } from './data-table-export';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { status } from './const';
import { DataTableCreateInvoice } from './data-table-create-invoice';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onCreateInvoice: (_item: Invoice2) => void;
}

export function DataTableToolbar<TData>({
  table,
  onCreateInvoice,
}: DataTableToolbarProps<TData>): React.JSX.Element {
  return (
    <div className="flex items-center justify-between pb-6">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Input
            placeholder='Procurar...'
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 w-[100px] lg:w-[200px] peer ps-9 bg-neutral-50 dark:bg-neutral-800"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search size={16} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status de pagamento"
            options={status}
          />
        )}
      </div>
      <div className="flex flex-row items-center gap-2">
        <DataTableExport table={table} filename="boletos" />
        <DataTableCreateInvoice onCreateInvoice={onCreateInvoice} />
      </div>
    </div>
  );
}
