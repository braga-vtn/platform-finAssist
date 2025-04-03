import { JSX } from 'react';
import { FormSignUp } from '@/components/form/sign-up';

export default function SignIn(): JSX.Element {
  return (
    <div className='flex min-h-screen w-full'>
      <div className='w-1/2 bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700' />
      <div className='w-1/2 flex justify-center dark:bg-neutral-800 items-center border-l border-neutral-200 dark:border-neutral-700'>
        <FormSignUp />
      </div>
    </div>
  );
}
