'use client';
import * as React from 'react';
import { Bar, BarChart, XAxis } from 'recharts';
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
  date: string;
  whatsapp: number;
  email: number;
}

interface Label {
  config: string;
  label: string;
}

interface Props {
  title: string;
  Icon: React.ElementType;
  days: number;
  labels: Label[];
  data: Data[];
}

export function ChartBarStacked({ title, Icon, data, days, labels }: Props): React.JSX.Element {

  const colorMap = {
    whatsapp: '#a3a3a3',
    email: '#525252',
  };

  const chartConfig = labels.reduce((acc, { config, label }) => {
    const color = colorMap[config as keyof typeof colorMap];
    if (color) {
      acc[config] = { label, color };
    }
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className='bg-neutral-100 dark:bg-neutral-800 w-full border dark:border-neutral-700 p-0'>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b dark:border-neutral-700 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 pl-3 py-2 mt-0.5">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {days > 1 ? `Período de ${days} dias` :
              'Período 1 dia'}
          </p>
        </div>
        <Icon className="size-4 m-3 mb-2" />
      </CardHeader>
      <CardContent className="p-2 px-4 pt-3 w-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
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
                const date = new Date(value);
                if (isNaN(date.getTime())) return '';
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC',
                });
              }}
            />
            <ChartTooltip cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator
                  className="w-[150px]"
                  indicator="dot"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return '';
                    return date.toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'UTC',
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey="whatsapp"
              stackId="bar-stacked-0901848530"
              fill="var(--color-whatsapp)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="email"
              stackId="bar-stacked-041098181"
              fill="var(--color-email)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card >
  );
}