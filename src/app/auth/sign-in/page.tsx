'use client';
import { JSX, useState } from 'react';
import { FormSignIn } from '@/components/form/sign-in';
import { FormPasswordRecovery } from '@/components/form/password-recovery';
import { FormPasswordRecoveryEmail } from '@/components/form/password-recovery-email';
import { FormPasswordRecoveryOtp } from '@/components/form/password-recovery-otp';

export default function SignIn(): JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [emailLogin, setEmailLogin] = useState('');
  const [password, setPassword] = useState('');
  const [emailRecovery, setEmailRecovery] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleStep = (index: number) => {
    switch (index) {
    case 1:
      return <FormSignIn emailLogin={emailLogin} password={password} onEmailChange={setEmailLogin} onPasswordChange={setPassword} onChangeStep={setStep} />;
    case 2:
      return <FormPasswordRecoveryEmail emailRecovery={emailRecovery} onEmailRecoveryChange={setEmailRecovery} onChangeStep={setStep} />;
    case 3:
      return <FormPasswordRecoveryOtp emailRecovery={emailRecovery} otp={otp} onOtpChange={setOtp} onChangeStep={setStep} />;
    case 4:
      return <FormPasswordRecovery newPassword={newPassword} emailRecovery={emailRecovery} otp={otp} confirmPassword={confirmPassword} onNewPasswordChange={setNewPassword} onConfirmPasswordChange={setConfirmPassword} onChangeStep={setStep} />;
    default:
      return <></>;
    }
  };

  return (
    <div className='flex min-h-screen w-full'>
      <div className='w-1/2 flex justify-center dark:bg-neutral-800 items-center border-r border-neutral-200 dark:border-neutral-700'>
        {handleStep(step)}
      </div>
      <div className='w-1/2 bg-neutral-50 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-700' />
    </div>
  );
}
