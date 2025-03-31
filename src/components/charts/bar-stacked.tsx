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
  value1: number;
  value2: number;
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
    value1: '#a3a3a3',
    value2: '#525252',
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
                const [year, month, day] = value.split('-');
                const date = new Date(year, month - 1, day);
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[150px]"
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
            <Bar
              dataKey="value1"
              stackId="bar-stacked-0901848530"
              fill="var(--color-value1)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="value2"
              stackId="bar-stacked-041098181"
              fill="var(--color-value2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card >
  );
}