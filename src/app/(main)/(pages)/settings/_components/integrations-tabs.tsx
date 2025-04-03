import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";

export const InterCard = () => {
  return (
    <div className="space-y-4 w-full mt-4">
      O Banco Inter permite a conexão de sua conta com a plataforma. Para isso, é necessário autorizar o acesso diretamente na plataforma do Banco Inter. Clique no botão abaixo para iniciar a conexão!
    </div>
  );
};

export const WhatsappCard = () => {
  return (
    <div className="space-y-4 w-full mt-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="whatsapp-business-id">WhatsApp Business ID</Label>
        <Input id="whatsapp-business-id" type="text" />
      </div>
      <div className="flex flex-row w-full gap-2">
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="system-access-token">System Access Token</Label>
          <Input id="system-access-token" type="text" />
        </div>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="phone-number-id">Phone Number ID</Label>
          <Input id="phone-number-id" />
        </div>
      </div>
    </div>
  );
};

export const EmailCard = () => {
  return (
    <div className="space-y-4 w-full mt-4">
      <div className="flex flex-row w-full gap-2">
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="name">De</Label>
          <Input type="text" id="name" placeholder="Ex. braga@gmail.com" />
        </div>
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="name">Host</Label>
          <Input type="text" id="name" placeholder="Ex. smtp.gmail.com" />
        </div>
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="name">Porta</Label>
          <Input type="text" id="name" placeholder="Ex. 465" />
        </div>
      </div>
      <div className="flex flex-row w-full gap-2">
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="name">Usuário</Label>
          <Input type="text" id="name" placeholder="Ex. braga@gmail.com" />
        </div>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="name">Senha</Label>
          <Input type="text" id="name" placeholder="Ex. qais hsld ouek hkyd" />
        </div>
      </div>
    </div>
  );
};

export const IntegrationsTabs = () => {

  const Integrations = [
    {
      id: 1,
      name: 'Banco Inter',
      urlAvatar: '/logo-inter.png',
      valueAccordion: 'inter',
      children: <InterCard />
    },
    {
      id: 2,
      name: 'WhatsApp',
      urlAvatar: '/logo-whatsapp.png',
      valueAccordion: 'whatsapp',
      children: <WhatsappCard />
    },
    {
      id: 3,
      name: 'Email',
      urlAvatar: '/logo-gmail.png',
      valueAccordion: 'email',
      children: <EmailCard />
    },
  ];

  return (
    <div className="w-3/5 mt-4">
      <Accordion type="single" className="space-y-4" collapsible>
        {Integrations.map((item) =>
          <IntegrationsItem
            key={`item-${item.id}`}
            name={item.name}
            urlAvatar={item.urlAvatar}
            valueAccordion={item.valueAccordion}
          >
            {item.children}
          </IntegrationsItem>
        )}
      </Accordion>
    </div>
  );
};

type ItemProps = {
  name: string;
  urlAvatar: string;
  valueAccordion: string;
  children: React.ReactNode;
}

export const IntegrationsItem = ({ name, urlAvatar, valueAccordion, children }: ItemProps) => {

  const handleActionClick = (update: boolean) => {
    if (!update) return;

    toast('Integração Atualizada', { description: 'Os parametros dessa integração foi atualizados e já está em vigor.' });
  };

  return (
    <AccordionItem value={valueAccordion} className="bg-neutral-100 rounded-md px-4 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 border-neutral-200 shadow-md">
      <AccordionTrigger className="cursor-pointer">
        <div className="flex flex-row gap-4 items-center">
          <div className="relative h-7 w-12 overflow-hidden">
            <Image
              src={urlAvatar}
              alt={`logo-${name}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <p className="text-base font-medium">
            {name}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {children}
        <span className="flex justify-end mt-4">
          <Button variant="default" onClick={() => handleActionClick(valueAccordion !== 'inter')}>
            {valueAccordion !== 'inter' ? 'Atualizar' : 'Conectar'}
          </Button>
        </span>
      </AccordionContent>
    </AccordionItem>
  );
};
