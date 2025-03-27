import { JSX } from 'react';
import { FormSignUp } from '@/components/form/sign-up';

export default function SignIn(): JSX.Element {
  return (
    <div className='flex justify-center items-center bg-neutral-900 min-h-screen'>
      <FormSignUp />
    </div>
  );
}