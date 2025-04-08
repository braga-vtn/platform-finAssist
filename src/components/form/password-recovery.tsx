'use client';
import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { resetPasswordAcc } from '@/app/_actions/auth';

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Logo } from '../global/logo';

type Props = {
  newPassword: string;
  emailRecovery: string;
  otp: string;
  confirmPassword: string;
  onNewPasswordChange: (_value: string) => void;
  onConfirmPasswordChange: (_value: string) => void;
  onChangeStep: (_value: number) => void;
}

export const FormPasswordRecovery = ({ newPassword, emailRecovery, otp, confirmPassword, onNewPasswordChange, onConfirmPasswordChange, onChangeStep }: Props) => {
  const id = useId();
  const router = useRouter();

  const onRedirect = (url: string) => {
    router.push(url);
  };

  const handlePasswordRecovery = async () => {
    if (!newPassword || !confirmPassword || (newPassword !== confirmPassword)) {
      toast('Valores Inválidos', { description: 'Para substituir a senha da sua conta, é necessário que informe e confirme uma senha segura.' });
      return;
    }

    try {
      const response = await resetPasswordAcc(emailRecovery, otp, newPassword);
      if (!response || !response.code) {
        throw new Error();
      }

      switch (response.code) {
      case 200:
        toast('Senha Alterada', { description: 'Acesse sua conta com a sua nova senha!' });
        onChangeStep(1);
        break;
      default:
        toast('Valores Inválidos', { description: 'Para substituir a senha da sua conta, é necessário que informe e confirme uma senha segura.' });
      }

    } catch {
      toast('Valores Inválidos', { description: 'Para substituir a senha da sua conta, é necessário que informe e confirme uma senha segura.' });
    }
  };

  return (
    <Card className="w-96 dark:bg-neutral-900 dark:border-neutral-700">
      <CardContent className="mx-auto w-full">
        <div className="flex flex-col items-center gap-2">
          <Logo withName={true} />
          <CardHeader className="mb-4">
            <CardDescription className="sm:text-center">
              Digite uma nova senha que seja segura para sua conta.
            </CardDescription>
          </CardHeader>
        </div>
        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-newPassword`}>Senha</Label>
              <Input id={`${id}-newPassword`} value={newPassword} onChange={(e) => onNewPasswordChange(e.target.value)} type="newPassword" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-confirmPassword`}>Nova senha</Label>
              <Input
                id={`${id}-confirmPassword`}
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                type="confirmPassword"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <a className="text-sm underline hover:no-underline" onClick={() => onChangeStep(1)}>
              Ir ao Login
            </a>
          </div>
          <Button type="button" className="w-full" disabled={!newPassword || !confirmPassword || (newPassword !== confirmPassword)} onClick={handlePasswordRecovery}>
            Trocar Senha
          </Button>
        </form>
        <p className="text-center text-sm mt-3">
          Não tem uma conta? <span className="font-semibold hover:underline cursor-pointer" onClick={() => onRedirect('/auth/sign-up')}>Criar Conta</span>
        </p>
      </CardContent>
    </Card>
  );
};
