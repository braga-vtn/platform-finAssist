'use client';
import { ChartAreaInteractive } from '@/components/charts/area-interactive';
import { ChartBarStacked } from '@/components/charts/bar-stacked';
import { ChartCalendar } from '@/components/charts/calendar';
import ChartCard from '@/components/charts/card';
import { ChartLineInteractive } from '@/components/charts/line-interactive';
import { ChartPieLabel } from '@/components/charts/pie-label';
import { calculateDateDifference, formatDateRange, getDefaultDateRange } from '@/lib/utils';
import { Clock, DollarSign, ReceiptText, Send, SendIcon, Users, Wallet } from 'lucide-react';
import { JSX, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useUser } from '@/context/user';
import { Spinner } from '@/components/ui/spinner';
import { getMembers, insightsData } from '@/app/_actions/dashboard';
import { InsightsProps, Member } from '@/types/dashboard';

import { MemberFilter } from './_components/member-filter';

const pieConfig = {
  title: 'Clientes da Equipe',
  label: 'Equipe',
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
};

const areaConfig = {
  title: 'Previsão de Faturamento',
  label: 'Previsão',
};

const barStackedConfig = {
  title: 'Distribuição das Mensagens',
  icon: SendIcon,
  labels: [
    { config: 'email', label: 'Email' },
    { config: 'whatsapp', label: 'WhatsApp' },
  ]
};

const insightsDefault = {
  newClients: { value: 0 },
  invoicesGenerated: { value: 0 },
  messagesSended: { value: 0 },
  pendingPayment: { value: 0 },
  paymentMade: { value: 0 },
  presumedRevenue: { value: 0 },
  teamClients: [],
  invoices: [],
  forecastRevenue: [],
  distributionMessages: [],
};

export default function Dashboard(): JSX.Element {
  const [itemsSelected, setItemsSelected] = useState<string[]>([]);
  const [team, setTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [insights, setInsights] = useState<InsightsProps>(insightsDefault);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date; fromFormatted?: string; toFormatted?: string }>(getDefaultDateRange());
  const { userId } = useUser();

  const days = calculateDateDifference(dateRange.from, dateRange.to);

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    const formattedRange = formatDateRange(range);
    setDateRange(formattedRange);
  };

  const getFormattedDateRange = useCallback(() => {
    const today = new Date();
    const defaultEnd = today.toISOString().split('T')[0];

    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const defaultStart = sevenDaysAgo.toISOString().split('T')[0];

    const start = dateRange.fromFormatted?.split('T')[0] || defaultStart;
    const end = dateRange.toFormatted?.split('T')[0] || defaultEnd;
    
    return { start, end };
  }, [dateRange.fromFormatted, dateRange.toFormatted]);

  const fetchInsights = useCallback(async () => {
    if (!userId) return;
    
    const dates = getFormattedDateRange();
    const members = itemsSelected || [];

    if (!dates.start || !dates.end) {
      toast('Erro Inesperado', { description: 'Datas inválidas para buscar métricas!' });
      return;
    }

    try {
      setLoading(true);
      const data = await insightsData(dates.start, dates.end, members, userId);
      if (data) {
        setInsights(data);
      }
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível buscar as métricas, tente novamente mais tarde!' });
    } finally {
      setLoading(false);
    }
  }, [userId, itemsSelected, getFormattedDateRange]);

  useEffect(() => {
    if (!userId) return;

    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const members = await getMembers(userId);
        if (members) {
          setItemsSelected(members.map((item) => item.value));
          setTeam(members);
        }
      } catch {
        toast('Erro Inesperado', { description: 'Não foi possível buscar os membros da equipe!' });
      }
    };

    fetchTeamMembers();
  }, [userId]);

  useEffect(() => {
    if (team.length > 0 && userId) {
      fetchInsights();
    }
  }, [dateRange, fetchInsights, team.length, userId]);

  const ChartCards = [
    { type: 'number', title: 'Novos Clientes', icon: Users, value: insights.newClients.value },
    { type: 'number', title: 'Boletos Gerados', icon: ReceiptText, value: insights.invoicesGenerated.value },
    { type: 'number', title: 'Mensagens Enviadas', icon: Send, value: insights.messagesSended.value },
    { type: 'money', title: 'Faturamento Presumido', icon: Wallet, value: insights.presumedRevenue.value },
    { type: 'money', title: 'Pagamento Pendente', icon: Clock, value: insights.pendingPayment.value },
    { type: 'money', title: 'Pagamento Efetuado', icon: DollarSign, value: insights.paymentMade.value },
  ];

  if (loading && team.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(90vh-50px)]">
        <Spinner />
      </div>
    );
  }
 
  return (
    <div className='space-y-4'>
      <div className='flex justify-end mb-4 gap-2'>
        <MemberFilter team={team} itemsSelected={itemsSelected} onFilter={setItemsSelected} />
        <ChartCalendar onDateChange={handleDateChange} />
      </div>
      <div className='grid grid-cols-6 gap-4'>
        {ChartCards.map((item) =>
          <ChartCard key={`card-${item.title}`} type={item.type} title={item.title} Icon={item.icon} value={item.value} days={days} />
        )}
      </div>
      <div className='flex flex-row justify-between gap-4 w-full'>
        <div className='w-1/3'>
          <ChartPieLabel team={team} title={pieConfig.title} label={pieConfig.label} days={days} data={insights.teamClients} labels={pieConfig.labels} />
        </div>
        <div className='w-2/3'>
          <ChartLineInteractive title={lineConfig.title} subTitle={lineConfig.subTitle} label={lineConfig.label} days={days} total={insights.invoicesGenerated.value} data={insights.invoices} />
        </div>
      </div>
      <div className='flex flex-row justify-between gap-4 w-full'>
        <div className='w-1/2'>
          <ChartAreaInteractive title={areaConfig.title} label={areaConfig.label} data={insights.forecastRevenue} />
        </div>
        <div className='w-1/2'>
          <ChartBarStacked title={barStackedConfig.title} days={days} Icon={barStackedConfig.icon} labels={barStackedConfig.labels} data={insights.distributionMessages} />
        </div>
      </div>
    </div>
  );
}