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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/context/user";
import { Spinner } from "@/components/ui/spinner";
import { deleteTeam, getTeam, postTeam } from "@/app/_actions/settings";

type teamData = {
  id: string;
  avatar: string | null;
  name: string;
  email: string;
}

export const TeamTabs = () => {
  const [members, setMembers] = useState<teamData[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<teamData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const teamData = await getTeam(userId);
        if (!teamData) {
          throw new Error();
        }

        setMembers(teamData || []);
        setFilteredMembers(teamData || []);
      } catch {
        toast('Erro Inesperado', { description: 'Não foi possível buscar sua equipe, tente novamente mais tarde!' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleActionDialog = async (type: string, email: string) => {
    if (!userId) return;
    
    if (type === 'create') {
      if (!email) {
        toast('Email Inválido', { description: 'Você não informou um email válido!' });
        return;
      }

      try {
        const member = await postTeam(email, userId);
        if (!member) {
          throw new Error();
        }

        setMembers(prevMembers => [...prevMembers, member]);
        setFilteredMembers(prevMembers => [...prevMembers, member]);

        toast('Membro Adicionado', { description: 'O novo membro está adicionado em sua equipe!' });
      } catch {
        toast('Erro Inesperado', { description: 'Não foi possível adicionar um membro em sua equipe, tente novamente mais tarde!' });
      }

      return;
    }

    try {
      const member = await deleteTeam(email, userId);
      if (!member) {
        throw new Error();
      }

      const remainingMembers = members.filter((item) => item.email !== email);
      setMembers(remainingMembers);
      setFilteredMembers(remainingMembers);

      toast('Membro Removido', { description: `O membro ${email} foi removido da sua equipe com sucesso!` });
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível remover um membro em sua equipe, tente novamente mais tarde!' });
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(90vh-50px)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-3/5 mt-4">
      <HeaderTeamTabs onSearch={handleSearch} onActionDialog={handleActionDialog} />
      {filteredMembers.length > 0 ?
        filteredMembers.map((item) =>
          <ItemTeamTabs key={item.id} name={item.name} avatar={item.avatar || ''} email={item.email} onActionDialog={handleActionDialog} />
        )
        :
        <p className="mt-48 text-sm text-muted-foreground text-center">Nenhum membro encontrado</p>
      }
    </div>
  );
};

type HeaderTeamProps = {
  onSearch: (_term: string) => void;
  onActionDialog: (_type: string, _email: string) => void;
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
  onActionDialog: (_type: string, _email: string) => void;
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
  onActionDialog: (_type: string, _email: string) => void;
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