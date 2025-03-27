'use client';
import { ChartAreaInteractive } from '@/components/charts/area-interactive';
import { ChartBarStacked } from '@/components/charts/bar-stacked';
import { ChartCalendar } from '@/components/charts/calendar';
import ChartCard from '@/components/charts/card';
import { ChartLineInteractive } from '@/components/charts/line-interactive';
import { ChartPieLabel } from '@/components/charts/pie-label';
import { calculateDateDifference, formatDateRange, getDefaultDateRange } from '@/lib/utils';
import { ReceiptText, Send, SendIcon, Users, Wallet } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';

import { MemberFilter } from './_components/member-filter';

const ChartCards = [
  { title: 'Novos Clientes', icon: Users, value: '1.000', days: 7 },
  { title: 'Boletos Gerados', icon: ReceiptText, value: '49', days: 7 },
  { title: 'Mensagens Enviadas', icon: Send, value: '831', days: 7 },
  { title: 'Faturamento Presumido', icon: Wallet, value: 'R$ 4.389,80', days: 7 },
];

const pieConfig = {
  title: 'Clientes da Equipe',
  label: 'Equipe',
  days: 7,
  total: '39',
  data: [
    { key: 'member1', value: 10 },
    { key: 'member2', value: 4 },
    { key: 'member3', value: 11 },
    { key: 'member4', value: 14 },
  ],
  labels: [
    { config: 'member1', label: 'Matheus Braga' },
    { config: 'member2', label: 'Sérgio' },
    { config: 'member3', label: 'Maria Clara' },
    { config: 'member4', label: 'Giovanna' },
  ]
};

const lineConfig = {
  title: 'Boletos',
  subTitle: '',
  label: 'Quantidade',
  days: 7,
  total: '43',
  data: [
    { date: '2025-03-01', value: 10 },
    { date: '2025-03-02', value: 4 },
    { date: '2025-03-03', value: 11 },
    { date: '2025-03-04', value: 14 },
    { date: '2025-03-05', value: 3 },
  ],
};

const areaConfig = {
  title: 'Previsão de Faturamento',
  label: 'Valor',
  days: 7,
  data: [
    { date: '2025-03-01', value: 10 },
    { date: '2025-03-02', value: 4 },
    { date: '2025-03-03', value: 11 },
    { date: '2025-03-04', value: 14 },
    { date: '2025-03-05', value: 3 },
  ],
};

const barStackedConfig = {
  title: 'Mensagens Enviadas',
  days: 7,
  icon: SendIcon,
  labels: [
    { config: 'value1', label: 'Email' },
    { config: 'value2', label: 'WhatsApp' },
  ],
  data: [
    { date: '2025-03-01', value1: 10, value2: 12 },
    { date: '2025-03-02', value1: 3, value2: 18 },
    { date: '2025-03-03', value1: 8, value2: 14 },
    { date: '2025-03-04', value1: 13, value2: 5 },
    { date: '2025-03-05', value1: 21, value2: 9 },
  ],
};

const team = [
  {
    id: 'b7b64ce4-f95a-4240-8073-e09513293421',
    name: 'Matheus Braga'
  },
  {
    id: '5c3632b8-e0dc-4cac-8534-3ae5691858d8',
    name: 'Bruna Martins'
  }
];

export default function Dashboard(): JSX.Element {
  const [itemsSelected, setItemsSelected] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date; fromFormatted?: string; toFormatted?: string }>(getDefaultDateRange());
  const days = calculateDateDifference(dateRange.from, dateRange.to);

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    const formattedRange = formatDateRange(range);
    setDateRange(formattedRange);
  };

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      return;
    }
  }, [dateRange]);

  return (
    <div className='space-y-4'>
      <div className='flex justify-end mb-4 gap-2'>
        <MemberFilter team={team} itemsSelected={itemsSelected} onFilter={setItemsSelected} />
        <ChartCalendar onDateChange={handleDateChange} />
      </div>
      <div className='grid grid-cols-4 gap-4'>
        {ChartCards.map((item) =>
          <ChartCard key={`card-${item.title}`} title={item.title} Icon={item.icon} value={item.value} days={days} />
        )}
      </div>
      <div className='flex flex-row justify-between gap-4 w-full'>
        <div className='w-1/3'>
          <ChartPieLabel title={pieConfig.title} label={pieConfig.label} days={days} total={pieConfig.total} data={pieConfig.data} labels={pieConfig.labels} />
        </div>
        <div className='w-2/3'>
          <ChartLineInteractive title={lineConfig.title} subTitle={lineConfig.subTitle} label={lineConfig.label} days={days} total={lineConfig.total} data={lineConfig.data} />
        </div>
      </div>
      <div className='flex flex-row justify-between gap-4 w-full'>
        <div className='w-1/2'>
          <ChartAreaInteractive title={areaConfig.title} label={areaConfig.label} days={days} data={areaConfig.data} />
        </div>
        <div className='w-1/2'>
          <ChartBarStacked title={barStackedConfig.title} days={days} Icon={barStackedConfig.icon} labels={barStackedConfig.labels} data={barStackedConfig.data} />
        </div>
      </div>
    </div>
  );
}