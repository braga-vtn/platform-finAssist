import React, { useState, useCallback, useEffect } from "react";
import FileUploadDropzone from "@/components/global/uploader-drop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { formatDateClassic } from "@/lib/utils";
import { toast } from "sonner";

const defaultProfile = {
  name: 'Matheus Braga',
  email: 'matheusbr722@gmail.com',
  avatar: '',
  createdAt: '2025-02-21 18:59:38',
};

export const ProfileTabs = () => {
  const [name, setName] = useState(defaultProfile.name);
  const [email, setEmail] = useState(defaultProfile.email);
  const [createdAt, setCreatedAt] = useState(defaultProfile.createdAt);
  const [avatarNow, setAvatarNow] = useState(defaultProfile.avatar);
  const [fileTemp, setFileTemp] = useState<File | null>(null);

  const handleEditClick = useCallback(() => {
    toast('Foto Deletada', {description: 'A sua foto de perfil foi deletada com sucesso!'});
    setAvatarNow("");
    setFileTemp(null);
  }, []);

  useEffect(() => {
    setEmail('');
    setCreatedAt('');
  }, []);

  const onSubmit = () => {
    toast('Alterações Salvas', {description: 'As alterações foram salvas com sucesso!'});
  };

  const avatarSrc = fileTemp ? URL.createObjectURL(fileTemp) : avatarNow;

  return (
    <div className="w-3/5 mt-4">
      {avatarSrc ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-48 h-48 rounded-full overflow-hidden">
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
