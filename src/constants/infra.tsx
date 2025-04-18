import { Settings, LogOut, ChartPieIcon, User2, ReceiptText } from 'lucide-react';

export const ItemSidebar = [
  { 
    id: 1,
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <ChartPieIcon className="h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: 2,
    label: 'Clientes',
    href: '/clients',
    icon: (
      <User2 className="h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: 3,
    label: 'Boletos',
    href: '/invoices',
    icon: (
      <ReceiptText className="h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: 4,
    label: 'Configurações',
    href: '/settings',
    icon: (
      <Settings className="h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: 5,
    label: 'Sair',
    href: '',
    icon: (
      <LogOut className="h-5 w-5 flex-shrink-0" />
    ),
  },
];

export const stepsInvoice = [
  {
    step: 1,
    title: "Selecione o Cliente",
  },
  {
    step: 2,
    title: "Dados da Cobrança",
  },
  {
    step: 3,
    title: "Mora, Multas e Desconto",
  },
  {
    step: 4,
    title: "Resumo",
  },
];

export const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const; 