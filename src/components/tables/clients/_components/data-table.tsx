'use client';
import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@/components/ui/table';
import { Client } from '@/types/client';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

type Team = {
  value: string;
  label: string;
}

interface DataTableProps<TData, TValue> {
  companyOwner: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  team: Team[];
  onSelect?: (_id: number) => void;
  onCreateClient: (_item: Client) => void;
  onDeleteGroupClient: (_ids: number[]) => void;
}

export function DataTable<TData, TValue>({
  companyOwner,
  columns,
  team,
  data,
  onSelect,
  onCreateClient,
  onDeleteGroupClient,
}: DataTableProps<TData, TValue>): React.JSX.Element {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    enableRowSelection: true,
    globalFilterFn: (row, columnId, filterValue) => {
      const { identifier, name, register, email, phone } = row.original as {
        identifier?: string;
        name?: string;
        register?: string;
        email?: string;
        phone?: string;
      };

      const search = String(filterValue).toLowerCase();

      const found =
        (identifier && identifier.includes(search)) ||
        (name && name.toLowerCase().includes(search)) ||
        (register && register.toLowerCase().includes(search)) ||
        (email && email.toLowerCase().includes(search)) ||
        (phone && phone.toLowerCase().includes(search));

      return !!found;
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar disabled={!companyOwner} table={table} team={team} onCreateClient={onCreateClient} onDeleteGroupClient={onDeleteGroupClient} />
      <div className="rounded-md border dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shadow-md -mt-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRowHeader key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRowHeader>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='cursor-pointer'
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} onClick={() => onSelect ? onSelect((row.original as { id: number }).id) : null}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
