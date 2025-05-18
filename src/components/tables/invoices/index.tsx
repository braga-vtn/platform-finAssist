import { Invoice, Invoice2 } from '@/types/invoice';

import { createColumns } from './_components/columns';
import { DataTable } from './_components/data-table';

type Props = {
  items: Invoice[];
  onCreateInvoice: (_item: Invoice2) => void;
  onDelete: (_id: string) => void;
  onCancel: (_id: string) => void;
};

export default function TableInvoices({ items, onCreateInvoice, onDelete, onCancel }: Props) {
  const columns = createColumns(onDelete, onCancel);

  return ( 
    <DataTable
      data={items}
      columns={columns}
      onCreateInvoice={onCreateInvoice}
    />
  );
}