import { Check, TimerIcon, X } from 'lucide-react';

export const status = [
  {
    value: 'paid',
    label: 'Pago',
    icon: Check,
  },
  {
    value: 'pending',
    label: 'Pendente',
    icon: TimerIcon,
  },
  {
    value: 'canceled',
    label: 'Cancelado',
    icon: X,
  }
];
