'use client';

import { Moon, Sun } from 'lucide-react';
import { JSX } from 'react';
import { useTheme } from 'next-themes';
import { Toggle } from '@/components/ui/toggle';

function ToogleTheme(): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div>
      <Toggle
        variant="outline"
        className="group w-9 h-2 data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted border-none cursor-pointer"
        pressed={resolvedTheme === 'dark'}
        onPressedChange={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <Moon
          size={16}
          strokeWidth={2}
          className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
          aria-hidden="true"
        />
        <Sun
          size={16}
          strokeWidth={2}
          className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}

export { ToogleTheme };
