import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "sonner";
import { useUser } from "@/context/user";
import { getIntegrations, postIntegrations } from "@/app/_actions/settings";
import { Spinner } from "@/components/ui/spinner";

interface InterFormData {
  clientId: string;
  secretId: string;
  cert: string;
  key: string;
}

interface WhatsappFormData {
  whatsappBusinessId: string;
  systemAccessToken: string;
  phoneNumberId: string;
  templateName: string;
}

interface EmailFormData {
  from: string;
  host: string;
  port: string;
  user: string;
  password: string;
}

interface FormData {
  inter: InterFormData;
  whatsapp: WhatsappFormData;
  email: EmailFormData;
}

interface InterCardProps {
  data: InterFormData;
  onChange: (_field: keyof InterFormData, _value: string) => void;
}

export const InterCard = ({ data, onChange }: InterCardProps) => {
  return (
    <div className="space-y-4 w-full mt-4">
      <div className="flex flex-row w-full gap-2">
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="Client-id">ClientId</Label>
          <Input
            id="Client-id"
            type="text"
            value={data.clientId}
            onChange={(e) => onChange("clientId", e.target.value)}
          />
        </div>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="Secret-id">SecretId</Label>
          <Input
            id="Secret-id"
            type="text"
            value={data.secretId}
            onChange={(e) => onChange("secretId", e.target.value)}
          />
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="Cert">Cert</Label>
        <Textarea
          id="Cert"
          value={data.cert}
          onChange={(e) => onChange("cert", e.target.value)}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="Key">Key</Label>
        <Textarea
          id="Key"
          value={data.key}
          onChange={(e) => onChange("key", e.target.value)}
        />
      </div>
    </div>
  );
};

interface WhatsappCardProps {
  data: WhatsappFormData;
  onChange: (_field: keyof WhatsappFormData, _value: string) => void;
}

