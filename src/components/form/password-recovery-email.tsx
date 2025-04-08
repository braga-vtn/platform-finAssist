'use client';
import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { forgotPasswordAcc } from '@/app/_actions/auth';

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Logo } from '../global/logo';

type Props = {
  emailRecovery: string;
  onEmailRecoveryChange: (_value: string) => void;
  onChangeStep: (_value: number) => void;
}

export const FormPasswordRecoveryEmail = ({ emailRecovery, onEmailRecoveryChange, onChangeStep }: Props) => {
  const id = useId();
  const router = useRouter();

  const onRedirect = (url: string) => {
    router.push(url);
  };

  const handlePasswordRecoveryEmail = async () => {
    if (!emailRecovery || !emailRecovery.includes('.') || !emailRecovery.includes('@')) {
      toast('Email Inválido', { description: 'Informe um email válido para recuperar a senha.' });
      return;
    }

    try {
      const response = await forgotPasswordAcc(emailRecovery);
      if (!response || !response.code) {
        throw new Error();
      }

      switch (response.code) {
      case 200:
        toast('Código Enviado', { description: 'Se este e-mail estiver cadastrado em nosso sistema, você receberá um código para recuperação de conta.' });
        onChangeStep(3);
        break;
      default: 
        toast('Conta não Encontrada', { description: 'Verifique se informou um email válido!' });
      }

    } catch {
      toast('Conta não Encontrada', { description: 'Verifique se informou um email válido!' });
    }
  };

  return (
    <Card className="w-96 dark:bg-neutral-900 dark:border-neutral-700">
      <CardContent className="mx-auto w-full">
        <div className="flex flex-col items-center gap-2">
          <Logo withName={true} />
          <CardHeader className="mb-4">
            <CardDescription className="sm:text-center">
              Informe o email da conta em que deseja recuperar.
            </CardDescription>
          </CardHeader>
        </div>
        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} value={emailRecovery} onChange={(e) => onEmailRecoveryChange(e.target.value)} type="email" required />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <a className="text-sm underline hover:no-underline" onClick={() => onChangeStep(1)}>
              Ir ao Login
            </a>
          </div>
          <Button type="button" className="w-full" disabled={!emailRecovery} onClick={handlePasswordRecoveryEmail}>
            Continuar
          </Button>
        </form>
        <p className="text-center text-sm mt-3">
          Não tem uma conta? <span className="font-semibold hover:underline cursor-pointer" onClick={() => onRedirect('/auth/sign-up')}>Criar Conta</span>
        </p>
      </CardContent>
    </Card>
  );
};
