import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>): React.JSX.Element {
  const [isSorting, setIsSorting] = useState(false);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleSortingChange = (value: boolean) => {
    setIsSorting(value);
    column.toggleSorting(value);
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button variant="style" size="sm" className='border-none shadow-none' onClick={() => handleSortingChange(!isSorting)}>
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown className='size-3.5' />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp className='size-3.5' />
        ) : (
          <ChevronsUpDown className='size-3.5' />
        )}
      </Button>
    </div>
  );
}
