'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const team = [
  {
    id: '26d16167-0867-4ef6-b519-62eb04c6d190',
    name: 'matheus Braga',
    avatar: '',
    email: 'matheusbr722@gmail.com',
  },
  {
    id: '26edce72-7bb6-4618-9fb4-5119d8fb4df5',
    name: 'Bruna Martins',
    avatar: '',
    email: 'bruna@gmail.com',
  },
  {
    id: '4d98b90b-1b71-4b2c-a888-b94d66e20fe8',
    name: 'Giovanna Silva',
    avatar: '',
    email: 'giovanna@gmail.com',
  }
];

export const TeamTabs = () => {
  const [ members, setMembers] = useState(team);
  const [ filteredMembers, setFilteredMembers] = useState(team);

  const handleActionDialog = (type: string, email?: string) => {
    if (type === 'create') {
      if (!email) {
        toast('Email Inválido', { description: 'Você não informou um email válido!' });
        return;
      }
      toast('Convite Enviado', { description: 'O novo membro deve aceitar o seu convite para ser adicionado em sua equipe!' });
      return;
    }

    const remainingMembers = members.filter((item) => item.email !== email);
    setMembers(remainingMembers);
    setFilteredMembers(remainingMembers);
    toast('Membro Removido', { description: `O membro ${email} foi removido da sua equipe com sucesso!` });
  };

  const handleSearch = (term: string) => {
    if (!term) {
      setFilteredMembers(members);
      return;
    }
    
    const searchTerm = term.toLowerCase();
    
    const filteredMembers = members.filter((member) => {
      return (
        member.name.toLowerCase().includes(searchTerm) || 
        member.email.toLowerCase().includes(searchTerm)
      );
    });
    
    setFilteredMembers(filteredMembers);
  };

  return (
    <div className="w-3/5 mt-4">
      <HeaderTeamTabs onSearch={handleSearch} onActionDialog={handleActionDialog} />
      {filteredMembers.map((item) =>
        <ItemTeamTabs key={item.id} name={item.name} avatar={item.avatar} email={item.email} onActionDialog={handleActionDialog} />
      )}
    </div>
  );
};

type HeaderTeamProps = {
  onSearch: (_term: string) => void;
  onActionDialog: (_type: string, _email?: string) => void;
}

const HeaderTeamTabs = ({ onSearch, onActionDialog }: HeaderTeamProps) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="space-y-2 w-72">
        <div className="relative">
          <Input onChange={(e) => onSearch(e.target.value)} className="peer ps-9" placeholder="Procurar..." type="text" />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search size={16} strokeWidth={2} />
          </div>
        </div>
      </div>
      <DialogTeam type='create' onActionDialog={onActionDialog}>
        <Button
          variant="style"
          className="justify-items-center border"
        >
          Novo Membro
        </Button>
      </DialogTeam>
    </div>
  );
};

type ItemTeamProps = {
  avatar: string;
  name: string;
  email: string;
  onActionDialog: (_type: string, _email?: string) => void;
}

const ItemTeamTabs = ({ avatar, name, email, onActionDialog }: ItemTeamProps) => {
  return (
    <DialogTeam type='edit' emailOld={email} onActionDialog={onActionDialog}>
      <Card className="bg-neutral-100 dark:bg-neutral-800 border dark:border-neutral-700 border-neutral-200 shadow-md my-4 py-4 px-0 cursor-pointer">
        <CardContent className="flex flex-row justify-between items-center w-full px-4">
          <div className="flex flex-row gap-4 items-center">
            <Avatar className="size-10 border bg-neutral-200 border-neutral-300 dark:bg-neutral-700 dark:border-neutral-600">
              <AvatarImage src={avatar} alt="@shadcn" />
            </Avatar>
            <p>
              {name}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {email}
          </p>
        </CardContent>
      </Card>
    </DialogTeam>
  );
};

type DialogTeamProps = {
  type: string;
  emailOld?: string;
  children: React.ReactNode;
  onActionDialog: (_type: string, _email?: string) => void;
}

const DialogTeam = ({ type, emailOld, children, onActionDialog }: DialogTeamProps) => {
  const [email, setEmail] = useState(emailOld || "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 sm:max-h-[min(640px,80vh)] sm:max-w-1/3">
        <DialogHeader>
          <DialogTitle>{type === 'create' ? 'Adicionar Membro' : 'Remover Membro'}</DialogTitle>
          <DialogDescription>
            {type === 'create' ? 'Para adicionar um novo membro à sua equipe, ele precisa ter uma conta na plataforma e aceitar o convite enviado por e-mail.' : 'Você pode remover o acesso desse membro à sua conta clicando no botão Remover.'}
          </DialogDescription>
          <Input disabled={type === 'edit'} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email do membro" className="my-4" type="text" />
        </DialogHeader>
        <DialogClose asChild>
          <Button variant="style" onClick={() => onActionDialog(type, email)}>
            {type === 'create' ? 'Adicionar' : 'Remover'}
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};