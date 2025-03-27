'use client';
import * as React from 'react';
import { Pie, PieChart } from 'recharts';
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

interface Data {
  key: string;
  value: number;
}

interface Label {
  config: string;
  label: string;
}

interface Props {
  title: string;
  label: string;
  days: number;
  total?: string;
  data: Data[];
  labels: Label[];
}

export function ChartPieLabel({ title, label, data, labels, days, total }: Props): React.JSX.Element {
  const colors = [
    '#a3a3a3',
    '#d4d4d4',
    '#e5e5e5',
    '#f5f5f5',
    '#fafafa',
    '#737373',
    '#0a0a0a',
    '#171717',
    '#262626',
    '#404040',
    '#525252',
  ];

  const chartConfig = labels.reduce(
    (acc, { config, label: lbl }, index) => {
      acc[config] = { label: lbl, color: colors[index % colors.length] };
      return acc;
    },
    { title: { label } } as ChartConfig
  );

  const chartData = data.map(({ key, value }, index) => ({
    key,
    value,
    fill: colors[index % colors.length],
  }));

  return (
    <Card className='bg-neutral-100 dark:bg-neutral-800 w-full h-full border dark:border-neutral-700 p-0'>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b dark:border-neutral-700 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 pl-3 py-2 mt-0.5">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {days > 1 ? `Período de ${days} dias` : 'Período 1 dia'}
          </p>
        </div>
        {total && (
          <div className="flex flex-col justify-center gap-1 text-center border-l border-t-0 px-8 py-2">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-base font-bold leading-none">{total}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-3">
        <ChartContainer config={chartConfig} className="aspect-auto h-[234px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" label nameKey="key" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
