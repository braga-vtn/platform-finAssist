import React, { useState, useCallback, useEffect } from "react";
import FileUploadDropzone from "@/components/global/uploader-drop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { formatDateClassic } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@/context/user";
import { getProfile, getUrlUpload, updateProfile } from "@/app/_actions/settings";
import { Spinner } from "@/components/ui/spinner";

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
      } catch {
        toast('Erro Inesperado', { description: 'Não foi possível buscar os dados do seu perfil, tente novamente mais tarde!' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const onSubmit = async() => {
    if (!userId) return;

    try {
      let profileImageID = avatarNow;
      if (fileTemp) {
        profileImageID = await uploadImage(fileTemp, userId);
        setAvatarNow(profileImageID);
      }

      const upt = await updateProfile(profileImageID, name, userId);
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
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input defaultValue={email} disabled type="email" id="email" />
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
