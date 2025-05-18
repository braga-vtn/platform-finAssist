'use client';
import { createInvoice, getInvoices, onCancel, onDelete } from "@/app/_actions/invoices";
import TableInvoices from "@/components/tables/invoices";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/context/user";
import { Invoice, Invoice2 } from "@/types/invoice";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [values, setValues] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const invoices = await getInvoices(userId);
        setValues(invoices || []);
      } catch {
        toast('Erro Inesperado', { description: 'Não foi possível buscar os clientes, tente novamente mais tarde!' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCreateInvoice = async(item: Invoice2) => {
    if (!item || !userId) return;

    try {
      const newInvoice = await createInvoice(item, userId);
      if (!newInvoice) {
        throw new Error();
      }

      setValues([newInvoice, ...values]);
      toast('Boleto Gerado', { description: 'O boleto foi gerado com sucesso!' });
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível gerar o boleto, tente novamente mais tarde!' });
    }
  }; 

  const handleCancel = async (id: string) => {
    if (!id || !userId) return;

    try {
      await onCancel(id, userId);
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível cancelar o boleto, tente novamente mais tarde.' });
    } finally {
      setValues((items) =>
        items.map((item) =>
          item.id === id ? { ...item, status: 'canceled' } : item
        )
      );
      toast('Boleto Cancelado', { description: 'O boleto foi encerrado na sua conta do Banco Inter.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!id || !userId) return;

    try {
      await onDelete(id, userId);
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível deletar o boleto, tente novamente mais tarde.' });
    } finally {
      const updatedValues = values.filter(item => item.id !== id);

      setValues(updatedValues);
      toast('Boleto Deletado', { description: 'O boleto foi deletado com sucesso.' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(90vh-50px)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <TableInvoices items={values} onCreateInvoice={handleCreateInvoice} onDelete={handleDelete} onCancel={handleCancel}/>
    </div>
  );
}