'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserProviderProps {
  admin: boolean;
  setAdmin: (_value: boolean) => void;
  userId: string | null;
  setUserId: (_userId: string) => void;
  name: string;
  setName: (_value: string) => void;
  email: string;
  setEmail: (_value: string) => void;
  avatar: string | null;
  setAvatar: (_url: string | null) => void;
}

const UserProviderContext = createContext<UserProviderProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }): React.JSX.Element => {
  const [admin, setAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);

  return (
    <UserProviderContext.Provider value={{ admin, setAdmin, userId, setUserId, name, setName, email, setEmail, avatar, setAvatar }}>
      {children}
    </UserProviderContext.Provider>
  );
};

export const useUser = (): UserProviderProps => {
  const context = useContext(UserProviderContext);

  if (!context) {
    return {
      admin: false,
      setAdmin: () => { },
      userId: null,
      setUserId: () => { },
      name: '',
      setName: () => { },
      email: '',
      setEmail: () => { },
      avatar: null,
      setAvatar: () => { },
    };
  }

  return context;
};
