"use client";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/user";
import { sendNotification } from "@/app/_actions/invoices";

interface Props {
  id: string;
  fileUrl: string;
  pixCode: string;
}

export function DataTableRowActions({ id, fileUrl, pixCode }: Props) {
  const { userId } = useUser();

  const handleCopyPixCode = async () => {
    if (!pixCode) return;

    try {
      await navigator.clipboard.writeText(pixCode);
      toast('Código Copiado', { description: 'A chave Pix foi copiada para sua área de transferência!' });
    } catch {
      toast('Erro ao Copiar', { description: 'Não foi possível copiar o código Pix.' });
    }
  };

  const handleNotification = async () => {
    if (!id || !userId) return;

    try {
      await sendNotification(id, userId);
      toast('Notificação Enviada', { description: 'A notificação foi reenviada para esse cliente.' });
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível reenviar a notificação para esse cliente.' });
    }
  };

  const handleDownload = () => {
    if (!fileUrl) return;

    window.open(fileUrl, '_blank');
    toast('Arquivo Aberto', { description: 'O arquivo em PDF foi aberto em uma nova aba.' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full">
        <DropdownMenuItem disabled={!fileUrl} onClick={handleDownload}>Baixar</DropdownMenuItem>
        <DropdownMenuItem disabled={!id} onClick={handleNotification}>Reenviar Notificação</DropdownMenuItem>
        <DropdownMenuItem disabled={!pixCode} onClick={handleCopyPixCode}>Copiar Pix</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
