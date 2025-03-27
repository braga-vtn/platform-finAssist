'use client';
import { JSX, useState } from 'react';
import { FormSignIn } from '@/components/form/sign-in';
import { FormPasswordRecovery } from '@/components/form/password-recovery';

export default function SignIn(): JSX.Element {
  const [step, setStep] = useState<number>(1);

  return (
    <div className='flex justify-center items-center bg-neutral-100 dark:bg-neutral-900 min-h-screen'>
      {step === 1 ?
        <FormSignIn onChangeStep={setStep} />
        :
        <FormPasswordRecovery onChangeStep={setStep} />
      }
    </div>
  );
}