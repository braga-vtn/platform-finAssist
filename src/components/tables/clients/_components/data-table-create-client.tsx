'use client';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProfileForm } from '@/app/(main)/(pages)/clients/_components/userForm';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from "sonner";
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Client } from '@/types/client';
import { states } from '@/constants/infra';
import { extractNumericValue } from '@/lib/utils';

type Team = {
  value: string;
  label: string;
}

interface CreateClient {
  team: Team[];
  onCreateClient: (_item: Client) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "" }),
  register: z.string().min(1, { message: "" }),
  identifier: z.string().min(1, { message: "" }),
  city: z.string().min(1, { message: "" }),
  uf: z.enum(states, { message: "" }),
  zipcode: z.string().min(1, { message: "" }),
  neighborhood: z.string().min(1, { message: "" }),
  address: z.string(),
  dueAt: z.string(),
  dueLimitAt: z.string().optional(),
  value: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  sendBilling: z.boolean().default(true),
  sendByWhatsapp: z.boolean().default(false),
  sendByEmail: z.boolean().default(false),
  memberId: z.string().min(1, { message: "" }),
  observation: z.string().optional(),
});

export function DataTableCreateClient({
  team,
  onCreateClient,
}: CreateClient): React.JSX.Element {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      register: "",
      identifier: "",
      city: "",
      uf: "SP",
      zipcode: "",
      neighborhood: "",
      address: "",
      dueAt: new Date().toISOString(),
      dueLimitAt: '',
      value: '0',
      email: "",
      phone: "",
      sendBilling: true,
      sendByWhatsapp: true,
      sendByEmail: false,
      memberId: team && team[0] && team[0].value || "",
      observation: "",
    },
    mode: "onChange",
  });

  function onSubmit() {
    const values = form.getValues();

    if (!values.name || !values.register || !values.identifier) {
      toast('Formulário Incompleto', { description: 'Você não preencheu todos os campos obrigatórios do formulário!' });
      return;
    }

    const data = { ...values, value: extractNumericValue(values.value) };
    onCreateClient(data);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="style"
          className='h-8'
          onClick={() => form.reset()}
        >
          Criar Cliente
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col gap-0 sm:max-h-[min(640px,80vh)] p-1 sm:max-w-7/12 [&>button:last-child]:hidden">
        <ScrollArea className="flex max-h-full flex-col">
          <Form {...form}>
            <form className="space-y-6">
              <AlertDialogHeader className="contents space-y-0 text-left">
                <AlertDialogTitle className='p-5'>Cadastrar Cliente</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="px-5 pb-5">
                    <ProfileForm form={form} team={team} />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className='p-5'>
                <AlertDialogCancel>Fechar</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmit}>Criar Cliente</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}
