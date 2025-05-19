'use client';
import { createClient, deleteClient, getClientPageData, updateClient } from "@/app/_actions/clients";
import TableClients from "@/components/tables/clients";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/context/user";
import { Client, Client2, UF } from "@/types/client";
import { Team } from "@/types/team";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [clients, setClients] = useState<Client2[]>([]);
  const [team, setTeam] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const clientPageData = await getClientPageData(userId);

        setTeam(clientPageData?.team || []);
        setClients(clientPageData?.clients || []);
      } catch {
        toast('Erro Inesperado', { description: 'Não foi possível buscar os clientes, tente novamente mais tarde!' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCreateClient = async (item: Client) => {
    if (!item || !userId) return;

    try {
      const newItem = await createClient(item, userId);
      if (!newItem) {
        throw new Error();
      }

      setClients([newItem, ...clients]);
      toast('Cliente Criado', { description: 'Um cliente foi adicionado com sucesso e suas configurações de cobranças salvas!' });
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível adicionar o cliente, tente novamente mais tarde!' });
    }
  };

  const handleUpdateClient = async (item: Client) => {
    if (!item || !userId) return;

    try {
      const uptClient = await updateClient(item, userId);
      if (!uptClient) {
        throw new Error();
      }

      const clientIndex = clients.findIndex(client => client.identifier === item.identifier);
      if (clientIndex !== -1) {
        const updatedValues = [...clients];
        updatedValues[clientIndex] = {
          ...updatedValues[clientIndex],
          ...item,
          id: updatedValues[clientIndex].id,
          uf: item.uf as UF,
        };

        setClients(updatedValues);
        toast('Cliente Atualizado', { description: 'O cliente foi atualizado com sucesso!' });
      }
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível atualizar o cliente, tente novamente mais tarde!' });
    }
  };

  const handleDeleteClient = async(ids: number[]) => {
    if (ids.length === 0 || !userId) return;

    try {
      const uptClient = await deleteClient(ids, userId);
      if (!uptClient) {
        throw new Error();
      }
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível deletar o cliente, tente novamente mais tarde!' });
    } finally {
      const updatedValues = clients.filter(client => !ids.includes(client.id));

      setClients(updatedValues);
      toast('Cliente Deletado', { description: 'O cliente foi deletado com sucesso. A configuração de cobrança dele está removida!' });
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
      <TableClients
        items={clients}
        team={team}
        onCreateClient={handleCreateClient}
        onUpdateClient={handleUpdateClient}
        onDeleteClient={handleDeleteClient}
      />
    </div>
  );
}