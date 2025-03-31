'use client';
import * as React from 'react';
import { Area, AreaChart, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Data = {
  date: string;
  value: number | string;
}

interface Props {
  title: string;
  days: number;
  label: string;
  data: Data[];
}

export function ChartAreaInteractive({ title, data, days, label }: Props): React.JSX.Element {
  const [timeRange, setTimeRange] = React.useState('90d');

  const chartConfig = {
    value: {
      color: '#737373',
      label: label,
    },
  } satisfies ChartConfig;

  return (
    <Card className='bg-neutral-100 dark:bg-neutral-800 w-full border dark:border-neutral-700 p-0'>
      <CardHeader className="flex flex-col items-center justify-between space-y-0 border-b dark:border-neutral-700 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 pl-3 py-2 mt-0.5">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {days > 1 ? `Período de ${days} dias` :
              'Período 1 dia'}
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-xl sm:ml-auto bg-neutral-50 dark:bg-neutral-900 mr-3 border dark:border-neutral-700 cursor-pointer"
            aria-label="Selecione"
          >
            <SelectValue placeholder="Em 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Em 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Em 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Nessa semana
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-2 px-4 pt-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const [year, month, day] = value.split('-');
                const date = new Date(year, month - 1, day);
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    const [year, month, day] = value.split('-');
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
              }
            />
            <Area
              dataKey="value"
              type="natural"
              strokeWidth={1.5}
              stroke="CurrentColor"
              fill="url(#fillValue)"
              stackId="area-interactive-41904981"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card >
  );
}
