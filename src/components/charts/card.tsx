'use client';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Props {
  title: string;
  Icon: React.ElementType;
  value: string;
  days: number;
}

const ChartCard = ({ title, Icon, value, days }: Props): React.JSX.Element => {
  return (
    <Card className="whitespace-pre-wrap bg-neutral-100 dark:bg-neutral-800 leading-none tracking-tight lg:text-lg dark:text-neutral-50 text-neutral-950 border dark:border-neutral-700 p-0 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className='size-4' />
      </CardHeader>
      <CardContent className='pb-3 px-3'>
        <div className="text-2xl font-semibold">
          {value}
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
