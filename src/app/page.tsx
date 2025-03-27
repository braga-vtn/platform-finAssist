import { JSX } from 'react';
import { Hero } from '@/components/ui/animated-hero';

export default function Home(): JSX.Element {
  return (
    <div className='flex justify-center items-center bg-neutral-100 dark:bg-neutral-900 min-h-screen'>
      <Hero />
    </div>
  );
}
