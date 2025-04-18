
'use client';
import { useEffect, useState } from 'react';
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Invoice2 } from '@/types/invoice';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { stepsInvoice } from '@/constants/infra';
import { cn, extractNumericPercent, handleCurrencyChange, parseDate } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from '@/context/user';
import { Client2 } from '@/types/client';
import { getClients } from '@/app/_actions/invoices';

interface CreateInvoice {
  onCreateInvoice: (_item: Invoice2) => void;
}

export function DataTableCreateInvoice({
  onCreateInvoice,
}: CreateInvoice): React.JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [value, setValue] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [formattedValue, setFormattedValue] = useState('0.00');
  const [fees, setFees] = useState('0');
  const [fine, setFine] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [observation, setObservation] = useState<string>('');
  const [clients, setClients] = useState<Client2[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const clients = await getClients(userId) || [];

        const now = new Date();
        const adjustedClients = clients.map(client => {
          const dueDate = new Date(client.dueAt);
          if (dueDate < now) {
            const newDue = new Date();
            newDue.setDate(newDue.getDate() + 3);

            return {
              ...client,
              dueAt: newDue.toISOString(),
            };
          }
          return client;
        });

        setClients(adjustedClients);
      } catch {
        toast('Erro Inesperado', {description:'Não foi possível buscar os clientes, tente novamente mais tarde!'});
      }
    };

    fetchData();
  }, [userId]);

  const handleReset = () => {
    setStep(1);
    setValue('');
    setDate(new Date());
    setFormattedValue('0.00');
    setFees('0');
    setFine('0');
    setDiscount('0');
    setObservation('');
  };

  function onSubmit() {
    const numericValue = parseFloat(formattedValue.replace(/\./g, '').replace(',', '.')) * 100;

    const newInvoice = {
      identifier: value,
      value: numericValue,
      discount: extractNumericPercent(discount),
      fees: extractNumericPercent(fees),
      fine: extractNumericPercent(fine),
      observation,
      dueAt: date.toISOString(),
    };

    onCreateInvoice(newInvoice);
    handleReset();
  }

  function changeStep(type: string) {
    if (type === 'next') {
      const isAllowedJump = handleIsAllowedJump();
      if (isAllowedJump) {
        setStep(step + 1);
      } else {
        toast('Preencha Corretamente', { description: 'Verifique se os campos obrigatórios estão preenchidos corretamente.' });
      }
    } else {
      setStep(step - 1);
    }
  }

  const handleIdentifierChange = (value: string) => {
    const client = clients.find((client) => client.identifier === value);

    setValue(value);
    setDate(client && parseDate(client.dueAt) || new Date());
    setFormattedValue(client && handleCurrencyChange(client.value) || '0.00');
    setObservation(client && client.observation || '');
  };

  const handleOthersValuesChange = (type: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    const clampedValue = Math.max(0, Math.min(100, numericValue));
    const valueAsString = clampedValue.toString();

    switch (type) {
    case 'fees':
      setFees(valueAsString);
      break;
    case 'fine':
      setFine(valueAsString);
      break;
    case 'discount':
      setDiscount(valueAsString);
      break;
    default:
      break;
    }
  };

  function handleStep() {
    switch (step) {
    case 0:
    case 1:
      return <ClientSelect clients={clients} disabled={false} value={value} onSetValue={handleIdentifierChange} />;
    case 2:
      return <CollectionData disabled={false} date={date} formattedValue={formattedValue} observation={observation} onDateChange={setDate} onValueChange={setFormattedValue} onObservationChange={setObservation} />;
    case 3:
      return <OthersValues disabled={false} fees={fees} fine={fine} discount={discount} onOthersValuesChange={handleOthersValuesChange} />;
    case 4:
      return (
        <div className='w-full space-y-4'>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Dados do Cliente</AccordionTrigger>
              <AccordionContent>
                <ClientSelect clients={clients} disabled value={value} onSetValue={handleIdentifierChange} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Dados da Cobrança</AccordionTrigger>
              <AccordionContent>
                <CollectionData disabled date={date} formattedValue={formattedValue} observation={observation} onDateChange={setDate} onValueChange={setFormattedValue} onObservationChange={setObservation} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Mora, Multas e Desconto</AccordionTrigger>
              <AccordionContent>
                <OthersValues disabled fees={fees} fine={fine} discount={discount} onOthersValuesChange={handleOthersValuesChange} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      );
    default:
      return null;
    }
  }

  function handleIsAllowedJump() {
    switch (step) {
    case 0:
      return true;
    case 1:
      if (value) return true;
      return false;
    case 2:
      if (formattedValue && date) return true;
      return true;
    case 3:
      return true;
    default:
      return false;
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="style"
          className='h-8'
          onClick={handleReset}
        >
          Gerar boleto
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col gap-0 sm:max-h-[min(640px,80vh)] p-2 sm:max-w-7/12 [&>button:last-child]:hidden">
        <ScrollArea className="flex max-h-full flex-col">
          <AlertDialogHeader className="contents space-y-0 text-left">
            <AlertDialogTitle />
            <StepperInvoice step={step}>
              {handleStep()}
            </StepperInvoice>
          </AlertDialogHeader>
          <div className='flex flex-row items-center justify-between p-5'>
            <Button
              variant="style"
              disabled={step <= 1}
              onClick={() => changeStep('back')}
            >
              Voltar
            </Button>
            <AlertDialogFooter className="flex flex-row items-center">
              <AlertDialogCancel>Fechar</AlertDialogCancel>
              {step > 3 ?
                <AlertDialogAction onClick={onSubmit}>Gerar Boleto</AlertDialogAction>
                :
                <Button
                  variant="default"
                  onClick={() => changeStep('next')}
                >
                  Próximo
                </Button>
              }
            </AlertDialogFooter>
          </div>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type PropsStepper = {
  step: number;
  children: React.ReactNode;
}

function StepperInvoice({ step, children }: PropsStepper) {
  return (
    <div className="space-y-8 text-center w-full p-5">
      <Stepper value={step}>
        {stepsInvoice.map(({ step, title }) => (
          <StepperItem
            key={step}
            step={step}
            className="max-md:items-start [&:not(:last-child)]:flex-1"
          >
            <StepperTrigger className="max-md:flex-col">
              <StepperIndicator />
              <div className="text-center md:text-left">
                <StepperTitle>{title}</StepperTitle>
              </div>
            </StepperTrigger>
            {step < stepsInvoice.length && <StepperSeparator className="max-md:mt-3.5 md:mx-4" />}
          </StepperItem>
        ))}
      </Stepper>
      <span className='flex justify-start items-center'>
        {children}
      </span>
    </div>
  );
}

type ClientSelectProps = {
  clients: Client2[];
  value: string;
  disabled: boolean;
  onSetValue: (_value: string) => void;
}

function ClientSelect({ clients, value, disabled, onSetValue }: ClientSelectProps) {
  const [open, setOpen] = useState(false);

  const client = clients.find((client) => client.identifier === value);

  return (
    <div className="space-y-8 text-center w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className='flex items-start justify-start' asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            aria-expanded={open}
            className="w-[300px] justify-between hover:bg-neutral-100 border-neutral-300 dark:hover:bg-neutral-900 dark:border-neutral-700"
          >
            {value ? (
              <span className="flex items-center gap-2">
                <Badge variant="style">{value}</Badge>
                {clients.find((client) => client.identifier === value)?.name}
              </span>
            ) : (
              "Selecione o cliente..."
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Command>
            <CommandInput placeholder="Procurar..." className="h-9" />
            <CommandList>
              <CommandEmpty>Nenhum cliente encontrado</CommandEmpty>
              <CommandGroup>
                {clients.map((client) => (
                  <CommandItem
                    key={client.identifier}
                    value={client.identifier}
                    className='flex flex-row items-center justify-between w-full cursor-pointer'
                    onSelect={(currentValue) => {
                      onSetValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className='flex flex-row gap-1 items-center'>
                      <Badge variant='style'>{client.identifier}</Badge>
                      <p>{client.name}</p>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === client.identifier ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {client && <CardClient disabled={disabled} client={client} />}
    </div>
  );
}

type CardClientProps = {
  client: Client2;
  disabled: boolean;
}

function CardClient({ disabled, client }: CardClientProps) {
  return (
    <div className="space-y-8 text-center w-full">
      <div className='flex flex-row items-center gap-2 w-full'>
        <div className="grid w-1/4 items-center gap-1.5">
          <Label htmlFor="name">Nome do cliente</Label>
          <Input disabled={disabled} id="name" value={client.name} onChange={() => null} />
        </div>
        <div className="grid w-1/4 items-center gap-1.5">
          <Label htmlFor="register">CPF/CNPJ</Label>
          <Input disabled={disabled} id="register" value={client.register} onChange={() => null} />
        </div>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input disabled={disabled} id="email" value={client.email} onChange={() => null} />
        </div>
      </div>
      <div className='flex flex-row items-center gap-2 w-full'>
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="city">Cidade</Label>
          <Input disabled={disabled} id="city" value={client.city} onChange={() => null} />
        </div>
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input disabled={disabled} id="neighborhood" value={client.phone} onChange={() => null} />
        </div>
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="zipcode">CEP</Label>
          <Input disabled={disabled} id="zipcode" value={client.zipcode} onChange={() => null} />
        </div>
      </div>
      <div className='flex flex-row items-center gap-2 w-full'>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="address">Complemento</Label>
          <Input disabled={disabled} id="address" value={client.address} onChange={() => null} />
        </div>
        <div className="grid w-1/4 items-center gap-1.5">
          <Label htmlFor="phone">Celular</Label>
          <Input disabled={disabled} id="phone" value={client.phone} onChange={() => null} />
        </div>
        <div className="grid w-1/4 items-center gap-1.5">
          <Label htmlFor="uf">UF</Label>
          <Input disabled={disabled} id="uf" value={client.uf} onChange={() => null} />
        </div>
      </div>
    </div>
  );
}

type CollectionDataProps = {
  date: Date;
  formattedValue: string;
  observation: string;
  disabled: boolean;
  onDateChange: (_value: Date) => void;
  onValueChange: (_value: string) => void;
  onObservationChange: (_value: string) => void;
};

function CollectionData({ date, formattedValue, observation, disabled, onDateChange, onValueChange, onObservationChange }: CollectionDataProps) {
  return (
    <div className="space-y-8 text-center w-full">
      <div className='flex flex-row items-center gap-2 w-2/5'>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="name">Valor</Label>
          <div className="space-y-2 w-full">
            <div className="relative">
              <Input
                className="peer pe-12 ps-9"
                placeholder="0,00"
                disabled={disabled}
                type="text"
                value={formattedValue}
                onChange={(e) => onValueChange(handleCurrencyChange(e.target.value))}
              />
              <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                R$
              </span>
              <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                BRL
              </span>
            </div>
          </div>
        </div>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="register">Vencimento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"style2"}
                disabled={disabled}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => onDateChange(day ?? new Date())}
                locale={ptBR}
                initialFocus
                disabled={(day) => isBefore(day, startOfToday())}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className='flex flex-row items-center gap-2 w-4/5'>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="register">Observações</Label>
          <Textarea value={observation} disabled={disabled} onChange={(e) => onObservationChange(e.target.value)} className="max-h-26" placeholder="Escreva a observação aqui." />
        </div>
      </div>
    </div>
  );
}

type OthersValuesProps = {
  fees: string;
  fine: string;
  disabled: boolean;
  discount: string;
  onOthersValuesChange: (_type: string, _value: string) => void;
}

function OthersValues({ fees, fine, discount, disabled, onOthersValuesChange }: OthersValuesProps) {
  const OthersConfig = [
    { id: 'fees', title: 'Mora mensal', value: fees },
    { id: 'fine', title: 'Multa', value: fine },
    { id: 'discount', title: 'Desconto', value: discount },
  ];

  return (
    <div className="space-y-8 text-center w-full">
      <div className='flex flex-row items-center gap-2 w-3/5'>
        {OthersConfig.map((item) =>
          <div key={item.id} className="grid w-1/3 items-center gap-1.5">
            <Label htmlFor="name">{item.title}</Label>
            <div className="space-y-2 w-full">
              <div className="relative">
                <Input
                  id={item.id}
                  className="peer ps-9"
                  disabled={disabled}
                  type="number"
                  value={item.value}
                  onChange={(e) => onOthersValuesChange(item.id, e.target.value)}
                />
                <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                  %
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
