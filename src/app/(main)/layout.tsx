'use client';
import { JSX, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sidebar, SidebarAccount, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ItemSidebar } from '@/constants/infra';
import { ToogleTheme } from '@/components/global/toogle-theme';
import { Container } from '@/components/global/container';
import { usePathname } from 'next/navigation';
import { accountsSidebar } from '@/constants/faker';

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props): JSX.Element => {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="w-screen h-screen flex flex-col justify-between items-center dark:bg-neutral-950 bg-neutral-50">
      </div>
    );
  }

  return (
    <div
      key='sidebar'
      className={cn(
        'flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 overflow-hidden',
        'h-screen'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>  
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {ItemSidebar.map((item) => (
                <SidebarLink key={`${item.id}-${item.label}`} link={item} isActive={pathname.includes(item.href)} />
              ))}
            </div>
          </div>
          <div>
            <SidebarAccount accounts={accountsSidebar}/>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        <div className="p-2 md:p-10 border-l border-t border-neutral-200 dark:border-neutral-700 rounded-tl-2xl bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
          <Container>
            {children}
          </Container>
        </div>
      </div>
    </div>
  );
};

export const Logo = (): React.JSX.Element => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="w-5 h-5 bg-black dark:bg-white rounded-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-row w-full items-center justify-between font-medium text-black dark:text-white whitespace-pre"
      >
        FinAssist
        <ToogleTheme />
      </motion.span>
    </Link>
  );
};

export const LogoIcon = (): React.JSX.Element => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="w-5 h-5 bg-black dark:bg-white rounded-sm flex-shrink-0" />
    </Link>
  );
};

export default Layout;