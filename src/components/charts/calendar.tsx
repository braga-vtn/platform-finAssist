'use client';
import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { endOfDay, format, isAfter, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarUI } from '@/components/ui/calendar';

interface CalendarDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange: (_range: { from?: Date; to?: Date }) => void;
}

const setStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  return { from: subDays(today, 6), to: today };
};

const predefinedRanges = [
  { label: 'Hoje', range: { from: new Date(), to: new Date() } },
  { label: 'Últimos 7 dias', range: { from: subDays(new Date(), 6), to: new Date() } },
  { label: 'Últimos 14 dias', range: { from: subDays(new Date(), 13), to: new Date() } },
  { label: 'Últimos 30 dias', range: { from: subDays(new Date(), 29), to: new Date() } },
  { label: 'Últimos 3 meses', range: { from: subDays(new Date(), 89), to: new Date() } },
  { label: 'Últimos 12 meses', range: { from: subDays(new Date(), 364), to: new Date() } }
];

export function ChartCalendar({ className, onDateChange }: CalendarDashboardProps): React.JSX.Element {
  const [date, setDate] = React.useState<DateRange | undefined>(getDefaultDateRange());
  const today = React.useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(date?.from || today);

  React.useEffect(() => {
    setVisibleMonth(date?.from || today);
  }, [date, today]);

  const handleSelectRange = React.useCallback((range?: DateRange) => {
    if (range) {
      const newRange = {
        from: range.from ? setStartOfDay(range.from) : undefined,
        to: range.to ? range.to : range.from,
      };

      setDate(newRange);
      onDateChange(newRange);
    }
  }, [onDateChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="style"
          className={cn('w-auto justify-start text-left h-8 shadow-md select-none cursor-pointer bg-neutral-100 dark:bg-neutral-800 border dark:border-neutral-700', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              `${format(date.from, 'LLL dd, y', { locale: ptBR })} - ${format(date.to, 'LLL dd, y', { locale: ptBR })}`
            ) : (
              format(date.from, 'LLL dd, y', { locale: ptBR })
            )
          ) : (
            <span>Escolha uma data</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto p-0 mr-[8.2rem] mt-1 select-none">
        <div className="flex flex-col gap-2 border-r px-2 py-4">
          <div className="grid min-w-[150px] gap-1">
            {predefinedRanges.map(({ label, range }) => (
              <Button
                key={label}
                variant="style"
                className="justify-start font-normal border-none"
                onClick={() => {
                  setDate(range);
                  onDateChange(range);
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-2">
          <div className={cn('grid gap-2', className)}>
            <CalendarUI
              key={visibleMonth.toLocaleDateString()}
              initialFocus
              mode="range"
              defaultMonth={visibleMonth}
              selected={date}
              locale={ptBR}
              onSelect={handleSelectRange}
              numberOfMonths={2}
              disabled={day => isAfter(day, endOfDay(new Date()))}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
