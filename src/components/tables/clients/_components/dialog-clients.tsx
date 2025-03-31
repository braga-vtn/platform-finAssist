'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form } from '@/components/ui/form';
import { ProfileForm } from '@/app/(main)/(pages)/clients/_components/userForm';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Client } from '@/types/client';
import { states } from '@/constants/infra';

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "" }),
  register: z.string().min(1, { message: "" }),
  identifier: z.string().min(1, { message: "" }),
  city: z.string().min(1, { message: "" }),
  uf: z.enum(states, { message: "" }),
  zipcode: z.string().min(1, { message: "" }),
  neighborhood: z.string().min(1, { message: "" }),
  address: z.string().optional(),
  dueAt: z.string().min(1, { message: "" }),
  value: z.string().min(1, { message: "" }),
  email: z.string().optional(),
  phone: z.string().optional(),
  SendByWhatsapp: z.boolean().default(false),
  SendByEmail: z.boolean().default(false),
  memberId: z.string().min(1, { message: "" }),
  observation: z.string().optional(),
});

type UF = (typeof states)[number];

type Item = {
  id: number;
  identifier: string;
  name: string;
  register: string;
  city: string;
  uf: UF;
  zipcode: string;
  neighborhood: string;
  address?: string | undefined;
  value: string;
  email?: string | undefined;
  phone?: string | undefined;
  SendByWhatsapp: boolean;
  SendByEmail: boolean;
  memberId: string;
  observation?: string | undefined;
  dueAt: string;
  createdAt?: string;
};

type Team = {
  value: string;
  label: string;
}

type Props = {
  title: string;
  description: string;
  item: Item | null;
  open: boolean;
  team: Team[];
  onOpenChange: (_open: boolean) => void;
  onUpdateClient: (_item: Client) => void;
  onDeleteClient: (_id: number) => void;
};

const DialogClients = ({ open, item, team, onOpenChange, onUpdateClient, onDeleteClient }: Props): React.JSX.Element => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 1,
      name: '',
      register: '',
      identifier: '',
      city: "",
      uf: "SP",
      zipcode: "",
      neighborhood: "",
      address: '',
      dueAt: '',
      value: '',
      email: '',
      phone: '',
      SendByWhatsapp: false,
      SendByEmail: false,
      memberId: '',
      observation: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (item) {
      form.reset({
        id: item.id,
        name: item.name,
        register: item.register,
        identifier: item.identifier,
        city: item.city,
        uf: item.uf,
        zipcode: item.zipcode,
        neighborhood: item.neighborhood,
        address: item.address ?? '',
        dueAt: item.dueAt,
        value: item.value,
        email: item.email ?? '',
        phone: item.phone ?? '',
        SendByWhatsapp: item.SendByWhatsapp,
        SendByEmail: item.SendByEmail,
        memberId: item.memberId,
        observation: item.observation ?? '',
      });
    }
  }, [item, form]);

  function onSubmit() {
    const values = form.getValues();
    if (!form.formState.isValid) {
      toast('Formulário Incompleto', {
        description: 'Você não preencheu todos os campos obrigatórios do formulário!',
      });
      return;
    }

    onUpdateClient(values);
  }

  const handleDeleteClient = (id: number | null) => {
    if (!id) {
      toast('Cliente não Encontrado', {
        description: 'Não foi possível deletar o cliente pois ele não foi encotrado.',
      });
      return;
    }

    onDeleteClient(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 sm:max-h-[min(640px,80vh)] p-1 sm:max-w-7/12 [&>button:last-child]:hidden">
        <ScrollArea className="flex max-h-full flex-col">
          <Form {...form}>
            <form className="space-y-6">
              <DialogHeader className="contents space-y-0 text-left">
                <DialogTitle className="flex flex-row justify-between items-center p-5">
                  Atualizar Cliente
                  <DialogClose onClick={() => handleDeleteClient(item ? item.id : null)} className='flex flex-row items-center gap-1 font-normal text-sm hover:underline text-muted-foreground cursor-pointer' asChild>
                    <span >
                      <Trash2 className='size-3.5' />
                      Deletar Cliente
                    </span>
                  </DialogClose>
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="p-5">
                    <ProfileForm form={form} team={team} />
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="p-5 w-full">
                <DialogClose asChild>
                  <Button
                    disabled={!form.formState.isValid}
                    variant="style"
                    className="w-full"
                    onClick={onSubmit}
                  >
                    Atualizar Cliente
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DialogClients;