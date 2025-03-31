'use client';
import TableInvoices from "@/components/tables/invoices";
import { invoice } from "@/constants/faker";
import { Invoice } from "@/types/invoice";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [values, setValues] = useState<Invoice[]>(invoice);

  const handleCreateInvoice = (item: Invoice) => {
    setValues([item, ...values]);
    toast('Boleto Gerado', { description: 'O boleto foi gerado com sucesso!' });
  };

  return (
    <div className='space-y-4'>
      <TableInvoices
        items={values}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
}