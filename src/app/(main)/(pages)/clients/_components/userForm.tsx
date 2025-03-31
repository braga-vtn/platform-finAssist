"use client";
import { useId, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, isBefore, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFildItem } from "@/components/global/formField";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn, handleCurrencyChange, parseDate } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { states } from "@/constants/infra";

type Team = {
  value: string;
  label: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileForm({ form, team }: { form: any, team: Team[] }) {
  const id = useId();
  const [date, setDate] = useState<Date>(parseDate(form.getValues('dueAt')));
  const [formattedValue, setFormattedValue] = useState(handleCurrencyChange(form.getValues('value')) || '');

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center w-full gap-2 px-1">
        <FormFildItem
          control={form.control}
          name="name"
          label="Nome do Cliente"
        >
          <Input className="w-full" />
        </FormFildItem>
        <FormFildItem
          control={form.control}
          name="register"
          label="Cnpj/Cpf"
        >
          <Input className="w-full" />
        </FormFildItem>
        <FormFildItem
          control={form.control}
          name="identifier"
          label="Número do Cliente"
        >
          <Input className="w-full" />
        </FormFildItem>
      </div>
      <div className="flex flex-row items-center w-full gap-2 px-1">
        <FormFildItem
          control={form.control}
          name="city"
          label="Cidade"
        >
          <Input className="w-full" />
        </FormFildItem>
        <FormFildItem
          control={form.control}
          name="uf"
          label="UF"
        >
          <Select onValueChange={(value) => form.setValue('uf', value)}>
            <SelectTrigger className="w-full border dark:border-neutral-700 border-neutral-300 bg-neutral-100 dark:bg-neutral-900 shadow-md">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="h-48">
              {states.map((item) =>
                <SelectItem key={`item-${item}`} value={item}>{item}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </FormFildItem>
        <FormFildItem
          control={form.control}
          name="neighborhood"
          label="Bairro"
        >
          <Input className="w-full" />
        </FormFildItem>
        <FormFildItem
          control={form.control}
          name="zipcode"
          label="Cep"
        >
          <Input type="number" min={0} max={99999999} className="w-full" />
        </FormFildItem>
      </div>
      <div className="flex flex-row items-end w-full gap-2 px-1">
        <div className="w-1/2">
          <FormFildItem
            control={form.control}
            name="address"
            label="Complemento"
            isOptional
          >
            <Input className="w-full" />
          </FormFildItem>
        </div>
        <div className="flex flex-row items-center gap-2 w-1/2">
          <FormFildItem
            control={form.control}
            name="dueAt"
            label="Data de Pagamento"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"style2"}
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
                  onSelect={(day) => setDate(day ?? new Date())}
                  locale={ptBR}
                  initialFocus
                  disabled={(day) => isBefore(day, startOfToday())}
                />
              </PopoverContent>
            </Popover>
          </FormFildItem>
          <FormFildItem
            control={form.control}
            name="value"
            label="Valor Mensal"
          >
            <div className="space-y-2 w-full">
              <div className="relative">
                <Input
                  id={id}
                  className="peer pe-12 ps-9"
                  placeholder="0,00"
                  type="text"
                  value={formattedValue}
                  onChange={(e) => setFormattedValue(handleCurrencyChange(e.target.value))}
                />
                <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                  R$
                </span>
                <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                  BRL
                </span>
              </div>
            </div>
          </FormFildItem>
        </div>
      </div>
      <div className="flex flex-row items-center w-full gap-2 px-1">
        <div className="flex flex-row items-center gap-2 w-3/5">
          <FormFildItem
            control={form.control}
            name="email"
            label="Email"
            isOptional
          >
            <Input className="w-full" />
          </FormFildItem>
          <FormFildItem
            control={form.control}
            name="phone"
            label="Whatsapp"
            isOptional
          >
            <PhoneInput maxLength={15} defaultCountry='BR' defaultValue={form.getValues('phone')} />
          </FormFildItem>
        </div>
        <div className="flex flex-row items-center w-2/5 mt-5 gap-2">
          <FormFildItem
            control={form.control}
            name="SendByWhatsapp"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`wpp-${id}`}
                className="shadow-md"
                defaultChecked={form.getValues('SendByWhatsapp')}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enviar no Whatsapp
              </label>
            </div>
          </FormFildItem>
          <FormFildItem
            control={form.control}
            name="SendByEmail"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`email-${id}`}
                className="shadow-md"
                defaultChecked={form.getValues('SendByEmail')}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enviar no Email
              </label>
            </div>
          </FormFildItem>
        </div>
      </div>
      <div className="w-full px-1">
        <FormFildItem
          control={form.control}
          name="memberId"
          label="Membro Responsável"
        >
          <Select onValueChange={(value) => form.setValue('memberId', value)}>
            <SelectTrigger className="w-full border dark:border-neutral-700 border-neutral-300 bg-neutral-100 dark:bg-neutral-900 shadow-md">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {team.map((item) =>
                <SelectItem key={`item-${item.label}`} value={item.value}>{item.label}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </FormFildItem>
      </div>
      <div className="w-full px-1">
        <FormFildItem
          control={form.control}
          name="observation"
          label="Observação"
          isOptional
        >
          <Textarea className="max-h-26" placeholder="Escreva a observação aqui." />
        </FormFildItem>
      </div>
    </div>
  );
}