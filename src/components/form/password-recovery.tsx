'use client';
import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Logo } from '../global/logo';

type Props = {
  onChangeStep: (_value: number) => void;
}
 
export const FormPasswordRecovery = ({ onChangeStep }: Props) => {
  const id = useId();
  const router = useRouter();

  const onRedirect = (url: string) => {
    router.push(url);
  };

  return (
    <Card className="w-96">
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
              <Label htmlFor={`${id}-email`}>Senha</Label>
              <Input id={`${id}-email`} type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`}>Nova senha</Label>
              <Input
                id={`${id}-password`}
                type="password"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <a className="text-sm underline hover:no-underline" onClick={() => onChangeStep(1)}>
              Ir ao Login
            </a>
          </div>
          <Button type="button" className="w-full">
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
