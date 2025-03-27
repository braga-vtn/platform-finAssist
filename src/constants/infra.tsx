import { Settings, LogOut, ChartPieIcon, User2, ReceiptText, Lock } from 'lucide-react';

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
    label: 'Acesso Avançado',
    href: '/admin',
    icon: (
      <Lock className="h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    id: 6,
    label: 'Sair',
    href: '#',
    icon: (
      <LogOut className="h-5 w-5 flex-shrink-0" />
    ),
  },
];

export const accountsSidebar = [
  {
    id: '41b5d2df-bec5-4d86-8c6f-7c2a72aca26f',
    type: 'me',
    name: 'Matheus braga',
    avatar: '/avatar-default.jpeg'
  },
  {
    id: '84fb8182-9788-4a30-bc7d-43934d6a8a77',
    type: 'member',
    name: 'Castro Advogados',
    avatar: 'https://www.ulogo.com.br/imagens/advogado/advogado_mini/7.webp'
  }
];