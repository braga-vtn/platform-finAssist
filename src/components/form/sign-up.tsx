'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useId } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Logo } from '../global/logo';
 
export const FormSignUp = () => {
  const id = useId();
  const router = useRouter();

  const onRedirect = (url: string) => {
    router.push(url);
  };

  return (
    <Card className="w-96 bg-neutral-950 border-neutral-700">
      <CardContent className="mx-auto">
        <div className="flex flex-col items-center gap-2">
          <Logo withName={true} forceDark={true} />
          <CardHeader className="mb-4">
            <CardDescription className="sm:text-center text-neutral-300">
              Cadastre uma conta na FinAssist! Crie uma senha segura para sua conta.
            </CardDescription>
          </CardHeader>
        </div>
        <form className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`} className='text-neutral-50'>Nome Completo</Label>
              <Input id={`${id}-email`} type="email" className='border-neutral-700' required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-email`} className='text-neutral-50'>Email</Label>
              <Input id={`${id}-email`} type="email" className='border-neutral-700' required />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-password`} className='text-neutral-50'>Senha</Label>
              <Input
                id={`${id}-password`}
                type="password"
                className='border-neutral-700'
                required
              />
            </div>
          </div>
          <Button type="button" className="w-full">
            Criar Conta
          </Button>
        </form>
        <p className="text-center text-sm mt-3 text-neutral-200">
          Já tem uma conta? <span className="font-semibold hover:underline cursor-pointer text-neutral-50" onClick={() => onRedirect('/auth/sign-in')}>Entrar</span>
        </p>
      </CardContent>
    </Card>
  );
};
