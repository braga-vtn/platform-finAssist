'use client';
import React from 'react';
import { formatCurrency, formatNumber } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Props {
  type: string;
  title: string;
  Icon: React.ElementType;
  value: number;
  days: number;
}

const ChartCard = ({ type, title, Icon, value, days }: Props): React.JSX.Element => {

  const formatValue = (type: string, value: number) => {
    let formatted;
    switch (type) {
    case 'number':
      formatted = formatNumber(value);
      break;
    case 'money':
      formatted = `R$ ${formatCurrency(value / 100)}`;
      break;
    default:
      formatted = value;
    }

    return formatted;
  };

  return (
    <Card className="whitespace-pre-wrap bg-neutral-100 dark:bg-neutral-800 leading-none tracking-tight lg:text-lg dark:text-neutral-50 text-neutral-950 border dark:border-neutral-700 p-0 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-0">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className='size-4' />
      </CardHeader>
      <CardContent className='pb-3 px-3'>
        <div className="text-2xl font-semibold">
          {formatValue(type, value)}
        </div>
        <p className="text-xs text-muted-foreground">
          {days > 1 ? `Período de ${days} dias` :
            'Período 1 dia'}
        </p>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
