'use client';

import Link, { LinkProps } from 'next/link';
import React, { useState, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ChevronsUpDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from './command';
import { Avatar, AvatarImage } from './avatar';

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = (): SidebarContextProps => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}): React.JSX.Element => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;

}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>): React.JSX.Element => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>): React.JSX.Element => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        'h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0',
        className
      )}
      animate={{
        width: animate ? (open ? '300px' : '60px') : '300px',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>): React.JSX.Element => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          'h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full'
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className={cn(
                'fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between',
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  isActive = false,
  className,
  ...props
}: {
  link: Links;
  isActive?: boolean;
  className?: string;
  props?: LinkProps;
}): React.JSX.Element => {
  const { open, animate } = useSidebar();
  const router = useRouter();

  const onRedirect = () => {
    router.push('/auth/sign-in');
  };

  if (!link.href) {
    return (
      <span onClick={onRedirect} className='flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer'>
        <span className='text-neutral-500'>{link.icon}</span>
        <motion.span
          animate={{
            display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className='text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 text-neutral-500'
        >
          {link.label}
        </motion.span>
      </span >
    );
  }

  return (
    <Link
      href={link.href}
      className={cn(
        'flex items-center justify-start gap-2 group/sidebar py-2',
        className
      )}
      {...props}
    >
      <span className={cn(isActive ? 'text-current' : 'text-neutral-500')}>{link.icon}</span>
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn('text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0', isActive ? 'text-current' : 'text-neutral-500')}
      >
        {link.label}
      </motion.span>
    </Link>
  );
};

type Accounts = {
  id: string;
  type: string;
  name: string;
  avatar: string;
};

export const SidebarAccountItem = ({
  account,
  selected = false,
  onClick,
}: {
  account: Accounts;
  selected?: boolean;
  onClick?: () => void;
}): React.JSX.Element => {
  const { open, animate } = useSidebar();

  return (
    <div
      className='flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer'
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage className="h-7 w-7 flex-shrink-0 rounded-full" src={account.avatar} />
      </Avatar>
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className={cn('text-sm text-current group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0')}
      >
        {account.name}{account.type === 'member' && ' - Membro'}
      </motion.span>
      {selected && (
        <motion.span
          animate={{
            display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
        >
          <CheckIcon className="h-4 w-4 text-neutral-500" />
        </motion.span>
      )}
    </div>
  );
};

export const SidebarAccount = ({
  accounts,
}: {
  accounts: Accounts[];
}): React.JSX.Element => {
  const [selectedAccount, setSelectedAccount] = useState<Accounts>(accounts[0]);
  const { open } = useSidebar();
  const [ accountClick, setAccountClick ] = useState(false);

  const handleSelectAccount = (account: Accounts) => {
    setSelectedAccount(account);
    setAccountClick(false);
  };

  return (
    <Popover open={accountClick} onOpenChange={(value) => setAccountClick(value)}>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <SidebarAccountItem account={selectedAccount} />
          {open && <ChevronsUpDown className="h-4 w-4 text-neutral-500 shrink-0 opacity-50" />}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64" align="start" side="top">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhuma conta encontrada.</CommandEmpty>
            <CommandGroup heading="Todas as contas">
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  onSelect={() => handleSelectAccount(account)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className='flex flex-row gap-2 items-center'>
                      <Avatar>
                        <AvatarImage className="h-7 w-7 flex-shrink-0 rounded-full" src={account.avatar} />
                      </Avatar>
                      <span className="text-sm">
                        {account.name}
                      </span>
                    </div>
                    {selectedAccount.id === account.id && (
                      <CheckIcon className="h-4 w-4 text-current" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};