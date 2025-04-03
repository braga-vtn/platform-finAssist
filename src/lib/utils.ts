/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx';
import { differenceInCalendarDays, endOfDay, format, formatISO, startOfDay, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const calculateDateDifference = (from?: Date, to?: Date): number => {
  if (!from || !to) {
    const today = new Date();
    const defaultFrom = subDays(today, 7);
    return differenceInCalendarDays(today, defaultFrom);
  }
  return differenceInCalendarDays(to, from) + 1;
};
 
export function parseDate(value: any): Date {
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatDateClassic(date: string) {
  if (!date) return date;

  try {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return format(parsedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return date;
  }
}

export const handleCurrencyChange = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  const number = numericValue ? parseInt(numericValue, 10) : 0;
  const formatted = (number / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatted;
};

export function formatRegister(text: string) {
  if (!text) return text;

  const numbers = text.replace(/\D/g, '');

  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  else if (numbers.length === 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return text;
}

export const formatDateRange = (range: { from?: Date; to?: Date }) => {
  const now = new Date();
  return {
    from: range.from ? startOfDay(range.from) : undefined,
    to: range.to ? (range.to.toDateString() === now.toDateString() ? now : endOfDay(range.to)) : undefined,
    fromFormatted: range.from ? formatISO(startOfDay(range.from)) : undefined,
    toFormatted: range.to ? (range.to.toDateString() === now.toDateString() ? formatISO(now) : formatISO(endOfDay(range.to))) : undefined
  };
};
 
export const getDefaultDateRange = () => {
  const today = new Date();
  const weekAgo = subDays(today, 6);

  return {
    from: weekAgo,
    to: today,
    fromFormatted: formatISO(startOfDay(weekAgo)),
    toFormatted: formatISO(today)
  };
};