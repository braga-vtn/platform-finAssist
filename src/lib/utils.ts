import { clsx, type ClassValue } from 'clsx';
import { differenceInCalendarDays, endOfDay, formatISO, startOfDay, subDays } from 'date-fns';
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