import { Invoice } from '@/types/invoice';

import { DataTable } from './_components/data-table';
import { createColumns } from './_components/columns';

type Props = {
  items: Invoice[];
  onCreateInvoice: (_item: Invoice) => void;
};

export default function TableInvoices({ items, onCreateInvoice }: Props) {
  const columns = createColumns();

  return (
    <DataTable
      data={items}
      columns={columns}
      onCreateInvoice={onCreateInvoice}
    />
  );
}