'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginAcc } from '@/app/_actions/auth';
import Cookies from 'js-cookie';

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Logo } from '../global/logo';

type Props = {
  emailLogin: string;
  password: string;
  onEmailChange: (_value: string) => void;
  onPasswordChange: (_value: string) => void;
  onChangeStep: (_value: number) => void;
}

export const FormSignIn = ({ emailLogin, password, onEmailChange, onPasswordChange, onChangeStep }: Props) => {
  const id = useId();
  const router = useRouter();

  const onRedirect = (url: string) => {
    router.push(url);
  };

  const handlePasswordRecoveryClick = () => {
    toast('Informe o seu Email', { description: 'Insira o email da sua conta em que deseja recuperar, enviaremos um código de verificação.' });
    onChangeStep(2);
  };

  const onLogin = async () => {
    if (!emailLogin || !password) {
      toast('Preencha os Dados', { description: 'Preencha o email e senha corretamente.' });
      return;
    }

    try {
      const data = {
        email: emailLogin,
        password,
      };

      const response = await loginAcc(data);

      if (!response || !response.code) {
        throw new Error();
      }

      switch (response.code) {
      case 200:
        Cookies.set('_xr', response.refresh.token, {
          expires: new Date(response.refresh.expires),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        });
          
        onRedirect('/dashboard');
        break;
      default:
        toast('Email e/ou senha inválido', { description: 'Verifique se preencheu corretamente os dados.' });
      }
    } catch {
      toast('Email e/ou senha inválido', { description: 'Verifique se preencheu corretamente os dados.' });
    }
  };

  return (
    <Card className="w-96 dark:bg-neutral-900 dark:border-neutral-700">
      <CardContent className="mx-auto w-full">
        <div className="flex flex-col items-center gap-2">
          <Logo withName={true} />
          <CardHeader className="mb-4">
            <CardDescription className="sm:text-center">
              ABC Digite suas credênciais para fazer login na sua conta.
            </CardDescription>
          </CardHeader>
        </div>
        <div className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`}>Email</Label>
              <Input id={`${id}-email`} value={emailLogin} onChange={(e) => onEmailChange(e.target.value)} type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Senha</Label>
              <Input
                id={`${id}-password`}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                type="password"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <a className="text-sm underline hover:no-underline" onClick={handlePasswordRecoveryClick}>
              Esqueceu sua senha?
            </a>
          </div>
          <Button type="button" className="w-full" onClick={onLogin}>
            Entrar na Conta
          </Button>
        </div>
        <p className="text-center text-sm mt-3">
          Não tem uma conta? <span className="font-semibold hover:underline cursor-pointer" onClick={() => onRedirect('/auth/sign-up')}>Criar Conta</span>
        </p>
      </CardContent>
    </Card>
  );
};
