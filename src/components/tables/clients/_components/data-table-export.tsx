'use client';
import React from 'react';
import { Table } from '@tanstack/react-table';
import { DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

interface DataTableExportProps<TData> {
  table: Table<TData>;
  filename: string;
  disabled: boolean;
}

export function DataTableExport<TData>({
  table,
  disabled,
  filename
}: DataTableExportProps<TData>): React.JSX.Element {

  const handleExport = () => {
    const headers = table.getFlatHeaders()
      .filter((header) => header.column.id !== 'select')
      .map((header) => {
        if (typeof header.column.columnDef.header === 'string') {
          return header.column.columnDef.header;
        }

        if (typeof header.column.columnDef.header === 'function') {
          try {
            const context = {
              column: header.column,
              header: header,
              table: table
            };

            const headerContent = header.column.columnDef.header(context);
            let title = headerContent.props.title;

            if (!title && headerContent.props.children) {
              const children = Array.isArray(headerContent.props.children)
                ? headerContent.props.children
                : [headerContent.props.children];

              for (const child of children) {
                if (React.isValidElement(child)) {
                  const childElement = child as React.ReactElement<{ title?: string }>;
                  if (childElement.props.title) {
                    title = childElement.props.title;
                    break;
                  }
                }
              }
            }

            return header.column.id;
          } catch {
            return header.column.id;
          }
        }

        return header.column.id || '';
      });

    const selectedRows = table.getSelectedRowModel().rows;
    const rowsToExport = selectedRows.length > 0
      ? selectedRows
      : table.getPrePaginationRowModel().rows;

    const rows = rowsToExport.map((row) =>
      row.getVisibleCells()
        .filter((cell) => cell.column.id !== 'select')
        .map((cell) => cell.getValue())
    );

    const sheetData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');

    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <Button
      variant="style"
      size="icon"
      disabled={disabled}
      className="h-8 w-8 border"
      onClick={handleExport}
    >
      <DownloadIcon className="size-3.5" />
    </Button>
  );
}
