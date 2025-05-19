import React, { useState, useCallback, useEffect } from "react";
import FileUploadDropzone from "@/components/global/uploader-drop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { formatCpfCnpj, formatDateClassic } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@/context/user";
import { getProfile, getUrlUpload, updateProfile } from "@/app/_actions/settings";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/constants/infra";
import { PhoneInput } from "@/components/ui/phone-input";

export const onUpload = async (url: string, file: File) => {
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!res.ok) throw new Error('');

    return true;
  } catch {
    return false;
  }
};

const uploadImage = async (file: File, userId: string) => {
  const response = await getUrlUpload(file.type, userId);
  if (!response || !response?.url) {
    throw new Error();
  }

  await onUpload(response.url, file);
  return response.url.split('?')[0];
};

export const ProfileTabs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [avatarNow, setAvatarNow] = useState('');
  const [fileTemp, setFileTemp] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [register, setRegister] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [uf, setUf] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const { userId } = useUser();

  const handleEditClick = useCallback(() => {
    setAvatarNow("");
    setFileTemp(null);
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const profileData = await getProfile(userId);
        if (!profileData || !profileData.email) {
          throw new Error();
        }

        setAvatarNow(profileData?.avatar || '');
        setName(profileData?.name || '');
        setEmail(profileData?.email || '');
        setCreatedAt(profileData?.createdAt.toDateString() || '');
        setRegister(profileData?.register || '');
        setCity(profileData?.city || '');
        setPhone(profileData?.phone || '');
        setUf(profileData?.uf || '');
        setZipcode(profileData?.zipcode || '');
        setAddress(profileData?.address || '');
        setNeighborhood(profileData?.neighborhood || '');
      } catch {
        toast('Erro Inesperado', { description: 'Não foi possível buscar os dados do seu perfil, tente novamente mais tarde!' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const onSubmit = async () => {
    if (!userId) return;

    try {
      let profileImageID = avatarNow;
      if (fileTemp) {
        profileImageID = await uploadImage(fileTemp, userId);
        setAvatarNow(profileImageID);
      }

      const upt = await updateProfile(profileImageID, name, register, city, phone, uf, zipcode, address, neighborhood, userId);
      if (!upt) {
        throw new Error();
      }

      toast('Alterações Salvas', { description: 'As alterações foram salvas com sucesso!' });
    } catch {
      toast('Erro Inesperado', { description: 'Não foi possível atualizar os dados do seu perfil, tente novamente mais tarde!' });
    }
  };

  const avatarSrc = fileTemp ? URL.createObjectURL(fileTemp) : avatarNow;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(90vh-50px)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-3/5 mt-4">
      {avatarSrc ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-48 h-48 rounded-full border overflow-hidden">
            <Image
              src={avatarSrc}
              alt="User Avatar"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <Button
            variant="style"
            className="justify-items-center border"
            onClick={handleEditClick}
          >
            Remover
          </Button>
        </div>
      ) : (
        <div className="grid w-full items-center gap-1.5 mb-11">
          <FileUploadDropzone
            maxFiles={1}
            multiple={false}
            maxSize={2 * 1024 * 1024}
            accept={{ "image/*": [".jpg", ".jpeg"] }}
            onFilesChange={(files) => files && setFileTemp(files[0])}
          />
        </div>
      )}
      <div className="space-y-4 w-full mt-4">
        <div className="flex flex-row w-full gap-2">
          <div className="grid w-2/3 items-center gap-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} type="name" id="name" />
          </div>
          <div className="grid w-1/3 items-center gap-1.5">
            <Label htmlFor="createdAt">Criado em</Label>
            <Input defaultValue={formatDateClassic(createdAt)} disabled id="createdAt" />
          </div>
        </div>
        <div className="flex flex-row w-full gap-2">
          <div className="grid w-1/2 items-center gap-1.5">
            <Label htmlFor="register">CPF/CNPJ</Label>
            <Input 
              id="register" 
              type="text" 
              maxLength={18} 
              value={register}
              onChange={(e) => setRegister(formatCpfCnpj(e.target.value))} 
            />
          </div>
          <div className="grid w-1/2 items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input defaultValue={email} disabled type="email" id="email" />
          </div>
        </div>
        <div className="flex flex-row w-full gap-2">
          <div className="grid w-1/3 items-center gap-1.5">
            <Label htmlFor="city">Cidade</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} type="text" id="city" />
          </div>
          <div className="grid w-1/3 items-center gap-1.5">
            <Label htmlFor="phone">WhatsApp</Label>
            <PhoneInput id="phone" maxLength={17} defaultCountry='BR' value={phone} onChange={(value) => setPhone(value)} />
          </div>
          <div className="grid w-1/10 items-center gap-1.5">
            <Label htmlFor="uf">UF</Label>
            <Select value={uf} onValueChange={(value) => setUf(value)}>
              <SelectTrigger className="w-full border dark:border-neutral-700 border-neutral-300 bg-neutral-100 dark:bg-neutral-900 shadow-md">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="h-48">
                {states.map((item) =>
                  <SelectItem key={`item-${item}`} value={item}>{item}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-1/3 items-center gap-1.5">
            <Label htmlFor="zipcode">Código postal</Label>
            <Input value={zipcode} onChange={(e) => setZipcode(e.target.value)} type="number" min={0} max={99999999} id="zipcode" />
          </div>
        </div>
        <div className="flex flex-row w-full gap-2">
          <div className="grid w-3/4 items-center gap-1.5">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} type="text" id="address" />
          </div>
          <div className="grid w-1/4 items-center gap-1.5">
            <Label htmlFor="neighborhood">Setor/bairro</Label>
            <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} type="text" id="neighborhood" />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-5">
        <Button
          variant="style"
          onClick={onSubmit}
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};
