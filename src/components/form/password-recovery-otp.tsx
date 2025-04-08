'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from 'sonner';
import { verifyCodeAcc } from '@/app/_actions/auth';

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Logo } from '../global/logo';

type Props = {
  emailRecovery: string;
  otp: string;
  onOtpChange: (_value: string) => void;
  onChangeStep: (_value: number) => void;
}

export const FormPasswordRecoveryOtp = ({ emailRecovery, otp, onOtpChange, onChangeStep }: Props) => {
  const router = useRouter();

  const onRedirect = (url: string) => {
    router.push(url);
  };

  const handlePasswordRecoveryOtp = async() => {
    if (!otp || !emailRecovery) {
      toast('Informe o Código', { description: 'O código deve conter os 6 digitos enviados para o seu email.' });
      return;
    }

    try {
      const response = await verifyCodeAcc(emailRecovery, otp);
      if (!response || !response.code) {
        throw new Error();
      }

      switch (response.code) {
      case 200:
        toast('Insira a Nova Senha', {description: 'Digite uma nova senha segura para sua conta.'});
        onChangeStep(4);
        break;
      default: 
        toast('Código Inválido', { description: 'Confira se o código informado é igual ao enviado para seu email.' });
      }

    } catch {
      toast('Código Inválido', { description: 'Confira se o código informado é igual ao enviado para seu email.' });
    }
  };

  return (
    <Card className="w-96 dark:bg-neutral-900 dark:border-neutral-700">
      <CardContent className="mx-auto w-full">
        <div className="flex flex-col items-center gap-2">
          <Logo withName={true} />
          <CardHeader className="mb-4">
            <CardDescription className="sm:text-center">
              Digite o código de verificação enviado no seu email.
            </CardDescription>
          </CardHeader>
        </div>
        <form className="space-y-5">
          <div className="flex justify-center space-y-4">
            <div className="space-y-2">
              <InputOTP value={otp} onChange={(value: string) => onOtpChange(value)} maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <a className="text-sm underline hover:no-underline" onClick={() => onChangeStep(1)}>
              Ir ao Login
            </a>
          </div>
          <Button type="button" className="w-full" disabled={!otp || otp.length < 6} onClick={handlePasswordRecoveryOtp}>
            Continuar
          </Button>
        </form>
        <p className="text-center text-sm mt-3">
          Não tem uma conta? <span className="font-semibold hover:underline cursor-pointer" onClick={() => onRedirect('/auth/sign-up')}>Criar Conta</span>
        </p>
      </CardContent>
    </Card >
  );
};
