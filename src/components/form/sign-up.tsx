'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Logo } from '../global/logo';
import { Spinner } from '../ui/spinner';

type Step1 = {
  name: string;
  email: string;
  password: string;
  onFormChange: (_type: string, _value: string) => void;
}

const FormStep1 = ({ name, email, password, onFormChange }: Step1) => {
  const id = useId();

  return (
    <form className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${id}-name`}>Nome Completo</Label>
          <Input id={`${id}-name`} value={name} onChange={(e) => onFormChange('name', e.target.value)} type="text" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-email`}>Email</Label>
          <Input id={`${id}-email`} value={email} onChange={(e) => onFormChange('email', e.target.value)} type="text" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-password`}>Senha</Label>
          <Input id={`${id}-password`} value={password} onChange={(e) => onFormChange('password', e.target.value)} type="password" required />
        </div>
      </div>
    </form>
  );
};

type Step2 = {
  activationCode: string;
  onFormChange: (_type: string, _value: string) => void;
}

const FormStep2 = ({ activationCode, onFormChange }: Step2) => {
  const id = useId();

  return (
    <form className="space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${id}-activation-code`}>Código de Ativação</Label>
          <Input id={`${id}-activation-code`} value={activationCode} onChange={(e) => onFormChange('activation-code', e.target.value)} type="text" required />
        </div>
      </div>
    </form>
  );
};

export const FormSignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [step, setStep] = useState(1);
  const router = useRouter();

  const onRedirect = (url: string) => {
    router.push(url);
  };

  const onFormChange = (type: string, value: string) => {
    switch (type) {
    case 'name':
      setName(value);
      break;
    case 'email':
      setEmail(value);
      break;
    case 'password':
      setPassword(value);
      break;
    case 'activation-code':
      setActivationCode(value);
      break;
    }
  };

  const handleStep = (index: number) => {
    switch (index) {
    case 1:
      return <FormStep1 name={name} email={email} password={password} onFormChange={onFormChange} />;
    case 2:
      return <FormStep2 activationCode={activationCode} onFormChange={onFormChange} />;
    default:
      return <></>;
    }
  };

  const onSubmit = () => {
    if (step === 2) {
      onRedirect('/auth/sign-in');
      toast('Conta Criada', { description: 'Sua conta foi criada com sucesso na FinAssist!' });
    }

    setStep((prev) => prev + 1);
  };

  if (step > 2) {
    return (
      <Spinner variant='circle-filled' />
    );
  }

  return (
    <Card className="w-96 dark:bg-neutral-900 dark:border-neutral-700">
      <CardContent className="mx-auto">
        <div className="flex flex-col items-center gap-2">
          <Logo withName={true} />
          <CardHeader className="mb-4">
            <CardDescription className="sm:text-center">
              Cadastre uma conta na FinAssist! Crie uma senha segura para sua conta.
            </CardDescription>
          </CardHeader>
        </div>
        {handleStep(step)}
        <Button disabled={!name || !email || !password || (step === 2 && !activationCode)} type="button" className="w-full mt-5" onClick={onSubmit}>
          {step === 1 ? 'Continuar' : 'Criar Conta'}
        </Button>
        <p className="text-center text-sm mt-3">
          Já tem uma conta? <span className="font-semibold hover:underline cursor-pointer" onClick={() => onRedirect('/auth/sign-in')}>Entrar</span>
        </p>
      </CardContent>
    </Card>
  );
};
