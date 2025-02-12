'use client';
import { useEffect } from 'react';
import './globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/components/auth-provider';
import type { ChatbotConfig } from '@/types/global';
import { ChatWidget } from '@/components/ChatWidget';
import {Toaster} from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter, Montserrat } from 'next/font/google'

// Initialize the fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* Your existing head content */}
      </head>
      <body>
        <Toaster />
        <ThemeProvider>
        <SessionProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-800 font-serif">
          <main>{children}</main>
          <Toaster />
        </div>
        </SessionProvider>
        </ThemeProvider>
        <ChatWidget />
      </body>
    </html>
  );
}