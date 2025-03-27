'use client';
import React from 'react';
import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

interface DataTableDeleteProps<TData> {
  table: Table<TData>;
  onDeleteGroupClient: (_ids: number[]) => void;
}

export function DataTableDelete<TData>({
  table,
  onDeleteGroupClient,
}: DataTableDeleteProps<TData>): React.JSX.Element | null {

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => (row.original as { id: number }).id);

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    onDeleteGroupClient(selectedIds);
    table.toggleAllRowsSelected(false);
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      className="h-8 border"
      onClick={handleSubmit}
    >
      Excluir
    </Button>
  );
}
