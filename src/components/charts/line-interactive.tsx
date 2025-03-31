'use client';
import * as React from 'react';
import { Line, LineChart, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type Data = {
  date: string;
  value: number | string;
}

interface Props {
  title: string;
  subTitle?: string;
  days?: number;
  label: string;
  total?: string | number;
  data: Data[];
}

export function ChartLineInteractive({ title, subTitle, data, days, label, total }: Props): React.JSX.Element {

  const chartConfig = {
    title: {
      label: label,
    },
    value: {
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Card className='bg-neutral-100 dark:bg-neutral-800 w-full border dark:border-neutral-700 p-0'>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b dark:border-neutral-700 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 pl-3 py-2 mt-0.5">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {subTitle && <CardDescription className="text-xs text-muted-foreground">{subTitle}</CardDescription>}
          {days &&
            <p className="text-xs text-muted-foreground">
              {days > 1 ? `Período de ${days} dias` :
                'Período 1 dia'}
            </p>}
        </div>
        {(total || total === 0) &&
          <div className="flex flex-col justify-center gap-1 text-center border-l border-t-0 px-8 py-2">
            <span className="text-xs text-muted-foreground">
              Total
            </span>
            <span className="text-base font-bold leading-none">
              {total}
            </span>
          </div>}
      </CardHeader>
      <CardContent className="p-2 px-4 pt-3">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (typeof value !== 'string' || !value.includes('-')) return '';
                const [year, month, day] = value.split('-');
                const date = new Date(Number(year), Number(month) - 1, Number(day));
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="title"
                  indicator="dot"
                  labelFormatter={(value) => {
                    if (typeof value !== 'string' || !value.includes('-')) return '';
                    const [year, month, day] = value.split('-');
                    const date = new Date(Number(year), Number(month) - 1, Number(day));
                    return date.toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                    });
                  }}
                />
              }
            />
            <Line
              dataKey='value'
              type="natural"
              strokeWidth={1.5}
              stroke='CurrentColor'
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card >
  );
}