export const WhatsappCard = ({ data, onChange }: WhatsappCardProps) => {
  return (
    <div className="space-y-4 w-full mt-4">
      <div className="grid w-full items-center gap-1.5">
        <div className="flex flex-row w-full gap-2">
          <div className="grid w-2/3 items-center gap-1.5">
            <Label htmlFor="whatsapp-business-id">WhatsApp Business ID</Label>
            <Input
              id="whatsapp-business-id"
              type="text"
              value={data.whatsappBusinessId}
              onChange={(e) => onChange("whatsappBusinessId", e.target.value)}
            />
          </div>
          <div className="grid w-1/3 items-center gap-1.5">
            <Label htmlFor="phone-number-id">Template</Label>
            <Input
              id="template-name"
              type="text"
              value={data.templateName}
              onChange={(e) => onChange("templateName", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full gap-2">
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="system-access-token">System Access Token</Label>
          <Input
            id="system-access-token"
            type="text"
            value={data.systemAccessToken}
            onChange={(e) => onChange("systemAccessToken", e.target.value)}
          />
        </div>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="phone-number-id">Phone Number ID</Label>
          <Input
            id="phone-number-id"
            type="text"
            value={data.phoneNumberId}
            onChange={(e) => onChange("phoneNumberId", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

interface EmailCardProps {
  data: EmailFormData;
  onChange: (_field: keyof EmailFormData, _value: string) => void;
}

export const EmailCard = ({ data, onChange }: EmailCardProps) => {
  return (
    <div className="space-y-4 w-full mt-4">
      <div className="flex flex-row w-full gap-2">
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="from">De</Label>
          <Input
            type="text"
            id="from"
            placeholder="Ex. braga@gmail.com"
            value={data.from}
            onChange={(e) => onChange("from", e.target.value)}
          />
        </div>
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="host">Host</Label>
          <Input
            type="text"
            id="host"
            placeholder="Ex. smtp.gmail.com"
            value={data.host}
            onChange={(e) => onChange("host", e.target.value)}
          />
        </div>
        <div className="grid w-1/3 items-center gap-1.5">
          <Label htmlFor="port">Porta</Label>
          <Input
            type="text"
            id="port"
            placeholder="Ex. 465"
            value={data.port}
            onChange={(e) => onChange("port", e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-row w-full gap-2">
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="user">Usuário</Label>
          <Input
            type="text"
            id="user"
            placeholder="Ex. braga@gmail.com"
            value={data.user}
            onChange={(e) => onChange("user", e.target.value)}
          />
        </div>
        <div className="grid w-1/2 items-center gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            type="text"
            id="password"
            placeholder="Ex. qais hsld ouek hkyd"
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

interface IntegrationItemProps {
  name: string;
  urlAvatar: string;
  valueAccordion: string;
  children: React.ReactNode;
  onSubmit: () => void;
}

export const IntegrationsItem = ({
  name,
  urlAvatar,
  valueAccordion,
  children,
  onSubmit,
}: IntegrationItemProps) => {
  return (
    <AccordionItem
      value={valueAccordion}
      className="bg-neutral-100 rounded-md px-4 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-md"
    >
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
          <p className="text-base font-medium">{name}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {children}
        <span className="flex justify-end mt-4">
          <Button variant="default" onClick={onSubmit}>
            Atualizar
          </Button>
        </span>
      </AccordionContent>
    </AccordionItem>
  );
};

export const IntegrationsTabs = () => {
  const { userId } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    inter: {
      clientId: "",
      secretId: "",
      cert: "",
      key: "",
    },
    whatsapp: {
      whatsappBusinessId: "",
      systemAccessToken: "",
      phoneNumberId: "",
      templateName: "",
    },
    email: {
      from: "",
      host: "",
      port: "",
      user: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const integrationsData = await getIntegrations(userId);
        if (!integrationsData) {
          return;
        }

        setFormData(integrationsData);
      } catch {
        toast('Erro Inesperado', { description: 'Não foi possível buscar os dados do seu perfil, tente novamente mais tarde!' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleInputChange = <T extends keyof FormData>(
    integration: T,
    field: keyof FormData[T],
    value: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [integration]: {
        ...prevData[integration],
        [field]: value,
      },
    }));
  };

  const handleOnSubmit = async (integration: keyof FormData) => {
    if (!userId) return;

    try {
      const data = formData[integration];
      const response = await postIntegrations(integration, data, userId);

      if (!response) {
        throw new Error();
      }

      toast('integração Atualizada', { description: 'Os dados dessa integração foram atualizados com sucesso!' });
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível atualizar sua integração, tente novamente mais tarde!' });
    }
  };

  const Integrations = [
    {
      id: 1,
      name: "Banco Inter",
      urlAvatar: "/logo-inter.png",
      valueAccordion: "inter",
      children: (
        <InterCard
          data={formData.inter}
          onChange={(field, value) => handleInputChange("inter", field, value)}
        />
      ),
    },
    {
      id: 2,
      name: "WhatsApp",
      urlAvatar: "/logo-whatsapp.png",
      valueAccordion: "whatsapp",
      children: (
        <WhatsappCard
          data={formData.whatsapp}
          onChange={(field, value) =>
            handleInputChange("whatsapp", field, value)
          }
        />
      ),
    },
    {
      id: 3,
      name: "Email",
      urlAvatar: "/logo-gmail.png",
      valueAccordion: "email",
      children: (
        <EmailCard
          data={formData.email}
          onChange={(field, value) => handleInputChange("email", field, value)}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(90vh-50px)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-3/5 mt-4">
      <Accordion type="single" className="space-y-4" collapsible>
        {Integrations.map((item) => (
          <IntegrationsItem
            key={`item-${item.id}`}
            name={item.name}
            urlAvatar={item.urlAvatar}
            valueAccordion={item.valueAccordion}
            onSubmit={() => handleOnSubmit(item.valueAccordion as keyof FormData)}
          >
            {item.children}
          </IntegrationsItem>
        ))}
      </Accordion>
    </div>
  );
};
