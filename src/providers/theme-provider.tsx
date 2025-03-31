'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';
 
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return (
    <div className='bg-neutral-50 h-screen w-screen'>
    </div>
  );

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
