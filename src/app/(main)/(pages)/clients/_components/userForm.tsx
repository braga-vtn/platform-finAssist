"use client";
import { useId, useState } from "react";
import { CalendarIcon, X } from "lucide-react";
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
import { cn, formatCpfCnpj, handleCurrencyChange } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
import { states } from "@/constants/infra";
import { Controller } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type Team = {
  value: string;
  label: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProfileForm({ form, team, edition = false }: { form: any, team: Team[], edition?: boolean }) {
  return (
    <div>
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="bg-neutral-100 dark:bg-neutral-900 border mb-8 w-1/2">
          <TabsTrigger value="data">Dados</TabsTrigger>
          <TabsTrigger value="billing">Cobrança</TabsTrigger>
        </TabsList>
        <TabsContent value="data">
          <FormData form={form} team={team} edition={edition} />
        </TabsContent>
        <TabsContent value="billing">
          <FormBilling form={form} /> 
        </TabsContent>
      </Tabs>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormData = ({ form, team, edition = false }: { form: any, team: Team[], edition?: boolean }) => {
  const id = useId();

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
        <Controller
          name="register"
          control={form.control}
          render={({ field }) => (
            <span className="w-full">
              <span className="flex flex-row items-center">
                <FormLabel>Cnpj/Cpf</FormLabel>
              </span>
              <Input
                {...field}
                className="w-full mt-2"
                maxLength={18}
                onChange={e => {
                  const raw = e.target.value;
                  const formatted = formatCpfCnpj(raw);
                  field.onChange(formatted);
                }}
                value={field.value}
              />
            </span>
          )}
        />
        <FormFildItem
          control={form.control}
          name="identifier"
          label="Número do Cliente"
        >
          <Input disabled={edition} className="w-full" />
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
        <div className="w-2/3">
          <FormFildItem
            control={form.control}
            name="address"
            label="Complemento"
          >
            <Input className="w-full" />
          </FormFildItem>
        </div>
        <div className="w-1/3 px-1">
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
            <PhoneInput maxLength={17} defaultCountry='BR' defaultValue={form.getValues('phone')} />
          </FormFildItem>
        </div>
        <div className="flex flex-row items-center w-2/5 mt-7 gap-2">
          <FormFildItem
            control={form.control}
            name="sendByWhatsapp"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`wpp-${id}`}
                className="shadow-md"
                defaultChecked={form.getValues('sendByWhatsapp')}
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
            name="sendByEmail"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`email-${id}`}
                className="shadow-md"
                defaultChecked={form.getValues('sendByEmail')}
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
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormBilling = ({ form }: { form: any }) => {
  const id = useId();
  const [sendBilling, setSendBilling] = useState(form.getValues('sendBilling'));
  const [formattedValue, setFormattedValue] = useState(handleCurrencyChange(form.getValues('value')) || '');

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center gap-2 w-full">
        <div className="w-3/5 mt-5">
          <FormFildItem
            control={form.control}
            name="sendBilling"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`wpp-${id}`}
                className="shadow-md"
                defaultChecked={form.getValues('sendBilling')}
                onCheckedChange={setSendBilling}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enviar cobrança
              </label>
            </div>
          </FormFildItem>
        </div>
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
                disabled={!sendBilling}
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
        <FormField
          control={form.control}
          name="dueAt"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Data de Início</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"style2"}
                      disabled={!sendBilling}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(day) => {
                        if (day) {
                          field.onChange(day.toISOString());
                        }
                      }}
                      locale={ptBR}
                      initialFocus
                      disabled={(day) => isBefore(day, startOfToday())}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueLimitAt"
          render={({ field }) => (
            <FormItem className="w-full">
              <span className="flex flex-row items-center gap-2">
                <FormLabel>Data final</FormLabel>
                <Badge variant='style' className="text-xs text-muted-foreground">
                  opcional
                </Badge>
              </span>
              <FormControl>
                <div className="relative w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"style2"}
                        disabled={!sendBilling}
                        className={cn(
                          "w-full justify-start text-left font-normal mb-[7px] pr-10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(day) => {
                          if (day) {
                            field.onChange(day.toISOString());
                          }
                        }}
                        locale={ptBR}
                        initialFocus
                        disabled={(day) => isBefore(day, startOfToday())}
                      />
                    </PopoverContent>
                  </Popover>
                  {field.value && (
                    <span
                      onClick={() => field.onChange('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <X className='size-4 text-muted-foreground hover:text-current' />
                    </span>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="w-full px-1">
        <FormFildItem
          control={form.control}
          name="observation"
          label="Observação"
          isOptional
        >
          <Textarea className="max-h-26" maxLength={75} disabled={!sendBilling} placeholder="Escreva a observação aqui." />
        </FormFildItem>
      </div>
    </div>
  );
};