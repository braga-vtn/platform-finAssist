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

interface Props {
  id: string;
  fileUrl: string;
}

export function DataTableRowActions({ id, fileUrl }: Props) {

  const handleNotification = () => {
    if (!id) return;
    
    toast('Cliente Criado', { description: `${id}` });
  };

  const handleDownload = () => {
    if (!fileUrl) return;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast('Arquivo Baixado', { description: `${fileUrl}` });
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
