import type { Metadata } from "next";
import { Montserrat } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/user";

export const metadata: Metadata = {
  title: "FinAssist",
  description: "Gerencie clientes e boletos, com integração ao Whatsapp, Email e o banco Inter. De forma prática e rápida!",
};

const font = Montserrat({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.className}>
      <body className='select-text selection:bg-neutral-200 dark:selection:bg-neutral-800 bg-neutral-100 dark:bg-neutral-950 focus:outline-none focus-visible:outline-none'>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <UserProvider>
            {children}
          </UserProvider>
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
